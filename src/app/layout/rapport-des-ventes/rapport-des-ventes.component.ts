import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Stock } from '../services/stock';
import { NgSelectConfig } from '@ng-select/ng-select';
import { SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n} from '@syncfusion/ej2-base';
import { MouveService } from '../services/mouve.service';
import * as jspdf from 'jspdf';
import { SteService } from '../services/ste.service';
import { Ste } from '../services/ste';
import { OverlayPanel } from 'primeng/primeng';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { ExcelService } from '../services/excel.service';
setCulture('fr-FR');
L10n.load({
  'fr-FR': {
    grid: {
      EmptyRecord: ' ',
      EmptyDataSourceError: ' '
    }
  }
});
@Component({
  selector: 'app-rapport-des-ventes',
  templateUrl: './rapport-des-ventes.component.html',
  styleUrls: ['./rapport-des-ventes.component.scss'],
  providers: [ExcelService]
})
export class RapportDesVentesComponent implements OnInit {

  @ViewChild('grid')
  public grid: GridComponent;
  readonlynom = true;
  readonly = true;
  tn: any;
  from: Date;
  to: Date;
  maxDate = new Date();
  minDate = new Date();
  minDate1 = new Date();
  Selectedachat: any;
  clients: any;
  hidden: boolean;
  articles: any ;
  ngselectDisabled = true;
  afficherClicked = false ;
  ste: Ste;
  societe: any;
  SelectedArticle: Stock = {
    id: '',
  code: '',
  design: '',
  quantite: '',
  tva: '',
  prix: '',
  achat: '',
  marge: '',
  operateur: '',
  achatD: '',
  famille: '',
  achatP: '',
  devise: '',
  sfamille: '',
  taxe: '',
  origine: '',
  equiv: '',
  imp: '',
  min: '',
  max: '',
  commQuant: '',
  dPachat: '',
  pInv: '',
  qInv: '',
  agenda: '',
  qtEnt: '',
  emplacement: '',
  nbrC: '',
  nbrCl: '',
  nbrBl: '',
  qtTotal: '',
  ca: '',
  profilCa: '',
  profilTyp: '',
  qteTotal1: '',
  qtTotal1: '',
  };
  SelectedClient: Client = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    respon: '',
    tel: '',
    agence: '',
    banque: '',
    telex: '',
    fax: '',
    cadnat: '',
    compte: '',
    edition: '',
    exonor: '',
    duree: '',
    reg: '',
    terme: '',
    marque: '',
    plafond: '',
    zone: '',
    comm: '',
  assujet: '',
  codeTva: '',
  timbre: '',
  ech: '',
  bloc: '',
  datBlc: '',
  typeC: '',
  regle: '',
  lettre: '',
  codeC: '',
  autor: '',
  eMail: '',
  typeComm: '',
  rec: '',
  vend: '',
  represant: '',
  secteur: '',
  objectif: '',
  nature: '',
  datCreat: '',
  mag:  '',
  respons2:  '',
  adresseusine:  '',
  adressesiege: '',
  gsm1: '',
  gsm2: '',
  nouvMag: '',
  ca123: '',
  respons3: '',
  fonction1: '',
  fonction2: '',
  fonction3: '',
  eMail1: '',
  eMail2: '',
  eMail3: '',
  tel2: '',
  tel3: '',
  gsm3: '',
  codGroupe: '',
  modeReg: '',
  plafondEncours: '',
  indic: '',
  bcExige: '',
  };
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  wasInside: boolean;
  ventes: any;
  lenght = 0;
  codeClt = '';
  codeArticle = '';
  totalHt = 0;

  denoClt = 'Tout';
  denoArticle = 'Tout ' ;
  public searchOptions: SearchSettingsModel;
  public customAttributes: Object;
  ventesTraitement: any ;
  tab_vente: any ;
  valide = false ;
  dateDisabled = false;
  constructor( private clientService: ClientService, private stockService: StockService,
               private steService: SteService, private mouveService: MouveService,
               private excelService: ExcelService,
               private config: NgSelectConfig) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
    const dat = new Date();
   this.from = new Date(dat.getFullYear(), 0, 1);
    this.to = new Date();

}

