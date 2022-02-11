import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { BanqueService } from '../services/banque.service';
import { ClientService } from '../services/client.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import {
  GridComponent,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { L10n } from '@syncfusion/ej2-base';
import { setCulture } from '@syncfusion/ej2-base';
import { setCurrencyCode } from '@syncfusion/ej2-base';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { CaisseService } from '../services/caisse.service';
import { AppurementReglementComponent } from '../appurement-reglement/appurement-reglement.component';
import { OverlayPanel } from 'primeng/primeng';
import { BrouService } from '../services/brou.service';
import { ExcelService } from '../services/excel.service';

setCulture('en-US');
setCurrencyCode('QAR');
L10n.load({
  'en-US': {
    grid: {
      EmptyRecord: [],
    },
  },
});

@Component({
  selector: 'app-consultation-tresorerie',
  templateUrl: './consultation-tresorerie.component.html',
  styleUrls: ['./consultation-tresorerie.component.scss'],
   providers: [ ExcelService],
})
export class ConsultationTresorerieComponent implements OnInit {
  selectionOptions: SelectionSettingsModel;
  @ViewChild(AppurementReglementComponent) Appurement;
  tn: any;
  datedebut: Date;
  disabled;
  datefin: Date;

  lignesselectionnesgrid2 = new Array();
  lignesselectionnesgrid1 = new Array();
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('gridSelctionnee')
  public gridSelctionnee: GridComponent;
  @ViewChild('op')
  public op: OverlayPanel;

  afficherShow = false;
  pieces = [
    { id: '', label: 'TOUT' },
    { id: 'CH', label: 'CHEQUE' },
    { id: 'TR', label: 'TRAITE' },
    { id: 'VIR', label: 'VIREMENT' },
    { id: 'ESP', label: 'ESPECE' },
  ];

  etatPieces = [
    { id: '', label: 'TOUT' },
    { id: 'A', label: 'Attente' },
    { id: 'F', label: 'Versé au Factoring' },
    { id: 'S', label: 'Versé à l-Escompte' },
    { id: 'V', label: 'Versé à l-Encaissement' },
    { id: 'P', label: 'Encaissé Provisoirement' },
    { id: 'E', label: 'Encaissé Définitivement' },
    { id: 'I', label: 'Impayé' },
  ];
  selectedPiece = null;
  selectedEtatPiece = null;
  codePiece: any;
  titre: string;

  clients: any;
  banques: any;
  selectedClient: any;
  codeClient: string;
  selectedBanque: any;
  codeBanque = '';
  denoBanque: any;
  SelectedItem: any;
  tabtempRechgrid2 = new Array();
  btnvalider: boolean;
  codeEtatPiece: any;
  bordRTR: any;
  bordENC: any;
  bordVER: any;
  typeClt: string;
  display = false;
  datedebutEch = new Date(new Date().getFullYear(), 0, 1);
  dateFinEch = new Date();
  montantRech = '';
  datedebutEchString = this.datedebutEch.toLocaleDateString('en-GB');
  dateFinEchString = this.dateFinEch.toLocaleDateString('en-GB');

  msg: string;
  wasInside = false;
  totalVir = '0.000';
  totalTraite = '0.000';
  totalCheque = '0.000';
  totalEspece = '0.000';
  codeBanque2 = '';

  selectedGridRecords: any[];
  disabled2 = false;
  selectPieceShow = true;
  brouDebit: any[];
  Codeapurement: string;
  brouCredit: any[];
  consultApurShow = false;
  disabledEp = false;
  echTout = '1';
  hiddenEch = true;
  constructor(
    private brouService: BrouService,
    private excelService: ExcelService,
    private clientService: ClientService,
    private config: NgSelectConfig,
    private caisseService: CaisseService,
    private banqueService: BanqueService
  ) {
    this.config.notFoundText = 'aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  onRowUnselect() {
    this.consultApurShow = false;
    this.Codeapurement = null;
    this.grid.selectRows([]);
    this.gridSelctionnee.selectRows([]);

  }





