import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { BanqueService } from '../services/banque.service';
import { ClientService } from '../services/client.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import {
  GridComponent,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { L10n } from '@syncfusion/ej2-base';
import { setCulture } from '@syncfusion/ej2-base';
import { setCurrencyCode } from '@syncfusion/ej2-base';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { CaisseService } from '../services/caisse.service';
import { AppurementReglementComponent } from '../appurement-reglement/appurement-reglement.component';
import { Dialog, OverlayPanel } from 'primeng/primeng';
import { BrouService } from '../services/brou.service';
import { CaissePService } from '../services/caisseP.service';
import { SteService } from '../services/ste.service';
import { ConfirmationService } from 'primeng/api';
import { ExcelService } from '../services/excel.service';
import { SmsService } from '../services/sms.service';
import { LoginService } from 'src/app/login/login.service';
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
  selector: 'app-gestion-tresorerie',
  templateUrl: './gestion-tresorerie.component.html',
  styleUrls: ['./gestion-tresorerie.component.scss'],
  providers: [ConfirmationService, ExcelService],
})
export class GestionTresorerieComponent implements OnInit {
  CaisseShowPDF: boolean;
  idBrou: string;
  liste: any;
  typeBord: string;
  compte: string;
  codeBord: string;
  datver: string;
  hiddenGrid = true;
  hiddenGridSelctionne = true;
  checkedItem: any;
  totMontantSelectionne = '0.000';
  totSelectionee = 0;
  listePdf: any[];
  phonesNumber: string[];

  phonesNumberIndest = globals.phonesNumberIndest;

  phonesNumberSMD = globals.phonesNumberSMD;
  phonesNumberAut = globals.phonesNumberAut;
  phonesNumberHard = globals.phonesNumberHard;

  phonesNumberCdg = globals.phonesNumberCdg;

  echTout = '1';
  nomSte = '';
  ERRORSMS: string;
  visibleProbSMS: boolean;
  et: string;
  nbreSelectionnees: string;
  nbrLigneSelectionnes: number;
  visibleVerifValidation: boolean;
  chq: string;
  Totmontant = '0.000';
  montantRech = '';
  datedebutEch = new Date(new Date().getFullYear(), 0, 1);
  dateFinEch = new Date();


  datedebutEchString = '';
  dateFinEchString = '';
  hiddenEch = true;


  constructor(
    private smsService: SmsService,
    private loginService: LoginService,
    private excelService: ExcelService,
    private brouService: BrouService,
    private clientService: ClientService,
    private config: NgSelectConfig,
    private caisseService: CaisseService,
    private caissePService: CaissePService,
    private steService: SteService,
    private confirmationService: ConfirmationService,
    private banqueService: BanqueService
  ) {
    this.config.notFoundText = 'aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  selectionOptions: SelectionSettingsModel;
  @ViewChild(AppurementReglementComponent) Appurement;
  tn: any;
  datedebut: Date;
  disabled;
  datefin: Date;
  dateOp: Date;
  public formatOptions: object;
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
  operation = 'VE';
  blockedDocument: boolean;
  hiddenRFB = false;
  hiddenVE = false;
  hiddenVF = false;
  hiddenVESC = false;
  hiddenEP = false;
  hiddenED = false;
  hiddenRI = false;
  msg: string;
  wasInside = false;
  totalVir = '0.000';
  totalTraite = '0.000';
  totalCheque = '0.000';
  totalEspece = '0.000';
  codeBanque2 = '';
  selectedBanque2 = null;
  denoBanque2: any;
  selectedGridRecords: any[];
  disabled2 = false;
  disabledBanque2  = false;

  brouDebit: any[];
  Codeapurement: string;
  brouCredit: any[];
  consultApurShow = false;
  disabledEp = false;
  allowSelect = false;
  validshow = false;
  maxBorEncCs: any;
  maxBorRtrCs: any;
  maxBorVerCs: any;
  maxBorRtrCp: any;
  maxBorVerCp: any;
  maxBorEncCp: any;
  maxBorEncBr: any;
  maxBorRtrBr: any;
  maxBorVerBr: any;
  ste: any;
  societe: any;
  numer: number;
  typ_imp: string;
  chq_trt: string;
  pie: any;
  cmp: any;
  mt: any;
  dte: any;
  nm: any;
  nom_client: any;

  selectPieceShow = true;
  affichEnregOp = false;

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




  onRowUnselect() {
    this.consultApurShow = false;
    this.Codeapurement = null;
    this.grid.selectRows([]);
    this.gridSelctionnee.selectRows([]);
  }

  doublclick(e) {
    this.op.hide();
    if (this.affichEnregOp) {
      this.wasInside = true;
      //  this.op.hide();
      this.msg = 'veuillez choisir une banque ';
      this.op.show(e, document.getElementById('selecttBtn'));
    } else {
    }
  }

  async getMaxValueBord() {
    await this.caisseService
      .getMaxBorEnc()
      .toPromise()
      .then((data) => {
        this.maxBorEncCs = data;
      });
    await this.caisseService
      .getMaxborRtr()
      .toPromise()
      .then((data) => {
        this.maxBorRtrCs = data;
      });
    await this.caisseService
      .getMaxMorVer()
      .toPromise()
      .then((data) => {
        this.maxBorVerCs = data;
      });

    await this.caissePService
      .getMaxBorEnc()
      .toPromise()
      .then((data) => {
        this.maxBorEncCp = data;
      });

    await this.caissePService
      .getMaxborRtr()
      .toPromise()
      .then((data) => {
        this.maxBorRtrCp = data;
      });
    await this.caissePService
      .getMaxMorVer()
      .toPromise()
      .then((data) => {
        this.maxBorVerCp = data;
      });

    await this.brouService
      .getMaxBorEnc()
      .toPromise()
      .then((data) => {
        this.maxBorEncBr = data;
      });

    await this.brouService
      .getMaxborRtr()
      .toPromise()
      .then((data) => {
        this.maxBorRtrBr = data;
      });
    await this.brouService
      .getMaxMorVer()
      .toPromise()
      .then((data) => {
        this.maxBorVerBr = data;
      });
  }


  convertStringToDate(dateString) {
    const formdate: string = dateString.replace('/', '-');
    const formdat: string = formdate.replace('/', '-');
    let dateR = '';
    dateR =
      String(formdat).substring(3, 5) +
      '-' +
      String(formdat).substring(0, 2) +
      '-' +
      String(formdat).substring(6, 10);
    const convertDate = new Date(dateR);
    return convertDate;
  }

  async previsualiserPDF(e) {
    // this.CaisseShowPDF
const numbord = this.numer ;
    this.confirmationService.confirm({
      message: 'BORDEREAU N° ' + numbord  + ' Voulez vous le prévisualiser',
      header: 'Confirmation ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        await this.gererPdf(e);
        window.setTimeout(function () {
          // this.btnvalider = false;
        }, 0);
      },
      reject: () => {
        this.nouvelleSaisie(e);
      },
    });
  }

