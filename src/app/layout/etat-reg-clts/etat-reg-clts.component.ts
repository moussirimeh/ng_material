import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { BrouService } from '../services/brou.service';
import { ClientService } from '../services/client.service';
import { Client } from '../services/client';
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

import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../services/excel.service';
import { ClientContService } from '../services/clientCont.service';
import { BrouContService } from '../services/brouCont.service';
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
  selector: 'app-etat-reg-clts',
  templateUrl: './etat-reg-clts.component.html',
  styleUrls: ['./etat-reg-clts.component.scss'],
  providers: [ExcelService]
})
export class EtatRegCltsComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('grid1')
  public grid1: GridComponent;


  display = false;

  hiddenNouvSaisie = false;

  ngselectDisabled = false;
  clients = [];

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
  selectedClient = null;




  afficherShow = true;





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

  datedeb = new Date();
  // datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  datedebut = new Date ();
  datefin = new Date ();
  mvt = 'debit';
  styleOvPanel = {};
  tn: any;
  ListBrous = new Array();
  listeBrous = new Array();
  ListTotPiece = new Array();
  totChequeCaisse = '0.000';
  totEspeceCaisse = '0.000';
  module: string;
  listeBrouConts: any[];
  listeBrousimp: any[];
  tabPiece: any[];

  selectedClientCode: any;
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(

    private brouService: BrouService,
    private brouContService: BrouContService,
    private excelService: ExcelService,
    private caisseService: CaisseService,

    private clientService: ClientService,
    private clientContService: ClientContService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
    this.module =  globals.selectedMenu;

  }



  NouvelleSaisie(): void {
    this.afficherShow = true;
    this.totalCredit = null;
    this.totalDebit = null;
    this.ngselectDisabled = false;
    this.champDisabled = true;
    if (this.selectedClient !== null && this.selectedClient !== undefined) {
      this.codeClient = this.selectedClient.code;
    } else {
      this.codeClient = '';
    }
    this.showCard1 = false;
    this.listeBrous = new Array();
    this.ListBrous = new Array();
  }


  async close(e) {
    if (this.typeClt === 'N') {
      await this.ListBrou(e);
    } else {
     // await this.ListBrouCont();
    }
  }

  changeClients() {
    if (this.selectedClient === null || this.selectedClient === undefined) {
      this.codeClient = '';
    } else {
      this.codeClient = this.selectedClient.code;
    }
  }


