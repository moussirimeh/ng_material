import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { CaisseService } from '../services/caisse.service';
import { CaissePService } from '../services/caisseP.service';
import { ClientService } from '../services/client.service';
import { LoginService } from '../../login/login.service';
import { Client } from '../services/client';
import { Caisse } from '../services/caisse';
import { CaisseP } from '../services/caisseP';
import { ApurementRegtCompt } from '../services/apurementRegtCompt';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-apurement-regts-cmpt',
  templateUrl: './apurement-regts-cmpt.component.html',
  styleUrls: ['./apurement-regts-cmpt.component.scss'],
  providers: [ConfirmationService],
})
export class ApurementRegtsCmptComponent implements OnInit {
  clients: Client[];
  selectedClient = null;
  debit = [];
  credit = [];
  seleteddata;
  sommeDebit = 0;
  sommeCredit = 0;
  maxAppCaisse: number;
  maxAppCaisseP: number;
  maxAppPlus1 = null;
  montantDebit = null;
  montantCredit = null;
  selectedCaisseDebit = [];
  selectedCaissePDebit = [];
  selectedCaisseCredit = [];
  selectedCaissePCredit = [];
  caisseDebit: Caisse[] = [];
  caisseCredit: Caisse[] = [];
  caissePDebit: CaisseP[] = [];
  caissePCredit: CaisseP[] = [];
  caisseS: Caisse[] = [];
  caisseE: Caisse[] = [];
  caissePS: CaisseP[] = [];
  caissePE: CaisseP[] = [];
  regtComptD = [];
  regtComptC = [];
  selectedDebit;
  selectedCredit;
  ngselectDisabled = false;
  c: ApurementRegtCompt[];
  validerShow = false;
  afficherShow = false;
  saisieCardShow = false;
  saisieCardShow1 = false;
  d;
  identifiant: any;
  identifiantC: any;
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
    private confirmationService: ConfirmationService,
    private caisseService: CaisseService,
    private caissePService: CaissePService,
    private clientService: ClientService,
    private loginService: LoginService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = '';
    this.config.clearAllText = 'Supprimer tous';
  }
  async ngOnInit() {
    // this.reloadDataClient();
    await this.clientService
      .getClientsComptantListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }
  /*
  async reloadDataClient() {
    await this.clientService
      .getClientsList()
      .toPromise()
      .then((data) => {
        this.clients = data["_embedded"].clients;
      });
  }*/
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    this.montantCredit = 0;
    this.montantDebit = 0;
    this.sommeCredit = 0;
    this.sommeDebit = 0;
    this.regtComptC = [];
    this.regtComptD = [];
    this.selectedCaisseCredit = [];
    this.selectedCaisseDebit = [];
    this.selectedCaissePDebit = [];
    this.selectedCaissePCredit = [];
    this.maxAppPlus1 = null;

    await this.caisseService
      .getMaxAppurement()
      .toPromise()
      .then((value) => {
        this.maxAppCaisse = +value;
      });

    await this.caissePService
      .getMaxAppurement()
      .toPromise()
      .then((value) => {
        this.maxAppCaisseP = +value;
      });

    await this.caisseService
      .mouvementD(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.caisseDebit = data['_embedded'].caisses;
      });

    await this.caisseService
      .mouvementC(this.selectedClient.code)
      .toPromise()
      .then((dataa) => {
        this.caisseCredit = dataa['_embedded'].caisses;
      });

    await this.caissePService
      .mouvementD(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.caissePDebit = data['_embedded'].caisseP;
        for (const c of this.caisseDebit) {
          this.regtComptD.push({
            id: c.id,
            code: c.code,
            date: c.date,
            mode: c.mode,
            cheque: c.cheque,
            banque: c.banque,
            facture: c.facture,
            sens: c.sens,
            montant: c.montant,
            ech: c.ech,
            observat: c.observat,
            datVer: c.datVer,
            datRec: c.datRec,
            etat: c.etat,
            etat2: c.etat2,
            banqEqm: c.banqEqm,
            borVer: c.borVer,
            borEnc: c.borEnc,
            tire: c.tire,
            combine: c.combine,
            operateur: c.operateur,
            regle: c.regle,
            apurement: c.apurement,
            dateApur: c.dateApur,
            borRtr: c.borRtr,
            numPiece: c.numPiece,
            identifiant: 'C',
          });
        }
        for (const cP of this.caissePDebit) {
          this.regtComptD.push({
            id: cP.id,
            code: cP.code,
            date: cP.date,
            mode: cP.mode,
            cheque: cP.cheque,
            banque: cP.banque,
            facture: cP.facture,
            sens: cP.sens,
            montant: cP.montant,
            ech: cP.ech,
            observat: cP.observat,
            datVer: cP.datVer,
            datRec: cP.datRec,
            etat: cP.etat,
            etat2: cP.etat2,
            banqEqm: cP.banqEqm,
            borVer: cP.borVer,
            borEnc: cP.borEnc,
            tire: cP.tire,
            combine: cP.combine,
            operateur: cP.operateur,
            regle: cP.regle,
            apurement: cP.apurement,
            dateApur: cP.dateApur,
            borRtr: cP.borRtr,
            numPiece: cP.numPiece,
            identifiant: 'P',
          });
        }
      });
    await this.caissePService
      .mouvementC(this.selectedClient.code)
      .toPromise()
      .then((dataa) => {
        this.caissePCredit = dataa['_embedded'].caisseP;
        for (const c of this.caisseCredit) {
          this.regtComptC.push({
            id: c.id,
            code: c.code,
            date: c.date,
            mode: c.mode,
            cheque: c.cheque,
            banque: c.banque,
            facture: c.facture,
            sens: c.sens,
            montant: c.montant,
            ech: c.ech,
            observat: c.observat,
            datVer: c.datVer,
            datRec: c.datRec,
            etat: c.etat,
            etat2: c.etat2,
            banqEqm: c.banqEqm,
            borVer: c.borVer,
            borEnc: c.borEnc,
            tire: c.tire,
            combine: c.combine,
            operateur: c.operateur,
            regle: c.regle,
            apurement: c.apurement,
            dateApur: c.dateApur,
            borRtr: c.borRtr,
            numPiece: c.numPiece,
            identifiant: 'C',
          });
        }
        for (const cP of this.caissePCredit) {
          this.regtComptC.push({
            id: cP.id,
            code: cP.code,
            date: cP.date,
            mode: cP.mode,
            cheque: cP.cheque,
            banque: cP.banque,
            facture: cP.facture,
            sens: cP.sens,
            montant: cP.montant,
            ech: cP.ech,
            observat: cP.observat,
            datVer: cP.datVer,
            datRec: cP.datRec,
            etat: cP.etat,
            etat2: cP.etat2,
            banqEqm: cP.banqEqm,
            borVer: cP.borVer,
            borEnc: cP.borEnc,
            tire: cP.tire,
            combine: cP.combine,
            operateur: cP.operateur,
            regle: cP.regle,
            apurement: cP.apurement,
            dateApur: cP.dateApur,
            borRtr: cP.borRtr,
            numPiece: cP.numPiece,
            identifiant: 'P',
          });
        }
      });
    if (this.regtComptD.length === 0 && this.regtComptC.length === 0) {
      this.msgs = 'Pas de mouvement de debit et de credit pour ce Client !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('client').focus();
      this.ov.show(e, document.getElementById('client'));
    } else {
      this.regtComptD = this.regtComptD.sort(function (a, b) {
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
      this.regtComptC = this.regtComptC.sort(function (a, b) {
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
      this.ngselectDisabled = true;
      this.saisieCardShow = true;
      this.saisieCardShow1 = true;
      this.afficherShow = false;
    }
  }
  async onConfirm() {
    if (this.selectedCaisseDebit.length != null) {
      this.selectedCaisseDebit.forEach(async (id) => {
        await this.caisseService
          .updateApp(this.maxAppPlus1, id)
          .toPromise()
          .then((data) => {});
      });
    }
    if (this.selectedCaisseCredit.length != null) {
      this.selectedCaisseCredit.forEach(async (id) => {
        await this.caisseService
          .updateApp(this.maxAppPlus1, id)
          .toPromise()
          .then((data) => {});
      });
    }
    if (this.selectedCaissePDebit.length != null) {
      this.selectedCaissePDebit.forEach(async (id) => {
        await this.caissePService
          .updateApp(this.maxAppPlus1, id)
          .toPromise()
          .then((data) => {});
      });
    }
    if (this.selectedCaissePCredit.length != null) {
      this.selectedCaissePCredit.forEach(async (id) => {
        await this.caissePService
          .updateApp(this.maxAppPlus1, id)
          .toPromise()
          .then((data) => {});
      });
      this.validerShow = false;
    }
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        'APR ' +
          this.maxAppPlus1 +
          ' CLT ' +
          this.selectedClient.code +
          ' DEB ' +
          Number(this.sommeDebit).toFixed(3) +
          ' CRD ' +
          Number(this.sommeCredit).toFixed(3)
      )
      .toPromise()
      .then((data) => {
        console.log(data);
      });
    // this.clients = [];
    this.codeClient = '';
    this.ngselectDisabled = false;
    this.validerShow = false;
    this.afficherShow = true;
    this.saisieCardShow = false;
    this.saisieCardShow1 = false;
    this.selectedClient = null;
    this.caisseCredit = [];
    this.caisseDebit = [];
    this.caissePCredit = [];
    this.caissePDebit = [];
    this.afficherShow = false;
  }
  valider(e): void {
    this.wasInside = true;
    this.ov.hide();
    if (
      this.sommeDebit === this.sommeCredit ||
      Math.abs(this.sommeCredit - this.sommeDebit) <= 1 ||
      (localStorage.getItem('login')).toUpperCase() === 'MESSAOUDI'
    ) {
      if (this.maxAppCaisse > this.maxAppCaisseP) {
        this.maxAppPlus1 = +this.maxAppCaisse + 1;
      } else if (this.maxAppCaisse <= this.maxAppCaisseP) {
        this.maxAppPlus1 = +this.maxAppCaisseP + 1;
      }
      this.confirmationService.confirm({
        message: 'Voulez Vous Valider l\'appurement ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        accept: async () => {
          await this.onConfirm();
        },
      });
    } else {
      this.msgs = 'Les sommes des montants selectionnés sont differents !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btValider'));
    }
  }
  nouveau(): void {
    this.regtComptC = [];
    this.regtComptD = [];
    this.selectedDebit = null;
    this.selectedCredit = null;
    this.caisseCredit = [];
    this.caissePCredit = [];
    this.caisseDebit = [];
    this.caissePDebit = [];
    this.selectedClient = null;
    this.saisieCardShow = false;
    this.saisieCardShow1 = false;
    this.ngselectDisabled = false;
    this.afficherShow = true;
    // this.clients = [];
    this.codeClient = '';
    this.afficherShow = false;
  }

  onRowSelectD(event) {
    this.validerShow = true;
    this.identifiant = event.data.identifiant;
    this.d = event.data.date;

    if (this.d != null) {
      const dateObject = new Date(
        +this.d.split('/')[2],
        +this.d.split('/')[1] - 1,
        +this.d.split('/')[0]
      );
    }
    this.montantDebit = event.data.montant;
    this.sommeDebit = +(
      Number(this.montantDebit) + Number(this.sommeDebit)
    ).toFixed(3);
    if (this.identifiant === 'C') {
      this.selectedCaisseDebit.push(event.data.id);
      this.selectedCaisseDebit.forEach((id) => {});
    } else if (this.identifiant === 'P') {
      this.selectedCaissePDebit.push(event.data.id);
      this.selectedCaissePDebit.forEach((id) => {});
    }
  }
  onRowUnselectD(event) {
    this.identifiant = event.data.identifiant;
    this.montantDebit = event.data.montant;
    this.sommeDebit = +(
      Number(this.sommeDebit) - Number(this.montantDebit)
    ).toFixed(3);
    if (this.sommeCredit <= 0 && this.sommeDebit <= 0) {
      this.validerShow = false;
    }
    if (this.identifiant === 'C') {
      const index = this.selectedCaisseDebit.indexOf(event.data.id);
      if (index > -1) {
        this.selectedCaisseDebit.splice(index, 1);
      }
      this.selectedCaisseDebit.forEach((id) => {});
    } else if (this.identifiant === 'P') {
      const index = this.selectedCaissePDebit.indexOf(event.data.id);
      if (index > -1) {
        this.selectedCaissePDebit.splice(index, 1);
      }
      this.selectedCaissePDebit.forEach((id) => {});
    }
  }

  onRowSelect(event) {
    this.validerShow = true;
    this.identifiantC = event.data.identifiant;
    this.montantCredit = event.data.montant;
    //  this.sommeDebit = (this.montantDebit + this.sommeDebit).toFixed(3);
    this.sommeCredit = +(
      Number(this.montantCredit) + Number(this.sommeCredit)
    ).toFixed(3);
    if (this.identifiantC === 'C') {
      this.selectedCaisseCredit.push(event.data.id);
      this.selectedCaisseCredit.forEach((id) => {});
    } else if (this.identifiantC === 'P') {
      this.selectedCaissePCredit.push(event.data.id);
      this.selectedCaissePCredit.forEach((id) => {});
    }
  }
  onRowUnselect(event) {
    this.identifiantC = event.data.identifiant;
    this.montantCredit = event.data.montant;
    this.sommeCredit = +(
      Number(this.sommeCredit) - Number(this.montantCredit)
    ).toFixed(3);
    if (this.sommeCredit <= 0 && this.sommeDebit <= 0) {
      this.validerShow = false;
    }
    if (this.identifiantC === 'C') {
      const index = this.selectedCaisseCredit.indexOf(event.data.id);
      if (index > -1) {
        this.selectedCaisseCredit.splice(index, 1);
      }
      this.selectedCaisseCredit.forEach((id) => {});
    } else if (this.identifiantC === 'P') {
      const index = this.selectedCaissePCredit.indexOf(event.data.id);
      if (index > -1) {
        this.selectedCaissePCredit.splice(index, 1);
      }
      this.selectedCaissePCredit.forEach((id) => {});
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
