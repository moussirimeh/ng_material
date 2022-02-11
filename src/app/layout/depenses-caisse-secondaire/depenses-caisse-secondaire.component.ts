import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {
  GridComponent,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { SelectItem } from 'primeng/api';
import { SteService } from '../services/ste.service';
import { SoldcsService } from '../services/soldcs.service';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { CaisseService } from '../services/caisse.service';
import { RecettesService } from '../services/recettes.service';
import { DatePipe } from '@angular/common';
import { DepensesCaisseSecondaire } from '../services/depensesCaisseSecondaire';
import { DepensesCaisseSecondaireService } from '../services/depensesCaisseSecondaire.service';
import { LoginService } from '../../login/login.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { InputMask, OverlayPanel } from 'primeng/primeng';
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
import { Caisse } from '../services/caisse';
import { LibdepService } from '../services/libdep.service';
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
  selector: 'app-depenses-caisse-secondaire',
  templateUrl: './depenses-caisse-secondaire.component.html',
  styleUrls: ['./depenses-caisse-secondaire.component.scss'],
  providers: [DatePipe],
})
export class DepensesCaisseSecondaireComponent implements OnInit {
  blockDocument = false;
  text: string;
  tn;
  @ViewChild('grid')
  public grid: GridComponent;
  dateCaisse;
  dateCaisseSecondaire;
  from: any;
  to: any;
  maxDate: Date;
  minDate: Date;
  clients: Client[] = [];
  libelle: SelectItem[];
  libellees: SelectItem[];
  mode: SelectItem[];
  allowSelection = true;
  afficherClicked = false;
  validershow = false;
  ajouterDisabled = true;
  supprimerDisabled = true;
  modifierDisabled = true;
  champDisabled = true;
  afficherShow = true;
  ajouterClicked = false;
  modifierClicked = false;
  selected;
  selectedCode;
  deno;

  depenses: DepensesCaisseSecondaire[] = [];
  selectedClient: Client = {
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
    bcExige: '',
  };
  selectedCaisse: any = {
    id: '',
    code: '',
    date: '',
    mode: '',
    cheque: '',
    banque: '',
    facture: '',
    sens: '',
    montant: '',
    ech: '',
    observat: '',
    datVer: '',
    datRec: '',
    etat: '',
    etat2: '',
    banqEqm: '',
    borVer: '',
    borEnc: '',
    tire: '',
    combine: '',
    operateur: '',
    regle: '',
    apurement: '',
    dateApur: '',
    borRtr: '',
    numPiece: '',
  };
  @ViewChild('ngSelectLibelle') ngSelectLibelle: NgSelectComponent;
  // @ViewChild('ngSelectClient') ngSelectClient: NgSelectComponent;
  @ViewChild('ngSelectMode') ngSelectMode: NgSelectComponent;
  @ViewChild('inputMaskDateEnreg') inputMaskDateEnreg: InputMask;
  @ViewChild('inputMaskEcheance') inputMaskEcheance: InputMask;
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
    private datePipe: DatePipe,
    private steService: SteService,
    private clientService: ClientService,
    private soldcsService: SoldcsService,
    private depencesCaisseSecondaireService: DepensesCaisseSecondaireService,
    private caisseService: CaisseService,
    private recettesService: RecettesService,
    private loginService: LoginService,
    private libdepService: LibdepService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = '';
    this.config.clearAllText = 'Supprimer tous';
    /*this.libelle = [
      { label: '', value: '' },
      { label: 'ACHAT AU COMPTANT', value: '03' },
      { label: 'ACHAT DEVISE', value: '18' },
      { label: 'ANNULATION DE TITRE ', value: 'BB' },
      { label: 'ASSURANCE ', value: '17' },
      { label: 'AVENCE/SALAIRE', value: '11' },
      { label: 'AVOIR/COMPTANT', value: '01' },
      { label: 'AVOIR/INSTANCE', value: '02' },
      { label: 'CARBURANT', value: '07' },
      { label: 'COMPENSATION', value: '60' },
      { label: 'COMPLEMENT DE SALAIRE', value: '15' },
      { label: 'DIVERS', value: '12' },
      { label: 'DON', value: '13' },
      { label: 'FACTURE COMPTANT ', value: '91' },
      { label: 'FACTURE INSTANCE ', value: '92' },
      { label: 'FOURNITURE BUREAU', value: '06' },
      { label: 'FRAIS D\'EXPEDITION', value: '08' },
      { label: 'FRAIS DE TRANSPORT', value: '04' },
      { label: 'INTERET DE RETARD ', value: '93' },
      { label: 'MISSION', value: '09' },
      { label: 'RECTIFICATION SOLDE ', value: '16' },
      { label: 'REPARATION MATERIEL', value: '05' },
      { label: 'TEL & ELECTRICITE & EAU', value: '10' },
      { label: 'VERSEMENT CHEQUE', value: '14' },
      { label: 'VERSEMENT ESPECE ', value: '20' },
    ];*/

