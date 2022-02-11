import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { StockService } from '../services/stock.service';
import { ConfirmationService } from 'primeng/api';
import { AchService } from '../services/ach.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { CommandeService } from '../services/commande.service';
import { CommandService } from '../services/command.service';
import { AchatService } from '../services/achat.service';
import {MouveService } from '../services/mouve.service';
import {Mouve } from '../services/mouve';
import { Table } from 'primeng/table';
import * as jspdf from 'jspdf';
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
  selector: 'app-avoir-sur-achat',
  templateUrl: './avoir-sur-achat.component.html',
  styleUrls: ['./avoir-sur-achat.component.scss'],
  providers: [ConfirmationService],
})
export class AvoirSurAchatComponent implements OnInit {
  // declaration des variables ( attributs)
  wasInsideDialogCMD = false;
  blockedDocument: boolean;
  hiddenNouvSaisie: boolean;
  adresseFour: string;
  msg: string;
  readonly: boolean;
  showModAch: boolean;
  refAchat;
  dateAchat: Date = new Date();
  tn;
  listeFournisseur: any;
  selectedFour;
  codeFour: string;
  devis: string;
  wasInside: boolean;
  clickAficher: boolean;
  @ViewChild('dt')
  public table: Table;
  @ViewChild('op')
  public op: OverlayPanel;
  listeAchats = new Array();
  TotalBrut;
  disabledAficher: boolean;
  listeStocks = new Array();
  refArticle;
  ach: any;
  typeFour = null;
  readonlyDevis = false;
  selectedArticle;

  hiddenCoefAch = true;
  showConfirm: boolean;
  disable: boolean;

  // details achat
  showDetAch = false;
  quantite;
  prix;
  coefVente;
  prixAch;
  codeArt;
  designArt;
  hiddenValider: boolean;
  @ViewChild('gridstock')
  public gridstock: GridComponent;

  @ViewChild('gridCmd')
  public gridCmd: GridComponent;



  hiddenTaux = false;
  listeArtCmd: any[];
  numcmd: any;
  qtecmd: any;

  verifArt: boolean;
  afficherDetailsArt: boolean;
  ngIfcoefAchLoc: boolean;
  showVerifQteCmd: boolean;
  frs: any;
  refFour: any;
  societe: any;
  listeCommandes: any[];
  achDb: any;
  afficherBtnImpr: boolean;

  total = '0.000';

  selectedCmd: any;
  selectedRowIndexCMD: number;
  selectedRowIndex: number;
  totalDev: number;
 // errorTable: any;

  constructor(
    private loginService: LoginService,
    private fournisseurService: FournisseurService,
    private stockService: StockService,
    private achService: AchService,
    private achatService: AchatService,
    private config: NgSelectConfig,
    private confirmationService: ConfirmationService,
    private commandeService: CommandeService,
    private commandService: CommandService,
    private mouveService: MouveService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
     this.fournisseurService
    .findByOrderByDeno()
    .toPromise()
    .then((data) => {
      this.listeFournisseur = data['_embedded'].fournisseurs;
      console.log('fournisseurs liste  ', data);
    });


  }

