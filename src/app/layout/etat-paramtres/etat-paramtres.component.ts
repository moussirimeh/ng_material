import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { BrouService } from '../services/brou.service';

import {
  GridComponent,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { CaisseService } from '../services/caisse.service';
import { setCurrencyCode } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Vendeur1Service } from '../services/vendeur1.service';
import { CaissePService } from '../services/caisseP.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../services/excel.service';
import { ClientService } from '../services/client.service';
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
  selector: 'app-etat-paramtres',
  templateUrl: './etat-paramtres.component.html',
  styleUrls: ['./etat-paramtres.component.scss'],
  providers: [ExcelService]
})
export class EtatParamtresComponent implements OnInit {

  @ViewChild('grid')
  public grid: GridComponent;

  hiddenNouvSaisie = false;

  ngselectDisabled = false;

pieces = [
  {id: 'traite', label: 'Traite'},
  {id: 'chVirEsp', label: 'Chèque - Virement - Espèce'} ,
  {id: 'factAvoir', label: 'Facture - Avoir'},
  {id: 'imp', label: 'Impayées'}];



  totalDebit = '0.000';



  champDisabled = true;

  listeBrou = new Array();
  selectedVendeur = null;
  selectedPiece = null;
  afficherShow = true;
  codeVendeur = '';
  showCard1 = false;
  showNvSaisie = false;
  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  styleOvPanelError = {
    'text-align': 'center',
    'font-size': '14px',
    'background-color': ' #f8b7bd',
  };


  datedeb = new Date();
  datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  datefin = new Date ();
  mvt = 'tout';
  styleOvPanel = {};
  tn: any;
  ListBrous = new Array();
  listeBrous = new Array();


  totPieces = 0;
  codePiece: string;
  vendeurs: any[];
  piece = '';
  piece1 = '';
  piece2 = '';
  apurement = 'tout';
  clients: any[];
  titre = 'Pramétrés';
  typclt = '';
  ap = '3';
  obj = {
    type: null,
    piece: null,
    numero: null,
    date: null,
    codeClt : null,
    NomClient : null,
    montant: null,
    apurement: null,
    echeance: null,
    libelle: null,
    titre : null
  };
  listeBrousPdf: any[];
  listeBrousExcel: any;
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(
    private clientService: ClientService,
    private brouService: BrouService,
    private excelService: ExcelService,
    private caissePService: CaissePService,
    private vendeur1Service: Vendeur1Service,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';


  }


  async chargerVendeur() {
    if (this.vendeurs.length === 0) {
      await this.vendeur1Service
        .getVendeur1ByDeno()
        .toPromise()
        .then((data) => {
          this.vendeurs = data['_embedded'].vendeur1;
        })
        .catch((data) => {
          console.log('error reload data fournisseurs');
        })
        .finally(() => {
          // this.grid.refresh();
        });
    }
  }

  NouvelleSaisie(): void {
    this.afficherShow = true;

    this.totalDebit = '0.000';
    this.ngselectDisabled = false;
    this.champDisabled = true;
    if (this.selectedVendeur !== null && this.selectedVendeur !== undefined) {
      this.codeVendeur = this.selectedVendeur.code;
    } else {
      this.codeVendeur = '';
    }
    this.showCard1 = false;
    this.listeBrous = new Array();
    this.ListBrous = new Array();
  }




  changeVendeurs() {
    if (this.selectedVendeur === null || this.selectedVendeur === undefined) {
      this.codeVendeur = '';
    } else {
      this.codeVendeur = this.selectedVendeur.code;
    }
  }

