import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  HostListener,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent,
  ExcelExportProperties,
  ToolbarService,
  ToolbarItems,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { Visite } from '../services/visite';
import { VisiteService } from '../services/visite.service';
import { LoginService } from '../../login/login.service';
import { VisiteCommande } from '../services/visiteCommande';
import { VisiteCommandeService } from '../services/visiteCommande.service';
import { VisiteOffre } from '../services/visiteOffre';
import { VisiteOffreService } from '../services/visiteOffre.service';
import { VisiteReleve } from '../services/visiteReleve';
import { VisiteReleveService } from '../services/visiteReleve.service';
import { VisiteVisite } from '../services/visiteVisite';
import { VisiteVisiteService } from '../services/visiteVisite.service';
import { VisiteMessageService } from '../services/visiteMessage.service';
import { Dialog } from 'primeng/dialog';
import { NgSelectConfig } from '@ng-select/ng-select';
import { User } from 'src/app/login/User';
import { VisiteSujetTraite } from '../services/visiteSujetTraite';
import { OverlayPanel } from 'primeng/primeng';
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
  selector: 'app-consultation-visite',
  templateUrl: './consultation-visite.component.html',
  styleUrls: ['./consultation-visite.component.scss'],
  providers: [MessageService, DatePipe, ToolbarService],
})
export class ConsultationVisiteComponent implements OnInit {
  constructor(
    private visiteService: VisiteService,
    private loginService: LoginService,
    private clientService: ClientService,
    private visiteVisiteService: VisiteVisiteService,
    private visiteOffreService: VisiteOffreService,
    private visiteCommandeService: VisiteCommandeService,
    private visiteReleveService: VisiteReleveService,
    private visiteMessageService: VisiteMessageService,
    // private messageService: MessageService,
    private datePipe: DatePipe,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun ??l??ment trouv??';
    this.config.clearAllText = 'Supprimer tous';
  }
  @ViewChild(VisiteAntConsultComponent) ProgVisite;
  @ViewChild('grid')
  public grid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  tn: any;
  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  numVisite = '';
  clients = [];
  selectedClient: Client;
  selectedParticipant;
  selectedUser;
  utils = [];
  selectedValue1 = '';
  selectedValue2 = '';
  visites = [];
  sujets = [];
  selectedSujet;
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
  public wrapSettings: TextWrapSettingsModel;
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  async ngOnInit() {
    this.wrapSettings = { wrapMode: 'Content' };
    this.viderSelectedClient();
    this.viderSelectedParticipant();
    this.viderSelectedUser();
    this.dateFin.setDate(this.dateDebut.getDate() + 30);
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
    this.toolbarOptions = ['ExcelExport'];
    await this.clientService
      .getClientsListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
        this.clients.unshift(this.selectedClient);
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
    await this.visiteService
      .getSujetsVisite()
      .toPromise()
      .then((data) => {
        this.sujets = data['_embedded'].sujetVisites;
        this.sujets.unshift({
          id: '',
          rubrique: '',
          responsable: '',
          nPUtil: '',
        });
      });
  }
  viderSelectedParticipant() {
    this.selectedParticipant = {
      codeUtil: '',
      mPUtil: '',
      nPUtil: '',
      menu1: '',
      menu2: '',
      menu3: '',
      menu4: '',
      menu5: '',
      menu6: '',
      menu7: '',
      menu8: '',
      menu9: '',
      menu10: '',
      menu11: '',
    };
  }
  viderSelectedUser() {
    this.selectedUser = {
      codeUtil: '',
      mPUtil: '',
      nPUtil: '',
      menu1: '',
      menu2: '',
      menu3: '',
      menu4: '',
      menu5: '',
      menu6: '',
      menu7: '',
      menu8: '',
      menu9: '',
      menu10: '',
      menu11: '',
    };
  }
  viderSelectedClient() {
    this.selectedClient = {
      id: null,
      code: '',
      deno: '',
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
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    let etat = '';
    if (this.selectedValue1 !== '') {
      etat =
        'AND v.dateReelle IS NULL AND DATEDIFF(DAY,v.datePrevue,GETDATE()) ' +
        this.selectedValue1;
    }
    let etat2 = '';
    if (this.selectedValue2 !== '') {
      etat2 = this.selectedValue2;
    }
    let vstTmp = [];
    await this.visiteService
      .getVisitesForConsultVisite(
        this.datePipe.transform(this.dateDebut, 'yyyy-dd-MM' + ' 00:00:00'),
        this.datePipe.transform(this.dateFin, 'yyyy-dd-MM' + ' 23:59:59'),
        this.numVisite,
        this.selectedClient.code,
        this.selectedUser.codeUtil,
        this.selectedParticipant.codeUtil,
        etat,
        etat2
      )
      .toPromise()
      .then((data) => {
        vstTmp = data['_embedded'].visites;
      });
    for (const vst of vstTmp) {
      vst.datePrevue = String(vst.datePrevue).substring(0, 16);
      vst.heureFinPrevue =
        String(vst.heureFinPrevue).substring(0, 2) +
        ':' +
        String(vst.heureFinPrevue).substring(2, 4);
      if (vst.dateReelle !== '' && vst.dateReelle !== null) {
        vst.dateReelle = String(vst.dateReelle).substring(0, 16);
      } else {
        vst.dateReelle = '';
      }
      if (vst.heureFinReelle !== '' && vst.heureFinReelle !== null) {
        vst.heureFinReelle =
          String(vst.heureFinReelle).substring(0, 2) +
          ':' +
          String(vst.heureFinReelle).substring(2, 4);
      } else {
        vst.heureFinReelle = '';
      }
    }
    this.visites = vstTmp;
    if (this.visites.length === 0) {
      this.msgs = 'AUCUNE VISITE POUR CES CRITERES !';
      this.styleOvPanel = this.styleOvPanelError;
      // document.getElementById('client').focus();
      this.ov.show(e, document.getElementById('btAfficher'));
      /*this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'AUCUNE VISITE POUR CES CRITERES',
      });*/
    }
  }
  async consulterVisite() {
    const selectedRow: any = this.grid.getSelectedRecords()[0];
    this.ProgVisite.titre = 'CONSULTATION VISITE';
    this.ProgVisite.numVisite = selectedRow.numVisite;
    this.ProgVisite.consultVisite = true;
    /*if (selectedRow.codeClt !== null && selectedRow.codeClt !== '' && String(selectedRow.codeClt) !== 'null') {
      this.ProgVisite.selectedClient = this.clients.find(client => client.code === selectedRow.codeClt);
    } else {*/
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
    this.ProgVisite.hFin = selectedRow.heureFinPrevue;
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
      this.ProgVisite.hReelleFin = selectedRow.heureFinReelle;

      await this.ProgVisite.visiteSujetTraiteService
        .getVisiteSujetTraiteByNumVisite(selectedRow.numVisite)
        .toPromise()
        .then((data) => {
          this.ProgVisite.visitesSujetTraite =
            data['_embedded'].visiteSujetTraite;
        });
      if (this.ProgVisite.visitesSujetTraite.length > 0) {
        // this.ProgVisite.selectedIndexSujetTraite = 0;
        // this.ProgVisite.gridSujetsTraites.selectRows([0]);
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
  annulerSelectionVisite(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  showDialogMaximized(dialog: Dialog) {
    dialog.maximize();
  }
  excelExport() {
    const excelExportProperties: ExcelExportProperties = {
      // fileName: 'RAPPORT DE VISITES' + this.selectedUser.nPUtil + '.xlsx'
      fileName: 'RAPPORT DE VISITES.xlsx',
    };
    this.grid.excelExport(excelExportProperties);
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchUser(word: string, item: User): boolean {
    return item.nPUtil.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchParticipant(word: string, item: User): boolean {
    return item.nPUtil.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchSujet(word: string, item: VisiteSujetTraite): boolean {
    return item.rubrique
      .toLocaleLowerCase()
      .startsWith(word.toLocaleLowerCase());
  }
}