  @HostListener('document:keydown.enter', ['$event'])
  async onKeydownHandler(event: KeyboardEvent) {
    this.wasInside = true;
    this.op.hide();
    if (this.gridCmd !== undefined && this.showConfirm && this.gridCmd !== null) {
      if (this.gridCmd.getRowInfo(event.target).rowData !== undefined) {
        this.gridCmd.selectRows([this.gridCmd.getRowInfo(event.target).rowIndex]);
        console.log( 'CLICK OK   onKeydownHandler '  );
        await this.clickOKCommande(event);
       }
      }
      setTimeout(() => {
        this.selectedRowIndexCMD = 0;
        this.selectedRowIndex = 0;
     }, 150);
    if (this.gridstock !== undefined) {
      this.gridstock.selectedRowIndex = 0;
      if (this.gridstock.getRowInfo(event.target).rowData !== undefined) {

        await this.doubleclickStock(event);
        this.gridstock.selectRows([this.gridstock.getRowInfo(event.target).rowIndex]);
      }
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  async onKeydownHandlerCMD(event: KeyboardEvent) {
    this.op.hide();
      // this.wasInsideDialogCMD = true;
     //  console.log('was inside grid cmd ', this.wasInsideDialogCMD );
    // console.log('selected  cmd ', this.selectedCmd  );
    if ( this.wasInsideDialogCMD && (this.selectedCmd !== null && this.selectedCmd !== undefined )  ) {
      console.log( 'CLICK OK   onKeydownHandlerCMD '  );
      await this.clickOKCommande(event);

     if (this.gridCmd .getRowInfo(event.target).rowData !== undefined) {
        this.gridCmd.selectRows([this.gridCmd.getRowInfo(event.target).rowIndex]);
       }
      }

  }


   async onKeydown(event: KeyboardEvent) {
      this.op.hide();
     if (this.gridCmd !== undefined && this.showConfirm && this.gridCmd !== null) {
    if (this.gridCmd .getRowInfo(event.target).rowData !== undefined) {
      this.gridCmd.selectRows([this.gridCmd.getRowInfo(event.target).rowIndex]);
      console.log( 'CLICK OK   onKeydown '  );
      await this.clickOKCommande(event);

     }
    }
  }






  calculTot() {
    let tot = 0;
   if (this.listeAchats.length > 0) {
     this.totalDev = 0 ;
     for (const obj of this.listeAchats) {
       const qt = Number(obj.qte);
       const pr = Number(obj.prix);
       this.totalDev = this.totalDev + (qt * pr );
       const coefAch = Number(obj.coefAch);
      if (obj.coefAch !== null && obj.coefAch !== undefined) {
     //   tot = tot + ( qt * pr * coefAch)  ;
         tot = tot + ( qt * pr )  ;
        }

      }
      // this.totalDev =  this.totalDev.toFixed(3);
    this.total = tot.toFixed(3);
   }
   }




async updateDB() {
  await this.achService.getAchList()
  .toPromise()
  .then((data) => {
    this.achDb = data['_embedded'].ach[0];
    this.ach = data['_embedded'].ach[0].numero;
    console.log('numero achat courant ', this.ach);
  });
    const numAch = Number(this.ach) + 1;
    const strach = String(numAch);
    this.refAchat = this.formNumAch(strach);
  this.blockedDocument = true;
  if ( this.refAchat !== null &&  this.refAchat !== undefined) {

  this.achDb.numero = this.refAchat;
  const ach = this.achDb;
  await this.achService.putAch(ach)
  .toPromise()
  .then(data => {
      console.log('create Ach ', data );
  }) ;
  const achat = {
    id: null,
    numero: null,
    date: null,
    operateur: null,
    devise: null,
    totDev: null,
    totDt: null,
    ref: null
  };
  achat.numero = 'AVOIR/F  ' + this.refAchat;
  achat.date = this.dateAchat.toLocaleDateString('en-GB');
  achat.operateur = this.codeFour;
  achat.devise = this.devis;
  achat.ref = this.refFour;
  achat.totDt = this.total;
  achat.totDev = this.totalDev;
  await this.achatService.createAchat(achat)
       .toPromise()
       .then(data => {
          console.log('create achat ', data);
       }) ;
}

  let i = 0;
  for (const art of this.listeAchats) {
    //  await this.ach
    i++;
  const mouve: Mouve = {
           id: null,
           combine : null,
           code : null,
           quantite : null,
           tRemise: null,
           prix: null,
           date: null,
           operateur : null,
           sens: null,
           tauxTva: null,
           base: null,
           achat: null,
           codeAimprimer: null,
           rang: null,
           numbc: null,
           autPrix: null,
           totalbrut: null,
           qtEnt: null,
           prixArt: null,
           qtOffre: null,
           designation: null

          };
  mouve.combine = 'AVOIR/F  ' + this.refAchat ;
  mouve.date = this.dateAchat.toLocaleDateString('en-GB');
  mouve.operateur = this.codeFour;
  mouve.sens = 'C';
 // mouve.numbc = art.commande;
  mouve.code = art.code;
  mouve.quantite = art.qte;
  mouve.tRemise = '0.0';
  mouve.tauxTva = '0';
  mouve.achat = art.prixA;

  mouve.base = art.prix;
  mouve.prix = art.pV;

console.log('mouve.totalbrut   ', mouve.totalbrut);
console.log('mouve        ', mouve);

  await this.mouveService.createMouve(mouve)
     .toPromise()
     .then(data => {
       console.log('create mouve ', data );
     });


const qte =  Number(art.ancQT) - Number(art.qte) ;
const qauantite = String(qte);
console.log('Anc prixxxxxxxxxxxxxxxxxxx ', art.ancPV);
let prix = '';
let achat = '';
if (  Number(art.ancPV) < Number (art.pV)) {
  prix =    Number (art.pV).toFixed(3);
  achat =   Number (art.prixA).toFixed(3);
  console.log('ancien achat  art.prixA avant update  ', art.prixA);
  console.log('ancien achat  avant update  ', achat);
  console.log('ancien prix avant update  ', prix);
// *********************************************************************** */
} else {
  prix = Number(art.ancPV).toFixed(3);
  achat =   Number (art.achat).toFixed(3);
  console.log('ancien achat  art.achat avant update  ', art.achat);
  console.log('ancien achat  art.achat avant update  ', achat);
}

const prixAch = Number(art.prixA).toFixed(3);
console.log('ancien achattttttttttt avant update  ', achat);



// tslint:disable-next-line:max-line-length
await this.stockService.updateQuantiteStockAvoir(qauantite, prix, achat, this.devis, art.prix, prixAch , this.dateAchat.toLocaleDateString('en-GB'), art.code)
    .toPromise()
    .then(data => {
      console.log('updateQuantiteStock Avoir ', data);
    });

if (art.commande !== null || art.commande !== undefined || art.commande) {
    await this.commandeService.updateQuantiteCmdAvoir(art.qte, art.commande, art.code)
          .toPromise()
          .then(data => {
            console.log('updateQuantiteCmd Avoir ', data);
          });
    await this.commandeService.getListeCommandeByNumCmdAchat(art.commande)
    .toPromise()
    .then(data => {
      console.log('getListeCommandeByNumCmdAvoir  ', data['_embedded'].commandes);
      this.listeCommandes = new Array();
      this.listeCommandes = data['_embedded'].commandes;
    });
  if (this.listeCommandes.length === 0) {
    const purcmd = 'O';
    await this.commandService.updateCommandAchat(purcmd, this.dateAchat.toLocaleDateString('en-GB'), art.commande)
    .toPromise()
    .then(data => {
      console.log('updateCommandAvoir empty listeCommandes', data);
    });
  } else {
    const purcmd = 'P';
    await this.commandService.updateCommandAchat(purcmd, this.dateAchat.toLocaleDateString('en-GB'), art.commande)
    .toPromise()
    .then(data => {
      console.log('updateCommandAvoir is not empty listeCommandes ', data);
    });
  }

}

  }

  await this.loginService
  .procedureStockeModule(
    localStorage.getItem('login'),
    globals.selectedMenu,
    'Avoir ' + this.refAchat
  )
  .toPromise().then((data) => {
    console.log('procedureStockeModule ', data);
  });
// this.blockedDocument = false;
  this.confirmationService.confirm({
    message: 'Avoir/F est enregistré avec succes : Numero = ' + this.refAchat + ' , Voulez vous consulter !! ',
    header: 'Confirmer l\'avoir ',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Oui',
    rejectLabel: 'Non',
    accept: async () => {

       await this.imprimer();

     /*  setTimeout(() => {
       this.afficherBtnImpr = false;
    }, 0);*/
    },
    reject: () => {

    },
  });



  this.afficherBtnImpr = true;
}
async valider(e) {
  if (this.listeAchats.length > 0 ) {
    this.confirmationService.confirm({
      message: 'Etes vous sûr de vouloir valider l\'avoir ',
      header: 'Confirmer l\'avoir ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {

         await this.updateDB();

       /*  setTimeout(() => {
         this.afficherBtnImpr = false;
      }, 0);*/
      },
      reject: () => {

      },
    });
  }
}


async imprimer() {
  /// créer doc jspdf
  const doc1 = new jspdf();
  doc1.setFontSize(12);
  doc1.setFontStyle('Arial');
  const combine = 'AVOIR/F  ' + this.refAchat;
// const combine = 'ACHAT    27794';
  let liste = new Array();
  await this.mouveService.getAchatByCombine(combine)
     .toPromise()
     .then(data => {
      liste = data['_embedded'].mouves;
     });
     console.log('liiiiiste ', liste );


  // this.societe = globals.societe;
  this.societe = globals.societe;

 doc1.text('SOCIETE.:  ' + this.societe, 9, 15);

 doc1.setFontSize(22);
 doc1.setFontStyle('bold');
 doc1.setFontStyle('Arial');

 doc1.setTextColor(0, 51, 153);
 doc1.text('AVOIR/F N°  ' + this.refAchat , 72, 30);
 doc1.setTextColor(48, 48, 48);
 doc1.setFontSize(12);
 doc1.setFontStyle('bold');
 doc1.setFontStyle('Arial');
 doc1.text('Le : ' + this.dateAchat.toLocaleDateString('en-GB') , 160, 30) ;

 doc1.text('Fournisseur : ' + this.selectedFour.deno , 9, 40) ;
 doc1.text('Facture  :  ' + this.refFour  , 9, 47) ;

 /// entete tableau
 doc1.setFontSize(10);
 doc1.setFontStyle('bold');
 doc1.line(9, 60, 205, 60);

   doc1.text('Référence', 10, 65);
   doc1.text('Désignation', 50, 65);
   doc1.text('Quantite', 130, 65);
   doc1.text('Prix Devi', 160, 65);
   doc1.text('Prix ', 190, 65);
   doc1.line(9, 70, 205, 70);

   //// cors du tableau
   let y = 75;
   doc1.setFontSize(9);
   doc1.setFontStyle('Arial');

   for (const ach of liste) {
     if (ach.base !== null && ach.base !== undefined  ) {
      ach.base = Number(ach.base).toFixed(2);
     } else {
      ach.base = '';
     }

     if (ach.prix !== null && ach.prix !== undefined  ) {
      ach.prix = Number(ach.prix).toFixed(3);
     } else {
      ach.prix = '';
     }
     if (ach.prixArt !== null && ach.prixArt !== undefined  ) {
      ach.prixArt = Number(ach.prixArt).toFixed(3);
     } else {
      ach.prixArt = '';
     }

     if (ach.quantite !== null && ach.quantite !== undefined  ) {
      ach.quantite = Number(ach.quantite).toFixed(1);
     // totBrut = totBrut + (Number(ach.quantite) * Number(ach.prix) );
     } else {
      ach.quantite = '';
     }

   doc1.text(ach.code, 11, y);
   doc1.text(ach.designation, 51, y);
   doc1.text(ach.quantite, 140, y, 'right');
   doc1.text(ach.base, 175, y, 'right');
   doc1.text(ach.prix, 200, y, 'right');

   y = y + 6;
   }
   doc1.line(9, y, 205, y);
   y = y + 6;
   doc1.setFontSize(12);
   doc1.setFontStyle('bold');
   doc1.text('Total   :  ', 60, y, );
   doc1.text(this.totalDev + ' ' + this.devis, 100, y, 'right');
   y = y + 6;
   doc1.line(9, y, 205, y);
   doc1.line(9, 60, 9, y  );
   doc1.line(205, 60, 205, y );




       doc1.setFontSize(7);
       doc1.setFontStyle('Arial');

       y = y + 6;
       if (y > 277) {

         doc1.addPage();
         doc1.line(9, 12, 205, 12);
         doc1.setFontSize(10);
         doc1.setFontStyle('bold');
         doc1.text('Référence', 10, 17);
         doc1.text('Désignation', 50, 17);
         doc1.text('Quantite', 140, 17);
         doc1.text('Prix Devi', 160, 17);
         doc1.text('Prix ', 190, 17);

         doc1.line(9, 70, 205, 17);
    // creer la ligne
      doc1.setFontStyle('bold');
      doc1.line(9, 20, 205, 20);
      y = 26;

   }
   doc1.setFontSize(10);
   doc1.setFontStyle('bold');


   window.open(doc1.output('bloburl'), '_blank');

}


@HostListener('document:click')
clickout() {
  if (!this.wasInside) {
    this.op.hide();
    let j = 0;
    for (const obj of this.listeAchats) {
      let e: any;
      j++;

      if (obj.qte !== null
        && obj.qte !== undefined
        && Number(obj.qte) > 0
        && obj.prix !== null &&
        obj.prix !== undefined &&
          Number(obj.prix) > 0 &&
          obj.coefAch !== null &&
          obj.coefAch !== undefined &&
          Number(obj.coefAch) > 0 &&
          obj.coefV !== null &&
          obj.coefV !== undefined &&
          Number(obj.coefV) > 0  ) {

            if  (Number(obj.ancQT) < Number(obj.qte)) {
              this.hiddenValider = true;
                    this.msg = 'Quantité En Stock insuffisante ! ';
            //  console.log('quantiteee ', data.qte );
                setTimeout(() => {

              document.getElementById(`row_${j}_qte`).click();
              document.getElementById(`row_${j}_qte`).focus();
              this.op.show(e, document.getElementById(`row_${j}_qte`));
               }, 150);
              } else {

            if (Number(obj.coefAch) >= Number(obj.coefV)
            ) {
              this.verifArt = true;
              this.hiddenValider = true;
              this.msg =
                'Coefficient de vente doit être supérieur à  ' + obj.coefAch + ' !!';
                setTimeout(() => {
                  this.op.show(e, document.getElementById(`row_${j}_coefV`));

                document.getElementById(`row_${j}_coefV`).click();
                document.getElementById(`row_${j}_coefV`).focus();
                   }, 0);
            } else {
              obj.coefV = Number(obj.coefV).toFixed(6);
              this.calculTot();
              this.hiddenValider = false;
            }

          }

           } else {
            }}
  }
  this.wasInside = false;
}



async onKeydownEnterStock(event: KeyboardEvent) {
  if (this.gridstock !== undefined) {
    if (this.gridstock.getRowInfo(event.target).rowData !== undefined) {
     await this.doubleclickStock(event);
      this.gridstock.selectRows([this.gridstock.getRowInfo(event.target).rowIndex]);
      setTimeout(() => {
       this.selectedRowIndexCMD = 0;
    }, 150);

    }
  }
}
  onRowEditSave(data, index, e) {
       this.disable = false;
       this.wasInside = true;
       if (data.qte === null
        || data.qte === undefined
        || Number(data.qte) <= 0
        || data.prix === null ||
          data.prix === undefined ||
          Number(data.prix) <= 0 ||
          data.coefAch === null ||
          data.coefAch === undefined ||
          Number(data.coefAch) <= 0 ||
          data.coefV === null ||
          data.coefV === undefined ||
          Number(data.coefV) <= 0  ) {
            this.hiddenValider = true;
            this.table.initRowEdit(data);
            this.msg = 'Tous les champs sont obligatoires et de valeur postive  ! ';
            this.op.show(e);
       } else {


        if  (Number(data.ancQT) < Number(data.qte)) {
          this.hiddenValider = true;
                this.msg = 'Quantité En Stock insuffisante ! ';
        //  console.log('quantiteee ', data.qte );
            setTimeout(() => {

          document.getElementById(`row_${index}_qte`).click();
          document.getElementById(`row_${index}_qte`).focus();
          this.op.show(e, document.getElementById(`row_${index}_qte`));
           }, 150);
        } else {
            //  data.pVCalc = Number(data.prix) * Number(data.coefV);$
            const p = Number(data.prix);
            const c = Number(data.coefV);
           const pV = p * c;

            data.pV = pV.toFixed(3);

          const qte =  Number(data.qte);
          const coefAch = Number(data.coefAch);
        const totDt = p * qte * coefAch ;
        data.totDt = totDt.toFixed(3);
        /* const ancPV = Number(data.ancPV);
         const ancQT = Number(data.ancQT);
         console.log('prix  ', p);
         console.log('qte  ', qte);
         console.log('ancPV  ', ancPV);
         console.log('ancQT  ', ancQT);*/

/*
          const nouvPV = (( pVCal * qte) + ( ancPV * ancQT)) / (qte + ancQT);
          data.nouvPV = Number(nouvPV).toFixed(3);

                         console.log('nou PV ', data.nouvPV );

            const ste  = globals.societe;
          if (Number(data.ancPV) < Number(data.ancPV) && ((ste === 'CHAMAM DIVISION GROS')
                                                      || (ste === 'EQUIPEMENT MODERNE AUTOMOTIVE')
                                                      || (ste === 'EQUIPEMENT MODERNE F.INDUSTRIE')
                                                      )) {
            data.nouvPV = Number(data.pVCalc);
          }

          if (Number(data.ancPV) >= Number(data.ancPV)
          && ((ste === 'CHAMAM DIVISION GROS') || (ste === 'EQUIPEMENT MODERNE AUTOMOTIVE') )) {
           data.nouvPV = Number(data.ancPV);
          }


          */


      /*    if (Number(data.ancPV) >= Number(data.pVCalc)) {
            data.nouvPV = Number(data.ancPV).toFixed(3);
           } else {
             data.nouvPV = Number(data.pVCalc).toFixed(3);
           }
*/
           this.changeCoefAch(data);
         //  console.log('nouvPV  ', data.nouvPV);
           this.hiddenValider = false;
           this.table.cancelRowEdit(data);
           this.calculTot();
       }}
  }
  verifQteCommande() {
    this.showVerifQteCmd = false;
  }




  annulerSaisie(col, data, id, e ) {

    console.log('column  ', col );
    console.log('data  ', data);
    console.log('id ', id);

    this.wasInside = true;
    this.op.hide();
    if (
     ( data === null ||
      data === undefined ||
      Number(data) <= 0) && (this.showConfirm === false)
    ) {
     this.msg = col + ' est obligatoire, doit être une valeur positive ! ';
     this.hiddenValider = true;
      setTimeout(() => {
   if (id !== null && id !== undefined) {
     const a = document.getElementById(id) ;
     if (a !== null && a !== undefined) {

        document.getElementById(id).click();
        document.getElementById(id).focus();
        this.op.show(e, document.getElementById(id));
     }
      }

    }, 150);
    } else {
      this.op.hide();
    }



  }


  verifQte(data, index, e) {
    // console.log('eeeeeeeeeeeeee', e);
    this.disable = true;
    this.wasInside = true;
    this.op.hide();

    if (data.qte === null || data.qte === undefined || Number(data.qte) <= 0 ) {
      if (this.showConfirm ) {
        setTimeout(() => {
          document.getElementById(`row_${index}_qte`).click();
           }, 0);
      } else {

        this.msg = 'Quantité est obligatoire, doit être une valeur positive ! ';
        console.log('quantiteee ', data.qte );
          setTimeout(() => {
        this.op.show(e, document.getElementById(`row_${index}_qte`));
      //  this.op.show(e, document.getElementById(`row_${index}_qte`));
        document.getElementById(`row_${index}_qte`).click();
         }, 0);
      }


    } else {

      console.log('else verif qte', data.commande);
      if  (Number(data.ancQT) < Number(data.qte)) {
        this.hiddenValider = true;
              this.msg = 'Quantité En Stock insuffisante ! ';
              // data.qte = data.ancQT;
      //  console.log('quantiteee ', data.qte );
          setTimeout(() => {

        document.getElementById(`row_${index}_qte`).click();
        document.getElementById(`row_${index}_qte`).focus();
        this.op.show(e, document.getElementById(`row_${index}_qte`));
         }, 150);
      } else {
        if (data.commande !== null && data.commande !== undefined) {
          console.log('qte rest   ', this.quantite );

          if (Number(data.qte) > Number(this.quantite)) {
            this.confirmationService.confirm({
              message: 'Quantité Supérieur au restant à livrer !',
              header: 'Verifier la quantité commandée ',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'Oui',
              rejectLabel: 'Non',
              accept: async () => {
                data.qte = Number(this.quantite).toFixed(1);
                this.changePrixArt(data);
                this.calculTot();
                setTimeout(() => {
                  document.getElementById(`row_${index}_prix`).click();
                  document.getElementById(`row_${index}_prix`).focus();
              }, 0);

              },
              reject: () => {
                data.qte = this.quantite;
                data.qte = Number(data.qte).toFixed(1);
                this.changePrixArt(data);
                this.calculTot();
                setTimeout(() => {
                  document.getElementById(`row_${index}_prix`).click();
                  document.getElementById(`row_${index}_prix`).focus();

              }, 0);
              },
            });
          } else {


              data.qte = Number(data.qte).toFixed(1);
              this.changePrixArt(data);
              this.calculTot();
              setTimeout(() => {
                document.getElementById(`row_${index}_prix`).click();
                document.getElementById(`row_${index}_prix`).focus();
            }, 100);

          }
        } else {

          data.qte = Number(data.qte).toFixed(1);
          if (data.prix === null ) {
            setTimeout(() => {
                    document.getElementById(`row_${index}_prix`).click();
                    document.getElementById(`row_${index}_prix`).focus();
                }, 0);
      } else {
        this.changePrixArt(data);
        this.calculTot();
      }
        }
      }




    }
  }

  /*verifQte(data, index, e) {
    // console.log('eeeeeeeeeeeeee', e);
    this.disable = true;
   // this.hiddenValider = true;
    this.wasInside = true;
    this.op.hide();
    if (data.qte === null || data.qte === undefined || Number(data.qte) <= 0 ) {

      this.hiddenValider = true;
      if (this.showConfirm ) {
        setTimeout(() => {
          document.getElementById(`row_${index}_qte`).click();
           }, 0);
      } else {
        this.msg = 'Quantité est obligatoire, doit être une valeur positive ! ';
        console.log('quantiteee ', data.qte );
          setTimeout(() => {
        this.op.show(e, document.getElementById(`row_${index}_qte`));
      //  this.op.show(e, document.getElementById(`row_${index}_qte`));
        document.getElementById(`row_${index}_qte`).click();
         }, 0);
      }

    } else {
      console.log('else verif qte', data.commande);
    if (Number(data.qte) > Number(data.ancQT)) {
      this.hiddenValider = true;
         this.msg = 'Quantité En Stock insuffisante ! ';
          console.log('quantiteee ', data.qte );
        setTimeout(() => {
      this.op.show(e, document.getElementById(`row_${index}_qte`));
    //  this.op.show(e, document.getElementById(`row_${index}_qte`));
      document.getElementById(`row_${index}_qte`).click();
       }, 0);
    } else {
      console.log('else verif qte', data.commande);
      this.hiddenValider = true;
      if (data.commande !== null && data.commande !== undefined) {
        if (Number(data.qte) > Number(this.quantite)) {
          this.confirmationService.confirm({
            message: 'Quantité Supérieur au restant à livrer !',
            header: 'Verifier la quantité commandée ',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: async () => {
              data.qte = Number(data.qte).toFixed(1);
              this.changePrixArt(data);
              this.calculTot();
              setTimeout(() => {
                document.getElementById(`row_${index}_prix`).click();
                document.getElementById(`row_${index}_prix`).focus();
            }, 0);

            },
            reject: () => {
              data.qte = this.quantite;
              data.qte = Number(data.qte).toFixed(1);
              this.changePrixArt(data);
              this.calculTot();
              setTimeout(() => {
                document.getElementById(`row_${index}_prix`).click();
                document.getElementById(`row_${index}_prix`).focus();

            }, 0);
            },
          });
        } else {
          if (data.prix === null ) {
            setTimeout(() => {
              document.getElementById(`row_${index}_prix`).focus();
          }, 0);
          } else {
            data.qte = Number(data.qte).toFixed(1);
            this.changePrixArt(data);
            this.calculTot();
          }
        }
      } else {

        data.qte = Number(data.qte).toFixed(1);
        if (data.prix === null ) {
          setTimeout(() => {
                  document.getElementById(`row_${index}_prix`).click();
                  document.getElementById(`row_${index}_prix`).focus();
              }, 0);
    } else {
      if (data.qte === null
        || data.qte === undefined
        || Number(data.qte) <= 0
        || data.prix === null ||
          data.prix === undefined ||
          Number(data.prix) <= 0 ||
          data.coefAch === null ||
          data.coefAch === undefined ||
          Number(data.coefAch) <= 0 ||
          data.coefV === null ||
          data.coefV === undefined ||
          Number(data.coefV) <= 0  ) {
            this.hiddenValider = true;
            this.table.initRowEdit(data);
            this.msg = 'Tous les champs sont obligatoires et de valeur postive  ! ';
            this.op.show(e);
       } else {
        this.hiddenValider = false;
       }

      this.changePrixArt(data);
      this.calculTot();
    }
      }
    }
    }
  }*/





  changeCoefAch(data) {
    let prixAch = 0;
      prixAch = Number(data.prix) * Number(data.coefAch);
      data.prixA = prixAch.toFixed(3);

  }

  changePrixArt(data) {
        const tot = Number(data.qte) * Number(data.prix) * Number(data.coefAch);
        data.totDt = tot.toFixed(3);
        const  prixAch = Number(data.prix) *  Number(data.coefAch);
        data.prixA = prixAch.toFixed(3);
        const prixVent = Number(data.prix) * Number(data.coefV ) ;
        data.pV = prixVent.toFixed(3);

    }














 /* changePrixArt(data) {
    if (this.typeFour === 'L') {
      const tot = Number(data.qte) * Number(data.prix);
      data.totDt = tot.toFixed(3);
      const  prixAch = Number(data.prix) * (1 - Number(data.coefAch) * 0.01);
      data.prixA = prixAch.toFixed(3);
     if (this.frs === 'P' ) {
       data.prixA =  Number(data.prix).toFixed(3);
    //   data.pVCalc = Number(data.prix) * (1 + Number(data.coefAch) * 0.01);
     data.pVCalc = Number(data.prix) * (1 + Number(data.coefAch) * 0.01);
     }
    } else {

    }
  }*/

  verifPrixArt(data, index , e) {
    this.wasInside = true;
    this.op.hide();
    if (
      data.prix === null ||
      data.prix === undefined ||
      Number(data.prix) <= 0
    ) {

      this.msg = 'Prix est obligatoire, doit être une valeur positive ! ';

      setTimeout(() => {
        this.op.show(e, document.getElementById(`row_${index}_prix`));
      //  this.op.show(e, document.getElementById(`row_${index}_qte`));
      document.getElementById(`row_${index}_prix`).click();
         }, 0);


    /*  window.setTimeout(function () {
        document.getElementById(`row_${index}_prix`).click();
        document.getElementById(`row_${index}_coefV`).focus();
        // this.op.show(e, document.getElementById(`row_${index}_prix`));
        }, 0);
        window.setTimeout(function () {
        this.op.show(e, document.getElementById(`row_${index}_prix`));
        }, 0);
    */
    } else {

      this.calculTot();
      if (this.typeFour === 'L') {
        this.changePrixArt(data);
        setTimeout(() => {
          document.getElementById(`row_${index}_coefV`).click();
          document.getElementById(`row_${index}_coefV`).focus();
      }, 0);
      data.prix = Number(data.prix).toFixed(3);

      } else {
        this.changePrixArt(data);
        this.calculTot();
        data.prix = Number(data.prix).toFixed(3);
        setTimeout(() => {
          document.getElementById(`row_${index}_coefAch`).click();
          document.getElementById(`row_${index}_coefAch`).focus();
      }, 0);
      }
    }
  }

  verifCoefAchArt(data, index, e) {
    this.wasInside = true;
    this.op.hide();
    if (
      data.coefAch === null ||
      data.coefAch === undefined ||
      Number(data.coefAch) <= 0
    ) {
      this.verifArt = true;
      this.msg =
        'Coefficient d\'achat est obligatoire, doit être une valeur positive ! ';
        setTimeout(() => {
          this.op.show(e, document.getElementById(`row_${index}_coefAch`));
        //  this.op.show(e, document.getElementById(`row_${index}_qte`));
        document.getElementById(`row_${index}_coefAch`).click();
        document.getElementById(`row_${index}_coefAch`).focus();
           }, 0);
    } else {
      console.log('coefV   ', data.coefV   );

      this.changeCoefAch(data);
      data.coefAch =  Number(data.coefAch).toFixed(3);
      console.log('coef vente  ', data.coefV);


          setTimeout(() => {
            document.getElementById(`row_${index}_coefV`).click();
            document.getElementById(`row_${index}_coefV`).focus();
        }, 0);


    }
  }


  verifCoefVent(data, index, e) {
    this.wasInside = true;
    this.op.hide();
    if (
      data.coefV === null ||
      data.coefV === undefined ||
      Number(data.coefV) <= 0
    ) {
      setTimeout(() => {
      this.msg = 'Coefficient de vente est obligatoire, doit être une valeur positive ! ';
      document.getElementById(`row_${index}_coefV`).click();
      document.getElementById(`row_${index}_coefV`).focus();
      this.op.show(e, document.getElementById(`row_${index}_coefV`));

    }, 0);
    } else {
      if (

        Number(data.coefAch) >= Number(data.coefV)
      ) {
        this.verifArt = true;
        this.msg =
          'Coefficient de vente doit être supérieur à  ' + data.coefAch + ' !!';
          setTimeout(() => {
            this.op.show(e, document.getElementById(`row_${index}_coefV`));
          //  this.op.show(e, document.getElementById(`row_${index}_qte`));
          document.getElementById(`row_${index}_coefV`).click();
          document.getElementById(`row_${index}_coefV`).focus();
             }, 0);
      } else {
      this.op.hide();
       data.coefV = Number(data.coefV).toFixed(6);
       this.calculTot();
       this.onRowEditSave(data, index, e);
       this.op.hide();
    }
  }
  }


  /*verifCoefVent(data, index, e) {
    this.wasInside = true;
    this.op.hide();
    if (
      data.coefV === null ||
      data.coefV === undefined ||
      Number(data.coefV) <= 0
    ) {
      setTimeout(() => {
      this.msg = 'Coefficient de vente est obligatoire, doit être une valeur positive ! ';
      document.getElementById(`row_${index}_coefV`).click();
      document.getElementById(`row_${index}_coefV`).focus();
      this.op.show(e, document.getElementById(`row_${index}_coefV`));

    }, 0);
    } else {
       this.op.hide();
       data.coefV = Number(data.coefV).toFixed(6);
       this.onRowEditSave(data, index, e);
       this.calculTot();
       this.op.hide();
    }
  }*/

  async putArtinList(e) {

    console.log('verif art ', this.verifArt);
  }

  async rechArticle(mot) {
    //  this.listeStocks = new Array();
    this.refArticle = mot;
    await this.stockService
      .getStockList(mot)
      .toPromise()
      .then((data) => {
        console.log('liste stock ', data);
        this.listeStocks = data['_embedded'].stocks;
      });
      setTimeout(() => {
      this.gridstock.selectRows([0]);
         }, 20);

  }
  rowSelected(e) {
    if (this.gridstock.getSelectedRowIndexes()[0] >= 0) {
      const selected = this.gridstock.getSelectedRecords()[0];
      this.selectedArticle = selected;
      console.log('selected art ', this.selectedArticle);
    }
  }



  async verifCommande(art, codefrs) {
    console.log('verif cmd code Art ', art.code);
    console.log('verif cmd code four ', codefrs);
    this.listeArtCmd = new Array();

    this.showConfirm = false;
    this.listeArtCmd = new Array();
    await this.commandeService
      .getLivCmdByFrsAndArt(art.code, codefrs)
      .toPromise()
      .then((data) => {
        this.listeArtCmd = data['_embedded'].commandeFrsArts;

        console.log('liste des articles dans le commande ', data);
      });

    if (this.listeArtCmd.length > 0) {
      this.numcmd = this.listeArtCmd[0].numcmd;
      this.qtecmd = this.listeArtCmd[0].restant;

      this.quantite = this.qtecmd;


      this.showConfirm = true;
      this.wasInsideDialogCMD = true;
      // this.selectedRowIndexCMD = 0;
       setTimeout(() => {
         this.gridCmd.selectRows([0]);
    }, 140);
    } else {
      this.numcmd = null;
      this.qtecmd = null;

      this.showConfirm = false;

      this.quantite = this.qtecmd;

      this.designArt = art.design;
    }
    this.codeArt = art.code;
  }
 /* async afficheritemeObservNull(e) {

    const findrow = this.listeStocks.filter((elm, idx) =>
    elm.combine.includes(this.codeTypeeObservNull) &&
    elm.combine.includes(this.NumeroObservNull ))[0];

    if (
      findrow !== null &&
      findrow  !== undefined
    ) {
      const findrowIndex = this.datasourceGrid.findIndex(elm => elm.id ===  findrow.id);
      this.grid.selectedRowIndex = findrowIndex;
    } else {
      this.wasInside = true;
       this.msg = 'ce document n/existe pas';
       this.op.show(e, document.getElementById('rechdocObservNull'));
    }
  }*/


  async doubleclickStock(e) {

    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {

      const selectArt = {
        id: this.selectedArticle.id,
        commande: null,
        code: this.selectedArticle.code,
        design: this.selectedArticle.design,
        qte: null,
        prix: null,
        coefAch: null,
        coefV: null,
        prixA: '0.000',
        pVCalc: '0.000',
        totDt: '0.000',
        nouvPV: Number(this.selectedArticle.prix).toFixed(3),
        ancPV:  Number(this.selectedArticle.prix).toFixed(3),
        ancQT:  Number(this.selectedArticle.quantite).toFixed(1),
        achat: Number(this.selectedArticle.achat).toFixed(3),
      };
      if  (Number(this.selectedArticle.quantite) === 0) {
        this.hiddenValider = true;
              this.msg = 'Quantité En Stock est égal à 0 ! ';
      //  console.log('quantiteee ', data.qte );
          setTimeout(() => {


        this.op.show(e);
         }, 0);
      } else {
      await this.verifCommande(selectArt, this.codeFour);

      console.log(' details commande  ', this.numcmd, this.qtecmd);
      if (this.typeFour === 'L') {
        this.devis = 'DT';
        this.ngIfcoefAchLoc = true;
        selectArt.coefAch = '1.000';
        this.readonlyDevis = true;
      } else {
        if (this.typeFour === 'E') {
          this.ngIfcoefAchLoc = false;
        }
      }

    if (this.listeAchats.length === 0) {
      this.listeAchats.push(selectArt);
      this.table.initRowEdit(selectArt);
      setTimeout(() => {
          document.getElementById('row_1_qte').click();
          document.getElementById('row_1_qte').focus();
      }, 0);

    } else {

      const art = this.listeAchats[this.listeAchats.length - 1 ];


      let j;
      let ind = -1;
      for (j = 0; j <= this.listeAchats.length - 1; j++) {

        if (this.listeAchats[j].code === selectArt.code) {
          this.msg = 'Cet article est déjà dans la liste !!';
          this.op.show(e);
          ind = j;
          break;
        } else {
          ind = -1;
        }}


        if (ind === -1) {


          if (
            art.qte === null ||
            art.qte === undefined ||
            Number(art.qte) <= 0 ||
            art.prix === null ||
            art.prix === undefined ||
            Number(art.prix <= 0) ||
            art.coefAch === null ||
            art.coefAch === undefined ||
            Number(art.coefAch) <= 0 ||
            art.coefV === null ||
            art.coefV === undefined ||
            art.coefV <= 0
          ) {

              const index = this.listeAchats.length;
              this.hiddenValider = true;
              this.table.initRowEdit(art);
              console.log( ' this.table.initRowEdit(art)', this.table.initRowEdit(art));

              this.msg = 'Verifiez cette ligne , tous les champs sont obligatoires et de valeur positive !';
              this.op.show(e, document.getElementById(`row_${index}_index`));


           } else {


            this.table.cancelRowEdit(art);
          //  selectArt.coefAch = art.coefAch;
           // selectArt.coefV = art.coefV;
            this.listeAchats.push(selectArt);
            this.disable = true;
            this.table.initRowEdit(selectArt);
            const index = this.listeAchats.length;
            setTimeout(() => {
              document.getElementById(`row_${index}_qte`).click();
              document.getElementById(`row_${index}_qte`).focus();
          }, 0);

        }
      }
    }}
  }
    this.hiddenValider = true;
  }



  supprimer(ri) {
    const index = this.listeAchats.indexOf(this.listeAchats[ri], 0);
    if (index > -1) {
      this.listeAchats.splice(index, 1);
    }
    this.calculTot();
  }
  async annuler() {
    this.confirmationService.confirm({
      message: 'Etes vous sûr de vouloir annuler ! ',
      header: 'Annuler  ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        this.blockedDocument = false;
        this.clickAficher = false;
        this.disabledAficher = true;
        this.readonly = false;
        this.readonlyDevis = false;
        this.listeAchats = new Array();
        this.listeStocks = new Array();
        this.refArticle = null;
       this.total = '0.000';
       this.afficherBtnImpr = false;
       this. hiddenNouvSaisie = true;
      },
      reject: () => {

      },
    });


  }

