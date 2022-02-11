import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { BrouService } from '../services/brou.service';
import { ClientService } from '../services/client.service';
import { Client } from '../services/client';
import { ExcelService } from '../services/excel.service';
import {
  GridComponent,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';


import { AppurementReglementComponent } from '../appurement-reglement/appurement-reglement.component';
import { ReglementClientService } from '../services/reglementClient.service';
import { ReglementClient } from '../services/reglementClient';
import { ClientContService } from '../services/clientCont.service';
import { setCurrencyCode } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { BrouContService } from '../services/brouCont.service';
import { ReglementClientContService } from '../services/reglementClientCont.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { globals } from 'src/environments/environment';

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
  selector: 'app-historique-reg-clts',
  templateUrl: './historique-reg-clts.component.html',
  styleUrls: ['./historique-reg-clts.component.scss'],
  providers: [  ExcelService]
})
export class HistoriqueRegCltsComponent implements OnInit {
  @ViewChild(AppurementReglementComponent) Appurement;
  public mode: string;
  @ViewChild('grid')
  public grid: GridComponent;

  display = false;

  hiddenNouvSaisie = false;

  ngselectDisabled = false;
  clients: Client[] = [];

  apurementshow = false;

  totalDebit = '0.000';
  totalCredit = '0.000';
  histNombreIMP = '0';
  histTotalIMP = '0.000';
  nombreIMP = '0';
  totalIMP = '0.000';
  solde = '0.000';
  credit: number;
  debit: number;


  champDisabled = true;

  listeBrou = new Array();
  selectedClient;




  afficherShow = false;




//  regle =
  codeClient = '';
  showCard1 = false;

