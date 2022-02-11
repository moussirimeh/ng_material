import { Component, OnInit , ViewChild, HostListener } from '@angular/core';
import {FournisseurService } from '../services/fournisseur.service';
import { Achat0Service } from '../services/achat0.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { ExcelService } from '../services/excel.service';
import * as jspdf from 'jspdf';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import {Fournisseur} from '../services/Fournisseur';
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
  selector: 'app-consultation-reg-four',
  templateUrl: './consultation-reg-four.component.html',
  styleUrls: ['./consultation-reg-four.component.scss'],
  providers: [ExcelService]
})
export class ConsultationRegFourComponent implements OnInit {
  tn;
  year =  new Date().getFullYear() - 1;

  datedebut = new Date(this.year,  new Date().getMonth(), new Date().getDate());

  datefin = new Date();
  codeFour: string;
  fournisseurs = new Array();
  selectedFournisseur;
  visibleBtnAfficher: boolean;
  msgerror: string;
  public customAttributes: Object;
  btnafficher: boolean;
  ReglementValue: string;
  ReceptionValue: string;
  liste = new Array();
  wasInside: boolean;
  @ViewChild('op')
  public op: OverlayPanel;
  readOnly: boolean;
  affichergrid: boolean;
  btnnvlsaisie: boolean;
  constructor(private fournisseurService: FournisseurService,
              private achat0Service: Achat0Service,
              private excelService: ExcelService,
              private config: NgSelectConfig ) {
                this.config.notFoundText = 'Aucun élément trouvé';
                this.config.clearAllText = 'Supprimer tous ';

               }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      if (this.op !== undefined && this.op !== null) {this.op.hide(); }
    }
    this.wasInside = false;
}
onSearchFournisseur(word: string, item: Fournisseur): boolean {
  return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}
NouvelleSaisie() {


  this.visibleBtnAfficher = true;
  this.affichergrid = false;
  this.btnnvlsaisie = false;

  this.readOnly = false;

}
init() {
  this.selectedFournisseur = null;
  this.codeFour = '';
  this.liste = new Array();
  this.datedebut  = new Date(this.year,  new Date().getMonth(), new Date().getDate());
  this.datefin = new Date();
  this.readOnly = false;

}