    this.mode = [
      { label: '', value: null },
      { label: 'CHEQUE', value: 'CHEQUE' },
      { label: 'ESPECE', value: 'ESPECE' },
    ];
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
    this.to = new Date();
    this.maxDate = new Date();
    await this.getDate();
    await this.clientService
      .getClientsComptantListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
      let libdeps = [];
      await this.libdepService.getLibdepListOrderByLibelle().toPromise().then(data => {libdeps = data['_embedded'].libdep; });
      this.libelle = libdeps.map((obj) => {
        return {
          'value': obj.code,
          'label': obj.libelle,
        };
      });
      this.libelle.unshift({ label: '', value: '' });
  }

  /*async reloadDataClient() {
    await this.clientService
      .getClientsList()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }*/
  async getDeno() {
    await this.clientService
      .getDeno(this.selected.client)
      .toPromise()
      .then((value) => {
        this.deno = value;
      });
  }

  async getDate() {
    await this.soldcsService
      .getDateCaisseSecondaire()
      .toPromise()
      .then((value) => {
        this.dateCaisseSecondaire = value;
      });
    await this.steService
      .getDateCaissePlus()
      .toPromise()
      .then((value) => {
        this.dateCaisse = value;
      });
    const d1 = new Date(this.dateCaisseSecondaire);
    // console.log('Datecaisse secondaire=' + this.dateCaisseSecondaire);
    const d2 = new Date(this.dateCaisse);
    // console.log('Datecaise' + this.dateCaisse);
    if (d1 > d2) {
      this.from = new Date(d1);

      // console.log('from' + this.from);
      this.minDate = this.from;
    } else {
      this.from = new Date(d2);
      this.minDate = this.from;
    }
    this.from = this.from.toLocaleDateString('en-GB');
    this.to = this.to.toLocaleDateString('en-GB');
  }

  async DepenseCaisse() {
    await this.depencesCaisseSecondaireService
      .depensesCaisseSecondaire(this.from, this.to)
      .toPromise()
      .then((data) => {
        this.depenses = data['_embedded'].depensesCaisseSecondaire;
      });
  }

  async reloadCaissesSecondaire() {
    await this.depencesCaisseSecondaireService
      .depensesCaisseSecondaire(this.from, this.to)
      .toPromise()
      .then((data) => {
        this.depenses = data['_embedded'].depensesCaisseSecondaire;
      });
  }

  async afficher() {
    await this.updateDBFromRecettes();
    await this.DepenseCaisse();
    // console.log('depenses');
    this.afficherClicked = true;
    this.ajouterDisabled = false;
    this.afficherShow = true;
    this.modifierDisabled = true;
    this.supprimerDisabled = true;
    this.afficherShow = false;
  }

  async ajouter() {
    this.text = 'Saisie de la nouvelle Depense';
    this.allowSelection = false;
    this.selectedCaisse = {
      id: null,
      code: null,
      date: new Date(),
      mode: null,
      cheque: null,
      banque: null,
      facture: null,
      sens: 'S',
      montant: null,
      ech: new Date(),
      observat: null,
      datVer: null,
      datRec: null,
      etat: null,
      etat2: null,
      banqEqm: null,
      borVer: null,
      borEnc: null,
      tire: null,
      combine: null,
      operateur: null,
      regle: null,
      apurement: null,
      dateApur: null,
      borRtr: null,
      numPiece: null,
    };
    // await this.reloadDataClient();
    this.afficherShow = false;
    this.ajouterClicked = true;
    this.modifierClicked = false;
    this.ajouterDisabled = true;
    this.modifierDisabled = true;
    this.supprimerDisabled = true;
    this.selectedClient = null;
    this.champDisabled = false;
    this.validershow = true;
    this.selectedCaisse.ech = this.datePipe.transform(
      this.selectedCaisse.ech,
      'dd/MM/yyyy'
    );
    this.selectedCaisse.date = this.datePipe.transform(
      this.selectedCaisse.date,
      'dd/MM/yyyy'
    );
    this.grid.selectRows([]);
    setTimeout(() => this.ngSelectLibelle.focus(), 1);
  }

  setCode() {
    if (this.selectedClient != null) {
      this.selectedCode = this.selectedClient.code;
      this.selectedCaisse.operateur = this.selectedClient.code;

        document.getElementById('btValider').focus();

    }
  }

  async createDepense() {
    await this.caisseService
      .createCaisse(this.selectedCaisse)
      .toPromise()
      .then((data) => {});
    await this.reloadCaissesSecondaire();
  }

  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.ajouterClicked === true) {
      if (this.selectedCaisse.code === null) {
        this.msgs = 'Veuillez selectionner un libelle !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('libelle').focus();
        this.ov.show(e, document.getElementById('libelle'));
      } else {
        if (this.selectedCaisse.mode === null) {
          this.msgs = 'Veuillez selectionner un mode !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('mode').focus();
          this.ov.show(e, document.getElementById('mode'));
        } else {
          if (
            this.selectedCaisse.mode === 'TRAITE' ||
            this.selectedCaisse.mode === 'CHEQUE'
          ) {
            if (this.selectedCaisse.cheque === null) {
              this.msgs = 'Veuillez saisir le titre !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById('titre').focus();
              this.ov.show(e, document.getElementById('titre'));
            } else {
              if (this.selectedCaisse.banque === null) {
                this.msgs = 'Veuillez saisir la banque !';
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById('banque').focus();
                this.ov.show(e, document.getElementById('banque'));
              } else {
                if (
                  this.selectedCaisse.operateur === null &&
                  (this.selectedCaisse.code === '01' ||
                    this.selectedCaisse.code === '02')
                ) {
                  this.msgs = 'Veuillez selectionner le client !';
                  this.styleOvPanel = this.styleOvPanelError;
                  document.getElementById('client').focus();
                  this.ov.show(e, document.getElementById('client'));
                } else {
                  if (
                    this.selectedCaisse.montant === null ||
                    this.selectedCaisse.montant === '' ||
                    this.selectedCaisse.montant === '0.000'
                  ) {
                    this.msgs = 'Veuillez saisir le montant !';
                    this.styleOvPanel = this.styleOvPanelError;
                    document.getElementById('montant').focus();
                    this.ov.show(e, document.getElementById('montant'));
                  } else {
                    const libelle = this.libelle.find(lib => lib.value === this.selectedCaisse.code);
                    await this.createDepense();
                    await this.loginService
                      .procedureStockeModule(
                        localStorage.getItem('login'),
                        globals.selectedMenu,
                        'AJ ' +
                          Number(this.selectedCaisse.montant).toFixed(3) +
                          ' ' +
                          libelle.label +
                          ' ' +
                          this.selectedCaisse.date
                      )
                      .toPromise()
                      .then((data) => {
                        console.log(data);
                      });
                    this.fermer(1);
                  }
                }
              }
            }
          } else {
            if (
              this.selectedCaisse.client === null &&
              (this.selectedCaisse.code === '01' ||
                this.selectedCaisse.code === '02')
            ) {
              this.msgs = 'Veuillez selectionner le client !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById('client').focus();
              this.ov.show(e, document.getElementById('client'));
            } else {
              if (this.selectedCaisse.montant === null ||
                this.selectedCaisse.montant === '' ||
                this.selectedCaisse.montant === '0.000') {
                this.msgs = 'Veuillez saisir le montant !';
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById('montant').focus();
                this.ov.show(e, document.getElementById('montant'));
              } else {
                const libelle = this.libelle.find(lib => lib.value === this.selectedCaisse.code);
                await this.createDepense();
                await this.loginService
                  .procedureStockeModule(
                    localStorage.getItem('login'),
                    globals.selectedMenu,
                    'AJ ' +
                      Number(this.selectedCaisse.montant).toFixed(3) +
                      ' ' +
                      libelle.label +
                      ' ' +
                      this.selectedCaisse.date
                  )
                  .toPromise()
                  .then((data) => {
                    console.log(data);
                  });
                this.fermer(1);
              }
            }
          }
        }
      }
    } else if (this.modifierClicked === true) {
      if (this.selectedCaisse.code === null) {
        this.msgs = 'Veuillez selectionner un libelle !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('libelle').focus();
        this.ov.show(e, document.getElementById('libelle'));
      } else {
        if (this.selectedCaisse.mode === null) {
          this.msgs = 'Veuillez selectionner un mode !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('mode').focus();
          this.ov.show(e, document.getElementById('mode'));
        } else {
          if (
            this.selectedCaisse.mode === 'TRAITE' ||
            this.selectedCaisse.mode === 'CHEQUE'
          ) {
            if (this.selectedCaisse.cheque === null) {
              this.msgs = 'Veuillez saisir le titre !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById('titre').focus();
              this.ov.show(e, document.getElementById('titre'));
            } else {
              if (this.selectedCaisse.banque === null) {
                this.msgs = 'Veuillez saisir la banque !';
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById('banque').focus();
                this.ov.show(e, document.getElementById('banque'));
              } else {
                if (
                  this.selectedCaisse.operateur === null &&
                  (this.selectedCaisse.code === '01' ||
                    this.selectedCaisse.code === '02')
                ) {
                  this.msgs = 'Veuillez selectionner le client !';
                  this.styleOvPanel = this.styleOvPanelError;
                  document.getElementById('client').focus();
                  this.ov.show(e, document.getElementById('client'));
                } else {
                  if (
                    this.selectedCaisse.montant === null ||
                    this.selectedCaisse.montant === '' ||
                    this.selectedCaisse.montant === '0.000'
                  ) {
                    this.msgs = 'Veuillez saisir le montant !';
                    this.styleOvPanel = this.styleOvPanelError;
                    document.getElementById('montant').focus();
                    this.ov.show(e, document.getElementById('montant'));
                  } else {
                    const libelle = this.libelle.find(lib => lib.value === this.selectedCaisse.code);
                    await this.modifierDepense();
                    await this.loginService
                      .procedureStockeModule(
                        localStorage.getItem('login'),
                        globals.selectedMenu,
                        'MD ' +
                          Number(this.selectedCaisse.montant).toFixed(3) +
                          ' ' +
                          libelle.label +
                          ' ' +
                          this.selectedCaisse.date
                      )
                      .toPromise()
                      .then((data) => {
                        console.log(data);
                      });
                    this.fermer(1);
                  }
                }
              }
            }
          } else {
            if (
              this.selectedCaisse.client === null &&
              (this.selectedCaisse.code === '01' ||
                this.selectedCaisse.code === '02')
            ) {
              this.msgs = 'Veuillez selectionner le client !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById('client').focus();
              this.ov.show(e, document.getElementById('client'));
            } else {
              if (this.selectedCaisse.montant === null ||
                this.selectedCaisse.montant === '' ||
                this.selectedCaisse.montant === '0.000') {
                this.msgs = 'Veuillez saisir le montant !';
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById('montant').focus();
                this.ov.show(e, document.getElementById('montant'));
              } else {
                const libelle = this.libelle.find(lib => lib.value === this.selectedCaisse.code);
                await this.modifierDepense();
                await this.loginService
                  .procedureStockeModule(
                    localStorage.getItem('login'),
                    globals.selectedMenu,
                    'MD ' +
                      Number(this.selectedCaisse.montant).toFixed(3) +
                      ' ' +
                      libelle.label +
                      ' ' +
                      this.selectedCaisse.date
                  )
                  .toPromise()
                  .then((data) => {
                    console.log(data);
                  });
                this.fermer(1);
              }
            }
          }
        }
      }
    }
  }
  async modifierDepense() {
    await this.caisseService
      .updateput(this.selectedCaisse)
      .toPromise()
      .then(
        (data) => {},
        (error) => console.log('There was an error: ', error)
      );
    await this.reloadCaissesSecondaire();
  }
  async modifier(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.selected.apurement != null) {
      this.msgs = 'Mouvement Appuré - Modification pas Possible !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btModifier'));
      this.allowSelection = true;
    } else {
      this.text = 'Modification de la dépense';
      if (
        String(this.selected.client) !== 'null' &&
        String(this.selected.client) !== ''
      ) {
        await this.clientService
          .getDeno(this.selected.client)
          .toPromise()
          .then((value) => {
            this.deno = value;
            this.selectedClient = this.deno;
          });
      } else {
        this.selectedClient = null;
      }
      // await this.reloadDataClient();
      this.selectedCode = this.selected.client;
      this.selectedCaisse.code = this.selected.code;
      /*if (this.selected.libelle === 'AVOIR/COMPTANT') {
        this.selectedCaisse.code = '01';
      } else if (this.selected.libelle === 'AVOIR/INSTANCE') {
        this.selectedCaisse.code = '02';
      } else if (this.selected.libelle === 'ACHAT AU COMPTANT') {
        this.selectedCaisse.code = '03';
      } else if (this.selected.libelle === 'FRAIS DE TRANSPORT') {
        this.selectedCaisse.code = '04';
      } else if (this.selected.libelle === 'REPARATION MATERIEL') {
        this.selectedCaisse.code = '05';
      } else if (this.selected.libelle === 'FOURNITURE BUREAU') {
        this.selectedCaisse.code = '06';
      } else if (this.selected.libelle === 'CARBURANT') {
        this.selectedCaisse.code = '07';
      } else if (this.selected.libelle === 'FRAIS D\'EXPEDITION') {
        this.selectedCaisse.code = '08';
      } else if (this.selected.libelle === 'MISSION') {
        this.selectedCaisse.code = '09';
      } else if (this.selected.libelle === 'TEL & ELECTRICITE & EAU') {
        this.selectedCaisse.code = '10';
      } else if (this.selected.libelle === 'AVENCE/SALAIRE') {
        this.selectedCaisse.code = '11';
      } else if (this.selected.libelle === 'DIVERS') {
        this.selectedCaisse.code = '12';
      } else if (this.selected.libelle === 'DON') {
        this.selectedCaisse.code = '13';
      } else if (this.selected.libelle === 'VERSEMENT CHEQUE') {
        this.selectedCaisse.code = '14';
      } else if (this.selected.libelle === 'COMPLEMENT DE SALAIRE') {
        this.selectedCaisse.code = '15';
      } else if (this.selected.libelle === 'RECTIFICATION SOLDE') {
        this.selectedCaisse.code = '16';
      } else if (this.selected.libelle === 'ASSURANCE') {
        this.selectedCaisse.code = '17';
      } else if (this.selected.libelle === 'ACHAT DEVISE') {
        this.selectedCaisse.code = '18';
      } else if (this.selected.libelle === 'VERSEMENT ESPECE') {
        this.selectedCaisse.code = '20';
      } else if (this.selected.libelle === 'COMPENSATION') {
        this.selectedCaisse.code = '60';
      } else if (this.selected.libelle === 'FACTURE COMPTANT') {
        this.selectedCaisse.code = '91';
      } else if (this.selected.libelle === 'FACTURE INSTANCE') {
        this.selectedCaisse.code = '92';
      } else if (this.selected.libelle === 'INTERET DE RETARD') {
        this.selectedCaisse.code = '93';
      } else if (this.selected.libelle === 'ANNULATION DE TITRE') {
        this.selectedCaisse.code = 'BB';
      }*/

      this.allowSelection = false;
      this.champDisabled = false;
      this.ajouterClicked = false;
      this.modifierClicked = true;
      this.modifierDisabled = true;
      this.supprimerDisabled = true;
      this.ajouterDisabled = true;
      this.validershow = true;
      this.afficherShow = false;
      setTimeout(() => this.ngSelectLibelle.focus(), 1);
    }
  }
  async supprimer(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.selected.apurement != null) {
      this.msgs = 'Mouvement Appuré - Suppression pas Possible !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btSupprimer'));
      this.allowSelection = true;
    } else {
      await this.supprimerDepense();
      await this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          'SP ' +
            Number(this.selectedCaisse.montant).toFixed(3) +
            ' ' +
            this.selected.libelle +
            ' ' +
            this.selectedCaisse.date
        )
        .toPromise()
        .then((data) => {
          console.log(data);
        });
      // this.messageService.add({ severity: 'success', summary: 'Confirmation', detail: 'Ligne supprimée' });
      this.modifierDisabled = true;
      this.supprimerDisabled = true;
    }
  }
  async supprimerDepense() {
    await this.caisseService
      .deleteCaisse(this.selectedCaisse.id)
      .toPromise()
      .then(
        (data) => {},
        (error) => console.log('There was an error: ', error)
      );
    await this.reloadCaissesSecondaire();
  }

  fermer(ind: number): void {
    if (this.ajouterClicked) {
      this.modifierDisabled = true;
      this.supprimerDisabled = true;
    } else {
      if (ind === 0) {
        this.modifierDisabled = false;
        this.supprimerDisabled = false;
      } else {
        this.modifierDisabled = true;
        this.supprimerDisabled = true;
      }
    }
    this.allowSelection = true;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.ajouterDisabled = false;
    this.selectedCode = null;
  }

  rowSelected(args: RowSelectEventArgs) {
    if (this.grid.getSelectedRecords().length > 0) {
      this.modifierDisabled = false;
      this.supprimerDisabled = false;
      this.selected = this.grid.getSelectedRecords()[0];
      this.selectedCaisse.id = this.selected.id;
      this.selectedCaisse.date = this.selected.date;
      this.selectedCaisse.montant = this.selected.montant;
      this.selectedCaisse.mode = this.selected.mode;
      this.selectedClient = this.deno;
      this.selectedCaisse.operateur = this.selected.client;
      this.selectedCaisse.ech = this.selected.echeance;
      this.selectedCaisse.tire = this.selected.tire;
      this.selectedCaisse.banque = this.selected.banque;
      this.selectedCaisse.cheque = this.selected.cheque;
      this.selectedCaisse.facture = this.selected.facture;
      this.selectedCaisse.sens = this.selected.sens;
      this.selectedCaisse.regle = this.selected.regle;
      this.selectedCaisse.observat = this.selected.observation;
      this.selectedCaisse.apurement = this.selected.apurement;
      this.selectedCaisse.dateApur = this.selected.dateApur;
      this.selectedCaisse.datVer = this.selected.datVer;
      this.selectedCaisse.datRec = this.selected.datRec;
      this.selectedCaisse.etat = this.selected.etat;
      this.selectedCaisse.etat2 = this.selected.etat2;
      this.selectedCaisse.banqEqm = this.selected.banqEqm;
      this.selectedCaisse.combine = this.selected.combine;
      this.selectedCaisse.borVer = this.selected.borVer;
      this.selectedCaisse.borEnc = this.selected.borEnc;
      this.selectedCaisse.borRtr = this.selected.borRtr;
      this.selectedCaisse.numPiece = this.selected.numPiece;
    }
  }

  onselect(event) {
    this.selectedCaisse.date = this.datePipe.transform(
      this.selectedCaisse.date,
      'dd/MM/yyyy'
    );
  }

  onselectEch(event: string) {
    this.selectedCaisse.ech = this.datePipe.transform(
      this.selectedCaisse.ech,
      'dd/MM/yyyy'
    );
  }

  onselectTo(event: string) {
    this.to = this.datePipe.transform(this.to, 'dd/MM/yyyy');
  }
  annulerSelection(): void {
    if (!this.ajouterClicked) {
      if (this.grid.getSelectedRowIndexes()[0] >= 0) {
        this.modifierDisabled = true;
        this.supprimerDisabled = true;
        this.grid.selectRows([]);
      }
    }
  }
  async applyFilterCltParDeno(filterValue: string) {
    await this.clientService
      .getClientsTop100ByDenoStartsWith(filterValue)
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }
  nouvelleSaisie() {
    this.fermer(1);
    this.afficherClicked = false;
    this.afficherShow = true;
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async updateDBFromRecettes() {
    let recettes = [];
    await this.recettesService
      .getRecettesForCs()
      .toPromise()
      .then((data) => {
        recettes = data['_embedded'].recettes;
      });
      this.blockDocument = true;
    for await (let rec of recettes) {
      let caisse1: Caisse = null;
      let date = null;
      let sens1 = '';

      if (String(rec.date) !== 'null' || String(rec.date) !== '') {
        date = rec.date;
      }
      if (String(rec.sens) === 'C') {
        sens1 = 'E';
      } else {
        sens1 = 'S';
      }

      caisse1 = {
        id: null,
        code: '01',
        date: date,
        mode: 'ESPECE',
        cheque: null,
        banque: null,
        facture: String(rec.combine).substr(9, 5),
        sens: sens1,
        montant: String(rec.net),
        ech: null,
        observat: null,
        datVer: null,
        datRec: null,
        etat: null,
        etat2: null,
        banqEqm: null,
        borVer: null,
        borEnc: null,
        tire: null,
        combine: null,
        operateur: String(rec.operateur),
        regle: null,
        apurement: null,
        dateApur: null,
        borRtr: null,
        numPiece: null,
      };
      await this.caisseService.createCaisse(caisse1).toPromise().then(() => {});
      let sens2 = '';
      let mode = '';
      if (String(rec.sens) === 'C') {
        mode = 'FACTURE';
        sens2 = 'D';
      } else {
        mode = 'AVOIR';
        sens2 = 'C';
      }
      let caisse2: Caisse = null;
      caisse2 = {
        id: null,
        code: '91',
        date: date,
        mode: mode,
        cheque: null,
        banque: null,
        facture: String(rec.combine).substr(9, 5),
        sens: sens2,
        montant: String(rec.net),
        ech: null,
        observat: null,
        datVer: null,
        datRec: null,
        etat: null,
        etat2: null,
        banqEqm: null,
        borVer: null,
        borEnc: null,
        tire: null,
        combine: String(rec.combine),
        operateur: String(rec.operateur),
        regle: null,
        apurement: null,
        dateApur: null,
        borRtr: null,
        numPiece: null,
      };
      await this.caisseService.createCaisse(caisse2).toPromise().then(() => {});
      rec.caisse = 'O';
      rec = rec;
      await this.recettesService.updateRecettes(rec).toPromise().then(() => {});
    }
    this.blockDocument = false;
  }
  formatMontant() {
    if (String(Number(this.selectedCaisse.montant)) !== 'NaN') {
    this.selectedCaisse.montant = Number(this.selectedCaisse.montant).toFixed(3);
  } else {
    this.selectedCaisse.montant = '';
  }
  }
  public onSearchLibelle(word: string, item: any): boolean {
    return item.label.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchMode(word: string, item: any): boolean {
    return item.label.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  moveToNextInput(e, index: number) {
    console.log(index);

    if (index === 0) {
      if (this.selectedCaisse.code !== '' && this.selectedCaisse.code !== null) {
        setTimeout(() => this.inputMaskDateEnreg.focus(), 1);
      }
    }
    if (index === 1) {
      let date = 0;
      const parts = this.selectedCaisse.date.split('/');
      date = Date.parse(parts[1] + '/' + parts[0] + '/' + parts[2]);
      console.log(parts[1] + '/' + parts[0] + '/' + parts[2]);
      if (isNaN(date)) {
        this.msgs = 'Date Incorrecte !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('dateEnreg').focus();
        this.ov.show(e, document.getElementById('dateEnreg'));
        this.selectedCaisse.date = '';
      } else {
        if (new Date(date) < this.minDate || new Date(date) > this.maxDate) {
          this.msgs = 'Date Incorrecte !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('dateEnreg').focus();
          this.ov.show(e, document.getElementById('dateEnreg'));
          this.selectedCaisse.date = '';
        } else {
          document.getElementById('montant').focus();
        }
      }
    }
    if (index === 2) {
      if (
        this.selectedCaisse.montant !== '' &&
        this.selectedCaisse.montant !== null
      ) {
        this.formatMontant();
        if (this.selectedCaisse.montant !== '0.000') {
          setTimeout(() => this.ngSelectMode.focus(), 1);
        }
      }
    }
    if (index === 3) {
      document.getElementById('observation').focus();
    }
    if (index === 4) {
      if (
        this.selectedCaisse.mode === 'CHEQUE'
      ) {
        document.getElementById('titre').focus();
      } else {
        // setTimeout(() => this.ngSelectClient.focus(), 1);
        setTimeout(() => document.getElementById('btValider').focus(), 1);
      }
    }
    if (index === 5) {
      if (
        this.selectedCaisse.cheque !== '' &&
        this.selectedCaisse.cheque !== null
      ) {
        document.getElementById('banque').focus();
      }
    }
    if (index === 6) {
      if (
        this.selectedCaisse.banque !== '' &&
        this.selectedCaisse.banque !== null
      ) {
        setTimeout(() => this.inputMaskEcheance.focus(), 1);
      }
    }
    if (index === 7) {
      let echeance = 0;
      const parts = this.selectedCaisse.ech.split('/');
      echeance = Date.parse(parts[1] + '/' + parts[0] + '/' + parts[2]);
      console.log(parts[1] + '/' + parts[0] + '/' + parts[2]);
      if (isNaN(echeance)) {
        this.msgs = 'Date Incorrecte !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('echeance').focus();
        this.ov.show(e, document.getElementById('echeance'));
        this.selectedCaisse.ech = '';
      } else {
        if (new Date(echeance) < this.minDate) {
          this.msgs = 'Date Incorrecte !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('echeance').focus();
          this.ov.show(e, document.getElementById('echeance'));
          this.selectedCaisse.ech = '';
        } else {
          setTimeout(() => document.getElementById('btValider').focus(), 1);
        }
      }
    }
    if (index === 8) {
      document.getElementById('btValider').focus();
    }
    if (index === 9) {
      if (this.selectedCaisse.mode !== '' && this.selectedCaisse.mode !== null) {
        setTimeout(() => document.getElementById('facture').focus(), 1);
      }
    }
  }
}
