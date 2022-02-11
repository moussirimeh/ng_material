import { Component, OnInit, ElementRef, EventEmitter, HostListener, ViewChild, Output } from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Dialog, OverlayPanel } from 'primeng/primeng';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { StockService } from '../services/stock.service';
import { ConfirmationService } from 'primeng/api';
import { AchService } from '../services/ach.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { CommandeService } from '../services/commande.service';
import { CommandService } from '../services/command.service';
import { AchatService } from '../services/achat.service';
import {MouveService } from '../services/mouve.service';
import { Table } from 'primeng/table';
import * as jspdf from 'jspdf';
import { LoginService } from 'src/app/login/login.service';

import {ReeditionRapportAchatComponent} from '../reedition-rapport-achat/reedition-rapport-achat.component'  ;
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  selector: 'app-achat',
  templateUrl: './achat.component.html',
  styleUrls: ['./achat.component.scss'],
  providers: [ConfirmationService],
})
export class AchatComponent implements OnInit {
  totalDev: number;
  wasInsideDialogCMD = false;
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
    private mouveService: MouveService,
    private elementRef: ElementRef
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
    this.config.openOnEnter = true;

     this.fournisseurService
    .findByOrderByDeno()
    .toPromise()
    .then((data) => {
      this.listeFournisseur = data['_embedded'].fournisseurs;
      console.log('fournisseurs liste  ', data);
    });


  }
  // declaration des variables ( attributs)
  @ViewChild(ReeditionRapportAchatComponent) reedition;
  @Output() public checkClick = new EventEmitter();
  blockedDocument: boolean;
  hiddenNouvSaisie: boolean;
  selectedRowIndex = 0;
  selectedRowIndexCMD = 0;
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
  @ViewChild('dialogCMD')
  dialogCMD: Dialog;
  @ViewChild('op')
  public op: OverlayPanel;
  listeAchats = new Array();
  TotalBrut = '0.000';
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
  prixcmd: any;
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
  styleEdit: boolean;
  total = '0.000';
  selectedCmd: any;
