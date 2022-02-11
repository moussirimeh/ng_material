import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Dialog, OverlayPanel } from 'primeng/primeng';
import { ClientService } from '../services/client.service';
import { RepresanService } from '../services/represan.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { SecteurService } from '../services/secteur.service';
import { ZoneService } from '../services/zone.service';
import { GroupeService } from '../services/groupe.service';
import { RecouvService } from '../services/recouv.service';
import { ViewMouveService } from '../services/view-mouve.service';
import { ViewMouve1Service } from '../services/view-mouve1.service';
import { ViewMouve2Service } from '../services/view-mouve2.service';
import { Client } from '../services/client';
import { Zone } from '../services/zone';

import { EtatCommandeClientComponent } from '../etat-commande-client/etat-commande-client.component';

import { ReglementClientComponent } from '../reglementClient/reglementClient.component';
import { ReleveClientComponent } from '../releveClient/releveClient.component';
import { AnalyseCaMargesComponent } from '../analyse-ca-marges/analyse-ca-marges.component';
import {EtatOffreEnvoyeComponent} from '../etat-offre-envoye/etat-offre-envoye.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-fiche-client',
  templateUrl: './fiche-client.component.html',
  styleUrls: ['./fiche-client.component.scss'],
})
export class FicheClientComponent implements OnInit {
  @ViewChild(EtatOffreEnvoyeComponent) EtatOffreEnvoye;
  @ViewChild(ReleveClientComponent) Releve;
  @ViewChild(ReglementClientComponent) ReglementClient;
  @ViewChild(AnalyseCaMargesComponent) AnalyseCaMarges;
  @ViewChild(EtatCommandeClientComponent) etatcmdclt ;
  @ViewChild('opp')
  public opp: OverlayPanel;
  visibledMouvements = false;
  visibleEtatCmdClt = false;
  visibleEtatOffreEnvoyes = false;
  listClient = new Array();
  selectedClient;
  readonly;
  codeClient: string;
  adresseClient: string;
  msgerror: string;
  villeClient: string;
  dateCreationClient: string;
  typologieClient: string;
  cpClient: string;
  zoneClient: string;
  activiteClient: string;
  adrUsineClient: string;
  adrSiegeClient: string;
  emailClient: string;
  TelClient: string;
  faxClient: string;
  RevConClient: string;
  representantClient: string;
  RecouvreurClient: string;
  exonoreClient: string;
  modeRegClient: string;
  echeanceClient: string;
  remiseClient: string;
  codeTVAClient: string;
  assujTVAClient: string;
  banqueClient: string;
  AgenceClient: string;
  compteClient: string;
  plafondClient: string;
  groupeClient: string;
  vendClient: string;
  readonl: boolean;

  respons1Client: string;
  Fonction1Client: string;
  tel1Client: string;
  gsm1Client: string;
  mail1Client: string;

  respons2Client: string;
  Fonction2Client: string;
  tel2Client: string;
  gsm2Client: string;
  mail2Client: string;

  respons3Client: string;
  Fonction3Client: string;
  tel3Client: string;
  gsm3Client: string;
  mail3Client: string;
  zonee: Zone;
  chiffaffbtn: boolean;
  Analysebtn: boolean;
  CA = '0.000';
  CA1 = '0.000';
  CA2 = '0.000';
  MA = '0.000';
  MA1 = '0.00';
  MA2 = '0.00';
  listeView: any;

  objectifann = '0.000';

  realise = '0.000';
  pourcent = '0.000';
  objectifact = '0.000';
  anneecourant;
  annee_1;
  annee_2;
  listess: any;
  visible = false;
  clientSelected = false;
  fullScrean = true;
  visibleRegClt = false;
  header: string;