  rowSelectedCmd(e) {

    if (this.gridCmd.getSelectedRowIndexes()[0] >= 0) {
      const selectedCmd = this.gridCmd.getSelectedRecords()[0];
      this.selectedCmd = selectedCmd;
      console.log('rowSelectedCmd    selected cmd ', this.selectedCmd);
    }
  }




  async clickOKCommande(e) {
    console.log('selected cmd ok  clickOKCommande ', this.selectedCmd);
      if (this.selectedCmd !== null && this.selectedCmd !== undefined ) {
        this.numcmd = this.selectedCmd.numcmd;
        this.qtecmd = this.selectedCmd.restant;
        this.quantite = this.qtecmd;
        this.listeAchats[this.listeAchats.length - 1].commande = this.numcmd;
        this.listeAchats[this.listeAchats.length - 1].qte = 0;
        // this.onRowEditSave( this.listeAchats[this.listeAchats.length - 1], this.listeAchats.length, e);
      }
      this.op.hide();
      const art =   this.listeAchats[this.listeAchats.length - 1];
      const index = this.listeAchats.length;
      this.showConfirm = false;
      this.showDetAch = true;

      console.log('art cmddddddddd', art);
      this.table.initRowEdit( art);
      this.wasInsideDialogCMD = false;
      setTimeout(() => {
        document.getElementById(`row_${index}_qte`).click();
        document.getElementById(`row_${index}_qte`).focus();
    }, 20);
    }




