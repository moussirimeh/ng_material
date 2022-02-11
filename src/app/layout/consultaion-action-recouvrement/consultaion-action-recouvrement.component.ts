import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { SearchSettingsModel } from '@syncfusion/ej2-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { ActionRecouvService } from '../services/actionRecouv.service';
import { ActionRecouv } from '../services/actionRecouv';
import { LoginService } from 'src/app/login/login.service';
import { Login } from 'src/app/login/login';
import { User } from 'src/app/login/User';
import { ExcelService } from '../services/excel.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
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
  selector: 'app-consultaion-action-recouvrement',
  templateUrl: './consultaion-action-recouvrement.component.html',
  styleUrls: ['./consultaion-action-recouvrement.component.scss'],
  providers: [ExcelService]
})
export class ConsultaionActionRecouvrementComponent implements OnInit {
  from = new Date();
  to = new Date();
  public customAttributes: Object;
  @ViewChild('grid')
  public grid: GridComponent;
  public searchOptions: SearchSettingsModel;
  readonlynom = true;
  showDetailAction = true;
  tab_actionrecouv: any;
  readonly = true;
  client: Client = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    respon: '',
    tel: '',
    agence: '',
    banque: '',
    telex: '',
    fax: '',
    cadnat: '',
    compte: '',
    edition: '',
    exonor: '',
    duree: '',
    reg: '',
    terme: '',
    marque: '',
    plafond: '',
    zone: '',
    comm: '',
    assujet: '',
    codeTva: '',
    timbre: '',
    ech: '',
    bloc: '',
    datBlc: '',
    typeC: '',
    regle: '',
    lettre: '',
    codeC: '',
    autor: '',
    eMail: '',
    typeComm: '',
    rec: '',
    vend: '',
    represant: '',
    secteur: '',
    objectif: '',
    nature: '',
    datCreat: '',
    mag: '',
    respons2: '',
    adresseusine: '',
    adressesiege: '',
    gsm1: '',
    gsm2: '',
    nouvMag: '',
    ca123: '',
    respons3: '',
    fonction1: '',
    fonction2: '',
    fonction3: '',
    eMail1: '',
    eMail2: '',
    eMail3: '',
    tel2: '',
    tel3: '',
    gsm3: '',
    codGroupe: '',
    modeReg: '',
    plafondEncours: '',
    indic: '',
    bcExige: ''
  };
  clickedintro = false;
  personnes: Login[];
  clt: Client = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    respon: '',
    tel: '',
    agence: '',
    banque: '',
    telex: '',
    fax: '',
    cadnat: '',
    compte: '',
    edition: '',
    exonor: '',
    duree: '',
    reg: '',
    terme: '',
    marque: '',
    plafond: '',
    zone: '',
    comm: '',
    assujet: '',
    codeTva: '',
    timbre: '',
    ech: '',
    bloc: '',
    datBlc: '',
    typeC: '',
    regle: '',
    lettre: '',
    codeC: '',
    autor: '',
    eMail: '',
    typeComm: '',
    rec: '',
    vend: '',
    represant: '',
    secteur: '',
    objectif: '',
    nature: '',
    datCreat: '',
    mag: '',
    respons2: '',
    adresseusine: '',
    adressesiege: '',
    gsm1: '',
    gsm2: '',
    nouvMag: '',
    ca123: '',
    respons3: '',
    fonction1: '',
    fonction2: '',
    fonction3: '',
    eMail1: '',
    eMail2: '',
    eMail3: '',
    tel2: '',
    tel3: '',
    gsm3: '',
    codGroupe: '',
    modeReg: '',
    plafondEncours: '',
    indic: '',
    bcExige: ''
  };
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  maxDate = new Date();
  tab_client: any;
  clients: Client[];
  client1: Client[];
  actionrecouvs: ActionRecouv[];
  SelectedAction: any;
  actionrecouveff: ActionRecouv[];
  SelectedPersonne: User = {
    id: '',
    codeUtil: '',
    nPUtil: '',
    mPUtil: '',
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
    menu11: ''
  };
  SelectedNomPersonne: string;
  SelectedClient: Client = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    respon: '',
    tel: '',
    agence: '',
    banque: '',
    telex: '',
    fax: '',
    cadnat: '',
    compte: '',
    edition: '',
    exonor: '',
    duree: '',
    reg: '',
    terme: '',
    marque: '',
    plafond: '',
    zone: '',
    comm: '',
    assujet: '',
    codeTva: '',
    timbre: '',
    ech: '',
    bloc: '',
    datBlc: '',
    typeC: '',
    regle: '',
    lettre: '',
    codeC: '',
    autor: '',
    eMail: '',
    typeComm: '',
    rec: '',
    vend: '',
    represant: '',
    secteur: '',
    objectif: '',
    nature: '',
    datCreat: '',
    mag: '',
    respons2: '',
    adresseusine: '',
    adressesiege: '',
    gsm1: '',
    gsm2: '',
    nouvMag: '',
    ca123: '',
    respons3: '',
    fonction1: '',
    fonction2: '',
    fonction3: '',
    eMail1: '',
    eMail2: '',
    eMail3: '',
    tel2: '',
    tel3: '',
    gsm3: '',
    codGroupe: '',
    modeReg: '',
    plafondEncours: '',
    indic: '',
    bcExige: ''
  };
  denoClt = 'Tout';
  validedate = true;
  dateDisabled = false;
  detailaction = '';
  ngselectDisabled = false;
  selectedDate1 = null;
  nomclt: any;
  selectedDate2 = null;
  codeClient: string;
  combine: string;
  excelShow = false;
  tn: any;
  SelelectedcodeClient: String;
  sourceExcel: any;
  codeClt = '';
  NomPersonne = '';
  wasInside: boolean;
  valide = false;
  constructor(
    private clientService: ClientService,
    private actrecouvService: ActionRecouvService,
    private loginService: LoginService,
    private excelService: ExcelService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  ngOnInit() {
    this.actionrecouveff = new Array();
    this.SelectedPersonne = null;
    this.SelectedClient = null;
    this.customAttributes = { class: 'customcss' };
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
    /// charger les personnes
    this.loginService
      .getUserListByOrderByCode()
      .toPromise()
      .then(data => {
        this.personnes = data['_embedded'].users;
      });
    /// charger les clients
    this.clientService
      .getClientTerme()
      .toPromise()
      .then(data => {
        this.clients = data['_embedded'].clients;
      });
  }
  // hostlistener
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ovo.hide();
    }
    this.wasInside = false;
  }
  /// chercher les personnes en front end
  public onSearchPersonne(word: string, item: User): boolean {
    return item.nPUtil.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  /// chercher les clients en front end
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  /// Afficher les actions de recouvrement
  async AfficherActRecouv(e) {
    this.actionrecouveff = new Array();

    this.wasInside = true;
    this.ovo.hide();
    // test sur le nomclient sélectionné
    if (this.SelectedClient !== null) {
      this.denoClt = this.SelectedClient.deno;
      this.codeClt = this.SelectedClient.code;
    }
    // test pour le nom de la personne sélectionnée
    if (this.SelectedPersonne !== null) {
      this.NomPersonne = this.SelectedPersonne.codeUtil;
      console.log(this.NomPersonne);
    }
    // affichage

    await this.actrecouvService
      .rechercheActionRecv(
        this.codeClt,
        this.NomPersonne,
        this.from.toLocaleDateString('en-GB'),
        this.to.toLocaleDateString('en-GB')
      )
      .toPromise()
      .then(data => {
        // datasource pour le grid
        console.log('from: ' + this.from);
        console.log('to: ' + this.to);
        this.actionrecouveff = data['_embedded'].actionRecouvEffs;
        console.log(this.actionrecouveff);

        // datasource pour l'excel
        this.sourceExcel = data['_embedded'].actionRecouvEffs;
        // affichage de la date dans le grid
        for (this.tab_actionrecouv of this.actionrecouveff) {
          this.tab_actionrecouv.dateaffiche = this.tab_actionrecouv.dateact.substring(0, 10);
        }
        /// si n'existe pas aucune action
        if (this.actionrecouveff.length === 0) {
          this.ngselectDisabled = false;
          this.dateDisabled = false;
          this.excelShow = false;
          this.valide = false;
          this.ms = 'Aucune action de recouvrement trouvé';
          this.ovo.show(e, document.getElementById('afficher'));
          this.validedate = true;
          this.actionrecouveff = null;
          this.detailaction = '';
          this.SelectedAction = null;
          this.sourceExcel = null;
          this.codeClt = '';
          this.NomPersonne = '';
          this.denoClt = 'Tout';
          this.excelShow = false;
        } else {
          this.excelShow = true;
          this.valide = true ;
          this.ngselectDisabled = true;
          this.dateDisabled = true;
        }

      });
  }
  /// Introduire
  async introdure() {
    // activer les inputs et les ngselect
    this.dateDisabled = false;
    this.ngselectDisabled = false;

    this.clickedintro = true;
    /// initialisation

    this.validedate = true;
    this.actionrecouveff = null;
    this.detailaction = '';
    this.SelectedAction = null;
    this.sourceExcel = null;
    this.codeClt = '';
    this.NomPersonne = '';
    this.denoClt = 'Tout';
    this.excelShow = false;
  }

  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.detailaction = '';
    }
  }
  rowSelected() {
    this.readonlynom = true;
    this.readonly = true;

    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.showDetailAction = true;
      const selected: any = this.grid.getSelectedRecords()[0];
      this.SelectedAction = selected;
      if (this.showDetailAction === true) {
        this.detailaction = this.SelectedAction.detailaction;

      }
    }
  }
  // excel
  Excel() {
    try {
      if (this.sourceExcel === undefined) {
      } else {
        const exportExcel = this.sourceExcel.map(obj => {
          return {
            Client: obj.nomClt,
            'Effectuée par': obj.effectPar,
            Date: String(obj.dateact).substring(0, 10),
            num_visite: obj.nmrVisite
          };
        });
        this.excelService.exportAsExcelFile(
          exportExcel,
          'Liste des action de recouvrement du client:' +
            this.denoClt +
            'effectuée Par:' +
            this.NomPersonne
        );
      }
    } catch {
      console.log(' methode genererExcel');
    }
  }
}