async trieClient() {
 await this.clients.sort(function(c, d) {
    return c.code > d.code ? 1 : c.code < d.code ? -1 : 0;
  });
  console.log('client apres trie' , this.clients);

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
  this.clients = new Array();

 console.log('MODUUUULE ', this.module );

   if (this.module === 'Etat des Regls Clt Cont') {
     await  this.clientContService.getClientContList().toPromise()
    .then((data) => {
      this.clients = data['_embedded'].clientsCont;

    });
   } else {
    await this.clientService
    .getClientsByTermeOrderByDeno('O')
    .toPromise()
    .then((data) => {
      this.clients = data['_embedded'].clients;
    });
   }


  this.clients.sort(function(a, b) {
    return a.deno > b.deno ? 1 : a.deno < b.deno ? -1 : 0;
  });
   console.log('clientssss ', this.clients);

 /* this.clientsTriecode.sort(function(c, d) {
    return c.code > d.code ? 1 : c.code < d.code ? -1 : 0;
  });*/
 // console.log('clientssss code ', this.clients);
  }

 async genererExcel(e) {
  this.wasInside = true;
    try {

      if (this.afficherShow) {
        this.listeBrous = new Array();
        if (this.module === 'Etat des Regls Clt Cont') {

          await this.ListBrouCont(e);
          console.log('value regle ', this.mvt);

          this.listeBrous = this.listeBrouConts;
         } else {
            await this.ListBrouTout(e);
            console.log('value regle ', this.mvt);
            this.listeBrous = this.ListBrous;
          }

        if (this.listeBrous.length > 0 ) {
       const exportExcel = this.listeBrous.map(
        obj => {
            return {
                'Numero d\'apurement' : obj.apurement,
                'Code client': obj.compte,
                'Dénomination': obj.cle,
                'Pièce': obj.piece,
                'Numéro': obj.numero,
                'Banque': obj.banque,
                'Date': obj.date,
                'Echéance': obj.echeance,
                'Débit': Number(obj.montant),
                'Crédit': Number(obj.code)

            };
           }
            );
    const daterap = new Date().toLocaleDateString('en-GB');
      this.excelService.exportAsExcelFile(exportExcel, 'Etat des Reglement clts ' + daterap);
     } else {
        if (this.listeBrous.length === 0) {

          this.styleOvPanel = this.styleOvPanelError;
          this.msgs = 'Aucun reglement trouvé ! ';
          this.ov.show(e);
       }
      }

    } else {
      const exportExcel = this.listeBrous.map(
        obj => {
            return {
                'Numero d\'apurement' : obj.apurement,
                'Code client': obj.compte,
                'Dénomination': obj.cle,
                'Pièce': obj.piece,
                'Numéro': obj.numero,
                'Banque': obj.banque,
                'Date': obj.date,
                'Echéance': obj.echeance,
                'Débit': Number(obj.montant),
                'Crédit': Number(obj.code)

            };
           }
            );
    const daterap = new Date().toLocaleDateString('en-GB');
      this.excelService.exportAsExcelFile(exportExcel, 'Etat des Reglement clts ' + daterap);
    }



     /*  if ( this.listeBrous === undefined || this.listeBrous.length === 0 || this.listeBrous.length === null) {
        this.styleOvPanel = this.styleOvPanelError;
        this.msgs = 'Aucun reglement trouvé ! ';
        this.ov.show(e);
       } else {


    }*/

      } catch {
        console.log(' methode genererExcel');

      }

  }






  async ListBrouTout(e) {
    this.ListBrous = new Array();
   //  const from = '01/04/2010';
    const from =  this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
 switch (this.mvt) {
   case 'tout' : {await this.brouService.getEtatRegCltToutDebitCredit(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
     this.ListBrous = data['_embedded'].brous;
   });
   for (const obj of this.ListBrous ) {
    if (obj.sens === 'D') {
      obj.code = '0.000';
    } else {
      obj.code = obj.montant;
      obj.montant = '0.000';
    }
    if (this.selectedClient !== undefined && this.selectedClient !== null) {
      obj.cle = this.selectedClient.deno;
     } else {

      for (const clt of this.clients ) {
        if (obj.compte === clt.code) {
          obj.cle = clt.deno;
          break;
        }
      }

     }
   }
   this.ListTotPiece = new Array();
   await this.brouService.getEtatRegByPieceEtatRegClt(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste tot piece ', data);
     this.ListTotPiece = data['_embedded'].etatRegClts;
   });
   for (const etat of this.ListTotPiece) {
     if (etat.credit === 'D') {
           etat.credit = Number(etat.debit).toFixed(3);
           etat.debit = '0.000';
     } else {
       etat.debit = Number(etat.debit).toFixed(3);
       etat.credit = '0.000';
     }
   }
   this.ListTotPiece = this.ListTotPiece.sort(function(a, b) {
    return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
  });
  }
   break;
   case 'debit' : {
     await this.brouService.getEtatRegCltToutDebit(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
    this.ListBrous = data['_embedded'].brous;
   });
   for (const obj of this.ListBrous ) {
    if (this.selectedClient !== undefined && this.selectedClient !== null) {
      obj.cle = this.selectedClient.deno;
     } else {

      for (const clt of this.clients ) {
        if (obj.compte === clt.code) {
          obj.cle = clt.deno;
          break;
        }
      }

     }
     obj.code = '0.000';
   }

  }
  this.ListTotPiece = new Array();
  await this.brouService.getEtatRegCltDebitByPiece(this.codeClient, from , to)
  .toPromise()
  .then(data => {
    console.log('liste tot piece ', data);
    this.ListTotPiece = data['_embedded'].etatRegClts;
  });
  for (const etat of this.ListTotPiece) {
      etat.credit = Number(etat.credit).toFixed(3);
      etat.debit = Number(etat.debit).toFixed(3);
  }
  this.ListTotPiece = this.ListTotPiece.sort(function(a, b) {
    return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
  });
  this.grid1.refresh();

   break;
   case 'credit' : await this.brouService.getEtatRegCltToutCredit(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
     this.ListBrous = data['_embedded'].brous;
   });

   for (const obj of this.ListBrous ) {
    if (this.selectedClient !== undefined && this.selectedClient !== null) {
      obj.cle = this.selectedClient.deno;
     } else {

      for (const clt of this.clients ) {
        if (obj.compte === clt.code) {
          obj.cle = clt.deno;
          break;
        }
      }

     }
    obj.code = obj.montant;
    obj.montant = '0.000';

  }

