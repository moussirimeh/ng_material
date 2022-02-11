import {
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { FacturationTermeIndiv } from '../services/facturationTermeIndiv';
import { FacturationTermeIndivService } from '../services/facturationTermeIndiv.service';
import { TermenService } from '../services/termen.service';
import { Termen1Service } from '../services/termen1.service';
import { Recettes } from '../services/recettes';
import { RecettesService } from '../services/recettes.service';
import { EditSettingsModel, IEditCell } from '@syncfusion/ej2-angular-grids';
import { TermeService } from '../services/terme.service';
import { Terme } from '../services/terme';
import { FactureService } from '../services/facture.service';
import { Facture } from '../services/facture';
import { Brou } from '../services/brou';
import { BrouService } from '../services/brou.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { LoginService } from 'src/app/login/login.service';
import { OverlayPanel } from 'primeng/primeng';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-reconstitutionfacture',
  templateUrl: './reconstitutionFacture.component.html',
  styleUrls: ['./reconstitutionFacture.component.scss'],
  providers: [DatePipe],
})
export class ReconstitutionFactureComponent implements OnInit {
  @ViewChild('gridFact')
  public grid: GridComponent;
  date = new Date();
  dat = this.datePipe.transform(this.date, 'dd/MM/yyyy');
  tn;
  clients: Client[];
  selectedClient: Client;
  afficherClicked = false;
  factPar;
  factures: FacturationTermeIndiv[];
  public editSettings: EditSettingsModel;
  public boolParams: IEditCell;
  IdentifClientVisible = false;
  gridVisible = false;
  parCmd = false;
  selectedFacts = [];
  blocked = false;
  numero = '';
  numDisabled = false;
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
    private clientService: ClientService,
    private facturationTermeIndivService: FacturationTermeIndivService,
    private termenService: TermenService,
    private termen1Service: Termen1Service,
    private recettesService: RecettesService,
    private termeService: TermeService,
    private factureService: FactureService,
    private brouService: BrouService,
    private loginService: LoginService,
    private datePipe: DatePipe,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = '';
    this.config.clearAllText = 'Supprimer tous';
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
    await this.reloadDataClients();
    this.intialiserSelectedClient();
    this.factures = [];
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
    };
    this.boolParams = { params: { value: 'O' } };
  }

  async reloadDataClients() {
    await this.clientService
      .getClientsReleve()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }

  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    if (String(this.selectedClient) !== 'null') {
      if (this.selectedClient.id !== null && this.numDisabled) {
        if (
          (this.selectedClient.comm === 'N' && Number(this.numero) < 10000) ||
          (this.selectedClient.comm === 'O' && Number(this.numero) > 10000)
        ) {
          await this.performCalcule(e);
        } else {
          this.msgs =
            'Vérifiez le numéro et si le client est ordinaire ou non !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('num').focus();
          this.ov.show(e, document.getElementById('num'));
          this.numDisabled = false;
          this.numero = '';
        }
      } else {
        if (String(this.selectedClient.id) === 'null') {
          this.msgs = 'Veuillez selectionner un client !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('client').focus();
          this.ov.show(e, document.getElementById('client'));
        } else {
          await this.verifier(e);
          if (this.numDisabled) {
            await this.afficher(e);
          }
        }
      }
    } else {
      this.msgs = 'Veuillez selectionner un client !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('client').focus();
      this.ov.show(e, document.getElementById('client'));
    }
  }
  async calculer(e) {
    this.selectedFacts = this.grid.getSelectedRecords();
    if (this.selectedFacts.length === 1) {
      this.blocked = true;
      this.gridVisible = false;
      this.afficherClicked = false;
      const selectedRows: any = this.grid.getSelectedRecords();
      // calcul par Bon de commande
      for (const fc of selectedRows) {
        if (fc.ref === 'Des BL Sans Bon de Commandes') {
          await this.terme0('B/L', fc.code, '');
          await this.terme0('AVOIR ', fc.code, '');
          await this.terme0('AVOIR2', fc.code, '');
        } else {
          await this.terme0('B/L', fc.code, fc.ref);
          await this.terme0('AVOIR ', fc.code, fc.ref);
          await this.terme0('AVOIR2', fc.code, fc.ref);
        }
      }
      this.blocked = false;
    } else {
      this.msgs = 'Selectionnez un seul BC, S.V.P !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btCalculer'));
    }
  }
  async termeC0(nature: string, operateur: string) {
    let factTermeRef: any = [];
    await this.facturationTermeIndivService
      .factTermeRef(operateur, nature, this.dat, '')
      .toPromise()
      .then((data) => {
        factTermeRef = data['_embedded'].factureTermeRefs;
      });
    let sHt = 0,
      sRemise = 0,
      sBase0 = 0,
      sBase10 = 0,
      sBase17 = 0,
      sBase29 = 0,
      sNet,
      timbre;
    let recettes: any;
    if (factTermeRef.length > 0) {
      //// Update table RECETTES (set GEL='I')
      for (const fcTerme of factTermeRef) {
        await this.recettesService
          .getRecettesByCombine(fcTerme.combine)
          .toPromise()
          .then((data) => {
            recettes = data['_embedded'].recettes[0];
          });
        const recette: Recettes = {
          id: recettes.id,
          combine: recettes.combine,
          date: recettes.date,
          net: recettes.net,
          ht: recettes.ht,
          remise: recettes.remise,
          operateur: recettes.operateur,
          sens: recettes.sens,
          vendeur: recettes.vendeur,
          ref: recettes.ref,
          gel: 'I',
          base0: recettes.base0,
          base10: recettes.base10,
          base17: recettes.base17,
          base29: recettes.base29,
          reg: recettes.reg,
          datReg: recettes.datReg,
          caisse: recettes.caisse,
          timbre: recettes.timbre,
          modify: recettes.modify,
          livrObserv: recettes.livrObserv,
          bcEqm: recettes.bcEqm,
          livrObservat: recettes.livrObserv,
          bonSort: recettes.bonSort,
        };
        await this.recettesService
          .updateRecettes(recette)
          .toPromise()
          .then((data) => {
            console.log('update recettes success gel=I');
          });
      }
      ///// Ajout  enregistrements dans le table 'TERME'
      timbre = factTermeRef[0].timbre;
      for (const fcTerme of factTermeRef) {
        let refTemp;
        if (fcTerme.ref !== '') {
          refTemp = fcTerme.ref;
        }
        const term: Terme = {
          id: null,
          combine: this.numero,
          date: fcTerme.date,
          net: fcTerme.net,
          ht: fcTerme.ht,
          remise: fcTerme.remise,
          operateur: operateur,
          commande: fcTerme.combine,
          ref0: refTemp,
          base0: fcTerme.base0,
          base10: fcTerme.base10,
          base17: fcTerme.base17,
          base29: fcTerme.base29,
        };
        await this.termeService
          .createTerme(term)
          .toPromise()
          .then((data) => {
            console.log('terme insert success');
          });
        sHt = sHt + Number(fcTerme.ht);
        sRemise = sRemise + Number(fcTerme.remise);
        sBase0 = sBase0 + Number(fcTerme.base0);
        sBase10 = sBase10 + Number(fcTerme.base10);
        sBase17 = sBase17 + Number(fcTerme.base17);
        sBase29 = sBase29 + Number(fcTerme.base29);
      }
      sNet = Number(sBase0) + sBase10 * 1.13 + sBase17 * 1.19 + sBase29 * 1.07;
      // Add un enregistrement dans le table FACTURE
      let sensTemp = null;

      if (nature.indexOf('B/L') >= 0) {
        sensTemp = 'C';
      } else {
        sensTemp = 'D';
      }
      let timbreTemp = null;
      if (timbre === 'O' && nature.indexOf('B/L') >= 0) {
        timbreTemp = 0.6;
        sNet = sNet + 0.6;
      } else {
        timbreTemp = 0;
      }

      const fact: Facture = {
        id: null,
        numero: this.numero,
        date: this.dat,
        net: String(sNet),
        ht: String(sHt),
        remise: String(sRemise),
        operateur: operateur,
        sens: sensTemp,
        base0: String(sBase0),
        base10: String(sBase10),
        base17: String(sBase17),
        base29: String(sBase29),
        timbre: String(timbreTemp),
        intComx: null,
        intComp: null,
        inter: null,
        transport: null,
        taxePm: null,
      };
      await this.factureService
        .createFacture(fact)
        .toPromise()
        .then((data) => {
          console.log('success create facture');
        });
      // jounalisation
      let operation = '';
      if (nature.indexOf('B/L') >= 0) {
        operation =
          'FR N° ' +
          this.numero +
          ' clt ' +
          operateur +
          ' NET ' +
          sNet.toFixed(3);
      } else {
        operation =
          'AV N° ' +
          this.numero +
          ' clt ' +
          operateur +
          ' NET ' +
          sNet.toFixed(3);
      }
      this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          operation
        )
        .subscribe((data) => {
          console.log(data);
        });
      // Update dans le table BROU (modify or add)
      /*let maxId;
      await this.brouService
        .getMaxId()
        .toPromise()
        .then((value) => {
          maxId = Number(value);
        });
      maxId++;*/
      // add into BROU
      let sensTempBrou;
      let pieceTempBrou;
      if (nature.indexOf('B/L') >= 0) {
        sensTempBrou = 'D';
        pieceTempBrou = 'FACTURE';
      } else {
        sensTempBrou = 'C';
        pieceTempBrou = 'AVOIR';
      }
      const brouu: Brou = {
        id: null,
        code: null,
        compte: operateur,
        nature: null,
        piece: pieceTempBrou,
        montant: sNet,
        libelle: null,
        sens: sensTempBrou,
        date: this.dat,
        regle: null,
        numero: this.numero,
        num: null,
        cle: null,
        op1: null,
        operateur: null,
        echeance: null,
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
        tire: null,
        banque: null,
        borRtr: null,
        numPiece: null,
      };
      await this.brouService
        .createBrou(brouu)
        .toPromise()
        .then((data) => {
          console.log('insert brou success');
        });
    }
  }
  async terme0(nature: string, operateur: string, ref: string) {
    let factTermeRef: any = [];
    if (ref === '') {
      await this.facturationTermeIndivService
        .factTermeRef(operateur, nature, this.dat, '')
        .toPromise()
        .then((data) => {
          factTermeRef = data['_embedded'].factureTermeRefs;
        });
    } else {
      await this.facturationTermeIndivService
        .factTermeRef(operateur, nature, this.dat, ref)
        .toPromise()
        .then((data) => {
          factTermeRef = data['_embedded'].factureTermeRefs;
        });
    }
    let sHt = 0,
      sRemise = 0,
      sBase0 = 0,
      sBase10 = 0,
      sBase17 = 0,
      sBase29 = 0,
      sNet,
      timbre;
    let recettes: any;
    if (factTermeRef.length > 0) {
      //// Update table RECETTES (set GEL='I')
      for (const fcTerme of factTermeRef) {
        if (ref === '') {
          await this.recettesService
            .getRecettesByCombine(fcTerme.combine)
            .toPromise()
            .then((data) => {
              recettes = data['_embedded'].recettes[0];
            });
        }
        const recette: Recettes = {
          id: recettes.id,
          combine: recettes.combine,
          date: recettes.date,
          net: recettes.net,
          ht: recettes.ht,
          remise: recettes.remise,
          operateur: recettes.operateur,
          sens: recettes.sens,
          vendeur: recettes.vendeur,
          ref: recettes.ref,
          gel: 'I',
          base0: recettes.base0,
          base10: recettes.base10,
          base17: recettes.base17,
          base29: recettes.base29,
          reg: recettes.reg,
          datReg: recettes.datReg,
          caisse: recettes.caisse,
          timbre: recettes.timbre,
          modify: recettes.modify,
          livrObserv: recettes.livrObserv,
          bcEqm: recettes.bcEqm,
          livrObservat: recettes.livrObserv,
          bonSort: recettes.bonSort,
        };
        await this.recettesService
          .updateRecettes(recette)
          .toPromise()
          .then((data) => {
            console.log('update recettes success gel=I');
          });
      }
      ///// Ajout  enregistrements dans le table 'TERME'
      timbre = factTermeRef[0].timbre;
      for (const fcTerme of factTermeRef) {
        let refTemp;
        if (fcTerme.ref !== '') {
          refTemp = fcTerme.ref;
        }
        const term: Terme = {
          id: null,
          combine: this.numero,
          date: fcTerme.date,
          net: fcTerme.net,
          ht: fcTerme.ht,
          remise: fcTerme.remise,
          operateur: operateur,
          commande: fcTerme.combine,
          ref0: refTemp,
          base0: fcTerme.base0,
          base10: fcTerme.base10,
          base17: fcTerme.base17,
          base29: fcTerme.base29,
        };
        console.log(term);

        await this.termeService
          .createTerme(term)
          .toPromise()
          .then((data) => {
            console.log('terme insert success');
          });
        sHt = sHt + Number(fcTerme.ht);
        sRemise = sRemise + Number(fcTerme.remise);
        sBase0 = sBase0 + Number(fcTerme.base0);
        sBase10 = sBase10 + Number(fcTerme.base10);
        sBase17 = sBase17 + Number(fcTerme.base17);
        sBase29 = sBase29 + Number(fcTerme.base29);
      }
      sNet = Number(sBase0) + sBase10 * 1.13 + sBase17 * 1.19 + sBase29 * 1.07;
      // Add un enregistrement dans le table FACTURE
      let sensTemp = null;

      if (nature.indexOf('B/L') >= 0) {
        sensTemp = 'C';
      } else {
        sensTemp = 'D';
      }
      let timbreTemp = null;
      if (timbre === 'O' && nature.indexOf('B/L') >= 0) {
        timbreTemp = 0.6;
        sNet = sNet + 0.6;
      } else {
        timbreTemp = 0;
      }

      const fact: Facture = {
        id: null,
        numero: this.numero,
        date: this.dat,
        net: String(sNet),
        ht: String(sHt),
        remise: String(sRemise),
        operateur: operateur,
        sens: sensTemp,
        base0: String(sBase0),
        base10: String(sBase10),
        base17: String(sBase17),
        base29: String(sBase29),
        timbre: String(timbreTemp),
        intComx: null,
        intComp: null,
        inter: null,
        transport: null,
        taxePm: null,
      };
      await this.factureService
        .createFacture(fact)
        .toPromise()
        .then((data) => {
          console.log('success create facture');
        });
      // jounalisation
      let operation = '';
      if (nature.indexOf('B/L') >= 0) {
        operation =
          'FR N° ' +
          this.numero +
          ' clt ' +
          operateur +
          ' NET ' +
          sNet.toFixed(3);
      } else {
        operation =
          'AV N° ' +
          this.numero +
          ' clt ' +
          operateur +
          ' NET ' +
          sNet.toFixed(3);
      }
      this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          operation
        )
        .subscribe((data) => {
          console.log(data);
        });
      // Update dans le table BROU (modify or add)
      /*let maxId;
      await this.brouService
        .getMaxId()
        .toPromise()
        .then((value) => {
          maxId = Number(value);
        });
      maxId++;*/
      // add into BROU
      let sensTempBrou;
      let pieceTempBrou;
      if (nature.indexOf('B/L') >= 0) {
        sensTempBrou = 'D';
        pieceTempBrou = 'FACTURE';
      } else {
        sensTempBrou = 'C';
        pieceTempBrou = 'AVOIR';
      }
      const brouu: Brou = {
        id: null,
        code: null,
        compte: operateur,
        nature: null,
        piece: pieceTempBrou,
        montant: sNet,
        libelle: null,
        sens: sensTempBrou,
        date: this.dat,
        regle: null,
        numero: this.numero,
        num: null,
        cle: null,
        op1: null,
        operateur: null,
        echeance: null,
        lig: this.numero,
        apurement: null,
        dateApur: null,
        datVer: null,
        datRec: null,
        etat: null,
        etat2: null,
        banqEqm: null,
        borVer: null,
        borEnc: null,
        tire: null,
        banque: null,
        borRtr: null,
        numPiece: null,
      };
      await this.brouService
        .createBrou(brouu)
        .toPromise()
        .then((data) => {
          console.log('insert brou success');
        });
    }
  }
  intialiserSelectedClient() {
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

  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  async verifier(e) {
    if (this.numero.length !== 5) {
      this.msgs = 'Le numero de FACTURE doit être de 5 caractères !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('num').focus();
      this.ov.show(e, document.getElementById('num'));
    } else {
      let factTemp;
      await this.factureService
        .getFactureByNumero(this.numero)
        .toPromise()
        .then((data) => {
          factTemp = data['_embedded'].factures;
        });
      if (factTemp.length > 0) {
        this.msgs = 'Ce numéro est déjà utilisé !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('num').focus();
        this.ov.show(e, document.getElementById('num'));
      } else {
        let termenTmp;
        let termen1Tmp;
        await this.termenService
          .getTermen()
          .toPromise()
          .then((data) => {
            termenTmp = data['_embedded'].termen;
          });
        await this.termen1Service
          .getTermen1()
          .toPromise()
          .then((data) => {
            termen1Tmp = data['_embedded'].termen1;
          });
        if (
          (Number(this.numero) < 10000 &&
            Number(this.numero) > Number(termenTmp[0].numero)) ||
          (Number(this.numero) > 10000 &&
            Number(this.numero) > Number(termen1Tmp[0].numero))
        ) {
          this.msgs =
            'Facture inéxistante ! Entrez le numéro de facture annulé S.V.P.';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('num').focus();
          this.ov.show(e, document.getElementById('num'));
        } else {
          this.numDisabled = true;
        }
      }
    }
  }
  async performCalcule(e) {
    let temp = [];
    this.factures = [];
    if (this.selectedClient.comm === 'O') {
      this.parCmd = true;
      await this.facturationTermeIndivService
        .facturationTermeIndivParCmd(this.selectedClient.code, this.datePipe.transform(this.date, 'dd/MM/yyyy'))
        .toPromise()
        .then((data) => {
          temp = data['_embedded'].facturationTermeIndiv;
        });
      if (this.factures.length < 1) {
        this.msgs = 'Aucun B/L en Cours !!';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('btOk').focus();
        this.ov.show(e, document.getElementById('btOk'));
        this.intialiserSelectedClient();
        this.numDisabled = false;
        this.numero = '';
      } else {
        let i = 1;
        for (const fc of temp) {
          if (fc.ref === '') {
            fc.ref = 'Des BL Sans Bon de Commandes';
          }
          fc.deno = this.selectedClient.deno;
          fc.calculON = 'N';
          this.factures.push({
            id: i.toFixed(0),
            code: this.selectedClient.code,
            deno: this.selectedClient.deno,
            combine: fc.combine,
            ref: fc.ref,
            sNet: fc.sNet,
            calculON: 'N',
          });
          i++;
        }
      }
    } else {
      await this.termeC0('B/L', this.selectedClient.code);
      await this.termeC0('AVOIR ', this.selectedClient.code);
      await this.termeC0('AVOIR2', this.selectedClient.code);
      this.intialiserSelectedClient();
      this.numDisabled = false;
      this.numero = '';
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