  changePieces() {
/*{id: 'traite', label: 'Traite'},
  {id: 'chVirEsp', label: 'Chèque - Virement - Espèce'} ,
  {id: 'factAvoir', label: 'Facture - Avoir'},
  {id: 'imp', label: 'Impayées'}];*/
    if (this.selectedPiece  === null || this.selectedPiece  === undefined) {
         this.piece = '';
         this.piece1 = '';
         this.piece2 = '';
    } else {
      this.codePiece = this.selectedPiece.id;
      switch (this.codePiece) {
        case  'traite' : {
           this.piece = 'TRAITE';
           this.piece1 = 'TRAITE';
           this.piece2 = 'TRAITE';
           this.titre  = 'TRAITE';
        }break;

        case  'factAvoir' : {
          this.piece = 'FACTURE';
          this.piece1 = 'AVOIR';
          this.piece2 = 'AVOIR';
          this.titre  = 'FACTURE / AVOIR ';
       }break;
       case  'imp' : {
        this.piece = 'IMP/TRT';
        this.piece1 = 'IMP/CHK';
        this.piece2 = 'IMP/CHK';
        this.titre  = 'Impayées';
     }break;

     case  'chVirEsp' : {
      this.piece = 'CHEQUE';
      this.piece1 = 'VIR/BNQ';
      this.piece2 = 'ESPECE';
      this.titre  = 'Cheque -VIR/BNQ - ESPECE ';
   }break;
      }
    }


    console.log('piece ', this.piece);
    console.log('piece 1 ', this.piece1);
    console.log('piece 2 ', this.piece2);

  }

  async ngOnInit() {

         this.piece = '';
         this.piece1 = '';
         this.piece2 = '';
// this.display = true;
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
      this.vendeurs = new Array();
    await this.chargerVendeur();

    this.clients = new Array();
    await this.clientService
    .getClientsByTermeOrderByDeno('O')
    .toPromise()
    .then((data) => {
      this.clients = data['_embedded'].clients;
    });
  }

 async genererExcel(e) {
  this.wasInside = true;
  switch (this.mvt) {
    case 'tout' : this.typclt = '';
    break;
    case 'comptant' : this.typclt = 'c';
    break;
    case 'terme' : this.typclt = 't';
    break;
    default: this.typclt = '';
  }

  switch (this.apurement) {

    case 'tout' : this.ap = '3';
    break;
    case 'Apure' : this.ap = '2';
    break;
    case 'NonApure' : this.ap = '1';
    break;
    default: this.ap = '3';
  }

  let tab = new Array();
  this.listeBrousPdf = new Array();
  console.log('d1 ', this.datedebut.toLocaleDateString('en-GB'));
  console.log('d2 ', this.datefin.toLocaleDateString('en-GB'));
  console.log('type clt ', this.typclt);
  console.log('codeVendeur ', this.codeVendeur);
  console.log('piece ', this.piece);
  console.log('piece 1  ', this.piece1);
  console.log('piece 2  ', this.piece2);
  console.log('ap  ', this.ap);
  await this.brouService.getEtatParametres(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'),
  this.typclt, this.codeVendeur, this.piece, this.piece1, this.piece2, this.ap )
  .toPromise()
  .then(data => {console.log('liste des etats param ', data);
  tab = data;
 });
 this.listeBrousExcel = new Array();
  if ( tab.length > 0 ) {
    for (const i of tab) {
      this.obj = {
        type: null,
        piece: null,
        numero: null,
        date: null,
        codeClt : null,
        NomClient : null,
        montant: null,
        apurement: null,
        echeance: null,
        libelle: null,
        titre : null
      };
      this.obj.type = i[0] ;
      this.obj.piece = i[1] ;
      this.obj.numero = i[2] ;
      this.obj.date = i[3] ;
      this.obj.codeClt = i[4] ;
      this.obj.NomClient = i[5] ;
      this.obj.montant = i[6] ;
      if ( i[7] !== null && i[7] !== undefined) {
        this.obj.apurement = 'Oui';
       } else {
        this.obj.apurement = 'Non';
       }
      this.obj.echeance = i[8] ;
      this.obj.libelle = i[9] ;
      this.obj.titre = i[10] ;
      this.listeBrousExcel.push(this.obj);
    }


   const exportExcel = this.listeBrousExcel.map(
        obj => {
            return {
                'Type client' : obj.type,
                'Pièce': obj.piece,
                'Numéro': obj.numero,
                'Date': obj.date,
                'Code Client': obj.codeClt,
                'Nom Client': obj.NomClient,
                'Montant': Number(obj.montant),
                'Apurement': obj.apurement,
                'Echéance': obj.echeance,
                'Libelle': obj.libelle

            };
           }
            );
    const daterap = new Date().toLocaleDateString('en-GB');
      this.excelService.exportAsExcelFile(exportExcel, 'Etat parametre' + daterap);
     } else {

          this.styleOvPanel = this.styleOvPanelError;
          this.msgs = 'Aucun élement trouvé ! ';
          this.ov.show(e);
      }
      }