noSpecial: RegExp = /^[^<>*!]+$%/;
/*onClick(event) {
 this.onKeydown(event);
}*/


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
 this.total = tot.toFixed(3);
}
}
async updateDB(e) {

  await this.achService.getAchList()
  .toPromise()
  .then((data) => {
    this.achDb = data['_embedded'].ach[0];
    this.ach = data['_embedded'].ach[0].numero;
    console.log('numero achat courant ', this.ach);
  });
  const numAch = Number(this.ach) + 1;
  console.log('const num ach ', numAch);
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
  achat.numero = 'ACHAT    ' + this.refAchat;
  achat.date = this.dateAchat.toLocaleDateString('en-GB');
  achat.operateur = this.codeFour;
  achat.devise = this.devis;
  achat.ref = this.refFour;
    achat.totDt = this.total;
    achat.totDev = this.totalDev;

  console.log('achat avant create  ', achat);

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
  const mouve: MouveAch = {
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
           totalBrut: null,
           qtEnt: null,
           prixArt: null,
           qtOffre: null,
           designation: null

          };
  mouve.combine = 'ACHAT    ' + this.refAchat ;
  mouve.date = this.dateAchat.toLocaleDateString('en-GB');
  mouve.operateur = this.codeFour;
  mouve.sens = 'D';
  mouve.numbc = art.commande;
  mouve.code = art.code;
  mouve.quantite = art.qte;
  mouve.achat = art.prixA;
  mouve.base = art.prix;
  // mouve.prix =  String(art.nouvPV);
  mouve.prix =  String(art.pVCalc );
  mouve.rang = String(i);
  mouve.totalBrut = String(art.nouvPV);
  mouve.prixArt = art.ancPV;
console.log('mouve.totalbrut   ', mouve.totalBrut);
console.log('mouve        ', mouve);

  await this.mouveService.createMouve(mouve)
     .toPromise()
     .then(data => {
       console.log('create mouve ', data );
     });
     console.log('prix achaaaaaaaaaaaaaaaaaaaat ', art.prixA);

// tslint:disable-next-line:max-line-length
await this.stockService.updateQuantiteStockAchat(art.qte, art.nouvPV, art.prixA, this.devis, art.prix, this.dateAchat.toLocaleDateString('en-GB'), art.code)
    .toPromise()
    .then(data => {
      console.log('updateQuantiteStockAchat ', data);
    });

if (art.commande !== null || art.commande !== undefined || art.commande) {
    await this.commandeService.updateQuantiteCmdAchat(art.qte, art.prix, art.commande, art.code)
          .toPromise()
          .then(data => {
            console.log('updateQuantiteCmdAchat ', data);
          });

    await this.commandService.updatePurCommmande(art.commande).toPromise()
          .then(data => {
            console.log('update pur cmd ', data);
          });

  /*  this.listeCommandes = new Array();
    await this.commandeService.getListeCommandeByNumCmdAchat(art.commande)
    .toPromise()
    .then(data => {
      console.log('getListeCommandeByNumCmdAchat  ', data['_embedded'].commandes);

      this.listeCommandes = data['_embedded'].commandes;
     // this.selectedRowIndex = 0;
    });
  if (this.listeCommandes.length === 0) {
    const purcmd = 'O';
    await this.commandService.updateCommandAchat(purcmd, this.dateAchat.toLocaleDateString('en-GB'), art.commande)
    .toPromise()
    .then(data => {
      console.log('updateCommandAchat empty listeCommandes', data);
    });
  } else {
    const purcmd = 'P';
    await this.commandService.updateCommandAchat(purcmd, this.dateAchat.toLocaleDateString('en-GB'), art.commande)
    .toPromise()
    .then(data => {
      console.log('updateCommandAchat is not empty listeCommandes ', data);
    });
  }*/

}


  }


 /* const list =   this.listeAchats.sort(function(a, b) {

  //  this.listeAchats.splice(index, 1);
    return a.commande > b.commande ? 1 : a.commande < b.commande ? -1 : 0;
  });
  console.log('liste apres sort ', list);

  let k = 0;
  let cod = list[0].commande;
  while ( k < list.length ) {
    if (cod === null ) {
      list.splice(k, 1);
      cod = list[k].commande;

    } else {
      if (cod === list[k].commande ) {
         k++;
      } else {
          await this.commandService.updatePurCommmande(cod).toPromise()
          .then(data => {
            console.log('update pur cmd ', data);
          });
          k++;
          cod = list[k].commande;
      }
      k++;
    }





  }
*/
  await this.loginService
  .procedureStockeModule(
    localStorage.getItem('login'),
    globals.selectedMenu,
    'Achat ' + this.refAchat
  )
  .toPromise().then((data) => {
    console.log('procedureStockeModule ', data);
  });
  this.confirmationService.confirm({
    message: 'Achat est enregistré avec succes : Numero = ' + this.refAchat + ' , Voulez vous consulter !! ',
    header: 'Confirmer l\'avoir ',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Oui',
    rejectLabel: 'Non',
    accept: async () => {

       await this.imprimer(e);

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
      message: 'Etes vous sûr de vouloir valider l\'achat ',
      header: 'Confirmer l\'achat ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
         await this.updateDB(e);

         setTimeout(() => {
         this.afficherBtnImpr = false;
      }, 0);
      },
      reject: () => {

      },
    });
  }
}


