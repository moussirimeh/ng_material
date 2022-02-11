import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { SteService } from '../services/ste.service';
import { CaissePService } from '../services/caisseP.service';
import { FeuilleCaissePrincipaleService } from '../services/feuilleCaissePrincipale.service';
import { FeuilleCaissePrincipale } from '../services/feuilleCaissePrincipale';
import { Ste } from '../services/ste';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { SoldcsService } from '../services/soldcs.service';
import { Soldcs } from '../services/soldcs';
import { CaisseService } from '../services/caisse.service';
import { Caisse } from '../services/caisse';
import { CaisseP } from '../services/caisseP';
import { BrouService } from '../services/brou.service';
import { BrouContService } from '../services/brouCont.service';
import { LoginService } from '../../login/login.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { OverlayPanel } from 'primeng/primeng';
import { L10n, setCulture } from '@syncfusion/ej2-base';
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
  selector: 'app-feuille-caisse-principale',
  templateUrl: './feuille-caisse-principale.component.html',
  styleUrls: ['./feuille-caisse-principale.component.scss'],
  providers: [ConfirmationService, DatePipe],
})
export class FeuilleCaissePrincipaleComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  dateCaisse: any;
  dateFeuille: Date;
  minDate: Date;
  maxDate: Date;
  dateF: string;
  soldcs: Soldcs[] = [];
  FeuilleSoldeEspece = [];
  FeuilleReceptionCheque = [];
  caisse: Caisse[] = [];
  caisseP: CaisseP[] = [];
  feuilleD: FeuilleCaissePrincipale[] = [];
  feuille: FeuilleCaissePrincipale[] = [];
  feuilles = [];
  selectedFeuille: any;
  ste: Ste;
  tn;
  validerShow = false;
  date: Date;
  recettesEspeceP = null;
  depenseEspeceP = null;
  depenseChequeP = null;
  recettesChequeP = null;
  recettesEspece = null;
  depenseEspece = null;
  depenseCheque = null;
  recettesCheque = null;
  totalRecette = null;
  totalDepense = null;
  totalRecetteEspece = null;
  totalRecetteCheque = null;
  totalDepenseEspece = null;
  totalDepenseCheque = null;
  regTermeCH = null;
  regTermeEsp = null;

  soldecc;
  soldece;
  reportSolde = null;
  list: Ste[];
  totalRegTermeEsp = null;
  totalRegTermeCh = null;
  mtchC;
  mtchD;
  mteC;
  mteD;
  mtce = null;
  mtcc = null;
  totalSolde = null;
  soldeEspece;
  soldeCheque;
  feuill: any[];

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
    private datePipe: DatePipe,
    private steService: SteService,
    private soldcsService: SoldcsService,
    private feuilleCaissePrincipaleService: FeuilleCaissePrincipaleService,
    private caissePrincipaleService: CaissePService,
    private caisseSecondaireService: CaisseService,
    private brouService: BrouService,
    private brouContService: BrouContService,
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
        this.soldecc = this.ste[0].soldecc;
        this.soldece = this.ste[0].soldece;
        this.reportSolde = (
          Number(this.soldecc) + Number(this.soldece)
        ).toFixed(3);
      });
  }

  async getDate() {
    await this.steService
      .getDateCaissePlus()
      .toPromise()
      .then((value) => {
        this.dateCaisse = value;
      });
    this.date = new Date(this.dateCaisse);
    this.minDate = this.date;
  }

  async FeuilleCaisse(e) {
    this.soldeEspece = null;
    this.soldeCheque = null;
    this.recettesCheque = null;
    this.recettesEspece = null;
    this.recettesChequeP = null;
    this.recettesEspeceP = null;
    this.totalRecette = null;
    this.depenseCheque = null;
    this.depenseChequeP = null;
    this.depenseEspece = null;
    this.depenseEspeceP = null;
    this.totalDepense = null;
    this.totalDepenseCheque = null;
    this.totalDepenseEspece = null;
    this.totalRecetteCheque = null;
    this.totalRecetteEspece = null;
    this.regTermeCH = null;
    this.regTermeEsp = null;
    this.totalRegTermeCh = null;
    this.totalRegTermeEsp = null;
    this.mtcc = null;
    this.mtce = null;
    this.mtchC = null;
    this.mtchD = null;
    this.mteC = null;
    this.mteD = null;
    this.totalSolde = null;
    this.dateF = this.datePipe.transform(this.dateFeuille, 'dd/MM/yyyy');
    if (this.dateFeuille < this.date) {
      this.validerShow = false;
      this.FeuilleSoldeEspece = [];
      this.FeuilleReceptionCheque = [];
      this.soldeEspece = (
        Number(this.soldece) +
        Number(this.totalRecetteEspece) +
        Number(this.totalRegTermeEsp) +
        Number(this.mtce) -
        Number(this.totalDepenseEspece)
      ).toFixed(3);
      this.soldeCheque = (
        Number(this.soldecc) +
        Number(this.totalRecetteCheque) +
        Number(this.totalRegTermeCh) +
        Number(this.mtcc) -
        Number(this.totalDepenseCheque)
      ).toFixed(3);
      this.totalSolde = (
        Number(this.soldeEspece) + Number(this.soldeCheque)
      ).toFixed(3);
      this.msgs = 'Caisse  déjà validée !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btAfficher'));
    } else {
      await this.caisseSecondaireService
        .receptionCheque(this.dateF, 'CHEQUE')
        .toPromise()
        .then((data) => {
          this.caisse = data['_embedded'].caisses;

          for (const s of this.caisse) {
            this.FeuilleReceptionCheque.push({
              libelle: 'Reception cheque',
              date: s.date,
              montant: s.montant,
              mode: s.mode,
              facture: s.facture,
              cheque: s.cheque,
              banque: s.banque,
              echeance: s.ech,
              observation: s.observat,
            });
          }
        });

      await this.feuilleCaissePrincipaleService
        .feuilleDepense(this.dateF)
        .toPromise()
        .then((data) => {
          this.feuilleD = data['_embedded'].feuilleCaissePrincipale;
        });
      await this.feuilleCaissePrincipaleService
        .feuilleRecette(this.dateF)
        .toPromise()
        .then((data) => {
          this.feuille = data['_embedded'].feuilleCaissePrincipale;
        });
      await this.soldcsService
        .findByDate(this.dateF)
        .toPromise()
        .then((data) => {
          this.soldcs = data['_embedded'].soldcs;
          this.FeuilleSoldeEspece = [];
          for (const s of this.soldcs) {
            this.FeuilleSoldeEspece.push({
              libelle: 'solde espece',
              date: s.date,
              montant: s.sole,
              mode: '',
              facture: '',
              cheque: '',
              banque: '',
              echeance: '',
              observation: '',
            });
          }

          for (const s of this.FeuilleReceptionCheque) {
            this.FeuilleSoldeEspece.push(s);
          }
          for (const f of this.feuilleD) {
            this.FeuilleSoldeEspece.push(f);
          }
          for (const s of this.feuille) {
            this.FeuilleSoldeEspece.push(s);
          }
          console.log(this.FeuilleSoldeEspece);
        });

      await this.caissePrincipaleService
        .recetteEspece(this.dateF)
        .toPromise()
        .then((value) => {
          this.recettesEspeceP = Number(value).toFixed(3);
        });
      await this.caissePrincipaleService
        .recetteCheque(this.dateF)
        .toPromise()
        .then((value) => {
          this.recettesChequeP = Number(value).toFixed(3);
        });
      await this.caissePrincipaleService
        .depenseEspece(this.dateF)
        .toPromise()
        .then((value) => {
          this.depenseEspeceP = Number(value).toFixed(3);
        });
      await this.caissePrincipaleService
        .depenseCheque(this.dateF)
        .toPromise()
        .then((value) => {
          this.depenseChequeP = Number(value).toFixed(3);
        });
      await this.caisseSecondaireService
        .recetteEspece(this.dateF)
        .toPromise()
        .then((value) => {
          this.recettesEspece = Number(value).toFixed(3);
        });
      await this.caisseSecondaireService
        .recetteCheque(this.dateF)
        .toPromise()
        .then((value) => {
          this.recettesCheque = Number(value).toFixed(3);
        });
      await this.caisseSecondaireService
        .depenseEspece(this.dateF)
        .toPromise()
        .then((value) => {
          this.depenseEspece = Number(value).toFixed(3);
        });
      await this.caisseSecondaireService
        .depenseCheque(this.dateF)
        .toPromise()
        .then((value) => {
          this.depenseCheque = Number(value).toFixed(3);
        });
      await this.brouService
        .mtchC(this.dateF)
        .toPromise()
        .then((value) => {
          this.mtchC = Number(value).toFixed(3);
        });
      await this.brouService
        .mtchD(this.dateF)
        .toPromise()
        .then((value) => {
          this.mtchD = Number(value).toFixed(3);
        });
      await this.brouService
        .mteC(this.dateF)
        .toPromise()
        .then((value) => {
          this.mteC = Number(value).toFixed(3);
        });
      await this.brouService
        .mteD(this.dateF)
        .toPromise()
        .then((value) => {
          this.mteD = Number(value).toFixed(3);
        });
      await this.brouContService
        .mtce(this.dateF)
        .toPromise()
        .then((value) => {
          this.mtce = Number(value).toFixed(3);
        });
      await this.brouContService
        .mtcc(this.dateF)
        .toPromise()
        .then((value) => {
          this.mtcc = Number(value).toFixed(3);
        });

      this.totalRecetteEspece = (
        Number(this.recettesEspeceP) + Number(this.recettesEspece)
      ).toFixed(3);

      this.totalRecetteCheque = (
        Number(this.recettesChequeP) + Number(this.recettesCheque)
      ).toFixed(3);
      this.totalDepenseEspece = (
        Number(this.depenseEspece) + Number(this.depenseEspeceP)
      ).toFixed(3);

      this.totalDepenseCheque = (
        Number(this.depenseChequeP) + Number(this.depenseCheque)
      ).toFixed(3);

      this.totalRecette = (
        Number(this.recettesEspeceP) +
        Number(this.recettesChequeP) +
        Number(this.recettesEspece) +
        Number(this.recettesCheque)
      ).toFixed(3);

      this.totalDepense = (
        Number(this.depenseEspeceP) +
        Number(this.depenseChequeP) +
        Number(this.depenseEspece) +
        Number(this.depenseCheque)
      ).toFixed(3);

      this.reportSolde = (Number(this.soldecc) + Number(this.soldece)).toFixed(
        3
      );

      this.totalRegTermeEsp = (Number(this.mteC) - Number(this.mteD)).toFixed(
        3
      );
      this.totalRegTermeCh = (Number(this.mtchC) - Number(this.mtchD)).toFixed(
        3
      );
      this.soldeEspece = (
        Number(this.soldece) +
        Number(this.totalRecetteEspece) +
        Number(this.totalRegTermeEsp) +
        Number(this.mtce) -
        Number(this.totalDepenseEspece)
      ).toFixed(3);
      this.soldeCheque = (
        Number(this.soldecc) +
        Number(this.totalRecetteCheque) +
        Number(this.totalRegTermeCh) +
        Number(this.mtcc) -
        Number(this.totalDepenseCheque)
      ).toFixed(3);
      this.totalSolde = (
        Number(this.soldeEspece) + Number(this.soldeCheque)
      ).toFixed(3);

      if (this.FeuilleSoldeEspece.length === 0) {
        this.msgs = 'Caisse  vide !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btAfficher'));
        this.validerShow = true;
      } else {
        this.validerShow = true;
      }
    }
  }
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    this.FeuilleSoldeEspece = [];
    this.FeuilleReceptionCheque = [];
    await this.FeuilleCaisse(e);
  }

  async valider() {
    this.confirmationService.confirm({
      message:
        'Vous devez Imprimer avant de Valider,Etes Vous sûr de vouloir valider la caisse  ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        await this.steService
          .validerCaisse(this.dateF, this.soldeCheque, this.soldeEspece)
          .toPromise()
          .then(
            (data) => {},
            (error) => console.log('errorrrre', error)
          );
        this.validerShow = false;
      await this.getDate();
       await this.steService.getSte().toPromise().then((data) => {
          this.ste = data['_embedded'].ste;
          this.soldecc = +this.ste[0].soldecc;
          this.soldece = +this.ste[0].soldece;
        });
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            'DATE ' + this.dateF
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
    const cols = [
      {
        libelle: 'Libelle',
        recette: 'Recettes',
        depense: 'Depenses',
        facture: 'Facture',
        cheque: 'N°Cheque',
        banque: 'Banque',
        echeance: 'Echéance',
        observation: 'Observation',
      },
    ];
    const releves = [];
    for (const s of this.soldcs) {
      releves.push({
        libelle: 'solde espece',
        recette: s.sole,
        depense: '0.000',
        facture: '',
        cheque: '',
        banque: '',
        echeance: '',
        observation: '',
      });
    }
    for (const s of this.FeuilleReceptionCheque) {
      releves.push({
        libelle: 'Reception cheque',
        recette: s.montant,
        depense: '0.000',
        facture: s.facture,
        cheque: s.cheque,
        banque: s.banque,
        echeance: s.echeance,
        observation: s.observation,
      });
    }

    for (const s of this.feuilleD) {
      releves.push({
        libelle: s.libelle,
        recette: '0.000',
        depense: s.montant,
        facture: s.facture,
        cheque: s.cheque,
        banque: s.banque,
        echeance: s.echeance,
        observation: s.observation,
      });
    }
    for (const s of this.feuille) {
      releves.push({
        libelle: s.libelle,
        recette: s.montant,
        depense: '0.000',
        facture: s.facture,
        cheque: s.cheque,
        banque: s.banque,
        echeance: s.echeance,
        observation: s.observation,
      });
    }

    const doc1 = new jspdf();
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text(this.ste[0].societe, 14, 10);
    /*doc1.text(this.ste[0].adresse, 14, 15);
    doc1.text(this.ste[0].codep + '     ' + this.ste[0].ville, 14, 20);
    doc1.text(
      'Tel: ' + this.ste[0].tel + '   ' + 'Fax: ' + this.ste[0].fax,
      14,
      25
    );
    doc1.text('E-mail: ' + this.ste[0].email, 14, 30);*/
    doc1.setFontSize(12);
    doc1.setFontStyle('arial');
    const displayDate = new Date().toLocaleString('default', {
      timeZone: 'Africa/Tunis',
    });

    doc1.text('Tunis le : ' + displayDate, 140, 20);
    doc1.setFontSize(18);
    doc1.setFontStyle('arial');
    doc1.text('Feuille de Caisse Principale', 60, 30);
    doc1.setFontSize(12);
    // doc1.setFontSize(12);
    /*if (this.validerShow) {
      doc1.text('Caisse Non Validé', 140, 30);
    } else {
      doc1.text('Caisse Validé', 140, 30);
    }*/
    doc1.text('Du :' + this.dateF, 14, 40);

    doc1.autoTable({
      head: cols,
      body: releves,
      startY: 50,
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

    doc1.setFontSize(11);
    doc1.setFontStyle('bold');
    let y = doc1.autoTable.previous.finalY;
    if (y > 280) {
      doc1.addPage();
      y = 2;
    }
    doc1.text('Report Solde :', 14, y + 18);
    doc1.text(
      String(Number(this.reportSolde).toFixed(3)),
      65,
      y + 18,
      'right'
    );
    doc1.text('Solde Espece : ', 73, y + 18);
    doc1.text(
      String(Number(this.soldece).toFixed(3)),
      120,
      y + 18,
      'right'
    );
    doc1.text('Solde Chèque : ', 140, y + 18);
    doc1.text(
      String(Number(this.soldecc).toFixed(3)),
      195,
      y + 18,
      'right'
    );
    if (y > 280) {
      doc1.addPage();
      y = -4;
    }
    doc1.text('Total Recettes:', 14, y + 24);
    doc1.text(
      String(Number(this.totalRecette).toFixed(3)),
      65,
      y + 24,
      'right'
    );
    doc1.text('Recettes Espece:', 73, y + 24);
    doc1.text(
      String(Number(this.totalRecetteEspece).toFixed(3)),
      120,
      y + 24,
      'right'
    );
    doc1.text('Recettes Chèque:', 140, y + 24);
    doc1.text(
      String(Number(this.totalRecetteCheque).toFixed(3)),
      195,
      y + 24,
      'right'
    );
    if (y > 280) {
      doc1.addPage();
      y = -10;
    }
    doc1.text('Total Depenses:', 14, y + 30);
    doc1.text(
      String(
        Number(this.totalDepense)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ')
      ),
      65,
      y + 30,
      'right'
    );
    doc1.text('Depenses Espece:', 73, y + 30);
    doc1.text(
      String(
        Number(this.totalDepenseEspece)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ')
      ),
      120,
      y + 30,
      'right'
    );
    doc1.text('Depenses Chèque:', 140, y + 30);
    doc1.text(
      String(
        Number(this.totalDepenseCheque)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ')
      ),
      195,
      y + 30,
      'right'
    );
    if (y > 280) {
      doc1.addPage();
      y = -16;
    }
    doc1.text('Reglts term esp :', 73, y + 36);
    doc1.text(
      String(Number(this.totalRegTermeEsp).toFixed(3)),
      120,
      y + 36,
      'right'
    );
    doc1.text('Reglts term Chq :', 140, y + 36);
    doc1.text(
      String(Number(this.totalRegTermeCh).toFixed(3)),
      195,
      y + 36,
      'right'
    );
    if (y > 280) {
      doc1.addPage();
      y = -22;
    }
    doc1.text('Reglts Cont esp :', 73, y + 42);
    doc1.text(
      String(Number(this.mtce).toFixed(3)),
      120,
      y + 42,
      'right'
    );
    doc1.text('Reglts Cont Chq :', 140, y + 42);
    doc1.text(
      String(Number(this.mtcc).toFixed(3)),
      195,
      y + 42,
      'right'
    );
    if (y > 280) {
      doc1.addPage();
      y = -28;
    }
    doc1.text('Total Solde :', 14, y + 48);
    doc1.text(
      String(Number(this.totalSolde).toFixed(3)),
      65,
      y + 48,
      'right'
    );
    doc1.text('Solde Espece : ', 73, y + 48);
    doc1.text(
      String(Number(this.soldeEspece).toFixed(3)),
      120,
      y + 48,
      'right'
    );

    doc1.text('Solde Cheque : ', 140, y + 48);
    doc1.text(
      String(Number(this.soldeCheque).toFixed(3)),
      195,
      y + 48,
      'right'
    );

    window.open(doc1.output('bloburl'), '_blank');
  }
}
