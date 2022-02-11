import {
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Brou } from '../services/brou';
import { BrouService } from '../services/brou.service';
import { ClientService } from '../services/client.service';
import { ConfirmationService } from 'primeng/api';
import { ClientContService } from '../services/clientCont.service';
import { BrouContService } from '../services/brouCont.service';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Client } from '../services/client';
import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-appurement-reglement',
  templateUrl: './appurement-reglement.component.html',
  styleUrls: ['./appurement-reglement.component.scss'],
  providers: [ConfirmationService],
})
export class AppurementReglementComponent implements OnInit {
  public mode: string;
  hiddenNouSais = false;
  selectedrowindex: any;
  selectedrecordsD: any;
  selectedrecordsC: any;
  ngselectDisabled = false;
  clients = [];
  seleteddata;
  sommeDebit = 0;
  sommeCredit = 0;
  maxApp;
  maxAppPlus1 = null;
  montantDebit;
  montantCredit;
  brouDebit = [];
  brouCredit = [];
  aficherClient = true;
  @Input() selectedClient = null;
  selectedBrou;
  @Input() sensDebit = 'D';
  @Input() sensCredit = 'C';
  validerShow = false;
  afficherShow = true;
  saisieCardShow = false;
  saisieCardShow1 = false;
  selectedDid = [];
  selectedCid = [];
  cols: any;
  selectedDebit: Brou;
  selectedCredit: Brou;
  titre: string;
  var: number;
  codeClient = '';
  fromOutside = false;
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
    private confirmationService: ConfirmationService,
    private brouService: BrouService,
    private brouContService: BrouContService,
    private clientService: ClientService,
    private clientContService: ClientContService,
    private loginService: LoginService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = '';
    this.config.clearAllText = 'Supprimer tous';
  }

  async ngOnInit() {
    // module Apurement Reg Client
    if (globals.selectedMenu === 'Apurement Reg Client') {
      this.titre = 'APPUREMENT REGLEMENT CLIENT';
      await this.clientService
        .getClientsTermeListByOrderByDeno()
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clients;
        });
      this.var = 1;
      // module Apurement Reg Client contenxieux
    } else if (
      globals.selectedMenu === 'Apurement Reg Clts Cont'
    ) {
      this.titre = 'APPUREMENT REGLEMENT CLIENT CONTENTIEUX';
      await this.clientContService
        .getClientContList()
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clientsCont;
        });
      this.var = 2;
    }
  }
  /*
  reloadDataClient() {
    this.clientService.getClientsList().subscribe(data => {
      this.clients = data['_embedded'].clients;
    });
  }
  reloadDataClientCont() {
    this.clientContService.getClientContList().subscribe(data => {
      this.clients = data['_embedded'].clientsCont;
    });
  }
*/

  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    this.validerShow = false;
    this.montantCredit = 0;
    this.montantDebit = 0;
    this.sommeCredit = 0;
    this.sommeDebit = 0;
    this.selectedDid = [];
    this.selectedCid = [];
    if (this.var === 1) {
      await this.brouService
        .getMaxAppurement()
        .toPromise()
        .then((value) => {
          this.maxApp = value;
        });
      this.maxAppPlus1 = null;
      await this.brouService
        .mouvement(this.selectedClient.code, this.sensDebit)
        .toPromise()
        .then((data) => {
          this.brouDebit = data['_embedded'].brous;
        });
      await this.brouService
        .mouvement(this.selectedClient.code, this.sensCredit)
        .toPromise()
        .then((dataa) => {
          this.brouCredit = dataa['_embedded'].brous;
        });

      if (this.brouCredit.length === 0 && this.brouDebit.length === 0) {
        this.msgs = 'Pas de mouvement de debit et de credit pour ce Client !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('client').focus();
        this.ov.show(e, document.getElementById('client'));
      } else {
        this.saisieCardShow = true;
        this.saisieCardShow1 = true;
        this.ngselectDisabled = true;
        this.afficherShow = false;
      }
    }
    if (this.var === 2) {
      await this.brouContService
        .getMaxAppurement()
        .toPromise()
        .then((value) => {
          this.maxApp = value;
        });

      this.maxAppPlus1 = null;

      await this.brouContService
        .mouvement(this.selectedClient.code, this.sensDebit)
        .toPromise()
        .then((data) => {
          this.brouDebit = data['_embedded'].brouCont;
        });

      await this.brouContService
        .mouvement(this.selectedClient.code, this.sensCredit)
        .toPromise()
        .then((dataa) => {
          this.brouCredit = dataa['_embedded'].brouCont;
        });

      if (this.brouCredit.length === 0 && this.brouDebit.length === 0) {
        this.msgs = 'Pas de mouvement de debit et de credit pour ce Client !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('client').focus();
        this.ov.show(e, document.getElementById('client'));
      } else {
        this.saisieCardShow = true;
        this.saisieCardShow1 = true;
        this.ngselectDisabled = true;
        this.afficherShow = false;
      }
    }
  }
  async onConfirm() {
    console.log(this.selectedDid);
    if (this.var === 1) {
      this.selectedDid.forEach(async (id) => {
        await this.brouService
          .updateApp(Number(this.maxAppPlus1).toFixed(0), id)
          .toPromise()
          .then();
      });
      this.selectedCid.forEach(async (id) => {
        await this.brouService
          .updateApp(Number(this.maxAppPlus1).toFixed(0), id)
          .toPromise()
          .then();
      });
    }
    if (this.var === 2) {
      this.selectedDid.forEach(async (id) => {
        await this.brouContService
          .updateApp(Number(this.maxAppPlus1).toFixed(0), id)
          .toPromise()
          .then();
      });
      this.selectedCid.forEach(async (id) => {
        await this.brouContService
          .updateApp(Number(this.maxAppPlus1).toFixed(0), id)
          .toPromise()
          .then();
      });
    }
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        'APR ' +
          this.maxAppPlus1 +
          ' CLT ' +
          this.codeClient +
          ' DEB ' +
          this.sommeDebit +
          ' CRD ' +
          this.sommeCredit
      )
      .toPromise().then((data) => {
        console.log(data);
      });
    if (!this.fromOutside) {
      this.ngselectDisabled = false;
      this.afficherShow = true;
      this.validerShow = false;
      this.saisieCardShow = false;
      this.saisieCardShow1 = false;
      this.selectedClient = null;
      this.brouDebit = [];
      this.brouCredit = [];
      this.codeClient = '';
    } else {
      await this.afficher('');
    }
  }

  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    if (
      this.sommeDebit === this.sommeCredit ||
      Math.abs(this.sommeCredit - this.sommeDebit) <= 1 ||
      localStorage.getItem('login').toUpperCase() === 'MESSAOUDI'
    ) {
      this.maxAppPlus1 = +this.maxApp + 1;
      /*
      this.confirmationService.confirm({
        message: 'Voulez Vous Valider l\'appurement ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        accept: async () => {
          await this.onConfirm();
        },
      });*/
      await this.onConfirm();
    } else {
      this.msgs = 'Les sommes des montants selectionnés sont differents !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btValider'));
    }
  }

  nouveau(): void {
    /*if (this.var === 1) {
      this.reloadDataClient();
    }
    if (this.var === 2) {
       this.reloadDataClientCont(); }*/
    this.selectedDebit = null;
    this.selectedCredit = null;
    this.brouDebit = [];
    this.brouCredit = [];

    this.selectedClient = null;
    this.saisieCardShow = false;
    this.saisieCardShow1 = false;
    this.ngselectDisabled = false;
    this.afficherShow = true;
    this.codeClient = '';
  }

  onRowSelectD(event) {
    this.validerShow = true;
    this.montantDebit = event.data.montant;
    this.sommeDebit = +(
      Number(this.montantDebit) + Number(this.sommeDebit)
    ).toFixed(3);
    this.selectedDid.push(event.data.id);
    // this.selectedDid.forEach(id => {});
  }

  onRowUnselectD(event) {
    this.montantDebit = event.data.montant;
    this.sommeDebit = +(this.sommeDebit - this.montantDebit).toFixed(3);
    if (this.sommeDebit <= 0 && this.sommeCredit <= 0) {
      this.validerShow = false;
    }
    const index = this.selectedDid.indexOf(event.data.id);
    if (index > -1) {
      this.selectedDid.splice(index, 1);
    }
    this.selectedDid.forEach((id) => {});
  }
  onRowSelect(event) {
    this.validerShow = true;

    this.montantCredit = event.data.montant;

    this.sommeCredit = +(
      Number(this.montantCredit) + Number(this.sommeCredit)
    ).toFixed(3);
    this.selectedCid.push(event.data.id);
    this.selectedCid.forEach((id) => {});
  }

  onRowUnselect(event) {
    this.montantCredit = event.data.montant;
    this.sommeCredit = +(this.sommeCredit - this.montantCredit).toFixed(3);
    if (this.sommeCredit <= 0 && this.sommeDebit <= 0) {
      this.validerShow = false;
    }
    const index = this.selectedCid.indexOf(event.data.id);
    if (index > -1) {
      this.selectedCid.splice(index, 1);
    }
    this.selectedCid.forEach((id) => {});
  }
  async applyFilterClientParCode(e) {
    let filteredElements = [];
    if (this.var === 1) {
      await this.clientService
        .getClientByCode(e.target.value)
        .toPromise()
        .then((data) => {
          filteredElements = data['_embedded'].clients;
        });
    }
    if (this.var === 2) {
      await this.clientContService
        .getClientContByCode(e.target.value)
        .toPromise()
        .then((data) => {
          filteredElements = data['_embedded'].clientsCont;
        });
    }

    if (filteredElements.length > 0) {
      this.selectedClient = filteredElements[0];
      this.afficherShow = true;
    } else {
      this.afficherShow = false;
      this.msgs = 'Code Client Inexistant !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('codeClt').focus();
      this.ov.show(e, document.getElementById('codeClt'));
    }
  }
  intialiserSelectedClient() {
    // console.log('ok');
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
  updateOnSelect() {
    if (this.selectedClient !== null) {
      if (this.selectedClient.id !== null) {
        if (!this.saisieCardShow) {
          this.codeClient = this.selectedClient.code;
          this.afficherShow = true;
        }
      } else {
        this.codeClient = '';
        this.afficherShow = false;
      }
    } else {
      this.codeClient = '';
      this.afficherShow = false;
    }
  }
  async applyFilterClientParDeno(filtredValue: string) {
    if (this.var === 1) {
      await this.clientService
        .getClientsTop100ByDenoStartsWith(filtredValue)
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clients;
        });
    }
    if (this.var === 2) {
      await this.clientContService
        .getClientsContTop100ByDenoStartsWith(filtredValue)
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clientsCont;
        });
    }
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
}
