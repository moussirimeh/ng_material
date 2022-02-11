import { BrouService } from '../services/brou.service';
import { ClientService } from '../services/client.service';
import {
  GridComponent,
  SelectionSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { SelectItem } from 'primeng/api';
import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ClientContService } from '../services/clientCont.service';
import { BrouContService } from '../services/brouCont.service';
import { L10n } from '@syncfusion/ej2-base';
import { setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Client } from '../services/client';
import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';

setCulture('en-US');
L10n.load({
  'en-US': {
    grid: {
      EmptyRecord: [],
    },
  },
});

@Component({
  selector: 'app-consultation-reglement-client',
  templateUrl: './consultation-reglement-client.component.html',
  styleUrls: ['./consultation-reglement-client.component.scss'],
  providers: [DatePipe],
})
export class ConsultationReglementClientComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('gridCredit')
  public gridCredit: GridComponent;
  @ViewChild('gridDebit')
  public gridDebit: GridComponent;

  selectedrowindex: any;
  selectedrecordsD: any;
  selectedrecordsC: any;
  ngselectDisabled = false;
  clients = [];
  brou = [];
  var: number;
  piece: SelectItem[];
  selectedPiece: any = '';
  brouDebit = [];
  brouCredit = [];
  selectedClient = null;
  showBtAfficher = false;
  apurement: string;
  selectedBrou;
  annulerShow = false;
  afficherShow = true;
  saisieCardShow = false;
  saisieCardShow1 = false;
  debut: string;
  fin: string;
  from: any;
  to: any;
  titre: string;
  public selectionOptions: SelectionSettingsModel;

  codeClient = '';

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
    private brouService: BrouService,
    private brouContService: BrouContService,
    private clientService: ClientService,
    private clientContService: ClientContService,
    private loginService: LoginService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = '';
    this.config.clearAllText = 'Supprimer tous';
    this.piece = [
      { label: '', value: '' },
      { label: 'FACTURE', value: 'FACTURE' },
      { label: 'AVOIR', value: 'AVOIR' },
      { label: 'TRAITE', value: 'TRAITE' },
      { label: 'CHEQUE', value: 'CHEQUE' },
      { label: 'IMP/TRT', value: 'IMP/TRT' },
      { label: 'IMP/CHK', value: 'IMP/CHK' },
      { label: 'ESPECE', value: 'ESPECE' },
      { label: 'VIR.BNQ', value: 'VIR.BNQ' },
    ];
  }

  async ngOnInit() {
    this.from = new Date('01/01/' + String(new Date().getFullYear()));
    this.to = new Date();
    if (globals.selectedMenu === 'Consult/annul Apurement') {
      this.titre = 'CONSULTATION REGLEMENT CLIENT';
      await this.clientService
        .getClientsTermeListByOrderByDeno()
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clients;
        });
      this.var = 1;
    } else if (
      globals.selectedMenu === 'Cons/annul Apur Clts Cont'
    ) {
      this.titre = 'CONSULTATION REGLEMENT CLIENT CONTENTIEUX';
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
    this.clientService.getClientsList().subscribe((data) => {
      this.clients = data['_embedded'].clients;
      console.log('DataClient');
    });
  }
  reloadDataClientCont() {
    this.clientContService.getClientContList().subscribe((data) => {
      this.clients = data['_embedded'].clientsCont;
      console.log('DataClientCont');
    });
  }
