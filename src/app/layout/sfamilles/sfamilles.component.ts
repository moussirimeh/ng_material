import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {
  SearchSettingsModel,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import { SfamilleService } from '../services/sfamille.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { ConfirmationService } from 'primeng/api';
import { SteService } from '../services/ste.service';
import { StockService } from '../services/stock.service';
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
  selector: 'app-sfamilles',
  templateUrl: './sfamilles.component.html',
  styleUrls: ['./sfamilles.component.scss'],
  providers: [ConfirmationService],
})
export class SfamillesComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  public searchOptions: SearchSettingsModel;
  sfamilles: any;
  selectedSfamille: any = { id: '', code: '', nom: '' };
  showButtons = false;
  showAjouBt = true;
  showModSupBts = false;
  showValAnnulBts = false;
  disableEditCode = true;
  disableEditNom = true;
  disableGrid = false;
  action = '';
  consultOnly = true;
  tn;
  ste;
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
    private sfamilleService: SfamilleService,
    private loginService: LoginService,
    private stockService: StockService,
    private steService: SteService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit() {
    if (
      globals.selectedMenu === 'Ajout-Modif-Supp sous Familles'
    ) {
      this.consultOnly = false;
      this.showButtons = true;
    }
    await this.loadData();
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
  }
  async loadData() {
    await this.sfamilleService
      .getSfamillesList()
      .toPromise()
      .then((data) => {
        this.sfamilles = data['_embedded'].sfamilles;
      });
  }
  applyFilterSfamille(filterValue: string) {
    this.searchOptions = {
      fields: ['nom'],
      operator: 'startswith',
      key: filterValue,
      ignoreCase: true,
    };
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
    this.selectedSfamille = { id: '', code: '', nom: '' };
    this.showAjouBt = true;
    this.showModSupBts = false;
  }
  rowSelected() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedSfamille = selected;
      this.showAjouBt = false;
      this.showModSupBts = true;
    }
  }
  ajouter() {
    this.disableGrid = true;
    this.showButtons = false;
    this.disableEditCode = false;
    this.disableEditNom = false;
    this.showValAnnulBts = true;
    this.action = 'ajouter';
  }
  modifier() {
    this.disableGrid = true;
    this.showButtons = false;
    this.disableEditCode = true;
    this.disableEditNom = false;
    this.showValAnnulBts = true;
    this.action = 'modifier';
  }
  supprimer() {
    this.disableGrid = true;
    this.showButtons = false;
    this.disableEditCode = true;
    this.disableEditNom = true;
    this.showValAnnulBts = true;
    this.action = 'supprimer';
  }
  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.action === 'ajouter') {
      if (
        String(this.selectedSfamille.code) === '' ||
        String(this.selectedSfamille.code) === 'null'
      ) {
        this.msgs = 'Veuillez saisir un code !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('code').focus();
        this.ov.show(e, document.getElementById('code'));
      } else {
        if (
          String(Number(this.selectedSfamille.code)) === 'NaN' ||
          String(this.selectedSfamille.code).length !== 3
        ) {
          this.msgs = 'Code invalide !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('code').focus();
          this.ov.show(e, document.getElementById('code'));
        } else {
          const found = this.sfamilles.find(
            (element) => element.code === this.selectedSfamille.code
          );
          if (String(found) !== 'undefined') {
            this.msgs = 'Code dèjà utilisé !';
            this.styleOvPanel = this.styleOvPanelError;
            document.getElementById('code').focus();
            this.ov.show(e, document.getElementById('code'));
          } else {
            if (
              String(this.selectedSfamille.nom) === '' ||
              String(this.selectedSfamille.nom) === 'null'
            ) {
              this.msgs = 'Veuillez saisir un nom !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById('nom').focus();
              this.ov.show(e, document.getElementById('nom'));
            } else {
              await this.sfamilleService
                .createSfamille(this.selectedSfamille)
                .toPromise()
                .then((data) => this.loadData());
              await this.loginService
                .procedureStockeModule(
                  localStorage.getItem('login'),
                  globals.selectedMenu,
                  'AJOUT ' + this.selectedSfamille.code
                )
                .subscribe((data) => {
                  console.log(data);
                });
              this.annuler();
            }
          }
        }
      }
    }
    if (this.action === 'modifier') {
      if (
        String(this.selectedSfamille.nom) === '' ||
        String(this.selectedSfamille.nom) === 'null'
      ) {
        this.msgs = 'Veuillez saisir un nom !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('nom').focus();
        this.ov.show(e, document.getElementById('nom'));
      } else {
        await this.sfamilleService
          .updateSfamille(this.selectedSfamille)
          .toPromise()
          .then((data) => {
            this.loadData();
          });
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            'MODIF ' + this.selectedSfamille.code
          )
          .subscribe((data) => {
            console.log(data);
          });
        this.annuler();
      }
    }
    if (this.action === 'supprimer') {
      let stocks = [];
      await this.stockService
        .getStockBySfamille(this.selectedSfamille.code)
        .toPromise()
        .then((data) => {
          stocks = data['_embedded'].stocks;
        });
      if (stocks.length > 0) {
        this.confirmationService.confirm({
          message:
            'Cette sous famille affectés à plusieurs articles voulez vous continuez ?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Oui',
          rejectLabel: 'Non',
          accept: async () => {
            await this.sfamilleService
              .deleteSfamille(this.selectedSfamille.id)
              .toPromise()
              .then((data) => {
                this.loadData();
              });
            for (const stk of stocks) {
              stk.sfamille = '001';
              await this.stockService
                .updateStock(stk)
                .toPromise()
                .then((data) => {});
            }
            this.loginService
              .procedureStockeModule(
                localStorage.getItem('login'),
                globals.selectedMenu,
                'SUPP ' + this.selectedSfamille.code
              )
              .subscribe((data) => {
                console.log(data);
              });
            this.annuler();
          },
        });
      } else {
        await this.sfamilleService
          .deleteSfamille(this.selectedSfamille.id)
          .toPromise()
          .then((data) => {
            this.loadData();
          });
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            'SUPP ' + this.selectedSfamille.code
          )
          .subscribe((data) => {
            console.log(data);
          });
        this.annuler();
      }
    }
  }

  annuler() {
    this.disableGrid = false;
    this.showButtons = true;
    this.disableEditCode = true;
    this.disableEditNom = true;
    this.showValAnnulBts = false;
    this.annulerSelection();
  }
  async imprimer() {
    this.wasInside = true;
    this.ov.hide();
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste[0];
      });
    // const displayDate = new Date().toLocaleDateString('en-GB');
    // const displayTime = new Date().toLocaleTimeString();
    const doc1 = new jspdf();
    // page a4 (210 x 297 mm)
    let numPage = 1;
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text('SOCIETE  :   ' + this.ste.societe, 10, 10);
    /*doc1.text("ADRESSE :   " + this.ste.adresse, 14, 15);
    doc1.text("VILLE       :   " + this.ste.ville, 14, 20);
    doc1.text("TEL           :   " + this.ste.tel, 14, 25);
    doc1.text("FAX          :   " + this.ste.fax, 14, 30);
    doc1.text("E-mail       :   " + this.ste.email, 14, 35);

    doc1.text(
      "Tunis le : " +
        this.tn.dayNames[new Date().getDay() - 1] +
        " " +
        displayDate +
        " à " +
        displayTime,
      147,
      35
    );*/

    doc1.setFontSize(18);
    doc1.setFontStyle('arial');
    doc1.text('Liste des Sous Familles', 80, 23);

    doc1.setFontSize(10);

    doc1.setFontStyle('bold');
    doc1.line(10, 35, 200, 35);
    // ligne Horizontal doc1.line(x1,y1,x2,y2)

    doc1.text('Code', 10, 39);
    doc1.text('Libellé', 40, 39);
    doc1.line(10, 42, 200, 42);
    doc1.setFontStyle('normal');
    let y = 47;
    const total = 0;
    for (const sfam of this.sfamilles) {
      doc1.text(sfam.code, 10, y);
      doc1.text(sfam.nom, 40, y);
      y = y + 7;
      if (y > 277) {
        doc1.line(10, y - 3, 200, y - 3, 'FD');
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        numPage++;
        doc1.addPage();
        doc1.setFontStyle('bold');
        doc1.line(10, 20, 200, 20);
        // ligne Horizontal doc1.line(x1,y1,x2,y2)

        doc1.text('Code', 10, 24);
        doc1.text('Libellé', 40, 24);

        doc1.line(10, 27, 200, 27);
        doc1.setFontStyle('normal');
        y = 32;
      }
    }
    doc1.line(10, y - 3, 200, y - 3, 'FD');
    doc1.text('Page ' + numPage.toFixed(0), 100, 289);
    window.open(doc1.output('bloburl'), '_blank');
  }
}
