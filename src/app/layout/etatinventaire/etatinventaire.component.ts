import { Component, OnInit, ViewChild , HostListener} from '@angular/core';
import { NgSelectConfig, NgSelectComponent } from '@ng-select/ng-select';
import { FournisseurService } from '../services/fournisseur.service';
import { StockService } from '../services/stock.service';
import { MouveinventService } from '../services/mouveinvent.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  ExcelExportProperties,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import { SteService } from '../services/ste.service';
import { OverlayPanel } from 'primeng/primeng';
import * as jspdf from 'jspdf';
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
  selector: 'app-etatinventaire',
  templateUrl: './etatinventaire.component.html',
  styleUrls: ['./etatinventaire.component.scss'],
})
export class EtatinventaireComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('ngselectfournisseur')
  public ngselectfournisseur: NgSelectComponent;
  readonly = false ;
  listefournisseurs = new Array();
  listeArticles = new Array();
  liste = new Array();
  listee: any;
  listeee: any;
  dateServeur: Date;
  year: number;
  month: number;
  dateinvent: string;
  selectedFour: any;
  selectedRep: any;
  codeFour = '';
  affichBTn: boolean;
  val_stk = '0';
  val_in = '0';
  btnaff = false;
  rdbtnarticle = '0';
  rdbtnqte = '0';
  label = 'Qte INV <> Qte Stock';
  emplacement = '';
  invent: string;
  btnfour = false;
  btnemp = false;
  btnNv = false ;
  mdpInvent = null;
  showcard = true;
  mdpInventaire = '';
  styleOvPanel = {};
  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  public mdp: string;
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
  styleButtonNormal = '';
  styleButtonSelectionne = 'dodgerblue';
  styleButtonFour = '';
  styleButtonEmp = '';
  styleButtonTout = 'dodgerblue';
  blockedDocument = false;
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {

      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(
    private config: NgSelectConfig,
    private fournisseurService: FournisseurService,
    private mouveinventService: MouveinventService,
    private stockService: StockService,
    private steService: SteService
    ) {  this.config.notFoundText = 'aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous'; }
    async confirmInv(e) {
      this.ov.hide();
        this.wasInside = true;

        if (this.mdpInvent === this.mdpInventaire) {
          this.showcard = false;

          console.log('mot passe' , this.mdpInvent );


        } else {
          this.showcard = true;
          this.msgs = 'Mot de passe incorrecte !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('mdpInv'));
        }

      }

      Annuler() {
        this.mdpInvent = null;
        this.ov.hide();
      }



  changeFour() {
    if (this.selectedFour !== null && this.selectedFour !== undefined) {
      this.codeFour = this.selectedFour.code;
    } else {
      this.codeFour = '';
    }
  }

  public onSearchDeno(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async chargerFournisseur() {
    if (this.listefournisseurs.length === 0) {
      await this.fournisseurService
        .getFournisseurListByOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des fournisseurs ', data);
          this.listefournisseurs = data['_embedded'].fournisseurs;
        });

    }

  }

  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    this.blockedDocument = true;
    console.log('four ======= ', this.codeFour);
    console.log('Emp ======= ', this.emplacement);
    await this.steService
      .getDateServeur()
      .toPromise()
      .then((data: string) => (this.dateServeur = new Date(data)));
    this.year = this.dateServeur.getFullYear();
    this.month = this.dateServeur.getMonth() + 1;
    this.dateinvent = String(this.year).substring(2, 4);

    if (this.month === 1) {
      this.dateinvent = String(Number(this.dateinvent) - 1);
    }
    console.log('year ***** ' + String(this.year).length);
    console.log('dateinvent ***** ' + this.dateinvent);
    this.invent = 'INVENT' + this.dateinvent;
    if (this.btnfour) {
      if (
        this.codeFour !== '' &&
        this.codeFour !== null &&
        this.codeFour !== undefined
      ) {
        if (this.rdbtnarticle === '1') {
          // Non Inventaire
          if (this.rdbtnqte === '1') {
            // Non Inventaire qte <>
            await this.mouveinventService
              .getlistwithfourNotInvntQteDiff(this.codeFour, this.invent)
              .toPromise()
              .then((data) => {
                console.log('listewith four Non Inventaire qte <>  =  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log(
                  'liste with four Non Inventaire qte <>    ',
                  this.liste
                );
              });
          } else if (this.rdbtnqte === '2') {
            // Non Inventaire qte =
            await this.mouveinventService
              .getlistwithfourNotInvntQteEgal(this.codeFour, this.invent)
              .toPromise()
              .then((data) => {
                console.log('listewith four Non Inventaire qte =  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log(
                  'liste with four Non Inventaire qte =    ',
                  this.liste
                );
              });
          } else {
            // Non Inventaire tous
            await this.mouveinventService
              .getlistwithfourNotInvnt(this.codeFour, this.invent)
              .toPromise()
              .then((data) => {
                console.log('listewith four Non Inventaire tous  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log(
                  'liste with four Non Inventaire tous    ',
                  this.liste
                );
              });
          }
        } else if (this.rdbtnarticle === '2') {
          // inventaire
          if (this.rdbtnqte === '1') {
            // Inventaire qte <>
            await this.mouveinventService
              .getlistwithfourInvntQteDiff(this.codeFour, this.invent)
              .toPromise()
              .then((data) => {
                console.log('listewith four Inventaire qte <>  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with four Inventaire qte <>  ', this.liste);
              });
          } else if (this.rdbtnqte === '2') {
            // Inventaire qte =
            await this.mouveinventService
              .getlistwithfourInvntQteEgal(this.codeFour, this.invent)
              .toPromise()
              .then((data) => {
                console.log('listewith four Inventaire qte = ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with four Inventaire qte =', this.liste);
              });
          } else {
            // Inventaire tous
            await this.mouveinventService
              .getlistwithfourInvnt(this.codeFour, this.invent)
              .toPromise()
              .then((data) => {
                console.log('listewith four Inventaire tous  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with four Inventaire tous   ', this.liste);
              });
          }
        } else {
          // tous
          if (this.rdbtnqte === '1') {
            // tous qte <>
            await this.mouveinventService
              .getlistwithfourQteDiff(this.codeFour)
              .toPromise()
              .then((data) => {
                console.log('listewith four tous qte <> ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with four tous qte <>   ', this.liste);
              });
          } else if (this.rdbtnqte === '2') {
            // tous qte =
            await this.mouveinventService
              .getlistwithfourQteEgal(this.codeFour)
              .toPromise()
              .then((data) => {
                console.log('listewith four tous qte = ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with four tous qte =   ', this.liste);
              });
          } else {
            // tous
            await this.mouveinventService
              .getlistwithfour(this.codeFour)
              .toPromise()
              .then((data) => {
                console.log('listewith four ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with four   ', this.liste);
              });
          }
        }
        this.activer();
      } else {
        this.blockedDocument = false;
        this.msgs = 'Veuillez selectionner un fournisseur !';
        this.styleOvPanel = this.styleOvPanelError;
        // document.getElementById('client').focus();
        this.ov.show(e, document.getElementById('fournisseur'));
      }
    }
    if (this.btnemp) {
      if (
        this.emplacement !== '' &&
        this.emplacement !== null &&
        this.emplacement !== undefined
      ) {
        if (this.rdbtnarticle === '1') {
          // Non Inventaire
          if (this.rdbtnqte === '1') {
            // Non Inventaire qte <>
            await this.mouveinventService
              .getlistwithEmpNotInvntQteDiff(
                this.invent + ' ' + this.emplacement,
                this.invent
              )
              .toPromise()
              .then((data) => {
                console.log('liste with Emp non inventaire qte diff  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log(
                  'liste with Emp non inventaire qte diff  ',
                  this.liste
                );
              });
          } else if (this.rdbtnqte === '2') {
            // Non Inventaire qte =
            await this.mouveinventService
              .getlistwithEmpNotInvntQteEgal(
                this.invent + ' ' + this.emplacement,
                this.invent
              )
              .toPromise()
              .then((data) => {
                console.log('liste with Emp non inventaire qte egal  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log(
                  'liste with Emp non inventaire qte egal   ',
                  this.liste
                );
              });
          } else {
            // Non Inventaire tous
            await this.mouveinventService
              .getlistwithEmpNotInvnt(
                this.invent + ' ' + this.emplacement,
                this.invent
              )
              .toPromise()
              .then((data) => {
                console.log('liste with Emp Non Inventaire tous   ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with Emp Non Inventaire tous  ', this.liste);
              });
          }
        } else if (this.rdbtnarticle === '2') {
          // inventaire

          if (this.rdbtnqte === '1') {
            // Inventaire qte <>
            await this.mouveinventService
              .getlistwithEmpInvntQteDiff(
                this.invent + ' ' + this.emplacement,
                this.invent
              )
              .toPromise()
              .then((data) => {
                console.log('liste with Emp inventaire qte diff  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with Emp inventaire qte diff  ', this.liste);
              });
          } else if (this.rdbtnqte === '2') {
            // Inventaire qte =
            await this.mouveinventService
              .getlistwithEmpInvntQteEgal(
                this.invent + ' ' + this.emplacement,
                this.invent
              )
              .toPromise()
              .then((data) => {
                console.log('liste with Emp inventaire qte =  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with Emp inventaire qte =  ', this.liste);
              });
          } else {
            // Inventaire tous
            await this.mouveinventService
              .getlistwithEmpInvnt(
                this.invent + ' ' + this.emplacement,
                this.invent
              )
              .toPromise()
              .then((data) => {
                console.log('liste with Emp inventaire   ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with Emp inventaire  ', this.liste);
              });
          }
        } else {
          // tous
          if (this.rdbtnqte === '1') {
            // tous qte <>
            await this.mouveinventService
              .getlistwithEmpQteDiff(this.invent + ' ' + this.emplacement)
              .toPromise()
              .then((data) => {
                console.log('liste with Emp qte diff  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with Emp qte diff  ', this.liste);
              });
          } else if (this.rdbtnqte === '2') {
            // tous qte =
            await this.mouveinventService
              .getlistwithEmpQteEgal(this.invent + ' ' + this.emplacement)
              .toPromise()
              .then((data) => {
                console.log('liste with Emp qte egal  ', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with Emp qte egal   ', this.liste);
              });
          } else {
            // tous  tous
            await this.mouveinventService
              .getlistwithEmp(this.invent + ' ' + this.emplacement)
              .toPromise()
              .then((data) => {
                console.log('liste with Emp tous', data);
                this.liste = data['_embedded'].etatInventaires;
                console.log('liste with Emp tous  ', this.liste);
              });
          }
        }
        this.activer();
      } else {
        this.blockedDocument = false;
        this.msgs = 'Veuillez saisir un emplacement !';
        this.styleOvPanel = this.styleOvPanelError;
        // document.getElementById('client').focus();
        this.ov.show(e, document.getElementById('ngselectemplacement'));
      }
    }
    if (!this.btnemp && !this.btnfour) {
      if (this.rdbtnarticle === '1') {
        // Non Inventaire
        if (this.rdbtnqte === '1') {
          // Non Inventaire qte <>
          await this.mouveinventService
            .getlistNotInventQteDiff(this.invent)
            .toPromise()
            .then((data) => {
              console.log('liste tous qte diff  ', data);
              this.liste = data['_embedded'].etatInventaires;
              console.log('liste tous qte diff  ', this.liste);
            });
        } else if (this.rdbtnqte === '2') {
          // Non Inventaire qte =
          await this.mouveinventService
            .getlistNotInventQteEgal(this.invent)
            .toPromise()
            .then((data) => {
              console.log('liste tous qte diff  ', data);
              this.liste = data['_embedded'].etatInventaires;
              console.log('liste tous qte diff  ', this.liste);
            });
        } else {
          // Non Inventaire tous
          await this.mouveinventService
            .getlistNotInvent(this.invent)
            .toPromise()
            .then((data) => {
              console.log('liste tous qte diff  ', data);
              this.liste = data['_embedded'].etatInventaires;
              console.log('liste tous qte diff  ', this.liste);
            });
        }
      } else if (this.rdbtnarticle === '2') {
        // inventaire
        if (this.rdbtnqte === '1') {
          // Inventaire qte <>
          await this.mouveinventService
            .getlistInventQteDiff(this.invent)
            .toPromise()
            .then((data) => {
              console.log('liste tous qte diff  ', data);
              this.liste = data['_embedded'].etatInventaires;
              console.log('liste tous qte diff  ', this.liste);
            });
        } else if (this.rdbtnqte === '2') {
          // Inventaire qte =
          await this.mouveinventService
            .getlistInventQteEgal(this.invent)
            .toPromise()
            .then((data) => {
              console.log('liste tous qte diff  ', data);
              this.liste = data['_embedded'].etatInventaires;
              console.log('liste tous qte diff  ', this.liste);
            });
        } else {
          // Inventaire tous
          await this.mouveinventService
            .getlistInvent(this.invent)
            .toPromise()
            .then((data) => {
              console.log('liste tous qte diff  ', data);
              this.liste = data['_embedded'].etatInventaires;
              console.log('liste tous qte diff  ', this.liste);
            });
        }
      } else {
        // tous
        if (this.rdbtnqte === '1') {
          // tous qte <>
          await this.mouveinventService
            .getlistQteDiff()
            .toPromise()
            .then((data) => {
              console.log('liste tous qte diff  ', data);
              this.liste = data['_embedded'].etatInventaires;
              console.log('liste tous qte diff  ', this.liste);
            });
        } else if (this.rdbtnqte === '2') {
          // tous qte =
          await this.mouveinventService
            .getlistQteEgal()
            .toPromise()
            .then((data) => {
              console.log('liste tous qte =  ', data);
              this.liste = data['_embedded'].etatInventaires;
              console.log('liste tous qte = ', this.liste);
            });
        } else {
          // tous  tous
          await this.mouveinventService
            .getlistetatinventaire()
            .toPromise()
            .then((data) => {
              console.log('liste tous   ', data);
              this.liste = data['_embedded'].etatInventaires;
              console.log('liste tous  ', this.liste);
            });
        }
      }
      this.activer();
    }
    this.blockedDocument = false;
  }
  activer() {
    let val1 = 0;
    let val2 = 0;
    for (let i = 0; i < this.liste.length; i++) {
      this.liste[i].qt_inv = Number(this.liste[i].qt_inv);
      this.liste[i].qt_stk = Number(this.liste[i].qt_stk);
      val1 = val1 + Number(this.liste[i].val_stk);
      val2 = val2 + Number(this.liste[i].val_inv);
    }
    console.log('val1=', val1, 'val2=', val2);

    this.val_stk = val1.toFixed(3);
    this.val_in = val2.toFixed(3);

    this.btnaff = true;
    this.readonly = true;
  }
  ngOnInit() {
    this.mdpInventaire = 'invokok';
    this.mdpInvent = null;
    setTimeout(() => {
      document.getElementById('mdpInv').focus();
    }, 0);

    this.codeFour = '';
    this.val_stk = '';
    this.val_in = '';

  }
  Initialiser() {
    this.liste = new Array();
    this.selectedFour = new Array();
    this.rdbtnarticle = '0';
    this.rdbtnqte = '0';
  }

  afficherTous() {
    this.btnfour = false;
    this.btnemp = false;
    this.codeFour = '';
    this.selectedFour = new Array();
    this.emplacement = '';
    this.styleButtonFour = this.styleButtonNormal;
    this.styleButtonEmp = this.styleButtonNormal;
    this.styleButtonTout = this.styleButtonSelectionne;
  }

  afficherParEmp() {
    this.btnfour = false ;
    this.btnemp = true ;
    this.styleButtonFour = this.styleButtonNormal;
    this.styleButtonEmp = this.styleButtonSelectionne;
    this.styleButtonTout = this.styleButtonNormal;
    this.selectedFour = new Array() ;
    setTimeout(() => {
    document.getElementById('ngselectemplacement').focus();
  }, 10);
  }

  afficherParFour() {
    this.btnfour = true;
    this.btnemp = false;
    setTimeout(() => {
      this.ngselectfournisseur.focus();
    }, 10);
    this.emplacement = '';
    this.selectedFour = new Array();
    this.styleButtonFour = this.styleButtonSelectionne;
    this.styleButtonEmp = this.styleButtonNormal;
    this.styleButtonTout = this.styleButtonNormal;
  }

  NouvelleSaisie() {
    this.btnaff = false;
    this.btnNv = false;
    this.readonly = false;
    this.liste = new Array();
    this.btnemp = false;
    this.btnfour = false;
    this.rdbtnarticle = '0';
    this.rdbtnqte = '0';
    this.emplacement = '';
    this.codeFour = '';
    this.selectedFour = new Array();
    this.styleButtonTout = this.styleButtonSelectionne;
    this.styleButtonFour = this.styleButtonNormal;
    this.styleButtonEmp = this.styleButtonNormal;
  }

  excelExport() {
    console.log('exceeeeeeeel ******');

    if (this.liste.length !== 0) {
      const excelExportProperties: ExcelExportProperties = {
        fileName:
          'ListeEtatInventaire' +
          ' : ' +
          new Date().toLocaleDateString('en-GB') +
          '.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    }
  }
  async Apercu() {
    const doc1 = new jspdf();
    doc1.setFontSize(15);
     let temps = String(new Date().getUTCHours() + 1);
     temps = temps + ':' + String(new Date().getUTCMinutes());
     temps = temps + ':' + String(new Date().getUTCSeconds());
     console.log('datedu jour ', temps );
     await this.steService
    .getDateServeur()
    .toPromise()
    .then((data: string) => (this.dateServeur = new Date(data)));
     doc1.setFontStyle('bold');
     doc1.text('Etat Inventaire: '  + this.emplacement + '   Editée le  ' + this.dateServeur.toLocaleDateString()
     + '  ' + temps , 40, 15);
     doc1.setFontSize(9);
     // entete du  tableau
     doc1.setFontStyle('bold');
     doc1.line(1, 25, 209, 25);
     doc1.line(1, 25, 1, 277);
     doc1.line(209, 25, 209, 277);
     doc1.setTextColor(0, 0, 0);
     doc1.text('RG', 3, 30);
     doc1.text('Code', 10, 30);
     doc1.text('Designation', 40, 30);
     doc1.text('Fournisseur', 97, 30);
     doc1.text('Qtinv', 160, 30 , 'right');
     doc1.text('QtStk', 170, 30 , 'right');
     doc1.text('Emplacements', 200, 30 , 'right');
     // creer la ligne
     doc1.line(1, 33, 209, 33);
     let y = 37;
     let  numPage = 1;
        for (let i = 0 ; i < this.liste.length ; i++) {
         doc1.setFontSize(9);
         doc1.setFontStyle('Arial');
         doc1.text(String(i + 1), 3, y);
         doc1.text(this.liste[i].code, 10, y);
         doc1.text(this.liste[i].designation, 40, y);
         doc1.text(this.liste[i].fournisseur, 97, y);
         doc1.text(String(this.liste[i].qt_inv), 160, y, 'right');
         doc1.text(String(this.liste[i].qt_stk), 170, y, 'right');
         if ( this.liste[i].emplacement !== null ) {
          doc1.text(this.liste[i].emplacement, 180, y );
         } else {
          doc1.text('', 180, y );
         }


         y = y + 7;
         if (y > 277) {
           doc1.line(1, 277, 209, 277);
           doc1.setFontSize(9);
           doc1.setFontStyle('bold');
           doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
           numPage++;
           doc1.addPage();
           doc1.line(1, 12, 209, 12);
           doc1.line(1, 12, 1, 277);
           doc1.line(209, 12, 209, 277);
           doc1.setFontStyle('bold');
           doc1.setTextColor(0, 0, 0);
           doc1.text('RG', 3, 17);
           doc1.text('Code', 10, 17);
           doc1.text('Designation', 40, 17);
           doc1.text('Fournisseur', 97, 17);
           doc1.text('Qtinv', 160, 17 , 'right');
           doc1.text('QtStk', 170, 17 , 'right');
           doc1.text('Emplacements', 200, 17 , 'right');
           // creer la ligne
           // creer la ligne
           doc1.setFontStyle('bold');
           doc1.line(1, 20, 209, 20);
           y = 24;
         }

       }

       doc1.line(1, 277, 209, 277);
       doc1.setFontSize(9);
       doc1.setFontStyle('bold');
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
       window.open(doc1.output('bloburl'), '_blank');
  }
/*
  async Apercu() {
    const doc1 = new jspdf();
    doc1.setFontSize(15);
     let temps = String(new Date().getUTCHours() + 1);
     temps = temps + ':' + String(new Date().getUTCMinutes());
     temps = temps + ':' + String(new Date().getUTCSeconds());
     console.log('datedu jour ', temps );
     await this.steService
    .getDateServeur()
    .toPromise()
    .then((data: string) => (this.dateServeur = new Date(data)));
     doc1.setFontStyle('bold');
     doc1.text('Etat Inventaire: '  + this.emplacement + '   Editée le  ' + this.dateServeur.toLocaleDateString()
     + '  ' + temps , 40, 15);
     doc1.setFontSize(9);
     // entete du  tableau
     doc1.setFontStyle('bold');
     doc1.line(1, 25, 209, 25);
     doc1.line(1, 25, 1, 277);
     doc1.line(209, 25, 209, 277);
     doc1.setTextColor(0, 0, 0);
     doc1.text('RG', 3, 30);
     doc1.text('Code', 8, 30);
     doc1.text('Designation', 38, 30);
     doc1.text('Fournisseur', 90, 30);
     doc1.text('Qtinv', 160, 30 , 'right');
     doc1.text('QtStk', 170, 30 , 'right');
     doc1.text('Emplacements', 200, 30 , 'right');
     // creer la ligne
     doc1.line(1, 33, 209, 33);
     let y = 37;
     let  numPage = 1;
        for (let i = 0 ; i < this.liste.length ; i++) {
         doc1.setFontSize(9);
         doc1.setFontStyle('Arial');
         doc1.text(String(i + 1), 3, y);
         doc1.text(this.liste[i].code, 8, y);
         doc1.text(this.liste[i].designation, 38, y);
         doc1.text(this.liste[i].fournisseur, 90, y);
         doc1.text(String(this.liste[i].qt_inv), 160, y, 'right');
         doc1.text(String(this.liste[i].qt_stk), 170, y, 'right');
         if ( this.liste[i].emplacement !== null ) {
          doc1.text(this.liste[i].emplacement, 180, y );
         } else {
          doc1.text('', 180, y );
         }


         y = y + 7;
         if (y > 277) {
           doc1.line(1, 277, 209, 277);
           doc1.setFontSize(9);
           doc1.setFontStyle('bold');
           doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
           numPage++;
           doc1.addPage();
           doc1.line(1, 12, 209, 12);
           doc1.line(1, 12, 1, 277);
           doc1.line(209, 12, 209, 277);
           doc1.setFontStyle('bold');
           doc1.setTextColor(0, 0, 0);
           doc1.text('RG', 3, 17);
           doc1.text('Code', 8, 17);
           doc1.text('Designation', 38, 17);
           doc1.text('Fournisseur', 90, 17);
           doc1.text('Qtinv', 160, 17 , 'right');
           doc1.text('QtStk', 170, 17 , 'right');
           doc1.text('Emplacements', 200, 17 , 'right');
           // creer la ligne
           // creer la ligne
           doc1.setFontStyle('bold');
           doc1.line(1, 20, 209, 20);
           y = 24;
         }

      y = y + 7;
      if (y > 277) {
        doc1.line(1, 277, 209, 277);
        doc1.setFontSize(12);
        doc1.setFontStyle('bold');
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        numPage++;
        doc1.addPage();
        doc1.line(1, 12, 209, 12);
        doc1.line(1, 12, 1, 277);
        doc1.line(209, 12, 209, 277);
        doc1.setFontStyle('bold');
        doc1.setTextColor(0, 0, 0);
        doc1.text('RG', 2, 17);
        doc1.text('Code', 10, 17);
        doc1.text('Designation', 50, 17);
        doc1.text('Fournisseur', 100, 17);
        doc1.text('Qtinv', 140, 17, 'right');
        doc1.text('QtStk', 170, 17, 'right');
        doc1.text('Emplacements', 205, 17, 'right');
        // creer la ligne
        // creer la ligne
        doc1.setFontStyle('bold');
        doc1.line(1, 20, 209, 20);
        y = 24;
      }
    }

       doc1.line(1, 277, 209, 277);
       doc1.setFontSize(9);
       doc1.setFontStyle('bold');
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
       window.open(doc1.output('bloburl'), '_blank');
  }*/
  public dataBound(args): void {

  }
}