this.ListTotPiece = new Array();
await this.brouService.getEtatRegCltCreditByPiece(this.codeClient, from , to)
.toPromise()
.then(data => {
  console.log('liste tot piece ', data);
  this.ListTotPiece = data['_embedded'].etatRegClts;
});
for (const etat of this.ListTotPiece) {
    etat.credit = Number(etat.credit).toFixed(3);
    etat.debit = Number(etat.debit).toFixed(3);
}
this.ListTotPiece = this.ListTotPiece.sort(function(a, b) {
  return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
});
this.grid1.refresh();
   break;
   default: console.log('erreur methode ListBrou() ', );
 }




  }



async ListBrouCont(e) {
    this.listeBrouConts = new Array();
   //  const from = '01/04/2010';
    const from =  this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
 switch (this.mvt) {
   case 'tout' : await this.brouContService.getEtatRegCltDebitCredit(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
     this.listeBrouConts  = data['_embedded'].brouCont;
   });
   for (const obj of this.listeBrouConts ) {
    if (obj.sens === 'D') {
      obj.code = obj.montant;
      obj.montant = '0.000';
    } else {
      obj.code = '0.000';
    }
    if (this.selectedClient !== undefined && this.selectedClient !== null) {
      obj.cle = this.selectedClient.deno;
     } else {

      for (const clt of this.clients ) {
        if (obj.compte === clt.code) {
          obj.cle = clt.deno;
          break;
        }
      }

     }
   }
   this.ListTotPiece = new Array();
  await this.brouContService.getEtatRegByPiece(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste tot piece ', data);
     this.ListTotPiece = data['_embedded'].etatRegClts;
   });



   for (const etat of this.ListTotPiece) {
     if (etat.credit === 'D') {
           etat.credit = Number(etat.debit).toFixed(3);
           etat.debit = '0.000';
     } else {
       etat.debit = Number(etat.debit).toFixed(3);
       etat.credit = '0.000';
     }
   this.ListTotPiece = this.ListTotPiece.sort(function(a, b) {
      return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
    });
    this.grid1.refresh();
   }
   break;
   case 'debit' : {
     await this.brouContService.getEtatRegCltCredit(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
     this.listeBrouConts = data['_embedded'].brouCont;
   });
   for (const obj of this.listeBrouConts ) {
    if (this.selectedClient !== undefined && this.selectedClient !== null) {
      obj.cle = this.selectedClient.deno;
     } else {

      for (const clt of this.clients ) {
        if (obj.compte === clt.code) {
          obj.cle = clt.deno;
          break;
        }
      }

     }
     obj.code = '0.000';
   }

  }
  this.ListTotPiece = new Array();
  await this.brouContService.getEtatRegCltCreditByPiece(this.codeClient, from , to)
  .toPromise()
  .then(data => {
    console.log('liste tot piece ', data);
    this.ListTotPiece = data['_embedded'].etatRegClts;
  });
  for (const etat of this.ListTotPiece) {
      etat.debit = Number(etat.credit).toFixed(3);
      etat.credit =  '0.000';
  }
  this.ListTotPiece = this.ListTotPiece.sort(function(a, b) {
    return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
  });
  this.grid1.refresh();
   break;
   case 'credit' : await this.brouContService.getEtatRegCltDebit(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
     this.listeBrouConts = data['_embedded'].brouCont;
   });

   for (const obj of this.listeBrouConts ) {
    if (this.selectedClient !== undefined && this.selectedClient !== null) {
      obj.cle = this.selectedClient.deno;
     } else {

      for (const clt of this.clients ) {
        if (obj.compte === clt.code) {
          obj.cle = clt.deno;
          break;
        }
      }

     }
    obj.code = obj.montant;
    obj.montant = '0.000';

  }

