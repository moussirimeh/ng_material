import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Famille } from '../services/famille';
import { FamilleService } from '../services/famille.service';
import { SfamilleService } from '../services/sfamille.service';
import { FournisseurService } from '../services/fournisseur.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Sfamille } from '../services/sfamille';
import { Fournisseur } from '../services/fournisseur';
@Component({
  selector: 'app-gestion-articles',
  templateUrl: './gestion-articles.component.html',
  styleUrls: ['./gestion-articles.component.scss']
})
export class GestionArticlesComponent implements OnInit {
  @ViewChild('gridStock')
  public gridStock: GridComponent;
  showPanel = false;
  stocks = [];
  code = '';
  familles = [];
  sfamilles = [];
  fournisseurs = [];
  choixON = [
    {name: '', value: null},
    {name: 'OUI', value: 'O'},
    {name: 'NON', value: 'N'},
];
  selectedFamille: Famille = {
    id: '',
    code: '',
    nom: ''
  };
  selectedSFamille: Sfamille = {
    id: '',
    code: '',
    nom: ''
  };
  selectedFournisseur: Fournisseur = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
     ville: '',
     post: '',
     tel: '',
     telex: '',
     frs: '',
     respon: '',
     agence: '',
     banque: '',
     fax: '',
     compte: '',
     pays: '',
     plafond: '',
     ech: '',
     delai: '',
     typef: '',
     date_creat: ''
  };
  selectedArticle: any = {
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
    qtTotal1: ''
  };
  constructor(
    private stockService: StockService,
    private familleService: FamilleService,
    private sFamilleService: SfamilleService,
    private fournisseurService: FournisseurService
  ) {}

  async ngOnInit() {
    await this.stockService
      .getStockList('')
      .toPromise()
      .then(data => {
        this.stocks = data['_embedded'].stocks;
      });
    await this.familleService
      .getFamillesList()
      .toPromise()
      .then(data => {
        this.familles = data['_embedded'].familles;
      });
      await this.sFamilleService
      .getSfamillesList()
      .toPromise()
      .then(data => {
        console.log(data);

        this.sfamilles = data['_embedded'].sfamilles;
      });
      await this.fournisseurService
      .FourList()
      .toPromise()
      .then(data => {
        console.log(data);
        this.fournisseurs = data['_embedded'].fournisseurs;
      });
  }
  async rechercherArticle() {
    await this.stockService
      .getStockList(this.code)
      .toPromise()
      .then(data => {
        this.stocks = data['_embedded'].stocks;
      });
  }
  modifier() {
    this.selectedArticle = this.gridStock.getSelectedRecords()[0];
    this.selectedFamille = this.familles.find(x => x.code === this.selectedArticle.famille);
    this.selectedSFamille = this.sfamilles.find(x => x.code === this.selectedArticle.sfamille);
    this.selectedFournisseur = this.fournisseurs.find(x => x.code === this.selectedArticle.operateur);
    this.showPanel = true;
  }
}