  async afficher(e) {
    this.wasInside = true;


      switch (this.mvt) {
        case 'tout' : this.typclt = '';
        break;
        case 'comptant' : this.typclt = 'c';
        break;
        case 'terme' : this.typclt = 't';
        break;
        default: this.typclt = '';
      }

      switch (this.apurement) {
        case 'tout' : this.ap = '3';
        break;
        case 'Apure' : this.ap = '2';
        break;
        case 'NonApure' : this.ap = '1';
        break;
        default: this.ap = '3';
      }


     let tab = new Array();
     this.listeBrous = new Array();
     console.log('d1 ', this.datedebut.toLocaleDateString('en-GB'));
     console.log('d2 ', this.datefin.toLocaleDateString('en-GB'));
     console.log('type clt ', this.typclt);
     console.log('codeVendeur ', this.codeVendeur);
     console.log('piece ', this.piece);
     console.log('piece 1  ', this.piece1);
     console.log('piece 2  ', this.piece2);
     console.log('ap  ', this.ap);
     await this.brouService.getEtatParametresTop600(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'),
     this.typclt, this.codeVendeur, this.piece, this.piece1, this.piece2, this.ap )
     .toPromise()
     .then(data => {console.log('liste des etats param ', data);
     tab = data;
    });

      console.log('tab  ', tab);
      //
      if (tab.length < 500 &&  tab.length > 0 ) {
        for (const i of tab) {
          this.obj = {
            type: null,
            piece: null,
            numero: null,
            date: null,
            codeClt : null,
            NomClient : null,
            montant: null,
            apurement: null,
            echeance: null,
            libelle: null,
            titre : null
          };
          this.obj.type = i[0] ;
          this.obj.piece = i[1] ;
          this.obj.numero = i[2] ;
          this.obj.date = i[3] ;
          this.obj.codeClt = i[4] ;
          this.obj.NomClient = i[5] ;
          this.obj.montant = Number(i[6]) ;
          if ( i[7] !== null && i[7] !== undefined) {
            this.obj.apurement = 'Oui';
           } else {
            this.obj.apurement = 'Non';
           }
          this.obj.echeance = i[8] ;
          this.obj.libelle = i[9] ;
          this.obj.titre = i[10] ;
          this.listeBrous.push(this.obj);
        }


        if (this.listeBrous.length > 0) {
          this.showCard1 = true;
          let tot  = 0;
          for (const ob of this.listeBrous) {
              tot = tot + Number(ob.montant);
          }
            this.totalDebit = tot.toFixed(3);
            this.ngselectDisabled = true;
            this.afficherShow = false;
            this.showCard1 = true;
            this.showNvSaisie = true;
            this.totPieces = this.listeBrous.length;
            }   } else {
              this.afficherShow = true;
              if (tab.length === 0) {
                this.styleOvPanel = this.styleOvPanelError;
                this.msgs = 'Aucun élement trouvé ! ';
                this.ov.show(e);
              } else {
                this.styleOvPanel = this.styleOvPanelError;
                this.msgs = 'Veillez raffiner les critères  ! ';
                this.ov.show(e);
              }
        }


      console.log('liste brou afficher  llllllllllllllllllllll ', this.listeBrous );

    }