  constructor(
    private config: NgSelectConfig,
    private clientService: ClientService,
    private viewMouveService: ViewMouveService,
    private viewMouve1Service: ViewMouve1Service,
    private viewMouve2Service: ViewMouve2Service,
    private vendeur1Service: Vendeur1Service,
    private represanService: RepresanService,
    private zoneService: ZoneService,
    private groupeService: GroupeService,
    private recouvService: RecouvService,
    private secteurService: SecteurService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
  }
  async etatCmdClt(e) {
    console.log(this.selectedClient.code);
    this.header = 'Etat Commandes Client   :   ' + this.selectedClient.deno;
     // localStorage.setItem('selectedMenu', 'Etat CMDs Client');
     // console.log('local storage  ', globals.selectedMenu);
     this.etatcmdclt.selected_clt = this.selectedClient;
     this.etatcmdclt.code_clt = this.selectedClient.code ;
     this.etatcmdclt.selectedradiobtcmd = '1';
     this.etatcmdclt.selectedradiobtcmdQPES = '3' ;
     this.etatcmdclt.selectedradiobtart = '2' ;
     this.etatcmdclt.selectedradiobtfrn = '2' ;
      this.visibleEtatCmdClt = true;
      this.etatcmdclt.datasourceGrid = new Array();
      this.etatcmdclt.datasourceGrid1 = new Array();
      this.etatcmdclt.datasourceGrid2 = new Array();
      await this.etatcmdclt.afficher();
      this.etatcmdclt.btninitialiser = true ;
      this.etatcmdclt.btnaff = true ;
      this.etatcmdclt.readonly = true ;
      this.etatcmdclt.readonlyRepresentant = false;
  }

  async etatOffreEnv(e) {
    this.header = 'Rapport etat offres client';
    console.log(this.codeClient);
    this.EtatOffreEnvoye.op.hide();
    this.EtatOffreEnvoye.NouvelleListe();
     // localStorage.setItem('selectedMenu', 'Etat Offre Envoye');
     // console.log('local storage  ', globals.selectedMenu);
    //   this.EtatOffreEnvoye.SelectedArticles = this.selectedClient.code;
       this.EtatOffreEnvoye.SelectedClients = this.selectedClient;
       this.EtatOffreEnvoye.codeclient = this.codeClient;
       this.EtatOffreEnvoye.fromOutside = true ;
       this.visibleEtatOffreEnvoyes = true;
       this.EtatOffreEnvoye.fichClientBtnObserv = true ;
       this.EtatOffreEnvoye.readonly = true ;
       this.EtatOffreEnvoye.disabledbtn = true ;
      await this.EtatOffreEnvoye.Afficher();


   }



  showDialogMaximized(dialog: Dialog) {
    dialog.header = this.header;
    setTimeout(() => {
      dialog.maximize();
    }, 0);
  }




  close() {}
  async reglement (e) {
    this.header = 'Etat Reglement Client   :   ' + this.selectedClient.deno;
    // localStorage.setItem('selectedMenu', 'Reglement Client');
    globals.selectedMenu = 'Reglement Client';
    console.log('local storage  ', globals.selectedMenu);
    this.visibleRegClt = true;
    this.ReglementClient.ngselectDisabled = true;
    this.ReglementClient.selectedClient = this.selectedClient;
    this.ReglementClient.codeClient  = this.selectedClient.code;
    this.ReglementClient.afficherShow = false;
    await this.ReglementClient.afficher();
    this.ReglementClient.ajouterDisabled = true;
    this.ReglementClient.showNvSaisie = false;

  }

  async MvtsAnneeCourante(e) {
   // this.AnalyseCaMarges.
   this.header = 'Mouvements année courante du  client   :    ' + this.selectedClient.deno;
   if (this.codeClient !== null && this.codeClient !== undefined) {
    this.visibledMouvements = true;
    this.AnalyseCaMarges. ficheClient = false;
    this.AnalyseCaMarges.cod = this.codeClient;
    this.AnalyseCaMarges.selectedGroupBy = 'client';
    const anneeCourante = String(new Date().getFullYear());
    this.AnalyseCaMarges.selectedYear = anneeCourante;
    if (this.AnalyseCaMarges.selectedYear === this.AnalyseCaMarges.anneeCourante) {
      this.AnalyseCaMarges.dadteD = '01/01/' + anneeCourante ;
      // this.dateFin = new Date('12/31/' + this.anneeCourante);
      this.AnalyseCaMarges.dadteF = '31/12/' + anneeCourante;

    }
    this.AnalyseCaMarges.btnFermerDetails = true;
    this.AnalyseCaMarges.afficherDetails();
    this.AnalyseCaMarges.showDetails = true;
   }


  }