  showNvSaisie = false;
  typeClt = 'N';

  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  styleOvPanelError = {
    'text-align': 'center',
    'font-size': '14px',
    'background-color': ' #f8b7bd',
  };
  styleOvPanelSuccess = {
    'text-align': 'center',
    'font-size': '12px',
    'background-color': ' #b7d8b7',
  };
  appercuShow = false;
  datedeb = new Date();
  datedebut = new Date (1973 , 0, 1 );
  datefin = new Date ();
  regle = 'tout';
  styleOvPanel = {};
  tn: any;
  ListBrous = new Array();
  listeBrous = new Array();
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(
    private excelService: ExcelService,
    private brouService: BrouService,
    private reglementService: ReglementClientService,
    private reglementContService: ReglementClientContService,
    private clientService: ClientService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  NouvelleSaisie(): void {

    this.totalCredit = null;
    this.totalDebit = null;
    this.solde = null;
    this.histNombreIMP = null;
    this.histTotalIMP = null;
    this.nombreIMP = null;
    this.totalIMP = null;
    this.ngselectDisabled = false;

    this.champDisabled = true;
    this.apurementshow = false;
    this.codeClient = '';
    if (this.selectedClient !== null && this.selectedClient !== undefined) {
      this.afficherShow = true;
      this.codeClient = this.selectedClient.code;
    } else {
      this.afficherShow = false;
      this.codeClient = '';
    }

    this.showCard1 = false;
    this.listeBrous = new Array();
    this.ListBrous = new Array();
  }
  async  apurement() {
    this.Appurement.clients = this.clients;
    if (this.typeClt === 'N') {
    this.Appurement.var = 1;
  } else {
    this.Appurement.var = 2;
  }
    this.Appurement.selectedDebit = null;
    this.Appurement.selectedCredit = null;
    this.Appurement.selectedClient = this.selectedClient;
    this.Appurement.codeClient = this.selectedClient.code;
    this.Appurement.sensCredit = 'C';
    this.Appurement.sensDebit = 'D';
    this.Appurement.fromOutside = true;
    await this.Appurement.afficher();
    this.display = true;
    this.Appurement. hiddenNouSais = true;
  }

  async close(e) {
    if (this.typeClt === 'N') {
      await this.ListBrou(e);
    } else {
     // await this.ListBrouCont();
    }
  }

  changeClients() {
    this.ov.hide();
    if (this.selectedClient === null || this.selectedClient === undefined) {
      this.codeClient = '';
      this.afficherShow = false;
      this.appercuShow = false;
    } else {
      this.appercuShow = true;
      this.afficherShow = true;
      this.codeClient = this.selectedClient.code;
    }
  }

  async ngOnInit() {
    this.appercuShow = false;

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
      this.clients = new Array();
      await this.clientService
      .getClientsByTermeOrderByDeno('O')
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }

  async excel(e) {
    await this.ListBrou(e);
    console.log('value regle ', this.regle);

    this.listeBrous = this.ListBrous;
    if (this.listeBrous.length > 0) {
      try {

          const exportExcel = this.listeBrous;
          this.excelService.exportAsExcelFile(
            exportExcel,
            ' historique reg clt : ' + new Date().toLocaleDateString('en-GB')
          );
        } catch {
        console.log(' methode genererExcel');
      }
    } else {
      this.styleOvPanel = this.styleOvPanelError;
      this.msgs = 'Aucun reglement trouvé ! ';
      this.ov.show(e);
    }

  }

  async ListBrou(e) {
    this.ListBrous = new Array();
    // const from = '01/01/2010';
    const from =  this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
 switch (this.regle) {
   case 'tout' : await this.brouService.getHistoriqueRegClt(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
     this.ListBrous = data['_embedded'].brous;
   });
   break;
   case 'regle' : {
     await this.brouService.getHistoriqueRegCltApure(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
    this.ListBrous = data['_embedded'].brous;
   });
  }
   break;
   case 'nonRegle' : await this.brouService.getHistoriqueRegCltNonApure(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
     this.ListBrous = data['_embedded'].brous;
   });
   break;
   default: console.log('erreur methode ListBrou() ', );
 }
 if (this.ListBrous.length > 0) {
   let totImp = 0;
   let NbreImp = 0;
   let totDebit = 0;
   let totCredit = 0;
  for (const obj of this.ListBrous ) {
    if (String(obj.piece).startsWith('IMP/')) {
      NbreImp = NbreImp + 1;
      totImp = totImp + Number(obj.montant);
    }
    if (obj.sens === 'D') {

      obj.montant = obj.montant;
      totDebit = totDebit + Number(obj.montant);
      // Number(obj.montant);
      obj.code = '';
    } else {
      obj.code = obj.montant;
      totCredit = totCredit + Number(obj.montant);
      // Number(obj.montant);
      obj.montant = '';
    }
    if (obj.regle === 'R') {
      obj.regle = 'Oui';
    } else {
      obj.regle = 'Non';
    }

  }
  this.solde = Number( totDebit - totCredit ).toFixed(3);
  this.totalDebit = totDebit.toFixed(3);
  this.totalCredit = totCredit.toFixed(3);
  this.totalIMP = totImp.toFixed(3);
  this.histNombreIMP = NbreImp.toFixed();
}



  }

