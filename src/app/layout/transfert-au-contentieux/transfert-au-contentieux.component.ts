import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ClientService } from '../services/client.service';
import { ConfirmationService } from 'primeng/api';
import { LoginService } from 'src/app/login/login.service';
import { ClientContService } from '../services/clientCont.service';
import { BrouContService } from '../services/brouCont.service';
import { BrouService } from '../services/brou.service';
import { Brou } from '../services/brou';
import { Client } from '../services/client';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-transfert-au-contentieux',
  templateUrl: './transfert-au-contentieux.component.html',
  styleUrls: ['./transfert-au-contentieux.component.scss'],
  providers: [ConfirmationService],
})
export class TransfertAuContentieuxComponent implements OnInit {
  codeClient = '';
  selectedClient = null;
  clients = [];
  showBtAfficher = false;
  blockUi = false;
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
    private config: NgSelectConfig,
    private clientService: ClientService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private clientContService: ClientContService,
    private brouContService: BrouContService,
    private brouService: BrouService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  async ngOnInit() {
    await this.clientService
      .getClientsListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
        // this.clients.unshift(this.selectedClient);
      });
  }
  /*
  async applyFilterClientParCode(e) {
    let filteredElements = [];
    await this.clientService
      .getClientByCode(e.target.value)
      .toPromise()
      .then((data) => {
        filteredElements = data['_embedded'].clients;
      });
    if (filteredElements.length > 0) {
      this.selectedClient = filteredElements[0];
      this.showBtAfficher = true;
    } else {
      this.showBtAfficher = false;
      this.msgs = 'Code Client Inexistant !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('codeClt').focus();
      this.ov.show(e, document.getElementById('codeClt'));
    }
  }*/
  updateOnSelect() {
    if (this.selectedClient !== null) {
      if (this.selectedClient.id !== null) {
        this.codeClient = this.selectedClient.code;
        this.showBtAfficher = true;
      } else {
        this.showBtAfficher = false;
      }
    } else {
      this.showBtAfficher = false;
    }
  }
  /*
  async applyFilterClientParDeno(filtredValue: string) {
    await this.clientService
      .getClientsTop100ByDenoStartsWith(filtredValue)
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }*/
  async transferer() {
    this.confirmationService.confirm({
      message: 'Êtes vous sûr de vouloir transfrér ce client au contentieux ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        this.blockUi = true;
        const idClt = this.selectedClient.id;
        this.selectedClient.id = null;
        // console.log(this.selectedClient);
        await this.clientContService
          .createClientCont(this.selectedClient)
          .toPromise()
          .then((data) => {});

        await this.brouService
          .transfertAuContentieux(this.selectedClient.code)
          .toPromise()
          .then();

        await this.brouService
          .deleteByCompte(this.selectedClient.code)
          .toPromise()
          .then((data2) => {});
        // console.log(this.selectedClient);
        this.selectedClient.id = idClt;
        await this.clientService
          .deleteClient(this.selectedClient)
          .toPromise()
          .then((data) => {});

        this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            this.codeClient
          )
          .subscribe((data) => {});

        this.codeClient = '';
        this.selectedClient = null;
        await this.clientService
          .getClientsListByOrderByDeno()
          .toPromise()
          .then((data) => {
            this.clients = data['_embedded'].clients;
            // this.clients.unshift(this.selectedClient);
          });
        this.blockUi = false;
      },
    });
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
}