async afficher(e) {
  this.wasInside = true;
  this.op.hide();

  const d1 = this.datedebut.toLocaleDateString('en-GB');
  const d2 = this.datefin.toLocaleDateString('en-GB');
  if (this.selectedFournisseur === null || this.selectedFournisseur === undefined) {
    this.codeFour = '';
  }
  const op1 = this.codeFour;
  console.log('regg', this.ReglementValue);
  console.log('recep', this.ReceptionValue);

  const rg = this.ReglementValue;
  const rc = this.ReceptionValue;




  await this.achat0Service.ListeFactureRegFRS(d1, d2, op1, rg, rc)
   .toPromise()
   .then(data => {console.log(data);
    this.liste = data['_embedded'].consultationRegFrses;
    console.log('liste', this.liste);
   });

   if (this.liste.length > 0) {
        this.affichergrid = true;
        this.visibleBtnAfficher = false;
        this.btnnvlsaisie = true;
        this.readOnly = true;
        for (const ob of this.liste) {
          if (ob.netAch0 !== null) {
            ob.netAch0 = Number(ob.netAch0).toFixed(3);
          }

          if (ob.mntDeviseAch0 !== null) {
            ob.mntDeviseAch0 = Number(ob.mntDeviseAch0).toFixed(3);
          }

        }
      } else {

        this.msgerror = 'aucune facture trouvée !!  ';
        this.op.show(e, document.getElementById('affb'));
        this.affichergrid = false;
        this.visibleBtnAfficher = true;
      }





}
visualiser() {
  this.readOnly = true;
  // creer le document pdf
  if (this.affichergrid === true ) {
    const doc1 = new jspdf();

    doc1.setFontSize(18);
    doc1.setFontStyle('bold');
     doc1.setTextColor(0, 51, 153);
    doc1.setFontStyle('Arial');
    doc1.text('Etat reglement fournisseurs   ' , 70, 20);


    doc1.setFontSize(12);
    doc1.setFontStyle('Arial');
    doc1.setTextColor(48, 48, 48);
    doc1.text('Date debut:     ' + this.datedebut.toLocaleDateString('en-GB') , 10, 30);
    doc1.text('Date fin  :     ' + this.datefin.toLocaleDateString('en-GB') , 10, 35);
    doc1.text('Reglé  :        ' + this.datedebut.toLocaleDateString('en-GB') , 10, 40);
    doc1.text('Reçu   :        ' + this.datefin.toLocaleDateString('en-GB') , 10, 45);
    doc1.text('Fournisseur:   ' + this.codeFour , 10, 50);

           // entete du  tableau
           doc1.setFontSize(72);
           doc1.setFontStyle('bold');
           doc1.setLineWidth(0.5);
           doc1.line(9, 55, 206, 55);
           doc1.setFontSize(13);
           doc1.setFontStyle('bold');



           doc1.setFontSize(10);
           doc1.setFontStyle('Arial');
           doc1.setTextColor(48, 48, 48);
           doc1.text('Fournisseur'  , 11, 60);
           doc1.text('Numero'  , 50, 60);
           doc1.text('Date Fre'  , 69, 60) ;
           doc1.text('Echéance'  , 85, 60);
           doc1.text('Date regl'  , 105, 60);
           doc1.text('Banque'  , 127, 60);
           doc1.text('Mnt Dinar'  , 143, 60);
           doc1.text('Mnt Dev'  , 160, 60);
           doc1.text('Dev'  , 176, 60);
           doc1.text('Retard'  , 183, 60);
           doc1.text('Rg'  , 195, 60);
           doc1.text('Rc'  , 201, 60);

           doc1.setFontSize(72);
           doc1.setFontStyle('bold');
           doc1.setLineWidth(0.5);
           doc1.line(9, 65, 206, 65);
           doc1.setFontSize(13);
           doc1.setFontStyle('bold');

           let y = 70;
           let numPage = 1;
           doc1.setFontSize(9);
           doc1.setFontStyle('Arial');
           for (const bs of this.liste) {
            /* if (bs.netAch0 !== null) {
              bs.netAch0 = Number(bs.netAch0).toFixed(3);
            }

            if (bs.mntDeviseAch0 !== null) {
              bs.mntDeviseAch0 = Number(bs.mntDeviseAch0).toFixed(3);
            }*/
            doc1.setFontSize(9);
            doc1.setFontStyle('Arial');
            doc1.text(bs.denofour.substr(0, 19)  , 11, y);

            doc1.text(bs.numeroAch0  , 51, y);
            if (bs.dateAch0 === null ) {
              bs.dateAch0 = '';
            }

            doc1.text(bs.dateAch0  , 70, y) ;

            if (bs.echeanceAch0 === null ) {
              bs.echeanceAch0 = '';
            }

            doc1.text(bs.echeanceAch0  , 87, y);
            if (bs.dat_reglAch0 === null ) {
              bs.dat_reglAch0 = '';
            }
            doc1.text(bs.dat_reglAch0  , 106, y);
            if (bs.banque === null ) {
              bs.banque = '';
            }

            doc1.text(bs.banque.substr(0, 4)  , 128, y);
            if (bs.netAch0 === null ) {
              bs.netAch0 = '';
            }

            doc1.text(bs.netAch0  , 144, y);
            if (bs.mntDeviseAch0 === null ) {
              bs.mntDeviseAch0 = '';
            }
            doc1.text(bs.mntDeviseAch0  , 161, y);
            if (bs.deviseAch0 === null ) {
              bs.deviseAch0 = '';
            }
            doc1.text(bs.deviseAch0  , 176, y);
            if (bs.retard === null ) {
              bs.retard = '';
            }
            doc1.text(bs.retard.toString()  , 185, y);

            if (bs.regle === null ) {
              bs.regle = '';
            }
            doc1.text(bs.regle  , 196, y);
            if (bs.recu === null ) {
              bs.recu = '';
            }
            doc1.text(bs.recu  , 203, y);
            y = y + 7;

             // passer a une nouvelle page
             if (y > 277) {
              doc1.line(10, y - 3, 200, y - 3, 'FD');
              doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
              numPage++;
              doc1.addPage();
              // entete tableau

              doc1.line(9, 10, 205, 10);
              doc1.setFontSize(10);


              doc1.text('Fournisseur'  , 11, 17);
              doc1.text('Numero'  , 50, 17);
              doc1.text('Date Fre'  , 69, 17) ;
              doc1.text('Echéance'  , 86, 17);
              doc1.text('Date regl'  , 105, 17);
              doc1.text('Banque'  , 127, 17);
              doc1.text('Mnt Dinar'  , 143, 17);
              doc1.text('Mnt Dev'  , 160, 17);
              doc1.text('Dev'  , 175, 17);
              doc1.text('Retard'  , 183, 17);
              doc1.text('Rg'  , 195, 17);
              doc1.text('Rc'  , 201, 17);
              // creer la ligne
              doc1.setFontStyle('bold');
              doc1.line(9, 24, 205, 24);
              y = 32;
            }

           }

           doc1.line(10, 280, 205, 280, 'FD');
           doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
           window.open(doc1.output('bloburl'), '_blank');
  }


}


genererExcel(): void {
  this.readOnly = true;
  try {
     if ( this.liste === undefined ) {

     } else {

       const exportExcel = this.liste.map(
        obj => {
            return {
                'Fournisseur' : obj.denofour,
                'Numero': obj.numeroAch0,
                'Date fre': obj.dateAch0,
                'Date de reglement': obj.dat_reglAch0,
                'Bnaque': obj.banque,
                'Montant en Dinars': obj.netAch0,
                'Montant en Devise': obj.mntDeviseAch0,
                'Devise': obj.deviseAch0,
                'Retard': obj.retard,
                'Reglé': obj.regle,
                'Recu': obj.recu
            };
        }
    );
      this.excelService.exportAsExcelFile(exportExcel, 'consultation reg frs' + this.datefin.toLocaleDateString('en-GB'));
     }
    } catch {
      console.log(' methode genererExcel');

    }

}

async ngOnInit() {

 this.readOnly = false;
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

    this.customAttributes = { class: 'customcss' };
    this.ReceptionValue = 'O';
    this.ReglementValue = 'O';
    this.btnnvlsaisie = false;
    this.affichergrid = false;

    this.visibleBtnAfficher = true;





    this.selectedFournisseur = null;
   await this.fournisseurService.getFourListByDeno('')
    .toPromise()
    .then(data => {
      this.fournisseurs = data['_embedded'].fournisseurs;
    });


    }



  changeFournisseur() {
    if (this.selectedFournisseur !== null && this.selectedFournisseur !== undefined) {
        this.codeFour = this.selectedFournisseur.code;
    //    this.visibleBtnAfficher = true;
    } else {
      this.codeFour = '';

    }
}

}
