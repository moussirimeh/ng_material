import { Component, OnInit, ViewChild } from '@angular/core';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import { FacturationCollectiveService } from '../services/facturationCollective.service';
import { Client } from '../services/client';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Termen } from '../services/termen';
import { TermenService } from '../services/termen.service';
import { Termen1Service } from '../services/termen1.service';
import { Recettes } from '../services/recettes';
import { RecettesService } from '../services/recettes.service';
import { TermeService } from '../services/terme.service';
import { Terme } from '../services/terme';
import { FactureService } from '../services/facture.service';
import { Facture } from '../services/facture';
import { Brou } from '../services/brou';
import { BrouService } from '../services/brou.service';
import { FacturationTermeIndivService } from '../services/facturationTermeIndiv.service';
import { LoginService } from 'src/app/login/login.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { HistCreanceService } from '../services/histCreance.service';
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
  selector: 'app-facturationcollective',
  templateUrl: './facturationCollective.component.html',
  styleUrls: ['./facturationCollective.component.scss'],
})
export class FacturationCollectiveComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  ste: Ste;
  clients: Client[] = [];
  factures: any = [];
  displayDate = new Date().toLocaleDateString('en-GB');
  panelVisible = true;
  blocked = true;
  constructor(
    private steService: SteService,
    private facturationCollectiveService: FacturationCollectiveService,
    private facturationTermeIndivService: FacturationTermeIndivService,
    private termenService: TermenService,
    private termen1Service: Termen1Service,
    private recettesService: RecettesService,
    private termeService: TermeService,
    private factureService: FactureService,
    private brouService: BrouService,
    private histCreanceService: HistCreanceService,
    private loginService: LoginService
  ) {}
  async ngOnInit() {
    console.log('onInt');
    this.blocked = true;
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste;
      });
    if (this.ste[0].societe === 'CHAMAM DIVISION GROS') {
      await this.histCreanceService.soldeCreanceFin().toPromise().then();
      await this.facturationCollectiveService
        .facturer(this.displayDate + ' 00:00:00')
        .toPromise()
        .then((data) => {
          console.log('factAvCdg success');
        })
        .catch((error) => {
          console.log('factAvCdg error');
          this.blocked = true;
          return;
        });
      }
      /*
      await this.facturationCollectiveService
        .factAvCdg1()
        .toPromise()
        .then(data => {
          console.log('factAvCdg1 success');
        })
        .catch(error => {
          console.log('factAvCdg1 error');
        });

      await this.facturationCollectiveService
        .factAvCdg2()
        .toPromise()
        .then(data => {
          console.log('factAvCdg2 success');
        })
        .catch(error => {
          console.log('factAvCdg2 error');
        });

      await this.facturationCollectiveService
        .factAvCdg3(this.displayDate + ' 00:00:00')
        .toPromise()
        .then(data => {
          console.log('factAvCdg3 success');
        })
        .catch(error => {
          console.log('factAvCdg3 error');
        });*/

      await this.facturationCollectiveService
        .termeAll(this.displayDate, '')
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clients;
        })
        .catch((error) => {
          console.log('termeAll error');
          this.blocked = true;
          return;
        });
      if (this.clients.length > 0) {
        await this.calculDirect();
        await this.calculIndirect();
      }
      if (this.ste[0].societe === 'CHAMAM DIVISION GROS') {
        await this.histCreanceService.soldeCreanceDebut().toPromise().then();
      }
    this.blocked = false;
  }
  async calculDirect() {
    // const displayDate = new Date().toLocaleDateString('en-GB');
    console.log('debut calcul direct');
    this.clients = [];
    await this.facturationCollectiveService
      .termeAll(this.displayDate, 'O')
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
    if (this.clients.length > 0) {
      for (const clt of this.clients) {
        await this.termeC0('B/L', clt.code);
        await this.termeC0('AVOIR ', clt.code);
        await this.termeC0('AVOIR2', clt.code);
      }
    }
    console.log('fin calcul direct');
  }
  async calculIndirect() {
    console.log('debut calcul indirect');
    this.clients = [];
    await this.facturationCollectiveService
      .termeAll(this.displayDate, 'O')
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
    if (this.clients.length > 0) {
      let j = 0;
      for (const clt of this.clients) {
        await this.facturationCollectiveService
          .termeClt(clt.code, this.displayDate)
          .toPromise()
          .then((data) => {
            this.factures = data['_embedded'].facturationTermeIndiv;
          });
        let i = 1;
        for (const fc of this.factures) {
          if (fc.ref === '') {
            fc.ref = 'Des BL Sans Bon de Commandes';
          }
          // fc.deno = this.clients[j].deno;
          // fc.calculON = 'N';
          this.factures.push({
            id: i.toFixed(0),
            code: this.clients[j].code,
            deno: this.clients[j].deno,
            combine: fc.combine,
            ref: fc.ref,
            sNet: fc.sNet,
            calculON: 'N',
          });
          i++;
        }
        j++;
      }
    }
    console.log('fin calcul indirect');
  }
  async termeC0(nature: string, operateur: string) {
    let num = [];
    let numero = '';
    let v2: string;
    const index = this.clients.findIndex((x) => x.code === operateur);
    if (this.clients[index].typeC === 'O') {
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
    } /*
    v1=v2;
    v1 = v1 + 1;
    v2=v1;*/
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
    let factTermeRef: any = [];
    await this.facturationTermeIndivService
      .factTermeRef(operateur, nature, this.displayDate, '')
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
        if (fcTerme.ref !== '' && fcTerme.ref !== null) {
          refTemp = fcTerme.ref.substring(0, 10);
        }
        const term: Terme = {
          id: null,
          combine: numero,
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
        // console.log(term);

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
      if (timbre === 'O') {
        timbreTemp = 0.6;
        if (sensTemp === 'C') {
          sNet = sNet + 0.6;
        } else {
          sNet = sNet - 0.6;
        }
      } else {
        timbreTemp = 0;
      }

      const fact: Facture = {
        id: null,
        numero: numero,
        date: this.displayDate,
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
      /*
      let operation = '';
      if (nature.indexOf('B/L') >= 0) {
        operation = 'FR N° ' + numero + ' clt ' + operateur + ' NET ' + sNet.toFixed(3);
      } else {
        operation = 'AV N° ' + numero + ' clt ' + operateur + ' NET ' + sNet.toFixed(3);
      }
      await this.journalisation(operation);*/
      // Update le compteur de facture (TERMEN/TERMEN1)
      const nvNum: Termen = { id: num[0].id, numero: numero };
      console.log(nvNum);
      console.log(this.clients[index]);
      if (this.clients[index].typeC === 'O') {
        console.log(nvNum);
        await this.termenService
          .updateTermen(nvNum)
          .toPromise()
          .then((data) => {
            console.log('update termen success');
          });
      } else {
        console.log(nvNum);
        await this.termen1Service
          .updateTermen1(nvNum)
          .toPromise()
          .then((data) => {
            console.log('update termen1 success');
          });
      }
      // Update dans le table BROU (add)
      let brouFacts: any = [];
      await this.facturationCollectiveService
        .brouFact(numero, this.displayDate)
        .toPromise()
        .then((data) => {
          brouFacts = data['_embedded'].brous;
        });
      if (brouFacts.length > 0) {
        let sensTmpBrou;
        let pieceTmpBrou;
        if (nature.indexOf('B/L') >= 0) {
          sensTmpBrou = 'D';
          pieceTmpBrou = 'FACTURE';
        } else {
          sensTmpBrou = 'C';
          pieceTmpBrou = 'AVOIR';
        }
        const brouUp: Brou = {
          id: brouFacts.id,
          code: brouFacts.code,
          compte: operateur,
          nature: brouFacts.nature,
          piece: pieceTmpBrou,
          montant: sNet,
          libelle: brouFacts.libelle,
          sens: sensTmpBrou,
          date: this.displayDate,
          regle: brouFacts.regle,
          numero: numero,
          num: brouFacts.num,
          cle: brouFacts.cle,
          op1: brouFacts.op1,
          operateur: brouFacts.operateur,
          echeance: brouFacts.echeance,
          lig: brouFacts.lig,
          apurement: brouFacts.apurement,
          dateApur: brouFacts.dateApur,
          datVer: brouFacts.datVer,
          datRec: brouFacts.datRec,
          etat: brouFacts.etat,
          etat2: brouFacts.etat2,
          banqEqm: brouFacts.banqEqm,
          borVer: brouFacts.borVer,
          borEnc: brouFacts.borEnc,
          tire: brouFacts.tire,
          banque: brouFacts.banque,
          borRtr: brouFacts.borRtr,
          numPiece: brouFacts.numPiece,
        };
        await this.brouService
          .updateput(brouUp)
          .toPromise()
          .then((data) => {
            console.log('update brou success');
          });
      }

      // Update dans le table BROU (modify)
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
        date: this.displayDate,
        regle: null,
        numero: numero,
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

  async calculer() {
    const selectedRows: any = this.grid.getSelectedRecords();
    if (selectedRows.length > 0) {
      if (this.factures.length === selectedRows.length) {
        // tous rep sont Oui
        await this.terme0('B/L', selectedRows.code, '');
        await this.terme0('AVOIR ', selectedRows.code, '');
        await this.terme0('AVOIR2', selectedRows.code, '');
      } else {
        // il y a des Non
        await this.terme0('B/L', selectedRows.code, selectedRows.ref);
        await this.terme0('AVOIR ', selectedRows.code, selectedRows.ref);
        await this.terme0('AVOIR2', selectedRows.code, selectedRows.ref);
      }
    }
  }
  async terme0(nature: string, operateur: string, ref: string) {
    let num = [];
    let numero = '';
    let v2: string;
    const index = this.clients.findIndex((x) => x.code === operateur);
    if (this.clients[index].typeC === 'O') {
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
    } /*
    v1=v2;
    v1 = v1 + 1;
    v2=v1;*/
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

    let factTermeRef: any = [];

    if (ref === '') {
      await this.facturationTermeIndivService
        .factTermeRef(operateur, nature, this.displayDate, '')
        .toPromise()
        .then((data) => {
          factTermeRef = data['_embedded'].factureTermeRefs;
        });
    } else {
      await this.facturationTermeIndivService
        .factTermeRef(operateur, nature, this.displayDate, ref)
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
          combine: numero,
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
      if (timbre === 'O') {
        timbreTemp = 0.6;
        if (sensTemp === 'C') {
          sNet = sNet + 0.6;
        } else {
          sNet = sNet - 0.6;
        }
      } else {
        timbreTemp = 0;
      }

      const fact: Facture = {
        id: null,
        numero: numero,
        date: this.displayDate,
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
          'FR N° ' + numero + ' clt ' + operateur + ' NET ' + sNet.toFixed(3);
      } else {
        operation =
          'AV N° ' + numero + ' clt ' + operateur + ' NET ' + sNet.toFixed(3);
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
      // Update le compteur de facture (TERMEN/TERMEN1)
      const nvNum: Termen = { id: num[0].id, numero: numero };
      if (this.clients[index].typeC === 'O') {
        await this.termenService
          .updateTermen(nvNum)
          .toPromise()
          .then((data) => {
            console.log('update termen success');
          });
      } else {
        await this.termen1Service
          .updateTermen1(nvNum)
          .toPromise()
          .then((data) => {
            console.log('update termen1 success');
          });
      }
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
        date: this.displayDate,
        regle: null,
        numero: numero,
        num: null,
        cle: null,
        op1: null,
        operateur: null,
        echeance: null,
        lig: numero,
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
}
