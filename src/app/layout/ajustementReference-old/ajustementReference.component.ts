import { Component, OnInit, ViewChild } from '@angular/core';
import { Stock } from '../services/stock';
import { StockService } from '../services/stock.service';
import { RegulatService } from '../services/regulat.service';
import { Mouve } from '../services/mouve';
import { MouveService } from '../services/mouve.service';
import { Sortie } from '../services/sortie';
import { SortieService } from '../services/sortie.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Regulat } from '../services/regulat';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ajustementreference',
  templateUrl: './ajustementReference.component.html',
  styleUrls: ['./ajustementReference.component.scss'],
  providers: [MessageService]
})
export class AjustementReferenceComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('gridRegu')
  public gridRegu: GridComponent;
  public formatOptions: any;
  selectedIndex = 0;
  selectedStock;
  dateValue;
  senss = [{ label: '', value: '' }, { label: '+', value: 'D' }, { label: '-', value: 'C' }];
  regulatsDatasource: Regulat[] = [];
  numero: string;
  date;
  reference = null;
  designation = null;
  quantite = null;
  sens = null;
  argument = null;
  stocks: Stock[];
  constructor(
    private regulatService: RegulatService,
    private stockService: StockService,
    private mouveService: MouveService,
    private sortieService: SortieService,
    private messageService: MessageService
  ) {
    this.reloadDataRegu();
    this.applyFilterArtParCode('');
  }
  testValidation(): boolean {
    let ret = true;
    if (this.reference === '' || this.reference === null) {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez selectionner un référence !'
      });
      ret = false;
      return;
    }
    if (
      this.quantite <= 0 ||
      this.quantite === '' ||
      this.quantite === null ||
      Number(this.quantite).toLocaleString() === 'NaN' ||
      !Number.isInteger(Number(this.quantite))
    ) {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'Quantité incorrect !'
      });
      ret = false;
      return;
    }
    if (this.sens === '' || this.sens === null) {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez selectionner un sens !'
      });
      ret = false;
      return;
    }
    const selectedRecord: any = this.grid.getSelectedRecords()[0];

    if (this.sens === 'C' && selectedRecord.quantite < this.quantite) {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'Quantité incorrect !'
      });
      ret = false;
      return;
    }
    if (this.argument === '' || this.argument === null) {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez saisir une argumentation !'
      });
      ret = false;
      return;
    }
    return ret;
  }
  async valider() {
    if (this.testValidation()) {
      const selectedRecord: any = this.grid.getSelectedRecords()[0];
      let mouve: Mouve;
      mouve = {
        id: '',
        combine: 'REGULAT  ' + this.numero,
        code: this.reference,
        quantite: this.quantite,
        tRemise: null,
        prix: selectedRecord.prix,
        date: this.date,
        operateur: null,
        sens: this.sens,
        tauxTva: null,
        base: null,
        achat: null,
        codeAimprimer: null,
        rang: null,
        numbc: null,
        autPrix: null,
        totalbrut: null,
        qtEnt: null,
        prixArt: null,
        qtOffre: null,
        designation: null
      };
      await this.mouveService
        .createMouve(mouve)
        .toPromise()
        .then(data => {}, error => {});
      let sortie: Sortie;
      sortie = {
        id: '',
        numero: this.numero,
        lib: this.argument
      };
      await this.sortieService
        .createSortie(sortie)
        .toPromise()
        .then(data => {}, error => {});
      let stock: Stock;
      if (this.sens === 'D') {
        this.quantite = this.quantite * -1;
      }
      stock = {
        id: selectedRecord.id,
        code: selectedRecord.code,
        design: selectedRecord.design,
        quantite: String(selectedRecord.quantite - this.quantite),
        tva: selectedRecord.tva,
        prix: selectedRecord.prix,
        achat: selectedRecord.achat,
        marge: selectedRecord.marge,
        operateur: selectedRecord.operateur,
        achatD: selectedRecord.achatD,
        famille: selectedRecord.famille,
        achatP: selectedRecord.achatP,
        devise: selectedRecord.devise,
        sfamille: selectedRecord.sfamille,
        taxe: selectedRecord.taxe,
        origine: selectedRecord.origine,
        equiv: selectedRecord.equiv,
        imp: selectedRecord.imp,
        min: selectedRecord.min,
        max: selectedRecord.max,
        commQuant: selectedRecord.commQuant,
        dPachat: selectedRecord.dPachat,
        pInv: selectedRecord.pInv,
        qInv: selectedRecord.qInv,
        agenda: selectedRecord.agenda,
        qtEnt: selectedRecord.qtEnt,
        emplacement: selectedRecord.emplacement,
        nbrC: selectedRecord.nbrC,
        nbrCl: selectedRecord.nbrCl,
        nbrBl: selectedRecord.nbrBl,
        qtTotal: selectedRecord.qtTotal,
        ca: selectedRecord.ca,
        profilCa: selectedRecord.profilCa,
        profilTyp: selectedRecord.profilTyp,
        qteTotal1: selectedRecord.qteTotal1,
        qtTotal1: selectedRecord.qtTotal1
      };
      await this.stockService
        .updateStock(stock)
        .toPromise()
        .then(
          data => {
            this.annuler();
            this.reloadDataRegu();
            this.applyFilterArtParCode('');
          },
          error => {}
        );
      this.messageService.add({
        key: 'tc',
        severity: 'success',
        summary: 'Succès',
        detail: 'Regulatrisation du stock a été effectué avec succès'
      });
    }
  }
  annuler() {
    this.reference = '';
    this.designation = '';
    this.quantite = '';
    this.sens = '';
    this.argument = '';
  }

  async reloadDataRegu() {
    await this.regulatService
      .getRegulats()
      .toPromise()
      .then(data => {
        const regulatsTemp: any = data['_embedded'].regulats;
        this.numero = Math.max.apply(
          Math,
          regulatsTemp.map(function(o) {
            return o.numero + 1;
          })
        );
        this.date = new Date().toLocaleDateString('en-GB');
        if (String(regulatsTemp.length).length === 4) {
          this.numero = '' + String(regulatsTemp.length + 1);
        }
        if (String(regulatsTemp.length).length === 3) {
          this.numero = '0' + String(regulatsTemp.length + 1);
        }
        if (String(regulatsTemp.length).length === 2) {
          this.numero = '00' + String(regulatsTemp.length + 1);
        }
        if (String(regulatsTemp.length).length === 1) {
          this.numero = '000' + String(regulatsTemp.length + 1);
        }
        this.regulatsDatasource = regulatsTemp;
        this.gridRegu.refresh();
      });
  }
  ngOnInit() {}
  async applyFilterArtParCode(filterValue: string) {
    await this.stockService
      .getStockList(filterValue)
      .toPromise()
      .then(data => {
        const stocksTemp = data['_embedded'].stocks;
        this.stocks = stocksTemp;
        this.grid.refresh();
      });
  }
  ajouterArt(): void {
    const selectedRecord: any = this.grid.getSelectedRecords()[0];
    this.reference = selectedRecord.code;
    this.designation = selectedRecord.design;
  }
  annulerSelectionStock(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  annulerSelectionRegu(): void {
    if (this.gridRegu.getSelectedRowIndexes()[0] >= 0) {
      this.gridRegu.selectRows([]);
    }
  }
}