this.ListTotPiece = new Array();
await this.brouContService.getEtatRegCltDebitByPiece(this.codeClient, from , to)
.toPromise()
.then(data => {
  console.log('liste tot piece ', data);
  this.ListTotPiece = data['_embedded'].etatRegClts;
});
for (const etat of this.ListTotPiece) {
    etat.credit = Number(etat.debit).toFixed(3);
    etat.debit = '0.000';
}
this.ListTotPiece = this.ListTotPiece.sort(function(a, b) {
  return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
});
this.grid1.refresh();
   break;
   default: console.log('erreur methode ListBrouCont() ', );
 }




  }
// getEtatRegCltToutDebitCredit













  async ListBrou(e) {
    this.ListBrous = new Array();
   //  const from = '01/04/2010';
    const from =  this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
 switch (this.mvt) {
   case 'tout' : await this.brouService.getEtatRegCltDebitCredit(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
     this.ListBrous = data['_embedded'].brous;
   });
   for (const obj of this.ListBrous ) {
    if (obj.sens === 'D') {
      obj.code = obj.montant;
      obj.montant = '0.000';
    } else {
      obj.code = '0.000';
    }
    if (this.selectedClient !== undefined && this.selectedClient !== null) {
      obj.cle = this.selectedClient.deno;
     } else {

      for (const clt of this.clients ) {
        if (obj.compte === clt.code) {
          obj.cle = clt.deno;
          break;
        }
      }

     }
   }
   this.ListTotPiece = new Array();
   await this.brouService.getEtatRegByPieceEtatRegClt(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste tot piece ', data);
     this.ListTotPiece = data['_embedded'].etatRegClts;
   });
   for (const etat of this.ListTotPiece) {
     if (etat.credit === 'D') {
           etat.credit = Number(etat.debit).toFixed(3);
           etat.debit = '0.000';
     } else {
       etat.debit = Number(etat.debit).toFixed(3);
       etat.credit = '0.000';
     }
   }
   this.ListTotPiece = this.ListTotPiece.sort(function(a, b) {
    return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
  });
  this.grid1.refresh();

   break;
   case 'debit' : {
     await this.brouService.getEtatRegCltDebit(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou  Debit', data);
    this.ListBrous = data['_embedded'].brous;
   });
   for (const obj of this.ListBrous ) {
    if (this.selectedClient !== undefined && this.selectedClient !== null) {
      obj.cle = this.selectedClient.deno;
     } else {

      for (const clt of this.clients ) {
        if (obj.compte === clt.code) {
          obj.cle = clt.deno;
          break;
        }
      }

     }
     // = obj.montant;
      obj.code = '0.000';
   }

  }
  this.ListTotPiece = new Array();
  await this.brouService.getEtatRegCltDebitByPiece(this.codeClient, from , to)
  .toPromise()
  .then(data => {
    console.log('liste tot piece ', data);
    this.ListTotPiece = data['_embedded'].etatRegClts;
  });
  for (const etat of this.ListTotPiece) {
      etat.credit = Number(etat.credit).toFixed(3);
      etat.debit = Number(etat.debit).toFixed(3);
  }
  this.ListTotPiece = this.ListTotPiece.sort(function(a, b) {
    return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
  });
  this.grid1.refresh();

   break;
   case 'credit' : await this.brouService.getEtatRegCltCredit(this.codeClient, from , to)
   .toPromise()
   .then(data => {
     console.log('liste brou ', data);
     this.ListBrous = data['_embedded'].brous;
   });

   for (const obj of this.ListBrous ) {
    if (this.selectedClient !== undefined && this.selectedClient !== null) {
      obj.cle = this.selectedClient.deno;
     } else {

      for (const clt of this.clients ) {
        if (obj.compte === clt.code) {
          obj.cle = clt.deno;
          break;
        }
      }

     }
    obj.code = obj.montant;
    obj.montant = '0.000';

  }

  this.ListTotPiece = new Array();
  await this.brouService.getEtatRegCltCreditByPiece(this.codeClient, from , to)
  .toPromise()
  .then(data => {
    console.log('liste tot piece ', data);
    this.ListTotPiece = data['_embedded'].etatRegClts;
  });
  for (const etat of this.ListTotPiece) {
      etat.credit = Number(etat.credit).toFixed(3);
      etat.debit = Number(etat.debit).toFixed(3);
  }
  this.ListTotPiece = this.ListTotPiece.sort(function(a, b) {
    return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
  });
  this.grid1.refresh();
   break;
   default: console.log('erreur methode ListBrou() ', );
 }




  }

