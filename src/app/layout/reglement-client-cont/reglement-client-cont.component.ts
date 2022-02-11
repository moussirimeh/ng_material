import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {
  GridComponent,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { Client } from '../services/client';
import { SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { SteService } from '../services/ste.service';
import { ClientContService } from '../services/clientCont.service';
import { ReglementClientContService } from '../services/reglementClientCont.service';
import { BrouContService } from '../services/brouCont.service';
import { ReglementClientCont } from '../services/reglementClientCont';
import { Ste } from '../services/ste';
import { setCurrencyCode } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { setCulture } from '@syncfusion/ej2-base';
import { AppurementReglementComponent } from '../appurement-reglement/appurement-reglement.component';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { globals } from 'src/environments/environment';
setCulture('en-US');
setCurrencyCode('QAR');
L10n.load({
  'en-US': {
    grid: {
      EmptyRecord: [],
    },
  },
});
@Component({
  selector: 'app-reglement-client-cont',
  templateUrl: './reglement-client-cont.component.html',
  styleUrls: ['./reglement-client-cont.component.scss'],
  providers: [DatePipe],
})
export class ReglementClientContComponent implements OnInit {
  @ViewChild(AppurementReglementComponent) Appurement;
  public mode: string;
  @ViewChild('gridCredit')
  public gridCredit: GridComponent;
  @ViewChild('gridDebit')
  public gridDebit: GridComponent;
  display = false;
  selectedrowindex: any;
  selectedrecordsD: any;
  selectedrecordsC: any;
  maxDate: Date;
  minDate: Date;
  debut: any;
  fin: any;
  date: any;
  echeance: any;
  ngselectDisabled = false;
  clients: Client[] = [];
  ste: Ste[];
  apurementshow = false;
  totalDebit = '0.000';
  totalCredit = '0.000';
  allowSelection = true;
  maxid;
  maxIdPlus1 = null;
  nombreIMP = '0';
  totalIMP = '0.000';
  solde = '0.000';
  credit: number;
  debit: number;
  bd;
  validershow = false;
  ajouterDisabled = true;
  supprimerDisabled = true;
  modifierDisabled = true;
  champDisabled = true;
  brouContDebit: ReglementClientCont[] = [];
  brouContCredit: ReglementClientCont[] = [];
  selectedClient = null;
  selectedrecords;
  valueMontant;
  dateCaisse;
  selected;
  selectedBrou: any = {
    id: null,
    code: '',
    compte: '',
    nature: '',
    piece: '',
    montant: '',
    libelle: '',
    sens: '',
    date: '',
    regle: '',
    numero: '',
    num: '',
    cle: '',
    op1: '',
    operateur: '',
    echeance: '',
    lig: '',
    apurement: '',
    dateApur: '',
    datVer: '',
    datRec: '',
    etat: '',
    etat2: '',
    banqEqm: '',
    borVer: '',
    borEnc: '',
    tire: '',
    banque: '',
    borRtr: '',
    numPiece: '',
  };
  sensDebit = 'D';
  sensCredit = 'C';

  afficherShow = true;
  ajouterClicked = false;
  modifierClicked = false;

  piece: SelectItem[];
  deno;
  autoriseModif: boolean;
  autoriseSupp: boolean;

  codeClient = '';
  showCard1 = false;
  showCard2 = false;
  showNvSaisie = false;

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
    private brouContService: BrouContService,
    private reglementContService: ReglementClientContService,
    private clientContService: ClientContService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = '';
    this.config.clearAllText = 'Supprimer tous';
    this.piece = [
      { label: '', value: null },
      { label: 'TRAITE', value: 'TRAITE' },
      { label: 'CHEQUE', value: 'CHEQUE' },
      { label: 'ESPECE', value: 'ESPECE' },
      { label: 'VIR.BNQ', value: 'VIR.BNQ' },
      { label: 'DIFF+', value: 'DIFF+' },
      { label: 'DIFF-', value: 'DIFF-' },
      { label: 'RS', value: 'RS' },
    ];
  }

  async ngOnInit() {
    await this.clientContService
      .getClientContList()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clientsCont;

      });
    // module reglement client contentieux
    if (globals.selectedMenu === 'Reglement Client Cont') {
      this.autoriseModif = false;
      this.autoriseSupp = false;
    }
    // module reglement client contenieux avec modifier et supprimer
    if (
      globals.selectedMenu === 'Reglement Clients avec Mod Sup'
    ) {
      this.autoriseModif = true;
      this.autoriseSupp = true;
    }
    await this.getDatecaisse();
    await this.reloadDataste();

    // this.reloadDataClientCont();

    this.maxDate = new Date();
    this.date = new Date();
    this.echeance = new Date();
  } /*
  reloadDataClientCont() {
    this.clientContService.getClientContList().subscribe((data) => {
      this.clients = data['_embedded'].clientsCont;
    });
  }*/
  async getDeno() {
    await this.clientContService
      .getDeno(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.deno = value;
      });
  }
  async reloadDataste() {
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste;
      });
  }
  async getDatecaisse() {
    await this.steService
      .getDateCaisse()
      .toPromise()
      .then((value) => {
        this.dateCaisse = value;
      });
  }
  async ListBrou() {
    this.maxIdPlus1 = null;
    await this.reglementContService
      .ListByDebit(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.brouContDebit = data['_embedded'].reglementClientCont;
        console.log(data);
        
      });
    await this.reglementContService
      .ListByCredit(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.brouContCredit = data['_embedded'].reglementClientCont;
        console.log(data);
        for (const b of this.brouContDebit) {
          this.brouContCredit.push(b);
        }
      });
    if (this.brouContCredit.length === 0) {
      this.apurementshow = false;
      this.supprimerDisabled = true;
      this.modifierDisabled = true;
    } else {
      this.apurementshow = true;
      this.brouContCredit = this.brouContCredit.sort(function (a, b) {
        if (a.date != null && b.date != null) {
          if (
            new Date(
              +a.date.split('/')[2],
              +a.date.split('/')[1] - 1,
              +a.date.split('/')[0]
            ) <
            new Date(
              +b.date.split('/')[2],
              +b.date.split('/')[1] - 1,
              +b.date.split('/')[0]
            )
          ) {
            return -1;
          }
          if (
            new Date(
              +a.date.split('/')[2],
              +a.date.split('/')[1] - 1,
              +a.date.split('/')[0]
            ) >
            new Date(
              +b.date.split('/')[2],
              +b.date.split('/')[1] - 1,
              +b.date.split('/')[0]
            )
          ) {
            return 1;
          }
          return 0;
        }
        return 0;
      });
    }
    await this.brouContService
      .getNombreIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.nombreIMP = Number(value).toFixed();
      });
    await this.brouContService
      .getTotalIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.totalIMP = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      });
    await this.brouContService
      .getTotalCredit(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.totalCredit = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.credit = +Number(value).toFixed(3);
      });
    await this.brouContService
      .getTotalDebit(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.totalDebit = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.debit = +Number(value).toFixed(3);
      });
    this.solde = Number(this.debit - this.credit)
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    console.log(this.brouContCredit);
  }
  async afficher() {
    this.minDate = new Date(this.dateCaisse);
    this.minDate.setDate(this.minDate.getDate() + 1);

    await this.getDeno();
    await this.ListBrou();
    this.ajouterDisabled = false;
    this.ngselectDisabled = true;
    this.afficherShow = false;
    this.showCard1 = true;
    this.showNvSaisie = true;
  }
  nouveau(): void {
    this.brouContDebit = [];
    this.brouContCredit = [];
    this.totalCredit = null;
    this.totalDebit = null;
    this.solde = null;
    this.nombreIMP = null;
    this.totalIMP = null;
    this.selectedClient = null;
    this.ajouterDisabled = true;
    this.modifierDisabled = true;
    this.supprimerDisabled = true;
    this.ngselectDisabled = false;
    this.afficherShow = true;
    this.validershow = false;
    this.champDisabled = true;
    this.ajouterClicked = false;
    this.apurementshow = false;
    this.modifierClicked = false;
    this.allowSelection = true;
    this.selectedBrou = {};
    this.date = new Date();
    this.echeance = new Date();
    this.afficherShow = false ;
    this.codeClient = '';
    this.showCard1 = false;
  }
  annuler(): void {
    this.ajouterDisabled = false;
    this.validershow = false;
    this.maxIdPlus1 = null;
    this.champDisabled = true;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.allowSelection = true;
    this.selectedBrou = {};
    this.echeance = new Date();
    this.showCard2 = false;
    this.showNvSaisie = true;
  }
  rowSelected(args: RowSelectEventArgs) {
    if (this.gridCredit.getSelectedRecords().length > 0) {
      this.modifierDisabled = false;
      this.supprimerDisabled = false;
      this.selected = this.gridCredit.getSelectedRecords()[0];

      if (
        this.selected.piece === 'CHEQUE' ||
        this.selected.piece === 'TRAITE' ||
        this.selected.piece === 'AVOIR' ||
        this.selected.piece === 'RS' ||
        this.selected.piece === 'VIR.BNQ' ||
        this.selected.piece === 'DIFF+' ||
        this.selected.piece === 'ESPECE'
      ) {
        this.selectedBrou.montant = this.selected.credit;
      } else {
        this.selectedBrou.montant = this.selected.debit;
      }
      this.selectedBrou.piece = this.selected.piece;
      this.selectedBrou.numero = this.selected.numero;
      this.selectedBrou.libelle = this.selected.libelle;
      this.date = this.selected.date;
      this.echeance = this.selected.echeance;
      this.selectedBrou.date = this.selected.date;
      this.selectedBrou.echeance = this.selected.echeance;
      this.selectedBrou.tire = this.selected.tire;
      this.selectedBrou.banque = this.selected.banque;
      this.selectedBrou.id = this.selected.id;
      this.selectedBrou.code = this.selected.code;
      this.selectedBrou.compte = this.selected.compte;
      this.selectedBrou.nature = this.selected.nature;
      this.selectedBrou.sens = this.selected.sens;
      this.selectedBrou.regle = this.selected.regle;
      this.selectedBrou.num = this.selected.num;
      this.selectedBrou.cle = this.selected.cle;
      this.selectedBrou.op1 = this.selected.op1;
      this.selectedBrou.operateur = this.selected.operateur;
      this.selectedBrou.lig = this.selected.lig;
      this.selectedBrou.apurement = this.selected.apurement;
      this.selectedBrou.dateApur = this.selected.dateApur;
      this.selectedBrou.datVer = this.selected.datVer;
      this.selectedBrou.datRec = this.selected.datRec;
      this.selectedBrou.etat = this.selected.etat;
      this.selectedBrou.etat2 = this.selected.etat2;
      this.selectedBrou.banqEqm = this.selected.banqEqm;
      this.selectedBrou.borVer = this.selected.borVer;
      this.selectedBrou.borEnc = this.selected.borEnc;
      this.selectedBrou.borRtr = this.selected.borRtr;
      this.selectedBrou.numPiece = this.selected.numPiece;
    }
  }

  async create(e) {
    this.selectedBrou.date = this.datePipe.transform(this.date, 'dd/MM/yyyy');
    this.selectedBrou.echeance = this.datePipe.transform(
      this.echeance,
      'dd/MM/yyyy'
    );
    if (this.selectedBrou.piece === 'VIR.BNQ') {
      this.selectedBrou.echeance = null;
    }
    if (this.selectedBrou.piece === 'DIFF-') {
      this.selectedBrou.sens = 'D';
    }
    await this.brouContService
      .createBrouCont(this.selectedBrou)
      .toPromise()
      .then((data) => {});
    await this.ListBrou();
  }
  async ajouter() {
    /*await this.brouContService
      .getMaxId()
      .toPromise()
      .then((value) => {
        this.maxid = value;
        this.maxIdPlus1 = +this.maxid + 1;
      });*/
    this.selectedBrou = {
      id: null,
      code: null,
      compte: this.selectedClient.code,
      nature: null,
      piece: null,
      montant: null,
      libelle: null,
      sens: 'C',
      date: this.date,
      regle: null,
      numero: null,
      num: null,
      cle: null,
      op1: null,
      operateur: null,
      echeance: this.echeance,
      lig: null,
      apurement: null,
      dateApur: null,
      datVer: null,
      datRec: null,
      etat: null,
      etat2: null,
      banqEqm: null,
      borVer: null,
      borEnc: null,
      tire: this.deno,
      banque: null,
      borRtr: null,
      numPiece: null,
    };
    this.ajouterClicked = true;
    this.modifierClicked = false;
    this.ajouterDisabled = true;
    this.modifierDisabled = true;
    this.supprimerDisabled = true;
    this.allowSelection = false;
    this.champDisabled = false;
    this.validershow = true;
    this.date = new Date();
    this.echeance = new Date();
    this.showCard2 = true;
    this.showNvSaisie = false;
  }
  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.ajouterClicked === true) {
      if (this.selectedBrou.piece === null) {
        this.msgs = 'Veuillez selectionner une piece !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('brouPiece').focus();
        this.ov.show(e, document.getElementById('brouPiece'));
      } else if (
        this.selectedBrou.piece === 'TRAITE' ||
        this.selectedBrou.piece === 'CHEQUE' ||
        this.selectedBrou.piece === 'VIR.BNQ'
      ) {
        if (
          this.selectedBrou.montant !== null &&
          this.selectedBrou.banque !== null &&
          this.selectedBrou.banque !== '' &&
          this.selectedBrou.numero !== null &&
          this.selectedBrou.numero !== '' &&
          this.selectedBrou.tire !== '' &&
          this.selectedBrou.tire.length <= '25'
        ) {
          await this.create(e);
          this.showCard2 = false;
          this.showNvSaisie = true;
          this.ajouterClicked = false;

          this.allowSelection = true;
          this.ajouterDisabled = false;
          this.validershow = false;
          this.champDisabled = true;
          this.selectedBrou = {};
        } else if (
          this.selectedBrou.montant !== null &&
          this.selectedBrou.banque !== null &&
          this.selectedBrou.banque !== '' &&
          this.selectedBrou.numero !== null &&
          this.selectedBrou.numero !== '' &&
          this.selectedBrou.tire.length > '25'
        ) {
          this.msgs = 'Le nombre de caractères maximal est 25 !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('brouTire').focus();
          this.ov.show(e, document.getElementById('brouTire'));
        } else {
          this.msgs = 'Remplir tout les champs !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btValider'));
        }
      } else if (
        this.selectedBrou.piece !== null &&
        this.selectedBrou.montant !== null
      ) {
        this.selectedBrou.tire = null;
        this.echeance = null;
        await this.create(e);
        this.showCard2 = false;
        this.showNvSaisie = true;
        this.allowSelection = true;
        this.champDisabled = true;
        this.ajouterDisabled = false;
        this.validershow = false;
        this.ajouterClicked = false;
        this.selectedBrou = {};
      } else {
        this.msgs = 'Remplir tout les champs !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btValider'));
      }
    } else if (this.modifierClicked === true) {
      if (this.selectedBrou.piece === null) {
        this.msgs = 'Veuillez selectionner une piece !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('brouPiece').focus();
        this.ov.show(e, document.getElementById('brouPiece'));
      } else if (
        this.selectedBrou.piece === 'TRAITE' ||
        this.selectedBrou.piece === 'CHEQUE' ||
        this.selectedBrou.piece === 'VIR.BNQ'
      ) {
        if (
          this.valueMontant !== null &&
          this.selectedBrou.banque !== null &&
          this.selectedBrou.banque !== '' &&
          this.selectedBrou.numero !== null &&
          this.selectedBrou.numero !== '' &&
          this.echeance !== null &&
          this.selectedBrou.tire !== '' &&
          this.selectedBrou.tire.length <= '25'
        ) {
          await this.modifierBrou();
          this.showCard2 = false;
          this.showNvSaisie = true;
          this.allowSelection = true;
          this.champDisabled = true;
          this.validershow = false;
          this.ajouterClicked = false;
          this.ajouterDisabled = false;
          this.selectedBrou = {};
        } else if (
          this.valueMontant !== null &&
          this.selectedBrou.banque !== null &&
          this.selectedBrou.banque !== '' &&
          this.selectedBrou.numero !== null &&
          this.selectedBrou.numero !== '' &&
          this.selectedBrou.echeance !== null &&
          this.selectedBrou.tire.length > '25'
        ) {
          this.msgs = 'Le nombre de caractères maximal est 25 !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('brouTire').focus();
          this.ov.show(e, document.getElementById('brouTire'));
        } else {
          this.msgs = 'Remplir tout les champs !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btValider'));
        }
      } else if (
        this.selectedBrou.piece !== null &&
        this.valueMontant !== null
      ) {
        this.selectedBrou.tire = null;
        this.selectedBrou.echeance = null;
        this.selectedBrou.numero = null;
        this.selectedBrou.banque = null;

        await this.modifierBrou();
        this.showCard2 = false;
        this.showNvSaisie = true;
        this.allowSelection = true;
        this.champDisabled = true;
        this.validershow = false;
        this.afficherShow = true;
        this.modifierClicked = false;
        this.ajouterDisabled = false;
        this.selectedBrou = {};
      } else {
        this.msgs = 'Remplir tout les champs !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btValider'));
      }
    }
  }
  async apurement() {
    this.Appurement.clients = this.clients;
    this.Appurement.var = 2;
    this.Appurement.selectedDebit = null;
    this.Appurement.selectedCredit = null;
    this.Appurement.selectedClient = this.selectedClient;
    this.Appurement.codeClient = this.selectedClient.code;
    this.Appurement.sensCredit = 'C';
    this.Appurement.sensDebit = 'D';
    this.Appurement.fromOutside = true;
    await this.Appurement.afficher();
    this.display = true;
  }
  // lors de la fermeture de la boîte de dialogue appurement
  async close() {
    await this.ListBrou();
  }
  async supprimerBrou() {
    await this.brouContService
      .deleteBrou(this.selectedBrou.id)
      .toPromise()
      .then((data) => {});
    await this.ListBrou();
  }
  async modifierBrou() {
    if (this.selectedBrou.piece === 'VIR.BNQ') {
      this.selectedBrou.echeance = null;
    } else if (this.selectedBrou.piece === 'DIFF-') {
      this.selectedBrou.sens = 'D';
    } else {
      this.selectedBrou.sens = 'C';
    }
    await this.brouContService
      .updateput(this.selectedBrou)
      .toPromise()
      .then((data) => {});
    await this.ListBrou();
  }

  async supprimer(e) {
    this.wasInside = true;
    this.ov.hide();
    const d = this.date.split('/');
    const d1 = new Date(+d[2], +d[1] - 1, +d[0]);

    const d2 = new Date(this.dateCaisse);

    if (d1 <= d2) {
      this.msgs = 'La suppression de cette ligne n\'est pas possible';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btSupprimer'));
    } else {
      await this.supprimerBrou();
      this.allowSelection = true;
      this.modifierDisabled = true;
      this.supprimerDisabled = true;
      this.date = new Date();
      this.echeance = new Date();
      this.selectedBrou = {};
    }
  }
  async modifier(e) {
    this.wasInside = true;
    this.ov.hide();
    const d = this.date.split('/');
    const d1 = new Date(+d[2], +d[1] - 1, +d[0]);
    const d2 = new Date(this.dateCaisse);

    if (d1 <= d2) {
      this.msgs = 'La modification de cette ligne n\'est pas possible';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btModifier'));
      this.allowSelection = true;
    } else {
      this.allowSelection = false;
      this.champDisabled = false;
      this.ajouterClicked = false;
      this.modifierClicked = true;
      this.modifierDisabled = true;
      this.supprimerDisabled = true;
      this.ajouterDisabled = true;
      this.validershow = true;
    }
    this.showCard2 = true;
    this.showNvSaisie = false;
  }

  setTire() {
    if (
      this.modifierClicked &&
      (this.selectedBrou.piece === 'CHEQUE' ||
        this.selectedBrou.piece === 'TRAITE' ||
        this.selectedBrou.piece === 'VIR.BNQ')
    ) {
      this.selectedBrou.tire = this.deno;
      this.echeance = new Date();
      this.selectedBrou.echeance = this.datePipe.transform(
        this.echeance,
        'dd/MM/yyyy'
      );
    }
  }
  onselect(event) {
    this.selectedBrou.date = this.datePipe.transform(this.date, 'dd/MM/yyyy');
  }
  onselectEch(event: string) {
    this.selectedBrou.echeance = this.datePipe.transform(
      this.echeance,
      'dd/MM/yyyy'
    );
  }
  async applyFilterClientParCode(e) {
    let filteredElements = [];
    await this.clientContService
      .getClientContByCode(e.target.value)
      .toPromise()
      .then((data) => {
        filteredElements = data['_embedded'].clientsCont;
      });
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
  async updateOnSelect() {
    if (!this.ngselectDisabled) {
      if (this.selectedClient !== null) {
        if (this.selectedClient.id !== null) {
          this.codeClient = this.selectedClient.code;
          this.afficherShow = true;
        } else {
          this.codeClient = '';
          this.afficherShow = false;
        }
      } else {
        this.codeClient = '';
        this.afficherShow = false;
      }
    }
  }
  async applyFilterClientParDeno(filtredValue: string) {
    await this.clientContService
      .getClientsContTop100ByDenoStartsWith(filtredValue)
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clientsCont;
      });
  }
  annulerSelection(): void {
    if (!this.ajouterClicked) {
      if (this.gridCredit.getSelectedRowIndexes()[0] >= 0) {
        this.modifierDisabled = true;
        this.supprimerDisabled = true;
        this.gridCredit.selectRows([]);
        this.selectedBrou = {};
      }
    }
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
}