   async  clickAnnulerCommande() {
      this.showConfirm = false;
      this.numcmd = null;
      this.qtecmd = null;
      const index = this.listeAchats.length;
      this.table.initRowEdit( this.listeAchats[this.listeAchats.length - 1]);
      setTimeout(() => {
        document.getElementById(`row_${index}_qte`).click();
        document.getElementById(`row_${index}_qte`).focus();
    }, 0);
    }





 async Nouvellesaisie(e) {
   this.total = '0.000';
    this.blockedDocument = false;
    this.clickAficher = false;
    this.disabledAficher = true;
    this.readonly = false;
    this.readonlyDevis = false;
    this.listeAchats = new Array();
    this.listeStocks = new Array();
    this.refArticle = null;
    this.TotalBrut = null;
    this.hiddenCoefAch = true;
    this.devis = null;
    this.refFour = null;
    this.selectedFour = null;
    console.log('readonly devis', this.readonlyDevis);
    this.adresseFour = '';


 /*if (this.afficherBtnImpr ) {
  await this.achService.getAchList()
  .toPromise()
  .then((data) => {
    this.achDb = data['_embedded'].ach[0];
    this.ach = data['_embedded'].ach[0].numero;
    console.log('numero achat courant ', this.ach);
  });
    const numAch = Number(this.ach) + 1;
    const strach = String(numAch);
    this.refAchat = this.formNumAch(strach);
 }*/
 this.afficherBtnImpr = false;
 this. hiddenNouvSaisie = true;
  }


