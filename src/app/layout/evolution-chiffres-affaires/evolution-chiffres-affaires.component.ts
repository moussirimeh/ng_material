import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../services/client.service';
import { ZoneService } from '../services/zone.service';
import { FournisseurService } from '../services/fournisseur.service';
import { Famille } from '../services/famille';
import { SfamilleService } from '../services/sfamille.service';
import { StockService } from '../services/stock.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { FamilleService } from '../services/famille.service';
import { RepresanService } from '../services/represan.service';
import { GroupeService } from '../services/groupe.service';
import { SecteurService } from '../services/secteur.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ViewMouveService } from '../services/view-mouve.service';
import { ViewMouve1Service } from '../services/view-mouve1.service';
import { ViewMouve2Service } from '../services/view-mouve2.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ExcelService } from '../services/excel.service';
import {
  ExcelExportProperties,
  ToolbarService,
  ToolbarItems,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-evolution-chiffres-affaires',
  templateUrl: './evolution-chiffres-affaires.component.html',
  styleUrls: ['./evolution-chiffres-affaires.component.scss'],
  providers: [ExcelService, ToolbarService],
})
export class EvolutionChiffresAffairesComponent implements OnInit {
  readonly: boolean;
  affichBTn: boolean;
  affichegrid = false;
  btnAffich: boolean;
  listeClients = new Array();
  listeZones = new Array();
  listefournisseurs = new Array();
  listefamilles = new Array();
  listeSfamilles = new Array();
  listeArticles = new Array();
  listeRepresan = new Array();
  listegroupe = new Array();
  listeVend = new Array();
  listeActivite = new Array();
  afficherbtn: boolean;
  afficherGrid = false;
  affbtn2 = false;
  affichBtnInitialiser = false;
  selectedValue;
  public customAttributes: Object;
  selectedVendeur: any;
  readOnly: boolean;
  liste;
  btnNouvelSaisie: boolean;
  selectedclt: any;
  selectedRef: any;
  selectedFour: any;
  selectedTypolClient: any;
  selectedfamille: any;
  selectedSfamille: any;
  selectedActivite: any;
  selectedConsRev: any;
  selectedZ: any;
  selectedRep: any;
  selectedG: any;
  codeArtcl: any;
  codeFour: string;
  public toolbarOptions: ToolbarItems[];
  codeFamille: string;
  codeVend: string;
  codeRepresan: string;
  codeSfamille: string;
  codeTypologie: string;
  codeZ: string;
  codeConsRev: string;
  codeActivite: string;
  codeClt: string;
  listechAff = [];
  listeCh = [];


  datecourant = new Date().toLocaleDateString('en-GB');
  h1AnneCourante = new Date().getFullYear();
  h2Anne_1 = this.h1AnneCourante - 1;
  h3Anne_2 = this.h1AnneCourante - 2;

  chAnCourante = 'Année ' + String(this.h1AnneCourante);
  chAnn_1 = 'Année ' + String(this.h2Anne_1);
  chAnn_2 = 'Année ' + String(this.h3Anne_2);

  Mois = [
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
  ];

  // liste des types clients
  listeTypeClt = new Array();
  typologieItems = [
    { id: 'N', deno: 'N' },
    { id: 'M', deno: 'M' },
    { id: 'S', deno: 'S' },
    { id: 'C', deno: 'C' },
    { id: 'P', deno: 'P' },
    { id: 'I', deno: 'I' },
  ];

  // LISTE DES CONS REV
  listeConsRev = new Array();
  ConsRevItems = [
    { id: 'C', deno: 'C' },
    { id: 'R', deno: 'R' },
  ];
  @ViewChild('grid')
  public grid: GridComponent;
  listRef: any;
  codeGroupe: any;
  listeChiffAff = new Array();
  listeChiffAff_1 = new Array();
  listeChiffAff_2 = new Array();
  TotalCourant = 0;
  Total_1 = 0;
  Total_2 = 0;
  dernier: any;
  refArticle: any;

  // ,private excelService: ExcelService
  constructor(
    private clientService: ClientService,
    private zoneService: ZoneService,
    private fournisseurService: FournisseurService,
    private familleService: FamilleService,
    private sfamilleService: SfamilleService,
    private stockService: StockService,
    private represanService: RepresanService,
    private groupeService: GroupeService,
    private vendeur1Service: Vendeur1Service,
    private secteurService: SecteurService,
    private viewMouveService: ViewMouveService,
    private viewMouve1Service: ViewMouve1Service,
    private excelService: ExcelService,
    private viewMouve2Service: ViewMouve2Service,
    private config: NgSelectConfig
    ) {
      this.config.notFoundText = 'aucun élément trouvé';
      this.config.clearAllText = 'Supprimer tous';
    }
    asy;

