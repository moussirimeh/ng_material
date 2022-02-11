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
import { Termen } from '../services/termen';
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
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
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
  selector: 'app-reconstitution-facture-terme',
  templateUrl: './reconstitution-facture-terme.component.html',
  styleUrls: ['./reconstitution-facture-terme.component.scss'],
  providers: [DatePipe],
})
export class ReconstitutionFactureTermeComponent implements OnInit {
  @ViewChild('gridFact')
  public grid: GridComponent;
  date = new Date();
  dateMin = null;
  dateMax = null;
  showDate = false;
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
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  ngOnInit() {
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
    this.reloadDataClients();
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
        // this.clients.unshift(this.selectedClient);
      });
  }

  onClientSelect() {
    if (this.selectedClient !== null) {
      if (this.selectedClient.comm === 'O') {
        this.factPar = 'COMMANDE';
      } else if (this.selectedClient.comm === 'N') {
        this.factPar = 'B/L';
      } else {
        this.factPar = ' ';
      }
      this.selectedClient.marque = Number(this.selectedClient.marque).toFixed(
        0
      );
      this.IdentifClientVisible = true;
    } else {
      this.intialiserSelectedClient();
      this.IdentifClientVisible = false;
    }
  }
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.numDisabled) {
      if (
        String(this.selectedClient) !== 'null' &&
        String(this.selectedClient.code) !== 'null'
      ) {
        let temp = [];
        this.factures = [];
        if (this.selectedClient.comm === 'O') {
          this.parCmd = true;
          await this.facturationTermeIndivService
            .facturationTermeIndivParCmd(
              this.selectedClient.code,
              this.datePipe.transform(this.date, 'dd/MM/yyyy')
            )
            .toPromise()
            .then((data) => {
              temp = data['_embedded'].facturationTermeIndiv;
            });
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
        } else {
          this.parCmd = false;
          console.log(this.datePipe.transform(this.date, 'dd/MM/yyyy'));
          await this.facturationTermeIndivService
            .facturationTermeIndivParBl(
              this.selectedClient.code,
              this.datePipe.transform(this.date, 'dd/MM/yyyy')
            )
            .toPromise()
            .then((data) => {
              console.log(data);

              temp = data['_embedded'].facturationTermeIndiv;
            });
          let i = 1;
          for (const fc of temp) {
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
        if (this.factures.length > 0) {
          this.gridVisible = true;
          this.afficherClicked = true;
          this.numDisabled = true;
        } else {
          this.msgs = 'Aucun B/L en Cours !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btOk'));
        }
      } else {
        this.msgs = 'Veuillez selectionner un client !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('client').focus();
        this.ov.show(e, document.getElementById('client'));
      }
    } else {
      await this.verifier(e);
    }
  }
  async calculer() {
    this.blocked = true;
    this.selectedFacts = this.grid.getSelectedRecords();
    this.gridVisible = false;
    this.afficherClicked = false;
    const selectedRows: any = this.grid.getSelectedRecords();
    if (!this.parCmd) {
      // Calcul par BL
      if (this.factures.length === selectedRows.length) {
        // tous rep sont Oui
        await this.termeC0('B/L', this.selectedClient.code);
        await this.termeC0('AVOIR ', this.selectedClient.code);
        await this.termeC0('AVOIR2', this.selectedClient.code);
      } else {
        // il y a des Non
        await this.termeBl('B/L', this.selectedClient.code);
        await this.termeBl('AVOIR ', this.selectedClient.code);
        await this.termeBl('AVOIR2', this.selectedClient.code);
      }
    } else {
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
    }
    this.blocked = false;
  }
  async termeC0(nature: string, operateur: string) {
    /*let num = [];
    let numero = '';
    let v2: string;
    if (this.selectedClient.typeC === 'O') {
      await this.termenService
        .getTermen()
        .toPromise()
        .then((data) => {
          num = data['_embedded'].termen;
        });
      if (num.length > 0) {
        v2 = num[0].numero;
      } else {
        v2 = '00000';
      }
    } else {
      await this.termen1Service
        .getTermen1()
        .toPromise()
        .then((data) => {
          num = data['_embedded'].termen1;
        });
      if (num.length > 0) {
        v2 = num[0].numero;
      } else {
        v2 = '00000';
      }
    }
    v2 = (Number(v2) + 1).toFixed(0);
    switch (v2.length) {
      case 1: {
        numero = '0000' + v2;
        break;
      }
      case 2: {
        numero = '000' + v2;
        break;
      }
      case 3: {
        numero = '00' + v2;
        break;
      }
      case 4: {
        numero = '0' + v2;
        break;
      }
      case 5: {
        numero = v2;
        break;
      }
    }*/
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
        date: this.datePipe.transform(this.date, 'dd/MM/yyyy'),
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
        date: this.datePipe.transform(this.date, 'dd/MM/yyyy'),
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
      await this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          operation
        )
        .toPromise().then((data) => {
          console.log(data);
        });
    }
  }
  async termeBl(nature: string, operateur: string) {
    /*let num = [];
    let numero = '';
    let v2: string;
    if (this.selectedClient.typeC === 'O') {
      await this.termenService
        .getTermen()
        .toPromise()
        .then((data) => {
          num = data['_embedded'].termen;
        });
      if (num.length > 0) {
        v2 = num[0].numero;
      } else {
        v2 = '00000';
      }
    } else {
      await this.termen1Service
        .getTermen1()
        .toPromise()
        .then((data) => {
          num = data['_embedded'].termen1;
        });
      if (num.length > 0) {
        v2 = num[0].numero;
      } else {
        v2 = '00000';
      }
    }
    // v1=v2;
    // v1 = v1 + 1;
    // v2=v1;
    v2 = (Number(v2) + 1).toFixed(0);
    switch (v2.length) {
      case 1: {
        numero = '0000' + v2;
        break;
      }
      case 2: {
        numero = '000' + v2;
        break;
      }
      case 3: {
        numero = '00' + v2;
        break;
      }
      case 4: {
        numero = '0' + v2;
        break;
      }
      case 5: {
        numero = v2;
        break;
      }
    }*/
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
      let addFactFlag = false;

      for (const selectedFc of this.selectedFacts) {
        if (selectedFc.combine.indexOf(nature) >= 0) {
          addFactFlag = true;
          await this.recettesService
            .getRecettesByCombine(selectedFc.combine)
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
      }

      ///// Ajout  enregistrements dans le table 'TERME'
      for (const selectedFc of this.selectedFacts) {
        if (selectedFc.combine.indexOf(nature) >= 0) {
          const checkCombineExistence = (combineParam) =>
            factTermeRef.some(({ combine }) => combine === combineParam);
          if (checkCombineExistence(selectedFc.combine)) {
            const fcTerme = factTermeRef.find(
              (i) => i.combine === selectedFc.combine
            );
            timbre = fcTerme.timbre;
            let refTemp = null;
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
        }
      }
      sNet = Number(sBase0) + sBase10 * 1.13 + sBase17 * 1.19 + sBase29 * 1.07;
      // Add un enregistrement dans le table FACTURE
      if (addFactFlag) {
        let sensTemp = null;

        if (nature.indexOf('B/L') >= 0) {
          sensTemp = 'C';
        } else {
          sensTemp = 'D';
        }
        let timbreTemp = 0;
        if (timbre === 'O' && nature.indexOf('B/L') >= 0) {
          timbreTemp = 0.6;
          sNet = sNet + 0.6;
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
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            operation
          )
          .toPromise().then((data) => {
            console.log(data);
          });
      }
    }
  }
  async terme0(nature: string, operateur: string, ref: string) {
    /* let num = [];
    let numero = '';
    let v2: string;
    if (this.selectedClient.typeC === 'O') {
      await this.termenService
        .getTermen()
        .toPromise()
        .then((data) => {
          num = data['_embedded'].termen;
        });
      if (num.length > 0) {
        v2 = num[0].numero;
      } else {
        v2 = '00000';
      }
    } else {
      await this.termen1Service
        .getTermen1()
        .toPromise()
        .then((data) => {
          num = data['_embedded'].termen1;
        });
      if (num.length > 0) {
        v2 = num[0].numero;
      } else {
        v2 = '00000';
      }
    }
    // v1=v2;
    // v1 = v1 + 1;
    // v2=v1;
    v2 = (Number(v2) + 1).toFixed(0);
    switch (v2.length) {
      case 1: {
        numero = '0000' + v2;
        break;
      }
      case 2: {
        numero = '000' + v2;
        break;
      }
      case 3: {
        numero = '00' + v2;
        break;
      }
      case 4: {
        numero = '0' + v2;
        break;
      }
      case 5: {
        numero = v2;
        break;
      }
    }
*/
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
      await this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          operation
        )
        .toPromise().then((data) => {
          console.log(data);
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
  changer() {
    const selected: any = this.grid.getSelectedRecords()[0];
    if (selected.calculerON === 'O') {
      selected.calculerON = 'N';
    } else {
      selected.calculerON = 'O';
    }
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async verifier(e) {
    if (this.numero.length === 0) {
      this.msgs = 'Veuillez entrer le numéro de facture à reconstituer !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('num').focus();
      this.ov.show(e, document.getElementById('num'));
    } else {
      if (Number(this.numero) !== 0) {
        let tmp = '';
        for (let i = 0; i < 5 - this.numero.length; i++) {
          tmp = tmp + '0';
        }
        this.numero = tmp + this.numero;
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
            let frePrec,
              freSuiv: Facture = null;
            let freTmp = [];
            await this.factureService
              .getFactureByNumero(
                this.numero.substr(0, 4) +
                  String(Number(this.numero.substr(4, 1)) - 1)
              )
              .toPromise()
              .then((data) => {
                freTmp = data['_embedded'].factures;
                // frePrec = data['_embedded'].factures[0];
              });
            if (freTmp.length > 0) {
              frePrec = freTmp[0];
              this.date = new Date(
                this.datePipe.transform(frePrec.date, 'dd/MM/yyyy')
              );
              this.dateMin = new Date(
                this.datePipe.transform(frePrec.date, 'dd/MM/yyyy')
              );
            } else {
              this.date = new Date('01/01/' + String(new Date().getFullYear()));
              this.dateMin = new Date(
                '01/01/' + String(new Date().getFullYear())
              );
            }
            await this.factureService
              .getFactureByNumero(
                this.numero.substr(0, 4) +
                  String(Number(this.numero.substr(4, 1)) + 1)
              )
              .toPromise()
              .then((data) => {
                freTmp = data['_embedded'].factures;
                // freSuiv = data['_embedded'].factures[0];
              });

            // this.date = new Date(this.datePipe.transform(frePrec.date, 'dd/MM/yyyy'));
            // this.dateMin = new Date(this.datePipe.transform(frePrec.date, 'dd/MM/yyyy'));
            if (freTmp.length > 0) {
              freSuiv = freTmp[0];
              // this.dateMax = new Date(this.datePipe.transform(freSuiv.date, 'dd/MM/yyyy'));
              this.dateMax = new Date(freSuiv.date);
            } else {
              this.dateMax = new Date();
            }
            // this.dateMax = new Date(this.datePipe.transform(freSuiv.date, 'dd/MM/yyyy'));

            this.numDisabled = true;
            this.showDate = true;
          }
        }
      } else {
        this.numero = '';
        this.msgs = 'Veuillez entrer le numéro de facture à reconstituer !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('num').focus();
        this.ov.show(e, document.getElementById('num'));
      }
    }
  }
  reinitialiser() {
    this.numDisabled = false;
    this.numero = '';
    this.showDate = false;
    this.selectedClient = null;
    if (this.gridVisible) {
      this.gridVisible = false;
      this.afficherClicked = false;
    }
  }
}
