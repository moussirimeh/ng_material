import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Stock } from '../services/stock';
import { StockService } from '../services/stock.service';
import { RegulatService } from '../services/regulat.service';
import { Mouve } from '../services/mouve';
import { MouveService } from '../services/mouve.service';
import { Sortie } from '../services/sortie';
import { SortieService } from '../services/sortie.service';
import {
  GridComponent,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { Regulat } from '../services/regulat';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { ConfirmationService } from 'primeng/api';
import { Login } from 'src/app/login/login';
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
  selector: 'app-ajustementreference',
  templateUrl: './ajustementReference.component.html',
  styleUrls: ['./ajustementReference.component.scss'],
  providers: [ConfirmationService],
})
export class AjustementReferenceComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('gridRegu')
  public gridRegu: GridComponent;
  public formatOptions: any;
  @ViewChild('drp') dropdownComponent;
  selectedIndex = 0;
  selectedStock;
  dateValue;
  rechCodeArt = '';
  senss = [
    { label: '', value: '' },
    { label: '+', value: 'D' },
    { label: '-', value: 'C' },
  ];
  regulatsDatasource: Regulat[] = [];
  numero: string;
  date;
  reference = null;
  designation = null;
  quantite = null;
  sens = null;
  argument = null;
  stocks: Stock[] = [];
  disableGrid = false;
  public wrapSettings: TextWrapSettingsModel;
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
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.wasInside = true;
    this.ov.hide();
    if (this.grid !== undefined) {
      if (this.grid.getRowInfo(event.target).rowData !== undefined) {
        this.grid.selectRows([this.grid.getRowInfo(event.target).rowIndex]);
        this.ajouterArt();
      }
    }
  }
  constructor(
    private regulatService: RegulatService,
    private stockService: StockService,
    private mouveService: MouveService,
    private sortieService: SortieService,
    private loginService: LoginService,
    private confirmationService: ConfirmationService
  ) {
    this.reloadDataRegu();
    this.applyFilterArtParCode();
  }
  ngOnInit() {
    this.wrapSettings = { wrapMode: 'Content' };
  }
  testValidation(e): boolean {
    let ret = true;
    if (this.reference === '' || this.reference === null) {
      this.msgs = 'Veuillez selectionner un référence !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('ref').focus();
      this.ov.show(e, document.getElementById('ref'));
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
      this.msgs = 'Quantité incorrect !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('qte').focus();
      this.ov.show(e, document.getElementById('qte'));
      ret = false;
      return;
    }
    if (this.sens === '' || this.sens === null) {
      this.msgs = 'Veuillez selectionner un sens !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('sens').focus();
      this.ov.show(e, document.getElementById('sens'));
      ret = false;
      return;
    }
    const selectedRecord: any = this.grid.getSelectedRecords()[0];

    if (
      this.sens === 'C' &&
      Number(selectedRecord.quantite) < Number(this.quantite)
    ) {
      this.msgs = 'Quantité incorrect !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('qte').focus();
      this.ov.show(e, document.getElementById('qte'));
      ret = false;
      return;
    }
    if (this.argument === '' || this.argument === null) {
      this.msgs = 'Veuillez saisir une argumentation !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('argument').focus();
      this.ov.show(e, document.getElementById('argument'));
      ret = false;
      return;
    }
    return ret;
  }
  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.testValidation(e)) {
      const selectedRecord: any = this.grid.getSelectedRecords()[0];
      let nvlQte = Number(this.quantite) + Number(selectedRecord.quantite);

      if (this.sens === 'C') {
        nvlQte = Number(selectedRecord.quantite) - Number(this.quantite);
      }
      this.confirmationService.confirm({
        message:
          'La référence ' +
          selectedRecord.code +
          ' sera ajusté ancienne qte = ' +
          selectedRecord.quantite +
          ' nouvelle qte = ' +
          nvlQte.toFixed(0) +
          '. Voulez-vous confirmer ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        accept: async () => {
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
            designation: null,
          };
          await this.mouveService
            .createMouve(mouve)
            .toPromise()
            .then(
              (data) => {},
              (error) => {}
            );
          let sortie: Sortie;
          sortie = {
            id: '',
            numero: this.numero,
            lib: this.argument,
          };
          await this.sortieService
            .createSortie(sortie)
            .toPromise()
            .then(
              (data) => {},
              (error) => {}
            );
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
            qtTotal1: selectedRecord.qtTotal1,
          };
          await this.stockService
            .updateStock(stock)
            .toPromise()
            .then(
              (data) => {
                {
                }
              },
              (error) => {}
            );

          if (this.sens === 'C') {
            this.loginService
              .procedureStockeModule(
                localStorage.getItem('login'),
                globals.selectedMenu,
                this.reference + ' AJUSTEE DE -' + this.quantite
              )
              .subscribe((data) => {});
          } else {
            this.loginService
              .procedureStockeModule(
                localStorage.getItem('login'),
                globals.selectedMenu,
                this.reference +
                  ' AJUSTEE DE %2B' +
                  String(Number(this.quantite) * -1)
              )
              .subscribe((data) => {});
          }
          this.annuler();
          this.reloadDataRegu();
          this.rechCodeArt = '';
          this.applyFilterArtParCode();
        },
      });
    }
  }
  annuler() {
    this.reference = '';
    this.designation = '';
    this.quantite = '';
    this.sens = '';
    this.argument = '';
    this.disableGrid = false;
  }

  async reloadDataRegu() {
    await this.regulatService
      .getRegulats()
      .toPromise()
      .then((data) => {
        const regulatsTemp: any = data['_embedded'].regulats;
        this.numero = Math.max.apply(
          Math,
          regulatsTemp.map(function (o) {
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
  async applyFilterArtParCode() {
    await this.stockService
      .getStockList(this.rechCodeArt)
      .toPromise()
      .then((data) => {
        const stocksTemp = data['_embedded'].stocks;
        this.stocks = stocksTemp;
        this.grid.refresh();
      });
  }
  ajouterArt(): void {
    const selectedRecord: any = this.grid.getSelectedRecords()[0];
    this.reference = selectedRecord.code;
    this.designation = selectedRecord.design;
    this.disableGrid = true;

    setTimeout(() => {
      document.getElementById('qte').click();
      document.getElementById('qte').focus();
    }, 10);
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
  public dataBound(args): void {
    if (this.stocks.length > 0) {
      this.grid.selectRows([0]);
    }
  }
  moveToNext(index: number) {
    if (index === 0) {
      if (this.quantite !== '') {
        this.dropdownComponent.focusViewChild.nativeElement.focus();
      }
    } else {
      if (index === 1) {
        if (this.sens !== '') {
          document.getElementById('argument').focus();
        }
      } else {
        if (this.argument !== '') {
          document.getElementById('btValider').focus();
        }
      }
    }
  }
  onTabChange(event) {
    // console.log('Index: ' + event.index);
    this.annuler();
    /*this.rechCodeArt = '';
    this.applyFilterArtParCode();*/
    if (event.index === 1) {
      setTimeout(() => {
        document.getElementById('rechCodeArt').click();
        document.getElementById('rechCodeArt').focus();
      }, 0);
      document.getElementById('rechCodeArt').focus();
    }
  }
}