  async close(e) {
    this.display = false;
  }


  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }

  async afficher(e) {
    this.wasInside = true;
    const d1 = this.datedebut.toLocaleDateString('en-GB');
    const d2 = this.datefin.toLocaleDateString('en-GB');
    if (this.echTout === '1') {
      this.datedebutEchString = '';
      this.dateFinEchString = '';
      } else {
        this.datedebutEchString = this.datedebutEch.toLocaleDateString('en-GB');
        this.dateFinEchString = this.dateFinEch .toLocaleDateString('en-GB');
      }

    let b_v = '';

    if (this.bordVER !== null) {
      b_v = this.bordVER;
    }
    let b_e = '';
    if (this.bordENC !== null) {
      b_e = this.bordENC;
    }
    let b_r = '';
    if (this.bordRTR !== null) {
      b_r = this.bordRTR;
    }

    await this.caisseService
    .getListeCaiseTresorerie800(
      d1,
      d2,
      this.codePiece,
      this.codeEtatPiece,
      this.codeBanque,
      this.codeClient,
      b_v,
      b_e,
      b_r,
      this.montantRech,
      this.datedebutEchString,
      this.dateFinEchString


    )
      .toPromise()
      .then((data) => {
        console.log('data  ', data);
        this.lignesselectionnesgrid1 = data['_embedded'].caisses;
      });

    if (this.lignesselectionnesgrid1.length > 0) {
      if (this.lignesselectionnesgrid1.length > 800) {
        this.afficherShow = false;
        this.disabled = false;
        this.disabledEp = false;
        this.msg = 'Veuillez raffiner les critères';
        this.op.show(e);

      } else {
        await this.caisseService
        .getListeCaiseTresorerie(
          d1,
          d2,
          this.codePiece,
          this.codeEtatPiece,
          this.codeBanque,
          this.codeClient,
          b_v,
          b_e,
          b_r,
          this.montantRech,
          this.datedebutEchString,
          this.dateFinEchString


        )
        .toPromise()
        .then((data) => {
          console.log('data  ', data);
          this.lignesselectionnesgrid1 = data['_embedded'].caisses;
        });

        let totTrait = 0;
        let totCheque = 0;
        let totEspec = 0;
        let totVir = 0;
        for (const obj of this.lignesselectionnesgrid1) {
          obj.montant = Number(obj.montant);
          if (obj.mode === 'TRAITE') {
            totTrait = totTrait + obj.montant;
          }

          if (obj.mode === 'CHEQUE' && (obj.sens === 'E' || obj.sens === 'C') ) {
            totCheque = totCheque + obj.montant;
          }
          if (obj.mode === 'ESPECE') {
            totEspec = totEspec + obj.montant;
          }
          if (obj.mode.startsWith('VIR') ) {
            totVir = totVir + obj.montant;
          }
        }

        this.totalCheque = totCheque.toFixed(3);
        this.totalEspece = totEspec.toFixed(3);
        this.totalTraite = totTrait.toFixed(3);
        this.totalVir = totVir.toFixed(3);

           this.disabled = true;
           this.disabledEp = true;



          this.afficherShow = true;



      }

    } else {
      this.msg = 'aucun element trouvé';
      this.op.show(e);
      this.afficherShow = false;
      this.disabled = false;
      this.disabledEp = false;
    }



   /* if (this.affichEnregOp === false && this.lignesselectionnesgrid1.length > 0) {
      this.afficherShow = true;
    } else {
      this.afficherShow = false;
    }*/
  }

  async gererExcel(e) {

    this.wasInside = true;
    const d1 = this.datedebut.toLocaleDateString('en-GB');
    const d2 = this.datefin.toLocaleDateString('en-GB');
    let b_v = '';

    if (this.bordVER !== null) {
      b_v = this.bordVER;
    }
    let b_e = '';
    if (this.bordENC !== null) {
      b_e = this.bordENC;
    }
    let b_r = '';
    if (this.bordRTR !== null) {
      b_r = this.bordRTR;
    }
let listeExcel = new Array();
    await this.caisseService
      .getListeCaiseTresorerie(
        d1,
        d2,
        this.codePiece,
        this.codeEtatPiece,
        this.codeBanque,
        this.codeClient,
        b_v,
        b_e,
        b_r,
        this.montantRech,
        this.datedebutEchString,
        this.dateFinEchString


      )
      .toPromise()
      .then((data) => {
        console.log('data  ', data);
        listeExcel = data['_embedded'].caisses;
      });

    if (listeExcel.length > 0) {
        for (const obj of listeExcel) {
          obj.montant = Number(obj.montant);
        }
        const exportExcel = listeExcel;
        this.excelService.exportAsExcelFile(
          exportExcel,
          'gestion tresorerie  '
        );


    } else {
      this.msg = 'aucun element trouvé';
      this.op.show(e);
      this.afficherShow = false;

      this.selectPieceShow = false;
      this.disabled = false;
      this.disabledEp = false;
    }



   /* if (this.affichEnregOp === false && this.lignesselectionnesgrid1.length > 0) {
      this.afficherShow = true;
    } else {
      this.afficherShow = false;
    }*/
  }


  async apurement() {

    this.brouDebit = new Array();
    this.brouCredit = new Array();
    await this.brouService
    .resulat(this.Codeapurement, 'D')
    .toPromise()
    .then((data) => {
      this.brouDebit = data['_embedded'].brous;
    });
    console.log('brouDebit   ', this.brouDebit);

  await this.brouService
    .resulat(this.Codeapurement, 'C')
    .toPromise()
    .then((data) => {
      this.brouCredit = data['_embedded'].brous;
    });
    console.log('brouCredit   ', this.brouCredit);
    console.log('liste des lignes ', this.selectedGridRecords);
    this.Appurement.fromOutside = true;

    this.Appurement.aficherClient = false;
    this.Appurement.saisieCardShow = true;
    this.Appurement. saisieCardShow1 = true;
    this.Appurement.brouCredit = this.brouCredit ;
    this.Appurement.brouDebit = this.brouDebit ;
      this.display = true;
      this.Appurement. validerShow = false;
      this.Appurement.hiddenNouSais = true;


  }


