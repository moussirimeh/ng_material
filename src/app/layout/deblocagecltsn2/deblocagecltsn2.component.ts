import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import {GridComponent, ToolbarItems, ToolbarService, ExcelExportProperties} from '@syncfusion/ej2-angular-grids';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { ReleveClient } from '../services/releveClient';
import { ReleveClientService } from '../services/releveClient.service';
import { BrouService } from '../services/brou.service';
import { ImpressionFacturesComponent } from '../impressionfactures/impressionfactures.component';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
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
  selector: 'app-deblocagecltsn2',
  templateUrl: './deblocagecltsn2.component.html',
  styleUrls: ['./deblocagecltsn2.component.scss'],
  providers: [ToolbarService],
})
export class Deblocagecltsn2Component implements OnInit {
  @ViewChild(ImpressionFacturesComponent) ImpFact;
  @ViewChild('grid')
  public grid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  codeClient = '';
  clients: Client[];
  selectedClient: Client;
  releveClients: ReleveClient[] = [];
  regltsNonEchus: any = [];
  afficherDisable = true;
  apercueDisable = true;
  afficherClicked = false;

  details;
  nbrImp = '0';
  totImp = '0.000';
  totDebit = '0.000';
  totCredit = '0.000';
  solde = '0.000';
  totBl = '0.000';
  totAvoir = '0.000';
  totRegl = '0.000';
  delPay = 'IND';
  delReg = 'IND';
  ste: Ste;
  releveClicked = false;
  display = false;
  displayFact = false;
  @Input() debloc1 = false;
  @Input() debloc2 = false;
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
    private clientService: ClientService ,
    private config: NgSelectConfig ,
    private releveClientService: ReleveClientService,
    private brouService: BrouService,
    private steService: SteService
  ) {
    this.config.notFoundText = 'Aucun élement trouvé' ;
    this.config.clearAllText = 'Supprimer tous ';
  }

  async ngOnInit() {
    this.releveClicked = false;
    await  this.intialiserSelectedClient();
    // await this.reloadDataClients();
    this.toolbarOptions = ['ExcelExport'];
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste;
      });
      await this.reloadDataClients();
  }
  async reloadDataClients() {
    await this.clientService
      .getClientsReleve()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
        this.clients.unshift(this.selectedClient);
      });
  }
  async reloadDataReleveClients() {
    await this.releveClientService
      .getReleves(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.releveClients = data['_embedded'].releveClient;
      });
  }
  async reglementsNonEchus() {
    await this.releveClientService
      .getReglementsNonEchus(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.regltsNonEchus = data['_embedded'].reglementsNonEchuses;
        if (data['_embedded'].reglementsNonEchuses.length > 0) {
        }
        this.display = true;
      });
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
  updateOnSelect() {
    if (!this.afficherClicked) {
      if (this.selectedClient !== null) {
        if (this.selectedClient.id !== null) {
          this.afficherDisable = false;
          this.apercueDisable = false;
          this.codeClient = this.selectedClient.code;
        } else {
          this.afficherDisable = true;
          this.apercueDisable = true;
        }
      }
    }
  }
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
      this.afficherDisable = false;
      this.apercueDisable = false;
    } else {
      this.afficherDisable = true;
      this.apercueDisable = true;
      this.msgs = 'Code Client Inexistant !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('codeClt').focus();
      this.ov.show(e, document.getElementById('codeClt'));
    }
  }
  async afficher() {
    if (this.selectedClient.id !== null) {
      await this.reloadDataReleveClients();
      await this.releveClientService
        .getreleveClientsBrou(this.selectedClient.code)
        .toPromise()
        .then((data) => {
          this.details = data;
        });
      await this.releveClientService
        .getDelaisPayment(this.selectedClient.code)
        .toPromise()
        .then((data) => {
          if (Number(data) === 0) {
            this.delPay = 'IND';
          } else {
            this.delPay = Number(data).toFixed(0);
          }
        });
      await this.releveClientService
        .getDelaisReglement(this.selectedClient.code)
        .toPromise()
        .then((data) => {
          if (Number(data) === 0) {
            this.delReg = 'IND';
          } else {
            this.delReg = Number(data).toFixed(0);
          }
        });

      this.totDebit = Number(this.details.debit)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      this.totCredit = Number(this.details.credit)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      this.solde = Number(this.details.debit - this.details.credit)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      this.totRegl = Number(this.details.regNonEchus)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      this.totImp = Number(this.details.mtImp)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      this.nbrImp = this.details.nbImp;
      this.totBl = Number(this.details.mtFencours)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      this.totAvoir = Number(this.details.mtAencours)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, '$& ');

      this.afficherClicked = true;
      this.afficherDisable = true;
    }
  }
  async apercue() {
    await this.reloadDataReleveClients();
    await this.releveClientService
      .getreleveClientsBrou(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.details = data;
      });
    const cols = [
      {
        numero: 'N°Facture',
        date: 'Date',
        piece: 'Piece',
        debit: 'Mnt Débit',
        credit: 'Mnt Crédit',
        observ: 'Observation',
      },
    ];
    const releves = [];
    for (const releve of this.releveClients) {
      releves.push({
        numero: releve.numero,
        date: releve.date,
        piece: releve.piece,
        debit: releve.debit,
        credit: releve.credit,
        observ: releve.libelle,
      });
    }

    const doc1 = new jspdf();
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text(this.ste[0].societe, 14, 10);
    doc1.text(this.ste[0].adresse, 14, 15);
    doc1.text(this.ste[0].codep + '     ' + this.ste[0].ville, 14, 20);
    doc1.text(
      'Tel: ' + this.ste[0].tel + '   ' + 'Fax: ' + this.ste[0].fax,
      14,
      25
    );
    doc1.text('E-mail: ' + this.ste[0].email, 14, 30);

    doc1.setFontSize(12);
    doc1.setFontStyle('arial');

    doc1.rect(115, 10, 80, 32);
    doc1.text(this.selectedClient.deno, 120, 15);
    doc1.text(this.isNull(this.selectedClient.adresse), 120, 21);
    doc1.text(this.isNull(this.selectedClient.ville), 120, 27);
    doc1.text('Tel: ' + this.isNull(this.selectedClient.tel), 120, 33);
    doc1.text('Fax: ' + this.isNull(this.selectedClient.fax), 120, 39);

    doc1.text(
      'Objet :  Relevé des Factures       ' + this.selectedClient.code,
      20,
      47
    );

    const displayDate = new Date().toLocaleDateString('en-GB');
    doc1.text(
      'Nous avons l\'honneur de vous adresser la situation de votre compte arrêté au : ' +
        displayDate,
      14,
      60
    );

    doc1.autoTable({
      head: cols,
      body: releves,
      startY: 65,
      theme: 'grid',
      columnStyles: {
        numero: { cellWidth: 20 },
        date: { cellWidth: 25 },
        piece: { cellWidth: 20 },
        debit: { cellWidth: 25, halign: 'right' },
        credit: { cellWidth: 25, halign: 'right' },
        observ: { cellWidth: 60 },
      },
    });
    let debutPiedPage = doc1.autoTable.previous.finalY;

    debutPiedPage = debutPiedPage + 8;
    if (debutPiedPage > 280) {
      doc1.addPage();
      debutPiedPage = 20;
    }
    doc1.text('Totaux :', 14, debutPiedPage);
    doc1.text(
      Number(this.details.debit)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, '$& '),
      104,
      debutPiedPage,
      'right'
    );
    doc1.text(
      String(
        Number(this.details.credit)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ')
      ),
      130,
      debutPiedPage,
      'right'
    );
    debutPiedPage = debutPiedPage + 6;
    if (debutPiedPage > 280) {
      doc1.addPage();
      debutPiedPage = 20;
    }
    doc1.text('Solde :', 14, debutPiedPage);
    doc1.text(
      String(
        Number(this.details.debit - this.details.credit)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ')
      ),
      104,
      debutPiedPage,
      'right'
    );
    debutPiedPage = debutPiedPage + 10;
    if (debutPiedPage > 280) {
      doc1.addPage();
      debutPiedPage = 20;
    }
    doc1.text(
      'Nous vous prions de bien vouloir procéder au règlement de ces factures dans',
      27,
      debutPiedPage
    );
    debutPiedPage = debutPiedPage + 6;
    if (debutPiedPage > 280) {
      doc1.addPage();
      debutPiedPage = 20;
    }
    doc1.text('les meilleurs delais.', 20, debutPiedPage);
    debutPiedPage = debutPiedPage + 8;
    if (debutPiedPage > 280) {
      doc1.addPage();
      debutPiedPage = 20;
    }
    doc1.text(
      'Veuillez agréer, Messieur, l\'expression de nos salutation.',
      20,
      debutPiedPage
    );
    debutPiedPage = debutPiedPage + 10;
    if (debutPiedPage > 280) {
      doc1.addPage();
      debutPiedPage = 20;
    }
    doc1.text('Le service Comptable', 150, debutPiedPage);

    window.open(doc1.output('bloburl'), '_blank');
  }
  excelExport() {
    const excelExportProperties: ExcelExportProperties = {
      fileName: 'ReleveClient' + this.selectedClient.deno + '.xlsx',
    };
    this.grid.excelExport(excelExportProperties);
  }
  nouvelleSaisie() {
    this.afficherClicked = false;
    this.intialiserSelectedClient();
    this.codeClient = null;
    this.apercueDisable = true;
  }
  impressionFact() {
    const selectedRow: any = this.grid.getSelectedRecords()[0];
    if (
      Number(String(selectedRow.date).substr(6, 4)) === new Date().getFullYear()
    ) {
      if (selectedRow.piece === 'FACTURE' || selectedRow.piece === 'AVOIR') {
        this.ImpFact.numero1 = selectedRow.numero;
        this.ImpFact.numero2 = selectedRow.numero;
        this.ImpFact.numChecked = true;
        this.ImpFact.numDisable = true;
        this.ImpFact.relve = false;
        this.ImpFact.codeCltRelve = this.selectedClient.code;
        this.ImpFact.afficher();
        this.displayFact = true;
      }
    }
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  isNull(chaine: any): string {
    if (chaine === null) {
      return '';
    } else {
      return chaine;
    }
  }
  async deblocageNiv1(e) {
    this.wasInside = true;
    if (this.selectedClient.cadnat === 'O') {

      this.styleOvPanel = this.styleOvPanelSuccess;
      this.msgs = 'Ce Client est bloqué definitivement';
      this.ov.show(e, document.getElementById('idbtnDeblocN1'));
    } else {
      this.selectedClient.autor = 'O';
      await this.clientService
        .updateClient(this.selectedClient)
        .toPromise()
        .then(
          (data) => {
            console.log('clientUpdateSuccess');
          },
          (error) => {
            console.log('clientUpdateFailed');
          }
        );
      this.styleOvPanel = this.styleOvPanelSuccess;
      this.msgs = 'Déblocage Provisoire effectué';
      this.ov.show(e, document.getElementById('idbtnDeblocN1'));
    }
  }
  async deblocageNiv2(e) {
    this.wasInside = true;
    if (this.selectedClient.cadnat === 'O') {

      this.styleOvPanel = this.styleOvPanelSuccess;
      this.msgs = 'Ce Client est bloqué definitivement';
      this.ov.show(e, document.getElementById('idbtnDeblocN2'));
    } else {
      let ech;
      if (this.selectedClient.reg === 'TRAITE') {
        ech = '45';
      } else {
        ech = '100';
      }
      let brouCount;
      await this.brouService
        .getBrousDeblc2(this.selectedClient.code, ech)
        .toPromise()
        .then((data) => {
          brouCount = data['_embedded'].brous.length;
        });

        this.selectedClient.autor = 'O';
        await this.clientService
          .updateClient(this.selectedClient)
          .toPromise()
          .then(
            (data1) => {
              console.log('clientUpdateSuccess');
            },
            (error) => {
              console.log('clientUpdateFailed');
            }
          );
        /*
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Success',
          detail: 'Déblocage Provisoire effectué !'
        });*/
        this.styleOvPanel = this.styleOvPanelSuccess;
        this.msgs = 'Déblocage Provisoire effectué';
        this.ov.show(e, document.getElementById('idbtnDeblocN2'));

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
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

}