async afficher(e) {
  this.wasInside = true;
  this.listeBrous = new Array();
  if (this.module === 'Etat des Regls Clt Cont') {

        await this.ListBrouCont(e);
        console.log('value regle ', this.mvt);

        this.listeBrous = this.listeBrouConts;
        if (this.listeBrous.length <= 500 && this.listeBrous.length > 0 ) {
          const date1 = this.datedebut.toLocaleDateString('en-GB');
          const date2 = this.datefin.toLocaleDateString('en-GB');
          await this.caisseService.getTotalRecettesCheque(date1, date2)
             .toPromise()
             .then(data => {
               console.log('tot cheque ', data);
               this.totChequeCaisse = Number(data).toFixed(3);

             });
             await this.caisseService.getTotalRecettesEspece(date1, date2)
             .toPromise()
             .then(data => {
               console.log('tot Espece', data);
               this.totEspeceCaisse = Number(data).toFixed(3);
             });
          this.ngselectDisabled = true;
          this.afficherShow = false;
          this.showCard1 = true;
          this.showNvSaisie = true;
          this.apurementshow = true;
        } else {
          this.afficherShow = true;
          if (this.listeBrous.length === 0) {

            this.styleOvPanel = this.styleOvPanelError;
            this.msgs = 'Aucun reglement trouvé ! ';
            this.ov.show(e);
          } else {
            this.styleOvPanel = this.styleOvPanelError;
            this.msgs = 'Veuillez raffiner les critères  ! ';
            this.ov.show(e);
          }

        }
        console.log('liste brou afficher  ', this.ListBrous );



  } else {

    await this.ListBrou(e);
    console.log('value regle ', this.mvt);

    this.listeBrous = this.ListBrous;
    if (this.listeBrous.length <= 500 && this.listeBrous.length > 0 ) {
      const date1 = this.datedebut.toLocaleDateString('en-GB');
      const date2 = this.datefin.toLocaleDateString('en-GB');
      await this.caisseService.getTotalRecettesCheque(date1, date2)
         .toPromise()
         .then(data => {
           console.log('tot cheque ', data);
           this.totChequeCaisse = Number(data).toFixed(3);

         });
         await this.caisseService.getTotalRecettesEspece(date1, date2)
         .toPromise()
         .then(data => {
           console.log('tot Espece', data);
           this.totEspeceCaisse = Number(data).toFixed(3);
         });
      this.ngselectDisabled = true;
      this.afficherShow = false;
      this.showCard1 = true;
      this.showNvSaisie = true;
      this.apurementshow = true;
    } else {
      this.afficherShow = true;
      if (this.listeBrous.length === 0) {

        this.styleOvPanel = this.styleOvPanelError;
        this.msgs = 'Aucun reglement trouvé ! ';
        this.ov.show(e);
      } else {
        this.styleOvPanel = this.styleOvPanelError;
        this.msgs = 'Veuillez raffiner les critères  ! ';
        this.ov.show(e);
      }

    }
    console.log('liste brou afficher  ', this.ListBrous );

  }
}



  public onSearchClient(word: string, item: any): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  public onSearchClientCode(word: string, item: any): boolean {
    return item.code.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async apercu(e) {
    this.wasInside = true;
    this.ov.hide();

    this.listeBrousimp = new Array();
    if (this.module === 'Etat des Regls Clt Cont') {

          await this.ListBrouCont(e);
          console.log('value regle ', this.mvt);

          this.listeBrousimp = this.listeBrouConts;
          if (this.listeBrousimp.length > 0 ) {
            const date1 = this.datedebut.toLocaleDateString('en-GB');
            const date2 = this.datefin.toLocaleDateString('en-GB');
            await this.caisseService.getTotalRecettesCheque(date1, date2)
               .toPromise()
               .then(data => {
                 console.log('tot cheque ', data);
                 this.totChequeCaisse = Number(data).toFixed(3);

               });
               await this.caisseService.getTotalRecettesEspece(date1, date2)
               .toPromise()
               .then(data => {
                 console.log('tot Espece', data);
                 this.totEspeceCaisse = Number(data).toFixed(3);
               });



           // imp contentieux



    // tslint:disable-next-line:prefer-const
    let sste = globals.societe;
     const datee = new Date();
     const date = datee.toLocaleDateString('en-GB');
    // const displayDate = new Date().toLocaleDateString('en-GB');
    // const displayTime = new Date().toLocaleTimeString();
    const doc1 = new jspdf();
    // page a4 (210 x 297 mm)
    let numPage = 1;
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text('SOCIETE  :   ' + sste, 10, 10);
   doc1.text( 'Tunis le :    ' + date, 147, 12 );



    doc1.setFontSize(14);
    doc1.setFontStyle('arial');
    doc1.text('Etat des règlements des clients contentieux', 60, 20);

    doc1.setFontSize(10);
    doc1.text('Date Debut:        ' + this.datedebut.toLocaleDateString('en-GB'), 10, 26);
    doc1.text('Date fin :         ' + this.datefin.toLocaleDateString('en-GB'), 60, 26);
if (this.codeClient !== '' || this.codeClient === undefined || this.codeClient === null ) {
  doc1.text('Code Client : ' + this.selectedClient.code, 10, 32);
  doc1.text('Raison Sociale : ' + this.selectedClient.deno, 60, 32);
}


    doc1.setFontSize(9);
    doc1.setFontStyle('bold');
    doc1.line(10, 35, 200, 35);
    // ligne Horizontal doc1.line(x1,y1,x2,y2)
    doc1.text('N° APR', 10, 39);
    doc1.text('Code Clt', 25, 39);
    doc1.text('Dénomination', 39, 39);
    doc1.text('Pièce', 92, 39);
    doc1.text('Numéro', 105, 39);
    doc1.text('Banque', 120, 39);
    doc1.text('Date', 135, 39);
    doc1.text('Echéance', 150, 39);
    doc1.text('Mt Débit', 170, 39);
    doc1.text('Mt Crédit', 186, 39);
    doc1.line(10, 42, 200, 42);
    doc1.setFontStyle('normal');
    let y = 47;
    const total = 0;
    doc1.setFontSize(7);
    for (const br of this.listeBrousimp) {

      if (br.apurement !== null) {
        doc1.text(br.apurement, 11, y);
      } else {
          doc1.text('', 11, y);
      }

      if (br.compte !== null) {
        doc1.text(br.compte, 26, y);
      } else {
        doc1.text('', 26, y);
      }
      if (br.cle !== null) {
        doc1.text(br.cle, 40, y);
      } else {
        doc1.text('', 40, y);
      }
      if (br.piece !== null) {
        doc1.text(br.piece, 93, y);
      } else {
        doc1.text('', 93, y);
      }

      if (br.numero !== null) {
        doc1.text(br.numero, 107, y);
      } else {
        doc1.text('', 107, y);
      }
      if (br.banque !== null) {
        doc1.text(br.banque, 121, y);
      } else {
        doc1.text('', 121, y);
      }
       if (br.date !== null) {
      doc1.text(br.date, 136, y);
    } else {
      doc1.text('', 136, y);
    }
    if (br.echeance !== null) {
      doc1.text(br.echeance, 151, y);
    } else {
      doc1.text('', 151, y);
    }
    if (br.code !== null) {
      doc1.text(br.code, 182, y, 'right');
    } else {
      doc1.text('', 182, y);
    }
    if (br.montant !== null) {
      doc1.text(br.montant, 199 , y, 'right');

    } else {
      doc1.text('', 199, y);
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

        doc1.text('N° APR', 10, 24);
        doc1.text('Code Clt', 25, 24);
        doc1.text('Dénomination', 39, 24);
        doc1.text('Pièce', 92, 24);
        doc1.text('Numéro', 105, 24);
        doc1.text('Banque', 120, 24);
        doc1.text('Date', 135, 24);
        doc1.text('Echéance', 150, 24);
        doc1.text('Mt Débit', 170, 24);
        doc1.text('Mt Crédit', 186, 24);

        doc1.line(10, 27, 200, 27);
        doc1.setFontStyle('normal');
        y = 32;
      }
    }












    doc1.line(10, y - 3, 200, y - 3, 'FD');
    doc1.setFontStyle('bold');
    doc1.text('Totaux : ' , 12, y + 3);
    y = y + 6;
    doc1.setFontSize(10);
    doc1.text('Somme Débit  ', 65, y);
    doc1.text('Somme Crédit  ', 100, y);
    y = y + 9;
    doc1.setFontSize(10);
    doc1.setFontStyle('normal');
    for (const br of this.ListTotPiece) {

      if (br.piece !== null) {
        doc1.text(br.piece, 20, y);
      } else {
          doc1.text('', 20, y);
      }

      if (br.debit !== null) {
        doc1.text(Number(br.debit).toFixed(3), 67, y);
      } else {
        doc1.text('', 40, y);
      }
      if (br.credit !== null) {
        doc1.text(Number(br.credit).toFixed(3), 100, y);
      } else {
        doc1.text('', 60, y);
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

        doc1.line(10, 27, 200, 27);
        doc1.setFontStyle('normal');
        y = 32;
      }
    }
    y = y + 7;
    doc1.setFontSize(13);
    doc1.setFontStyle('bold');
    doc1.text('Total Espèce caisse  ', 30, y);
    doc1.setFontSize(11);
    doc1.text(this.totEspeceCaisse, 100, y, 'right');
    doc1.setFontSize(13);
    doc1.text('Total Chèque caisse  ', 115, y);
    doc1.setFontSize(11);
    doc1.text(this.totChequeCaisse, 200, y, 'right');
    doc1.line(10, 27, 200, 27);
    doc1.setFontStyle('normal');
    doc1.text('Page ' + numPage.toFixed(0), 100, 289);
    window.open(doc1.output('bloburl'), '_blank');










          } else {
            if (this.listeBrousimp.length === 0) {

              this.styleOvPanel = this.styleOvPanelError;
              this.msgs = 'Aucun reglement trouvé ! ';
              this.ov.show(e);
            }

          }
          console.log('liste brou afficher  ', this.ListBrous );



    } else {

      await this.ListBrouTout(e);
      console.log('value regle ', this.mvt);

      this.listeBrous = this.ListBrous;
      if ( this.listeBrous.length > 0 ) {
        const date1 = this.datedebut.toLocaleDateString('en-GB');
        const date2 = this.datefin.toLocaleDateString('en-GB');
        await this.caisseService.getTotalRecettesCheque(date1, date2)
           .toPromise()
           .then(data => {
             console.log('tot cheque ', data);
             this.totChequeCaisse = Number(data).toFixed(3);

           });
           await this.caisseService.getTotalRecettesEspece(date1, date2)
           .toPromise()
           .then(data => {
             console.log('tot Espece', data);
             this.totEspeceCaisse = Number(data).toFixed(3);
           });




    // tslint:disable-next-line:prefer-const
    let sste = globals.societe;
     const datee = new Date();
     const date = datee.toLocaleDateString('en-GB');
    // const displayDate = new Date().toLocaleDateString('en-GB');
    // const displayTime = new Date().toLocaleTimeString();
    const doc1 = new jspdf();
    // page a4 (210 x 297 mm)
    let numPage = 1;
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text('SOCIETE  :   ' + sste, 10, 10);
   doc1.text( 'Tunis le :    ' + date, 147, 12 );



    doc1.setFontSize(14);
    doc1.setFontStyle('arial');
    doc1.text('Etat règlements des Clients', 60, 20);

    doc1.setFontSize(10);
    doc1.text('Date Debut:        ' + this.datedebut.toLocaleDateString('en-GB'), 10, 26);
    doc1.text('Date fin :         ' + this.datefin.toLocaleDateString('en-GB'), 60, 26);
if (this.codeClient !== '' || this.codeClient === undefined || this.codeClient === null ) {
  doc1.text('Code Client : ' + this.selectedClient.code, 10, 32);
  doc1.text('Raison Sociale : ' + this.selectedClient.deno, 60, 32);
}


    doc1.setFontSize(9);
    doc1.setFontStyle('bold');
    doc1.line(10, 35, 200, 35);
    // ligne Horizontal doc1.line(x1,y1,x2,y2)
    doc1.text('N° APR', 10, 39);
    doc1.text('Code Clt', 25, 39);
    doc1.text('Dénomination', 39, 39);
    doc1.text('Pièce', 92, 39);
    doc1.text('Numéro', 105, 39);
    doc1.text('Banque', 120, 39);
    doc1.text('Date', 135, 39);
    doc1.text('Echéance', 150, 39);
    doc1.text('Mt Débit', 170, 39);
    doc1.text('Mt Crédit', 186, 39);
    doc1.line(10, 42, 200, 42);
    doc1.setFontStyle('normal');
    let y = 47;
    const total = 0;
    doc1.setFontSize(7);
    for (const br of this.listeBrous) {

      if (br.apurement !== null) {
        doc1.text(br.apurement, 11, y);
      } else {
          doc1.text('', 11, y);
      }

      if (br.compte !== null) {
        doc1.text(br.compte, 26, y);
      } else {
        doc1.text('', 26, y);
      }
      if (br.cle !== null) {
        doc1.text(br.cle, 40, y);
      } else {
        doc1.text('', 40, y);
      }
      if (br.piece !== null) {
        doc1.text(br.piece, 93, y);
      } else {
        doc1.text('', 93, y);
      }

      if (br.numero !== null) {
        doc1.text(br.numero, 107, y);
      } else {
        doc1.text('', 107, y);
      }
      if (br.banque !== null) {
        doc1.text(br.banque, 121, y);
      } else {
        doc1.text('', 121, y);
      }
       if (br.date !== null) {
      doc1.text(br.date, 136, y);
    } else {
      doc1.text('', 136, y);
    }
    if (br.echeance !== null) {
      doc1.text(br.echeance, 151, y);
    } else {
      doc1.text('', 151, y);
    }
    if (br.montant !== null) {
      doc1.text(br.montant, 182, y, 'right');
    } else {
      doc1.text('', 182, y);
    }
    if (br.code !== null) {
      doc1.text(br.code, 199, y, 'right');
    } else {
      doc1.text('', 199, y);
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

        doc1.text('N° APR', 10, 24);
        doc1.text('Code Clt', 25, 24);
        doc1.text('Dénomination', 39, 24);
        doc1.text('Pièce', 92, 24);
        doc1.text('Numéro', 105, 24);
        doc1.text('Banque', 120, 24);
        doc1.text('Date', 135, 24);
        doc1.text('Echéance', 150, 24);
        doc1.text('Mt Débit', 170, 24);
        doc1.text('Mt Crédit', 186, 24);

        doc1.line(10, 27, 200, 27);
        doc1.setFontStyle('normal');
        y = 32;
      }
    }






    doc1.line(10, y - 3, 200, y - 3, 'FD');
    doc1.setFontStyle('bold');
    doc1.text('Totaux : ' , 12, y + 3);
    y = y + 6;
    doc1.setFontSize(10);
    doc1.text('Somme Débit  ', 67, y);
    doc1.text('Somme Crédit  ', 100, y);
    y = y + 9;
    doc1.setFontSize(10);
    doc1.setFontStyle('normal');
    for (const br of this.ListTotPiece) {

      if (br.piece !== null) {
        doc1.text(br.piece, 20, y);
      } else {
          doc1.text('', 20, y);
      }

      if (br.debit !== null) {
        doc1.text(Number(br.debit).toFixed(3), 67, y);
      } else {
        doc1.text('', 40, y);
      }
      if (br.credit !== null) {
        doc1.text(Number(br.credit).toFixed(3), 100, y);
      } else {
        doc1.text('', 60, y);
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

        doc1.line(10, 27, 200, 27);
        doc1.setFontStyle('normal');
        y = 32;
      }
    }
    y = y + 7;
    doc1.setFontSize(13);
    doc1.setFontStyle('bold');
    doc1.text('Total Espèce caisse  ', 30, y);
    doc1.setFontSize(11);
    doc1.text(this.totEspeceCaisse, 100, y, 'right');
    doc1.setFontSize(13);
    doc1.text('Total Chèque caisse  ', 115, y);
    doc1.setFontSize(11);
    doc1.text(this.totChequeCaisse, 200, y, 'right');
    doc1.line(10, 27, 200, 27);
    doc1.setFontStyle('normal');
    doc1.text('Page ' + numPage.toFixed(0), 100, 289);
    window.open(doc1.output('bloburl'), '_blank');







      } else {
        if (this.listeBrous.length === 0) {

          this.styleOvPanel = this.styleOvPanelError;
          this.msgs = 'Aucun reglement trouvé ! ';
          this.ov.show(e);
        }

      }
      console.log('liste brou afficher  ', this.ListBrous );

    }



  }



}