  editer() {
    this.hiddenValider = true;
    this.disable = true;
  }
  afficher(e) {

    this.wasInside = true;
    if (this.selectedFour === null || this.selectedFour === undefined) {
      this.msg = 'veuillez choisir un fournisseur !! ';
      this.op.show(e, document.getElementById('four'));
    } else {
      if (this.refFour  === null ||
        this.refFour  === undefined ||
        this.refFour  ===  '' ) {
          this.msg = 'Réference fournisseur est obligatoire ! ';
          setTimeout(() => {
            document.getElementById('refFour').click();
            document.getElementById('refFour').focus();
            this.op.show(e, document.getElementById('refFour'));
          }, 0);

        this.readonlyDevis = false;
        this.clickAficher = false;
        this.disabledAficher = true;
        this.readonly = false;
      } else {

        if (
          this.devis === null ||
          this.devis === undefined ||
          this.devis === ''
        ) {
          this.msg = 'Devise est obligatoire !! ';
          setTimeout(() => {

            document.getElementById('devis').click();
            document.getElementById('devis').focus();
            this.op.show(e, document.getElementById('devis'));
          }, 0);
            } else {
              this.readonlyDevis = true;
              this.clickAficher = true;
              this.disabledAficher = false;
              this.readonly = true;
              this. hiddenNouvSaisie = false;
              setTimeout(() => {
                document.getElementById('refArticle').focus();
            }, 0);
            }

      }
    }
    this.hiddenValider = true;
  }