*/
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    this.debut = this.datePipe.transform(this.from, 'dd/MM/yyyy');
    this.fin = this.datePipe.transform(this.to, 'dd/MM/yyyy');
    if (this.var === 1) {
      await this.brouService
        .reglement(
          this.selectedClient.code,
          this.selectedPiece,
          this.debut,
          this.fin
        )
        .toPromise()
        .then((data) => {
          this.brou = data['_embedded'].brous;
          if (this.brou.length === 0) {
            this.msgs = 'Pas de reglements pour ces critères !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('btAfficher'));
          } else {
            this.saisieCardShow = true;
            this.ngselectDisabled = true;
            this.afficherShow = false;
          }
        });
    }
    if (this.var === 2) {
      await this.brouContService
        .reglement(
          this.selectedClient.code,
          this.selectedPiece,
          this.debut,
          this.fin
        )
        .toPromise()
        .then((data) => {
          this.brou = data['_embedded'].brouCont;
          if (this.brou.length === 0) {
            this.msgs = 'Pas de reglements pour ces critères !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('btAfficher'));
          } else {
            this.saisieCardShow = true;
            this.ngselectDisabled = true;
            this.afficherShow = false;
          }
        });
    }
    this.brouDebit = [];
    this.brouCredit = [];
    this.saisieCardShow1 = false;
    this.afficherShow = false;
  }

  async getAppurement(args: any) {
    this.selectedrecordsD = this.grid.getRowInfo(args.target).rowData;

    this.apurement = this.selectedrecordsD.apurement;
    if (this.var === 1) {
      await this.brouService
        .resulat(this.apurement, 'D')
        .toPromise()
        .then((data) => {
          this.brouDebit = data['_embedded'].brous;
        });
      await this.brouService
        .resulat(this.apurement, 'C')
        .toPromise()
        .then((data) => {
          this.brouCredit = data['_embedded'].brous;
        });
    }
    if (this.var === 2) {
      await this.brouContService
        .resulat(this.apurement, 'D')
        .toPromise()
        .then((data) => {
          this.brouDebit = data['_embedded'].brouCont;
        });
      await this.brouContService
        .resulat(this.apurement, 'C')
        .toPromise()
        .then((data) => {
          this.brouCredit = data['_embedded'].brouCont;
        });
    }
    let i = 1;
    for (const c of this.brouDebit) {
      if (c.id === this.selectedrecordsD.id) {
        break;
      }
      i++;
    }
    if (i > this.brouDebit.length) {
      i = 1;
      for (const c of this.brouCredit) {
        if (c.id === this.selectedrecordsD.id) {
          break;
        }
        i++;
      }
      this.gridCredit.selectRows([i - 1]);
    } else {
      this.gridDebit.selectRows([i - 1]);
    }

    this.grid.selectRows([this.grid.getRowInfo(args.target).rowIndex]);
    this.saisieCardShow1 = true;
  }
  async annuler() {
    if (this.var === 1) {
      await this.brouService
        .annulerApp(this.apurement)
        .toPromise()
        .then((data) => {});
    }
    if (this.var === 2) {
      await this.brouContService
        .annulerApp(this.apurement)
        .toPromise()
        .then((data) => {});
    }
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        this.apurement
      )
      .toPromise().then((data) => {
        console.log(data);
      });
    this.saisieCardShow = false;
    this.saisieCardShow1 = false;
    this.selectedClient = null;
    this.selectedPiece = '';
    this.brouDebit = [];
    this.brouCredit = [];
    this.ngselectDisabled = false;
    this.afficherShow = false;
    this.codeClient = '';
    // this.messageService.add({severity: 'warn', life: 10000, summary: 'Erreur', detail: 'Verifier la somme'});
  }

  nouveau(): void {
    this.brou = [];
    this.brouDebit = [];
    this.brouCredit = [];
    this.selectedPiece = '';
    this.selectedClient = null;
    this.saisieCardShow = false;
    this.saisieCardShow1 = false;
    this.ngselectDisabled = false;
    this.afficherShow = false;
    this.codeClient = '';
  }
  intialiserSelectedClient() {
    // console.log('ok');
    this.selectedClient = {
      id: null,
      code: null,
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
  /*
  annulerSelection(): void {
    if (this.gridCredit.getSelectedRowIndexes()[0] >= 0) {
      this.gridCredit.selectRows([]);
    }
  }*/
}