  gererExcel() {
    const excelExportProperties: ExcelExportProperties = {
      // fileName: 'RAPPORT DE VISITES' + this.selectedUser.nPUtil + '.xlsx'
      fileName: 'evolution chiff aff.xlsx',
    };
    this.grid.excelExport(excelExportProperties);
  }
  changeGroupe() {
    if (this.selectedG !== null && this.selectedG !== undefined) {
      this.codeGroupe = this.selectedG.code;
    } else {
      this.codeGroupe = '';
    }
  }

  changeClient() {
    if (this.selectedclt !== null && this.selectedclt !== undefined) {
      this.codeClt = this.selectedclt.code;
    } else {
      this.codeClt = '';
    }
  }

  changeFour() {
    if (this.selectedFour !== null && this.selectedFour !== undefined) {
      this.codeFour = this.selectedFour.code;
    } else {
      this.codeFour = '';
    }
  }

  changeFmille() {
    if (this.selectedfamille !== null && this.selectedfamille !== undefined) {
      this.codeFamille = this.selectedfamille.code;
    } else {
      this.codeFamille = '';
    }
  }

  changeSFamille() {
    if (this.selectedSfamille !== null && this.selectedSfamille !== undefined) {
      this.codeSfamille = this.selectedSfamille.code;
    } else {
      this.codeSfamille = '';
    }
  }

  changeTypologieClt() {
    if (
      this.selectedTypolClient !== null &&
      this.selectedTypolClient !== undefined
    ) {
      this.codeTypologie = this.selectedTypolClient.id;
    } else {
      this.codeTypologie = '';
    }
  }

  changeArticle() {
    if (this.selectedRef !== null && this.selectedRef !== undefined) {
      this.codeArtcl = this.selectedRef.code;
    } else {
      this.codeArtcl = '';
    }
  }

  changeActivite() {
    if (this.selectedActivite !== null && this.selectedActivite !== undefined) {
      this.codeActivite = this.selectedActivite.code;
    } else {
      this.codeActivite = '';
    }
  }

  changeZone() {
    if (this.selectedZ !== null && this.selectedZ !== undefined) {
      this.codeZ = this.selectedZ.code;
    } else {
      this.codeZ = '';
    }
  }

  changeRepresentant() {
    if (this.selectedRep !== null && this.selectedRep !== undefined) {
      this.codeRepresan = this.selectedRep.code;
    } else {
      this.codeRepresan = '';
    }
  }

  async rechArticle(mot) {
    //  this.listeStocks = new Array();
    this.refArticle = mot;
    await this.stockService
      .getStockList(mot)
      .toPromise()
      .then((data) => {
        console.log('liste stock ', data);
        this.listeArticles = data['_embedded'].stocks;
      });
  }



  changeConsRev() {
    if (this.selectedConsRev !== null && this.selectedConsRev !== undefined) {
      this.codeConsRev = this.selectedConsRev.id;
    } else {
      this.codeConsRev = '';
    }
  }

  changeVendeur() {
    if (this.selectedVendeur !== null && this.selectedVendeur !== undefined) {
      this.codeVend = this.selectedVendeur.code;
    } else {
      this.codeVend = '';
    }
  }