  public onSearchItem(word: string, item: any): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  changeFournisseur() {
    if (this.selectedFour === null || this.selectedFour === undefined) {
      this.codeFour = '';
      this.adresseFour = '';
      this.typeFour = null;
      this.frs = null;
      console.log('code four', this.codeFour + '...');
    } else {
      this.frs = this.selectedFour.frs;
      this.codeFour = this.selectedFour.code;
      this.adresseFour = this.selectedFour.adresse;
      this.typeFour = this.selectedFour.typef;
      if (this.typeFour === 'L') {
        this.devis = 'DT';

        this.hiddenCoefAch = false;
        this.hiddenTaux = true;
        this.readonlyDevis = true;
      } else {
        if (this.typeFour === 'E') {
          this.devis = null;

          this.hiddenTaux = false;
          this.readonlyDevis = false;
          this.hiddenCoefAch = true;
        }
      }
      console.log('type four', this.typeFour + '...');
    }
  }

  formNumAch(num): String {
    if (num === 'null') {
      num = '';
    } else {
      switch (num.length) {
        case 1: {
          num = '0000' + num;
          break;
        }
        case 2: {
          num = '000' + num;
          break;
        }
        case 3: {
          num = '00' + num;
          break;
        }
        case 4: {
          num = '0' + num;
          break;
        }
        default: {
          break;
        }
      }
    }
    return num;
  }

  async ngOnInit() {
   /* this.errorTable = {
      code: 0,
      col: '',
      data: '',
      id: '',
      e: ''
    };*/
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

   this. hiddenNouvSaisie = true;
    this.listeAchats = new Array();
     this.hiddenValider = true;
     this.dateAchat = new Date();
     this.blockedDocument = false;
     this.afficherBtnImpr = false;


    this.clickAficher = false;
    this.disabledAficher = true;
    this.hiddenTaux = true;
    this.hiddenCoefAch = true;
  }
}
