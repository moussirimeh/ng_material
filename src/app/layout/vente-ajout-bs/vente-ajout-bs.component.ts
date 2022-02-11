import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Elivraison } from '../services/elivraison';
import { Livreur} from '../services/livreur';
import { LivreurService } from '../services/livreur.service';
import { ElivraisonService } from '../services/elivraison.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import { Message } from 'primeng/components/common/api';

import { LoginService } from 'src/app/login/login.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-vente-ajout-bs',
  templateUrl: './vente-ajout-bs.component.html',
  styleUrls: ['./vente-ajout-bs.component.scss'],
  providers: [MessageService]
})
export class VenteAjoutBSComponent implements OnInit {
  @ViewChild('ngs') ngs: NgSelectComponent;

  @ViewChild('ongs')
  public ongs: OverlayPanel;



  livreurs: Livreur[];
  elivraisons: Elivraison[];
  numero: string;
  date: string;
  SelectedLivreur;
  wasInside: boolean;
  text: string;
  tailleAttribut;
  bsajoutee;
  msgs: Message[] = [];

  readonly = true;

  msgerror: string;
     constructor(private livreurService: LivreurService ,
     private elivraisonService: ElivraisonService,
     private messageService: MessageService,
     private loginService: LoginService,
     private config: NgSelectConfig

     ) {
       this.config.notFoundText = 'Aucun élément trouvé';
       this.config.clearAllText = 'Supprimer tous ';
     }

  elivraison: Elivraison = {
    id: null,
    numero: null,
    dated: '',
    datef: null,
    livreur: '',
    camuion: ''
  };
  fermertoast;

  public onSearch(word: string, item: Livreur): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}



@HostListener('document:click')
      clickout() {
        if (!this.wasInside) {
          this.messageService.clear();
          this.ongs.hide();
        }
        this.wasInside = false;
      }

NumeroChaine_0TailleBD(taille: number , numero: string): string {
          let chaine_0 = '';
          let ChaineNumero;
            const taillechaine_0 = taille - numero.length;
            for (let i = 0 ; i < taillechaine_0 ; i++) {
                chaine_0 = chaine_0 + '0';
            }
            ChaineNumero = chaine_0 + numero;
      return ChaineNumero ;
}
setFocus = () => {
  this.ngs.focus();
}

  async ngOnInit() {
    this.reloadDataArts();
     }
  async reloadDataArts() {
    // recuperer la liste des livreurs pour afficher les noms
          await this.livreurService
            .getlivreursList()
            .toPromise()
            .then(data => {
              this.livreurs = data['_embedded'].livreurs;

            });
    // recuperer le max du numero pour Elivraison

            await this.elivraisonService
            .getLenghthAttribut()
            .toPromise()
            .then(data => {
              this.tailleAttribut = data.toString();
          //  console.log('numero tailleAttribut ', this.tailleAttribut);
            });

              await this.elivraisonService
              .getMaxId()
              .toPromise()
              .then(data => {
                this.numero = data.toString();

                if (this.numero === 'null') {
                  this.numero = '';
                } else {
                  this.elivraison.numero = this.NumeroChaine_0TailleBD(this.tailleAttribut, this.numero);
                }
            // console.log('numero bs ', this.elivraison.numero);
                  });
          // recuperer la date systeme
        this.date = new Date().toLocaleDateString('en-GB');
        this.elivraison.dated = this.date;

  }

  async Valider(e) {
        this.wasInside = true;
        this.messageService.clear();
        // verifier le donness
       // this.ongs.show(e, document.getElementById('ngs'));
        if (String(this.SelectedLivreur) === 'null' || String(this.SelectedLivreur) === '' || this.SelectedLivreur === undefined  ) {
          this.setFocus();
          document.getElementById('ngs').focus();
          this.msgerror = 'Veuillez choisir un livreur';
          this.ongs.show(e, document.getElementById('ngs'));
        } else {
            this.elivraison.livreur = this.SelectedLivreur;

            console.log('livreur ',  this.elivraison.livreur);
             // verifier le champ numero du camion
          if ( (this.elivraison.camuion !== '')  &&  ( this.elivraison.camuion.length <= 15 ) ) {
            this.elivraison.camuion = this.elivraison.camuion;
            // ajouter un bon de sortie
            this.elivraison.dated = new Date().toLocaleDateString('en-GB');
            await this.elivraisonService
            .createElivraison(this.elivraison)
            .toPromise()
            .then(data => {
              this.ongs.hide();
             this.bsajoutee = data.numero;
             this.messageService.add({severity: 'success',
             summary: '',
             detail: ' bon de sortie ouvert avec succès: son numero est ' + this.bsajoutee});
              console.log('req ajout ', data);
              this.reloadDataArts();
              this.SelectedLivreur = null;
              this.elivraison.camuion = '';
       });
                // MOOOOOOOOOOCHAR
                const codeUtil = localStorage.getItem('login');
                const moduteName = globals.selectedMenu;
                const paramMouchar = 'N° ' + this.bsajoutee;
                this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
                .then((data) => {
                  console.log(data);
                });
          } else {

             document.getElementById('cam').focus();
             this.msgerror = 'verifiez numero du camion : max 15 caractères !';
             this.ongs.show(e, document.getElementById('cam'));
             this.elivraison.camuion = '';

          }
        }

      }
}