async excel(e) {
  this.ventes = new Array();
  // affecter deno et code article
  if (this.SelectedArticle !== null) {
    this.codeArticle = this.SelectedArticle.code ;
    this.denoArticle = this.SelectedArticle.design;
  }
  // affecter deno et code Client
  if (this.SelectedClient !== null) {
    this.codeClt = this.SelectedClient.code;
    this.denoClt = this.SelectedClient.deno;
  }
  // les méthodes afficher pour les 4 cas
  if ( (this.SelectedArticle === null ) &&
  (this.SelectedClient === null  ) ) {
    console.log('cas4');
    await this.mouveService.getRapportVente4(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB')).toPromise().then(
      (data) => {
        console.log(data);
        this.ventes = data['_embedded'].rapportVentes;
        this.ventesTraitement =  data['_embedded'].rapportVentes;
        this.lenght = this.ventes.length ;
        console.log(this.ventes);

      }
    );
   } else  if ( (this.SelectedArticle !== null ) &&
  (this.SelectedClient !== null ) ) {
    await this.mouveService.getRapportVente3(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
    this.codeArticle, this.codeClt).toPromise().then(
     (data) => {
       console.log(data);
       this.ventes = data['_embedded'].rapportVentes;
       this.lenght = this.ventes.length ;
       this.ventesTraitement =  data['_embedded'].rapportVentes;
     }
   );
    console.log('cas3');
   } else  if ( (this.SelectedArticle === null ) &&
  (this.SelectedClient !== null  ) ) {
    await this.mouveService.getRapportVente2(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
    this.codeClt).toPromise().then(
     (data) => {
       console.log(data);
       this.ventes = data['_embedded'].rapportVentes;
       this.ventesTraitement =  data['_embedded'].rapportVentes;
       this.lenght = this.ventes.length ;
     }
   );
    console.log('cas2');
   } else   if ( (this.SelectedArticle !== null ) &&
   (this.SelectedClient === null ) ) {
    await this.mouveService.getRapportVente1(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
    this.codeArticle).toPromise().then(
     (data) => {
       console.log(data);
       this.ventes = data['_embedded'].rapportVentes;
       this.ventesTraitement =  data['_embedded'].rapportVentes;
       this.lenght = this.ventes.length ;

     }
   );
     console.log('cas1');
    }

    console.log('data ventes lenght  ', this.ventes );


     // si grid vide
     if (this.ventes.length === 0 ) {
      this.hidden = false;
      this.valide = false ;
      this.ngselectDisabled = true ;
      this.dateDisabled = false;
      this.ventes = null;
      this.ventesTraitement = null;
      this.denoArticle = 'Tout ';
      this.denoClt = 'Tout';
      this.ms = 'Aucune sortie trouvée !';
       this.ovo.show(e, document.getElementById('excel'));
    }  else {
      if (this.valide ) {
        this.valide = true;
        this.ngselectDisabled = false ;
        this.dateDisabled = true;
        this.hidden = true;
      } else {
        this.valide = false;
        this.ngselectDisabled = true ;
        this.dateDisabled = false;
        this.hidden = false;
      }
          try {
              const exportExcel = this.ventes.map(obj => {
                return {
                  'Référence': obj.codeMouve,
                  'Désignation': obj.designSt,
                  'Date': obj.dateMouve,
                  'Qte': obj.quantiteMouve,
                  'PU.HT': obj.prixMouve,
                  'Pièce Comm': obj.combineMouve,
                  'Tiers': obj.denoClt
                };
              });
              this.excelService.exportAsExcelFile(
                exportExcel,
                ' rapport sorties : ' + new Date().toLocaleDateString('en-GB')

              );
          } catch {
            console.log('error methode generer Excel');
          }
        }
}










dayDiff(d1, d2) {

  d1 = d1.getTime() / 86400000;
  d2 = d2.getTime() / 86400000;
  const d3 = d2 - d1 + 1 ;
  return new Number(d3).toFixed(0);
}

  ngOnInit() {
 this.hidden = false;
    // charger les client
    this.clientService.getClientsListOrdByDeno().toPromise().then(
      (data) => {

        this.clients =  data['_embedded'].clients;
          }
    );
    // charger les articles
    this.stockService.getStockList('').toPromise().then(
      (data) => {

        this.articles = data['_embedded'].stocks;
        console.log(this.articles);

      }
    );
    // style de ejs grid
    this.customAttributes = { class: 'customcss' };
    // initailisation
    this.SelectedClient = null;
    this.SelectedArticle = null;
     // traduire calendrier en francais
     this.tn = {
      firstDayOfWeek: 1,
      dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
      ],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ],
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
        'Decembre'
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
        'Dec'
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy'
    };
  }
   // hostListener
   @HostListener('document:click')
   clickout() {
     if (!this.wasInside ) {
        this.ovo.hide();
     }
     this.wasInside = false;
   }