  onSearchPiece(word: string, item): boolean {
    return item.label.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  public onSearchVendeur(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async apercu(e) {

    this.wasInside = true;
    this.ov.hide();
    // tslint:disable-next-line:prefer-const
    let sste = globals.societe;
     const datee = new Date();
     const date = datee.toLocaleDateString('en-GB');
     this.wasInside = true;
     switch (this.mvt) {
       case 'tout' : this.typclt = '';
       break;
       case 'comptant' : this.typclt = 'c';
       break;
       case 'terme' : this.typclt = 't';
       break;
       default: this.typclt = '';
     }

     switch (this.apurement) {
       case 'tout' : this.ap = '3';
       break;
       case 'Apure' : this.ap = '2';
       break;
       case 'NonApure' : this.ap = '1';
       break;
       default: this.ap = '3';
     }


    let tab = new Array();
    this.listeBrousPdf = new Array();
    console.log('d1 ', this.datedebut.toLocaleDateString('en-GB'));
    console.log('d2 ', this.datefin.toLocaleDateString('en-GB'));
    console.log('type clt ', this.typclt);
    console.log('codeVendeur ', this.codeVendeur);
    console.log('piece ', this.piece);
    console.log('piece 1  ', this.piece1);
    console.log('piece 2  ', this.piece2);
    console.log('ap  ', this.ap);
    await this.brouService.getEtatParametres(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'),
    this.typclt, this.codeVendeur, this.piece, this.piece1, this.piece2, this.ap )
    .toPromise()
    .then(data => {console.log('liste des etats param ', data);
    tab = data;
   });

     console.log('tab  ', tab);
      let tot  = 0;
     if ( tab.length > 0 ) {
       for (const i of tab) {
         this.obj = {
           type: null,
           piece: null,
           numero: null,
           date: null,
           codeClt : null,
           NomClient : null,
           montant: null,
           apurement: null,
           echeance: null,
           libelle: null,
           titre : null
         };
         this.obj.type = i[0] ;
         this.obj.piece = i[1] ;
         this.obj.numero = i[2] ;
         this.obj.date = i[3] ;
         this.obj.codeClt = i[4] ;
         this.obj.NomClient = i[5] ;
         this.obj.montant = i[6] ;
         if ( i[7] !== null && i[7] !== undefined) {
          this.obj.apurement = 'Oui';
         } else {
          this.obj.apurement = 'Non';
         }
        // this.obj.apurement = i[7] ;
         this.obj.echeance = i[8] ;
         this.obj.libelle = i[9] ;
         this.obj.titre = i[10] ;
         tot = tot + Number(this.obj.montant);
         this.listeBrousPdf.push(this.obj);
       }
   this.totalDebit = tot.toFixed(3);
    // const displayDate = new Date().toLocaleDateString('en-GB');
    // const displayTime = new Date().toLocaleTimeString();
    const doc1 = new jspdf();
    // page a4 (210 x 297 mm)
    let numPage = 1;
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text('SOCIETE  :   ' + sste, 10, 10);
   doc1.text( 'Tunis le :    ' + date, 147, 12 );

// + this.titre


    doc1.setFontStyle('arial');
    doc1.setFontStyle('bold');
    doc1.setFontSize(16);
    doc1.text('Etat paramétrés' , 70, 20);

    doc1.setFontSize(10);
    doc1.text('Date Debut:        ' + this.datedebut.toLocaleDateString('en-GB'), 10, 26);
    doc1.text('Date fin :         ' + this.datefin.toLocaleDateString('en-GB'), 60, 26);
    doc1.text('Pièce :         ' + this.titre, 110, 26);
if (this.codeVendeur !== '' || this.codeVendeur === undefined || this.codeVendeur === null ) {
  doc1.text('Code vendeur : ' + this.selectedVendeur.code, 10, 32);
  doc1.text('Nom Vendeur : ' + this.selectedVendeur.deno, 60, 32);
}


    doc1.setFontSize(9);
    doc1.setFontStyle('bold');
    doc1.line(10, 35, 200, 35);
    // ligne Horizontal doc1.line(x1,y1,x2,y2)
    doc1.text('Typ_Clt', 10, 39);
    doc1.text('Pièce', 25, 39);
    doc1.text('Numero', 39, 39);
    doc1.text('Date', 60, 39);
    doc1.text('CodeClt', 76, 39);
    doc1.text('Nom Client', 90, 39);
    doc1.text('Montant', 135, 39);
    doc1.text('Apur', 150, 39);
    doc1.text('Echéance', 161, 39);
    doc1.text('Libelle', 176, 39);
    doc1.line(10, 42, 200, 42);
    doc1.setFontStyle('normal');
    let y = 47;
    const total = 0;
    doc1.setFontSize(7);
    for (const br of this.listeBrousPdf) {

      if (br.type !== null) {
        doc1.text(br.type, 11, y);
      } else {
          doc1.text('', 11, y);
      }

      if (br.piece !== null) {
        doc1.text(br.piece, 26, y);
      } else {
        doc1.text('', 26, y);
      }
      if (br.numero !== null) {
        doc1.text(br.numero, 40, y);
      } else {
        doc1.text('', 40, y);
      }
      if (br.date !== null) {
        doc1.text(br.date, 61, y);
      } else {
        doc1.text('', 61, y);
      }

      if (br.codeClt !== null) {
        doc1.text(br.codeClt, 77, y);
      } else {
        doc1.text('', 77, y);
      }
      if (br.NomClient !== null) {
        doc1.text(br.NomClient, 91, y);
      } else {
        doc1.text('', 91, y);
      }
       if (br.montant !== null) {
      doc1.text(Number(br.montant).toFixed(3), 150, y, 'right');
    } else {
      doc1.text('', 150, y);
    }
    if (br.apurement !== null) {
      doc1.text(br.apurement, 152, y);
    } else {
      doc1.text('', 152, y);
    }
    if (br.echeance !== null) {
      doc1.text(br.echeance, 162, y);
    } else {
      doc1.text('', 162, y);
    }
    if (br.libelle !== null) {
      doc1.text(br.libelle, 176, y);
    } else {
      doc1.text('', 176, y);
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

        doc1.text('Typ_Clt', 10, 24);
        doc1.text('Pièce', 25, 24);
        doc1.text('Numero', 39, 24);
        doc1.text('Date', 60, 24);
        doc1.text('CodeClt', 76, 24);
        doc1.text('Nom Client', 90, 24);
        doc1.text('Montant', 135, 24);
        doc1.text('Apur', 150, 24);
        doc1.text('Echéance', 161, 24);
        doc1.text('Libelle', 176, 24);

        doc1.line(10, 27, 200, 27);
        doc1.setFontStyle('normal');
        y = 32;
      }
    }
    doc1.setFontStyle('bold');
    doc1.line(10, y - 3, 200, y - 3, 'FD');
    doc1.setFontStyle('bold');
    doc1.setFontSize(12);
    doc1.text('Total : ' , 140, y + 3);
    doc1.text(this.totalDebit , 160, y + 3);
    doc1.setFontSize(7);
   y = y + 7;


    doc1.line(10, 282, 200, 282);
    doc1.setFontStyle('normal');
    doc1.text('Page ' + numPage.toFixed(0), 100, 289);
    window.open(doc1.output('bloburl'), '_blank');
  } else {
    this.styleOvPanel = this.styleOvPanelError;
    this.msgs = 'Aucun élement trouvé ! ';
    this.ov.show(e);
}
}
}