async imprimer(e) {
// this.reedition.achat = 'ACHAT    ' + this.refAchat;
// this.reedition.wasInside = this.wasInside ;
/*this.reedition.nmAchat = this.refAchat;
console.log('codeee ', this.reedition.nmAchat );
*/
const numAchat = this.refAchat;
await this.reedition.imprimer(e, numAchat);

}


  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
      let j = 1;
      for (const obj of this.listeAchats) {
        let e: Event;


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
              this.hiddenValider = true;
              if ( Number(obj.coefAch) >= Number(obj.coefV)) {

                this.verifArt = true;
                this.hiddenValider = true;
                this.wasInside = true;
                obj.coefAch = Number(obj.coefAch).toFixed(3);
                this.msg =
                  'Coefficient de vente doit être supérieur à  ' + obj.coefAch + ' !!';
                  setTimeout(() => {

                  document.getElementById(`row_${j}_coefV`).click();
                  document.getElementById(`row_${j}_coefV`).focus();
                  this.op.show(e, document.getElementById(`row_${j}_coefV`));

                     }, 0);
                     break;
              } else {
                obj.coefV = Number(obj.coefV).toFixed(3);
                this.onRowEditSave(obj, e);
              }
             } else {
              this.onRowEditSave(obj, e);
              } j++; }
    }
    this.wasInside = false;
  }
  onRowEditSave(data, e) {
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
            const index = this.listeAchats.indexOf(data);
            this.wasInside = true;
            this.msg = 'Tous les champs sont obligatoires  ! ';
            this.op.show(e, document.getElementById(`row_${index}_index`));
          //  this.op.show(e);
       } else {
//  data.pVCalc = Number(data.prix) * Number(data.coefV);$
        const p = Number(data.prix);
        const coefV = Number(data.coefV);


            const pVCal = p * coefV;
            data.pVCalc = pVCal.toFixed(3);

        const qte =  Number(data.qte);
        const totDt = p * qte * Number(data.coefAch);
        data.totDt = totDt.toFixed(3);
         const ancPV = Number(data.ancPV);
         const ancQT = Number(data.ancQT);
         console.log('prix  ', p);
         console.log('qte  ', qte);
         console.log('ancPV  ', ancPV);
         console.log('ancQT  ', ancQT);
       //   const nouvPV = (( pVCal * qte) + ( ancPV * ancQT)) / (qte + ancQT);
      //    data.nouvPV = Number(nouvPV).toFixed(3);
        //  if (pVCal > nouvPV ) {
        //    data.nouvPV = Number(pVCal).toFixed(3);
         // }
      //                console.log('nou PV ', data.nouvPV );

        /*    const ste  = globals.societe;
          if (Number(data.ancPV) < Number(data.nouvPV) && ((ste === 'CHAMAM DIVISION GROS')
                                                      || (ste === 'EQUIPEMENT MODERNE AUTOMOTIVE')
                                                      || (ste === 'EQUIPEMENT MODERNE F.INDUSTRIE')
                                                      )) {
            data.nouvPV = Number(data.pVCalc);
          }*/

          if (Number(data.ancPV) >= Number(data.pVCalc)) {
           data.nouvPV = Number(data.ancPV).toFixed(3);
          } else {
            data.nouvPV = Number(data.pVCalc).toFixed(3);
          }

          this.changeCoefAch(data);
          console.log('nouvPV  ', data.nouvPV);
///////////////////////////////////////////////////////////

       }
