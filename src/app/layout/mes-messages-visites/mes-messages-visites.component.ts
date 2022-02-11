import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClientService } from '../services/client.service';
import { SujetService } from '../services/sujet.service';
import { VisiteSujetTraiteService } from '../services/visiteSujetTraite.service';
import { VisiteMessageService } from '../services/visiteMessage.service';
import { VisiteVisiteService } from '../services/visiteVisite.service';
import { VisiteOffreService } from '../services/visiteOffre.service';
import { VisiteCommandeService } from '../services/visiteCommande.service';
import { VisiteReleveService } from '../services/visiteReleve.service';
import { LoginService } from '../../login/login.service';
import { ProgrammationVisiteComponent } from '../programmation-visite/programmation-visite.component';
import { Dialog } from 'primeng/dialog';
import { VisiteService } from '../services/visite.service';
import { VisiteMessage } from '../services/visiteMessage';
import { OverlayPanel } from 'primeng/overlaypanel';
import { NgSelectConfig } from '@ng-select/ng-select';
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
  selector: 'app-mes-messages-visites',
  templateUrl: './mes-messages-visites.component.html',
  styleUrls: ['./mes-messages-visites.component.scss'],
  providers: [DatePipe]
})
export class MesMessagesVisitesComponent implements OnInit {
  @ViewChild(ProgrammationVisiteComponent) ProgVisite;
  title = 'Mes Messages Envoyés';
  showEnvA = true;
  showEnvPar = false;
  tn: any;
  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  selectedLectureMessage = '';
  selectedLectureReponse = '';
  selectedArriveeReponse = '-1';
  selectedDepassementDelais = '-2';
  clients = [];
  selectedClient: any = null;
  numVisite = '';
  users = [];
  selectedEnvA: any = null;
  selectedEnvPar: any = null;
  sujets = [];
  selectedSujet: any = null;
  @ViewChild('grid')
  public grid: GridComponent;
  showNext = false;
  messages = [];
  message = '';
  reponse = '';
  etatReponse = 'Reponse';
  hideMessage = true;
  hideReponse = true;
  hideValiderRepButton = true;
  disableEditRep = true;
  hideOkButton = true;
  showRepondreButton = false;
  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  styleOvPanelError = {
    'text-align': 'center',
    'font-size': '14px',
    'background-color': ' #f8b7bd'
  };
  styleOvPanelSuccess = {
    'text-align': 'center',
    'font-size': '12px',
    'background-color': ' #b7d8b7'
  };
  styleOvPanel = {};
  hideBtns = true;
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(
    private clientService: ClientService,
    private sujetService: SujetService,
    private visiteMessageService: VisiteMessageService,
    private visiteVisiteService: VisiteVisiteService,
    private visiteOffreService: VisiteOffreService,
    private visiteCommandeService: VisiteCommandeService,
    private visiteReleveService: VisiteReleveService,
    private visiteSujetTraiteService: VisiteSujetTraiteService,
    private visiteService: VisiteService,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  async ngOnInit() {
    if (localStorage.getItem('typeMessages') === 'envoyes') {
      this.title = 'Mes Messages Envoyés';
      this.showEnvA = true;
      this.showEnvPar = false;
    }
    if (localStorage.getItem('typeMessages') === 'recus') {
      this.title = 'Mes Messages Réçus';
      this.showEnvA = false;
      this.showEnvPar = true;
    }
    if (localStorage.getItem('typeMessages') === 'tout') {
      this.title = 'Les Messages Envoyés';
      this.showEnvA = true;
      this.showEnvPar = true;
    }
    this.dateDebut.setDate(this.dateFin.getDate() - 30);
    this.tn = {
      firstDayOfWeek: 0,
      dayNames: [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche'
      ],
      dayNamesShort: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      dayNamesMin: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
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
    await this.loginService
      .getLoginsListByOrder()
      .toPromise()
      .then(data => {
        this.users = data['_embedded'].users;
      });

    await this.sujetService
      .getSujetsListByOrderByRubrique()
      .toPromise()
      .then(data => {
        this.sujets = data['_embedded'].sujets;
      });
  }
  async recherche(filterValue: string) {
    await this.clientService
      .searchClientByDenoStartsWith(filterValue)
      .toPromise()
      .then(data => {
        const clientsTmp = data['_embedded'].clients;
        this.clients = clientsTmp;
      })
      .catch(data => {
        console.log('error reload data clients');
      })
      .finally(() => {
        // this.grid.refresh();
      });
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.hideBtns = true;
      this.hideMessage = true;
      this.hideReponse = true;
      this.hideOkButton = true;
      this.hideValiderRepButton = true;
    }
  }
  async afficher(e) {
    if (this.title === 'Mes Messages Envoyés') {
      let envoyA = '';
      if (String(this.selectedEnvA) === 'null') {
        envoyA = '';
      } else {
        envoyA = this.selectedEnvA.codeUtil;
      }
      let codeClt = '';
      if (String(this.selectedClient) === 'null') {
        codeClt = '';
      } else {
        codeClt = this.selectedClient.code;
      }
      let sujet = '';
      if (String(this.selectedSujet) === 'null') {
        sujet = '';
      } else {
        sujet = this.selectedSujet.rubrique;
      }
      await this.visiteMessageService
        .getMesMessagesEnvoyes(
          localStorage.getItem('login'),
          this.datePipe.transform(this.dateDebut, 'yyyy-dd-MM' + ' 00:00:00'),
          this.datePipe.transform(this.dateFin, 'yyyy-dd-MM' + ' 23:59:59'),
          envoyA,
          this.numVisite,
          sujet,
          codeClt,
          this.selectedLectureMessage,
          this.selectedLectureReponse,
          this.selectedArriveeReponse,
          this.selectedDepassementDelais
        )
        .toPromise()
        .then(data => {
          this.messages = data['_embedded'].visiteMessage;
        });
      if (this.messages.length > 0) {
        this.showNext = true;
      } else {
        /*this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Erreur',
          detail: 'Aucun Message Pour Ces Critères !'
        });*/
        this.msgs = 'Aucun Message Pour Ces Critères !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('aff'));
      }
    }
    if (this.title === 'Mes Messages Réçus') {
      let envoyPar = '';
      if (String(this.selectedEnvPar) === 'null') {
        envoyPar = '';
      } else {
        envoyPar = this.selectedEnvPar.codeUtil;
      }
      let codeClt = '';
      if (String(this.selectedClient) === 'null') {
        codeClt = '';
      } else {
        codeClt = this.selectedClient.code;
      }
      let sujet = '';
      if (String(this.selectedSujet) === 'null') {
        sujet = '';
      } else {
        sujet = this.selectedSujet.rubrique;
      }
      await this.visiteMessageService
        .getMesMessagesEnvoyes(
          envoyPar,
          this.datePipe.transform(this.dateDebut, 'yyyy-dd-MM' + ' 00:00:00'),
          this.datePipe.transform(this.dateFin, 'yyyy-dd-MM' + ' 23:59:59'),
          localStorage.getItem('login'),
          this.numVisite,
          sujet,
          codeClt,
          this.selectedLectureMessage,
          this.selectedLectureReponse,
          this.selectedArriveeReponse,
          this.selectedDepassementDelais
        )
        .toPromise()
        .then(data => {
          this.messages = data['_embedded'].visiteMessage;
        });

      if (this.messages.length > 0) {
        this.showNext = true;
        this.showRepondreButton = true;
      } else {
        /*
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Erreur',
          detail: 'Aucun Message Pour Ces Critères !'
        });*/
        this.msgs = 'Aucun Message Pour Ces Critères !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('aff'));
      }
    }
    if (this.title === 'Les Messages Envoyés') {
      let envoyA = '';
      if (String(this.selectedEnvA) === 'null') {
        envoyA = '';
      } else {
        envoyA = this.selectedEnvA.codeUtil;
      }
      let envoyPar = '';
      if (String(this.selectedEnvPar) === 'null') {
        envoyPar = '';
      } else {
        envoyPar = this.selectedEnvPar.codeUtil;
      }
      let codeClt = '';
      if (String(this.selectedClient) === 'null') {
        codeClt = '';
      } else {
        codeClt = this.selectedClient.code;
      }
      let sujet = '';
      if (String(this.selectedSujet) === 'null') {
        sujet = '';
      } else {
        sujet = this.selectedSujet.rubrique;
      }
      await this.visiteMessageService
        .getMesMessagesEnvoyes(
          envoyPar,
          this.datePipe.transform(this.dateDebut, 'yyyy-dd-MM' + ' 00:00:00'),
          this.datePipe.transform(this.dateFin, 'yyyy-dd-MM' + ' 23:59:59'),
          envoyA,
          this.numVisite,
          sujet,
          codeClt,
          this.selectedLectureMessage,
          this.selectedLectureReponse,
          this.selectedArriveeReponse,
          this.selectedDepassementDelais
        )
        .toPromise()
        .then(data => {
          console.log(data);
          this.messages = data['_embedded'].visiteMessage;
        });

      if (this.messages.length > 0) {
        this.showNext = true;
      } else {
        /*
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Erreur',
          detail: 'Aucun Message Pour Ces Critères !'
        });*/
        this.msgs = 'Aucun Message Pour Ces Critères !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('aff'));
      }
    }
  }
  async lireMessageReponse() {
    if (this.grid.getSelectedRecords().length > 0) {
      const selectedRow: any = this.grid.getSelectedRecords()[0];
      if (String(selectedRow.reponse).length > 0) {
        this.etatReponse = 'REPONSE EFFECTUEE, ';
        this.reponse = selectedRow.reponse;
      } else {
        this.etatReponse = 'REPONSE NON EFFECTUEE, ';
      }
      const testDate = new Date(String(selectedRow.date));
      if (testDate < new Date()) {
        this.etatReponse = this.etatReponse + 'DELAI DEPASSE';
      } else {
        this.etatReponse = this.etatReponse + 'DELAI NON DEPASSE';
      }
      await this.visiteSujetTraiteService
        .getVisiteSujetTraiteByNumVisiteAndRubrique(
          selectedRow.numVisite,
          selectedRow.rubrique
        )
        .toPromise()
        .then(data => {
          this.message = data['_embedded'].visiteSujetTraite[0].texte;
        });
      this.hideMessage = false;
      this.hideReponse = false;
      this.hideOkButton = false;
      this.disableEditRep = true;
      this.hideValiderRepButton = true;
    }
  }
  confirmerLecture() {
    this.hideMessage = true;
    this.hideReponse = true;
    this.hideOkButton = true;
    this.disableEditRep = true;
    this.hideValiderRepButton = true;
  }
  async consulterVisite() {
    const selected: any = this.grid.getSelectedRecords();
    let visites = [];

    if (selected.length > 0) {
      await this.visiteService
        .getVisiteByNumVisite(selected[0].numVisite)
        .toPromise()
        .then(data => {
          visites = data['_embedded'].visites;
        });
    }

    if (visites.length > 0) {
      const selectedRow: any = visites[0];
      this.ProgVisite.titre = 'CONSULTATION VISITE';
      this.ProgVisite.numVisite = selectedRow.numVisite;
      this.ProgVisite.consultVisite = true;
      /*if (
        selectedRow.codeClt !== null &&
        selectedRow.codeClt !== '' &&
        String(selectedRow.codeClt) !== 'null'
      ) {

        let client = null;
        console.log(selectedRow.codeClt);
        await this.clientService
          .getClientByCode(selectedRow.codeClt)
          .toPromise()
          .then(data => {
            console.log(data);
            client = data['_embedded'].clients[0];
          });

        this.ProgVisite.selectedClient = client;
        console.log(client);

      } else {*/
      this.ProgVisite.selectedClient.code = selectedRow.codeClt;
      this.ProgVisite.selectedClient.deno = selectedRow.denoClt;
      this.ProgVisite.selectedClient.adresse = selectedRow.adrClt;
      this.ProgVisite.selectedClient.eMail = selectedRow.mailClt;
      this.ProgVisite.selectedClient.respon = selectedRow.responClt;
      this.ProgVisite.selectedClient.fonction1 = selectedRow.fonctionClt;
      this.ProgVisite.selectedClient.tel = selectedRow.telClt;
      this.ProgVisite.selectedClient.fax = selectedRow.faxClt;
      //  }
      this.ProgVisite.ofr = selectedRow.attOfr;
      this.ProgVisite.cmd = selectedRow.attCmd;
      this.ProgVisite.fin = selectedRow.attFin;
      this.ProgVisite.autre = selectedRow.attAutre;
      this.ProgVisite.datePrevue = selectedRow.datePrevue;
      this.ProgVisite.hDebut = String(selectedRow.datePrevue).substring(11, 16);
      // this.ProgVisite.hFin = selectedRow.heureFinPrevue;
      this.ProgVisite.hFin =
        String(selectedRow.heureFinPrevue).substr(0, 2) +
        ':' +
        String(selectedRow.heureFinPrevue).substr(2, 2);
      const util = this.users.find(
        user => user.codeUtil === selectedRow.codeProgrammeePar
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
          .then(data => {
            this.ProgVisite.visitesSujetTraite =
              data['_embedded'].visiteSujetTraite;
          });
        if (this.ProgVisite.visitesSujetTraite.length > 0) {
          this.ProgVisite.selectedIndexSujetTraite = 0;
        }
        this.ProgVisite.disableDateReelle = true;
      }
      if (selectedRow.codePart1 !== '') {
        const util = this.users.find(
          user => user.codeUtil === selectedRow.codePart1
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
        const util = this.users.find(
          user => user.codeUtil === selectedRow.codePart2
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
        const util = this.users.find(
          user => user.codeUtil === selectedRow.codePart3
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
        .then(data => {
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
        .then(data => {
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
        .then(data => {
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
        .then(data => {
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
  }
  showDialogMaximized(dialog: Dialog) {
    dialog.maximize();
  }
  exportExcel() {
    if (this.messages.length > 0) {
    }
    this.grid.excelExport();
  }
  async repondre(e) {
    if (this.grid.getSelectedRecords().length > 0) {
      const selectedRow: any = this.grid.getSelectedRecords()[0];
      if (
        String(selectedRow.reponse).length > 0 &&
        String(selectedRow.reponse) !== 'null'
      ) {
        this.etatReponse = 'REPONSE EFFECTUEE, ';
        this.reponse = selectedRow.reponse;
        this.disableEditRep = true;
        this.hideValiderRepButton = true;
        /*
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Erreur',
          detail: 'La réponse est déjà faite !'
        });*/
        this.msgs = 'La réponse est déjà faite !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e);
      } else {
        this.disableEditRep = false;
        this.hideValiderRepButton = false;
        this.etatReponse = 'REPONSE NON EFFECTUEE, ';
      }
      const testDate = new Date(String(selectedRow.date));
      if (testDate < new Date()) {
        this.etatReponse = this.etatReponse + 'DELAI DEPASSE';
      } else {
        this.etatReponse = this.etatReponse + 'DELAI NON DEPASSE';
      }

      await this.visiteSujetTraiteService
        .getVisiteSujetTraiteByNumVisiteAndRubrique(
          selectedRow.numVisite,
          selectedRow.rubrique
        )
        .toPromise()
        .then(data => {
          this.message = data['_embedded'].visiteSujetTraite[0].texte;
        });
      this.hideMessage = false;
      this.hideReponse = false;
      this.hideOkButton = true;
    }
  }
  async validerReponse(e) {
    if (this.reponse === '') {
      this.msgs = 'VOTRE REPONSE NE PEUT PAS ETRE VIDE';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btValider'));
    } else {
      const selectedRow: any = this.grid.getSelectedRecords()[0];
      let visiteMsgTmp: VisiteMessage = null;
      await this.visiteMessageService
        .getVisiteMessageByNumVisiteAndRubriqueAndEnvoyeParAndEnvoyeA(
          selectedRow.numVisite,
          selectedRow.rubrique,
          selectedRow.envoyePar,
          selectedRow.envoyeA
        )
        .toPromise()
        .then(data => {
          if (data['_embedded'].visiteMessage.length > 0) {
            console.log(data);
            visiteMsgTmp = data['_embedded'].visiteMessage[0];
          }
        });

      if (visiteMsgTmp !== null) {
        const visiteMsg: VisiteMessage = {
          id: visiteMsgTmp.id,
          numVisite: visiteMsgTmp.numVisite,
          rubrique: visiteMsgTmp.rubrique,
          envoyePar: visiteMsgTmp.envoyePar,
          date: visiteMsgTmp.date,
          messageLu: visiteMsgTmp.messageLu,
          envoyeA: visiteMsgTmp.envoyeA,
          delai: visiteMsgTmp.delai,
          reponse: this.reponse,
          dateRep: new Date().toLocaleDateString('en-GB'),
          reponseLu: visiteMsgTmp.reponseLu
        };

        await this.visiteMessageService
          .updateVisiteMessage(visiteMsg)
          .toPromise()
          .then(data => {});
        this.hideValiderRepButton = true;
        this.hideReponse = true;
        this.hideMessage = true;

        await this.afficher(e);
      } else {
        this.msgs = 'Message non trouvé';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btValider'));
      }
    }
  }
  rowSelected(e) {
    this.hideBtns = false;
  }
}
