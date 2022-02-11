import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { SteService } from '../services/ste.service';
import { SoldcsService } from '../services/soldcs.service';
import { FeuilleCaisseSecondaireService } from '../services/feuille-caisse-secondaire.service';
import { FeuilleCaisseSecondaire } from '../services/feuille-caisse-secondaire';
import { CaisseService } from '../services/caisse.service';
import { LoginService } from '../../login/login.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Ste } from '../services/ste';
import { Soldcs } from '../services/soldcs';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-feuille-caisse-secondaire',
  templateUrl: './feuille-caisse-secondaire.component.html',
  styleUrls: ['./feuille-caisse-secondaire.component.scss'],
  providers: [ConfirmationService, DatePipe],
})
export class FeuilleCaisseSecondaireComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  dateCaisse;
  dateCaisseSecondaire;
  dateFeuille: any;
  dateF: any;
  date: any;
  maxDate: Date;
  minDate: Date;
  totalRecettes = null;
  totalDepenses = null;
  solde = '0.000';
  espece = '0.000';
  cheque = null;
  regComptR;
  regComptD;
  reglementComptant = null;
  reglementTerme;
  afficherClicked = false;
  validershow = false;
  afficherShow = true;
  ste: Ste;
  feuilleD: FeuilleCaisseSecondaire[] = [];
  feuille: FeuilleCaisseSecondaire[] = [];
  feuilles: FeuilleCaisseSecondaire[] = [];
  selectedFeuille: any;
  soldcs: Soldcs = {
    date: '',
    nom: '',
    ent: '',
    sort: '',
    solc: '',
    sole: '',
    sold: '',
  };
  sold: any;
  solE: any;
  tn;
  constructor(
    private datePipe: DatePipe,
    private steService: SteService,
    private soldcsService: SoldcsService,
    private feuillecaisseSecondaireService: FeuilleCaisseSecondaireService,
    private caisseSecondaireService: CaisseService,
    private loginService: LoginService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit() {
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
    this.dateFeuille = new Date();
    this.maxDate = new Date();
    await this.getDate();
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste;
      });
  }

  async getDate() {
    await this.soldcsService
      .getDateCaisseSecondaire()
      .toPromise()
      .then((value) => {
        this.dateCaisseSecondaire = value;
      });
    await this.steService
      .getDateCaissePlus()
      .toPromise()
      .then((value) => {
        this.dateCaisse = value;
      });
    const d1 = new Date(this.dateCaisseSecondaire);
    const d2 = new Date(this.dateCaisse);
    if (d1 > d2) {
      this.date = new Date(d1);
      this.minDate = this.date;
    } else {
      this.date = new Date(d2);
      this.minDate = this.date;
    }
  }

  async FeuilleCaisse() {
    this.dateF = this.datePipe.transform(this.dateFeuille, 'dd/MM/yyyy');
    await this.feuillecaisseSecondaireService
      .feuilleDepense(this.dateF)
      .toPromise()
      .then((data) => {
        this.feuilleD = data['_embedded'].feuilleCaisseSecondaire;
      });
    await this.feuillecaisseSecondaireService
      .feuilleRecette(this.dateF)
      .toPromise()
      .then((data) => {
        this.feuille = data['_embedded'].feuilleCaisseSecondaire;
        for (const f of this.feuilleD) {
          this.feuille.push(f);
        }
      });
  }
  async reloadFeuilleSecondaire() {
    await this.feuillecaisseSecondaireService
      .feuilleDepense(this.dateF)
      .toPromise()
      .then((data) => {
        this.feuilleD = data['_embedded'].feuilleCaisseSecondaire;
      });
    await this.feuillecaisseSecondaireService
      .feuilleRecette(this.dateF)
      .toPromise()
      .then((data) => {
        this.feuille = data['_embedded'].feuilleCaisseSecondaire;
        for (const f of this.feuilleD) {
          this.feuille.push(f);
        }
      });
  }

  async afficher() {
    await this.FeuilleCaisse();
    this.afficherClicked = true;
    this.afficherShow = true;
    await this.caisseSecondaireService
      .getTotalRecettes(this.dateF)
      .toPromise()
      .then((value) => {
        this.totalRecettes = Number(value).toFixed(3);
      });
    await this.caisseSecondaireService
      .getTotalDepenses(this.dateF)
      .toPromise()
      .then((value) => {
        this.totalDepenses = Number(value).toFixed(3);
      });
    await this.caisseSecondaireService
      .reglementTerme(this.dateF)
      .toPromise()
      .then((value) => {
        this.reglementTerme = Number(value).toFixed(3);
      });
    await this.caisseSecondaireService
      .recetteCheque(this.dateF)
      .toPromise()
      .then((value) => {
        this.cheque = Number(value).toFixed(3);
      });
    await this.caisseSecondaireService
      .RegComptR(this.dateF)
      .toPromise()
      .then((value) => {
        this.regComptR = Number(value).toFixed(3);
      });
    await this.caisseSecondaireService
      .RegComptD(this.dateF)
      .toPromise()
      .then((value) => {
        this.regComptD = Number(value).toFixed(3);
      });
    this.solde = Number(this.totalRecettes - this.totalDepenses)
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.sold = +(this.totalRecettes - this.totalDepenses).toFixed(3);
    this.espece = Number(this.sold - this.cheque)
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    this.reglementComptant = +(this.regComptR - this.regComptD).toFixed(3);
    this.validation();
    this.solE = +(this.sold - this.cheque).toFixed(3);
  }

  validation() {
    const date1 = this.date;
    const date2 = this.dateFeuille;
    if (date1 > date2) {
      this.validershow = false;
    } else if (date1 <= date2) {
      this.validershow = true;
    }
  }

  async valider() {
    this.soldcs.date = this.dateF;
    this.soldcs.ent = this.totalRecettes;
    this.soldcs.sort = this.totalDepenses;
    this.soldcs.solc = this.cheque;
    this.soldcs.sole = this.solE;
    this.soldcs.sold = this.sold;
    this.confirmationService.confirm({
      message: 'Etes Vous sûr de vouloir valider la caisse  ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        await this.soldcsService
          .validerCaisse(this.soldcs)
          .toPromise()
          .then(
            (data) => {},
            (error) => console.log('errorrrre', error)
          );
        this.validershow = false;
        await this.soldcsService
          .getDateCaisseSecondaire()
          .toPromise()
          .then((value) => {
            this.dateCaisseSecondaire = value;
          });
        await this.steService
          .getDateCaissePlus()
          .toPromise()
          .then((value) => {
            this.dateCaisse = value;
          });
        const d1 = new Date(this.dateCaisseSecondaire);
        const d2 = new Date(this.dateCaisse);
        if (d1 > d2) {
          this.date = new Date(d1);
          this.minDate = this.date;
        } else {
          this.date = new Date(d2);
          this.minDate = this.date;
        }
        this.validation();
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            'DATE ' + this.soldcs.date + ' SOLDE ' + this.soldcs.sold
          )
          .toPromise()
          .then((data) => {
            console.log(data);
          });
      },
      reject: () => {},
    });
  }

  async apercue() {
    const x = 14;
    let y = 10;
    await this.feuillecaisseSecondaireService
      .feuilleDepense(this.dateF)
      .toPromise()
      .then((data) => {
        this.feuilleD = data['_embedded'].feuilleCaisseSecondaire;
      });
    await this.feuillecaisseSecondaireService
      .feuilleRecette(this.dateF)
      .toPromise()
      .then((data) => {
        this.feuilles = data['_embedded'].feuilleCaisseSecondaire;
      });

    const cols = [
      {
        libelle: 'N°Facture',
        recette: 'Recettes',
        depense: 'Depenses',
        facture: 'Facture',
        cheque: 'N°Cheque',
        banque: 'Bq',
        echeance: 'Ech',
        observation: 'Observation',
      },
    ];
    const releves = [];
    for (const feuille of this.feuilles) {
      releves.push({
        libelle: feuille.libelle,
        recette: feuille.montant,
        depense: '',
        facture: feuille.facture,
        cheque: feuille.cheque,
        banque: feuille.banque,
        echeance: feuille.echeance,
        observation: feuille.observation,
      });
    }
    for (const feuilles of this.feuilleD) {
      releves.push({
        libelle: feuilles.libelle,
        recette: '',
        depense: '-' + feuilles.montant,
        facture: feuilles.facture,
        cheque: feuilles.cheque,
        banque: feuilles.banque,
        echeance: feuilles.echeance,
        observation: feuilles.observation,
      });
    }

    const doc1 = new jspdf();
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text(this.ste[0].societe, x, 10);
    doc1.text(this.ste[0].adresse, x, 15);
    doc1.text(this.ste[0].codep + '     ' + this.ste[0].ville, x, 20);
    doc1.text(
      'Tel: ' + this.ste[0].tel + '   ' + 'Fax: ' + this.ste[0].fax,
      x,
      25
    );
    doc1.text('E-mail: ' + this.ste[0].email, x, 30);
    doc1.setFontSize(12);
    doc1.setFontStyle('arial');
    const displayDate = new Date().toLocaleString('default', {
      timeZone: 'Africa/Tunis',
    });

    doc1.text('Tunis le : ' + displayDate, 140, 35);
    doc1.setFontSize(18);
    doc1.setFontStyle('arial');
    doc1.text('Feuille de Caisse Secondaire', 60, 45);
    doc1.setFontSize(12);
    if (this.validershow) {
      doc1.text('Caisse Non Validé', 140, 45);
    } else {
      doc1.text('Caisse Validé', 140, 45);
    }
    doc1.text('Du :' + this.dateF, x, 55);

    doc1.autoTable({
      head: cols,
      body: releves,
      startY: 65,
      theme: 'grid',
      bodyStyles: {lineColor: [0, 0, 0]},
      styles: { fontSize: 9, textColor: 20 },
      columnStyles: {
        libelle: { cellWidth: 36 },
        recette: { cellWidth: 20, halign: 'right' },
        depense: { cellWidth: 20, halign: 'right' },
        facture: { cellWidth: 18 },
        cheque: { cellWidth: 22 },
        echeance: { cellWidth: 20 },
        banque: { cellWidth: 17 },
        observation: { cellWidth: 30 },
      },
    });
    y = doc1.autoTable.previous.finalY;
    if (y + 8 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 8;
    }
    doc1.setFontSize(11);
    doc1.setFontStyle('bold');
    doc1.text('Totaux :', x, y);
    doc1.setFontSize(10);
    doc1.text(Number(this.totalRecettes).toFixed(3), 75, y, 'right');
    doc1.text(Number(this.totalDepenses).toFixed(3), 92, y, 'right');
    if (y + 8 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 8;
    }
    doc1.text('REG.COMPTANT :', 14, y);
    doc1.text(
      String(Number(this.reglementComptant).toFixed(3)),
      75,
      y,
      'right'
    );
    doc1.text('REG.TERMES : ', 83, y);
    doc1.text(String(Number(this.reglementTerme).toFixed(3)), 130, y, 'right');
    if (y + 8 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 8;
    }
    doc1.text('TOTAL CHEQUE :', 14, y);
    doc1.text(String(Number(this.cheque).toFixed(3)), 75, y, 'right');
    if (y + 8 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 8;
    }
    doc1.text('TOTAL ESPECE :', 14, y);
    doc1.text(this.espece, 75, y, 'right');
    if (y + 8 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 8;
    }
    doc1.text('SOLDE :', 14, y);
    doc1.text(String(Number(this.sold).toFixed(3)), 75, y, 'right');
    window.open(doc1.output('bloburl'), '_blank');
  }
}