init() {
  const dat = new Date();
  this.from = new Date(dat.getFullYear(), 0, 1);
   this.to = new Date();
   this.SelectedArticle = null;
   this.SelectedClient = null;
}
   /// recherche pour les clients en front
   public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
 }
 /// recherche pour les articles en front
 public onSearchArtParCode(word: string): Stock[] {

  this.stockService.getStockList(word).toPromise()
     .then(data => {
       console.log(data);

       this.articles  = data['_embedded'].stocks;


     });
     return (this.articles);
 }

   async Afficher(e) {
     // initialisation

     const nbrjour = this.dayDiff(this.from, this.to);
     console.log('nombre des jours ', nbrjour);
    this.afficherClicked = true;

    this.ventes = new Array();
    this.wasInside = true;
    this.ovo.hide();

    if (this.SelectedArticle !== null || this.SelectedClient !== null || Number(nbrjour) <= 31) {


    // affecter deno et code article
    if (this.SelectedArticle !== null) {
      this.codeArticle = this.SelectedArticle.code ;
      this.denoArticle = this.SelectedArticle.design;
    }
    // affecter deno et code Client
    if (this.SelectedClient !== null) {
      this.codeClt = this.SelectedClient.code;
      this.denoClt = this.SelectedClient.deno;
    }
    // les méthodes afficher pour les 4 cas
    if ( (this.SelectedArticle === null ) &&
    (this.SelectedClient === null  ) ) {
      console.log('cas4');
      await this.mouveService.getRapportVente4(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB')).toPromise().then(
        (data) => {
          console.log(data);
          this.ventes = data['_embedded'].rapportVentes;
          this.ventesTraitement =  data['_embedded'].rapportVentes;
          this.lenght = this.ventes.length ;
          console.log(this.ventes);

        }
      );
     } else  if ( (this.SelectedArticle !== null ) &&
    (this.SelectedClient !== null ) ) {
      await this.mouveService.getRapportVente3(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
      this.codeArticle, this.codeClt).toPromise().then(
       (data) => {
         console.log(data);
         this.ventes = data['_embedded'].rapportVentes;
         this.lenght = this.ventes.length ;
         this.ventesTraitement =  data['_embedded'].rapportVentes;
       }
     );
      console.log('cas3');
     } else  if ( (this.SelectedArticle === null ) &&
    (this.SelectedClient !== null  ) ) {
      await this.mouveService.getRapportVente2(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
      this.codeClt).toPromise().then(
       (data) => {
         console.log(data);
         this.ventes = data['_embedded'].rapportVentes;
         this.ventesTraitement =  data['_embedded'].rapportVentes;
         this.lenght = this.ventes.length ;
       }
     );
      console.log('cas2');
     } else   if ( (this.SelectedArticle !== null ) &&
     (this.SelectedClient === null ) ) {
      await this.mouveService.getRapportVente1(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
      this.codeArticle).toPromise().then(
       (data) => {
         console.log(data);
         this.ventes = data['_embedded'].rapportVentes;
         this.ventesTraitement =  data['_embedded'].rapportVentes;
         this.lenght = this.ventes.length ;

       }
     );
       console.log('cas1');
      }
      console.log(this.SelectedArticle);
      console.log(this.SelectedClient);

       // si grid vide
       if (this.lenght === 0 ) {
        this.hidden = false;
        this.valide = false ;
        this.ngselectDisabled = true ;
        this.dateDisabled = false;
        this.ventes = null;
        this.ventesTraitement = null;
        this.denoArticle = 'Tout ';
        this.denoClt = 'Tout';
        this.ms = 'Aucune sortie trouvée !';
         this.ovo.show(e, document.getElementById('afficher'));
      } else {
        this.hidden = true;
        this.ngselectDisabled = false ;
        this.dateDisabled = true;
        this.valide = true;
      }


    } else {

      this.ms = 'Veuillez raffiner les critères !!';
      this.ovo.show(e, document.getElementById('afficher'));
      this.valide = false;
      this.ngselectDisabled = true ;
      this.dateDisabled = false;
      this.ventes = null;
      this.ventesTraitement = null;
      this.denoArticle = 'Tout ';
      this.denoClt = 'Tout';
      this.hidden = false;

    }
   }
   rowSelected() {
    this.readonlynom = true;
   this.readonly = true;
   if (this.grid.getSelectedRowIndexes()[0] >= 0) {
     const selected: any = this.grid.getSelectedRecords()[0];
     this.Selectedachat = selected ;

  }

 }
 async NvlSaisie() {
   // initialisation
   this.afficherClicked = false;
   this.ventes = null;
   this.ventesTraitement = null;
   this.dateDisabled = false;
   this.ngselectDisabled = true;
   this.denoArticle = 'Tout ';
   this.denoClt = 'Tout';
   this.totalHt = 0;
   this.valide = false ;
   this.hidden = false;
 }


 async imprimer(e) {
  this.ventes = new Array();
  // affecter deno et code article
  if (this.SelectedArticle !== null) {
    this.codeArticle = this.SelectedArticle.code ;
    this.denoArticle = this.SelectedArticle.design;
  }
  // affecter deno et code Client
  if (this.SelectedClient !== null) {
    this.codeClt = this.SelectedClient.code;
    this.denoClt = this.SelectedClient.deno;
  }
  // les méthodes afficher pour les 4 cas
  if ( (this.SelectedArticle === null ) &&
  (this.SelectedClient === null  ) ) {
    console.log('cas4');
    await this.mouveService.getRapportVente4(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB')).toPromise().then(
      (data) => {
        console.log(data);
        this.ventes = data['_embedded'].rapportVentes;
        this.ventesTraitement =  data['_embedded'].rapportVentes;
        this.lenght = this.ventes.length ;
        console.log(this.ventes);

      }
    );
   } else  if ( (this.SelectedArticle !== null ) &&
  (this.SelectedClient !== null ) ) {
    await this.mouveService.getRapportVente3(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
    this.codeArticle, this.codeClt).toPromise().then(
     (data) => {
       console.log(data);
       this.ventes = data['_embedded'].rapportVentes;
       this.lenght = this.ventes.length ;
       this.ventesTraitement =  data['_embedded'].rapportVentes;
     }
   );
    console.log('cas3');
   } else  if ( (this.SelectedArticle === null ) &&
  (this.SelectedClient !== null  ) ) {
    await this.mouveService.getRapportVente2(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
    this.codeClt).toPromise().then(
     (data) => {
       console.log(data);
       this.ventes = data['_embedded'].rapportVentes;
       this.ventesTraitement =  data['_embedded'].rapportVentes;
       this.lenght = this.ventes.length ;
     }
   );
    console.log('cas2');
   } else   if ( (this.SelectedArticle !== null ) &&
   (this.SelectedClient === null ) ) {
    await this.mouveService.getRapportVente1(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
    this.codeArticle).toPromise().then(
     (data) => {
       console.log(data);
       this.ventes = data['_embedded'].rapportVentes;
       this.ventesTraitement =  data['_embedded'].rapportVentes;
       this.lenght = this.ventes.length ;

     }
   );
     console.log('cas1');
    }

    console.log('data ventes lenght  ', this.ventes );


     // si grid vide
     if (this.ventes.length === 0 ) {
      this.hidden = false;
      this.valide = false ;
      this.ngselectDisabled = true ;
      this.dateDisabled = false;
      this.ventes = null;
      this.ventesTraitement = null;
      this.denoArticle = 'Tout ';
      this.denoClt = 'Tout';
      this.ms = 'Aucune sortie trouvée !';
       this.ovo.show(e, document.getElementById('apperc'));
    } else {

      if (this.valide ) {
        this.valide = true;
        this.ngselectDisabled = false ;
        this.dateDisabled = true;
        this.hidden = true;
      } else {
        this.valide = false;
        this.ngselectDisabled = true ;
        this.dateDisabled = false;
        this.hidden = false;
      }


  /// créer doc jspdf
  const doc1 = new jspdf();
  doc1.setFontSize(12);
  doc1.setFontStyle('Arial');
  await this.steService
             .getSte()
             .toPromise()
             .then(data => {
               this.ste = data['_embedded'].ste;
               this.societe = this.ste[0];
             });
 doc1.text('SOCIETE.:  ' + this.societe.societe, 9, 15);

 doc1.setFontSize(22);
 doc1.setFontStyle('bold');
 doc1.setFontStyle('Arial');
 doc1.text('RAPPORT DES SORTIES AU STOCK', 52, 30);
 doc1.setFontSize(14);
 doc1.setFontStyle('bold');
 doc1.setFontStyle('Arial');
 doc1.text('Du : ' + this.from.toLocaleDateString('en-GB') , 9, 37) ;
 doc1.text('Au : ' + this.to.toLocaleDateString('en-GB') , 50, 37) ;
 doc1.text('Client : ' + this.denoClt , 9, 44) ;
 doc1.text('Article : ' + this.denoArticle , 9, 52) ;

 /// entete tableau
 doc1.setFontSize(10);
 doc1.setFontStyle('bold');
 doc1.line(9, 60, 205, 60);
 doc1.text('Référence', 10, 65);
   doc1.text('Désignation', 42, 65);
   doc1.text('Date', 97, 65);
   doc1.text('Qte', 113, 65);
   doc1.text('PU. HT', 124, 65);
   doc1.text('Pièce Com.', 138, 65);
   doc1.text('Tiers', 162, 65);
   doc1.line(9, 70, 205, 70);

   //// cors du tableau
   let y = 75;
   let numPage = 1;
   if ( this.ventesTraitement === null || this.ventesTraitement === undefined) {
  } else {
    for (this.tab_vente of this.ventesTraitement) {

      this.totalHt = this.totalHt + parseFloat(this.tab_vente.prixMouve);
      if (this.tab_vente.denoClt === null || String(this.tab_vente.denoClt) === '') {
        this.tab_vente.denoClt = '';
      }
      if (this.tab_vente.designSt === null || String(this.tab_vente.designSt) === '') {
        this.tab_vente.designSt = '';
      }
      if (this.tab_vente.codeMouve === null || String(this.tab_vente.codeMouve) === '') {
        this.tab_vente.codeMouve = '';
      }
      if (this.tab_vente.dateMouve === null || String(this.tab_vente.dateMouve) === '') {
        this.tab_vente.dateMouve = '';
      }
      if (this.tab_vente.quantiteMouve === null || String(this.tab_vente.quantiteMouve) === '') {
        this.tab_vente.quantiteMouve = '';
      }
      if (this.tab_vente.prixMouve === null || String(this.tab_vente.prixMouve) === '') {
        this.tab_vente.denoClt = '';
      }
      if (this.tab_vente.combinMouve === null || String(this.tab_vente.combinMouve) === '') {
        this.tab_vente.combinMouve = '';
      }

       doc1.setFontSize(7);
       doc1.setFontStyle('Arial');
       doc1.text(this.tab_vente.codeMouve, 10, y);
       doc1.text(this.tab_vente.designSt, 42, y);
       doc1.text(this.tab_vente.dateMouve.substring(0, 19), 97, y);
       doc1.text(this.tab_vente.quantiteMouve, 114, y);
       doc1.text(this.tab_vente.prixMouve, 126, y);
       doc1.text(this.tab_vente.combinMouve, 138, y);
       doc1.text(this.tab_vente.denoClt, 162, y);
       y = y + 7;
       if (y > 277) {
        doc1.line(9, 283, 205, 283);
        doc1.setFontSize(10);
          doc1.setFontStyle('normal');
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
          numPage++;
          doc1.addPage();
         doc1.line(9, 12, 205, 12);
         doc1.setFontSize(10);
         doc1.setFontStyle('bold');
        doc1.text('Référence', 10, 17);
        doc1.text('Désignation', 42, 17);
        doc1.text('Date', 97, 17);
        doc1.text('Qte', 114, 17);
        doc1.text('PU. HT', 124, 17);
        doc1.text('Pièce Com.', 138, 17);
        doc1.text('Tiers', 162, 17);
    // creer la ligne
      doc1.setFontStyle('bold');
      doc1.line(9, 20, 205, 20);
      y = 26;
       }

     }

   }
   doc1.line(9, 283, 205, 283);
   doc1.setFontSize(10);
    doc1.setFontStyle('normal');
   doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

 ////

   window.open(doc1.output('bloburl'), '_blank');
  }
}

}