  async MvtsAnnee_2(e) {
    // this.AnalyseCaMarges.
    this.header = 'Mouvements année -2 du  client   :    ' + this.selectedClient.deno;
    if (this.codeClient !== null && this.codeClient !== undefined) {
     this.visibledMouvements = true;
     this.AnalyseCaMarges. ficheClient = false;
     this.AnalyseCaMarges.cod = this.codeClient;
     this.AnalyseCaMarges.selectedGroupBy = 'client';
     const annee = String(new Date().getFullYear() - 2);
     console.log('anneeeeeeeeeeeeeeeeeee', annee);


     this.AnalyseCaMarges.selectedYear = annee;
    // this.AnalyseCaMarges.annee1;
       this.AnalyseCaMarges.dadteD = '01/01/' + annee ;
       this.AnalyseCaMarges.dadteF = '31/12/' + annee;
       this.AnalyseCaMarges.btnFermerDetails = true;
     this.AnalyseCaMarges.afficherDetails();
     this.AnalyseCaMarges.showDetails = true;
    }


   }

  async MvtsAnnee_1(e) {
    // this.AnalyseCaMarges.
    this.header = 'Mouvements année -1 du  client   :    ' + this.selectedClient.deno;

    if (this.codeClient !== null && this.codeClient !== undefined) {
     this.visibledMouvements = true;
     this.AnalyseCaMarges. ficheClient = false;
     this.AnalyseCaMarges.cod = this.codeClient;
     this.AnalyseCaMarges.selectedGroupBy = 'client';
     const annee = String(new Date().getFullYear() - 1);
     this.AnalyseCaMarges.selectedYear = this.AnalyseCaMarges.annee1;
     this.AnalyseCaMarges.dadteD = '01/01/' + annee ;
     this.AnalyseCaMarges.dadteF = '31/12/' + annee;
     this.AnalyseCaMarges.btnFermerDetails = true;
     this.AnalyseCaMarges.afficherDetails();
     this.AnalyseCaMarges.showDetails = true;
    }


   }


  async releve() {
    this.header = 'Relevé Client   :   ' + this.selectedClient.deno;
    this.Releve.selectedClient = this.selectedClient;
    this.Releve.codeClient = this.selectedClient.code;
    this.Releve.afficherClicked = true;
    this.Releve.afficherDisable = true;
   await this.Releve.afficher();
    this.visible = true;
    this.Releve.releveClicked = true;
    this.Releve.apercueDisable = false;

  }




