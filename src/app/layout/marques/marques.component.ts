import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {
  SearchSettingsModel,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import { MarqueService } from '../services/marque.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { StkMRQService } from '../services/stkMRQ.service';
import { LoginService } from 'src/app/login/login.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { SteService } from '../services/ste.service';
import { ConfirmationService } from 'primeng/api';
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
  selector: 'app-marques',
  templateUrl: './marques.component.html',
  styleUrls: ['./marques.component.scss'],
  providers: [ConfirmationService],
})
export class MarquesComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  public searchOptions: SearchSettingsModel;
  marques: any;
  selectedMarque: any = { id: '', code: '', nom: '' };
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
    private marqueService: MarqueService,
    private stkService: StkMRQService,
    private loginService: LoginService,
    private confirmationService: ConfirmationService,
    private steService: SteService
  ) {}

  async ngOnInit() {
    if (
      globals.selectedMenu === 'Ajout-Modif-Supp des marques'
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
      today: 'Aujourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy',
    };
  }
  async loadData() {
    await this.marqueService
      .getMarquesList()
      .toPromise()
      .then((data) => {
        this.marques = data['_embedded'].marques;
      });
  }
  applyFilterMarque(filterValue: string) {
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
    this.selectedMarque = { id: '', code: '', nom: '' };
    this.showAjouBt = true;
    this.showModSupBts = false;
  }
  rowSelected() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedMarque = selected;
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
        String(this.selectedMarque.code) === '' ||
        String(this.selectedMarque.code) === 'null'
      ) {
        this.msgs = 'Veuillez saisir un code !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('code').focus();
        this.ov.show(e, document.getElementById('code'));
      } else {
        if (
          String(Number(this.selectedMarque.code)) === 'NaN' ||
          String(this.selectedMarque.code).length !== 3
        ) {
          this.msgs = 'Code invalide !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('code').focus();
          this.ov.show(e, document.getElementById('code'));
        } else {
          const found = this.marques.find(
            (element) => element.code === this.selectedMarque.code
          );
          if (String(found) !== 'undefined') {
            this.msgs = 'Ce code est déjà utilisé !';
            this.styleOvPanel = this.styleOvPanelError;
            document.getElementById('code').focus();
            this.ov.show(e, document.getElementById('code'));
          } else {
            if (
              String(this.selectedMarque.nom) === '' ||
              String(this.selectedMarque.nom) === 'null'
            ) {
              this.msgs = 'Veuillez saisir un nom !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById('nom').focus();
              this.ov.show(e, document.getElementById('nom'));
            } else {
              await this.marqueService
                .createMarque(this.selectedMarque)
                .toPromise()
                .then((data) => {
                  this.loadData();
                });
              await this.loginService
                .procedureStockeModule(
                  localStorage.getItem('login'),
                  globals.selectedMenu,
                  'AJOUT MARQUE ' + this.selectedMarque.code
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
        String(this.selectedMarque.nom) === '' ||
        String(this.selectedMarque.nom) === 'null'
      ) {
        this.msgs = 'Veuillez saisir un nom !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('nom').focus();
        this.ov.show(e, document.getElementById('nom'));
      } else {
        await this.marqueService
          .updateMarque(this.selectedMarque)
          .toPromise()
          .then((data) => {
            this.loadData();
          });
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            'MODIF MARQUE ' + this.selectedMarque.code
          )
          .subscribe((data) => {
            console.log(data);
          });
        this.annuler();
      }
    }
    if (this.action === 'supprimer') {
      let stkMrqs = [];
      await this.stkService
        .getStkMrqByMarque(this.selectedMarque.code)
        .toPromise()
        .then((data) => {
          stkMrqs = data['_embedded'].StkMRQ;
        });
      if (stkMrqs.length > 0) {
        this.confirmationService.confirm({
          message:
            'Cette marque affectés à plusieurs articles voulez vous continuez ?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Oui',
          rejectLabel: 'Non',
          accept: async () => {
            await this.stkService
              .deleteStkMrq(this.selectedMarque.code)
              .toPromise()
              .then((data) => {});
            await this.marqueService
              .deleteMarque(this.selectedMarque.id)
              .toPromise()
              .then((data) => {
                this.loadData();
              });
            await this.loginService
              .procedureStockeModule(
                localStorage.getItem('login'),
                globals.selectedMenu,
                'SUPP MARQUE ' + this.selectedMarque.code
              )
              .subscribe((data) => {
                console.log(data);
              });
            this.annuler();
          },
        });
      } else {
        await this.stkService
          .deleteStkMrq(this.selectedMarque.code)
          .toPromise()
          .then((data) => {});
        await this.marqueService
          .deleteMarque(this.selectedMarque.id)
          .toPromise()
          .then((data) => {
            this.loadData();
          });
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            'SUPP MARQUE ' + this.selectedMarque.code
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
    doc1.text('Liste des Marques', 80, 23);

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
    for (const mrq of this.marques) {
      doc1.text(mrq.code, 10, y);
      doc1.text(mrq.nom, 40, y);
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