rowSelected(args: RowSelectEventArgs) {
  if (this.gridSelctionnee.getSelectedRowIndexes()[0] >= 0) {
    const selected: any = this.gridSelctionnee.getSelectedRecords()[0];
    this.SelectedItem = selected;
    this.Codeapurement = this.SelectedItem.apurement;
    // tslint:disable-next-line:max-line-length
    if (this.SelectedItem.etat2 === 'T' &&   this.Codeapurement !== null &&  this.Codeapurement !== undefined &&  this.Codeapurement !== '') {
      this.consultApurShow = true;
    } else {
      this.consultApurShow = false;
    }
    this.Codeapurement = this.SelectedItem.apurement;
  }
}
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  nouvelleSaisie(e) {
    this.disabled = false;
    this.disabledEp = false;
    this.disabled2 = false;
    this.afficherShow = false;
    this.lignesselectionnesgrid1 = new Array();


  }

  init() {

    this.disabled = false;
    this.disabledEp = false;

    this.codeClient = '';
    this.codeEtatPiece = '';

    this.selectedEtatPiece = this.etatPieces[0];
    this.selectedPiece = this.pieces[1];
    this.codePiece = this.selectedPiece .id;
    this.selectedBanque = null;
    this.codeBanque = '';
    this.bordVER = null;
    this.bordENC = null;
    this.bordRTR = null;
    this.lignesselectionnesgrid1 = new Array();
    this.datedebutEch = new Date(new Date().getFullYear(), 0, 1);
    this.dateFinEch = new Date();
    this.montantRech = '';
    this.datedebutEchString = this.datedebutEch.toLocaleDateString('en-GB');
    this.dateFinEchString = this.dateFinEch.toLocaleDateString('en-GB');
    this.echTout = '1';
  }

  changeEcheance() {
    if (this.echTout === '1') {
      this.dateFinEchString = '';
      this.datedebutEchString = '';
      this.hiddenEch = true;


    } else {
     // this.dateFinEchString = '';
    //  this.datedebutEchString = '';
    this.datedebutEchString = this.datedebutEch.toLocaleDateString('en-GB');
    this.dateFinEchString = this.dateFinEch.toLocaleDateString('en-GB');
      this.hiddenEch = false;

    }
  }

  changeEtatPieces() {
    if (
      this.selectedEtatPiece === null ||
      this.selectedEtatPiece === undefined
    ) {
      this.codeEtatPiece = '';
    } else {
      this.codeEtatPiece = this.selectedEtatPiece.id;
    }
  }
  changeClients() {
    if (this.selectedClient === null || this.selectedClient === undefined) {
      this.codeClient = '';
    } else {
      this.codeClient = this.selectedClient.code;
    }
  }

  changePieces() {
    if (this.selectedPiece === null || this.selectedPiece === undefined) {
      this.disabledEp = false;
      this.codePiece = '';
    } else {
      this.codePiece = this.selectedPiece.id;
      if (this.codePiece === 'VIR' || this.codePiece === 'ESP' ) {
        this.selectedEtatPiece = this.etatPieces[6];
        this.disabledEp = true;
      } else {
        this.disabledEp = false;
      }
    }

  }
  public onSearchPiece(word: string, item): boolean {
    return item.label.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchClient(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchBanque(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  changeBanque() {
    if (this.selectedBanque !== null && this.selectedBanque !== undefined) {
      this.codeBanque = this.selectedBanque.code;
      this.denoBanque = this.selectedBanque.deno;
    } else {
      this.codeBanque = '';
      this.denoBanque = '';
    }
  }



  async ngOnInit() {
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick' };
    this.display = false;
    this.tn = {
      firstDayOfWeek: 1,
      dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
      ],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
      monthNames: [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre',
      ],
      monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Avr',
        'Mai',
        'Jun',
        'Jul',
        'Aou',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy',
    };
    await this.clientService
      .getClientsListOrdByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
    await this.banqueService
      .getBanque()
      .toPromise()
      .then((data) => {
        console.log(data);
        this.banques = data['_embedded'].banque;
        console.log(this.banques);
      });
      this.selectedPiece = this.pieces[1];
      this.codePiece = this.selectedPiece .id;
      this.selectedEtatPiece = this.etatPieces[0];

     this.codePiece = 'CH';
    this.codeEtatPiece = '';
    this.codeBanque = '';
    this.codeClient = '';
    this.bordRTR = null;
    this.bordENC = null;
    this.bordVER = null;
    this.datefin = new Date();
    this.datedebut = new Date(new Date().getFullYear(), 0, 1);
    // this.lignesselectionnesgrid1 = this.clients;
  }














}