  chargerClient() {
    this.listClient = this.listess;
  }
  async ngOnInit() {
    this.EtatOffreEnvoye.Formshowyes = false ;
    this.visibleRegClt = false;
    this.visible = false;
    this.clientSelected = false;
    this.anneecourant = new Date().getFullYear();
    this.annee_1 = new Date().getFullYear() - 1;
    this.annee_2 = new Date().getFullYear() - 2;
    this.chiffaffbtn = false;
    this.Analysebtn = false;
    this.readonly = true;
    this.readonl = false;
    await this.clientService
      .getClientsListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.listClient = data['_embedded'].clients;
        this.listess = data['_embedded'].clients;
      });
    console.log('clients ', this.listClient);
  }
  initvalCHAMA() {
    this.CA = '0.000';
    this.MA = '0.00';
    this.CA1 = '0.000';
    this.MA1 = '0.00';
    this.CA2 = '0.000';
    this.MA2 = '0.00';
  }
  initValchAn() {

    this.pourcent = '0.00';
    this.objectifact = '0.000';
    this.objectifann = '0.000';
  }
  async ChiffAff() {
    this.chiffaffbtn = true;
    this.initvalCHAMA();
    this.listeView = new Array();
    console.log('code client ', this.codeClient);

    if (this.codeClient !== null && this.codeClient !== undefined) {
      await this.viewMouveService
        .getListe(this.codeClient)
        .toPromise()
        .then((data) => {
          console.log('liste view ', data);
          this.listeView = data['_embedded'].viewMouve;
        });
      if (this.listeView.length > 0) {
        await this.viewMouveService
          .getCAClient(this.codeClient)
          .toPromise()
          .then((data) => {
            console.log('ca client ', data);
            this.CA = Number(data).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& ');
          });
        await this.viewMouveService
          .getMAClient(this.codeClient)
          .toPromise()
          .then((data) => {
            console.log('Ma client ', data);
            this.MA = Number(data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
          });

        await this.viewMouve1Service
          .getCA1Client(this.codeClient)
          .toPromise()
          .then((data) => {
            console.log('ca1 client ', data);
            this.CA1 = Number(data).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& ');
          });

        await this.viewMouve1Service
          .getMA1Client(this.codeClient)
          .toPromise()
          .then((data) => {
            console.log('Ma1 client ', data);
            this.MA1 = Number(data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
          });

        await this.viewMouve2Service
          .getCA2Client(this.codeClient)
          .toPromise()
          .then((data) => {
            console.log('ca2 client ', data);
            this.CA2 = Number(data).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& ');
          });

        await this.viewMouve2Service
          .getMA2Client(this.codeClient)
          .toPromise()
          .then((data) => {
            console.log('Ma2 client ', data);
            this.MA2 = Number(data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
          });
      }
    }
  }

  dayDiff(d1, d2) {
    d1 = d1.getTime() / 86400000;
    d2 = d2.getTime() / 86400000;
    const d3 = d2 - d1;

    return new Number(d2 - d1).toFixed(0);
  }

  async AnalyseObjectifs() {
    this.initValchAn();

    this.Analysebtn = true;
    // console.log('selected client ', this.selectedClient);
    if (this.selectedClient !== null && this.selectedClient !== undefined) {
      this.objectifann = Number(this.selectedClient.objectif).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& ');
      const dcourant = new Date();
      const dateAnneeCourante = new Date();
      dateAnneeCourante.setDate(1);
      dateAnneeCourante.setMonth(0);
      //  console.log('date annee courante ', dateAnneeCourante);
      const nbj = this.dayDiff(dateAnneeCourante, dcourant);
      // console.log('nbj', nbj);
      const objec = (Number(this.selectedClient.objectif) / 365) * (Number(nbj) + 1);
      const objectAct = objec.toFixed(3);
      //  console.log('object actuel ', objectAct);
      this.objectifact = objectAct.replace(/\d(?=(\d{3})+\.)/g, '$& ');

      await this.viewMouveService
        .getListe(this.codeClient)
        .toPromise()
        .then((data) => {
          this.listeView = data['_embedded'].viewMouve;
        });
       let realis = 0;
      if (this.listeView.length > 0) {
        await this.viewMouveService
          .getCAClient(this.codeClient)
          .toPromise()
          .then((data) => {
            //  console.log('ca client ', data);
            realis = Number(data);
            this.realise = Number(data).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& ');
          });
      } else {
        this.realise = '0.000';
      }

      //   this.objectifact = '0.000';
      if (Number(objectAct) === 0) {
        this.pourcent = 'NON DEFINI';
      } else {
        const pourc = (Number(realis) / Number(objectAct)) * 100;
        this.pourcent = pourc.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
      }
    }
  }

  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async changeClient() {
    this.initvalCHAMA();
    this.initValchAn();
    this.chiffaffbtn = false;
    this.Analysebtn = false;
    if (this.selectedClient === null || this.selectedClient === undefined) {
      this.codeClient = '';
      this.clientSelected = false;
      console.log('code client', this.codeClient + '...');
      this.adresseClient = '';
      this.adrSiegeClient = '';
      this.adrUsineClient = '';
      this.AgenceClient = '';
      this.assujTVAClient = '';
      this.banqueClient = '';
      this.compteClient = '';
      this.dateCreationClient = '';
      this.echeanceClient = '';
      this.exonoreClient = '';
      this.codeTVAClient = '';
      this.faxClient = '';
      this.modeRegClient = '';
      this.plafondClient = '';
      this.emailClient = '';
      this.TelClient = '';
      this.cpClient = '';
      this.villeClient = '';
      this.remiseClient = '';
      this.typologieClient = '';
      this.RevConClient = '';

      this.respons1Client = '';
      this.respons2Client = '';
      this.respons3Client = '';

      this.Fonction1Client = '';
      this.Fonction2Client = '';
      this.Fonction3Client = '';

      this.gsm1Client = '';
      this.gsm2Client = '';
      this.gsm3Client = '';

      this.tel1Client = '';
      this.tel2Client = '';
      this.tel3Client = '';
      this.RecouvreurClient = '';
      this.groupeClient = '';
      this.zoneClient = '';
      this.activiteClient = '';
      this.representantClient = '';
      this.vendClient = '';
    } else {
      this.readonl = false;
      this.codeClient = this.selectedClient.code;
      this.clientSelected = true;
      console.log('selected client', this.selectedClient);
      this.adresseClient = this.selectedClient.adresse;
      this.adrSiegeClient = this.selectedClient.adressesiege;
      this.adrUsineClient = this.selectedClient.adresseusine;
      this.AgenceClient = this.selectedClient.agence;
      this.assujTVAClient = this.selectedClient.assujet;
      this.banqueClient = this.selectedClient.banque;
      this.compteClient = this.selectedClient.compte;
      this.dateCreationClient = this.selectedClient.datCreat;
      this.echeanceClient = this.selectedClient.ech + ' jours';
      this.exonoreClient = this.selectedClient.exonor;
      this.codeTVAClient = this.selectedClient.codeTva;
      this.faxClient = this.selectedClient.fax;
      this.modeRegClient = this.selectedClient.reg;
      this.plafondClient = this.selectedClient.plafond;
      this.emailClient = this.selectedClient.eMail;
      this.TelClient = this.selectedClient.tel;
      this.cpClient = this.selectedClient.post;
      this.villeClient = this.selectedClient.ville;
      this.remiseClient = this.selectedClient.marque;
      this.typologieClient = this.selectedClient.mag;
      this.RevConClient = this.selectedClient.typeComm;

      this.respons1Client = this.selectedClient.respon;
      this.respons2Client = this.selectedClient.respons2;
      this.respons3Client = this.selectedClient.respons3;

      this.Fonction1Client = this.selectedClient.fonction1;
      this.Fonction2Client = this.selectedClient.fonction2;
      this.Fonction3Client = this.selectedClient.fonction3;

      this.gsm1Client = this.selectedClient.gsm1;
      this.gsm2Client = this.selectedClient.gsm2;
      this.gsm3Client = this.selectedClient.gsm3;

      this.tel1Client = this.selectedClient.tel1;
      this.tel2Client = this.selectedClient.tel2;
      this.tel3Client = this.selectedClient.tel3;

      if (
        this.selectedClient.rec === null ||
        this.selectedClient.rec === undefined
      ) {
        this.groupeClient = '';
      } else {
        await this.recouvService
          .findByCode(this.selectedClient.rec)
          .toPromise()
          .then((recouv) => {
            console.log('recouv ', recouv);

            this.RecouvreurClient = recouv['_embedded'].recouvs[0].deno;
          });
      }

      if (
        this.selectedClient.codGroupe === null ||
        this.selectedClient.codGroupe === undefined
      ) {
        this.groupeClient = '';
      } else {
        await this.groupeService
          .getGroupeByCode(this.selectedClient.codGroupe)
          .toPromise()
          .then((group) => {
            console.log('groupe ', group);

            this.groupeClient = group['_embedded'].groupes[0].deno;
          });
      }

      if (
        this.selectedClient.zone === null ||
        this.selectedClient.zone === undefined
      ) {
        this.zoneClient = '';
      } else {
        await this.zoneService
          .getZoneByCode(this.selectedClient.zone)
          .toPromise()
          .then((obj) => {
            this.zonee = <Zone>obj;
            this.zoneClient = this.zonee.deno;
          });
      }

      if (
        this.selectedClient.secteur === null ||
        this.selectedClient.secteur === undefined
      ) {
        this.activiteClient = '';
      } else {
        await this.secteurService
          .findByCode(this.selectedClient.secteur)
          .toPromise()
          .then((data) => {
            console.log('secteur ', data);
            this.activiteClient = data['_embedded'].secteurs[0].deno;
          });
      }

      if (
        this.selectedClient.represant === null ||
        this.selectedClient.represant === undefined
      ) {
        this.representantClient = '';
      } else {
        await this.represanService
          .findByCode(this.selectedClient.represant)
          .toPromise()
          .then((data) => {
            console.log('represant ', data);
            this.representantClient = data['_embedded'].represans[0].deno;
          });
      }

      if (
        this.selectedClient.vend === null ||
        this.selectedClient.vend === undefined
      ) {
        this.vendClient = '';
      } else {
        await this.vendeur1Service
          .getVendeur1ByCode(this.selectedClient.vend)
          .toPromise()
          .then((data) => {
            console.log('vendeeur ', data);
            this.vendClient = data['_embedded'].vendeur1[0].deno;
          });
      }

      console.log('code client', this.codeClient);
    }
  }
}