async afficher(e) {
  this.wasInside = true;
    this.listeBrous = new Array();
    await this.ListBrou(e);
    console.log('value regle ', this.regle);

    this.listeBrous = this.ListBrous;
    if (this.listeBrous.length > 0) {
      this.ngselectDisabled = true;
      this.afficherShow = false;
      this.showCard1 = true;
      this.showNvSaisie = true;
      this.apurementshow = true;
    } else {
      this.styleOvPanel = this.styleOvPanelError;
      this.msgs = 'Aucun reglement trouvé ! ';
      this.ov.show(e);
    }
    console.log('liste brou afficher  ', this.ListBrous );

  }

  public onSearchClientParCode(word: string, item: Client): boolean {
    return item.code.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }


  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async apercu(e) {
    this.wasInside = true;
    this.ov.hide();
    // tslint:disable-next-line:prefer-const
    let sste = globals.societe;
     const datee = new Date();
     const date = datee.toLocaleDateString('en-GB');
     await this.ListBrou(e);

    this.listeBrous = this.ListBrous;
    if (this.listeBrous.length > 0) {
      const doc1 = new jspdf();
      // page a4 (210 x 297 mm)
      let numPage = 1;
      doc1.setFontSize(10);
      doc1.setFontStyle('arial');
      doc1.text('SOCIETE  :   ' + sste, 10, 10);
      doc1.text( 'Tunis le :    ' + date, 147, 12 );



      doc1.setFontSize(14);
      doc1.setFontStyle('arial');
      doc1.text('Historique règlements des Clients', 60, 20);

      doc1.setFontSize(10);
      doc1.text('Date Debut:        ' + this.datedebut.toLocaleDateString('en-GB'), 10, 26);
      doc1.text('Date fin :         ' + this.datefin.toLocaleDateString('en-GB'), 60, 26);

      doc1.text('Code Client : ' + this.selectedClient.code, 10, 32);
      doc1.text('Raison Sociale : ' + this.selectedClient.deno, 60, 32);



      doc1.setFontStyle('bold');
      doc1.line(10, 35, 200, 35);
      // ligne Horizontal doc1.line(x1,y1,x2,y2)

      doc1.text('Date', 10, 39);
      doc1.text('Pièce', 37, 39);
      doc1.text('Numéro', 66, 39);
      doc1.text('Mnt Débit', 92, 39);
      doc1.text('Mnt Crédit', 122, 39);
      doc1.text('Regle', 144, 39);
      doc1.text('Libelle', 160, 39);
      doc1.line(10, 42, 200, 42);
      doc1.setFontStyle('normal');
      let y = 47;
      const total = 0;
      for (const br of this.listeBrous) {
        doc1.text(br.date, 10, y);
        doc1.text(br.piece, 37, y);
        if (br.numero !== null) {
          doc1.text(br.numero, 67, y);
        } else {
          doc1.text('', 67, y);
        }
        doc1.text(br.montant, 107, y, 'right');
        doc1.text(br.code, 139, y, 'right');

        if (br.apurement !== null) {
          doc1.text('R', 146, y);
        } else {
          doc1.text('', 146, y);
        }
        if (br.libelle !== null) {
          doc1.text(br.libelle, 160, y);
        } else {
          doc1.text('', 160, y);
        }
        y = y + 7;
        if (y > 277) {
          doc1.line(10, y - 3, 200, y - 3, 'FD');
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
          numPage++;
          doc1.addPage();
          doc1.setFontStyle('bold');
          doc1.line(10, 20, 200, 20);
          // ligne Horizontal doc1.line(x1,y1,x2,y2)

          doc1.text('Date', 10, 24);
          doc1.text('Pièce', 37, 24);
          doc1.text('Numéro', 66, 24);
          doc1.text('Mnt Débit', 92, 24);
          doc1.text('Mnt Crédit', 122, 24);
          doc1.text('Regle', 144, 24);
          doc1.text('Libelle', 160, 24);

          doc1.line(10, 27, 200, 27);
          doc1.setFontStyle('normal');
          y = 32;
        }
      }
      doc1.line(10, y - 3, 200, y - 3, 'FD');
      doc1.setFontStyle('bold');
      doc1.text('Totaux : ' , 60, y + 3);
      doc1.text(this.totalDebit, 115, y + 3, 'right');
      doc1.text(this.totalCredit, 147, y + 3, 'right');
      doc1.text('Solde :' , 165, y + 3);
      doc1.text(this.solde, 200, y + 3, 'right');
      doc1.setFontStyle('normal');
      doc1.text('Page ' + numPage.toFixed(0), 100, 289);
      window.open(doc1.output('bloburl'), '_blank');
    } else {
      this.styleOvPanel = this.styleOvPanelError;
      this.msgs = 'Aucun reglement trouvé ! ';
      this.ov.show(e);
    }
    // const displayDate = new Date().toLocaleDateString('en-GB');
    // const displayTime = new Date().toLocaleTimeString();

  }




}
