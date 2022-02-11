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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  selector: 'app-etat-appur-reg-clts',
  templateUrl: './etat-appur-reg-clts.component.html',
  styleUrls: ['./etat-appur-reg-clts.component.scss'],
  providers: [ExcelService],
})
export class EtatAppurRegCltsComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('grid1')
  public grid1: GridComponent;
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
 // datedebut = new Date(this.datedeb.getFullYear(), 0, 1);
  datedebut = new Date();
  datefin = new Date();
  mvt = 'tout';
  styleOvPanel = {};
  tn: any;
  ListBrous = new Array();
  listeBrous = new Array();
  listeBrous500 = new Array();
  ListTotPiece = new Array();
  totChequeCaisse = '0.000';
  totEspeceCaisse = '0.000';
  module = '';
  ListCaisses: any[];
  listeCaisse1: any[];
  tabPiece: any[];
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
    this.module = globals.selectedMenu;
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

  changeClients() {
    if (this.selectedClient === null || this.selectedClient === undefined) {
      this.codeClient = '';
    } else {
      this.codeClient = this.selectedClient.code;
    }
  }

  async ngOnInit() {
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
    this.clients = new Array();

    if (this.module === 'Etat des Apurts Regts cmpts') {
      // comptants like 418% et like 7%
      await this.clientService
        .getClientsComptants()
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clients;
        });
    } else {
      if (this.module === 'Etat des Apurs Des Regls Clts Cont') {
        await this.clientContService
          .getClientContList()
          .toPromise()
          .then((data) => {
            this.clients = data['_embedded'].clientsCont;
          });
        console.log('liste des clients cont ', this.clients);
      } else {
        // terme not (like 418% et like 7% )
        await this.clientService
          .getClientsTermes()
          .toPromise()
          .then((data) => {
            this.clients = data['_embedded'].clients;
          });
        console.log('liste des clients ', this.clients);
      }
    }
  }

  async genererExcel(e) {
    this.wasInside = true;
    try {
      this.wasInside = true;
      this.ov.hide();

      if (this.module === 'Etat des Apurts Regts cmpts') {
        await this.listCaiss(e);
      } else {
        if (this.module === 'Etat des Apurs Des Regls Clts Cont') {
          await this.ListBrouCont(e);
        } else {
          await this.ListBrouTout(e);
        }
        this.listeBrous = this.ListBrous;
        const date1 = this.datedebut.toLocaleDateString('en-GB');
        const date2 = this.datefin.toLocaleDateString('en-GB');
        await this.caisseService
          .getTotalRecettesCheque(date1, date2)
          .toPromise()
          .then((data) => {
            console.log('tot cheque ', data);
            this.totChequeCaisse = Number(data).toFixed(3);
          });
        await this.caisseService
          .getTotalRecettesEspece(date1, date2)
          .toPromise()
          .then((data) => {
            console.log('tot Espece', data);
            this.totEspeceCaisse = Number(data).toFixed(3);
          });
      }

      console.log('liste brou afficher  ', this.ListBrous);
      if (this.listeBrous.length === 0) {
        this.styleOvPanel = this.styleOvPanelError;
        this.msgs = 'Aucun reglement trouvé ! ';
        this.ov.show(e);
      } else {
        const exportExcel = this.listeBrous.map((obj) => {
          return {
            'Numero d\'apurement': obj.apurement,
            'Code client': obj.compte,
            Dénomination: obj.cle,
            Pièce: obj.piece,
            Numéro: obj.numero,
            Banque: obj.banque,
            Date: obj.date,
            Echéance: obj.echeance,
            Débit: Number(obj.code),
            Crédit: Number(obj.montant),
          };
        });
        const daterap = new Date().toLocaleDateString('en-GB');
        this.excelService.exportAsExcelFile(
          exportExcel,
          'deficit commande fournisseur ' + daterap
        );
      }
    } catch {
      console.log(' methode genererExcel');
    }
  }

  async ListBrouTout(e) {
    this.ListBrous = new Array();
    //  const from = '01/04/2010';
    const from = this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
    switch (this.mvt) {
      case 'tout':
        // if()
        await this.brouService
          .getEtatToutApurRegClt(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste brou ', data);
            this.ListBrous = data['_embedded'].brous;
          });

        for (const obj of this.ListBrous) {
          if (obj.sens === 'D') {
            obj.code = 0.000;
          } else {
            obj.code = Number(obj.montant);
            obj.montant = 0.000;
          }
          if (
            this.selectedClient !== undefined &&
            this.selectedClient !== null
          ) {
            obj.cle = this.selectedClient.deno;
          } else {
            for (const clt of this.clients) {
              if (obj.compte === clt.code) {
                obj.cle = clt.deno;
                break;
              }
            }
          }
        }
        this.ListTotPiece = new Array();
        this.tabPiece = new Array();
        await this.brouService
          .getEtatApurRegByPieces(this.codeClient, from, to, '3')
          .toPromise()
          .then((data) => {
            console.log('liste tot piece ', data);
            this.tabPiece = data;
          });
        for (const etat of this.tabPiece) {
          const piece = {
            piece: null,
            credit: null,
            debit: null,
          };
          piece.piece = etat[0];
          piece.debit = etat[1];
          piece.credit = etat[2];
          this.ListTotPiece.push(piece);
        }
        this.grid1.refresh();
        console.log('liste tot ******************* piece ', this.ListTotPiece);

        break;
      case 'Apure':
        {
          await this.brouService
            .getEtatApurRegClt(this.codeClient, from, to)
            .toPromise()
            .then((data) => {
              console.log('liste brou ', data);
              this.ListBrous = data['_embedded'].brous;
            });
          for (const obj of this.ListBrous) {

            if (obj.sens === 'D') {
              obj.code = 0.000;
            } else {
              obj.code = Number(obj.montant);
              obj.montant = 0.000;
            }

            if (
              this.selectedClient !== undefined &&
              this.selectedClient !== null
            ) {
              obj.cle = this.selectedClient.deno;
            } else {
              for (const clt of this.clients) {
                if (obj.compte === clt.code) {
                  obj.cle = clt.deno;
                  break;
                }
              }
            }
          }
        }
        this.ListTotPiece = new Array();
        this.tabPiece = new Array();
        await this.brouService
          .getEtatApurRegByPieces(this.codeClient, from, to, '1')
          .toPromise()
          .then((data) => {
            console.log('liste tot piece ', data);
            this.tabPiece = data;
          });
        for (const etat of this.tabPiece) {
          const piece = {
            piece: null,
            credit: null,
            debit: null,
          };
          piece.piece = etat[0];
          piece.debit = etat[1];
          piece.credit = etat[2];
          this.ListTotPiece.push(piece);
        }
        this.grid1.refresh();
        console.log('liste tot ******************* piece ', this.ListTotPiece);
        break;
      case 'NonApure':
        await this.brouService
          .getEtatNonApurRegClt(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste brou ', data);
            this.ListBrous = data['_embedded'].brous;
          });

        for (const obj of this.ListBrous) {
          console.log('item sens montant', obj.sens, obj.montant );
          if (obj.sens === 'D') {
            obj.montant = Number(obj.montant);
            obj.code = 0.000;
          } else {
            obj.code = Number(obj.montant);
            obj.montant = 0.000;
          }
          if (
            this.selectedClient !== undefined &&
            this.selectedClient !== null
          ) {
            obj.cle = this.selectedClient.deno;
          } else {
            for (const clt of this.clients) {
              if (obj.compte === clt.code) {
                obj.cle = clt.deno;
                break;
              }
            }
          }

        }

        this.ListTotPiece = new Array();
        this.tabPiece = new Array();
        await this.brouService
          .getEtatApurRegByPieces(this.codeClient, from, to, '2')
          .toPromise()
          .then((data) => {
            console.log('liste tot piece ', data);
            this.tabPiece = data;
          });
        for (const etat of this.tabPiece) {
          const piece = {
            piece: null,
            credit: null,
            debit: null,
          };
          piece.piece = etat[0];
          piece.debit = etat[1];
          piece.credit = etat[2];
          this.ListTotPiece.push(piece);
        }
        this.grid1.refresh();
        console.log('liste tot ******************* piece ', this.ListTotPiece);
        break;
      default:
        console.log('erreur methode ListBrou() ');
    }
  }

  ConvertDateToString(dateString) {
    const formdate: string = dateString.replace('-', '/');

    let dateR = '';
    dateR = String(formdate).substring(0, 10);
    const convertDate = new Date(dateR);
    return convertDate.toLocaleDateString('en-GB');
  }

  async listCaiss(e) {
    this.ListCaisses = new Array();
    const from = this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
    let apur = 1;
    console.log('reglement   ', this.mvt);

    switch (this.mvt) {
      case 'tout':
        apur = 3;
        break;
      case 'Apure':
        apur = 1;
        break;
      case 'NonApure':
        apur = 2;
        break;
    }
    await this.caisseService
      .getEtatToutApurRegClt(apur, this.codeClient, from, to)
      .toPromise()
      .then((data) => {
        //  console.log('liste brou ', data);
        // this.ListCaisses = data['_embedded'];
        this.ListCaisses = data;
      });
    console.log('liste caisse ', this.ListCaisses);
    this.listeCaisse1 = new Array();
    for (let i = 0; i < this.ListCaisses.length; i++) {
      const obj = {
        id: null,
        apurement: null,
        dateApur: null,
        compte: null,
        cle: null,
        piece: null,
        numero: null,
        banque: null,
        date: null,
        echeance: null,
        montant: null,
        code: null,
      };
      obj.id = this.ListCaisses[i][0];
      obj.apurement = this.ListCaisses[i][1];
      obj.dateApur = this.ListCaisses[i][2];
      obj.compte = this.ListCaisses[i][3];
      obj.cle = this.ListCaisses[i][4];
      obj.piece = this.ListCaisses[i][5];
      obj.numero = this.ListCaisses[i][6];
      obj.banque = this.ListCaisses[i][7];
      obj.date = this.ListCaisses[i][8];
      obj.echeance = this.ListCaisses[i][9];

      obj.code = this.ListCaisses[i][10];
      if (obj.code === null || obj.code === '') {
        obj.code = 0.000;
      }


      obj.montant = this.ListCaisses[i][11];
      if (obj.montant === null || obj.montant === '') {
        obj.montant = 0.000;
      }

      if (obj.echeance !== null && obj.echeance !== undefined) {
        obj.echeance = this.ConvertDateToString(obj.echeance);
      }

      if (obj.date !== null && obj.date !== undefined) {
        obj.date = this.ConvertDateToString(obj.date);
      }

      if (obj.dateApur !== null && obj.dateApur !== undefined) {
        obj.dateApur = this.ConvertDateToString(obj.dateApur);
      }

      this.listeCaisse1.push(obj);
    }
    this.listeBrous = this.listeCaisse1;
    console.log('liste caisseeeeeeeeeeees ', this.listeCaisse1);
    let listeSommeCaisse = new Array();
    this.ListTotPiece = new Array();
    await this.caisseService
      .getEtatSommeDCApurRegCltCompt(apur, this.codeClient, from, to)
      .toPromise()
      .then((data) => {
        console.log('liste somme piece ', data);
        listeSommeCaisse = data;
      });
    for (let i = 0; i < listeSommeCaisse.length; i++) {
      const obj = {
        piece: null,
        debit: null,
        credit: null,
      };
      obj.piece = listeSommeCaisse[i][0];
      obj.debit = listeSommeCaisse[i][1];
      obj.credit = listeSommeCaisse[i][2];
      this.ListTotPiece.push(obj);
    }
    this.grid1.refresh();
  }

  async listCaiss500(e) {
    this.ListCaisses = new Array();
    const from = this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
    let apur = 1;
    console.log('reglement   ', this.mvt);

    switch (this.mvt) {
      case 'tout':
        apur = 3;
        break;
      case 'Apure':
        apur = 1;
        break;
      case 'NonApure':
        apur = 2;
        break;
    }
    await this.caisseService
      .getEtatToutApurRegClt500(apur, this.codeClient, from, to)
      .toPromise()
      .then((data) => {
        //  console.log('liste brou ', data);
        // this.ListCaisses = data['_embedded'];
        this.ListCaisses = data;
      });
    console.log('liste caisse ', this.ListCaisses);
    this.listeCaisse1 = new Array();
    for (let i = 0; i < this.ListCaisses.length; i++) {
      const obj = {
        id: null,
        apurement: null,
        dateApur: null,
        compte: null,
        cle: null,
        piece: null,
        numero: null,
        banque: null,
        date: null,
        echeance: null,
        montant: null,
        code: null,
      };
      obj.id = this.ListCaisses[i][0];
      obj.apurement = this.ListCaisses[i][1];
      obj.dateApur = this.ListCaisses[i][2];
      obj.compte = this.ListCaisses[i][3];
      obj.cle = this.ListCaisses[i][4];
      obj.piece = this.ListCaisses[i][5];
      obj.numero = this.ListCaisses[i][6];
      obj.banque = this.ListCaisses[i][7];
      obj.date = this.ListCaisses[i][8];
      obj.echeance = this.ListCaisses[i][9];

      obj.code = this.ListCaisses[i][10];
      if (obj.code === null || obj.code === '') {
        obj.code = 0.000;
      }



      obj.montant = this.ListCaisses[i][11];
      if (obj.montant === null || obj.montant === '') {
        obj.montant = 0.000;
      }

      if (obj.echeance !== null && obj.echeance !== undefined) {
        obj.echeance = this.ConvertDateToString(obj.echeance);
      }

      if (obj.date !== null && obj.date !== undefined) {
        obj.date = this.ConvertDateToString(obj.date);
      }

      if (obj.dateApur !== null && obj.dateApur !== undefined) {
        obj.dateApur = this.ConvertDateToString(obj.dateApur);
      }

      this.listeCaisse1.push(obj);
    }
    this.listeBrous = this.listeCaisse1;
    console.log('liste caisseeeeeeeeeeees ', this.listeCaisse1);
    let listeSommeCaisse = new Array();
    this.ListTotPiece = new Array();
    await this.caisseService
      .getEtatSommeDCApurRegCltCompt(apur, this.codeClient, from, to)
      .toPromise()
      .then((data) => {
        console.log('liste somme piece ', data);
        listeSommeCaisse = data;
      });
    for (let i = 0; i < listeSommeCaisse.length; i++) {
      const obj = {
        piece: null,
        debit: null,
        credit: null,
      };
      obj.piece = listeSommeCaisse[i][0];
      obj.debit = listeSommeCaisse[i][1];
      obj.credit = listeSommeCaisse[i][2];

      this.ListTotPiece.push(obj);
    }
    this.grid1.refresh();
  }
  async ListBrouCont(e) {
    this.ListBrous = new Array();
    //  const from = '01/04/2010';
    const from = this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
    switch (this.mvt) {
      case 'tout':
        await this.brouContService
          .getEtatToutApurRegClt(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste brou coooooooooooooooooooooooooooont ', data);
            this.ListBrous = data['_embedded'].brouCont;
          });

        for (const obj of this.ListBrous) {
          if (obj.sens === 'D') {
            obj.code = 0.000;
          } else {
            obj.code = Number(obj.montant);
            obj.montant = 0.000;
          }
          if (
            this.selectedClient !== undefined &&
            this.selectedClient !== null
          ) {
            obj.cle = this.selectedClient.deno;
          } else {
            for (const clt of this.clients) {
              if (obj.compte === clt.code) {
                obj.cle = clt.deno;
                break;
              }
            }
          }
        }
        this.listeBrous = this.ListBrous;
        this.ListTotPiece = new Array();
        let listDebitApur = new Array();
        let listCreditApur = new Array();
        let listDebitNonApur = new Array();
        let listCreditNonApur = new Array();
        await this.brouContService
          .getEtatApurRegCltCreditByPiece(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log(
              'liste tot piece ************ Apur RegClt Credit',
              data
            );
            listCreditApur = data['_embedded'].etatRegClts;
          });

        await this.brouContService
          .getEtatApurRegCltDebitByPiece(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste tot piece ************ Apur RegClt Debit', data);
            listDebitApur = data['_embedded'].etatRegClts;
          });

        await this.brouContService
          .getEtatNonApurRegCltCreditByPiece(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log(
              'liste tot piece ************  Non Apur RegClt Credit',
              data
            );
            listCreditNonApur = data['_embedded'].etatRegClts;
          });

        await this.brouContService
          .getEtatNonApurRegCltDebitByPiece(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log(
              'liste tot piece ************ Non Apur RegClt Debit',
              data
            );
            listDebitNonApur = data['_embedded'].etatRegClts;
          });

        this.ListTotPiece = this.ListTotPiece.concat(listCreditApur);
        this.ListTotPiece = this.ListTotPiece.concat(listDebitApur);
        this.ListTotPiece = this.ListTotPiece.concat(listCreditNonApur);
        this.ListTotPiece = this.ListTotPiece.concat(listDebitNonApur);

        for (const etat of this.ListTotPiece) {
          etat.credit = Number(etat.credit).toFixed(3);
          etat.debit = Number(etat.debit).toFixed(3);
        }
        this.ListTotPiece = this.ListTotPiece.sort(function (a, b) {
          return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
        });
        break;
      case 'Apure':
        {
          await this.brouContService
            .getEtatApurRegClt(this.codeClient, from, to)
            .toPromise()
            .then((data) => {
              console.log('liste brou ', data);
              this.ListBrous = data['_embedded'].brouCont;
            });
          for (const obj of this.ListBrous) {
            if (obj.sens === 'D') {
              obj.code = 0.000;
            } else {
              obj.code = Number(obj.montant);
              obj.montant = 0.000;
            }
            if (
              this.selectedClient !== undefined &&
              this.selectedClient !== null
            ) {
              obj.cle = this.selectedClient.deno;
            } else {
              for (const clt of this.clients) {
                if (obj.compte === clt.code) {
                  obj.cle = clt.deno;
                  break;
                }
              }
            }
          }
        }

        this.ListTotPiece = new Array();
        listDebitApur = new Array();
        listCreditApur = new Array();

        await this.brouContService
          .getEtatApurRegCltCreditByPiece(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log(
              'liste tot piece ************ Apur RegClt Credit',
              data
            );
            listCreditApur = data['_embedded'].etatRegClts;
          });

        await this.brouContService
          .getEtatApurRegCltDebitByPiece(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste tot piece ************ Apur RegClt Debit', data);
            listDebitApur = data['_embedded'].etatRegClts;
          });

        this.ListTotPiece = this.ListTotPiece.concat(listCreditApur);
        this.ListTotPiece = this.ListTotPiece.concat(listDebitApur);

        for (const etat of this.ListTotPiece) {
          etat.credit = Number(etat.credit).toFixed(3);
          etat.debit = Number(etat.debit).toFixed(3);
        }
        this.ListTotPiece = this.ListTotPiece.sort(function (a, b) {
          return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
        });
        break;
      case 'NonApure':
        await this.brouContService
          .getEtatNonApurRegClt(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste brou ', data);
            this.ListBrous = data['_embedded'].brouCont;
          });

        for (const obj of this.ListBrous) {
          if (obj.sens === 'D') {
            obj.code = 0.000;
          } else {
            obj.code = Number(obj.montant);
            obj.montant = 0.000;
          }
          if (
            this.selectedClient !== undefined &&
            this.selectedClient !== null
          ) {
            obj.cle = this.selectedClient.deno;
          } else {
            for (const clt of this.clients) {
              if (obj.compte === clt.code) {
                obj.cle = clt.deno;
                break;
              }
            }
          }
        }

        this.ListTotPiece = new Array();
        listDebitNonApur = new Array();
        listCreditNonApur = new Array();

        await this.brouContService
          .getEtatNonApurRegCltCreditByPiece(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log(
              'liste tot piece ************  Non Apur RegClt Credit',
              data
            );
            listCreditNonApur = data['_embedded'].etatRegClts;
          });

        await this.brouContService
          .getEtatNonApurRegCltDebitByPiece(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log(
              'liste tot piece ************ Non Apur RegClt Debit',
              data
            );
            listDebitNonApur = data['_embedded'].etatRegClts;
          });

        this.ListTotPiece = this.ListTotPiece.concat(listCreditNonApur);
        this.ListTotPiece = this.ListTotPiece.concat(listDebitNonApur);

        for (const etat of this.ListTotPiece) {
          etat.credit = Number(etat.credit).toFixed(3);
          etat.debit = Number(etat.debit).toFixed(3);
        }
        this.ListTotPiece = this.ListTotPiece.sort(function (a, b) {
          return a.piece > b.piece ? 1 : a.piece < b.piece ? -1 : 0;
        });
        break;
      default:
        console.log('erreur methode ListBrou() ');
    }
  }

  async ListBrouCont500(e) {
    this.ListBrous = new Array();
    //  const from = '01/04/2010';
    const from = this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
    switch (this.mvt) {
      case 'tout':
        await this.brouContService
          .getEtatToutApurRegClt500(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste brou ', data);
            this.ListBrous = data['_embedded'].brouCont;
          });
        console.log('ffffffffffffffffffffffffffff  ', this.ListBrous.length);

        break;
      case 'Apure':
        {
          await this.brouContService
            .getEtatApurRegClt500(this.codeClient, from, to)
            .toPromise()
            .then((data) => {
              console.log('liste brou ', data);
              this.ListBrous = data['_embedded'].brouCont;
            });
        }
        break;
      case 'NonApure':
        await this.brouContService
          .getEtatNonApurRegClt500(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste brou ', data);
            this.ListBrous = data['_embedded'].brouCont;
          });
        break;
      default:
        console.log('erreur methode ListBrou() ');
    }
  }

  async ListBrou500(e) {
    this.ListBrous = new Array();
    //  const from = '01/04/2010';
    const from = this.datedebut.toLocaleDateString('en-GB');
    const to = this.datefin.toLocaleDateString('en-GB');
    switch (this.mvt) {
      case 'tout':
        await this.brouService
          .getEtatToutApurRegClt500(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste brou ', data);
            this.ListBrous = data['_embedded'].brous;
          });
        console.log('ffffffffffffffffffffffffffff  ', this.ListBrous.length);

        break;
      case 'Apure':
        {
          await this.brouService
            .getEtatApurRegClt500(this.codeClient, from, to)
            .toPromise()
            .then((data) => {
              console.log('liste brou ', data);
              this.ListBrous = data['_embedded'].brous;
            });
        }
        break;
      case 'NonApure':
        await this.brouService
          .getEtatNonApurRegClt500(this.codeClient, from, to)
          .toPromise()
          .then((data) => {
            console.log('liste brou ', data);
            this.ListBrous = data['_embedded'].brous;
          });
        break;
      default:
        console.log('erreur methode ListBrou() ');
    }
  }

  async afficher(e) {
    this.styleOvPanel = this.styleOvPanelError;
    this.wasInside = true;
    this.listeBrous = new Array();

    if (this.module === 'Etat des Apurts Regts cmpts') {
      await this.listCaiss500(e);

      if (this.listeCaisse1.length <= 500 && this.listeCaisse1.length > 0) {
        await this.listCaiss(e);
        this.listeBrous = this.listeCaisse1;
        const date1 = this.datedebut.toLocaleDateString('en-GB');
        const date2 = this.datefin.toLocaleDateString('en-GB');

        await this.caisseService
          .getTotalRecettesCheque(date1, date2)
          .toPromise()
          .then((data) => {
            console.log('tot cheque ', data);
            this.totChequeCaisse = Number(data).toFixed(3);
          });
        await this.caisseService
          .getTotalRecettesEspece(date1, date2)
          .toPromise()
          .then((data) => {
            console.log('tot Espece', data);
            this.totEspeceCaisse = Number(data).toFixed(3);
          });

        this.ngselectDisabled = true;
        this.afficherShow = false;
        this.showCard1 = true;
        this.showNvSaisie = true;
        this.apurementshow = true;
      } else {
        if (this.listeCaisse1.length > 500) {
          this.msgs = 'Veuillez raffiner les critères !!';
          this.ov.show(e, document.getElementById('btnafficher'));
        } else {
          this.msgs = 'Aucun reglement trouvé !!';
          this.ov.show(e, document.getElementById('btnafficher'));
        }
      }

    } else {
      if (this.module === 'Etat des Apurs Des Regls Clts Cont') {
        await this.ListBrouCont500(e);

        if (this.ListBrous.length <= 500 && this.ListBrous.length > 0) {
          await this.ListBrouCont(e);
          this.listeBrous = this.ListBrous;
          const date1 = this.datedebut.toLocaleDateString('en-GB');
          const date2 = this.datefin.toLocaleDateString('en-GB');

          await this.caisseService
            .getTotalRecettesCheque(date1, date2)
            .toPromise()
            .then((data) => {
              console.log('tot cheque ', data);
              this.totChequeCaisse = Number(data).toFixed(3);
            });
          await this.caisseService
            .getTotalRecettesEspece(date1, date2)
            .toPromise()
            .then((data) => {
              console.log('tot Espece', data);
              this.totEspeceCaisse = Number(data).toFixed(3);
            });

          this.ngselectDisabled = true;
          this.afficherShow = false;
          this.showCard1 = true;
          this.showNvSaisie = true;
          this.apurementshow = true;
        } else {
          if (this.ListBrous.length > 500) {
            this.msgs = 'Veuillez raffiner les critères !!';
            this.ov.show(e, document.getElementById('btnafficher'));
          } else {
            this.msgs = 'Aucun reglement trouvé !!';
            this.ov.show(e, document.getElementById('btnafficher'));
          }
        }
      } else {
        await this.ListBrou500(e);

        if (this.ListBrous.length <= 500 && this.ListBrous.length > 0) {
          await this.ListBrouTout(e);
          this.listeBrous = this.ListBrous;
          const date1 = this.datedebut.toLocaleDateString('en-GB');
          const date2 = this.datefin.toLocaleDateString('en-GB');

          await this.caisseService
            .getTotalRecettesCheque(date1, date2)
            .toPromise()
            .then((data) => {
              console.log('tot cheque ', data);
              this.totChequeCaisse = Number(data).toFixed(3);
            });
          await this.caisseService
            .getTotalRecettesEspece(date1, date2)
            .toPromise()
            .then((data) => {
              console.log('tot Espece', data);
              this.totEspeceCaisse = Number(data).toFixed(3);
            });

          this.ngselectDisabled = true;
          this.afficherShow = false;
          this.showCard1 = true;
          this.showNvSaisie = true;
          this.apurementshow = true;
        } else {
          if (this.ListBrous.length > 500) {
            this.msgs = 'Veuillez raffiner les critères !!';
            this.ov.show(e, document.getElementById('btnafficher'));
          } else {
            this.msgs = 'Aucun reglement trouvé !!';
            this.ov.show(e, document.getElementById('btnafficher'));
          }
        }

        console.log('liste brou afficher  ', this.ListBrous);
      }
    }
  }

  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async apercu(e) {
    this.wasInside = true;
    this.ov.hide();

    if (this.module === 'Etat des Apurts Regts cmpts') {
      await this.listCaiss(e);
    } else {
      if (this.module === 'Etat des Apurs Des Regls Clts Cont') {
        await this.ListBrouCont(e);
      } else {
        await this.ListBrouTout(e);
      }
      this.listeBrous = this.ListBrous;
      const date1 = this.datedebut.toLocaleDateString('en-GB');
      const date2 = this.datefin.toLocaleDateString('en-GB');
      await this.caisseService
        .getTotalRecettesCheque(date1, date2)
        .toPromise()
        .then((data) => {
          console.log('tot cheque ', data);
          this.totChequeCaisse = Number(data).toFixed(3);
        });
      await this.caisseService
        .getTotalRecettesEspece(date1, date2)
        .toPromise()
        .then((data) => {
          console.log('tot Espece', data);
          this.totEspeceCaisse = Number(data).toFixed(3);
        });
    }

    console.log('liste brou afficher  ', this.ListBrous);
    if (this.listeBrous.length === 0) {
      this.styleOvPanel = this.styleOvPanelError;
      this.msgs = 'Aucun reglement trouvé ! ';
      this.ov.show(e);
    } else {
      const sste = globals.societe;
      const datee = new Date();
      const date = datee.toLocaleDateString('en-GB');

      const doc1 = new jspdf();
      // page a4 (210 x 297 mm)
      let numPage = 1;
      doc1.setFontSize(10);
      doc1.setFontStyle('arial');
      doc1.text('SOCIETE  :   ' + sste, 10, 10);
      doc1.text('Tunis le :    ' + date, 147, 12);

      doc1.setFontSize(14);
      doc1.setFontStyle('arial');
      doc1.text(this.module, 60, 20);

      doc1.setFontSize(10);
      doc1.text(
        'Date Debut:        ' + this.datedebut.toLocaleDateString('en-GB'),
        10,
        26
      );
      doc1.text(
        'Date fin :         ' + this.datefin.toLocaleDateString('en-GB'),
        60,
        26
      );
      if (
        this.codeClient !== '' ||
        this.codeClient === undefined ||
        this.codeClient === null
      ) {
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
          doc1.text(String(br.apurement), 11, y);
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
          doc1.text(Number(br.code).toFixed(3), 182, y, 'right');
        } else {
          doc1.text('', 182, y);
        }
        if (br.code !== null) {
          doc1.text(Number(br.montant).toFixed(3), 199, y, 'right');
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

      doc1.setFontSize(16);
      y = y + 7;
      doc1.text('Totaux : ', 12, y);
      y = y + 6;
      doc1.setFontSize(10);
      doc1.text('Somme Débit  ', 67, y);
      doc1.text('Somme Crédit  ', 100, y);
      y = y + 9;
      doc1.setFontSize(10);
      doc1.setFontStyle('normal');
      for (const br of this.ListTotPiece) {
        if (br.piece !== null) {
          doc1.setFontStyle('bold');
          doc1.text(br.piece, 20, y);
        } else {
          doc1.text('', 20, y);
        }

        if (br.credit !== null) {
          doc1.setFontStyle('normal');
          doc1.text(Number(br.credit).toFixed(3), 90, y, 'right');
        } else {
          doc1.text('', 90, y, 'right');
        }
        if (br.debit !== null) {
          doc1.setFontStyle('normal');
          doc1.text(Number(br.debit).toFixed(3), 120, y, 'right');
        } else {
          doc1.text('', 120, y, 'right');
        }
        y = y + 7;
        if (y > 277) {
          doc1.line(10, y - 3, 200, y - 3, 'FD');
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
          numPage++;
          doc1.addPage();
          doc1.setFontStyle('bold');
          doc1.line(10, 20, 200, 20);

          doc1.line(10, 27, 200, 27);
          doc1.setFontStyle('normal');
          y = 32;
        }
      }
      if (this.module !== 'Etat des Apurts Regts cmpts') {
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
      }
      doc1.line(10, 27, 200, 27);
      doc1.setFontStyle('normal');
      doc1.text('Page ' + numPage.toFixed(0), 100, 289);
      window.open(doc1.output('bloburl'), '_blank');
    }
  }
}
