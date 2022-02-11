import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { SearchSettingsModel } from '@syncfusion/ej2-grids';
import { ClientService } from '../services/client.service';
import { Client } from '../services/client';
import { StockService } from '../services/stock.service';
import { Stock } from '../services/stock';
import { MouveService } from '../services/mouve.service';
import { Mouve } from '../services/mouve';
import { DcomService } from '../services/dcom.service';
import { Dcom } from '../services/Dcom';
import { DatePipe } from '@angular/common';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';

import { LoginService } from 'src/app/login/login.service';
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
  selector: 'app-reservation-stock',
  templateUrl: './reservation-stock.component.html',
  styleUrls: ['./reservation-stock.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class ReservationStockComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('numeric') public numeric;
  @ViewChild('grid_Consulation')
  public gridconsulter: GridComponent;
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  index = 0;
  date = new Date();
  codeCltNouvelle = '';
  denoCltNouvelle = '';
  dat = this.datePipe.transform(this.date, 'dd/MM/yyyy');
  activeindex;
  public customAttributes: Object;
  afficheClicked = false;
  consulterClicked = false;
  SelectedMouve: any;
  reservations: any;
  reservationsannulation: any;
  codeArticle = '';
  lenghtdcoms = 0;
  codeArticleNouvelle = '';
  codeCltAnnuler = '';
  denoCltAnnuler = '';
  valideconsulter = false;
  valideAfficher = false;
  public selectionOptions: SelectionSettingsModel;
  SelectedClientNouvelle: Client = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    respon: '',
    tel: '',
    agence: '',
    banque: '',
    telex: '',
    fax: '',
    cadnat: '',
    compte: '',
    edition: '',
    exonor: '',
    duree: '',
    reg: '',
    terme: '',
    marque: '',
    plafond: '',
    zone: '',
    comm: '',
    assujet: '',
    codeTva: '',
    timbre: '',
    ech: '',
    bloc: '',
    datBlc: '',
    typeC: '',
    regle: '',
    lettre: '',
    codeC: '',
    autor: '',
    eMail: '',
    typeComm: '',
    rec: '',
    vend: '',
    represant: '',
    secteur: '',
    objectif: '',
    nature: '',
    datCreat: '',
    mag: '',
    respons2: '',
    adresseusine: '',
    adressesiege: '',
    gsm1: '',
    gsm2: '',
    nouvMag: '',
    ca123: '',
    respons3: '',
    fonction1: '',
    fonction2: '',
    fonction3: '',
    eMail1: '',
    eMail2: '',
    eMail3: '',
    tel2: '',
    tel3: '',
    gsm3: '',
    codGroupe: '',
    modeReg: '',
    plafondEncours: '',
    indic: '',
    bcExige: '',
  };
  SelectedClientAnnuler: Client = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    respon: '',
    tel: '',
    agence: '',
    banque: '',
    telex: '',
    fax: '',
    cadnat: '',
    compte: '',
    edition: '',
    exonor: '',
    duree: '',
    reg: '',
    terme: '',
    marque: '',
    plafond: '',
    zone: '',
    comm: '',
    assujet: '',
    codeTva: '',
    timbre: '',
    ech: '',
    bloc: '',
    datBlc: '',
    typeC: '',
    regle: '',
    lettre: '',
    codeC: '',
    autor: '',
    eMail: '',
    typeComm: '',
    rec: '',
    vend: '',
    represant: '',
    secteur: '',
    objectif: '',
    nature: '',
    datCreat: '',
    mag: '',
    respons2: '',
    adresseusine: '',
    adressesiege: '',
    gsm1: '',
    gsm2: '',
    nouvMag: '',
    ca123: '',
    respons3: '',
    fonction1: '',
    fonction2: '',
    fonction3: '',
    eMail1: '',
    eMail2: '',
    eMail3: '',
    tel2: '',
    tel3: '',
    gsm3: '',
    codGroupe: '',
    modeReg: '',
    plafondEncours: '',
    indic: '',
    bcExige: '',
  };
  SelectedClient: Client = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    respon: '',
    tel: '',
    agence: '',
    banque: '',
    telex: '',
    fax: '',
    cadnat: '',
    compte: '',
    edition: '',
    exonor: '',
    duree: '',
    reg: '',
    terme: '',
    marque: '',
    plafond: '',
    zone: '',
    comm: '',
    assujet: '',
    codeTva: '',
    timbre: '',
    ech: '',
    bloc: '',
    datBlc: '',
    typeC: '',
    regle: '',
    lettre: '',
    codeC: '',
    autor: '',
    eMail: '',
    typeComm: '',
    rec: '',
    vend: '',
    represant: '',
    secteur: '',
    objectif: '',
    nature: '',
    datCreat: '',
    mag: '',
    respons2: '',
    adresseusine: '',
    adressesiege: '',
    gsm1: '',
    gsm2: '',
    nouvMag: '',
    ca123: '',
    respons3: '',
    fonction1: '',
    fonction2: '',
    fonction3: '',
    eMail1: '',
    eMail2: '',
    eMail3: '',
    tel2: '',
    tel3: '',
    gsm3: '',
    codGroupe: '',
    modeReg: '',
    plafondEncours: '',
    indic: '',
    bcExige: '',
  };
  clients: Client[];
  clientsnouvelles: Client[];
  clientsannulees: Client[];
  Com = '';

  denoArticleAnnuler = '';
  codeArticleAnnuler = '';
  err = false;

  SelectedArticleNouvelle: Stock = {
    id: '',
    code: '',
    design: '',
    quantite: '',
    tva: '',
    prix: '',
    achat: '',
    marge: '',
    operateur: '',
    achatD: '',
    famille: '',
    achatP: '',
    devise: '',
    sfamille: '',
    taxe: '',
    origine: '',
    equiv: '',
    imp: '',
    min: '',
    max: '',
    commQuant: '',
    dPachat: '',
    pInv: '',
    qInv: '',
    agenda: '',
    qtEnt: '',
    emplacement: '',
    nbrC: '',
    nbrCl: '',
    nbrBl: '',
    qtTotal: '',
    ca: '',
    profilCa: '',
    profilTyp: '',
    qteTotal1: '',
    qtTotal1: '',
  };
  SelectedArticleAnnuler: Stock = {
    id: '',
    code: '',
    design: '',
    quantite: '',
    tva: '',
    prix: '',
    achat: '',
    marge: '',
    operateur: '',
    achatD: '',
    famille: '',
    achatP: '',
    devise: '',
    sfamille: '',
    taxe: '',
    origine: '',
    equiv: '',
    imp: '',
    min: '',
    max: '',
    commQuant: '',
    dPachat: '',
    pInv: '',
    qInv: '',
    agenda: '',
    qtEnt: '',
    emplacement: '',
    nbrC: '',
    nbrCl: '',
    nbrBl: '',
    qtTotal: '',
    ca: '',
    profilCa: '',
    profilTyp: '',
    qteTotal1: '',
    qtTotal1: '',
  };
  SelectedArticle: Stock = {
    id: '',
    code: '',
    design: '',
    quantite: '',
    tva: '',
    prix: '',
    achat: '',
    marge: '',
    operateur: '',
    achatD: '',
    famille: '',
    achatP: '',
    devise: '',
    sfamille: '',
    taxe: '',
    origine: '',
    equiv: '',
    imp: '',
    min: '',
    max: '',
    commQuant: '',
    dPachat: '',
    pInv: '',
    qInv: '',
    agenda: '',
    qtEnt: '',
    emplacement: '',
    nbrC: '',
    nbrCl: '',
    nbrBl: '',
    qtTotal: '',
    ca: '',
    profilCa: '',
    profilTyp: '',
    qteTotal1: '',
    qtTotal1: '',
  };
  quantiteNouvelle = '';
  denoArticleNouvelle = '';
  nouvelleClicked = false;
  annulerClicked = false;
  reserverClicked = false;
  denoClt = '';
  SelectdStockReserv: any;
  tab_reservation: any;
  SelectdStock: any;
  articlesnouvelles: Stock[];
  articles: Stock[];
  articlesannulees: Stock[];
  denoArticle = '';
  reserveClicked = true;
  consultereserveClicked = false;
  quantite = '';
  annulerreserveClicked = false;
  public searchOptions: SearchSettingsModel;
  readonlynom = true;
  readonly = true;
  validerClickek = false;
  valide = true;
  codeClt = '';
  SelectedReservation: any;
  allowSelection = true;
  dcoms: Dcom[];
  tab_dcom: any;
  Article: Stock;

  tab_dcoms: any;
  rang: object;
  ComNouvelle = '';
  ComAnnuler = '';

  wasInside: boolean;
  constructor(
    private clientService: ClientService,
    private stockService: StockService,
    private mouveService: MouveService,
    private dcomService: DcomService,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  ngOnInit() {
    // initailisation
    this.SelectedArticleAnnuler = null;
    this.SelectedArticleNouvelle = null;
    this.SelectedArticle = null;
    this.SelectedClient = null;
    this.SelectedClientAnnuler = null;
    this.SelectedClientNouvelle = null;

    // charger les client
    this.clientService
      .getClientsListOrdByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
    // charger les articles
    this.stockService
      .getStockList('')
      .toPromise()
      .then((data) => {
        this.articles = data['_embedded'].stocks;
        console.log(this.articles);
      });
    // style de ejs grid
    this.customAttributes = { class: 'customcss' };
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ovo.hide();
    }
    this.wasInside = false;
  }
  /// nouvelle réservation
  async Valider(e) {
    // initialisation
    this.wasInside = true;
    this.ovo.hide();
    this.validerClickek = true;
    this.valide = true;
    this.afficheClicked = false;
    this.consulterClicked = false;
    this.codeCltNouvelle = '';
    this.codeArticleNouvelle = '';
    // test sur les ng select pour récuperer les codes
    if (this.SelectedClientNouvelle !== null) {
      this.codeCltNouvelle = this.SelectedClientNouvelle.code;
      this.denoCltNouvelle = this.SelectedClientNouvelle.deno;
    }
    if (this.SelectedArticleNouvelle !== null) {
      this.codeArticleNouvelle = this.SelectedArticleNouvelle.code;
      this.denoArticleNouvelle = this.SelectedArticleNouvelle.design;
    }
    /// test pour tous les paramètres ( tous sont obligatoire de les saisies)
    if (
      this.SelectedClientNouvelle === null ||
      this.SelectedClientNouvelle === undefined
    ) {
      this.valide = false;
      this.ms = 'Client Obligatoire !';
      this.ovo.show(e, document.getElementById('mnt'));
    } else if (this.ComNouvelle === '' ) {
      this.ms = 'Bon_Commande Obligatoire !';
      this.ovo.show(e, document.getElementById('bncmd'));

      this.valide = false;
    } else if (
      this.SelectedArticleNouvelle === null ||
      this.SelectedArticleNouvelle === undefined
    ) {
      this.ms = 'Article Obligatoire !';
      this.ovo.show(e, document.getElementById('article'));
      this.valide = false;
    } else if (
      this.quantiteNouvelle === undefined ||
      this.quantiteNouvelle === '' ||
      this.quantiteNouvelle === '0' ||
      this.quantiteNouvelle === null
    ) {
      this.ms = 'Quantité erronnée !';
      this.ovo.show(e, document.getElementById('quantite'));
      this.valide = false;
    } else {
      /// récupérer l'article saisie
      await this.stockService
        .getStockByCode(this.codeArticleNouvelle)
        .toPromise()
        .then((data) => {
          this.Article = data['_embedded'].stocks[0];
        });
      // rechercher l'entite dcom pour le test
      await this.dcomService
        .RechercherDcom(
          this.codeCltNouvelle,
          this.ComNouvelle,
          this.codeArticleNouvelle
        )
        .toPromise()
        .then((data) => {
          this.tab_dcoms = data['_embedded'].dcom;
          console.log('tab decom', this.tab_dcoms);

          this.lenghtdcoms = data['_embedded'].dcom.length;
          console.log(this.lenghtdcoms);
        });
        if ( this.lenghtdcoms > 0) {
            // test sur la quantite de dcom
        if (this.tab_dcoms[0].quantite === null || this.tab_dcoms[0].quantite === 'NULL') {
          this.tab_dcoms[0].quantite = 0;
        }
        if (this.tab_dcoms[0].livre === null || this.tab_dcoms[0].livre === 'NULL') {
          this.tab_dcoms[0].livre = 0;
        }
        if (this.tab_dcoms[0].qtReserv === null || this.tab_dcoms[0].qtReserv === 'NULL') {
          this.tab_dcoms[0].qtReserv = 0;
        }
        }

      if (
        this.lenghtdcoms === 1 &&
           Number(this.quantiteNouvelle) >
           Number(this.tab_dcoms[0].quantite) -
           Number(this.tab_dcoms[0].livre) -
           Number(this.tab_dcoms[0].qtReserv)
      ) {
        this.ms = 'Quantité à réserver > Solde Commande!';
        this.ovo.show(e, document.getElementById('quantite'));
        this.valide = false;
      } else if (this.lenghtdcoms === 0 || this.lenghtdcoms > 1) {
        // si la commande non enregistré ou client
        this.ms =
          'Commande Non Enregistrée Pour ce Client ou Article Non Enregistré dans cette Commande!';
        this.ovo.show(e, document.getElementById('btnValider'));
        this.valide = false;
      } else if (
        Number(this.quantiteNouvelle) > Number(this.Article.quantite)
      ) {
        // test sur la quantite de l'article
        this.ms = 'Quantité En Stock Insuffisante!';
        this.ovo.show(e, document.getElementById('quantite'));
        this.valide = false;
      }
    }
    if (
      this.lenghtdcoms === 1 &&
         Number(this.quantiteNouvelle) <=
         Number(this.tab_dcoms[0].quantite) -
         Number(this.tab_dcoms[0].livre) -
         Number(this.tab_dcoms[0].qtReserv) && Number(this.quantiteNouvelle) <=  Number(this.Article.quantite)
    ) {
      this.valide = true;
    } else {
      this.valide = false;
    }
    // si la valideté est vraie
    if (this.valide === true) {
      // déterminer le rang de mouve
      await this.mouveService
        .DeterminerMaxRang()
        .toPromise()
        .then((data) => {
          this.rang = data;
        });


      // remplir l'entite  mouve
      const mouve: Mouve = {
        id: null,
        combine: 'RESERV    ' + String(Number(this.rang) + 1),
        code: this.codeArticleNouvelle,
        quantite: this.quantiteNouvelle,
        tRemise: '0',
        prix: '0',
        date: this.dat,
        operateur: this.codeCltNouvelle,
        sens: 'C',
        tauxTva: '0',
        base: '',
        achat: '',
        codeAimprimer: '',
        rang: String(parseInt(String(this.rang)) + 1),
        numbc: this.tab_dcoms[0].combine,
        autPrix: '',
        totalbrut: '',
        qtEnt: '',
        prixArt: '',
        qtOffre: '',
        designation: '',
      };
      // enregistre la mouve
      await this.mouveService
        .createMouve(mouve)
        .toPromise()
        .then((data) => {
          // MOOOOOOOOOOCHAR
          const codeUtil = localStorage.getItem('login');
          const moduteName = globals.selectedMenu;
          const paramMouchar =
            'A CL ' +
            mouve.operateur +
            ' R ' +
            data.id +
            ' ' +
            mouve.code +
            ' Q ' +
            mouve.quantite;
          this.loginService
            .procedureStockeModule(codeUtil, moduteName, paramMouchar)
            .toPromise()
            .then((data) => {
              console.log(data);
            });
        });
      // modifier quantite reserv de dcom
      this.ModifierDcomReserver();
      // modifier quantite de l'article
      this.ModifierQuantiteStockEnReservation();

      // initialisation
      this.SelectedArticleNouvelle = null;
      this.denoArticleNouvelle = '';
    }
  }
  // méthode de modifier quantite de l'article
  async ModifierQuantiteStockEnReservation() {
    await this.stockService
      .modifyQuantiteStockENreserv(
        this.quantiteNouvelle,
        this.codeArticleNouvelle
      )
      .toPromise()
      .then((data) => {
        this.quantiteNouvelle = '';
      });
  }
  // méthode de modifier quantite de reserv du dcom
  async ModifierDcomReserver() {
    await this.dcomService
      .modifyQuantiteDcomENreserv(
        String(parseInt(this.quantiteNouvelle).toFixed(0)),
        this.ComNouvelle,
        this.codeArticleNouvelle
      )
      .toPromise()
      .then((data) => {});
  }
  /// annulation réservation
  async Consulter(e) {
    // initialisation
    this.afficheClicked = false;
    this.wasInside = true;
    this.ovo.hide();
    this.reservationsannulation = new Array();
    this.denoArticleAnnuler = '';
    this.validerClickek = false;
    this.consulterClicked = true;
    this.codeCltAnnuler = '';
    this.codeArticleAnnuler = '';
    // test sur les ng select pour récupérer les codes
    if (this.SelectedClientAnnuler !== null) {
      this.codeCltAnnuler = this.SelectedClientAnnuler.code;
      this.denoCltAnnuler = this.SelectedClientAnnuler.deno;
    } else {
      this.codeCltAnnuler = '';
      this.codeArticleAnnuler = '';
    }
    if (this.SelectedArticleAnnuler !== null) {
      this.codeArticleAnnuler = this.SelectedArticleAnnuler.code;
      this.denoArticleAnnuler = this.SelectedArticleAnnuler.design;
    }
    // afficher les reservations
    await this.mouveService
      .ConsulterReservation(
        this.codeCltAnnuler,
        this.codeArticleAnnuler,
        this.ComAnnuler
      )
      .toPromise()
      .then((data) => {
        this.reservationsannulation =
          data['_embedded'].consultationReservations;
        console.log(this.reservationsannulation);
        // affichage en front end
        for (this.tab_reservation of this.reservationsannulation) {
          this.tab_reservation.date = this.tab_reservation.date_reservation.substring(
            0,
            10
          );
          this.tab_reservation.quantitee = String(
            parseInt(this.tab_reservation.quantite).toFixed(0)
          );
        }
        // si n'existe pas de réservations
        if (this.reservationsannulation.length === 0) {
          this.ms = 'Aucune reservation trouvée!';
          this.valideconsulter = false;
          this.ovo.show(e, document.getElementById('consulter'));
        } else {
          this.valideconsulter = true;
        }
      });
  }
  // supprimer reservation sélectionner
  supprimer(e): void {
    this.wasInside = true;

    // modifier quantite de reserv de dcom
    this.ModifierDcom();
    // modifier quantite de stock
    this.ModifierQuantiteStock();
    // suppression de mouve
    this.SupprimerMouve();
  }
  // methode de suppression de mouve
  async SupprimerMouve() {
    // récupérer mouve
    await this.mouveService
      .getMouveByCombine(this.SelectedReservation.num_Reserv)
      .toPromise()
      .then((data) => {
        this.SelectedMouve = data['_embedded'].mouves[0];
      });
    // supprimer la mouve récupéré
    if (this.SelectedMouve !== null && this.SelectedMouve !== undefined) {
      await this.mouveService
      .deleteMouveById(this.SelectedMouve.id)
      .toPromise()
      .then((data) => {

      });

    // MOOOOOOOOOOCHAR
    const codeUtil = localStorage.getItem('login');
    const moduteName = globals.selectedMenu;
    const paramMouchar =
      'S CL ' +
      this.SelectedMouve.operateur +
      ' R ' +
      this.SelectedMouve.id +
      ' ' +
      this.SelectedMouve.code +
      ' Q ' +
      this.SelectedMouve.quantite;
    this.loginService
      .procedureStockeModule(codeUtil, moduteName, paramMouchar)
      .toPromise()
      .then((data) => {
        console.log(data);
      });
    // reload les réservations
    this.reloadReservations();

    }


  }
  /// méthode modifier  quantite de stock
  async ModifierQuantiteStock() {
    // modifier la quantité de l'article récupéré
    await this.stockService
      .modifyQuantiteStock(
        this.SelectedReservation.quantite,
        this.SelectedReservation.article
      )
      .toPromise()
      .then((data) => {});
  }
  // méthode modifier la quantité de reserv de dcom
  async ModifierDcom() {
    console.log(this.SelectedReservation);

    await this.dcomService
      .modifyQuantiteReserv(
        String(parseInt(this.SelectedReservation.quantite).toFixed(0)),
        this.SelectedReservation.bon_de_Commande,
        this.SelectedReservation.article
      )
      .toPromise()
      .then((data) => {
        console.log(data);
      });
  }
  // méthode reload réservations
  async reloadReservations() {
    await this.mouveService
      .ConsulterReservation(
        this.codeCltAnnuler,
        this.codeArticleAnnuler,
        this.ComAnnuler
      )
      .toPromise()
      .then((data) => {
        this.reservationsannulation =
          data['_embedded'].consultationReservations;
        for (this.tab_reservation of this.reservationsannulation) {
          this.tab_reservation.date = this.tab_reservation.date_reservation.substring(
            0,
            10
          );
        }
      });
  }
  rowSelected() {
    this.readonlynom = true;
    this.readonly = true;
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.SelectedReservation = selected;
    }
  }
  async RechercherBN_Cmd_Annuler() {
    this.afficheClicked = false;
    this.consulterClicked = false;
  }
  /// consultation réservation
  async Afficher(e) {
    // initialisation
    this.afficheClicked = true;
    this.reservations = new Array();
    this.wasInside = true;
    this.ovo.hide();
    this.consulterClicked = false;
    this.denoArticle = '';
    this.validerClickek = false;
    this.codeClt = '';
    this.codeArticle = '';
    // test sur les ng select
    if (this.SelectedClient !== null) {
      this.codeClt = this.SelectedClient.code;
      this.denoClt = this.SelectedClient.deno;
    }
    if (this.SelectedArticle !== null) {
      this.codeArticle = this.SelectedArticle.code;
      this.denoArticle = this.SelectedArticle.design;
    }
    // affichage des réservations
    await this.mouveService
      .ConsulterReservation(this.codeClt, this.codeArticle, this.Com)
      .toPromise()
      .then((data) => {
        this.reservations = data['_embedded'].consultationReservations;
        console.log(this.reservations);
        for (this.tab_reservation of this.reservations) {
          this.tab_reservation.date = this.tab_reservation.date_reservation.substring(
            0,
            10
          );
          this.tab_reservation.quantitee = String(
            parseInt(this.tab_reservation.quantite).toFixed(0)
          );
        }
        // si pas de réservations
        if (this.reservations.length === 0) {
          this.ms = 'Aucune réservation trouvée!';
          this.ovo.show(e, document.getElementById('afficher'));
          this.valideAfficher = false;
        } else {
          this.valideAfficher = true;
        }
      });
  }
  async RechercherBN_Cmd() {
    this.afficheClicked = false;
    this.consulterClicked = false;
  }

  // fonction réutilisable pour les 3 onglets

  public onSearchArtParCode(word: string): Stock[] {
    this.stockService
      .getStockList(word)
      .toPromise()
      .then((data) => {
        console.log(data);

        this.articles = data['_embedded'].stocks;
      });
    return this.articles;
  }
  async ChargementArticles() {
    this.afficheClicked = false;
    this.consulterClicked = false;
    this.reservations = null;
    this.reservationsannulation = null;
  }

  async ChargementClients() {
    this.afficheClicked = false;
    this.consulterClicked = false;
    this.reservations = null;
    this.reservationsannulation = null;
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  ChangerGrid() {
    this.reservations = null;
    this.reservationsannulation = null;
    this.afficheClicked = false;
    this.consulterClicked = false;
    this.valideconsulter = false;
    this.valideAfficher = false;
  }
  async initialiser() {
    this.afficheClicked = false;
    this.consulterClicked = false;
  }
}
