import {
  Component,
  OnInit,
  ViewChild,
  Input,
  HostListener,
} from '@angular/core';
import { LoginService } from '../../login/login.service';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { Visite } from '../services/visite';
import { VisiteService } from '../services/visite.service';
import { VisiteCommande } from '../services/visiteCommande';
import { VisiteCommandeService } from '../services/visiteCommande.service';
import { VisiteOffre } from '../services/visiteOffre';
import { VisiteOffreService } from '../services/visiteOffre.service';
import { VisiteReleve } from '../services/visiteReleve';
import { VisiteReleveService } from '../services/visiteReleve.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { VisiteVisite } from '../services/visiteVisite';
import { VisiteVisiteService } from '../services/visiteVisite.service';
import { VisiteSujetTraite } from '../services/visiteSujetTraite';
import { VisiteSujetTraiteService } from '../services/visiteSujetTraite.service';
import { EnregistrementVisiteComponent } from '../enregistrement-visite/enregistrement-visite.component';
import { ActionRecouv } from '../services/actionRecouv';
import { ActionRecouvService } from '../services/actionRecouv.service';
import { AffectationRecouvrement } from '../services/affectationRecouvrement';
import { AffectationRecouvrementService } from '../services/affectationRecouvrement.service';
import { VisiteMessage } from '../services/visiteMessage';
import { VisiteMessageService } from '../services/visiteMessage.service';
import { ImpressionFacturesComponent } from '../impressionfactures/impressionfactures.component';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import { Dialog } from 'primeng/dialog';
import { VisiteAntConsultComponent } from '../visite-ant-consult/visite-ant-consult.component';

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
  selector: 'app-programmation-visite',
  templateUrl: './programmation-visite.component.html',
  styleUrls: ['./programmation-visite.component.scss'],
  providers: [MessageService, DatePipe],
})
export class ProgrammationVisiteComponent implements OnInit {
  @ViewChild(VisiteAntConsultComponent) ProgVisite;
  @ViewChild(ImpressionFacturesComponent) ImpFact;
  displayFact = false;
  @Input() displayProgVisite = false;
  @Input() showElementsForConsult = true;
  EnregVisite: EnregistrementVisiteComponent;
  @ViewChild('gridVisitesAnt')
  public gridVisitesAnt: GridComponent;
  @ViewChild('gridCommandes')
  public gridCommandes: GridComponent;
  @ViewChild('gridOffresAnt')
  public gridOffresAnt: GridComponent;
  @ViewChild('gridReleve')
  public gridReleve: GridComponent;
  @ViewChild('gridSujetsTraites')
  public gridSujetsTraites: GridComponent;
  @ViewChild('gridSujets')
  public gridSujets: GridComponent;
  @Input() titre = 'PROGRAMMATION VISITE';
  @Input() numVisite = '';
  @Input() enregVisite = false;
  @Input() consultVisite = false;
  @Input() disableDateReelle = false;
  @Input() gridVisitesButtonEnable = false;
  @Input() gridOffresButtonEnable = false;
  @Input() gridCommandesButtonEnable = false;
  @Input() gridRelevesButtonEnable = false;
  @Input() selectedClient: any;
  @Input() selectedIndexSujetTraite = 0;
  @Input() visitesMessages = [];
  selectedParticipant;
  selectedAutre;
  sujetSelectionne = false;
  @Input() datePrevue: Date = new Date();
  @Input() dateReelle: Date = new Date();
  @Input() hDebut: Date = new Date();
  @Input() hFin: Date = new Date();
  @Input() hReelleDebut: Date = new Date();
  @Input() hReelleFin: Date = new Date();
  @Input() nomUtil;
  @Input() discussion = '';
  tn: any;
  @Input() ofr = 'RAS';
  @Input() fin = 'RAS';
  @Input() cmd = 'RAS';
  @Input() autre = 'RAS';
  // anc = true;
  nouvClicked = false;
  ancClicked = false;
  nouvShow = true;
  ancShow = true;
  @Input() checkedPar1 = false;
  @Input() checkedPar2 = false;
  @Input() checkedPar3 = false;
  @Input() disableCheckedPar1 = true;
  @Input() disableCheckedPar2 = true;
  @Input() disableCheckedPar3 = true;
  clients = [];
  @Input() visites = [];
  @Input() visitesCommandes = [];
  @Input() visitesOffres = [];
  @Input() visitesReleves = [];
  visitesSujetTraite = [];
  visitesSujets = [];
  utils = [];
  autresList = [
    { name: 'RAS', code: 0 },
    { name: 'Formation', code: 1 },
    { name: 'Prospection', code: 2 },
    { name: 'Business Plan', code: 3 },
    { name: 'Identif Besoins', code: 4 },
    { name: 'SAV', code: 5 },
  ];
  showAutreListe = false;
  @Input() participant1 = '';
  @Input() participant2 = '';
  @Input() participant3 = '';
  @Input() selectedDestinataire;
  @Input() destinataire1 = '';
  @Input() destinataire2 = '';
  @Input() destinataire3 = '';
  @Input() codeDest1 = '';
  @Input() codeDest2 = '';
  @Input() codeDest3 = '';
  @Input() delai1 = '';
  @Input() delai2 = '';
  @Input() delai3 = '';
  @Input() delai1Disable = true;
  @Input() delai2Disable = true;
  @Input() delai3Disable = true;
  @Input() showDest1 = true;
  @Input() showDest2 = true;
  @Input() showDest3 = true;
  @Input() reponse = '';
  showReponse = false;
  selectedRubrique;
  @Input() codePart1 = '';
  @Input() codePart2 = '';
  @Input() codePart3 = '';
  @Input() totCmdCommandes = '0.000';
  @Input() totRealCommandes = '0.000';
  @Input() totDebitReleves = '0.000';
  @Input() totCreditReleves = '0.000';
  @Input() soldeReleves = '0.000';
  @Input() totMtDevOffres = '0.000';
  @Input() totmtSatisfOffres = '0.000';
  @Input() moyPrcOffres = '0.000';

