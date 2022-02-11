import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {
  GridComponent,
  ToolbarItems,
  SearchSettingsModel,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { SecteurService } from '../services/secteur.service';
import { ZoneService } from '../services/zone.service';
import { RecouvService } from '../services/recouv.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { RepresanService } from '../services/represan.service';
import { GroupeService } from '../services/groupe.service';
import { Secteur } from '../services/secteur';
import { Recouv } from '../services/recouv';
import { Zone } from '../services/zone';
import { Represan } from '../services/represan';
import { Vendeur1 } from '../services/vendeur1';
import { Groupe } from '../services/groupe';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';

import { LoginService } from 'src/app/login/login.service';
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
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  providers: [ToolbarService],
})
export class ClientComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  public searchOptions: SearchSettingsModel;
  selectedIndex = null;
  ajouterDisable = false;
  modifierSupprimerDisable = true;
  validerAnnulerDisable = true;
  ajouterClicked = false;
  modifierClicked = false;
  supprimerClicked = false;
  disableModifRemise = true;
  client: Client;
  clients: Client[] = [];
  selectedClient: Client;
  secteurs;
  selectedSecteur: Secteur;
  zones;
  selectedZone: Zone;
  recouvs;
  selectedRecouv: Recouv;
  vendeurs;
  selectedVendeur: Vendeur1;
  represans;
  selectedRepresan: Represan;
  groupes;
  selectedGroupe: Groupe;
  rechCode = '';
  rechDeno = '';
  index = 0;
  revCons = [
    { label: '', value: null },
    { label: 'R', value: 'R' },
    { label: 'C', value: 'C' },
  ];
  assujets = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  ligFact = [
    { label: '', value: null },
    { label: 'D', value: 'D' },
    { label: 'R', value: 'R' },
  ];
  factBc = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  block = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  calculInd = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  blocable = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  termeOn = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  clientOrd = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  timbreOn = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  bcExigeOn = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  exonoreOn = [
    { label: '', value: null },
    { label: 'O', value: 'O' },
    { label: 'N', value: 'N' },
  ];
  pieces = [
    { label: '', value: '' },
    { label: 'TRAITE', value: 'TRAITE' },
    { label: 'CHEQUE', value: 'CHEQUE' },
    { label: 'VIREMENT', value: 'VIREMENT' },
  ];
  fieldDisable = true;
  clickedMenuAuthAjout = false;
  clickedMenuAuthModif = false;
  selectedMenu = 'Consultation Client';
  ancienRemise = null;
  // finalMessages = [];
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
    // this.finalMessages = [];
  }
  constructor(
    private clientService: ClientService,
    private secteurService: SecteurService,
    private zoneService: ZoneService,
    private recouvService: RecouvService,
    private vendeur1Service: Vendeur1Service,
    private represanService: RepresanService,
    private groupeService: GroupeService,
    private loginService: LoginService
  ) {
    // this.reloadDataClients();
    this.viderSelectedClient();

    if (globals.selectedMenu === 'Modif Remise Client') {
      this.index = 1;
      this.clickedMenuAuthAjout = false;
      this.clickedMenuAuthModif = true;
      this.disableModifRemise = false;
    }
  }
  async ngOnInit() {
    await this.reloadDatas();
    await this.clientService
      .getClientsListOrdByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
    if (globals.selectedMenu === 'Consultation Client') {
      this.clickedMenuAuthAjout = false;
      this.clickedMenuAuthModif = false;
    }
    if (globals.selectedMenu === 'Ajout Nouveau Client') {
      this.clickedMenuAuthAjout = true;
      this.clickedMenuAuthModif = false;
    }
    if (globals.selectedMenu === 'Modification Client') {
      console.log('modif');

      this.clickedMenuAuthAjout = false;
      this.clickedMenuAuthModif = true;
    }

    console.log(globals.selectedMenu);
    console.log(this.disableModifRemise);
  }
  pageRefresh() {
    location.reload();
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
    this.selectedSecteur = { id: '', code: '', deno: '' };
    this.selectedZone = { id: '', code: '', deno: '' };
    this.selectedRecouv = { id: '', code: '', deno: '', codeUtil: '' };
    this.selectedVendeur = { id: '', code: '', deno: '' };
    this.selectedRepresan = {
      id: '',
      code: '',
      deno: '',
      codeUtil: '',
      objectif: '',
    };
    this.selectedGroupe = { id: '', code: '', deno: '' };
  }

  /*async reloadDataClients() {
    await this.clientService
      .getClientsList()
      .toPromise()
      .then((data) => {
        const clientsTemp = data["_embedded"].clients;
        this.clients = clientsTemp;
      })
      .catch((data) => {
        console.log("error reload data clients");
      })
      .finally(() => {
        this.grid.refresh();
      });
  }*/
  /*
  async applyFilterClientParCode() {
    await this.clientService
      .getClientListByCode(this.rechCode)
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }

  async applyFilterClientParDeno() {
    await this.clientService
      .getClientsTop100ByDenoStartsWith(this.rechDeno)
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }
  */
  applyFilterClientParCode() {
    this.searchOptions = {
      fields: ['code'],
      operator: 'startswith',
      key: this.rechCode,
      ignoreCase: true,
    };
    const tmp = this.clients;
    const sortedArray: any[] = tmp.sort((clt1, clt2) => {
      if (clt1.code > clt2.code) {
        return 1;
      }

      if (clt1.code < clt2.code) {
        return -1;
      }

      return 0;
    });
    this.clients = sortedArray;
  }
  applyFilterClientParDeno() {
    this.searchOptions = {
      fields: ['deno'],
      operator: 'startswith',
      key: this.rechDeno,
      ignoreCase: true,
    };
    const tmp = this.clients;
    const sortedArray: any[] = tmp.sort((clt1, clt2) => {
      if (clt1.deno > clt2.deno) {
        return 1;
      }

      if (clt1.deno < clt2.deno) {
        return -1;
      }

      return 0;
    });
    this.clients = sortedArray;
  }
  updateData() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.ajouterDisable = true;
      this.modifierSupprimerDisable = false;

      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedClient = selected;
      this.selectedRecouv = this.recouvs.find(function (element) {
        return element.code === selected.rec;
      });
      this.selectedVendeur = this.vendeurs.find(function (element) {
        return element.code === selected.vend;
      });
      this.selectedSecteur = this.secteurs.find(function (element) {
        return element.code === selected.secteur;
      });
      this.selectedZone = this.zones.find(function (element) {
        return element.code === selected.zone;
      });
      this.selectedRepresan = this.represans.find(function (element) {
        return element.code === selected.represant;
      });
      this.selectedGroupe = this.groupes.find(function (element) {
        return element.code === selected.codGroupe;
      });
    }
  }

  async reloadDatas() {
    await this.secteurService
      .getSecteursList()
      .toPromise()
      .then((data) => {
        this.secteurs = data['_embedded'].secteurs;
        this.secteurs.unshift({ id: '', code: null, deno: '' });
      });
    await this.zoneService
      .getZonesList()
      .toPromise()
      .then((data) => {
        this.zones = data['_embedded'].zones;
        this.zones.unshift({ id: '', code: null, deno: '' });
      });
    await this.recouvService
      .getRecouvsList()
      .toPromise()
      .then((data) => {
        this.recouvs = data['_embedded'].recouvs;
        this.recouvs.unshift({ id: '', code: null, deno: '' });
      });
    await this.vendeur1Service
      .getVendeur1sList()
      .toPromise()
      .then((data) => {
        this.vendeurs = data['_embedded'].vendeur1;
        this.vendeurs.unshift({ id: '', code: null, deno: '' });
      });
    await this.represanService
      .getRepresansList()
      .toPromise()
      .then((data) => {
        this.represans = data['_embedded'].represans;
        this.represans.unshift({ id: '', code: null, deno: '' });
      });
    await this.groupeService
      .getGroupesList()
      .toPromise()
      .then((data) => {
        this.groupes = data['_embedded'].groupes;
        this.groupes.unshift({ id: '', code: null, deno: '' });
      });
  }
  ajouter() {
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
      cadnat: 'N',
      compte: null,
      edition: 'D',
      exonor: 'N',
      duree: 'N',
      reg: null,
      terme: 'O',
      marque: null,
      plafond: '0',
      zone: null,
      comm: 'N',
      assujet: 'N',
      codeTva: null,
      timbre: 'O',
      ech: '45',
      bloc: 'O',
      datBlc: null,
      typeC: 'O',
      regle: null,
      lettre: null,
      codeC: null,
      autor: null,
      eMail: null,
      typeComm: 'C',
      rec: null,
      vend: null,
      represant: null,
      secteur: '',
      objectif: null,
      nature: null,
      datCreat: new Date().toLocaleDateString('en-GB'),
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
      bcExige: 'N',
    };
    this.selectedSecteur = { id: '', code: '', deno: '' };
    this.selectedZone = { id: '', code: '', deno: '' };
    this.selectedRecouv = { id: '', code: '', deno: '', codeUtil: '' };
    this.selectedVendeur = { id: '', code: '', deno: '' };
    this.selectedRepresan = {
      id: '',
      code: '',
      deno: '',
      codeUtil: '',
      objectif: '',
    };
    this.selectedGroupe = { id: '', code: '', deno: '' };
    this.ajouterDisable = true;
    this.modifierSupprimerDisable = true;
    this.validerAnnulerDisable = false;
    this.ajouterClicked = true;
    this.modifierClicked = false;
    this.supprimerClicked = false;
    this.fieldDisable = false;
  }
  modifier() {
    this.fieldDisable = false;
    if (globals.selectedMenu === 'Modif Remise Client') {
      this.index = 1;
      this.disableModifRemise = false;
      this.fieldDisable = true;
      window.setTimeout(function () {
        document.getElementById('remiseClt').focus();
      }, 0);
    }

    this.ajouterDisable = true;
    this.modifierSupprimerDisable = true;
    this.validerAnnulerDisable = false;
    this.ajouterClicked = false;
    this.modifierClicked = true;
    this.supprimerClicked = false;
    this.ancienRemise = this.selectedClient.marque;
  }
  supprimer() {
    this.ajouterDisable = true;
    this.modifierSupprimerDisable = true;
    this.validerAnnulerDisable = false;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.supprimerClicked = true;
  }
  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    // this.finalMessages = [];
    if (this.ajouterClicked) {
      if (this.tester(e)) {
        await this.clientService
          .createClient(this.selectedClient)
          .toPromise()
          .then((dataa) => {
            console.log('clientCreateSuccess');
            /*
            this.finalMessages = [];
            this.finalMessages.push({
              severity: 'success',
              summary: '',
              detail: 'Client a été ajouté avec succès',
            });*/
          })
          .catch((data) => {
            console.log('error client Create');
            this.msgs = 'Erreur de creation du client !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('btValider'));
          })
          .finally(() => {
            this.grid.refresh();
          });
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            this.selectedClient.code
          )
          .toPromise()
          .then((data) => {
            console.log(data);
          });
        this.modifierSupprimerDisable = false;
        this.ajouterDisable = false;
        this.fieldDisable = true;
        this.validerAnnulerDisable = true;
        // this.reloadDataClients();
        this.applyFilterClientParDeno();
        this.annuler();
      }
    }
    if (this.modifierClicked) {
      if (globals.selectedMenu === 'Modif Remise Client') {
        if (Number(this.selectedClient.marque) > 30  ) {
        //  this.index = 2;
          this.msgs = 'Veuillez verifier la remise , valeur max est  30  !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('remiseClt').focus();
          this.ov.show(e, document.getElementById('remiseClt'));
        } else {
          if (Number(this.selectedClient.marque) !== Number(this.ancienRemise)) {
            this.selectedClient.marque = Number(this.selectedClient.marque).toFixed(2);
            await this.clientService
            .updateClient(this.selectedClient)
            .toPromise()
            .then((data) => {
              console.log('clientUpdateSuccess');
            });
           await this.loginService
            .procedureStockeModule(
             localStorage.getItem('login'),
             globals.selectedMenu,
            this.selectedClient.code + ' ANC REM ' + this.ancienRemise + ' NV REM ' + this.selectedClient.marque
          )
            .toPromise().then((data) => {
             console.log(data);
             });
           this.annuler();

        } else {
          this.annuler();
        }
      }
      } else {
      if (this.tester(e)) {
        this.selectedClient.secteur = this.selectedSecteur.code;
        this.selectedClient.zone = this.selectedZone.code;
        this.selectedClient.rec = this.selectedRecouv.code;
        this.selectedClient.vend = this.selectedVendeur.code;
        this.selectedClient.represant = this.selectedRepresan.code;
        this.selectedClient.codGroupe = this.selectedGroupe.code;
        await this.clientService
          .updateClient(this.selectedClient)
          .toPromise()
          .then((data) => {
            console.log('clientUpdateSuccess');
            this.loginService
              .procedureStockeModule(
                localStorage.getItem('login'),
                globals.selectedMenu,
                'MODIF ' + this.selectedClient.code
              )
              .subscribe((s) => {
                console.log(data);
              });
            this.modifierSupprimerDisable = false;
            this.ajouterDisable = false;
            this.fieldDisable = true;
            this.validerAnnulerDisable = true;
            // this.reloadDataClients();
            this.applyFilterClientParDeno();
            this.annuler();
          })
          .catch((data) => {
            console.log('error client update');
          })
          .finally(() => {
            this.grid.refresh();
          });
        if (Number(this.selectedClient.marque) === Number(this.ancienRemise)) {
          await this.loginService
            .procedureStockeModule(
              localStorage.getItem('login'),
              globals.selectedMenu,
              this.selectedClient.code
            )
            .toPromise()
            .then((data) => {
              console.log(data);
            });
        } else {
          await this.loginService
            .procedureStockeModule(
              localStorage.getItem('login'),
              globals.selectedMenu,
              this.selectedClient.code +
                ' ANC REM ' +
                this.ancienRemise +
                ' NV REM ' +
                this.selectedClient.marque
            )
            .toPromise()
            .then((data) => {
              console.log(data);
            });
        }
      }
    }
    }

    /*if (this.supprimerClicked) {
      await this.clientService
        .deleteClient(this.selectedClient)
        .toPromise()
        .then((data) => {
          console.log('clientDeleteSuccess');
          this.loginService
            .procedureStockeModule(
              localStorage.getItem('login'),
              globals.selectedMenu,
              'SUPP ' + this.selectedClient.code
            )
            .subscribe((data) => {
              console.log(data);
            });
          this.modifierSupprimerDisable = false;
          this.ajouterDisable = false;
          this.fieldDisable = true;
          this.validerAnnulerDisable = true;
          this.applyFilterClientParDeno();
          this.annuler();
        })
        .catch((data) => {
          console.log('error client delete');
        })
        .finally(() => {
          this.grid.refresh();
        });
    }*/
  }
  annuler() {
    this.selectedIndex = null;
    this.viderSelectedClient();
    // console.log(this.grid.getSelectedRowIndexes()[0]);
    this.annulerSelectionClient();
    this.ajouterDisable = false;
    this.modifierSupprimerDisable = true;
    this.validerAnnulerDisable = true;
    this.fieldDisable = true;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.supprimerClicked = false;
    this.index = 0;
    this.ancienRemise = null;

    if (globals.selectedMenu === 'Modif Remise Client') {
      this.index = 1;
      this.disableModifRemise = false;
      this.fieldDisable = true;
      /* window.setTimeout(function () {
        document.getElementById('remiseClt').focus();
    }, 0);*/
    }
  }
  tester(e) {
    console.log(this.index);
    let ret = true;
    if (
      this.selectedClient.code === '' ||
      String(this.selectedClient.code) === 'null'
    ) {
      this.index = 0;
      this.msgs = 'Veuillez saisir un code !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('codeClt').focus();
      this.ov.show(e, document.getElementById('codeClt'));
      ret = false;
      return;
    }
    if (this.ajouterClicked) {
      if (this.clients.some((res) => res.code === this.selectedClient.code)) {
        this.index = 0;
        this.msgs = 'Le code client saisi existe !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('codeClt').focus();
        this.ov.show(e, document.getElementById('codeClt'));
        ret = false;
        return;
      }
    }
    if (this.selectedClient.deno === '' || this.selectedClient.deno === null) {
      this.index = 0;
      this.msgs = 'Veuillez saisir un nom !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('denoClt').focus();
      this.ov.show(e, document.getElementById('denoClt'));
      ret = false;
      return;
    }
    if (
      this.selectedClient.adresse === '' ||
      this.selectedClient.adresse === null
    ) {
      this.index = 0;
      this.msgs = 'Veuillez saisir une adresse !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('adresse').focus();
      this.ov.show(e, document.getElementById('adresse'));
      ret = false;
      return;
    }
    if (
      this.selectedClient.ville === '' ||
      this.selectedClient.ville === null
    ) {
      this.index = 0;
      this.msgs = 'Veuillez saisir une ville !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('ville').focus();
      this.ov.show(e, document.getElementById('ville'));
      ret = false;
      return;
    }
    if (this.selectedClient.tel === '' || this.selectedClient.tel === null) {
      this.index = 0;
      this.msgs = 'Veuillez saisir au moins un numéro de téléphone !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('tel').focus();
      this.ov.show(e, document.getElementById('tel'));
      ret = false;
      return;
    }
    if (
      this.selectedClient.secteur === '' ||
      this.selectedClient.secteur === null
    ) {
      this.index = 0;
      this.msgs = 'Veuillez selectionner une activité !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('secteur').focus();
      this.ov.show(e, document.getElementById('secteur'));
      ret = false;
      return;
    }
    if (
      this.selectedClient.respon === '' ||
      this.selectedClient.respon === null
    ) {
      this.index = 0;
      this.msgs = 'Veuillez saisir un responsable !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('responsable1').focus();
      this.ov.show(e, document.getElementById('responsable1'));
      ret = false;
      return;
    }
    if (this.selectedClient.gsm1 === '' || this.selectedClient.gsm1 === null) {
      this.index = 0;
      this.msgs = 'Veuillez saisir au moins un numero gsm !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('gsm1').focus();
      this.ov.show(e, document.getElementById('gsm1'));
      ret = false;
      return;
    }
    if (this.selectedClient.rec === '' || this.selectedClient.rec === null) {
      this.index = 1;
      this.msgs = 'Veuillez selectionner un recouvreur !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('recouvreur').focus();
      this.ov.show(e, document.getElementById('recouvreur'));
      ret = false;
      return;
    }
    if (this.selectedClient.vend === '' || this.selectedClient.vend === null) {
      this.index = 1;
      this.msgs = 'Veuillez selectionner un vendeur !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('vendeur').focus();
      this.ov.show(e, document.getElementById('vendeur'));
      ret = false;
      return;
    }
    if (
      this.selectedClient.codeTva === '' ||
      this.selectedClient.codeTva === null
    ) {
      this.index = 2;
      this.msgs = 'Veuillez saisir un code TVA !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('codeTva').focus();
      this.ov.show(e, document.getElementById('codeTva'));
      ret = false;
      return;
    }
    if (this.selectedClient.reg === '' || this.selectedClient.reg === null) {
      this.index = 2;
      this.msgs = 'Veuillez selectionner un mode de reglement !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('reg').focus();
      this.ov.show(e, document.getElementById('reg'));
      ret = false;
      return;
    }
    if (
      this.selectedClient.modeReg === '' ||
      this.selectedClient.modeReg === null
    ) {
      this.index = 2;
      this.msgs = 'Veuillez saisir un duree de reglement !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('dureeReg').focus();
      this.ov.show(e, document.getElementById('dureeReg'));
      ret = false;
      return;
    }
    console.log(ret);
    return ret;
  }
  updateOnSelect(ind: number) {
    window.setTimeout(function () {
      if (
        document.getElementById('remiseClt') !== null &&
        document.getElementById('remiseClt') !== undefined
      ) {
        document.getElementById('remiseClt').focus();
      }
    }, 0);
    switch (ind) {
      case 1: {
        this.selectedClient.secteur = this.selectedSecteur.code;
        break;
      }
      case 2: {
        this.selectedClient.zone = this.selectedZone.code;
        break;
      }
      case 3: {
        this.selectedClient.rec = this.selectedRecouv.code;
        break;
      }
      case 4: {
        this.selectedClient.vend = this.selectedVendeur.code;
        break;
      }
      case 5: {
        this.selectedClient.represant = this.selectedRepresan.code;
        break;
      }
      case 6: {
        this.selectedClient.codGroupe = this.selectedGroupe.code;
        break;
      }
      default: {
        console.log('Invalid choice');
        break;
      }
    }
  }
  annulerSelectionClient(): void {
    if (!this.ajouterClicked) {
      if (this.grid.getSelectedRowIndexes()[0] >= 0) {
        this.ajouterDisable = false;
        this.modifierSupprimerDisable = true;
        this.viderSelectedClient();
        this.grid.selectRows([]);
      }
    }
  }
  handleChange(e) {
    this.index = e.index;
  }
  public dataBound(args): void {
    if (this.clients.length > 0) {
      this.grid.selectRows([0]);
    }
  }
}