  annuler() {
    this.visibleVerifValidation = false;
  }
  showDialogMaximized(dialog: Dialog) {
    setTimeout(() => {
      dialog.maximize();
    }, 0);
  }


  verifAvantValidation(e) {
    this.visibleVerifValidation = true;
  //  this.totMontantSelectionne = this.totSelectionee.toFixed(3);
       this.Totmontant  =  this.totMontantSelectionne ;
       console.log('this.Totmontant *** ', this.Totmontant);
       console.log('this.totMontantSelectionne ** ', this.totMontantSelectionne);


  }

  ///////////////////////////////////////////////////////////////////////////////////
  async valider(e) {
    this.numer = null;
    let verif_date_validation_caisse = true;
    if (this.selectedGridRecords.length > 0) {

        this.blockedDocument = true;
        await this.getMaxValueBord();
        if (
          this.operation === 'VE' ||
          this.operation === 'VF' ||
          this.operation === 'VESC'
        ) {

          if (this.operation === 'VE') {
            this.et = 'V';
          }
          if (this.operation === 'VF') {
            this.et = 'F';
          }
          if (this.operation === 'VESC') {
            this.et = 'S';
          }
          this.numer = Number(this.maxBorVerCs);
          if (Number(this.maxBorVerCp) > this.numer) {
            this.numer = Number(this.maxBorVerCp);
          }
          if (Number(this.maxBorVerCp) > this.numer) {
            this.numer = Number(this.maxBorVerCp);
          }

          if (Number(this.maxBorVerBr) > this.numer) {
            this.numer = Number(this.maxBorVerBr);
          }
        }

        if (
          this.operation === 'EP' ||
          this.operation === 'ED' ||
          this.operation === 'RI'
        ) {

          if (this.operation === 'ED') {
            this.et = 'E';
          }
          if (this.operation === 'RI') {
            this.et = 'I';
          }
          if (this.operation === 'EP') {
            this.et = 'P';
          }

          this.numer = Number(this.maxBorEncCs);
          if (Number(this.maxBorEncCp) > this.numer) {
            this.numer = Number(this.maxBorEncCp);
          }
          if (Number(this.maxBorEncCp) > this.numer) {
            this.numer = Number(this.maxBorEncCp);
          }

          if (Number(this.maxBorEncBr) > this.numer) {
            this.numer = Number(this.maxBorEncBr);
          }
        }

        if (this.operation === 'RFB') {
          this.numer = Number(this.maxBorRtrBr);
          if (Number(this.maxBorRtrCp) > this.numer) {
            this.numer = Number(this.maxBorRtrCs);
          }
          if (Number(this.maxBorRtrCp) > this.numer) {
            this.numer = Number(this.maxBorRtrCp);
          }

          if (Number(this.maxBorRtrBr) > this.numer) {
            this.numer = Number(this.maxBorRtrBr);
          }
        }
        this.listePdf = this.selectedGridRecords;
        for (const obj of this.selectedGridRecords) {
          if (
            this.operation === 'VE' ||
            this.operation === 'VF' ||
            this.operation === 'VESC'
          ) {

            if (this.operation === 'VE') {
              this.et = 'V';
            }
            if (this.operation === 'VF') {
              this.et = 'F';
            }
            if (this.operation === 'VESC') {
              this.et = 'S';
            }
            const cs = obj.etat2;
            const vid = obj.id;
            const dt = this.dateOp.toLocaleDateString('en-GB');
            const bv = String(this.numer);

            // executer query7
            await this.caissePService
              .updateTresorerie(this.et, dt, bv, this.codeBanque2 , vid, cs)
              .toPromise()
              .then((data) => {
                console.log('query7 ', data);
              });
          } else {
            if (this.operation === 'RFB') {
              await this.steService
                .getSte()
                .toPromise()
                .then((data) => {
                  this.ste = data['_embedded'].ste;
                  this.societe = this.ste[0];
                  console.log(this.societe);
                });
              const dsoldec = this.convertStringToDate(this.societe.dsoldec);
              const date = new Date();
              if (dsoldec >= date) {
                verif_date_validation_caisse = false;
              }
              if (verif_date_validation_caisse) {
                const cs = obj.etat2;
                const id = obj.id;
                let num = String(this.numer);
                if (this.codePiece === 'TR') {
                  num = '';
                }
                /*************
                                          * executer
                                          * Query_retour_attente
                                                        update caisse set etat = null, dat_ver = null,
                                                        bor_rtr = :num,banq_eqm = null, bor_ver=null
                                                        where id = :vid and :cs = 'S'

                                                        update caissep set etat = null, dat_ver = null,
                                                        bor_rtr = :num,banq_eqm = null, bor_ver=null
                                                        where id = :vid and :cs = 'P'

                                                        update brou set etat = null, dat_ver = null,
                                                        bor_rtr = :num,banq_eqm = null, bor_ver=null
                                                        where id = :vid and :cs = 'T'
                                                        */
                await this.caissePService
                  .updateTresorerieRetourAttente(num, id, cs)
                  .toPromise()
                  .then((data) => {
                    console.log('Query_retour_attente ', data);
                  });
              }
            } else {
              const cs = obj.etat2;
              const vid = obj.id;

              const dt = this.dateOp.toLocaleDateString('en-GB');
              const be = String(this.numer );
              // query8.ExecSQL;
              await this.caissePService
                .updateTresorerie8(this.et, dt, be, vid, cs)
                .toPromise()
                .then((data) => {
                  console.log('query 8 ', data);
                });
            }
          }
          if (this.operation === 'RI') {
                  if (this.codePiece === 'CH') {
                    this.typ_imp = 'IMP/CHK';
                    this.chq_trt = 'Cheque';
                  } else {
                    this.typ_imp = 'IMP/TRT';
                    this.chq_trt = 'IMP/TRT';
                  }
            console.log('typ_imp  ', this.typ_imp);
            console.log('chq_trt  ', this.chq_trt);

            if (obj.etat2 === 'S' || obj.etat2 === 'P') {
              this.pie = this.typ_imp;
              if (obj.operateur !== null && obj.operateur !== undefined) {
                this.cmp = obj.operateur;
              } else {
                this.cmp = null;
              }

              this.mt = Number(obj.montant).toFixed(3);

              this.dte = this.dateOp.toLocaleDateString('en-GB');
              if (obj.cheque !== null && obj.cheque !== undefined) {
                this.nm = obj.cheque;
              } else {
                this.nm = null;
              }

              let observat = '';
              if (this.typ_imp === 'IMP/TRT') {
                observat = 'ECHEANCE ' + obj.ech.toLocaleDateString('en-GB');
              }
              // query6_P.execsql;
              // tslint:disable-next-line:max-line-length


              await this.caissePService
                .insertCaisseP(
                  this.pie,
                  this.cmp,
                  this.mt,
                  this.dte,
                  this.nm,
                  observat
                )
                .toPromise()
                .then((data) => {
                  console.log('Query6_P insert caissep', data);
                });
            } else {

              this.pie = this.typ_imp;
              if (obj.operateur !== null && obj.operateur !== undefined) {
                this.cmp = obj.operateur;
              } else {
                this.cmp = null;
              }
              this.mt = Number(obj.montant).toFixed(3);

              this.dte = this.dateOp.toLocaleDateString('en-GB');
              if (obj.cheque !== null && obj.cheque !== undefined) {
                this.nm = obj.cheque;
              } else {
                this.nm = null;
              }

              let observat = '';
              if (this.typ_imp === 'IMP/TRT') {
                observat = 'ECHEANCE ' + obj.ech.toLocaleDateString('en-GB');
              }
              //   query6_T.execsql; this.idBrou
              // tslint:disable-next-line:max-line-length
              await this.brouService
                .insertBrou(
                  this.pie,
                  this.cmp,
                  this.mt,
                  this.dte,
                  this.nm,
                  observat
                )
                .toPromise()
                .then((data) => {
                  console.log('query6_T insert Brou', data);
                });

 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                                  /*               begin
                                                /*    query11.Open;
                                                    query6_T.parambyname('id').asinteger := query11.fieldbyname('maxid').asinteger+1;
                                                    query11.Close;
                                                    query6_T.ParamByName('pie').asstring := typ_imp;

                                                    query6_T.parambyname('cmp').asstring := query2.FieldByName('client').asstring;
                                                    query6_T.parambyname('mt').asfloat := query2.FieldByName('montant').asfloat;
                                                    query6_T.parambyname('dte').asdatetime := datetimepicker3.DateTime;
                                                    query6_T.parambyname('nm').asstring := query2.FieldByName('numero').asstring;
                                                    if typ_imp = 'IMP/TRT' then query6_T.parambyname('libelle').asstring := 'ECHEANCE '
                                                      +datetimetostr(query2.FieldByName('ech').asdatetime)
                                                    else query6_T.parambyname('libelle').asstring := '';
                                                    query6_T.execsql;
                                          end; */
            }

            /* if (String(obj.operateur ).startsWith('7')) {
                              this.nom_client = obj.operateur;
                            } else {
                              for (const ct of this.clients) {
                                if (obj.operateur === ct.code) {
                                  this.nom_client =  ct.deno;
                                  break;
                                }
                              }
                            }*/
 ////////////////////////////////////////////////////////  sms  RI   //////////////////////////////////////////////////////////////////////////////////////

             let nomClt = '';
             await this.clientService.getClientByCode(this.cmp)
             .toPromise()
             .then(data => {
               console.log(' deno client  ', data);
               nomClt = data['_embedded'].clients[0].deno;
             });

             if (nomClt === null || nomClt === undefined) {
               nomClt = '';
             } else {
              if (this.cmp === '7200' ) {
                nomClt = obj.tire;
             } else {
              if (nomClt !== obj.tire ) {
                nomClt = nomClt + ' , Tiré : ' +  obj.tire;
              }
             }
            }

             const clt = 'Client :  ' + this.cmp + ' ' + nomClt;
                     /*
                     const tire = obj.tire;
                     + ' Tire : '
                       + tire
                       */

                     const message = this.nomSte + ' : Impaye  '
                       + this.chq_trt
                       + ' , '
                       + clt

                       + ' : Montant  ' +
                       this.mt
                       ;
               console.log('message',  message);
               console.log('message length',  message.length);


                 await this.sendMessagesImpaye(message);


                          }

        }
     //   console.log('avant query_maj_caissep *******  ', this.codePiece);
      //  console.log('avant query_maj_caissep *******  ', this.operation);

        if (
          this.codePiece === 'CH' && (this.operation === 'VE' || this.operation === 'VF')
        ) {
          const dt = this.dateOp.toLocaleDateString('en-GB');
          // const mnt = this.totalCheque;
          const chq = 'BR VER ' + this.numer;
          const bnq = this.denoBanque2;
          /* query_maj_caissep_retour
                   insert caissep (code, date, montant, mode, cheque, banque, sens, observat)
                       values ('14', :dt, :mnt, 'CHEQUE', :chq, :bnq, 'S', 'BORDEREAU VERSEMENT')
                    */

    console.log('avantttttttttt query_maj_caissep_VE__VF *******  ', dt, this.Totmontant, chq, bnq);
          await this.caissePService
            .insertCaisseP14(dt, this.Totmontant, chq, bnq)
            .toPromise()
            .then((data) => {
              console.log(' query_maj_caissep_VE__VF *******  ', data);
            });




          }

        if (this.codePiece === 'CH' && this.operation === 'RFB') {
          if (verif_date_validation_caisse) {
            const dt = this.dateOp.toLocaleDateString('en-GB');

            this.chq = 'BR RTR ' + this.numer;
            const bnq = this.denoBanque2;
            const mode = this.codePiece;

            await this.caissePService
              .insertCaisseP14(dt, this.Totmontant, this.chq, bnq)
              .toPromise()
              .then((data) => {
                console.log(' query_maj_caissep_RFB  ', data);
              });


          } else {
            this.msg =
              'CAISSE DEJA VALIDÉ ! Veuillez passer cette operation demain';
            this.op.show(e);
          }
        }

        if (this.codePiece === 'TR' && this.operation === 'RFB') {
          verif_date_validation_caisse = false;
        }

        console.log('appres query_maj_caissep *******  ', this.codePiece);
        console.log('appres query_maj_caissep *******  ', this.operation);


        if (verif_date_validation_caisse) {
          this.CaisseShowPDF = true;
          await this.previsualiserPDF(e);
        } else {
          this.CaisseShowPDF = false;
        }
         this.nouvelleSaisie(e);
        let labelOperation = '';
        switch (this.operation) {
          case 'ED': labelOperation = 'Encaissement definitif' ;
          break;
          case 'VE': labelOperation = 'Versement a l encaissement' ;
          break;
          case 'VF': labelOperation = 'Verse au Factoring' ;
          break;
          case 'VESC': labelOperation = 'Verse a l-Escompte' ;
          break;
          case 'EP': labelOperation = 'Encaissement Provisoire' ;
          break;
          case 'RI': labelOperation = 'Retour Impaye';
          break;
          case 'RFB': labelOperation = 'Retour FACT-Banque' ;
          break;
          default: {labelOperation = 'Versement a l encaissement'; }
              }


       await this.loginService.procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,

           'Br ' + this.codePiece + ' ' + labelOperation + ' ' + this.numer + ' Mt ' + this.Totmontant
        )
        .toPromise().then((data) => {
          console.log('procedureStockeModule ', data);
        });

        this.blockedDocument = false;
    } else {
      // selection lignes
    }
    this.visibleVerifValidation = false;
    this.Totmontant = '0.000';
  }








  ///////////////////////////////////////////////////////////////////////////////////

  async gererPdf(e) {
    // 1=> cheque
    //
   // this.liste = new Array();

  //  this.liste = this.selectedGridRecords;
    let mnt = 0;
    const nb = 0;

    for (const c of this.listePdf) {
        for (const obj of this.banques) {
        if (obj.code === c.banqEqm) {
          c.banqEqm = obj.deno;
          if (this.selectedBanque2 !== null && this.selectedBanque2 !== undefined) {
            this.denoBanque2 = this.selectedBanque2.deno;
            this.compte = this.selectedBanque2.compte;
          } else {
            this.denoBanque2 = obj.deno;
            this.compte = obj.compte;
          }

          break;
        }
      }
      mnt = mnt + Number(c.montant);
    }

    console.log('liste avec modif banque ', this.listePdf);
    if (this.listePdf.length > 0) {

      const doc1 = new jspdf();
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');
      this.societe = '';
      if (
        globals.societe !== null &&
        globals.societe !== undefined
      ) {
        this.societe = globals.societe;
      }

      doc1.text('SOCIETE...: ' + this.societe, 10, 15);
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');
      // doc1.setTextColor(48, 48, 48);

     // let bnq = '';
      if (this.compte === undefined || this.compte === null) {
        this.compte = '';
      }
     /* if (this.listePdf[0].banqEqm !== undefined) {
      //  bnq = this.listePdf[0].banqEqm;
        this.datver = this.listePdf[0].datVer;
      } else {
     //   bnq = '';
        this.compte = '';
        this.datver = '';
      }*/

      doc1.text('Tunis, le  ' + this.dateOp.toLocaleDateString('en-GB'), 160, 20);
      doc1.text('BANQUE........:' + this.denoBanque2, 10, 27);
      doc1.text('N° de compte..: ' + this.compte, 10, 33);

      // doc1.setFontSize(20);
      //  doc1.setFontStyle('bold');
      // doc1.setTextColor(0, 51, 153);
      doc1.setFontStyle('bold');
      let type = '';

      /* if radiobutton1.Checked = true then rep_bor_vers.QRLabel2.Caption := 'Depot de';

  if (radiobutton1.Checked = true) and (combobox1.Text = 'TRAITE')
    then rep_bor_vers.QRLabel2.Caption := 'Depot à L-Encaissement';
  if radiobutton2.Checked = true then rep_bor_vers.QRLabel2.Caption := 'Bordereau Encaissement';
  if radiobutton3.Checked = true then rep_bor_vers.QRLabel2.Caption := 'Bordereau Retour Impayé';
  if radiobutton12.Checked = true then rep_bor_vers.QRLabel2.Caption := 'Bordereau Factoring';

  if radiobutton13.Checked = true then rep_bor_vers.QRLabel2.Caption := 'Depot à L-Escompte';

////////////////////////////////////////////////////////////////////////////////
  if radiobutton17.Checked = true then rep_bor_vers.QRLabel2.Caption := 'Bordereau Retour FACT/BANQ';


*/
      if (this.operation === 'VE') {
        type = 'Depot de ';
      }

      if (this.operation === 'VE' && this.codePiece === 'TR') {
        type = 'Depot à L-Encaissement ';
      }

      if (this.operation === 'ED') {
        type = 'Bordereau Encaissement ';
      }

      if (this.operation === 'RI') {
        type = 'Bordereau Retour Impayé  ';
      }

      if (this.operation === 'VF') {
        type = 'Bordereau Factoring  ';
      }

      if (this.operation === 'VESC') {
        type = 'Depot à L-Escompte  ';
      }

      if (this.operation === 'RFB') {
        type = 'Bordereau Retour Fact/Banque  ';
      }
      doc1.text(type, 50, 40);
      this.codeBord = String(this.numer );
      const L: number = this.codeBord.length;
      let code = '';
      switch (L) {
        case 1:
          code = '000000' + this.codeBord;
          break;

        case 2:
          code = '00000' + this.codeBord;

          break;
        case 3:
          code = '0000' + this.codeBord;

          break;
        case 4:
          code = '000' + this.codeBord;
          break;
        case 5:
          code = '00' + this.codeBord;
          break;
        case 6:
          code = '0' + this.codeBord;
          break;

        default:
          code = this.codeBord;
          break;
      }
      doc1.text('N° ' + code, 160, 40);

      let indice = 'TRAITES';
      if (this.listePdf[0].mode === 'CHEQUE') {
        /* if query1.FieldByName('piece').asstring = 'CHEQUE' then
        begin
          rep_bor_vers.QRDBText4.width := 0;
          rep_bor_vers.QRLabel6.width := 0;
          rep_bor_vers.QRDBText4.AutoSize := false;
          rep_bor_vers.QRLabel6.autosize := false;
          rep_bor_vers.QRLabel8.Caption := 'CHEQUES'
        end;*/
        indice = 'CHEQUES';
      }
      doc1.text(indice, 120, 40);

      // entete du  tableau
      doc1.setFontStyle('Arial');
      doc1.setFontSize(12);
      doc1.line(9, 45, 205, 45);
      doc1.setFontSize(10);

      doc1.text('', 10, 50);
      doc1.text('Banque', 20, 50);
      doc1.text('Tiré', 40, 50);
      doc1.text('N° de Pièce', 100, 50);
      doc1.text('Code client', 130, 50);
      doc1.text('Echeance', 160, 50);
      doc1.text('Montant', 180, 50);
      // creer la ligne
      doc1.setFontStyle('Arial');
      doc1.setFontSize(10);
      doc1.line(9, 53, 205, 53);
      let index = 0;
      let y = 57;
      let numPage = 1;
      this.listePdf = this.listePdf.sort(function(a, b) {
        return a.cheque > b.cheque ? 1 : a.cheque < b.cheque ? -1 : 0;
      });
      for (const obj of this.listePdf) {
        index = index + 1;

        doc1.text(index.toFixed(0), 10, y);

        if (obj.banque !== null && obj.banque !== undefined) {
          doc1.text(obj.banque, 20, y);
        } else {
          doc1.text('', 20, y);
        }

        if (obj.tire !== null && obj.tire !== undefined) {
          doc1.text(obj.tire, 40, y);
        } else {
          doc1.text('', 40, y);
        }

        if (obj.cheque !== null && obj.cheque !== undefined) {
          doc1.text(obj.cheque, 100, y);
        } else {
          doc1.text('', 100, y);
        }

        if (obj.operateur !== null && obj.operateur !== undefined) {
          doc1.text(obj.operateur, 130, y);
        } else {
          doc1.text('', 130, y);
        }

        if (obj.ech !== null && obj.ech !== undefined) {
          doc1.text(obj.ech.toLocaleDateString('en-GB'), 160, y);
        } else {
          doc1.text('', 160, y);
        }
        if (obj.montant !== null && obj.montant !== undefined) {
          doc1.text(Number(obj.montant).toFixed(3), 199, y, 'right');
        } else {
          doc1.text('', 199, y, 'right');
        }
        y = y + 7;

        // doc1.line(9, y - 4 , 205, y - 4 );
        //  doc1.line(9, y - 4 , 205, y - 4 );
        // premiere page
        if (numPage === 1 && y < 277) {
          doc1.line(9, 45, 9, y);
          doc1.line(205, 45, 205, y);
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        }
        if (numPage > 1 && y < 277) {
          doc1.line(9, 12, 9, y + 4);
          doc1.line(205, 12, 205, y + 4);
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        }
        if (numPage > 1 && y > 277) {
          doc1.line(9, 12, 9, y + 4);
          doc1.line(205, 12, 205, y + 4);
          // doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        }

        if (y > 277) {
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

          numPage++;
          doc1.addPage();
          doc1.line(9, 12, 205, 12);
          doc1.setFontSize(10);

          doc1.text('', 10, 17);
          doc1.text('Banque', 20, 17);
          doc1.text('Tiré', 40, 17);
          doc1.text('N° de Pièce', 90, 17);
          doc1.text('Code client', 130, 17);
          doc1.text('Echeance', 160, 17);
          doc1.text('Montant', 180, 17);

          // creer la ligne
          doc1.setFontStyle('Arial');
          doc1.line(9, 20, 205, 20);

          y = 26;
        }
      }

      if (y < 240) {
        doc1.setFontSize(12);
        doc1.line(9, y, 205, y);
        doc1.setFontStyle('bold');
        doc1.setFontSize(10);
        //
        // doc1.text('Nombre des pièces :1 ' + y.toFixed(0), 9, y + 5 );
        doc1.text('Nombre des pièces : ' + index.toFixed(0), 9, y + 5);
        doc1.text('Total : ' + mnt.toFixed(3), 175, y + 5);
        y = y + 15;
        doc1.setFontSize(16);
        doc1.text('Signatures ', 170, y);
      } else {
        if (y > 240) {
          doc1.setFontSize(12);
          doc1.line(9, y, 205, y);
          numPage++;
          doc1.addPage();
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

          y = 14;
          doc1.line(9, y - 2, 205, y - 2, 'FD');
          doc1.setFontStyle('Arial');
          doc1.setFontStyle('bold');
          doc1.setFontSize(10);
          y = y + 5;

          doc1.text('Nombre des pièces : ' + index.toFixed(0), 9, y);

          //  doc1.text('Nombre des pièces : ' + index.toFixed(0), 9, y );
          doc1.text('Toal : ' + mnt.toFixed(3), 175, y);
          y = y + 15;
          doc1.setFontSize(16);
          doc1.text('Signatures ', 170, y);
        }
      }

      //  const numPage = 1;
      doc1.setLineWidth(0.2);
      doc1.setFontSize(10);
      doc1.setFontStyle('Arial');
      doc1.line(10, 280, 205, 280, 'FD');
      doc1.setFontStyle('Arial');
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      window.open(doc1.output('bloburl'), '_blank');
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////

  rowDeSelectedCheckbox(args: RowDeselectEventArgs) {
    const selectedrecords: object[] = this.grid.getSelectedRecords();
    console.log('selectedrecords   ', selectedrecords);
    this.selectedGridRecords = selectedrecords;
    this.nbrLigneSelectionnes = selectedrecords.length;
    if (this.selectedGridRecords.length === 0) {
      this.totSelectionee = 0;

      this.totMontantSelectionne = '0.000';



    } else {

    // this.nbreSelectionnees = this.nbrLigneSelectionnes.toFixed(0) ;
    console.log('deselected item ', args.data[0].montant);
    const montantDeSlectedItem = args.data[0].montant;
    if (montantDeSlectedItem !== null && montantDeSlectedItem  !== undefined) {
      this.totSelectionee  = this.totSelectionee  - Number(montantDeSlectedItem );
      this.totMontantSelectionne = this.totSelectionee .toFixed(3);


    } else {
      this.totSelectionee  = this.totSelectionee  ;
      this.totMontantSelectionne = this.totSelectionee .toFixed(3);

    }
  }

  }


  rowSelectedCheckbox(args: RowSelectEventArgs) {
    // this.doublclick(args);
    // = 0;
   /* if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.checkedItem = selected;
    }*/
    const selectedrecords: object[] = this.grid.getSelectedRecords();
    console.log('selectedrecords   ', selectedrecords);
    this.nbrLigneSelectionnes = selectedrecords.length;
    this.selectedGridRecords = selectedrecords;
    if (this.selectedGridRecords.length > 0 && this.selectedGridRecords.length < this.lignesselectionnesgrid1.length) {
      console.log('selected args data ', args.data);

    this.checkedItem = args.data;
    console.log('checked args data ', this.checkedItem.montant);
    this.totSelectionee = this.totSelectionee + this.checkedItem.montant;
    this.totMontantSelectionne = this.totSelectionee.toFixed(3);

    } else {
      if (this.selectedGridRecords.length === 0) {
      this.totSelectionee = 0;
      this.totMontantSelectionne = '0.000';

    } else {
      this.totSelectionee = 0;
      this.totMontantSelectionne = '0.000';

      if (this.selectedGridRecords.length === this.lignesselectionnesgrid1.length ) {
        console.log('selectedrecords selectedrecords********  ', selectedrecords);
        for (const item of this.lignesselectionnesgrid1 ) {
          this.totSelectionee =  this.totSelectionee + Number(item.montant);
        }
        this.totMontantSelectionne = this.totSelectionee.toFixed(3);

      }
    }}
    // Get the selected records.

   // console.log('selectedrecords selectedrecords  ', selectedrecords);

    if (this.selectedGridRecords.length === 1) {
      const item = this.selectedGridRecords[0];
      this.Codeapurement = item.apurement;
      if (
        item.etat2 === 'T' &&
        this.Codeapurement !== null &&
        this.Codeapurement !== undefined &&
        this.Codeapurement !== ''
      ) {
        this.consultApurShow = true;
      } else {
        this.consultApurShow = false;
      }
    } else {
      this.consultApurShow = false;
    }
    if (this.selectedGridRecords.length > 0) {
      this.validshow = true;
    } else {
      this.validshow = false;
    }
  }

  selectionnerPieces(e) {

    this.wasInside = true;
    if ((this.selectedBanque2 === null || this.selectedBanque2 === undefined)
    // || this.operation === 'RFB'
    && (this.operation === 'VE' || this.operation === 'VF' || this.operation === 'VESC'  )) {
      this.msg = 'veuillez choisir une banque ';
      this.op.show(e);
      this.hiddenGridSelctionne = false;
      this.disabled2 = false;
      this.disabledBanque2  = false;
      this.selectPieceShow = true;
      this.hiddenGrid = true;
    } else {
      this.disabled2 = true;
      this.disabledBanque2  = true;
      this.op.hide();
      this.selectPieceShow = false;
      this.hiddenGrid = false;
      this.hiddenGridSelctionne = true;
    }
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
    this.disabledBanque2  = false;
      this.compte = '';
   this.denoBanque2 = '';
    this.selectedBanque2 = null;
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
        this.affichEnregOp = false;
        this.selectPieceShow = false;
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
            this.montantRech, this.datedebutEchString, this.dateFinEchString
          )
          .toPromise()
          .then((data) => {
            console.log('data  ', data);
            this.lignesselectionnesgrid1 = data['_embedded'].caisses;
          });
        this.disabled = true;
        this.disabledEp = true;
        this.disabledEp = true;
        let totTrait = 0;
        let totCheque = 0;
        let totEspec = 0;
        let totVir = 0;
        for (const obj of this.lignesselectionnesgrid1) {
          obj.montant = Number(obj.montant);
          if (obj.mode === 'TRAITE') {
            totTrait = totTrait + obj.montant;
          }

          if (obj.mode === 'CHEQUE' && (obj.sens === 'E' || obj.sens === 'C')) {
            totCheque = totCheque + obj.montant;
          }
          if (obj.mode === 'ESPECE') {
            totEspec = totEspec + obj.montant;
          }
          if (obj.mode.startsWith('VIR')) {
            totVir = totVir + obj.montant;
          }
          //  datRec , datVer , date, dateApur  ech
       /*   if (obj.datRec !== null && obj.datRec !== '' ) {
            obj.datRec.replace(obj.datRec.substring(0, 3), obj.datRec.substring(3, 2) + '-')  ;
            obj.datRec = new Date(obj.datRec);
          }*/
          if (obj.date !== null && obj.date !== '' ) {
           // obj.date.replace('/', '-')  ;
            const jour = Number(obj.date.substring(0, 2));
            const mois = Number(obj.date.substring(3, 5)) - 1;
            const annee = Number(obj.date.substring(6, 10));
            obj.date = new Date(annee, mois, jour);
          }

          if (obj.ech !== null && obj.ech  !== '' ) {
            // obj.date.replace('/', '-')  ;
             const jour = Number(obj.ech .substring(0, 2));
             const mois = Number(obj.ech .substring(3, 5)) - 1;
             const annee = Number(obj.ech .substring(6, 10));
             obj.ech  = new Date(annee, mois, jour);
           }
        }

        this.totalCheque = totCheque.toFixed(3);
        this.totalEspece = totEspec.toFixed(3);
        this.totalTraite = totTrait.toFixed(3);
        this.totalVir = totVir.toFixed(3);
        this.dateOp = new Date();
        switch (this.codePiece) {
          case '':
            {
              this.affichEnregOp = false;
              this.selectPieceShow = false;
            }
            break;
          case 'CH':
            {
              if (this.codeEtatPiece === 'F' || this.codeEtatPiece === 'S') {
                this.affichEnregOp = true;

                this.hiddenRFB = false;
                this.hiddenEP = false;
                this.hiddenRI = false;
                this.hiddenED = false;
                this.operation = 'ED';
                this.disabledBanque2  = true;
                this.hiddenVE = true;
                this.hiddenVESC = true;
                this.hiddenVF = true;
              }

              if (this.codeEtatPiece === 'A') {
                this.affichEnregOp = true;
                this.hiddenED = true;
                this.hiddenEP = true;
                this.hiddenRFB = true;
                this.hiddenVESC = true;
                this.hiddenRI = true;
                this.operation = 'VE';
                this.hiddenVE = false;
                this.hiddenVF = false;
                this.disabledBanque2  = false;
                console.log('aaaaaaaaaa', this.affichEnregOp);
              }

              if (this.codeEtatPiece === 'V') {
                this.affichEnregOp = true;
                this.hiddenVE = true;
                this.hiddenEP = true;
                this.hiddenRFB = true;
                this.hiddenVESC = true;
                this.hiddenVF = true;
                this.operation = 'ED';
                this.hiddenED = false;
                this.hiddenRI = false;
                this.disabledBanque2  = true;
              }

              if (this.codeEtatPiece === 'P') {
                this.affichEnregOp = false;
                this.selectPieceShow = false;
              }
              if (this.codeEtatPiece === 'E') {
                this.affichEnregOp = false;

                this.selectPieceShow = false;
              }
              if (this.codeEtatPiece === 'I') {
                this.affichEnregOp = false;
                this.selectPieceShow = false;
              }
            }
            break;
          case 'TR':
            {
              if (this.codeEtatPiece === 'F') {
                this.affichEnregOp = false;
                this.selectPieceShow = false;
              }
              if (this.codeEtatPiece === 'S') {
                this.affichEnregOp = true;
                this.hiddenRFB = false;
                this.hiddenEP = false;
                this.hiddenRI = false;
                this.hiddenED = false;
                this.disabledBanque2  = true;
                this.operation = 'ED';
                this.hiddenVE = true;
                this.hiddenVESC = true;
                this.hiddenVF = true;

              }

              if (this.codeEtatPiece === 'A') {
                this.affichEnregOp = true;
                this.hiddenED = true;
                this.hiddenEP = true;
                this.hiddenRFB = true;
                this.hiddenRI = true;
                this.operation = 'VESC';
                this.hiddenVE = false;
                this.hiddenVF = false;
                this.hiddenVESC = false;
                this.disabledBanque2  = false;
              }

              if (this.codeEtatPiece === 'V') {
                this.affichEnregOp = true;
                this.hiddenVE = true;
                this.hiddenEP = true;
                this.hiddenRFB = true;
                this.hiddenVESC = true;
                this.hiddenVF = true;
                this.operation = 'ED';
                this.hiddenED = false;
                this.hiddenRI = false;
                this.disabledBanque2  = true;
              }

              if (this.codeEtatPiece === 'P') {
                this.affichEnregOp = true;
                this.hiddenVE = true;
                this.hiddenEP = true;
                this.hiddenRFB = true;
                this.hiddenVESC = true;
                this.hiddenVF = true;
                this.operation = 'ED';
                this.hiddenED = false;
                this.hiddenRI = false;
                this.disabledBanque2  = true;
              }

              if (this.codeEtatPiece === 'E') {
                this.affichEnregOp = false;
                this.selectPieceShow = false;
              }
              if (this.codeEtatPiece === 'I') {
                this.affichEnregOp = false;
                this.selectPieceShow = false;
              }
            }
            break;
          case 'VIR':
            {
              this.affichEnregOp = false;
              this.selectPieceShow = false;
            }
            break;
          case 'ESP':
            {
              this.affichEnregOp = false;
              this.selectPieceShow = false;
            }
            break;
          default:
            console.log('error');
        }
        if (this.affichEnregOp) {
          this.selectPieceShow = true;
        }
        this.hiddenGridSelctionne = false;
        this.afficherShow = true;

        console.log(this.affichEnregOp);
      }
    } else {
      this.msg = 'aucun element trouvé';
      this.op.show(e);
      this.afficherShow = false;
      this.affichEnregOp = false;
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
      this.excelService.exportAsExcelFile(exportExcel, 'gestion tresorerie  ');
    } else {
      this.msg = 'aucun element trouvé';
      this.op.show(e);
      this.afficherShow = false;
      this.affichEnregOp = false;
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
    this.Appurement.saisieCardShow1 = true;
    this.Appurement.brouCredit = this.brouCredit;
    this.Appurement.brouDebit = this.brouDebit;
    this.display = true;
    this.Appurement.validerShow = false;
    this.Appurement.hiddenNouSais = true;
  }

  exportExcel() {
    if (this.affichEnregOp === true) {
      this.grid.excelExport();
    } else {
      this.gridSelctionnee.excelExport();
    }
  }
  rowSelected(args: RowSelectEventArgs) {
    this.op.hide();
    this.wasInside = true;
    this.validshow = false;
    if (this.selectPieceShow) {
      this.gridSelctionnee.allowSelection = false;
      //  this.msg = 'veuillez choisir une banque ';
      //  this.op.show(args, document.getElementById('selecttBtn'));
    } else {
      this.op.hide();
      if (this.gridSelctionnee.getSelectedRowIndexes()[0] >= 0) {
        const selected: any = this.gridSelctionnee.getSelectedRecords()[0];
        this.SelectedItem = selected;
        this.Codeapurement = this.SelectedItem.apurement;
        // tslint:disable-next-line:max-line-length
        if (
          this.SelectedItem.etat2 === 'T' &&
          this.Codeapurement !== null &&
          this.Codeapurement !== undefined &&
          this.Codeapurement !== ''
        ) {
          this.consultApurShow = true;
        } else {
          this.consultApurShow = false;
        }
        this.Codeapurement = this.SelectedItem.apurement;
      }
    }
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  annulerValidation() {
   this.visibleVerifValidation = false;
  }


  nouvelleSaisie(e) {
    this.op.hide();
    this.validshow = false;
    this.blockedDocument = false;
    this.disabled = false;
    this.disabledEp = false;
    this.disabled2 = false;
    this.affichEnregOp = false;
    this.selectPieceShow = false;
    this.afficherShow = false;
    this.lignesselectionnesgrid1 = new Array();
    this.selectedBanque2 = null;
    this.hiddenGrid = true;
    this.hiddenGridSelctionne = true;
    this.totSelectionee = 0;
  //  this.Totmontant = '0.000';
    this.totMontantSelectionne = '0.000';
    this.affichEnregOp = false;
  //  this.compte = '';
  //  this.denoBanque2 = '';
   // this.selectedBanque2 = null;
   this. maxBorEncCs = null;
   this. maxBorRtrCs = null;
   this. maxBorVerCs = null;
   this. maxBorRtrCp = null;
   this. maxBorVerCp = null;
   this. maxBorEncCp = null;
   this. maxBorEncBr = null;
   this. maxBorRtrBr = null;
   this. maxBorVerBr = null;
  }

  init() {
    this.selectedBanque2 = null;
    this.disabled = false;
    this.disabledEp = false;
    this.affichEnregOp = false;
    this.selectPieceShow = false;
    this.codeClient = '';
    this.codeEtatPiece = '';

    this.selectedEtatPiece = this.etatPieces[0];
    this.selectedPiece = this.pieces[1];
    this.codePiece = this.selectedPiece.id;
    this.selectedBanque = null;
    this.codeBanque = '';
    this.bordVER = null;
    this.bordENC = null;
    this.bordRTR = null;
    this.lignesselectionnesgrid1 = new Array();

    this.datedebutEch = new Date(new Date().getFullYear(), 0, 1);
    this.dateFinEch = new Date();
    this.montantRech = '';
    this.datedebutEchString = '';
    this.dateFinEchString = '';
    this.echTout = '1';
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
      if (this.codePiece === 'VIR' || this.codePiece === 'ESP') {
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

  changeBanque2() {
    if (this.selectedBanque2 !== null && this.selectedBanque2 !== undefined) {
      this.codeBanque2 = this.selectedBanque2.code;
      this.denoBanque2 = this.selectedBanque2.deno;
      this.compte = this.selectedBanque2.compte;
    } else {
      this.codeBanque2 = '';
      this.denoBanque2 = '';
      this.compte = '';
    }
  }

async sendMessagesImpaye(msg) {
  let token = '';
    await this.smsService.getAccessToken().toPromise().then(data => {
      try {
        console.log('access token ', data );
        token = data;
      } catch (error) {
        console.log('Error happened here!');
        console.error(error);
      }
   }).catch(error => {console.log('errreeeeeeur ', error.Text); }
    ) ;

  if (token !== null && token !== undefined && token.length > 0) {
   // const phonesNumber = ['50314635', '58308172', '58460426'];
    const message: any = {
      'mobileNumber' : '',
      'smsText': msg,
      'token': token
    };
    for (const numPhone of this.phonesNumber ) {
      message.mobileNumber = numPhone;
      try {
        let status = 0;
      await this.smsService.sendSms(message)
      .subscribe((data) => {
        try {
          console.log('Message Send result ', data );
          status = Number(data);
          switch (status) {


            case 201: {
              this.ERRORSMS = `Message bien envoyé  🙂 `;
               break;
           }
            case 404: {
               this.ERRORSMS = `404 Not Found Service SMS : veuillez contacter le service informatique ☹️☹️`;
                break;
            }
            case 403: {
              this.ERRORSMS = `403 Access Denied Service SMS : veuillez contacter le service informatique ☹️☹️`;
                break;
            }
            case 500: {
              this.ERRORSMS = `500 Internal Server Error  Service SMS : veuillez contacter le service informatique ☹️☹️`;
                break;
            }
            default: {
              this.ERRORSMS = `Prob INC Service SMS : veuillez contacter le service informatique ☹️☹️`;
                break;
            }
          }
        } catch (error) {
          console.log('Message Send , Error happened here !');
          this.ERRORSMS = `Prob INC Service SMS : veuillez contacter le service informatique`;
          console.error(error);
        }
      });
      this.visibleProbSMS = true;
      console.log(status , 'ssssssssssssssssssss');

    } catch (e) {
      this.ERRORSMS = `Erreur vous ne pouvez pas envoyer un SMS : veuillez contacter le service informatique ☹️ ☹️`;
    }
    }
}
}


  async ngOnInit() {


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

    this.formatOptions = { type: 'date', format: 'dd/MM/yyyy' };
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
    this.codePiece = this.selectedPiece.id;
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



    if (
      globals.societe !== null &&
      globals.societe !== undefined
    ) {
      this.societe = globals.societe;
    }
// build
    if (this.societe === 'CHAMAM DIVISION GROS') {
      this.phonesNumber = this.phonesNumberCdg;
      this.nomSte = 'CDG';
    }
    if (this.societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
      this.phonesNumber = this.phonesNumberIndest;
      this.nomSte = 'EQM';
    }
    if (this.societe === 'SMD (STE MODERNE DISTRIBUTION)') {
      this.phonesNumber = this.phonesNumberSMD;
      this.nomSte = 'SMD';
    }
    if (this.societe === 'EQUIPEMENT MODERNE HARDWARE') {
      this.phonesNumber = this.phonesNumberHard;
      this.nomSte = 'HARDWARE';
    }
    if (this.societe === 'EQUIPEMENT MODERNE AUTOMOTIVE') {
      this.phonesNumber = this.phonesNumberAut;
      this.nomSte = 'AUTOMOTIVE';
    }
console.log('phone numbers ', this.phonesNumber);


}















  rowSelected2(args: RowSelectEventArgs) {
    if (this.gridSelctionnee.getSelectedRowIndexes()[0] >= 0) { } {
      const selected: any = this.gridSelctionnee.getSelectedRecords()[0];
      this.SelectedItem = selected;
    }
  }

  DoubleclickK(e) {
    // this.SelectedItem = null;
    const lenght = this.lignesselectionnesgrid1.push(this.SelectedItem);
    this.lignesselectionnesgrid1 = this.lignesselectionnesgrid1.sort(function (
      a,
      b
    ) {
      return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
    });
    this.lignesselectionnesgrid2.splice(
      this.lignesselectionnesgrid2.indexOf(this.SelectedItem),
      1
    );
    this.grid.refresh();
    this.gridSelctionnee.refresh();
    if (this.lignesselectionnesgrid2.length > 0) {
      this.btnvalider = true;
    } else {
      this.btnvalider = false;
    }
    this.SelectedItem = null;
  }

  Doubleclick(e) {
    // this.btnvalider = true;
    //  this.SelectedItem = null;
    const lenght = this.lignesselectionnesgrid2.push(this.SelectedItem);
    this.lignesselectionnesgrid2 = this.lignesselectionnesgrid2.sort(function (
      a,
      b
    ) {
      return a.mode > b.mode ? 1 : a.mode < b.mode ? -1 : 0;
    });
    this.tabtempRechgrid2.push(this.SelectedItem);
    this.tabtempRechgrid2 = this.tabtempRechgrid2.sort(function (a, b) {
      return a.mode > b.mode ? 1 : a.mode < b.mode ? -1 : 0;
    });
    this.lignesselectionnesgrid1.splice(
      this.lignesselectionnesgrid1.indexOf(this.SelectedItem),
      1
    );
    this.gridSelctionnee.refresh();
    this.grid.refresh();
    this.SelectedItem = null;
  }

  trasfererTout() {
    this.lignesselectionnesgrid2 = this.lignesselectionnesgrid1;
    this.lignesselectionnesgrid1 = new Array();
  }
}