//  Number(data.coefV) > Number(data.coefAch) &&
       if (data.qte !== null
        && data.qte !== undefined
        && Number(data.qte) > 0
        && data.prix !== null
        &&  data.prix !== undefined
        &&  Number(data.prix) > 0 &&
          data.coefAch !== null &&
          data.coefAch !== undefined &&
          Number(data.coefAch) > 0 &&
          data.coefV !== null &&
          data.coefV !== undefined &&
          Number(data.coefV) > 0 &&

          Number(data.prixA) > 0 &&
          data.prixA !== null &&
          data.prixA !== undefined &&

          Number(data.pVCalc) > 0 &&
           data.pVCalc !== null &&
           data.pVCalc !== undefined
          ) {

      if (

        Number(data.coefAch) >=  Number(data.coefV)
      ) {
        this.wasInside = true;
        this.hiddenValider = true;
        this.msg =
          'Coefficient d\'achat  doit être inférieur à ! ' + data.coefV;
          setTimeout(() => {
            this.op.show(e, document.getElementById(`row_${data.id}_coefAch`));
          //  this.op.show(e, document.getElementById(`row_${index}_qte`));
          document.getElementById(`row_${data.id}_coefAch`).click();
          document.getElementById(`row_${data.id}_coefAch`).focus();
             }, 0);
      } else {

        this.hiddenValider = false;
      }

          }
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
      setTimeout(() => {
        document.getElementById(id).click();
        this.op.show(e, document.getElementById(id));
        document.getElementById(id).focus();
      }, 0);
     }
      }
    }, 150);
    } else {
      this.op.hide();
      setTimeout(() => {
        document.getElementById(id).click();
        document.getElementById(id).focus();
      }, 0);
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
          document.getElementById(`row_${index}_qte`).focus();
           }, 0);
      } else {
        this.msg = 'Quantité est obligatoire, doit être une valeur positive ! ';
        console.log('quantiteee ', data.qte );
          setTimeout(() => {
        this.op.show(e, document.getElementById(`row_${index}_qte`));
      //  this.op.show(e, document.getElementById(`row_${index}_qte`));
        document.getElementById(`row_${index}_qte`).click();
        document.getElementById(`row_${index}_qte`).focus();
         }, 0);
      }


    } else {

      console.log('else verif qte', data.commande);

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
              data.qte = Number(data.qte).toFixed(1);
              this.changePrixArt(data);
              this.calculTot();
              setTimeout(() => {
                document.getElementById(`row_${index}_qte`).click();
                document.getElementById(`row_${index}_qte`).focus();
            }, 0);
            this.hiddenValider = true;
            },
            reject: () => {
              data.qte = this.quantite;
              data.qte = Number(data.qte).toFixed(1);
              this.changePrixArt(data);
              this.calculTot();
              setTimeout(() => {
                document.getElementById(`row_${index}_qte`).click();
                document.getElementById(`row_${index}_qte`).focus();

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
          }, 200);

        }
        this.hiddenValider = true;
      } else {

        data.qte = Number(data.qte).toFixed(1);
        if (data.prix === null ) {
          setTimeout(() => {
                  document.getElementById(`row_${index}_prix`).click();
                  document.getElementById(`row_${index}_prix`).focus();
              }, 200);
    } else {
      this.changePrixArt(data);
      this.calculTot();
      setTimeout(() => {
        document.getElementById(`row_${index}_prix`).click();
        document.getElementById(`row_${index}_prix`).focus();
      }, 200);
    }
      }
    }

  }
  changeCoefAch(data) {
    let prixAch = 0;
      prixAch = Number(data.prix) * Number(data.coefAch);
      data.prixA = prixAch.toFixed(3);

  }
 /* changePrixArt(data) {
    //  if (this.typeFour === 'L') {
        const tot = Number(data.qte) * Number(data.prix) * Number(data.coefAch);
        data.totDt = tot.toFixed(3);

      // const  prixAch = Number(data.prix) * (1 - Number(data.coefAch) * 0.01);
      const  prixAch = Number(data.prix) *  Number(data.coefAch);
       data.prixA = prixAch.toFixed(3);
       data.pVCalc = Number(data.prix) * Number(data.coefV ) ;
      // if (this.frs === 'P' ) {
       //  data.prixA =  Number(data.prix).toFixed(3);
      //   data.pVCalc = Number(data.prix) * (1 + Number(data.coefAch) * 0.01);
     // const pvc = Number(data.prix) * (1 + Number(data.coefAch) * 0.01);
      // data.pVCalc = pvc.toFixed(3);
    //   }
     // } else {
     //  const tot = Number(data.qte) * Number(data.prix) * Number(data.coefAch);
     //   data.totDt = tot.toFixed(3);
     // }
    }*/
  changePrixArt(data) {
      const tot = Number(data.qte) * Number(data.prix) * Number(data.coefAch);
      data.totDt = tot.toFixed(3);
     const  prixAch = Number(data.prix) *  Number(data.coefAch);
     data.prixA = prixAch.toFixed(3);
     data.pVCalc = Number(data.prix) * Number(data.coefV ) ;
  }

  verifPrixArt(data, index , e) {
    this.disable = true;
    this.wasInside = true;
    this.op.hide();
    if (
      data.prix === null ||
      data.prix === undefined ||
      Number(data.prix) <= 0
    ) {
      this.hiddenValider = true;
      this.msg = 'Prix est obligatoire, doit être une valeur positive ! ';
      setTimeout(() => {
        this.op.show(e, document.getElementById(`row_${index}_prix`));
      document.getElementById(`row_${index}_prix`).click();
         }, 0);

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
      this.hiddenValider = true;
      this.msg =
        'Coefficient d\'achat est obligatoire, doit être une valeur positive ! ';
        setTimeout(() => {
          this.op.show(e, document.getElementById(`row_${index}_coefAch`));
        //  this.op.show(e, document.getElementById(`row_${index}_qte`));
        document.getElementById(`row_${index}_coefAch`).click();
        document.getElementById(`row_${index}_coefAch`).focus();
           }, 0);
    } else {

      if (

        Number(data.coefAch) >=  Number(data.coefV) &&  data.coefV !== null &&  data.coefV !== undefined
      ) {
        this.hiddenValider = true;
        this.msg =
          'Coefficient d\'achat  doit être inférieur à ! ' + data.coefV;
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
  }

  verifCoefVent(data, index, e) {
    this.wasInside = true;
    this.op.hide();
    if (
      data.coefV === null ||
      data.coefV === undefined ||
      Number(data.coefV) <= 0
    ) {
      this.hiddenValider = true;
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
        this.hiddenValider = true;
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
       data.coefV = Number(data.coefV).toFixed(3);
       this.calculTot();
       this.onRowEditSave(data, e);
       this.op.hide();
    }
  }
  }

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


  rowSelectedCmd(e) {

    if (this.gridCmd.getSelectedRowIndexes()[0] >= 0) {
      const selectedCmd = this.gridCmd.getSelectedRecords()[0];
      this.selectedCmd = selectedCmd;
      console.log('selected cmd ', this.selectedCmd);
    }
  }

clikQte(index) {
  setTimeout(() => {
  document.getElementById(`row_${index}_qte`).focus();
}, 0);
}

 async clickOKCommande(e) {
  console.log('selected cmd ok  ', this.selectedCmd);
  const index = this.listeAchats.length;

    if (this.selectedCmd !== null && this.selectedCmd !== undefined ) {
      this.numcmd = this.selectedCmd.numcmd;
      this.qtecmd = this.selectedCmd.restant;
      this.quantite = this.qtecmd;
      this.prixcmd = this.selectedCmd.prixcmd;
      this.listeAchats[this.listeAchats.length - 1].commande = this.numcmd;
      this.listeAchats[this.listeAchats.length - 1].qte = this.qtecmd;
      this.listeAchats[this.listeAchats.length - 1].prix = this.prixcmd;


    }
    this.op.hide();
    const art =   this.listeAchats[this.listeAchats.length - 1];
    this.showConfirm = false;
if (this.typeFour === 'L') {
  setTimeout(() => {
    document.getElementById(`row_${index}_coefV`).click();
    document.getElementById(`row_${index}_coefV`).focus();
  }, 150);
} else {
  setTimeout(() => {
    document.getElementById(`row_${index}_coefAch`).click();
    document.getElementById(`row_${index}_coefAch`).focus();
  }, 150);
}

      this.hiddenValider = true;
  }
 async  clickAnnulerCommande() {
    this.showConfirm = false;
    this.numcmd = null;
    this.qtecmd = null;
    this.prixcmd = null;

    const index = this.listeAchats.length;
    this.table.initRowEdit( this.listeAchats[this.listeAchats.length - 1]);
    setTimeout(() => {
      document.getElementById(`row_${index}_qte`).click();
      document.getElementById(`row_${index}_qte`).focus();
  }, 0);
  }

  async verifCommande(art, codefrs) {
    console.log('verif cmd code Art ', art.code);
    console.log('verif cmd code four ', codefrs);
    this.selectedCmd = null;
    this.listeArtCmd = new Array();

    this.showConfirm = false;
    this.listeArtCmd = new Array();
    await this.commandeService
      .getCommandeByFrsAndArt(art.code, codefrs)
      .toPromise()
      .then((data) => {
        this.listeArtCmd = data['_embedded'].commandeFrsArts;

        console.log('liste des articles dans le commande ', data);
      });



    if (this.listeArtCmd.length > 0) {

      this.wasInside = false;
      this.numcmd = null;
      this.qtecmd = null;
      this.prixcmd = null;
      this.showConfirm = true;
      this.wasInsideDialogCMD = true;
     // this.selectedRowIndexCMD = 0;
      setTimeout(() => {
        this.gridCmd.selectRows([0]);
   }, 140);

    } else {
      this.numcmd = null;
      this.qtecmd = null;
      this.prixcmd = null;
      this.showConfirm = false;

      this.quantite = this.qtecmd;
      this.prix = this.prixcmd;
      this.designArt = art.design;
    }
    this.codeArt = art.code;
  }







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
      };

      await this.verifCommande(selectArt, this.codeFour).then(data => {
        console.log('veriiiiiif cmd ', data);
        console.log('selectedt article ', selectArt);
        console.log(' details commande  ', this.numcmd, this.qtecmd, this.prixcmd);
        this.selectedRowIndexCMD = 0;
        if (this.typeFour === 'L') {
          this.devis = 'DT';
          this.ngIfcoefAchLoc = true;
          selectArt.coefAch = '1.000';
        //  selectArt.coefV = '1.000';

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
        this.hiddenValider = true;
      } else {
            const art = this.listeAchats[this.listeAchats.length - 1 ];

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
              Number(art.coefV) <= 0

            ) {
              const index = this.listeAchats.length;
              if ( Number(art.commande) !== null ) {
                this.table.initRowEdit(selectArt);
              setTimeout(() => {
                 document.getElementById(`row_${index}_qte`).click();
                document.getElementById(`row_${index}_qte`).focus();
            }, 0);
              } else {
              if ( Number(art.coefV) <=  Number(art.coefAch)) {
                this.showConfirm = false;
                this.verifCoefVent(art, index, e);
              } else {
                this.showConfirm = false;
                this.hiddenValider = true;
                this.table.initRowEdit(art);
                console.log( ' this.table.initRowEdit(art)', this.table.initRowEdit(art));
                 this.wasInside = true;
                this.msg = 'Verifiez cette ligne , tous les champs sont obligatoires et de valeur positive !';
                this.op.show(e, document.getElementById(`row_${index}_index`));
              }
            }
             } else {
              this.table.cancelRowEdit(art);
              selectArt.coefAch = art.coefAch;
              selectArt.coefV = art.coefV;
              this.listeAchats.push(selectArt);
              this.disable = true;
               const index = this.listeAchats.length;
              this.table.initRowEdit(selectArt);
              setTimeout(() => {
                document.getElementById(`row_${index}_qte`).click();
                document.getElementById(`row_${index}_qte`).focus();
            }, 0);
            this.hiddenValider = true;
            }
        }
      });
     //  selectArt.commande = this.numcmd;
     //  selectArt.qte = this.qtecmd;
      // selectArt.prix = this.prixcmd;


    }
    this.hiddenValider = true;
  }



  supprimer(ri) {
    const index = this.listeAchats.indexOf(this.listeAchats[ri], 0);
    if (index > -1) {
      this.listeAchats.splice(index, 1);
    }
    this.calculTot();
    if (this.listeAchats.length === 0) {
      this.hiddenValider = true;
   }
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
    this.refFour = null;
    this.selectedFour = null;
    this.devis = null;
    this.TotalBrut = '0.000';
    this.hiddenCoefAch = true;
    console.log('readonly devis', this.readonlyDevis);
    this.adresseFour = '';


 this.afficherBtnImpr = false;
 this. hiddenNouvSaisie = true;
  }


  editer() {
    this.hiddenValider = true;
    this.disable = true;
  }
  afficher(e) {
    this.op.hide();
    this.wasInside = true;
    if (this.selectedFour === null || this.selectedFour === undefined) {
      this.msg = 'veuillez choisir un fournisseur !! ';

      setTimeout(() => {
        document.getElementById('four').click();
        document.getElementById('four').focus();
        this.op.show(e, document.getElementById('four'));
      }, 0);
    } else {
      this.op.hide();
      if (this.refFour  === null ||
        this.refFour  === undefined ||
        this.refFour  ===  '' ) {
          this.msg = 'Réference fournisseur est obligatoire ! ';
          this.config.openOnEnter = false;

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
        this.op.hide();
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
      this.config.openOnEnter = false;
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
  async onKeydownEnterStock(event: KeyboardEvent) {
  if (this.gridstock !== undefined) {
    if (this.gridstock.getRowInfo(event.target).rowData !== undefined) {
      this.hiddenValider = true;
     await this.doubleclickStock(event);
      this.gridstock.selectRows([this.gridstock.getRowInfo(event.target).rowIndex]);
      setTimeout(() => {
       this.selectedRowIndexCMD = 0;
    }, 150);

    }
  }
}

@HostListener('document:keydown.enter', ['$event'])
async onKeydownHandler(event: KeyboardEvent) {
  this.wasInside = true;
  this.op.hide();
 if (this.gridCmd !== undefined && this.showConfirm && this.gridCmd !== null) {
    if (this.gridCmd.getRowInfo(event.target).rowData !== undefined) {
      this.gridCmd.selectRows([this.gridCmd.getRowInfo(event.target).rowIndex]);
      await this.clickOKCommande(event);


     }
    } else {
      if (this.gridstock !== undefined) {
        this.gridstock.selectedRowIndex = 0;
        if (this.gridstock.getRowInfo(event.target).rowData !== undefined) {
          this.gridstock.selectRows([this.gridstock.getRowInfo(event.target).rowIndex]);
          await this.doubleclickStock(event);

        }
      }
    }


}









 async onKeydown(event: KeyboardEvent) {
    this.wasInside = true;
    this.op.hide();
   if (this.gridCmd !== undefined && this.showConfirm && this.gridCmd !== null) {
  if (this.gridCmd .getRowInfo(event.target).rowData !== undefined) {
    this.gridCmd.selectRows([this.gridCmd.getRowInfo(event.target).rowIndex]);
    await this.clickOKCommande(event);
   }
  }
}




  async ngOnInit() {

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

export class MouveAch {
  id: string;
  combine: string;
  code: string;
  quantite: string;
  tRemise: string;
  prix: string;
  date: string;
  operateur: string;
  sens: string;
  tauxTva: string;
  base: string;
  achat: string;
  codeAimprimer: string;
  rang: string;
  numbc: string;
  autPrix: string;
  totalBrut: string;
  qtEnt: string;
  prixArt: string;
  qtOffre: string;
  designation: string;
}