  // methode afficher
  async afficher() {
    this.TotalCourant = 0;
    this.Total_1 = 0;
    this.Total_2 = 0;
    await this.viewMouveService
      .getEvolutionCA(
        this.codeClt,
        this.codeArtcl,
        this.codeFour,
        this.codeTypologie,
        this.codeFamille,
        this.codeVend,
        this.codeActivite,
        this.codeConsRev,
        this.codeSfamille,
        this.codeZ,
        this.codeRepresan,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('liste evo chif aff ', data);
        this.listeChiffAff = data['_embedded'].evolutionChifAffs;
      });
    // service view move1
    await this.viewMouve1Service
      .getEvolutionCA(
        this.codeClt,
        this.codeArtcl,
        this.codeFour,
        this.codeTypologie,
        this.codeFamille,
        this.codeVend,
        this.codeActivite,
        this.codeConsRev,
        this.codeSfamille,
        this.codeZ,
        this.codeRepresan,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('liste evo chif aff ', data);
        this.listeChiffAff_1 = data['_embedded'].evolutionChifAffs;
      });
    /// service view move2
    await this.viewMouve2Service
      .getEvolutionCA(
        this.codeClt,
        this.codeArtcl,
        this.codeFour,
        this.codeTypologie,
        this.codeFamille,
        this.codeVend,
        this.codeActivite,
        this.codeConsRev,
        this.codeSfamille,
        this.codeZ,
        this.codeRepresan,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('liste evo chif aff ', data);
        this.listeChiffAff_2 = data['_embedded'].evolutionChifAffs;
      });
    ////
    const listeCh = [];
    let totAnneeC = 0;
    let totAnnee1 = 0;
    let totAnnee2 = 0;
    let compteurTab1 = 0;
    let compteurTab2 = 0;
    let compteurTab3 = 0;
    for (let i = 0; i < this.Mois.length; i++) {
      //  console.log('chiffffffffffffffffffffffffff aff ', this.listeChiffAff  );
      const obj = {
        mois: '',
        anneeCourante: '',
        annee_1: '',
        annee_2: '',
      };
      obj.mois = this.Mois[i];


       if (this.listeChiffAff.length > 0) {
        if (this.listeChiffAff[compteurTab1].mois === i + 1) {
          obj.anneeCourante = Number(this.listeChiffAff[compteurTab1].ca).toFixed(3);
          totAnneeC = totAnneeC + this.listeChiffAff[compteurTab1].ca;
          if (compteurTab1 < this.listeChiffAff.length - 1) {
          compteurTab1++; }
        } else {
          obj.anneeCourante = '';
        }} else { obj.anneeCourante = ''; }

        if (this.listeChiffAff_1.length > 0) {
          console.log(compteurTab2);
        if (this.listeChiffAff_1[compteurTab2].mois === i + 1) {
          obj.annee_1 = Number(this.listeChiffAff_1[compteurTab2].ca).toFixed(3);
          totAnnee1 = totAnnee1 + this.listeChiffAff_1[compteurTab2].ca;
          if (compteurTab2 < this.listeChiffAff_1.length - 1) {
          compteurTab2++; }
        } else {
          obj.annee_1 = '';
        }} else { obj.annee_1 = ''; }

        if (this.listeChiffAff_2.length > 0) {
        if (this.listeChiffAff_2[compteurTab3].mois === i + 1) {
          obj.annee_2 = Number(this.listeChiffAff_2[compteurTab3].ca).toFixed(3);
          totAnnee2 = totAnnee2 + this.listeChiffAff_2[compteurTab3].ca;
          if (compteurTab3 < this.listeChiffAff_2.length - 1) {
          compteurTab3++; }
        } else {
          obj.annee_2 = '';
        }} else { obj.annee_2 = ''; }

      listeCh.push(obj);



    }

    listeCh.push({
      mois: '<p style=\'font-size: 17px; font-weight: 500;\'>TOTAL</p>',
      anneeCourante: '<p style=\'font-size: 17px; font-weight: 500;\'>' + Number(totAnneeC).toFixed(3) + '</p>',
      annee_1: '<p style=\'font-size: 17px; font-weight: 500;\'>' + Number(totAnnee1).toFixed(3) + '</p>',
      annee_2: '<p style=\'font-size: 17px; font-weight: 500;\'>' + Number(totAnnee2).toFixed(3) + '</p>',
    });

    this.listechAff = listeCh;

    this.afficherGrid = true;
    this.affichBTn = false;
    this.readonly = true;
  }
  // charger la liste des clients
  async chargerClients() {
    if (this.listeClients.length === 0) {
      await this.clientService
        .getClientsListByOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des clients ', data['_embedded'].clients);

          this.listeClients = data['_embedded'].clients;
        });
    }
  }
  // charger la liste des zone
  async chargerZone() {
    if (this.listeZones.length === 0) {
      await this.zoneService
        .getZonesList()
        .toPromise()
        .then((data) => {
          console.log('liste des zones ', data);
          this.listeZones = data['_embedded'].zones;
        });
    }
  }
  // charger la liste des four

  async chargerFournisseur() {
    if (this.listefournisseurs.length === 0) {
      await this.fournisseurService
        .getFournisseurListByOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des fournisseurs ', data);
          this.listefournisseurs = data['_embedded'].fournisseurs;
        });
    }
  }
  // charger la liste des Famille
  async chargerFamille() {
    if (this.listefamilles.length === 0) {
      await this.familleService
        .getFamillesByOrderByNom()
        .toPromise()
        .then((data) => {
          console.log('liste des familles ', data);
          this.listefamilles = data['_embedded'].familles;
        });
    }
  }
  // charger la liste sous Famille
  async chargerSousFamille() {
    if (this.listeSfamilles.length === 0) {
      await this.sfamilleService
        .getSousFamillesByOrderByNom()
        .toPromise()
        .then((data) => {
          console.log('liste des sous familles ', data);
          this.listeSfamilles = data['_embedded'].sfamilles;
        });
    }
  }
  // charger la liste des Articles

  async chargerArticle() {
    if (this.listeArticles.length === 0) {
      await this.stockService
        .getStockList('')
        .toPromise()
        .then((data) => {
          console.log('liste des Articles ', data);
          this.listeArticles = data['_embedded'].stocks;
        });
      console.log(this.listeArticles);
    }
  }
  // charger la liste des representants
  async chargerRepresan() {
    if (this.listeRepresan.length === 0) {
      await this.represanService
        .getRepresansListOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des representants ', data);
          this.listeRepresan = data['_embedded'].represans;
        });
    }
  }
  // charger la liste des groupes
  async chargerGroupe() {
    if (this.listegroupe.length === 0) {
      await this.groupeService
        .getGroupesList()
        .toPromise()
        .then((data) => {
          console.log('liste des groupes', data);
          this.listegroupe = data['_embedded'].groupes;
        });
    }
  }
  // charger la liste des vendeures
  async chargerVendeur() {
    if (this.listeVend.length === 0) {
      await this.vendeur1Service
        .getVendeur1ByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des vendeures', data);
          this.listeVend = data['_embedded'].vendeur1;
        });
    }
  }
  // charger la liste des Activites
  async chargerActivite() {
    if (this.listeActivite.length === 0) {
      await this.secteurService
        .getSecteursList()
        .toPromise()
        .then((data) => {
          console.log('liste des Activites ', data);
          this.listeActivite = data['_embedded'].secteurs;
        });
    }
  }
  public onSearchNom(word: string, item): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchDeno(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchItem(word: string, item): boolean {
    return item.code.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async ngOnInit() {
    this.affichBTn = true;
    this.affichegrid = false;
    this.toolbarOptions = ['ExcelExport'];
    this.codeArtcl = '';
    this.codeFour = '';
    this.codeFamille = '';
    this.codeVend = '';
    this.codeRepresan = '';
    this.codeSfamille = '';
    this.codeTypologie = '';
    this.codeZ = '';
    this.codeConsRev = '';
    this.codeActivite = '';
    this.codeClt = '';
    this.codeGroupe = '';

    this.listeTypeClt = this.typologieItems;
    this.listeConsRev = this.ConsRevItems;
    this.listeSfamilles = new Array();
    this.listeClients = new Array();
    this.listeClients = new Array();
    this.listeRepresan = new Array();
    this.listeVend = new Array();
    this.listeZones = new Array();
    this.listefamilles = new Array();
    this.listegroupe = new Array();
    this.listefournisseurs = new Array();
    this.listeActivite = new Array();
  }

  nouvelleSaisie() {
    this.afficherGrid = false;
    this.affichBTn = true;
    this.readonly = false;
    this.btnNouvelSaisie = false;
  }
  initialiser() {
    this.selectedclt = null;
    this.selectedFour = null;
    this.selectedRef = null;
    this.selectedTypolClient = null;
    this.selectedfamille = null;
    this.selectedSfamille = null;
    this.selectedActivite = null;
    this.selectedConsRev = null;
    this.selectedZ = null;
    this.selectedRep = null;
    this.selectedG = null;
    this.selectedVendeur = null;

    this.codeArtcl = '';
    this.codeFour = '';
    this.codeFamille = '';
    this.codeVend = '';
    this.codeRepresan = '';
    this.codeSfamille = '';
    this.codeTypologie = '';
    this.codeZ = '';
    this.codeConsRev = '';
    this.codeActivite = '';
    this.codeClt = '';
    this.codeGroupe = '';
  }
}