  public customAttributes: object;
  showValiderBt = false;
  descriptionDiscussion = 'DISCUSSIONS AVEC LE CLIENT NON ENREGISTRE';
  blockPage = false;
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
  styleOvPanel = {};
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }

  constructor(
    private clientService: ClientService,
    private loginService: LoginService,
    private visiteService: VisiteService,
    private visiteCommandeService: VisiteCommandeService,
    private visiteOffreService: VisiteOffreService,
    private visiteReleveService: VisiteReleveService,
    private visiteVisiteService: VisiteVisiteService,
    private visiteSujetTraiteService: VisiteSujetTraiteService,
    private actionRecouvService: ActionRecouvService,
    private affectationRecouvrementService: AffectationRecouvrementService,
    private visiteMessageService: VisiteMessageService,
    private datePipe: DatePipe,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  async ngOnInit() {
    // const os = require('os');
    // const computerName = os.hostname();
    this.customAttributes = { class: 'customcss' };
    // this.datePrevue.setDate(this.datePrevue.getDate() + 3);
    // this.dateReelle.setDate(this.dateReelle.getDay() + 10);
    this.hDebut.setTime(1568098856289);
    this.hFin.setTime(1568102456289);
    this.hReelleDebut.setTime(1568098856289);
    this.hReelleFin.setTime(1568102456289);
    this.viderSelectedClient();
    this.nomUtil = localStorage.getItem('nomUtil');
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
    await this.clientService
      .getClientsListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      })
      .catch((data) => {
        console.log('error get clients');
      });
    await this.loginService
      .getLoginsListByOrder()
      .toPromise()
      .then((data) => {
        this.utils = data['_embedded'].users;
      })
      .catch((data) => {
        console.log('error get users');
      });
  }
  async ancClient() {
    // this.anc = true;
    this.ancClicked = true;
    this.nouvClicked = false;
    this.nouvShow = false;
    this.ancShow = false;
  }
  nvClient() {
    this.viderSelectedClient();
    this.visitesCommandes = [];
    this.visitesOffres = [];
    this.visites = [];
    this.visitesReleves = [];
    this.ancClicked = false;
    this.nouvClicked = true;
    this.gridVisitesButtonEnable = false;
    this.gridOffresButtonEnable = false;
    this.gridCommandesButtonEnable = false;
    this.gridRelevesButtonEnable = false;
    this.nouvShow = false;
    this.ancShow = false;
  }
  async onClientSelect() {
    this.reintialiser();
    await this.visiteService
      .getVisiteByClt(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.visites = data['_embedded'].visites;
      });
    if (this.visites.length > 0) {
      this.gridVisitesButtonEnable = true;
    }
    await this.visiteOffreService
      .getVisitesOffresByCodeClt(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.visitesOffres = data['_embedded'].visiteOffre;
      });
    if (this.visitesOffres.length > 0) {
      this.gridOffresButtonEnable = true;
    }
    let totMtDev = 0,
      totMtSatisf = 0;
    for (const ofr of this.visitesOffres) {
      totMtDev = totMtDev + Number(ofr.mtDev);
      totMtSatisf = totMtSatisf + Number(ofr.mtSatisf);
    }
    this.totMtDevOffres = totMtDev
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.totmtSatisfOffres = totMtSatisf
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.moyPrcOffres = ((100 * totMtSatisf) / totMtDev)
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');

    await this.visiteCommandeService
      .getVisitesCommandesByCodeClt(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.visitesCommandes = data['_embedded'].visiteCommande;
      });
    if (this.visitesCommandes.length > 0) {
      this.gridCommandesButtonEnable = true;
    }
    let totCmd = 0,
      totCmdReal = 0;
    for (const cmd of this.visitesCommandes) {
      totCmd = totCmd + Number(cmd.mtCmd);
      totCmdReal = totCmdReal + Number(cmd.mtReal);
    }
    this.totCmdCommandes = totCmd
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.totRealCommandes = totCmdReal
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    await this.visiteReleveService
      .getVisitesRelevesByCodeClt(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.visitesReleves = data['_embedded'].visiteReleve;
      });
    if (this.visitesReleves.length > 0) {
      this.gridRelevesButtonEnable = true;
    }
    let totDebit = 0,
      totCredit = 0;
    for (const rel of this.visitesReleves) {
      totDebit = totDebit + Number(rel.debit);
      totCredit = totCredit + Number(rel.credit);
    }
    this.totDebitReleves = totDebit
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.totCreditReleves = totCredit
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.soldeReleves = (totDebit - totCredit)
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
  }
  viderSelectedClient() {
    this.selectedClient = {
      id: null,
      code: null,
      deno: null,
      adresse: null,
      ville: null,
      post: null,
      respon: null,
      tel: null,
      agence: null,
      banque: null,
      telex: null,
      fax: null,
      cadnat: null,
      compte: null,
      edition: null,
      exonor: null,
      duree: null,
      reg: null,
      terme: null,
      marque: null,
      plafond: null,
      zone: null,
      comm: null,
      assujet: null,
      codeTva: null,
      timbre: null,
      ech: null,
      bloc: null,
      datBlc: null,
      typeC: null,
      regle: null,
      lettre: null,
      codeC: null,
      autor: null,
      eMail: null,
      typeComm: null,
      rec: null,
      vend: null,
      represant: null,
      secteur: null,
      objectif: null,
      nature: null,
      datCreat: null,
      mag: null,
      respons2: null,
      adresseusine: null,
      adressesiege: null,
      gsm1: null,
      gsm2: null,
      nouvMag: null,
      ca123: null,
      respons3: null,
      fonction1: null,
      fonction2: null,
      fonction3: null,
      eMail1: null,
      eMail2: null,
      eMail3: null,
      tel2: null,
      tel3: null,
      gsm3: null,
      codGroupe: null,
      modeReg: null,
      plafondEncours: null,
      indic: null,
      bcExige: null,
    };
  }
  async validerProgrammation(e) {
    this.wasInside = true;
    this.ov.hide();
    if (
      this.selectedClient.deno === null ||
      this.selectedClient.adresse === null ||
      this.selectedClient.deno === '' ||
      this.selectedClient.adresse === ''
    ) {
      this.msgs = 'LE CLIENT ET SON ADRESSE SONT OBLIGATOIRE !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('client').focus();
      this.ov.show(e, document.getElementById('client'));
      /*this.nouvClicked = false;
      this.ancClicked = false;
      this.nouvShow = true;
      this.ancShow = true;*/
    } else {
      if (
        this.ofr === 'RAS' &&
        this.cmd === 'RAS' &&
        this.fin === 'RAS' &&
        this.autre === 'RAS'
      ) {
        this.msgs = 'L\'INDICATION DE l\'OBJET DE LA VISITE EST OBLIGATOIRE !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btValider'));
      } else {
        let visitesNonEnreg = [];
        if (this.selectedClient !== null) {
          if (
            this.selectedClient.code !== null &&
            this.selectedClient.code !== ''
          ) {
            await this.visiteService
              .getVisitesNonEnregistres(
                localStorage.getItem('login'),
                this.selectedClient.code
              )
              .toPromise()
              .then((data) => {
                console.log(data);

                visitesNonEnreg = data['_embedded'].visites;
              });
          }
        }
        if (visitesNonEnreg.length < 1) {
          this.blockPage = true;
          const newVisite: Visite = {
            numVisite: null,
            codeClt: this.selectedClient.code,
            denoClt: this.selectedClient.deno,
            adrClt: this.selectedClient.adresse,
            mailClt: this.selectedClient.eMail,
            responClt: this.selectedClient.respon,
            fonctionClt: this.selectedClient.fonction1,
            telClt: this.selectedClient.tel,
            faxClt: this.selectedClient.fax,
            datePrevue:
              this.datePipe.transform(this.datePrevue, 'yyyy-dd-MM') +
              ' ' +
              this.hDebut.toTimeString().substring(0, 5) +
              ':00',
            heureFinPrevue: this.hFin
              .toTimeString()
              .substring(0, 5)
              .replace(':', ''),
            dateReelle: null,
            heureFinReelle: null,
            codeProgrammeePar: localStorage.getItem('login'),
            codePart1: this.codePart1,
            presencePart1: null,
            codePart2: this.codePart2,
            presencePart2: null,
            codePart3: this.codePart3,
            presencePart3: null,
            attOfr: this.ofr,
            attCmd: this.cmd,
            attFin: this.fin,
            attAutre: this.autre,
            validation: null,
          };
          console.log(newVisite);
          await this.visiteService
            .createVisite(newVisite)
            .toPromise()
            .then((data) => {
              console.log('insert visite success');
            })
            .catch((error) => {
              console.log('insert visite error');
            });
          /*
        let numNewVisite;
        await this.visiteService
          .getMaxNumVisite()
          .toPromise()
          .then((data) => {
            console.log(data);
            numNewVisite = data;
          });
        for (const rel of this.visitesReleves) {
          const newVisiteRelve: VisiteReleve = {
            id: null,
            numVisite: numNewVisite,
            date: rel.date,
            piece: rel.piece,
            numero: rel.numero,
            debit: rel.debit,
            credit: rel.credit,
          };
          await this.visiteReleveService
            .createVisiteReleve(newVisiteRelve)
            .toPromise()
            .then((data) => {
              console.log("insert visite releve success");
            })
            .catch((error) => {
              console.log("insert visite releve error");
            });
        }*/
          if (this.selectedClient !== null) {
            if (
              String(this.selectedClient.code) !== '' &&
              String(this.selectedClient.code) !== 'null'
            ) {
              await this.visiteReleveService
                .createVisiteRelevesMultiple(this.selectedClient.code)
                .toPromise()
                .then((data) => {
                  console.log('insert visite releve success');
                })
                .catch((error) => {
                  console.log('insert visite releve error');
                });
            }
          }
          /*
        for (const ofr of this.visitesOffres) {
          const newVisiteOffre: VisiteOffre = {
            id: null,
            numVisite: numNewVisite,
            numDev: ofr.numDev,
            date: ofr.date,
            mtDev: ofr.mtDev,
            mtSatisf: ofr.mtSatisf,
            prc: ofr.prc,
          };
          await this.visiteOffreService
            .createVisiteOffre(newVisiteOffre)
            .toPromise()
            .then((data) => {
              console.log("insert visite offre success");
            })
            .catch((error) => {
              console.log("insert visite offre error");
            });
        }
*/
          if (this.selectedClient !== null) {
            if (
              String(this.selectedClient.code) !== '' &&
              String(this.selectedClient.code) !== 'null'
            ) {
              await this.visiteOffreService
                .createVisiteOffresMultiple(this.selectedClient.code)
                .toPromise()
                .then((data) => {
                  console.log('insert visite ofrres success');
                })
                .catch((error) => {
                  console.log('insert visite offres error');
                });
            }
          }
          /*
        for (const cmd of this.visitesCommandes) {
          const newVisiteCommande: VisiteCommande = {
            id: null,
            numVisite: numNewVisite,
            numCmd: cmd.numCmd,
            date: cmd.date,
            mtCmd: cmd.mtCmd,
            mtReal: cmd.mtReal,
            cmdClt: cmd.cmdClt,
          };
          await this.visiteCommandeService
            .createVisiteCommande(newVisiteCommande)
            .toPromise()
            .then((data) => {
              console.log("insert visite commande success");
            })
            .catch((error) => {
              console.log("insert visite commande error");
            });
        }
*/
          if (this.selectedClient !== null) {
            if (
              String(this.selectedClient.code) !== '' &&
              String(this.selectedClient.code) !== 'null'
            ) {
              await this.visiteCommandeService
                .createVisiteCommandesMultiple(this.selectedClient.code)
                .toPromise()
                .then((data) => {
                  console.log('insert visite commandes success');
                })
                .catch((error) => {
                  console.log('insert visite commandes error');
                });
            }
          }
          /*
        for (const vst of this.visites) {
          const newVisiteVisite: VisiteVisite = {
            id: null,
            numVisite: numNewVisite,
            numero: vst.numVisite,
            datePrevue: vst.datePrevue,
            dateReelle: vst.dateReelle,
          };
          await this.visiteVisiteService
            .createVisiteVisite(newVisiteVisite)
            .toPromise()
            .then((data) => {
              console.log("insert visite visite success");
            })
            .catch((error) => {
              console.log("insert visite visite error");
            });
        }*/
          if (this.selectedClient !== null) {
            if (
              String(this.selectedClient.code) !== '' &&
              String(this.selectedClient.code) !== 'null'
            ) {
              await this.visiteVisiteService
                .createVisiteVisitesMultiple(this.selectedClient.code)
                .toPromise()
                .then((data) => {
                  console.log('insert visite visites success');
                })
                .catch((error) => {
                  console.log('insert visite visites error');
                });
            }
          }
          /*
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Succèss',
          detail: 'VISITE ENREGISTRE SOUS LE N° ' + numNewVisite,
        });
        */
          this.viderSelectedClient();
          this.visites = [];
          this.visitesOffres = [];
          this.visitesCommandes = [];
          this.visitesReleves = [];
          this.reintialiser();
          this.participant1 = '';
          this.participant2 = '';
          this.participant3 = '';
          this.codePart1 = '';
          this.codePart2 = '';
          this.codePart3 = '';
          this.totCmdCommandes = '0.000';
          this.totRealCommandes = '0.000';
          this.totDebitReleves = '0.000';
          this.totCreditReleves = '0.000';
          this.soldeReleves = '0.000';
          this.totMtDevOffres = '0.000';
          this.totmtSatisfOffres = '0.000';
          this.moyPrcOffres = '0.000';
          this.ancClicked = false;
          this.nouvClicked = false;
          this.ancClicked = false;
          this.nouvShow = true;
          this.ancShow = true;

          this.blockPage = false;
        } else {
          this.msgs = 'Vous avez des visites non enregistrées pour ce client !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btValider'));
        }
      }
    }
  }
  onParticipantSelect(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.participant1 === '') {
      this.participant1 = this.selectedParticipant.nPUtil;
      this.codePart1 = this.selectedParticipant.codeUtil;
    } else {
      if (this.participant2 === '') {
        if (this.selectedParticipant.nPUtil === this.participant1) {
          /*
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Erreur',
            detail: 'PARTICIPANT ENREGISTRE 2 FOIS',
          });*/
          this.msgs = 'PARTICIPANT ENREGISTRE 2 FOIS !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('participants').focus();
          this.ov.show(e, document.getElementById('participants'));
        } else {
          this.participant2 = this.selectedParticipant.nPUtil;
          this.codePart2 = this.selectedParticipant.codeUtil;
        }
      } else {
        if (this.participant3 === '') {
          if (
            this.selectedParticipant.nPUtil === this.participant1 ||
            this.selectedParticipant.nPUtil === this.participant2
          ) {
            /*
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Erreur',
              detail: 'PARTICIPANT ENREGISTRE 2 FOIS',
            });*/
            this.msgs = 'PARTICIPANT ENREGISTRE 2 FOIS !';
            this.styleOvPanel = this.styleOvPanelError;
            document.getElementById('participants').focus();
            this.ov.show(e, document.getElementById('participants'));
          } else {
            this.participant3 = this.selectedParticipant.nPUtil;
            this.codePart3 = this.selectedParticipant.codeUtil;
          }
        } else {
          /*
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Erreur',
            detail: 'ON NE PEUT PAS ENREGISTRER PLUS QUE 3 PARTICIPANTS',
          });*/
          this.msgs = 'ON NE PEUT PAS ENREGISTRER PLUS QUE 3 PARTICIPANTS !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('participants').focus();
          this.ov.show(e, document.getElementById('participants'));
        }
      }
    }
  }
  onAutreSelect() {
    this.autre = this.selectedAutre.name;
    this.showValiderBt = true;
  }
  ajouterObjet(grid: number) {
    if (!this.enregVisite) {
      if (grid === 1) {
        const selectedRecord: any = this.gridOffresAnt.getSelectedRecords()[0];
        if (this.titre === 'PROGRAMMATION VISITE') {
          if (this.visitesOffres.length > 0) {
            if (this.ofr === 'RAS') {
              this.ofr = selectedRecord.numDev;
            } else {
              this.ofr = this.ofr + ',' + selectedRecord.numDev;
            }
          }
        }
      }
      if (grid === 2) {
        const selectedRecord: any = this.gridCommandes.getSelectedRecords()[0];
        if (this.titre === 'PROGRAMMATION VISITE') {
          if (this.visitesCommandes.length > 0) {
            if (this.cmd === 'RAS') {
              this.cmd = selectedRecord.numCmd;
            } else {
              this.cmd = this.cmd + ',' + selectedRecord.numCmd;
            }
          }
        }
      }
      if (grid === 3) {
        const selectedRecord: any = this.gridReleve.getSelectedRecords()[0];
        if (this.titre === 'PROGRAMMATION VISITE') {
          if (this.visitesReleves.length > 0) {
            if (this.fin === 'RAS') {
              this.fin = selectedRecord.piece + ' ' + selectedRecord.numero;
            } else {
              this.fin =
                this.fin +
                ',' +
                selectedRecord.piece +
                ' ' +
                selectedRecord.numero;
            }
          }
        }
      }
      this.showValiderBt = true;
    }
  }
  annulerSelectionOffre(): void {
    if (this.gridOffresAnt.getSelectedRowIndexes()[0] >= 0) {
      this.gridOffresAnt.selectRows([]);
    }
  }
  annulerSelectionCommande(): void {
    if (this.gridCommandes.getSelectedRowIndexes()[0] >= 0) {
      this.gridCommandes.selectRows([]);
    }
  }
  annulerSelectionVisite(): void {
    if (this.gridVisitesAnt.getSelectedRowIndexes()[0] >= 0) {
      this.gridVisitesAnt.selectRows([]);
    }
  }
  annulerSelectionReleve(): void {
    if (this.gridReleve.getSelectedRowIndexes()[0] >= 0) {
      this.gridReleve.selectRows([]);
    }
  }
  annulerSelectionSujets(): void {
    if (this.gridSujets.getSelectedRowIndexes()[0] >= 0) {
      this.gridSujets.selectRows([]);
    }
  }
  reintialiser() {
    this.ofr = 'RAS';
    this.cmd = 'RAS';
    this.fin = 'RAS';
    this.autre = 'RAS';
    this.showAutreListe = false;
    this.showValiderBt = false;
  }
  autreDblClick() {
    if (this.ancClicked || this.nouvClicked) {
      this.showAutreListe = true;
    }
  }
  supprimerParticipant(numPart: number) {
    if (!this.enregVisite) {
      if (numPart === 1) {
        this.participant1 = this.participant2;
        this.codePart1 = this.codePart2;
        this.participant2 = this.participant3;
        this.codePart2 = this.codePart3;
        this.participant3 = '';
        this.codePart3 = '';
      }
      if (numPart === 2) {
        this.participant2 = this.participant3;
        this.codePart2 = this.codePart3;
        this.participant3 = '';
        this.codePart3 = '';
      }
      if (numPart === 3) {
        this.participant3 = '';
        this.codePart3 = '';
      }
    }
  }
  async validerDateEtPresence() {
    let persPart1 = '',
      persPart2 = '',
      persPart3 = '';
    if (this.participant1 !== '') {
      if (this.checkedPar1) {
        persPart1 = 'O';
      } else {
        persPart1 = 'N';
      }
    }
    if (this.participant2 !== '') {
      if (this.checkedPar2) {
        persPart2 = 'O';
      } else {
        persPart2 = 'N';
      }
    }
    if (this.participant3 !== '') {
      if (this.checkedPar3) {
        persPart3 = 'O';
      } else {
        persPart3 = 'N';
      }
    }
    let hRdebut = String(this.hReelleDebut);
    if (hRdebut.length > 5) {
      hRdebut = this.hReelleDebut.toTimeString().substring(0, 5);
    }
    let hRfin = String(this.hReelleFin);
    if (hRfin.length > 5) {
      hRfin = this.hReelleFin.toTimeString().substring(0, 5);
    }
    let dateR = '';
    try {
      dateR =
        this.datePipe.transform(this.dateReelle, 'yyyy-dd-MM') +
        ' ' +
        hRdebut +
        ':00';
    } catch (error) {
      dateR =
        String(this.dateReelle).substring(6, 10) +
        '-' +
        String(this.dateReelle).substring(0, 2) +
        '-' +
        String(this.dateReelle).substring(3, 5) +
        ' ' +
        hRdebut +
        ':00';
    }

    /*
    console.log(this.dateReelle.toLocaleDateString('en-GB'));
    console.log(this.datePipe.transform(this.dateReelle, 'yyyy-dd-MM'));
    console.log(String(this.dateReelle).substring(0, 10) + ' ' + hRdebut + ':00');
    console.log(hRfin.replace(':', ''));
    console.log(persPart1);
    console.log(persPart2);
    console.log(persPart3);
    console.log(this.numVisite);*/

    await this.visiteService
      .enregDateReelleEtPresence(
        dateR,
        hRfin.replace(':', ''),
        persPart1,
        persPart2,
        persPart3,
        this.numVisite
      )
      .toPromise()
      .then((data) => {
        console.log('enregDateEtPresence success');
      });
    await this.visiteSujetTraiteService
      .getVisiteSujetTraiteByNumVisite(this.numVisite)
      .toPromise()
      .then((data) => {
        this.visitesSujetTraite = data['_embedded'].visiteSujetTraite;
      });
    await this.visiteService
      .getSujetsVisite()
      .toPromise()
      .then((data) => {
        this.visitesSujets = data['_embedded'].sujetVisites;
      });
    this.disableCheckedPar1 = true;
    this.disableCheckedPar2 = true;
    this.disableCheckedPar3 = true;
    this.disableDateReelle = true;
  }
  ajouterSujet(e) {
    this.wasInside = true;
    this.ov.hide();
    const selectedRow: any = this.gridSujets.getSelectedRecords()[0];
    const tmp = this.visitesSujetTraite.find(
      (sujetTraite) => sujetTraite.rubrique === selectedRow.rubrique
    );
    if (String(tmp) === 'undefined') {
      this.sujetSelectionne = true;
      this.destinataire1 = selectedRow.nPUtil;
      let util = null;
      util = this.utils.find((user) => user.nPUtil === selectedRow.nPUtil);
      console.log(util);
      this.codeDest1 = util.codeUtil;
      this.delai1 = '3';
      this.delai1Disable = false;
      this.selectedRubrique = selectedRow.rubrique;
      setTimeout(
        () => document.getElementById('discussions').focus(),
        1
      );
      document.getElementById('btValiderTravaux').scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'start',
      });
    } else {
      /*
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'SUJET DEJA TRAITE',
      });*/
      this.msgs = 'Cet article est déjà dans la liste';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e);
    }
  }
  onDestinataireSelect(e) {
    if (this.selectedDestinataire.codeUtil !== '') {
      if (this.destinataire1 === '') {
        this.destinataire1 = this.selectedDestinataire.nPUtil;
        this.codeDest1 = this.selectedDestinataire.codeUtil;
        this.delai1 = '3';
        this.delai1Disable = false;
      } else {
        if (this.destinataire2 === '') {
          if (this.selectedDestinataire.nPUtil !== this.destinataire1) {
            this.destinataire2 = this.selectedDestinataire.nPUtil;
            this.codeDest2 = this.selectedDestinataire.codeUtil;
            this.delai2 = '3';
            this.delai2Disable = false;
          } else {
            /*
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Erreur',
              detail: 'DESTINATAIRE ENREGISTRE 2 FOIS',
            });*/
            this.msgs = 'DESTINATAIRE ENREGISTRE 2 FOIS !';
            this.styleOvPanel = this.styleOvPanelError;
            document.getElementById('destinataires').focus();
            this.ov.show(e, document.getElementById('destinataires'));
          }
        } else {
          if (this.destinataire3 === '') {
            if (
              this.selectedDestinataire.nPUtil !== this.destinataire1 &&
              this.selectedDestinataire.nPUtil !== this.destinataire2
            ) {
              this.destinataire3 = this.selectedDestinataire.nPUtil;
              this.codeDest3 = this.selectedDestinataire.codeUtil;
              this.delai3 = '3';
              this.delai3Disable = false;
            } else {
              /*this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Erreur',
                detail: 'DESTINATAIRE ENREGISTRE 2 FOIS',
              });*/
              this.msgs = 'DESTINATAIRE ENREGISTRE 2 FOIS !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById('destinataires').focus();
              this.ov.show(e, document.getElementById('destinataires'));
            }
          } else {
            /*
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Erreur',
              detail: 'ON NE PEUT PAS ENREGISTRER PLUS QUE 3 DESTINATAIRES',
            });*/
            this.msgs = 'ON NE PEUT PAS ENREGISTRER PLUS QUE 3 DESTINATAIRES !';
            this.styleOvPanel = this.styleOvPanelError;
            document.getElementById('destinataires').focus();
            this.ov.show(e, document.getElementById('destinataires'));
          }
        }
      }
    }
    console.log(this.codeDest1);
    console.log(this.codeDest2);
    console.log(this.codeDest3);
  }
  supprimerDestinataire(numDest: number) {
    if (numDest === 1) {
      this.destinataire1 = this.destinataire2;
      this.codeDest1 = this.codeDest2;
      this.delai1 = this.delai2;
      this.delai1Disable = this.delai2Disable;

      this.destinataire2 = this.destinataire3;
      this.codeDest2 = this.codeDest3;
      this.delai2 = this.delai3;
      this.delai2Disable = this.delai3Disable;

      this.destinataire3 = '';
      this.codeDest3 = '';
      this.delai3 = '';
      this.delai3Disable = true;
    }
    if (numDest === 2) {
      this.destinataire2 = this.destinataire3;
      this.codeDest2 = this.codeDest3;
      this.delai2 = this.delai3;
      this.delai2Disable = this.delai3Disable;

      this.destinataire3 = '';
      this.codeDest3 = '';
      this.delai3 = '';
      this.delai3Disable = true;
    }
    if (numDest === 3) {
      this.destinataire3 = '';
      this.codeDest3 = '';
      this.delai3 = '';
      this.delai3Disable = true;
    }
  }
  /*
  supprimerVisite() {
    this.messageService.clear('c');
    this.messageService.clear();
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      summary: 'ATTENTION CETTE VISITE SERA SUPPRIMEE DEFINITIVEMENT !',
      detail: 'Confirmation',
    });
  }
  */
  async supprimerVisite() {
    await this.visiteService
      .supprimerVisite(this.numVisite)
      .toPromise()
      .then((data) => {
        /*this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Succès',
          detail: 'VISITE SUPPRIMEE AVEC SUCCES',
        });*/
      });

    this.displayProgVisite = false;
  }
  /*
  onReject() {
    this.messageService.clear();
  }

  clear() {
    this.messageService.clear();
  }
  */
  initialiser() {
    this.sujetSelectionne = false;
    this.participant1 = '';
    this.codePart1 = '';
    this.participant2 = '';
    this.codePart2 = '';
    this.participant3 = '';
    this.codePart3 = '';
    this.checkedPar1 = false;
    this.checkedPar2 = false;
    this.checkedPar3 = false;
    this.showElementsForConsult = true;
    this.codeDest1 = '';
    this.codeDest2 = '';
    this.codeDest3 = '';
    this.delai1 = '';
    this.delai2 = '';
    this.delai3 = '';
    // this.showDest1 = false;
    // this.showDest2 = false;
    // this.showDest3 = false;
    this.destinataire1 = '';
    this.destinataire1 = '';
    this.destinataire1 = '';
    this.showReponse = false;
    this.visitesSujetTraite = [];
    this.visitesMessages = [];
    this.discussion = '';
    this.reponse = '';
    this.viderSelectedClient();
  }
  async validerTravauxEtTransferts(e) {
    console.log(this.codeDest1);
    console.log(this.codeDest2);
    console.log(this.codeDest3);

    if (this.discussion === '') {
      /*
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'DISCUSSION AVEC LE CLIENT VIDE',
      });*/
      this.msgs = 'DISCUSSION AVEC LE CLIENT VIDE !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('discussions').focus();
      this.ov.show(e, document.getElementById('discussions'));
    } else {
      if (
        String(Number(this.delai1)) === 'NaN' ||
        (this.delai2 !== '' && String(Number(this.delai2)) === 'NaN') ||
        (this.delai3 !== '' && String(Number(this.delai3)) === 'NaN')
      ) {
        /*
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Erreur',
          detail: 'LE DELAI NE PEUT CONTENIR QUE DES CHIFFRES',
        });*/
        this.msgs = 'LE DELAI NE PEUT CONTENIR QUE DES CHIFFRES !';
        this.styleOvPanel = this.styleOvPanelError;
        // document.getElementById('btValiderTravaux').focus();
        this.ov.show(e, document.getElementById('btValiderTravaux'));
      } else {
        if (
          Number(this.delai1) === 0 ||
          (this.delai2 !== '' && Number(this.delai2) === 0) ||
          (this.delai3 !== '' && Number(this.delai3) === 0)
        ) {
          /*this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Erreur',
            detail: 'LE DELAI DOIT ETRE SUPERIEUR A 0',
          });*/
          this.msgs = 'LE DELAI DOIT ETRE SUPERIEUR A 0 !';
          this.styleOvPanel = this.styleOvPanelError;
          // document.getElementById('btValiderTravaux').focus();
          this.ov.show(e, document.getElementById('btValiderTravaux'));
        } else {
          if (this.selectedClient.code !== '') {
            let affectRecouv: AffectationRecouvrement[] = [];
            await this.affectationRecouvrementService
              .getFirstAffectationRecouvrementByCodeCltAndCodeSituation(
                this.selectedClient.code,
                'O'
              )
              .toPromise()
              .then((data) => {
                affectRecouv = data['_embedded'].affectationRecouvrement;
              });
            let numMission = null;
            if (affectRecouv.length > 0) {
              numMission = affectRecouv[0].numMission;
            }
            const actRecouv: ActionRecouv = {
              numAction: null,
              codeClt: this.selectedClient.code,
              effectueePar: localStorage.getItem('login'),
              date: new Date().toLocaleDateString('en-GB'),
              action: this.discussion,
              numVisite: this.numVisite,
              numMission: numMission,
            };
            console.log(actRecouv);

            await this.actionRecouvService
              .createActionRecouv(actRecouv)
              .toPromise()
              .then((data) => {
                console.log('insert actionRecouv success');
              });
          }
          const vstSujTraite: VisiteSujetTraite = {
            id: null,
            numVisite: this.numVisite,
            rubrique: this.selectedRubrique,
            date: new Date().toLocaleDateString('en-GB'),
            texte: this.discussion,
          };
          console.log(vstSujTraite);
          await this.visiteSujetTraiteService
            .createVisiteSujetTraite(vstSujTraite)
            .toPromise()
            .then((data) => {
              console.log('insert visiteSujetTraite success');
            });
          await this.visiteSujetTraiteService
            .getVisiteSujetTraiteByNumVisite(this.numVisite)
            .toPromise()
            .then((data) => {
              this.visitesSujetTraite = data['_embedded'].visiteSujetTraite;
            });
          let vstMessage: VisiteMessage = null;
          vstMessage = {
            id: null,
            numVisite: this.numVisite,
            rubrique: this.selectedRubrique,
            envoyePar: localStorage.getItem('login'),
            date: new Date().toLocaleDateString('en-GB'),
            messageLu: null,
            envoyeA: this.codeDest1,
            delai: this.delai1,
            reponse: null,
            dateRep: null,
            reponseLu: null,
          };
          console.log(vstMessage);
          await this.visiteMessageService
            .createVisiteMessage(vstMessage)
            .toPromise()
            .then((data) => {
              console.log('insrt visiteMessage 1 success');
            });
          if (this.destinataire2 !== '') {
            vstMessage.envoyeA = this.codeDest2;
            vstMessage.delai = this.delai2;
            await this.visiteMessageService
              .createVisiteMessage(vstMessage)
              .toPromise()
              .then((data) => {
                console.log('insrt visiteMessage 2 success');
              });
            console.log(vstMessage);
          }
          if (this.destinataire3 !== '') {
            vstMessage.envoyeA = this.codeDest3;
            vstMessage.delai = this.delai3;
            await this.visiteMessageService
              .createVisiteMessage(vstMessage)
              .toPromise()
              .then((data) => {
                console.log('insrt visiteMessage 3 success');
              });
            console.log(vstMessage);
          }
          this.sujetSelectionne = false;
          this.discussion = '';
        }
      }
    }
  }
  voirFacture(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.gridReleve.getSelectedRecords().length > 0) {
      const selectedRow: any = this.gridReleve.getSelectedRecords()[0];
      if (
        String(selectedRow.date).substring(6, 10) ===
        String(new Date().getFullYear())
      ) {
        if (selectedRow.piece === 'FACTURE' || selectedRow.piece === 'AVOIR') {
          this.ImpFact.numero1 = selectedRow.numero;
          this.ImpFact.numero2 = selectedRow.numero;
          this.ImpFact.numChecked = true;
          this.ImpFact.numDisable = true;
          this.ImpFact.afficher();
          this.ImpFact.imprimer('preview');
          //  this.displayFact = true;
        }
      } else {
        /*this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Erreur',
          detail: 'ON NE PEUT PAS VOIR CETTE PIECE',
        });*/
        this.msgs = 'ON NE PEUT PAS VOIR CETTE PIECE !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btVoirFacture'));
      }
    } else {
      this.msgs = 'VEUILLEZ SELECTIONNER UNE LIGNE !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btVoirFacture'));
    }
  }
  lireReponse(numRep: number, e) {
    let vstMsg = null;
    if (numRep === 1) {
      vstMsg = this.visitesMessages.find(
        (msg) => msg.envoyeA === this.codeDest1
      );
      if (vstMsg.reponse !== null) {
        this.reponse = vstMsg.reponse;
      } else {
        this.reponse = '';
      }
    }
    if (numRep === 2) {
      vstMsg = this.visitesMessages.find(
        (msg) => msg.envoyeA === this.codeDest2
      );
      if (vstMsg.reponse !== null) {
        this.reponse = vstMsg.reponse;
      } else {
        this.reponse = '';
      }
    }
    if (numRep === 3) {
      vstMsg = this.visitesMessages.find(
        (msg) => msg.envoyeA === this.codeDest3
      );
      if (vstMsg.reponse !== null) {
        this.reponse = vstMsg.reponse;
      } else {
        this.reponse = '';
      }
    }
    if (this.reponse !== '') {
      this.showReponse = true;
    } else {
      /*
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'REPONSE NON ENCORE PARVENUE',
      });*/
      this.msgs = 'REPONSE NON ENCORE PARVENUE !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btLireReponse'));
    }
  }
  async consulterSujet() {
    console.log('okkkk');
    console.log('okkkk');
    if (this.consultVisite) {
      console.log('okkkk222');
      this.showReponse = false;
      // this.gridSujetsTraites.refresh();
      if (this.visitesSujetTraite.length > 0) {
        console.log('okkkk3333');
        // this.selectedIndexSujetTraite = 0;
        const selectedRow: any = this.gridSujetsTraites.getSelectedRecords()[0];
        this.discussion = selectedRow.texte;
        await this.visiteMessageService
          .getVisiteMessageByNumVisiteAndRubrique(
            selectedRow.numVisite,
            selectedRow.rubrique
          )
          .toPromise()
          .then((data) => {
            this.visitesMessages = data['_embedded'].visiteMessage;
          });
        if (this.visitesMessages.length > 0) {
          console.log('okkkk4444');
          console.log(this.visitesMessages);
          this.codeDest1 = this.visitesMessages[0].envoyeA;
          this.delai1 = this.visitesMessages[0].delai;
          let utl = this.utils.find((user) => user.codeUtil === this.codeDest1);
          if (String(utl) !== 'undefined') {
            this.destinataire1 = utl.nPUtil;
          } else {
            this.destinataire1 = this.codeDest1;
          }
          if (this.visitesMessages.length > 1) {
            this.codeDest2 = this.visitesMessages[1].envoyeA;
            this.delai2 = this.visitesMessages[1].delai;
            utl = this.utils.find((user) => user.codeUtil === this.codeDest2);
            if (String(utl) !== 'undefined') {
              this.destinataire2 = utl.nPUtil;
            } else {
              this.destinataire2 = this.codeDest2;
            }
            // this.destinataire2 = utl.nPUtil;
            this.showDest2 = true;
          } else {
            this.showDest2 = false;
          }
          if (this.visitesMessages.length > 2) {
            this.codeDest3 = this.visitesMessages[2].envoyeA;
            this.delai3 = this.visitesMessages[2].delai;
            utl = this.utils.find((user) => user.codeUtil === this.codeDest3);
            if (String(utl) !== 'undefined') {
              this.destinataire3 = utl.nPUtil;
            } else {
              this.destinataire3 = this.codeDest3;
            }
            // this.destinataire3 = utl.nPUtil;
            this.showDest3 = true;
          } else {
            this.showDest3 = false;
          }
        }
      }
    }
  }
  async applyFilterClientParDeno(filtredValue: string) {
    await this.clientService
      .getClientsTop100ByDenoStartsWith(filtredValue)
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }
  nvlSaisie() {
    this.viderSelectedClient();
    this.visites = [];
    this.visitesOffres = [];
    this.visitesCommandes = [];
    this.visitesReleves = [];
    this.reintialiser();
    this.participant1 = '';
    this.participant2 = '';
    this.participant3 = '';
    this.codePart1 = '';
    this.codePart2 = '';
    this.codePart3 = '';
    this.totCmdCommandes = '0.000';
    this.totRealCommandes = '0.000';
    this.totDebitReleves = '0.000';
    this.totCreditReleves = '0.000';
    this.soldeReleves = '0.000';
    this.totMtDevOffres = '0.000';
    this.totmtSatisfOffres = '0.000';
    this.moyPrcOffres = '0.000';
    this.gridVisitesButtonEnable = false;
    this.gridOffresButtonEnable = false;
    this.gridCommandesButtonEnable = false;
    this.gridRelevesButtonEnable = false;
    this.ancShow = true;
    this.nouvShow = true;
    this.ancClicked = false;
    this.nouvClicked = false;
  }
  async voirVisiteSelect() {
    const selected: any = this.gridVisitesAnt.getSelectedRecords()[0];
    let selectedRow: any = {};
    await this.visiteService
      .getVisiteByNumVisite(selected.numVisite)
      .toPromise()
      .then((data) => {
        console.log(data);
        selectedRow = data['_embedded'].visites[0];
      });
    console.log(selectedRow);
    this.ProgVisite.titre = 'CONSULTATION VISITE';
    this.ProgVisite.numVisite = selectedRow.numVisite;
    this.ProgVisite.consultVisite = true;

    this.ProgVisite.selectedClient.code = selectedRow.codeClt;
    this.ProgVisite.selectedClient.adresse = selectedRow.adrClt;
    this.ProgVisite.selectedClient.eMail = selectedRow.mailClt;
    this.ProgVisite.selectedClient.respon = selectedRow.responClt;
    this.ProgVisite.selectedClient.fonction1 = selectedRow.fonctionClt;
    this.ProgVisite.selectedClient.fax = selectedRow.faxClt;
    this.ProgVisite.selectedClient.tel = selectedRow.telClt;
    this.ProgVisite.selectedClient.deno = selectedRow.denoClt;
    // }
    this.ProgVisite.ofr = selectedRow.attOfr;
    this.ProgVisite.cmd = selectedRow.attCmd;
    this.ProgVisite.fin = selectedRow.attFin;
    this.ProgVisite.autre = selectedRow.attAutre;
    this.ProgVisite.datePrevue = selectedRow.datePrevue;
    this.ProgVisite.hDebut = String(selectedRow.datePrevue).substring(11, 16);
    this.ProgVisite.hFin =
      String(selectedRow.heureFinPrevue).substr(0, 2) +
      ':' +
      String(selectedRow.heureFinPrevue).substr(2, 2);
    const util = this.utils.find(
      (user) => user.codeUtil === selectedRow.codeProgrammeePar
    );
    if (String(util) !== 'undefined') {
      this.ProgVisite.nomUtil = util.nPUtil;
    } else {
      this.ProgVisite.nomUtil = selectedRow.codeProgrammeePar;
    }
    if (selectedRow.dateReelle === null || selectedRow.dateReelle === '') {
      this.ProgVisite.showElementsForConsult = false;
    } else {
      this.ProgVisite.showElementsForConsult = true;
      this.ProgVisite.dateReelle = selectedRow.dateReelle;
      this.ProgVisite.hReelleDebut = String(selectedRow.dateReelle).substring(
        11,
        16
      );
      this.ProgVisite.hReelleFin =
        String(selectedRow.heureFinReelle).substr(0, 2) +
        ':' +
        String(selectedRow.heureFinReelle).substr(2, 2);

      await this.ProgVisite.visiteSujetTraiteService
        .getVisiteSujetTraiteByNumVisite(selectedRow.numVisite)
        .toPromise()
        .then((data) => {
          this.ProgVisite.visitesSujetTraite =
            data['_embedded'].visiteSujetTraite;
        });
      if (this.ProgVisite.visitesSujetTraite.length > 0) {
        this.ProgVisite.selectedIndexSujetTraite = 0;
        this.ProgVisite.descriptionDiscussion = 'DISCUSSIONS AVEC LE CLIENT';
        this.ProgVisite.discussExist = true;
      } else {
        this.ProgVisite.descriptionDiscussion =
          'DISCUSSIONS AVEC LE CLIENT NON ENREGISTRE';
        this.ProgVisite.discussExist = false;
      }
      this.ProgVisite.disableDateReelle = true;
    }
    if (selectedRow.codePart1 !== '') {
      const util = this.utils.find(
        (user) => user.codeUtil === selectedRow.codePart1
      );
      this.ProgVisite.participant1 = util.nPUtil;
      this.ProgVisite.codePart1 = selectedRow.codePart1;
      if (selectedRow.presencePart1 === 'O') {
        this.ProgVisite.checkedPar1 = true;
      }
      if (selectedRow.presencePart1 === 'N') {
        this.ProgVisite.checkedPar1 = false;
      }
      if (selectedRow.presencePart1 === null) {
        this.ProgVisite.disableCheckedPar1 = false;
      }
    }

    if (selectedRow.codePart2 !== '') {
      const util = this.utils.find(
        (user) => user.codeUtil === selectedRow.codePart2
      );
      this.ProgVisite.participant2 = util.nPUtil;
      this.ProgVisite.codePart2 = selectedRow.codePart2;
      if (selectedRow.presencePart2 === 'O') {
        this.ProgVisite.checkedPar2 = true;
      }
      if (selectedRow.presencePart2 === 'N') {
        this.ProgVisite.checkedPar2 = false;
      }
      if (selectedRow.presencePart2 === null) {
        this.ProgVisite.disableCheckedPar2 = false;
      }
    }

    if (selectedRow.codePart3 !== '') {
      const util = this.utils.find(
        (user) => user.codeUtil === selectedRow.codePart3
      );
      this.ProgVisite.participant3 = util.nPUtil;
      this.ProgVisite.codePart3 = selectedRow.codePart3;
      if (selectedRow.presencePart3 === 'O') {
        this.ProgVisite.checkedPar3 = true;
      }
      if (selectedRow.presencePart3 === 'N') {
        this.ProgVisite.checkedPar3 = false;
      }
      if (selectedRow.presencePart3 === null) {
        this.ProgVisite.disableCheckedPar3 = false;
      }
    }
    this.ProgVisite.visites = [];
    await this.visiteVisiteService
      .getVisiteVisiteByNumVisite(selectedRow.numVisite)
      .toPromise()
      .then((data) => {
        this.ProgVisite.visites = data['_embedded'].visiteVisite;
      });
    if (this.ProgVisite.visites.length > 0) {
      this.ProgVisite.gridVisitesButtonEnable = true;
      for (const vst of this.ProgVisite.visites) {
        const tmp = vst.numVisite;
        vst.numVisite = vst.numero;
        vst.numero = tmp;
      }
    }
    this.ProgVisite.visitesOffres = [];
    await this.visiteOffreService
      .getVisiteOffreByNumVisite(selectedRow.numVisite)
      .toPromise()
      .then((data) => {
        this.ProgVisite.visitesOffres = data['_embedded'].visiteOffre;
      });
    if (this.ProgVisite.visitesOffres.length > 0) {
      this.ProgVisite.gridOffresButtonEnable = true;
    }
    let totMtDev = 0,
      totMtSatisf = 0;
    for (const ofr of this.ProgVisite.visitesOffres) {
      totMtDev = totMtDev + Number(ofr.mtDev);
      totMtSatisf = totMtSatisf + Number(ofr.mtSatisf);
    }
    this.ProgVisite.totMtDevOffres = totMtDev
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.ProgVisite.totmtSatisfOffres = totMtSatisf
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.ProgVisite.moyPrcOffres = ((100 * totMtSatisf) / totMtDev)
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.ProgVisite.visitesCommandes = [];
    await this.visiteCommandeService
      .getVisiteCommandeByNumVisite(selectedRow.numVisite)
      .toPromise()
      .then((data) => {
        this.ProgVisite.visitesCommandes = data['_embedded'].visiteCommande;
      });
    if (this.ProgVisite.visitesCommandes.length > 0) {
      this.ProgVisite.gridCommandesButtonEnable = true;
    }
    let totCmd = 0,
      totCmdReal = 0;
    for (const cmd of this.ProgVisite.visitesCommandes) {
      totCmd = totCmd + Number(cmd.mtCmd);
      totCmdReal = totCmdReal + Number(cmd.mtReal);
    }
    this.ProgVisite.totCmdCommandes = totCmd
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.ProgVisite.totRealCommandes = totCmdReal
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.ProgVisite.visitesReleves = [];
    await this.visiteReleveService
      .getVisiteReleveByNumVisite(selectedRow.numVisite)
      .toPromise()
      .then((data) => {
        this.ProgVisite.visitesReleves = data['_embedded'].visiteReleve;
      });
    if (this.ProgVisite.visitesReleves.length > 0) {
      this.ProgVisite.gridRelevesButtonEnable = true;
    }
    let totDebit = 0,
      totCredit = 0;
    for (const rel of this.ProgVisite.visitesReleves) {
      totDebit = totDebit + Number(rel.debit);
      totCredit = totCredit + Number(rel.credit);
    }
    this.ProgVisite.totDebitReleves = totDebit
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.ProgVisite.totCreditReleves = totCredit
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.ProgVisite.soldeReleves = (totDebit - totCredit)
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');

    this.ProgVisite.displayProgVisite = true;
  }
  showDialogMaximized(dialog: Dialog) {
    dialog.maximize();
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
}
