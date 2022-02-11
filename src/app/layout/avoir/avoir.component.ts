import {
  AfterViewChecked,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { Famille } from '../services/famille';
import { FamilleService } from '../services/famille.service';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { Marque } from '../services/marque';
import { MarqueService } from '../services/marque.service';
import { Sfamille } from '../services/sfamille';
import { SfamilleService } from '../services/sfamille.service';
import { StockService } from '../services/stock.service';
import { Vendeur1 } from '../services/vendeur1';
import { Vendeur1Service } from '../services/vendeur1.service';
import { ScrollableView } from 'primeng/table';
import ResizeObserver from 'resize-observer-polyfill';
import { MouveService } from '../services/mouve.service';
import { Mouve1Service } from '../services/mouve1.service';
import { DdevisService } from '../services/ddevis.service';
import { FaService } from '../services/fa.service';
import { EcomService } from '../services/ecom.service';
import { DcomService } from '../services/dcom.service';
import { Mouve } from '../services/mouve';
import { ConfirmationService } from 'primeng/api';
import { Recettes } from '../services/recettes';
import { NomClient } from '../services/nomclient';
import { RecettesService } from '../services/recettes.service';
import { NomClientService } from '../services/nomClient.service';
import { LoginService } from 'src/app/login/login.service';
import { BlService } from '../services/bl.service';
import { DuplicataComponent } from '../duplicata/duplicata.component';
import { DatePipe } from '@angular/common';
import { Fa1Service } from '../services/fa1.service';
import { Bl1Service } from '../services/bl1.service';
import { SteService } from '../services/ste.service';
import { globals } from 'src/environments/environment';
/** Hack: align header */
ScrollableView.prototype.ngAfterViewChecked = function () {
  if (!this.initialized && this.el.nativeElement.offsetParent) {
    // this.alignScrollBar();
    this.initialized = true;

    new ResizeObserver((entries) => {
      // for (let entry of entries)
      this.alignScrollBar();
    }).observe(this.scrollBodyViewChild.nativeElement);
  }
};
setCulture('de-DE');
L10n.load({
  'de-DE': {
    grid: {
      EmptyRecord: [],
    },
  },
});

@Component({
  selector: 'app-avoir',
  templateUrl: './avoir.component.html',
  styleUrls: ['./avoir.component.scss'],
  providers: [ConfirmationService, DatePipe],
})
export class AvoirComponent implements OnInit, AfterViewChecked {
  constructor(
    private clientService: ClientService,
    private vendeur1Service: Vendeur1Service,
    private stockService: StockService,
    private fourService: FournisseurService,
    private familleService: FamilleService,
    private sfamilleService: SfamilleService,
    private marqueService: MarqueService,
    private mouveService: MouveService,
    private mouve1Service: Mouve1Service,
    private ddevisService: DdevisService,
    private faService: FaService,
    private fa1Service: Fa1Service,
    private recettesService: RecettesService,
    private nomClientService: NomClientService,
    private blService: BlService,
    private bl1Service: Bl1Service,
    private loginService: LoginService,
    private steService: SteService,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService
  ) {}
  sysDate = new Date().toLocaleDateString('en-GB');
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('ngSelectVendeur') ngSelectVendeur: NgSelectComponent;
  // remiseGeneralClt = '';
  @ViewChild(DuplicataComponent) duplicata;
  numero = '';
  clientComptants = [];
  vendeurs = [];
  selectedClient: Client = {
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
  detailsClient = {
    code: '',
    deno: '',
    mr: '',
    adresse: '',
    ville: '',
    codeTva: '',
    remise: '',
  };
  enableEditClientInfos = false;
  hideVendeurSelect = true;
  hideSaisirBtn = true;
  hideBcClt = true;
  selectedVendeur = null;
  bcClt = '';
  listeArticlesSaisies = [];
  articles = [];
  selectedRechType = 'Par Critères';
  fournisseurs = [];
  selectedFournisseur = null;
  disponibleCheked = false;
  rechArtCode = '';
  familles = [];
  selectedFamille = null;
  sousFamilles = [];
  selectedSousFamille = null;
  marques = [];
  selectedMarque = null;
  mouvementsArticle = [];
  displayMouvesArticle = false;
  titreModalMouvements = '';
  offresArticle = [];
  displayOffresArticle = false;
  titreModalOffres = '';
  verifSaisieFinal = false;
  validerShow = true;
  typeAvoir = '';
  avoirTermeBl = false;
  message = '';
  displayMessage = false;
  titreDoc = '';
  rechIndic = 0;
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
  totaux = {
    totalBrut: '0.000',
    totalRemise: '0.000',
    totalHT: '0.000',
    totalBase0: '0.000',
    totalTva13: '0.000',
    totalBase13: '0.000',
    totalTva19: '0.000',
    totalBase19: '0.000',
    totalTva7: '0.000',
    totalBase7: '0.000',
    timbre: '0.000',
    totalTtc: '0.000',
  };
  hideSaisieCard = true;
  hideRechCriteres = false;
  listeArticlesSaisiesLength = 0;
  // coefMin;
  coefExonor = 1;
  blockedDocument = false;
  labelBcClient = '';
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.wasInside = true;
    this.ov.hide();
    if (this.grid !== undefined) {
      if (this.grid.getRowInfo(event.target).rowData !== undefined) {
        this.select(event);
        this.grid.selectRows([this.grid.getRowInfo(event.target).rowIndex]);
      }
    }
  }

  async ngOnInit() {
    if (
      globals.selectedMenu === 'Avoir Comptant' ||
      globals.selectedMenu === 'Avoir cpt Reservation'
    ) {
      this.labelBcClient = 'N° Fact';
      this.avoirTermeBl = false;
      this.titreDoc = 'AVOIR COMPTANT';
      if (globals.selectedMenu === 'Avoir Comptant') {
        await this.clientService
          .getClientsComptantListByOrderByDenoForVente('7300')
          .toPromise()
          .then((data) => {
            this.clientComptants = data['_embedded'].clients;
          });
        this.typeAvoir = 'AVOIRP   ';
      } else {
        await this.clientService
          .getClientsComptantListByOrderByDenoForVente('7200')
          .toPromise()
          .then((data) => {
            this.clientComptants = data['_embedded'].clients;
          });
        this.typeAvoir = 'AVOIR3   ';
      }
    }
    if (
      globals.selectedMenu === 'Avoir Terme B/l' ||
      globals.selectedMenu === 'Avoir Terme avec Reserv'
    ) {
      this.avoirTermeBl = true;
      this.titreDoc = 'AVOIR B/L';
      this.labelBcClient = 'N° Fact / BL';
      if (globals.selectedMenu === 'Avoir Terme B/l') {
        await this.clientService
          .getClientsTermeListByOrderByDeno()
          .toPromise()
          .then((data) => {
            this.clientComptants = data['_embedded'].clients;
          });
        this.typeAvoir = 'AVOIR    ';
      } else {
        await this.clientService
          .getClientsReservListByOrderByDeno()
          .toPromise()
          .then((data) => {
            this.clientComptants = data['_embedded'].clients;
          });
        this.typeAvoir = 'AVOIR2   ';
      }
    }
    await this.vendeur1Service
      .getVendeur1ByDeno()
      .toPromise()
      .then((data) => {
        this.vendeurs = data['_embedded'].vendeur1;
        this.vendeurs.unshift({ id: '', code: null, deno: '' });
      });
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchVendeur(word: string, item: Vendeur1): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  viderSelectedClient() {
    this.selectedClient = {
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
    this.detailsClient = {
      code: '',
      deno: '',
      mr: '',
      adresse: '',
      ville: '',
      codeTva: '',
      remise: '',
    };
    this.viderSelectedVendeur();
    this.hideVendeurSelect = true;
  }
  async saisir(e) {
    this.wasInside = true;
    this.ov.hide();
    let fa = [];
    let dda = 3000;
    await this.steService
      .getDateServeur()
      .toPromise()
      .then((data) => console.log(data));
    await this.faService
      .getFa()
      .toPromise()
      .then((data) => (fa = data['_embedded'].fa));
      let dateServeur = '';
      await this.steService
        .getDateServeur()
        .toPromise()
        .then((data: string) => (dateServeur = data));
    dda = Math.abs(
      (new Date(dateServeur).getTime() - new Date(fa[0].tempsAvoir).getTime()) / 1000
    );
    if (fa[0].avoirflag === '1' && dda <= 300) {
      if (this.selectedClient.exonor === 'O') {
        this.coefExonor = 0;
      } else {
        this.coefExonor = 1;
      }
      console.log(this.coefExonor);
      await this.fourService
        .getFournisseurListByOrderByDeno()
        .toPromise()
        .then((data) => {
          this.fournisseurs = data['_embedded'].fournisseurs;
        });

      await this.familleService
        .getFamillesByOrderByNom()
        .toPromise()
        .then((data) => {
          this.familles = data['_embedded'].familles;
        });

      await this.sfamilleService
        .getSousFamillesByOrderByNom()
        .toPromise()
        .then((data) => {
          this.sousFamilles = data['_embedded'].sfamilles;
        });

      await this.marqueService
        .getMarquesByOrderByNom()
        .toPromise()
        .then((data) => {
          this.marques = data['_embedded'].marques;
        });
      this.hideSaisieCard = false;
      this.hideSaisirBtn = true;
      this.totaliser();
    } else {
      this.msgs = 'Veuillez demander l\'Autorisation, SVP. !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('saisirBtn'));
    }
  }

  async actualiserLigne(col, ri, e) {
    this.wasInside = true;
    this.ov.hide();
    ri = Number(ri) - 1;
    if (col === 'qte') {
      if (
        Number(this.listeArticlesSaisies[ri].quantite) === 0 ||
        this.listeArticlesSaisies[ri].quantite === '' ||
        String(Number(this.listeArticlesSaisies[ri].quantite)) === 'NaN'
      ) {
        this.msgs = 'Quantite incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        setTimeout(() => {
          this.ov.show(e, document.getElementById(`row_quantite${ri + 1}`));
          document.getElementById(`row_quantite${ri + 1}`).click();
        }, 0);
      } else {
        this.listeArticlesSaisies[ri].quantite = Number(
          this.listeArticlesSaisies[ri].quantite
        ).toFixed(2);
        if (
          !Number.isInteger(Number(this.listeArticlesSaisies[ri].quantite)) &&
          this.listeArticlesSaisies[ri].qtEnt === 'O'
        ) {
          this.msgs = 'quantite doit être entière !';
          this.styleOvPanel = this.styleOvPanelError;
          setTimeout(() => {
            this.ov.show(e, document.getElementById(`row_quantite${ri + 1}`));
            document.getElementById(`row_quantite${ri + 1}`).click();
          }, 0);
        } else {
          if (
            this.listeArticlesSaisies[ri].livre !== '' &&
            Number(this.listeArticlesSaisies[ri].quantite) >
              Number(this.listeArticlesSaisies[ri].livre)
          ) {
            this.msgs = 'Quantite saisie > Quantite offre !';
            this.styleOvPanel = this.styleOvPanelError;
            setTimeout(() => {
              this.ov.show(e, document.getElementById(`row_quantite${ri + 1}`));
              document.getElementById(`row_quantite${ri + 1}`).click();
            }, 0);
          } else {
            this.listeArticlesSaisies[ri].quantite = Number(
              this.listeArticlesSaisies[ri].quantite
            ).toFixed(2);
            this.listeArticlesSaisies[ri].totalBrutRemise = (
              Number(this.listeArticlesSaisies[ri].quantite) *
              Number(this.listeArticlesSaisies[ri].prixHT) *
              (1 - Number(this.listeArticlesSaisies[ri].remise / 100))
            ).toFixed(3);
            setTimeout(
              () => document.getElementById(`row_remise${ri + 1}`).click(),
              0
            );
            this.totaliser();
            this.listeArticlesSaisies[ri].quantiteInitial =
              this.listeArticlesSaisies[ri].quantite;
          }
        }
      }
    }
    if (col === 'remise') {
      if (
        this.listeArticlesSaisies[ri].remise === '' ||
        String(Number(this.listeArticlesSaisies[ri].remise)) === 'NaN'
      ) {
        this.msgs = 'Remise incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        setTimeout(() => {
          this.ov.show(e, document.getElementById(`row_remise${ri + 1}`));
          document.getElementById(`row_remise${ri + 1}`).click();
        }, 0);
      } else {
        this.listeArticlesSaisies[ri].remise = Number(
          this.listeArticlesSaisies[ri].remise
        ).toFixed(2);
        if (
          Number(this.listeArticlesSaisies[ri].remise) >
          Number(this.detailsClient.remise)
        ) {
          this.msgs = 'Remise max pour ce client depassée ou inexistant !';
          this.styleOvPanel = this.styleOvPanelError;
          setTimeout(() => {
            this.ov.show(e, document.getElementById(`row_remise${ri + 1}`));
            document.getElementById(`row_remise${ri + 1}`).click();
          }, 0);
        } else {
          this.listeArticlesSaisies[ri].remise = Number(
            this.listeArticlesSaisies[ri].remise
          ).toFixed(2);
          this.listeArticlesSaisies[ri].totalBrutRemise = (
            Number(this.listeArticlesSaisies[ri].quantite) *
            Number(this.listeArticlesSaisies[ri].prixHT) *
            (1 - Number(this.listeArticlesSaisies[ri].remise / 100))
          ).toFixed(3);
          setTimeout(
            () => document.getElementById(`row_prix${ri + 1}`).click(),
            0
          );
          this.totaliser();
          this.listeArticlesSaisies[ri].remiseInitial =
            this.listeArticlesSaisies[ri].remise;
        }
      }
    }
    if (col === 'prixHT') {
      if (
        Number(this.listeArticlesSaisies[ri].prixHT) === 0 ||
        this.listeArticlesSaisies[ri].prixHT === '' ||
        String(Number(this.listeArticlesSaisies[ri].prixHT)) === 'NaN'
      ) {
        this.msgs = 'Prix incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        setTimeout(() => {
          this.ov.show(e, document.getElementById(`row_prix${ri + 1}`));
          document.getElementById(`row_prix${ri + 1}`).click();
        }, 0);
      } else {
        this.listeArticlesSaisies[ri].prixHT = Number(
          this.listeArticlesSaisies[ri].prixHT
        ).toFixed(3);
        this.listeArticlesSaisies[ri].totalBrutRemise = (
          Number(this.listeArticlesSaisies[ri].quantite) *
          Number(this.listeArticlesSaisies[ri].prixHT) *
          (1 - Number(this.listeArticlesSaisies[ri].remise / 100))
        ).toFixed(3);
        setTimeout(
          () => document.getElementById(`row_codeAimprimer${ri + 1}`).click(),
          0
        );
        this.totaliser();
        this.listeArticlesSaisies[ri].prixInitial =
          this.listeArticlesSaisies[ri].prixHT;
      }
    }
    if (col === 'codeAimprimer') {
      if (this.listeArticlesSaisies[ri].codeAImprimer === '') {
        this.msgs = 'code à imprimer vide !';
        this.styleOvPanel = this.styleOvPanelError;
        setTimeout(() => {
          this.ov.show(
            e,
            document.getElementById(`row_codeAimprimer${ri + 1}`)
          );
          document.getElementById(`row_codeAimprimer${ri + 1}`).click();
        }, 0);
      } else {
        /*setTimeout(
          () => document.getElementById('rechercheArticleInput').click(),
          10
        );*/
        this.listeArticlesSaisies[ri].codeAImprimerInitial =
          this.listeArticlesSaisies[ri].codeAImprimer;
          this.rechIndic = 1;
        setTimeout(
          () => document.getElementById('rechercheArticleInput').focus(),
          0
        );
      }
    }
  }
  onRowDelete(index: number) {
    // this.wasInside = true;
    // this.ov.hide();
    if (index > -1) {
      // this.ajout = false;
      this.listeArticlesSaisies.splice(index, 1);
      this.totaliser();
      // this.rang = this.demandeCommande.length;
      if (this.listeArticlesSaisies.length === 0) {
        // this.validerShow = false;
      }
      for (let i = index; i < this.listeArticlesSaisies.length; i++) {
        this.listeArticlesSaisies[i].rang = i + 1;
      }
    }
  }
  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    await this.testSaisieFinal(e);
    if (this.verifSaisieFinal) {
      this.confirmationService.confirm({
        message: 'Êtes vous sûr de vouloir valider l\'opération ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        accept: async () => {
          this.blockedDocument = true;
          if (!this.avoirTermeBl) {
            if (this.typeAvoir === 'AVOIRP   ') {
              await this.faService
                .getFa()
                .toPromise()
                .then((data) => {
                  this.numero = data['_embedded'].fa[0].numero;
                });
            } else {
              await this.fa1Service
                .getFa1()
                .toPromise()
                .then((data) => {
                  this.numero = data['_embedded'].fa1[0].numero;
                });
            }
            let tmp = '';
            for (
              let i = 0;
              i < 5 - (Number(this.numero) + 1).toFixed(0).length;
              i++
            ) {
              tmp = tmp + '0';
            }
            this.numero = tmp + (Number(this.numero) + 1).toFixed(0);
            if (this.typeAvoir === 'AVOIRP   ') {
              await this.faService
                .updateNumeroFa(this.numero)
                .toPromise()
                .then();
            } else {
              await this.fa1Service
                .updateNumeroFa1(this.numero)
                .toPromise()
                .then();
            }
          } else {
            if (this.typeAvoir === 'AVOIR    ') {
              await this.blService
                .getBl()
                .toPromise()
                .then((data) => {
                  this.numero = data['_embedded'].bl[0].numero;
                });
            } else {
              await this.bl1Service
                .getBl1()
                .toPromise()
                .then((data) => {
                  this.numero = data['_embedded'].bl1[0].numero;
                });
            }
            let tmp = '';
            for (
              let i = 0;
              i < 5 - (Number(this.numero) + 1).toFixed(0).length;
              i++
            ) {
              tmp = tmp + '0';
            }
            this.numero = tmp + (Number(this.numero) + 1).toFixed(0);

            await this.blService
              .updateBl({ id: '1', numero: this.numero })
              .toPromise()
              .then();
          }
          const combine = this.typeAvoir + this.numero;
          for (const art of this.listeArticlesSaisies) {
            const mouve: Mouve = {
              id: null,
              combine: combine,
              code: art.code,
              quantite: art.quantite,
              tRemise: art.remise,
              prix: art.prixHT,
              date: this.sysDate,
              operateur: this.selectedClient.code,
              sens: 'D',
              tauxTva: art.tva,
              base: art.qteEnStock,
              achat: art.achat,
              codeAimprimer: art.codeAImprimer,
              rang: Number(art.rang).toFixed(0),
              numbc: null,
              autPrix: art.autPrix,
              totalbrut: art.totalBrut,
              qtEnt: art.qtEnt,
              prixArt: art.prixReel,
              qtOffre: null,
              designation: art.designation,
            };
            console.log(mouve);
            await this.mouveService.createMouve(mouve).toPromise().then();
            await this.stockService
              .modifyQuantiteStock(
                (Number(art.quantite) * 1).toFixed(2),
                art.code
              )
              .toPromise()
              .then();
          }
          const recette: Recettes = {
            id: null,
            combine: combine,
            date: this.sysDate,
            net: this.totaux.totalTtc,
            ht: this.totaux.totalHT,
            remise: this.totaux.totalRemise,
            operateur: this.selectedClient.code,
            sens: 'D',
            vendeur: this.selectedVendeur.code,
            ref: this.bcClt,
            gel: null,
            base0: this.totaux.totalBase0,
            base10: this.totaux.totalBase13,
            base17: this.totaux.totalBase19,
            base29: this.totaux.totalBase7,
            reg: null,
            datReg: null,
            caisse: null,
            timbre: this.totaux.timbre,
            modify: '0',
            livrObserv: null,
            bcEqm: null,
            livrObservat: null,
            bonSort: null,
          };
          console.log(recette);
          await this.recettesService.createRecettes(recette).toPromise().then();
          if (!this.avoirTermeBl) {
            const nomClt: NomClient = {
              id: null,
              deno: this.detailsClient.deno,
              combine: combine,
              codeTva: this.detailsClient.codeTva,
              adresse: this.detailsClient.adresse,
            };
            console.log(nomClt);
            await this.nomClientService
              .createNomClient(nomClt)
              .toPromise()
              .then();
          }
          let fa: any = {};
          await this.faService
            .getFa()
            .toPromise()
            .then((data) => {
              fa = data['_embedded'].fa[0];
            });
          fa.avoirflag = '0';
          fa.tempsPrix = this.datePipe.transform(
            fa.tempsPrix,
            'dd/MM/yyyy HH:mm:ss.SSS'
          );
          fa.tempsAvoir = this.datePipe.transform(
            fa.tempsAvoir,
            'dd/MM/yyyy HH:mm:ss.SSS'
          );
          await this.faService
            .updateFa(fa)
            .toPromise()
            .then((data) => {});
          await this.loginService
            .procedureStockeModule(
              localStorage.getItem('login'),
              globals.selectedMenu,
              combine +
                ' Clt ' +
                this.selectedClient.code +
                ' NET ' +
                this.totaux.totalTtc
            )
            .subscribe((data) => {
              console.log(data);
            });
          this.validerShow = false;
          this.blockedDocument = false;
          await this.imprimer(0);
          this.message =
            this.titreDoc +
            ' a été crée avec succès sous le numero : ' +
            this.numero;
          this.displayMessage = true;
        },
      });
    }
  }

  annuler(e) {
    this.confirmationService.confirm({
      message: 'Êtes vous sûr de vouloir annuler l\'opération ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.nouvelleSaisie(e);
      },
    });
  }
  public onSearchFournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchFamille(word: string, item: Famille): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchSousFamille(word: string, item: Sfamille): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchMarque(word: string, item: Marque): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    const params = [];

    params.push(this.rechArtCode);

    if (this.disponibleCheked) {
      params.push('1');
    } else {
      params.push('0');
    }

    if (this.selectedFournisseur === null) {
      params.push('');
    } else {
      params.push(this.selectedFournisseur.code);
    }

    if (this.selectedFamille === null) {
      params.push('');
    } else {
      params.push(this.selectedFamille.code);
    }

    if (this.selectedSousFamille === null) {
      params.push('');
    } else {
      params.push(this.selectedSousFamille.code);
    }

    if (this.selectedMarque === null) {
      params.push('');
    } else {
      params.push(this.selectedMarque.code);
    }
    let articles = [];
    await this.stockService
      .findStocksForVente(
        params[0],
        params[1],
        params[2],
        params[3],
        params[4],
        params[5]
      )
      .toPromise()
      .then((data) => {
        articles = data['_embedded'].stocks;
      });
    if (articles.length > 200) {
      this.msgs = 'Veuillez affiner vos critères !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e);
    } else {
      this.articles = articles;
    }
  }
  vider(e) {
    this.selectedFournisseur = null;
    this.selectedFamille = null;
    this.selectedSousFamille = null;
    this.selectedMarque = null;
    this.disponibleCheked = false;
    this.articles = [];
  }
  async mvmtsAc(codeArticle) {
    this.titreModalMouvements =
      'Mouvements année courante de l\'article : ' + codeArticle;
    await this.mouveService
      .getMouveByCodeForConsultationRef(codeArticle)
      .toPromise()
      .then((data) => {
        this.mouvementsArticle = data['_embedded'].mouvementDuStocks;
      });
    this.displayMouvesArticle = true;
  }
  async mvmtsA1(codeArticle) {
    this.titreModalMouvements =
      'Mouvements année_1 de l\'article : ' + codeArticle;
    await this.mouve1Service
      .getMouve1ByCodeForConsultationRef(codeArticle)
      .toPromise()
      .then((data) => {
        this.mouvementsArticle = data['_embedded'].mouvementDuStocks;
      });
    this.displayMouvesArticle = true;
  }
  async offres(codeArticle, e) {
    this.titreModalOffres = 'Offres pour l\'article : ' + codeArticle;
    await this.ddevisService
      .getDdevisByCodeArtAndCodeClt(codeArticle, this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.offresArticle = data['_embedded'].ddevis;
      });
    if (this.offresArticle.length > 0) {
      this.displayOffresArticle = true;
    } else {
      this.msgs = 'Aucune offre trouvée pour cet article !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e);
    }
  }
  totaliser() {
    this.totaux = {
      totalBrut: '0.000',
      totalRemise: '0.000',
      totalHT: '0.000',
      totalBase0: '0.000',
      totalTva13: '0.000',
      totalBase13: '0.000',
      totalTva19: '0.000',
      totalBase19: '0.000',
      totalTva7: '0.000',
      totalBase7: '0.000',
      timbre: '0.000',
      totalTtc: '0.000',
    };
    /*if (this.selectedClient.timbre !== 'N') {
      this.totaux.timbre = '0.600';
      this.totaux.totalTtc = '0.600';
    }*/
    if (this.listeArticlesSaisies.length > 0) {
      for (let i = 0; i < this.listeArticlesSaisies.length; i++) {
        this.totaux.totalBrut = (
          Number(this.totaux.totalBrut) +
          Number(this.listeArticlesSaisies[i].prixHT) *
            Number(this.listeArticlesSaisies[i].quantite)
        ).toFixed(3);

        this.totaux.totalRemise = (
          Number(this.totaux.totalRemise) +
          (Number(this.listeArticlesSaisies[i].quantite) *
            Number(this.listeArticlesSaisies[i].prixHT) -
            Number(this.listeArticlesSaisies[i].totalBrutRemise))
        ).toFixed(3);

        this.totaux.totalHT = (
          Number(this.totaux.totalHT) +
          Number(this.listeArticlesSaisies[i].totalBrutRemise)
        ).toFixed(3);

        if (
          Number(this.listeArticlesSaisies[i].tva) === 0 ||
          this.coefExonor === 0
        ) {
          this.totaux.totalBase0 = (
            Number(this.totaux.totalBase0) +
            Number(this.listeArticlesSaisies[i].totalBrutRemise)
          ).toFixed(3);
        }
        if (Number(this.listeArticlesSaisies[i].tva) === 7) {
          this.totaux.totalBase7 = (
            this.coefExonor *
            (Number(this.totaux.totalBase7) +
              Number(this.listeArticlesSaisies[i].totalBrutRemise))
          ).toFixed(3);
          this.totaux.totalTva7 = (
            this.coefExonor *
            (Number(this.totaux.totalTva7) +
              Number(this.listeArticlesSaisies[i].totalBrutRemise) * 0.07)
          ).toFixed(3);
        }
        if (Number(this.listeArticlesSaisies[i].tva) === 13) {
          this.totaux.totalBase13 = (
            this.coefExonor *
            (Number(this.totaux.totalBase13) +
              Number(this.listeArticlesSaisies[i].totalBrutRemise))
          ).toFixed(3);
          this.totaux.totalTva13 = (
            this.coefExonor *
            (Number(this.totaux.totalTva13) +
              Number(this.listeArticlesSaisies[i].totalBrutRemise) * 0.13)
          ).toFixed(3);
        }
        if (Number(this.listeArticlesSaisies[i].tva) === 19) {
          this.totaux.totalBase19 = (
            this.coefExonor *
            (Number(this.totaux.totalBase19) +
              Number(this.listeArticlesSaisies[i].totalBrutRemise))
          ).toFixed(3);
          this.totaux.totalTva19 = (
            this.coefExonor *
            (Number(this.totaux.totalTva19) +
              Number(this.listeArticlesSaisies[i].totalBrutRemise) * 0.19)
          ).toFixed(3);
        }
        this.totaux.totalTtc = (
          Number(this.totaux.timbre) +
          Number(this.totaux.totalBrut) -
          Number(this.totaux.totalRemise) +
          Number(this.totaux.totalTva13) +
          Number(this.totaux.totalTva19) +
          Number(this.totaux.totalTva7)
        ).toFixed(3);
      }
    }
  }
  select(args: any) {
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie(args);
    if (index === 0) {
      const selectedrecord: any = this.grid.getRowInfo(args.target).rowData;
      console.log(selectedrecord);
      let remise = 0;
      if (this.selectedClient.code !== '7200' && this.selectedClient.code !== '7300' && this.selectedClient.code !== '7500') {
        if (
          String(this.selectedClient.marque) !== '' &&
          String(this.selectedClient.marque) !== 'null'
        ) {
          remise = Number(this.selectedClient.marque);
        }
      } else {
        if (this.listeArticlesSaisies.length > 0) {
          remise = Number(
            this.listeArticlesSaisies[this.listeArticlesSaisies.length - 1]
              .remise
          );
        }
      }
      this.listeArticlesSaisies.push({
        rang: this.listeArticlesSaisies.length + 1,
        code: selectedrecord.code,
        designation: selectedrecord.design,
        quantite: '1.00',
        remise: Number(remise).toFixed(2),
        tva: (Number(selectedrecord.tva) * this.coefExonor).toFixed(0),
        prixHT: selectedrecord.prix,
        totalBrutRemise: (
          Number(selectedrecord.prix) *
          (1 - Number(this.detailsClient.remise) / 100)
        ).toFixed(3),
        codeAImprimer: selectedrecord.code,
        qteEnStock: selectedrecord.quantite,
        achat: selectedrecord.achat,
        qtEnt: selectedrecord.qtEnt,
        autPrix: 'N',
        quantiteInitial: '1.00',
        remiseInitial: Number(this.detailsClient.remise).toFixed(2),
        prixInitial: selectedrecord.prix,
        codeAImprimerInitial: selectedrecord.code,
        prixReel: selectedrecord.prix,
        qteOffre: '',
        livre: '',
      });
      this.totaliser();
      setTimeout(
        () =>
          document
            .getElementById(`row_quantite${this.listeArticlesSaisies.length}`)
            .click(),
        1
      );
    }
  }
  testSaisie(args): number {
    const selectedrecord: any = this.grid.getRowInfo(args.target).rowData;
    for (let i = 0; i <= this.listeArticlesSaisies.length - 1; i++) {
      if (this.listeArticlesSaisies[i].code === selectedrecord.code) {
        this.msgs = 'Cet article est déjà dans la liste !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(args);
        return 1;
      }
      if (this.listeArticlesSaisies[i].code === '') {
        this.msgs = 'Code article incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById(`row_code${i + 1}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
        this.ov.show(args, document.getElementById(`row_code${i + 1}`));
        return 2;
      }
      if (this.listeArticlesSaisies[i].designation === '') {
        this.msgs = 'Designation article incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById(`row_designation${i + 1}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
        this.ov.show(args, document.getElementById(`row_designation${i + 1}`));
        return 3;
      }
      if (this.listeArticlesSaisies[i].prixHT === '') {
        this.msgs = 'Veuillez saisir le prix !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById(`row_prix${i + 1}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
        this.ov.show(args, document.getElementById(`row_prix${i + 1}`));
        return 4;
      } else {
        if (
          String(Number(this.listeArticlesSaisies[i].prixHT)) === 'NaN' ||
          Number(this.listeArticlesSaisies[i].prixHT) === 0
        ) {
          this.msgs = 'Prix Incorrect !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById(`row_prix${i + 1}`).scrollIntoView({
            inline: 'start',
            block: 'start',
          });
          this.ov.show(args, document.getElementById(`row_prix${i + 1}`));
          return 5;
        }
      }
      if (this.listeArticlesSaisies[i].quantite === '') {
        this.msgs = 'Veuillez saisir la quantite !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById(`row_quantite${i + 1}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
        this.ov.show(args, document.getElementById(`row_quantite${i + 1}`));
        return 6;
      } else {
        if (
          String(Number(this.listeArticlesSaisies[i].quantite)) === 'NaN' ||
          Number(this.listeArticlesSaisies[i].quantite) === 0
        ) {
          this.msgs = 'Quantite Incorrect !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById(`row_quantite${i + 1}`).scrollIntoView({
            inline: 'start',
            block: 'start',
          });
          this.ov.show(args, document.getElementById(`row_quantite${i + 1}`));
          return 7;
        }
      }
    }
    return 0;
  }
  nouvelleSaisie(e) {
    this.numero = '';
    this.hideSaisieCard = true;
    this.hideSaisirBtn = false;
    this.viderSelectedClient();
    this.selectedVendeur = null;
    this.bcClt = '';
    this.listeArticlesSaisies = [];
    this.totaux = {
      totalBrut: '0.000',
      totalRemise: '0.000',
      totalHT: '0.000',
      totalBase0: '0.000',
      totalTva13: '0.000',
      totalBase13: '0.000',
      totalTva19: '0.000',
      totalBase19: '0.000',
      totalTva7: '0.000',
      totalBase7: '0.000',
      timbre: '0.000',
      totalTtc: '0.000',
    };
    this.rechArtCode = '';
    this.selectedRechType = 'Tout';
    // this.hideRechCriteres = true;
    this.validerShow = true;
    this.articles = [];
  }
  async imprimer(index) {
    this.duplicata.combine = this.numero;
    this.duplicata.nature = this.typeAvoir;
    this.duplicata.selectedValuesDup = false;
    if (index === 0) {
      this.duplicata.imprimerDirect = true;
    } else {
      this.duplicata.imprimerDirect = false;
    }
    await this.duplicata.afficher();
    await this.duplicata.imprimer(index);
  }
  async changeTypeRech(e) {
    if (this.selectedRechType === 'Tout') {
      this.hideRechCriteres = true;
      await this.rechercheArticle(e);
    } else {
      await this.afficher(e);
    }
  }
  updateClientInfos(e) {
    this.ov.hide();
    this.wasInside = true;
    if (this.selectedClient !== null) {
      console.log(this.selectedClient);
      let remiseClt = '';
      if (String(this.selectedClient.marque) !== 'null') {
        remiseClt = Number(this.selectedClient.marque).toFixed(2);
      }
      if (
        this.selectedClient.code === '7200' ||
        this.selectedClient.code === '7500'
      ) {
        this.enableEditClientInfos = true;
        this.detailsClient = {
          code: '',
          deno: '',
          mr: '',
          adresse: '',
          ville: '',
          codeTva: '',
          remise: remiseClt,
        };
      } else {
        this.enableEditClientInfos = false;
        this.detailsClient = {
          code: this.selectedClient.code,
          deno: this.selectedClient.deno,
          mr: this.selectedClient.respon,
          adresse: this.selectedClient.adresse,
          ville: this.selectedClient.ville,
          codeTva: this.selectedClient.codeTva,
          remise: remiseClt,
        };
      }
      this.hideVendeurSelect = false;
      setTimeout(() => this.ngSelectVendeur.focus(), 1);
    }
  }
  viderSelectedVendeur() {
    this.selectedVendeur = {};
    this.bcClt = '';
    this.hideBcClt = true;
    this.hideSaisirBtn = true;
  }
  updateVendeurInfos() {
    if (
      String(this.selectedVendeur) !== 'null' &&
      this.selectedVendeur !== null
    ) {
      if (
        String(this.selectedVendeur.code) !== 'null' &&
        String(this.selectedVendeur.code) !== ''
      ) {
        this.hideBcClt = false;
        setTimeout(() => document.getElementById('bcClt').focus(), 1);
      }
    }
  }
  focusNextInput(index: number) {
    if (index < 4) {
      document.getElementById(`inputDetailsClient${index}`).focus();
    } else {
      setTimeout(() => document.getElementById('saisirBtn').focus(), 1);
    }
  }
  async verifBcClt(e) {
    this.ov.hide();
    this.wasInside = true;
    if (this.bcClt !== '') {
      this.hideSaisirBtn = false;
      setTimeout(() => document.getElementById('saisirBtn').focus(), 1);
    } else {
      this.msgs = 'Attention Ce champs est obligatoire !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e);
    }
  }
  annulerSelectionStock(): void {
    this.wasInside = true;
    this.ov.hide();
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  ngAfterViewChecked() {
    if (
      this.listeArticlesSaisies.length > 0 &&
      this.listeArticlesSaisies.length !== this.listeArticlesSaisiesLength &&
      !this.hideSaisieCard
    ) {
      this.scrollToBottom();
      this.listeArticlesSaisiesLength = this.listeArticlesSaisies.length;
    }
  }
  private scrollToBottom(): void {
    document
      .getElementById(`row_code${this.listeArticlesSaisies.length}`)
      .scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'start',
      });
  }
  async rechercheArticle(e) {
    if (this.rechIndic === 0) {
    if (this.selectedRechType === 'Tout') {
      await this.stockService
        .getStockByCode(this.rechArtCode)
        .toPromise()
        .then((data) => {
          this.articles = data['_embedded'].stocks;
        });
    } else {
      await this.afficher(e);
    }}
    /*if (this.articles.length > 0) {
      setTimeout(() => this.grid.selectRows([0]), 10);
    }*/
  }
  annulerSaisie(col, ri, e) {
    this.wasInside = true;
    this.ov.hide();
    ri = Number(ri) - 1;
    if (col === 'qte') {
      this.listeArticlesSaisies[ri].quantite =
        this.listeArticlesSaisies[ri].quantiteInitial;
    }
    if (col === 'remise') {
      this.listeArticlesSaisies[ri].remise =
        this.listeArticlesSaisies[ri].remiseInitial;
    }
    if (col === 'prixHT') {
      this.listeArticlesSaisies[ri].prixHT =
        this.listeArticlesSaisies[ri].prixInitial;
    }
    if (col === 'codeAimprimer') {
      this.listeArticlesSaisies[ri].codeAImprimer =
        this.listeArticlesSaisies[ri].codeAImprimerInitial;
    }
  }
  async testSaisieFinal(args) {
    this.verifSaisieFinal = true;
    if (this.listeArticlesSaisies.length < 1) {
      this.msgs = 'Aucune article saisie !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(args);
      this.verifSaisieFinal = false;
      return;
    }
    for (let i = 0; i <= this.listeArticlesSaisies.length - 1; i++) {
      let article = [];

      if (this.listeArticlesSaisies[i].code === '') {
        this.msgs = 'Code article incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById(`row_code${i + 1}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
        this.ov.show(args, document.getElementById(`row_code${i + 1}`));
        this.verifSaisieFinal = false;
        break;
      } else {
        await this.stockService
          .getStock(this.listeArticlesSaisies[i].code)
          .toPromise()
          .then((data) => {
            article = data['_embedded'].stocks;
          });
        if (article.length < 1) {
          this.msgs = 'Article inexistant en Stock !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById(`row_code${i + 1}`).scrollIntoView({
            inline: 'start',
            block: 'start',
          });
          this.ov.show(args, document.getElementById(`row_code${i + 1}`));
          this.verifSaisieFinal = false;
          break;
        }
      }
      if (this.listeArticlesSaisies[i].designation === '') {
        this.msgs = 'Designation article incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById(`row_designation${i + 1}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
        this.ov.show(args, document.getElementById(`row_designation${i + 1}`));
        this.verifSaisieFinal = false;
        break;
      }
      if (this.listeArticlesSaisies[i].quantite === '') {
        this.msgs = 'Veuillez saisir la quantite !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById(`row_quantite${i + 1}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
        this.ov.show(args, document.getElementById(`row_quantite${i + 1}`));
        this.verifSaisieFinal = false;
        break;
      } else {
        if (
          String(Number(this.listeArticlesSaisies[i].quantite)) === 'NaN' ||
          Number(this.listeArticlesSaisies[i].quantite) === 0
        ) {
          this.msgs = 'Quantite Incorrect !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById(`row_quantite${i + 1}`).scrollIntoView({
            inline: 'start',
            block: 'start',
          });
          this.ov.show(args, document.getElementById(`row_quantite${i + 1}`));
          this.verifSaisieFinal = false;
          break;
        } else {
          if (
            !Number.isInteger(Number(this.listeArticlesSaisies[i].quantite)) &&
            this.listeArticlesSaisies[i].qtEnt === 'O'
          ) {
            this.msgs = 'quantite doit être entière !';
            this.styleOvPanel = this.styleOvPanelError;
            document.getElementById(`row_quantite${i + 1}`).scrollIntoView({
              inline: 'start',
              block: 'start',
            });
            this.ov.show(args, document.getElementById(`row_quantite${i + 1}`));
            this.verifSaisieFinal = false;
            break;
          } else {
            if (
              this.listeArticlesSaisies[i].livre !== '' &&
              Number(this.listeArticlesSaisies[i].quantite) >
                Number(this.listeArticlesSaisies[i].livre)
            ) {
              this.msgs = 'Quantite saisie > Quantite offre !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById(`row_quantite${i + 1}`).scrollIntoView({
                inline: 'start',
                block: 'start',
              });
              this.ov.show(
                args,
                document.getElementById(`row_quantite${i + 1}`)
              );
              this.verifSaisieFinal = false;
              break;
            }
          }
        }
      }

      if (
        this.listeArticlesSaisies[i].remise === '' ||
        String(Number(this.listeArticlesSaisies[i].remise)) === 'NaN'
      ) {
        this.msgs = 'Remise incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById(`row_remise${i + 1}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
        this.ov.show(args, document.getElementById(`row_remise${i + 1}`));
        this.verifSaisieFinal = false;
        break;
      } else {
        this.listeArticlesSaisies[i].remise = Number(
          this.listeArticlesSaisies[i].remise
        ).toFixed(2);
        if (
          Number(this.listeArticlesSaisies[i].remise) >
          Number(this.detailsClient.remise)
        ) {
          this.msgs = 'Remise max pour ce client depassée ou inexistant !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById(`row_remise${i + 1}`).scrollIntoView({
            inline: 'start',
            block: 'start',
          });
          this.ov.show(args, document.getElementById(`row_remise${i + 1}`));
          this.verifSaisieFinal = false;
          break;
        }
      }

      if (this.listeArticlesSaisies[i].prixHT === '') {
        this.msgs = 'Veuillez saisir le prix !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById(`row_prix${i + 1}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
        this.ov.show(args, document.getElementById(`row_prix${i + 1}`));
        this.verifSaisieFinal = false;
        break;
      } else {
        if (
          String(Number(this.listeArticlesSaisies[i].prixHT)) === 'NaN' ||
          Number(this.listeArticlesSaisies[i].prixHT) === 0
        ) {
          this.msgs = 'Prix Incorrect !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById(`row_prix${i + 1}`).scrollIntoView({
            inline: 'start',
            block: 'start',
          });
          this.ov.show(args, document.getElementById(`row_prix${i + 1}`));
          this.verifSaisieFinal = false;
          break;
        }
      }
    }
  }
  public dataBound(args): void {
    if (this.articles.length > 0) {
      this.grid.selectRows([0]);
    }
  }
}
