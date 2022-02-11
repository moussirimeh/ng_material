import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  GridComponent,
  ToolbarItems,
  SearchSettingsModel,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { MessageService } from 'primeng/api';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { OverlayPanel } from 'primeng/primeng';
import { L10n, setCulture } from '@syncfusion/ej2-base';
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
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss'],
  providers: [ToolbarService, MessageService],
})
export class FournisseurComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  public searchOptions: SearchSettingsModel;
  selectedIndex = null;
  ajouterDisable = false;
  modifierSupprimerDisable = true;
  validerAnnulerDisable = true;
  ajouterClicked = false;
  modifierClicked = false;
  supprimerClicked = false;
  fournisseur: Fournisseur;
  fournisseurs: Fournisseur[];
  selectedFournisseur: Fournisseur;
  natureFour = [
    { label: 'P', value: 'P' },
    { label: 'G', value: 'G' },
  ];
  typeFour = [
    { label: 'L', value: 'L' },
    { label: 'E', value: 'E' },
  ];
  fieldDisable = true;
  clickedMenuAuthAjout = false;
  clickedMenuAuthModif = false;

  blockDocument = false;
  rechCode = '';
  rechDeno = '';
  // selectedMenu = 'Consultation Fournisseur';
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
    // this.finalMessages = [];
  }
  constructor(
    private fournisseurService: FournisseurService,
    private loginService: LoginService
  ) {
    this.viderSelectedFournisseur();
  }
  async ngOnInit() {
    await this.reloadDataFournisseurs();
    if (globals.selectedMenu === 'Consultation Fournisseur') {
      this.clickedMenuAuthAjout = false;
      this.clickedMenuAuthModif = false;
    }
    if (
      globals.selectedMenu === 'Ajout-Modif-Supp Fournisseur'
    ) {
      this.clickedMenuAuthAjout = false;
      this.clickedMenuAuthModif = true;
    }
  }
  pageRefresh() {
    location.reload();
  }

  viderSelectedFournisseur() {
    this.selectedFournisseur = {
      id: null,
      code: null,
      deno: null,
      adresse: null,
      ville: null,
      post: null,
      tel: null,
      telex: null,
      frs: null,
      respon: null,
      agence: null,
      banque: null,
      fax: null,
      compte: null,
      pays: null,
      plafond: null,
      ech: null,
      delai: null,
      typef: null,
      date_creat: null,
    };
  }

  async reloadDataFournisseurs() {
    await this.fournisseurService
      .getFournisseurListByOrderByDeno()
      .toPromise()
      .then((data) => {
        const fournisseursTemp = data['_embedded'].fournisseurs;
        this.fournisseurs = fournisseursTemp;
      })
      .catch((data) => {
        console.log('error reload data fournisseurs');
      })
      .finally(() => {
        this.grid.refresh();
      });
  }
  applyFilterFournisseurParCode() {
    this.searchOptions = {
      fields: ['code'],
      operator: 'startswith',
      key: this.rechCode,
      ignoreCase: true,
    };
    const tmp = this.fournisseurs;
    const sortedArray: any[] = tmp.sort((four1, four2) => {
      if (four1.code > four2.code) {
        return 1;
      }

      if (four1.code < four2.code) {
        return -1;
      }

      return 0;
    });
    this.fournisseurs = sortedArray;
  }
  applyFilterFournisseurParDeno() {
    this.searchOptions = {
      fields: ['deno'],
      operator: 'startswith',
      key: this.rechDeno,
      ignoreCase: true,
    };
    const tmp = this.fournisseurs;
    const sortedArray: any[] = tmp.sort((four1, four2) => {
      if (four1.deno > four2.deno) {
        return 1;
      }

      if (four1.deno < four2.deno) {
        return -1;
      }

      return 0;
    });
    this.fournisseurs = sortedArray;
  }
  updateData() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.ajouterDisable = true;
      this.modifierSupprimerDisable = false;
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedFournisseur = selected;
    }
  }
  ajouter() {
    this.ajouterDisable = true;
    this.modifierSupprimerDisable = true;
    this.validerAnnulerDisable = false;
    this.ajouterClicked = true;
    this.modifierClicked = false;
    this.supprimerClicked = false;
    this.fieldDisable = false;
    this.selectedFournisseur.delai = '0';
    this.selectedFournisseur.plafond = '0.000';
    this.selectedFournisseur.ech = '0';
    this.selectedFournisseur.frs = 'P';
    this.selectedFournisseur.typef = 'L';
    this.selectedFournisseur.date_creat = new Date().toLocaleDateString('en-GB');
  }
  modifier() {
    this.fieldDisable = false;
    this.ajouterDisable = true;
    this.modifierSupprimerDisable = true;
    this.validerAnnulerDisable = false;
    this.ajouterClicked = false;
    this.modifierClicked = true;
    this.supprimerClicked = false;
  }
  async supprimer(e) {
    this.wasInside = true;
    this.ov.hide();
    let verif: any = [];
    await this.fournisseurService
      .verifyToDelete(this.selectedFournisseur.code)
      .toPromise()
      .then((data) => {
        console.log(data);
        verif = data;
      });
    if (verif.length > 0) {
      if (Number(verif[0][0]) > 0) {
        this.msgs =
          'Erreur Suppression : Ce fournisseur a des articles dans le stock !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('supprimerBt'));
      } else {
        if (Number(verif[0][1]) > 0) {
          this.msgs =
            'Erreur Suppression : Ce fournisseur a des mouvements dans l\'année courante !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('supprimerBt'));
        } else {
          if (Number(verif[0][2]) > 0) {
            this.msgs =
              'Erreur Suppression : Ce fournisseur a des mouvements dans l\'année_1 !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('supprimerBt'));
          } else {
            if (Number(verif[0][3]) > 0) {
              this.msgs =
                'Erreur Suppression : Ce fournisseur a des mouvements dans l\'année_2 !';
              this.styleOvPanel = this.styleOvPanelError;
              this.ov.show(e, document.getElementById('supprimerBt'));
            } else {
              if (Number(verif[0][4]) > 0) {
                this.msgs =
                  'Erreur Suppression : Ce fournisseur a des proformats !';
                this.styleOvPanel = this.styleOvPanelError;
                this.ov.show(e, document.getElementById('supprimerBt'));
              } else {
                if (Number(verif[0][5]) > 0) {
                  this.msgs =
                    'Erreur Suppression : Ce fournisseur a des commandes !';
                  this.styleOvPanel = this.styleOvPanelError;
                  this.ov.show(e, document.getElementById('supprimerBt'));
                } else {
                  this.ajouterDisable = true;
                  this.modifierSupprimerDisable = true;
                  this.validerAnnulerDisable = false;
                  this.ajouterClicked = false;
                  this.modifierClicked = false;
                  this.supprimerClicked = true;
                }
              }
            }
          }
        }
      }
    }
  }
  async valider(e) {
    this.wasInside = true;
    this.ov.hide();

    if (this.ajouterClicked) {
      if (this.tester(e)) {
        this.blockDocument = true;
        await this.fournisseurService
          .createFournisseur(this.selectedFournisseur)
          .toPromise()
          .then((data) => {
            console.log('fournisseurAddSuccess');
            this.modifierSupprimerDisable = false;
            this.ajouterDisable = false;
            this.fieldDisable = true;
            this.validerAnnulerDisable = true;
            this.reloadDataFournisseurs();
            this.annuler();
          })
          .catch((error) => {
            console.log('error fournisseur add');
          })
          .finally(() => {
            this.grid.refresh();
          });
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            'AJOUT FOUR ' + this.selectedFournisseur.code
          )
          .toPromise()
          .then((data) => {
            console.log(data);
          });
        this.viderSelectedFournisseur();
        this.blockDocument = false;
      }
    }
    if (this.modifierClicked) {
      if (this.tester(e)) {
        this.blockDocument = true;
        await this.fournisseurService
          .updateFournisseur(this.selectedFournisseur)
          .toPromise()
          .then((data) => {
            console.log('fournisseurUpdateSuccess');
            this.modifierSupprimerDisable = false;
            this.ajouterDisable = false;
            this.fieldDisable = true;
            this.validerAnnulerDisable = true;
            this.reloadDataFournisseurs();
            this.annuler();
          })
          .catch((data) => {
            console.log('error fournisseur update');
          })
          .finally(() => {
            this.grid.refresh();
          });
        await this.loginService
          .procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            'MODIF FOUR ' + this.selectedFournisseur.code
          )
          .toPromise()
          .then((data) => {
            console.log(data);
          });
        this.viderSelectedFournisseur();
        this.blockDocument = false;
      }
    }

    if (this.supprimerClicked) {
      this.blockDocument = true;
      await this.fournisseurService
        .deleteFournisseur(this.selectedFournisseur)
        .toPromise()
        .then((data) => {
          console.log('fournisseurDeleteSuccess');
          this.modifierSupprimerDisable = false;
          this.ajouterDisable = false;
          this.fieldDisable = true;
          this.validerAnnulerDisable = true;
          this.reloadDataFournisseurs();
          this.annuler();
        })
        .catch((data) => {
          console.log('error fournisseur delete');
        })
        .finally(() => {
          this.grid.refresh();
        });
      await this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          'SUPP FOUR ' + this.selectedFournisseur.code
        )
        .toPromise()
        .then((data) => {
          console.log(data);
        });
      this.viderSelectedFournisseur();
      this.blockDocument = false;
    }
  }
  annuler() {
    this.selectedIndex = null;
    // this.viderSelectedFournisseur();
    // console.log(this.grid.getSelectedRowIndexes()[0]);
    this.annulerSelectionFournisseur();
    this.ajouterDisable = false;
    this.modifierSupprimerDisable = true;
    this.validerAnnulerDisable = true;
    this.fieldDisable = true;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.supprimerClicked = false;
    this.rechCode = '';
    this.rechDeno = '';
  }
  tester(e) {
    let ret = true;
    if (
      this.selectedFournisseur.code === '' ||
      String(this.selectedFournisseur.code) === 'null'
    ) {
      this.msgs = 'Veuillez saisir un code !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('codeFour').focus();
      this.ov.show(e, document.getElementById('codeFour'));
      ret = false;
      return;
    }
    if (this.ajouterClicked) {
      if (
        this.fournisseurs.some(
          (res) => res.code === this.selectedFournisseur.code
        )
      ) {
        this.msgs = 'Le code fournisseur saisie existe !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('codeFour').focus();
        this.ov.show(e, document.getElementById('codeFour'));
        ret = false;
        return;
      }
    }
    if (
      this.selectedFournisseur.deno === '' ||
      this.selectedFournisseur.deno === null
    ) {
      this.msgs = 'Veuillez saisir un nom !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('denoFour').focus();
      this.ov.show(e, document.getElementById('denoFour'));
      ret = false;
      return;
    }
    return ret;
  }
  updateOnSelect(ind: number) {}
  annulerSelectionFournisseur(): void {
    if (!this.ajouterClicked) {
      if (this.grid.getSelectedRowIndexes()[0] >= 0) {
        this.ajouterDisable = false;
        this.modifierSupprimerDisable = true;
        this.viderSelectedFournisseur();
        this.grid.selectRows([]);
      }
    }
  }
}
