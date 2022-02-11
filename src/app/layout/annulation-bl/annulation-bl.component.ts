import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
} from '@angular/core';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { MessageService } from 'primeng/api';
import {
  GridComponent,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ConfirmationService, OverlayPanel } from 'primeng/primeng';
import { MouveService } from '../services/mouve.service';
import { RecettesService } from '../services/recettes.service';
import { TermeService } from '../services/terme.service';
import { StockService } from '../services/stock.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { ClientService } from '../services/client.service';

import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';

setCulture('fr-FR');
L10n.load({
  'fr-FR': {
    grid: {
      EmptyRecord: ' ',
      EmptyDataSourceError: ' ',
    },
  },
});

@Component({
  selector: 'app-annulation-bl',
  templateUrl: './annulation-bl.component.html',
  styleUrls: ['./annulation-bl.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class AnnulationBLComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;
  msgerror: string;
  @ViewChild('grid')
  public grid: GridComponent;
  numero: string;
  nbLigne;
  wasInside: boolean;
  blockedDocument = false;
  afficherClicked = false;
  editEnable = false;
  readonly = false;
  msgnumero;
  elements = [];
  blData = null;
  client: any = {};
  vendeur;
  constructor(
    private mouveService: MouveService,
    private stockService: StockService,
    private recettesService: RecettesService,
    private termeService: TermeService,
    private clientService: ClientService,
    private vendeurService: Vendeur1Service,
    private messageService: MessageService,
    private config: NgSelectConfig,
    private loginService: LoginService,
    private confirmationService: ConfirmationService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
  }
  nb: number;
  etat;
  public customAttributes: Object;
  async ngOnInit() {
    this.customAttributes = { class: 'customcss' };
    this.afficherClicked = false;
    this.editEnable = false;
    this.readonly = false;
    setTimeout(() => {
      document.getElementById('num').focus();
    }, 10);
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.messageService.clear();
      this.op.hide();
    }
    this.wasInside = false;
  }

  nouvelleSaisie() {
    // this.afficherClicked = false;
    // this.readonly = false;
    this.numero = null;
    // setTimeout(() => {
    //   document.getElementById('num').focus();
    // }, 10);
    this.ngOnInit();
  }

  verifierNumero() {
    this.messageService.clear();
    this.op.visible = false;
    const num: string = String(this.numero);
    this.numero = num;

    if (this.numero === 'null') {
      this.numero = '';
    } else {
      switch (this.numero.length) {
        case 1: {
          this.numero = '0000' + this.numero;
          break;
        }
        case 2: {
          this.numero = '000' + this.numero;
          break;
        }
        case 3: {
          this.numero = '00' + this.numero;
          break;
        }
        case 4: {
          this.numero = '0' + this.numero;
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  async getByNumero(e) {
    this.blockedDocument = true;
    this.messageService.clear();
    this.readonly = true;
    this.verifierNumero();
    // recuperer bon de livraison selon numero
    await this.recettesService
      .getRecettesByCombine('B/L      ' + this.numero)
      .toPromise()
      .then((data) => {
        this.blData = data['_embedded'].recettes[0];
      });
    // si bon de livraison inéxistant
    if (this.blData === undefined) {
      this.msgerror = 'Bon de livraison inéxistant !';
      this.op.show(e, document.getElementById('num'));
      this.readonly = false;
    } else if (this.blData.gel === 'I') {
      await this.termeService
        .findFactureByBL('B/L      ' + this.numero)
        .toPromise()
        .then((data) => {
          this.msgerror =
            'Ce Bon de livraison est facturé, Facture N° ' + data + ' !';
        });
      this.op.show(e, document.getElementById('num'));
      this.readonly = false;
    } else {
      // gestion des evennements
      this.afficherClicked = true;
      this.editEnable = true;
      this.readonly = true;

      // recupérer la liste des mouvements selon numero du bon de livraison s'il n'est pas facturé
      await this.mouveService
        .getMouveBLEnCours('B/L      ' + this.numero)
        .toPromise()
        .then((data) => {
          this.elements = data['_embedded'].mouveBLEnCourses;
        });
      // ajouter total brut au elements
      this.elements.map((element) => {
        element.quantite = Number(element.quantite);
        element.tRemise = Number(element.tRemise);
        element.tauxTva = Number(element.tauxTva);
        element.prix = Number(element.prix);
        element.total = Number(element.prix * element.quantite);

      });
      // recupérer le client
      await this.clientService
        .getClientByCode(this.blData.operateur)
        .toPromise()
        .then((data) => {
          this.client = data['_embedded'].clients[0];
          this.client.marque = Number(this.client.marque);
        });
      // recupérer le vendeur
      await this.vendeurService
        .getVendeur1ByCode(this.blData.vendeur)
        .toPromise()
        .then((data) => {
          this.vendeur = data['_embedded'].vendeur1[0].deno;
        });
    }
    this.blockedDocument = false;
  }

  async Supprimer() {
    // this.blockedDocument = true;
    this.confirmationService.confirm({
      message:
        'La bon de livraison ' +
        this.numero +
        ' sera annulé' +
        '. Voulez-vous confirmer ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        this.wasInside = true;
        this.blockedDocument = true;
        await this.recettesService
          .deleteBL('B/L      ' + this.numero)
          .toPromise()
          .then((nbLigneSupp) => {
            this.nbLigne = nbLigneSupp;
          });

        this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            'ANNUL B/L ' + this.numero
          )
          .subscribe((data) => {
          });
        // raffrechir  la page et afficher un message du succes
        this.numero = null;
        // this.blockedDocument = false;
        // this.afficherClicked = true;
        // setTimeout(() => {
        //   document.getElementById('num').focus();
        // }, 10);
        this.ngOnInit();
        this.blockedDocument = false;
      },
    });
  }
}
