import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { ClientService } from '../services/client.service';
import { StockService } from '../services/stock.service';
import { FournisseurService } from '../services/fournisseur.service';
import { FamilleService } from '../services/famille.service';
import { SfamilleService } from '../services/sfamille.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { SecteurService } from '../services/secteur.service';
import { ZoneService } from '../services/zone.service';
import { RepresanService } from '../services/represan.service';
import { GroupeService } from '../services/groupe.service';
import { GridComponent, ExcelExportProperties } from '@syncfusion/ej2-angular-grids';
import { MessageService } from 'primeng/api';
import { DuplicataComponent } from '../duplicata/duplicata.component';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ViewMouveService } from '../services/view-mouve.service';
import { ViewMouve1Service } from '../services/view-mouve1.service';
import { ViewMouve2Service } from '../services/view-mouve2.service';
import { OverlayPanel } from 'primeng/primeng';
import { ReturnType } from '@syncfusion/ej2-grids';
import { ExcelService } from '../services/excel.service';

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
  selector: 'app-analyse-ca-marges',
  templateUrl: './analyse-ca-marges.component.html',
  styleUrls: ['./analyse-ca-marges.component.scss'],
  providers: [MessageService, DatePipe, ExcelService],
})
export class AnalyseCaMargesComponent implements OnInit {

  disabledCriteres: boolean;
  excelExportProperties: ExcelExportProperties;
  ficheClient = true;
  @ViewChild(DuplicataComponent) Duplicata;
  displayDuplicata = false;
  buttonInitialiserVisible = true;
  tn: any;
  @ViewChild('op')
  public op: OverlayPanel;
  msg: string;
  dateDebut: Date = new Date('01/01/' + String(new Date().getFullYear()));
  dateFin: Date = new Date();
  anneeCourante: string = String(new Date().getFullYear());
  minDateValue: Date = this.dateDebut;
  maxDateValue: Date = this.dateFin;
  annee1: string = String(new Date().getFullYear() - 1);
  annee2: string = String(new Date().getFullYear() - 2);
  selectedYear = this.anneeCourante;
  selectedGroupBy = 'famille';
  showDetails = false;
  showDetailss = false;
  clients = new Array();
  suiteRequete = '';
  analysesCaMargesDetails = new Array();
  // selectedClient: any = { id: '', code: '', deno: '' };
  selectedClient: any = null;
  hiddenBtnAfficher = false;
  articles = new Array();
  selectedArticle: any = null;

  fournisseurs = new Array();
  selectedFournisseur: any = null;

  familles = new Array();
  selectedFamille: any = null;

  sousfamilles = new Array();
  selectedSousFamille: any = null;

  vendeurs = new Array();
  selectedVendeur: any = null;

  activites = new Array();
  selectedActivite: any = null;

  zones = new Array();
  selectedZone: any = null;

  representants = new Array();
  selectedRepresentant: any = null;

  groupes = new Array();
  selectedGroupe: any = null;

  typolClient = [
    { code: 'O', value: 'O' },
    { code: 'N', value: 'N' },
  ];
  selectedTypolClient: any = null;

  RevCons = [
    { code: 'C', value: 'C' },
    { code: 'R', value: 'R' },
  ];
  selectedRevCons: any = null;

  totaux = { totCA: '0.000', totAchat: '0.000', totMarges: '0.000' };
  totauxDetails = {
    valAchat: '0.000',
    valVenteVendeur: '0.000',
    mtRemise: '0.000',
    valVenteRemise: '0.000',
    valMarge: '0.000',
    valVenteReelle: '0.000',
    pourcCorrespondA: '0.000',
    correspondA: '0.000',
  };

  mouv = 'ViewMouve m';
  recet = 'Recettes r';

  analysesCaMarges = new Array;

  @ViewChild('grid')
  public grid: GridComponent;

  @ViewChild('gridDetail')
  public gridDetail: GridComponent;

  public sortOptions: object;
  codeZone: string;
  codeActivite: string;
  codeSFamille: string;
  codeFamille: string;
  codeClient: string;
  codeGroupe: string;
  codeRepresentant: string;
  codeVendeur: string;
  codeFournisseur: string;
  codeArticle: string;
  codeTypolClient: string;
  dadteD: string;
  dadteF: string;
  codeTypecomm: string;
  showConfirm: boolean;
  wasInside: any;
  totCaMargesDetails = new  Array();
  sumCa: number;
  sumVa: number;
  sumMrg: any;
  cod: any;
  btnFermerDetails = false;
  sortOptionsPart: { columns: { field: string; direction: string; }[]; };
  notice = '';
  analysesCaMarges_Excel: any[];
  sumCa_exc: number;
  sumVa__exc: number;
  sumMrg_exc: string;
  SommeCa: string;
  SommeVa: string;
  SommeMrg: string;
  SommeCaValue: string;
  SommeVaValue: string;
  SommeMrgValue: string;
  constructor(
    private viewMouve2Service: ViewMouve2Service,
    private viewMouve1Service: ViewMouve1Service,
    private viewMouveService: ViewMouveService,
    private config: NgSelectConfig,
    private clientService: ClientService,
    private stockService: StockService,
    private fournisseurService: FournisseurService,
    private familleService: FamilleService,
    private vendeur1Service: Vendeur1Service,
    private secteurService: SecteurService,
    private sfamilleService: SfamilleService,
    private zoneService: ZoneService,
    private represanService: RepresanService,
    private groupeService: GroupeService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private excelService: ExcelService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }

  public onSearchItemByCode(word: string, item: any): boolean {
    if (item.code !== undefined) {
      return item.code.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
    }
  }

  public onSearchItem(word: string, item: any): boolean {
    if (item.deno !== undefined) {
      return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
    }
    if (item.nom !== undefined) {
      return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
    }

    if (item.design !== undefined) {
      return item.design
        .toLocaleLowerCase()
        .startsWith(word.toLocaleLowerCase());
    }
    if (item.label !== undefined) {
      return item.label
        .toLocaleLowerCase()
        .startsWith(word.toLocaleLowerCase());
    }
  }

  changeRevCons() {
    if (this.selectedRevCons === null || this.selectedRevCons === undefined) {
      this.codeTypecomm = '';
    } else {
      this.codeTypecomm = this.selectedRevCons.code;
    }
  }
  changeTypolClient() {
    if (
      this.selectedTypolClient === null ||
      this.selectedTypolClient === undefined
    ) {
      this.codeTypolClient = '';
    } else {
      this.codeTypolClient = this.selectedTypolClient.code;
    }
  }
  changeZone() {
    if (this.selectedZone === null || this.selectedZone === undefined) {
      this.codeZone = '';
    } else {
      this.codeZone = this.selectedZone.code;
    }
  }

  async chargerZone() {
    if (this.zones.length === 0) {
      await this.zoneService
        .getZoneByDeno()
        .toPromise()
        .then((data) => {
          this.zones = data['_embedded'].zones;
        })
        .catch((data) => {
          console.log('error reload data zones');
        })
        .finally(() => {
          // this.grid.refresh();
        });
    }
  }
  changeActivites() {
    if (this.selectedActivite === null || this.selectedActivite === undefined) {
      this.codeActivite = '';
    } else {
      this.codeActivite = this.selectedActivite.code;
    }
  }

  async chargerActivites() {
    if (this.activites.length === 0) {
      await this.secteurService
        .getSecteurByDeno()
        .toPromise()
        .then((data) => {
          this.activites = data['_embedded'].secteurs;
        })
        .catch((data) => {
          console.log('error reload data secteurs');
        })
        .finally(() => {});
    }
  }
  changeSousfamilles() {
    if (
      this.selectedSousFamille === null ||
      this.selectedSousFamille === undefined
    ) {
      this.codeSFamille = '';
    } else {
      this.codeSFamille = this.selectedSousFamille.code;
    }
  }
  async chargerSousfamilles() {
    if (this.sousfamilles.length === 0) {
      await this.sfamilleService
        .getSousFamillesByOrderByNom()
        .toPromise()
        .then((data) => {
          this.sousfamilles = data['_embedded'].sfamilles;
        })
        .catch((data) => {
          console.log('error reload data sous familles');
        })
        .finally(() => {});
    }
  }
  changeFamilles() {
    if (this.selectedFamille === null || this.selectedFamille === undefined) {
      this.codeFamille = '';
    } else {
      this.codeFamille = this.selectedFamille.code;
    }
  }
  async chargerFamilles() {
    if (this.familles.length === 0) {
      await this.familleService
        .getFamillesByOrderByNom()
        .toPromise()
        .then((data) => {
          this.familles = data['_embedded'].familles;
        })
        .catch((data) => {
          console.log('error reload data familles');
        })
        .finally(() => {
          // this.grid.refresh();
        });
    }
  }
  changeClients() {
    if (this.selectedClient === null || this.selectedClient === undefined) {
      this.codeClient = '';
    } else {
      this.codeClient = this.selectedClient.code;
    }
  }
  async chargerClients() {
    if (this.clients.length === 0) {
      await this.clientService
        .getClientsListByOrderByDeno()
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clients;
        })
        .catch((data) => {
          console.log('error reload data clients');
        })
        .finally(() => {
          // this.grid.refresh();
        });
    }
  }
  changeGroupes() {
    if (this.selectedGroupe === null || this.selectedGroupe === undefined) {
      this.codeGroupe = '';
    } else {
      this.codeGroupe = this.selectedGroupe.code;
    }
  }
  async chargerGroupes() {
    if (this.groupes.length === 0) {
      await this.groupeService
        .getGroupesList()
        .toPromise()
        .then((data) => {
          this.groupes = data['_embedded'].groupes;
        })
        .catch((data) => {
          console.log('error reload data groupes');
        })
        .finally(() => {});
    }
  }
  changeRepresentants() {
    if (
      this.selectedRepresentant === null ||
      this.selectedRepresentant === undefined
    ) {
      this.codeRepresentant = '';
    } else {
      this.codeRepresentant = this.selectedRepresentant.code;
    }
  }
  async chargerRepresentants() {
    if (this.vendeurs.length === 0) {
      await this.represanService
        .getRepresansListOrderByDeno()
        .toPromise()
        .then((data) => {
          this.representants = data['_embedded'].represans;
        })
        .catch((data) => {
          console.log('error reload data representants');
        })
        .finally(() => {
          // this.grid.refresh();
        });
    }
  }
  changeVendeurs() {
    if (this.selectedVendeur === null || this.selectedVendeur === undefined) {
      this.codeVendeur = '';
    } else {
      this.codeVendeur = this.selectedVendeur.code;
    }
  }
  async chargerVendeur() {
    if (this.vendeurs.length === 0) {
      await this.vendeur1Service
        .getVendeur1ByDeno()
        .toPromise()
        .then((data) => {
          this.vendeurs = data['_embedded'].vendeur1;
        })
        .catch((data) => {
          console.log('error reload data fournisseurs');
        })
        .finally(() => {
          // this.grid.refresh();
        });
    }
  }
  changeFournisseurs() {
    if (
      this.selectedFournisseur === null ||
      this.selectedFournisseur === undefined
    ) {
      this.codeFournisseur = '';
    } else {
      this.codeFournisseur = this.selectedFournisseur.code;
    }
  }
  async chargerFournisseur() {
    if (this.fournisseurs.length === 0) {
      await this.fournisseurService
        .findByOrderByDeno()
        .toPromise()
        .then((data) => {
          this.fournisseurs = data['_embedded'].fournisseurs;
        })
        .catch((data) => {
          console.log('error reload data fournisseurs');
        })
        .finally(() => {
          // this.grid.refresh();
        });
    }
  }
  async ngOnInit() {

    this.hiddenBtnAfficher = false;
    this.disabledCriteres = false;
    this.showConfirm = false;
    this.sortOptions = {
      columns: [{ field: 'combine', direction: 'Descending' }],
    };
    this.sortOptionsPart = {
      columns: [{ field: 'id', direction: 'Descending' }],
    };
    this.tn = {
      firstDayOfWeek: 0,
      dayNames: [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche',
      ],
      dayNamesShort: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      dayNamesMin: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
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
    this.buttonInitialiserVisible = true;
    this.codeTypolClient = '';
    this.codeTypecomm = '';
    this.codeZone = '';
    this.codeActivite = '';
    this.codeSFamille = '';
    this.codeFamille = '';
    this.codeClient = '';
    this.codeGroupe = '';
    this.codeRepresentant = '';
    this.codeVendeur = '';
    this.codeFournisseur = '';
    this.codeArticle = '';
  }

  changeArticles() {
    if (this.selectedArticle === null || this.selectedArticle === undefined) {
      this.codeArticle = '';
    } else {
      this.codeArticle = this.selectedArticle.code;
    }
  }
  async rechercheArt(filterValue: string) {
    await this.stockService
      .getStockList(filterValue)
      .toPromise()
      .then((data) => {
        this.articles = data['_embedded'].stocks;
      })
      .catch((data) => {
        console.log('error reload data stocks');
      })
      .finally(() => {
        // this.grid.refresh();
      });
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  annulerSelectionDetails(): void {
    if (this.gridDetail.getSelectedRowIndexes()[0] >= 0) {
      this.gridDetail.selectRows([]);
    }
  }
  changeDate() {
    if (this.selectedYear === this.anneeCourante) {
      this.dateDebut = new Date('01/01/' + this.anneeCourante); // + this.selectedYear);
      // this.dateFin = new Date('12/31/' + this.anneeCourante);
      // '12/31/' + this.anneeCourante
      this.dateFin = new Date();
      this.selectedGroupBy = 'famille';

    } else {
      this.selectedGroupBy = 'famille';
      this.dateDebut = new Date('01/01/' + this.selectedYear);
      this.dateFin = new Date('12/31/' + this.selectedYear);
      if (this.selectedYear === this.annee1) {
      } else {
      }
    }
    this.minDateValue = this.dateDebut;
    this.maxDateValue = this.dateFin;
  }
  initialiserTout() {
    this.anneeCourante = String(new Date().getFullYear());
    this.annee1 = String(new Date().getFullYear() - 1);
    this.annee2 = String(new Date().getFullYear() - 2);
    this.selectedYear = this.anneeCourante;
    this.changeDate();
    this.clients = [];
    // selectedClient: any = { id: '', code: '', deno: '' };
    this.selectedClient = null;
    this.codeZone = '';
    this.codeActivite = '';
    this.codeSFamille = '';
    this.codeFamille = '';
    this.codeClient = '';
    this.codeGroupe = '';
    this.codeRepresentant = '';
    this.codeVendeur = '';
    this.codeFournisseur = '';
    this.codeArticle = '';
    this.codeTypolClient = '';

    this.articles = [];
    this.selectedArticle = null;

    this.fournisseurs = [];
    this.selectedFournisseur = null;

    this.familles = [];
    this.selectedFamille = null;

    this.sousfamilles = [];
    this.selectedSousFamille = null;

    this.vendeurs = [];
    this.selectedVendeur = null;

    this.activites = [];
    this.selectedActivite = null;

    this.zones = [];
    this.selectedZone = null;

    this.representants = [];
    this.selectedRepresentant = null;

    this.groupes = [];
    this.selectedGroupe = null;

    this.selectedTypolClient = null;

    this.selectedRevCons = null;

    this.analysesCaMarges = [];

    this.totaux = { totCA: '0.000', totAchat: '0.000', totMarges: '0.000' };
  }
  Nouvellesaisi() {
    this.analysesCaMarges = [];
    this.disabledCriteres = false;
    this.buttonInitialiserVisible = true;
    this.analysesCaMarges = new Array();
    this.analysesCaMargesDetails = new Array();
    this.showDetails = false;
    this.showDetailss = true;
    this.buttonInitialiserVisible = true;
    this. totauxDetails = {
      valAchat: '0.000',
      valVenteVendeur: '0.000',
      mtRemise: '0.000',
      valVenteRemise: '0.000',
      valMarge: '0.000',
      valVenteReelle: '0.000',
      pourcCorrespondA: '0.000',
      correspondA: '0.000',
    };
    this.hiddenBtnAfficher = false;

  }


  async getCaMargesByClientAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.clientService
      .getCaMargesByClient(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByArticleAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.stockService
      .getCaMargesAnneCrntByStock(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByFourAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.fournisseurService
      .getCaMargesAnnCrntByFournisseur(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT FOUR ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByVendeurAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.vendeur1Service
      .getCaMargesAnnCrntByVendeur(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Vendeur ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }

  async getCaMargesByFamilleAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.familleService
      .getCaMargesAnnCrntByFamille(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT famille ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesBySousFamilleAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.sfamilleService
      .getCaMargesAnnCrntBySFamille(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Sfamille ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByZoneAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.zoneService
      .getCaMargesAnnCrntByZone(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Zone ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }

  async getCaMargesBySecteurAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.secteurService
      .getCaMargesAnnCrntBySecteur(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Secteur ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByRepresanAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.represanService
      .getCaMargesAnnCrntByRepresan(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Represan ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByGroupeAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.groupeService
      .getCaMargesAnnCrntByGroupe(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Groupe ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }

  async getCaMargesByRevConsAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.clientService
      .getCaMargesAnnCrntBytypeCommClt(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT typeCommClt ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByClasseAnneCourante() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.clientService
      .getCaMargesAnnCrntByMagClt(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Classe ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }




  async getCaMargesByClientAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.clientService
      .getCaMargesAnne1ByClient(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByArticleAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.stockService
      .getCaMargesAnne1ByStock(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByFourAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.fournisseurService
      .getCaMargesAnne1ByFournisseur(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT FOUR ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByVendeurAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.vendeur1Service
      .getCaMargesAnne1ByVendeur(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Vendeur ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }

  async getCaMargesByFamilleAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.familleService
      .getCaMargesAnne1ByFamille(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT famille ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesBySousFamilleAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.sfamilleService
      .getCaMargesAnne1BySFamille(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Sfamille ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByZoneAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.zoneService
      .getCaMargesAnne1ByZone(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Zone ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }

  async getCaMargesBySecteurAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.secteurService
      .getCaMargesAnne1BySecteur(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Secteur ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByRepresanAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.represanService
      .getCaMargesAnne1ByRepresan(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Represan ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByGroupeAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.groupeService
      .getCaMargesAnne1ByGroupe(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Groupe ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }

  async getCaMargesByRevConsAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.clientService
      .getCaMargesAnne1BytypeCommClt(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT typeCommClt ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByClasseAnne_1() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.clientService
      .getCaMargesAnne1ByMagClt(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Classe ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }




  async getCaMargesByClientAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.clientService
      .getCaMargesAnne2ByClient(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });


  }
  async getCaMargesByArticleAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.stockService
      .getCaMargesAnne2ByStock(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByFourAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.fournisseurService
      .getCaMargesAnne2ByFournisseur(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT FOUR ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByVendeurAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.vendeur1Service
      .getCaMargesAnne2ByVendeur(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Vendeur ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByFamilleAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.familleService
      .getCaMargesAnne2ByFamille(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT famille ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesBySousFamilleAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.sfamilleService
      .getCaMargesAnne2BySFamille(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Sfamille ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByZoneAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.zoneService
      .getCaMargesAnne2ByZone(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Zone ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesBySecteurAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.secteurService
      .getCaMargesAnne2BySecteur(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Secteur ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByRepresanAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.represanService
      .getCaMargesAnne2ByRepresan(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Represan ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByGroupeAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.groupeService
      .getCaMargesAnne2ByGroupe(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Groupe ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }

  async getCaMargesByRevConsAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.clientService
      .getCaMargesAnne2BytypeCommClt(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT typeCommClt ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }
  async getCaMargesByClasseAnne_2() {
    this.dadteD = this.dateDebut.toLocaleDateString('en-GB');
    this.dadteF = this.dateFin.toLocaleDateString('en-GB');
    // tslint:disable-next-line:max-line-length
    await this.clientService
      .getCaMargesAnne2ByMagClt(
        this.dadteD,
        this.dadteF,
        this.codeClient,
        this.codeVendeur,
        this.codeArticle,
        this.codeFournisseur,
        this.codeFamille,
        this.codeSFamille,
        this.codeZone,
        this.codeActivite,
        this.codeRepresentant,
        this.codeTypolClient,
        this.codeTypecomm,
        this.codeGroupe
      )
      .toPromise()
      .then((data) => {
        console.log('afficheeeeeeeeeeeer AN CRNT Classe ', data);
        this.analysesCaMarges = data['_embedded'].analyseCaMargeses;
      });

  }

  async afficherAnneCourante() {
    switch (this.selectedGroupBy) {
      case 'client':
        await this.getCaMargesByClientAnneCourante();
        break;
      case 'article':
        await this.getCaMargesByArticleAnneCourante();
        break;
      case 'fournisseur':
        await this.getCaMargesByFourAnneCourante();
        break;
      case 'vendeur':
        await this.getCaMargesByVendeurAnneCourante();
        break;
      case 'famille':
        await this.getCaMargesByFamilleAnneCourante();
        break;
      case 'sousFamille':
        await this.getCaMargesBySousFamilleAnneCourante();
        break;
      case 'zone':
        await this.getCaMargesByZoneAnneCourante();
        break;
      case 'activite':
        await this.getCaMargesBySecteurAnneCourante();
        break;
      case 'represan':
        await this.getCaMargesByRepresanAnneCourante();
        break;
      case 'groupe':
        await this.getCaMargesByGroupeAnneCourante();
        break;
      case 'classe':
        await this.getCaMargesByClasseAnneCourante();
        break;
      case 'revCons':
        await this.getCaMargesByRevConsAnneCourante();
        break;
      default:
        console.log('error');
    }
  }
  async afficherAnne_1() {
    switch (this.selectedGroupBy) {
      case 'client':
        await this.getCaMargesByClientAnne_1();
        break;
      case 'article':
        await this.getCaMargesByArticleAnne_1();
        break;
      case 'fournisseur':
        await this.getCaMargesByFourAnne_1();
        break;
      case 'vendeur':
        await this.getCaMargesByVendeurAnne_1();
        break;
      case 'famille':
        await this.getCaMargesByFamilleAnne_1();
        break;
      case 'sousFamille':
        await this.getCaMargesBySousFamilleAnne_1();
        break;
      case 'zone':
        await this.getCaMargesByZoneAnne_1();
        break;
      case 'activite':
        await this.getCaMargesBySecteurAnne_1();
        break;
      case 'represan':
        await this.getCaMargesByRepresanAnne_1();
        break;
      case 'groupe':
        await this.getCaMargesByGroupeAnne_1();
        break;
      case 'classe':
        await this.getCaMargesByClasseAnne_1();
        break;
      case 'revCons':
        await this.getCaMargesByRevConsAnne_1();
        break;
      default:
        console.log('error');
    }
  }
  async afficherAnne_2() {
    switch (this.selectedGroupBy) {
      case 'client':
        await this.getCaMargesByClientAnne_2();
        break;
      case 'article':
        await this.getCaMargesByArticleAnne_2();
        break;
      case 'fournisseur':
        await this.getCaMargesByFourAnne_2();
        break;
      case 'vendeur':
        await this.getCaMargesByVendeurAnne_2();
        break;
      case 'famille':
        await this.getCaMargesByFamilleAnne_2();
        break;
      case 'sousFamille':
        await this.getCaMargesBySousFamilleAnne_2();
        break;
      case 'zone':
        await this.getCaMargesByZoneAnne_2();
        break;
      case 'activite':
        await this.getCaMargesBySecteurAnne_2();
        break;
      case 'represan':
        await this.getCaMargesByRepresanAnne_2();
        break;
      case 'groupe':
        await this.getCaMargesByGroupeAnne_2();
        break;
      case 'classe':
        await this.getCaMargesByClasseAnne_2();
        break;
      case 'revCons':
        await this.getCaMargesByRevConsAnne_2();
        break;
      default:
        console.log('error');
    }
  }

  async afficher_top1000(e) {

    this.showDetailss = false;
    this.wasInside = true;
   console.log('selectedYear   ', this.selectedYear);
   console.log('dadteD   ', this.dateDebut);
   console.log('dadtef   ', this.dateFin);
   this.analysesCaMarges = new Array();

    if (this.selectedYear === this.anneeCourante) {
         await this.afficherAnneCourante();
    } else {
      if (this.selectedYear === this.annee1) {
           await this.afficherAnne_1();

      } else {
        await this.afficherAnne_2();
      }
    }

       this.notice = 'Voici les milles premieres lignes , veulliez raffiner les critères ! ';
             this.hiddenBtnAfficher = true;
            this.sumCa = 0;
            this.sumVa = 0;
            this.sumMrg = 0;
            this.analysesCaMarges = this.analysesCaMarges.slice(0, 1000);
            console.log('leeeeeength  ', this.analysesCaMarges.length );
            console.log('top 1000 lignes ', this.analysesCaMarges );

            for (const obj of this.analysesCaMarges ) {
              obj.mrg = Number(obj.mrg);
              obj.va = Number(obj.va);
              obj.ca = Number(obj.ca);
              this.sumCa = this.sumCa +  Number(obj.ca);
              this.sumVa = this.sumVa +  Number(obj.va);
            }
            if (this.sumVa !== 0) {
              this.sumMrg = Number(((this.sumCa - this.sumVa) / this.sumVa ) * 100).toFixed(3);
            //  console.log('sommee mrg   ', this.sumMrg);
             // this.sumMrg = 'NON DEF';
            } else {
              this.sumMrg = 'NON DEF';
            }

            for (const obj of this.analysesCaMarges) {
              const moy  = (Number(obj.ca) / Number(this.sumCa) ) * 100;
            //  console.log('*** moyyyyyyyyyyyyyyy  ', moy);
                obj.id = moy;
            }


            this.sumCa_exc = 0;
            this.sumVa__exc  = 0;
            this.sumMrg_exc = '0';
            for (const obj of this.analysesCaMarges_Excel ) {
              obj.mrg = Number(obj.mrg);
              obj.va = Number(obj.va);
              obj.ca = Number(obj.ca);
              this.sumCa_exc = this.sumCa_exc +  Number(obj.ca);
              this.sumVa__exc = this.sumVa__exc +  Number(obj.va);
            }
            if (this.sumVa__exc !== 0) {
              this.sumMrg_exc = Number(((this.sumCa_exc - this.sumVa__exc) / this.sumVa__exc ) * 100).toFixed(3);
              console.log('sommee mrg   ', this.sumMrg_exc);
             // this.sumMrg = 'NON DEF';
            } else {
              this.sumMrg_exc = 'NON DEF';
            }
  this.SommeCaValue = this.sumCa_exc.toFixed(3);
  this.SommeCa = 'TOTAL CHIFFRE D\'AFFAIRES : ' ;
  this.SommeVaValue = this.sumVa__exc.toFixed(3);
  this.SommeVa = 'TOTAL VALEUR A L\'ACHAT : ' ;
  this.SommeMrgValue = this.sumMrg_exc;
  this.SommeMrg = 'TOTAL MARGES : ' ;

            this.disabledCriteres = true;
            this. buttonInitialiserVisible = false;
  }



  async afficher(e) {
    this.notice = '';
    this.SommeCa = '';
    this.SommeVa = '';
    this.SommeMrg = '';
    this.SommeCaValue = '';
    this.SommeVaValue = '';
    this.SommeMrgValue = '';
    this.showDetailss = false;
    this.wasInside = true;
   console.log('selectedYear   ', this.selectedYear);
   console.log('dadteD   ', this.dateDebut);
   console.log('dadtef   ', this.dateFin);
   this.analysesCaMarges = new Array();

    if (this.selectedYear === this.anneeCourante) {
         await this.afficherAnneCourante();
    } else {
      if (this.selectedYear === this.annee1) {
           await this.afficherAnne_1();

      } else {
        await this.afficherAnne_2();
      }
    }
    if (this.analysesCaMarges.length === 0 ) {
      this.disabledCriteres = false;
      this.msg = 'Aucun evenement avec ces critères !  ';
      this.op.show(e, document.getElementById('btnafficher'));
     this. buttonInitialiserVisible = true;
     this.hiddenBtnAfficher = false;

    } else {
      this.analysesCaMarges_Excel = this.analysesCaMarges;
           if (this.analysesCaMarges.length > 1000) {
           await this.afficher_top1000(e);

           } else {
            //
            if (this.analysesCaMarges.length <= 1000 && this.analysesCaMarges.length >= 1 ) {
              this.notice = '';
              this.hiddenBtnAfficher = true;
             this.sumCa = 0;
             this.sumVa = 0;
             this.sumMrg = 0;
             this.analysesCaMarges = this.analysesCaMarges.slice(0, 1000);
             console.log('leeeeeength  ', this.analysesCaMarges.length );
             console.log('top 1000 lignes ', this.analysesCaMarges );

             for (const obj of this.analysesCaMarges ) {
               obj.mrg = Number(obj.mrg);
               obj.va = Number(obj.va);
               obj.ca = Number(obj.ca);
               this.sumCa = this.sumCa +  Number(obj.ca);
               this.sumVa = this.sumVa +  Number(obj.va);
             }
             if (this.sumVa !== 0) {
               this.sumMrg = Number(((this.sumCa - this.sumVa) / this.sumVa ) * 100).toFixed(3);
             //  console.log('sommee mrg   ', this.sumMrg);
              // this.sumMrg = 'NON DEF';
             } else {
               this.sumMrg = 'NON DEF';
             }

             for (const obj of this.analysesCaMarges) {
               const moy  = (Number(obj.ca) / Number(this.sumCa) ) * 100;
             //  console.log('*** moyyyyyyyyyyyyyyy  ', moy);
                 obj.id = moy;
             }


             this.sumCa_exc = 0;
             this.sumVa__exc  = 0;
             this.sumMrg_exc = '0';
             for (const obj of this.analysesCaMarges_Excel ) {
               obj.mrg = Number(obj.mrg);
               obj.va = Number(obj.va);
               obj.ca = Number(obj.ca);
               this.sumCa_exc = this.sumCa_exc +  Number(obj.ca);
               this.sumVa__exc = this.sumVa__exc +  Number(obj.va);
             }
             if (this.sumVa__exc !== 0) {
               this.sumMrg_exc = Number(((this.sumCa_exc - this.sumVa__exc) / this.sumVa__exc ) * 100).toFixed(3);
               console.log('sommee mrg   ', this.sumMrg_exc);
              // this.sumMrg = 'NON DEF';
             } else {
               this.sumMrg_exc = 'NON DEF';
             }
   this.SommeCaValue = this.sumCa_exc.toFixed(3);
   this.SommeCa = 'TOTAL CHIFFRE D\'AFFAIRES : ' ;
   this.SommeVaValue = this.sumVa__exc.toFixed(3);
   this.SommeVa = 'TOTAL VALEUR A L\'ACHAT : ' ;
   this.SommeMrgValue = this.sumMrg_exc;
   this.SommeMrg = 'TOTAL MARGES : ' ;

             this.disabledCriteres = true;
             this. buttonInitialiserVisible = false;
        /*  } else {
          }*/
        }

    }

   /**/
  }
  }

public customAggregateFn = (sdata: ReturnType) => { };



  async afficherDetailsAnneCourante(cod: string) {
    this.totCaMargesDetails = new  Array();
    this.analysesCaMargesDetails = new Array();
    switch (this.selectedGroupBy) {
      case 'client':
        await this.viewMouveService.getAnalysesCaMargesDetailsByClient(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Client ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByClient(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              this.cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Client ', this.totCaMargesDetails);
          });
        }




        break;
      case 'article':
        await this.viewMouveService.getAnalysesCaMargesDetailsByArticle(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Article ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByArticle(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Article ', this.totCaMargesDetails);
          });
        }



        break;
      case 'fournisseur':
        await this.viewMouveService.getAnalysesCaMargesDetailsByFournisseur(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Fournisseur ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByFournisseur(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Fournisseur ', this.totCaMargesDetails);
          });
        }



        break;
      case 'vendeur':
        await this.viewMouveService.getAnalysesCaMargesDetailsByVendeur(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Vendeur ', data);
            this.analysesCaMargesDetails =  data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByVendeur(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Vendeur ', this.totCaMargesDetails);
          });
        }





        break;
      case 'famille':
        await this.viewMouveService.getAnalysesCaMargesDetailsByFamille(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Famille ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByFamille(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Famille ', this.totCaMargesDetails);
          });
        }



         break;
      case 'sousFamille':
        await this.viewMouveService.getAnalysesCaMargesDetailsBySousFamille(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa SousFamille ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsBySousFamille(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa SousFamille ', this.totCaMargesDetails);
          });
        }





        break;
      case 'zone':
        await this.viewMouveService.getAnalysesCaMargesDetailsByZone(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Zone ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByZone(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Zone ', this.totCaMargesDetails);
          });
        }


        break;
      case 'activite':
        await this.viewMouveService.getAnalysesCaMargesDetailsBySecteur(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Secteur ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsBySecteur(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Zone ', this.totCaMargesDetails);
          });
        }



        break;
      case 'represan':
        await this.viewMouveService.getAnalysesCaMargesDetailsByRepresant(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Represant ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByRepresant(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Represant ', this.totCaMargesDetails);
          });
        }


        break;
      case 'groupe':
        await this.viewMouveService.getAnalysesCaMargesDetailsByGroupe(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Groupe ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });


          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByGroupe(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Groupe ', this.totCaMargesDetails);
          });
        }


        break;
      case 'classe':
        await this.viewMouveService.getAnalysesCaMargesDetailsByMag(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Mag ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByMag(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Mag ', this.totCaMargesDetails);
          });
        }





        break;
      case 'revCons':
        await this.viewMouveService.getAnalysesCaMargesDetailsByTypeComm(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa TypeComm ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouveService.getTOTCaMargesDetailsByTypeComm(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa TypeComm ', this.totCaMargesDetails);
          });
        }






        break;
      default:
        console.log('error');
    }
  }
  async afficherDetailsAnne_1(cod: string) {
    this.totCaMargesDetails = new Array();
    this.analysesCaMargesDetails = new Array();
    switch (this.selectedGroupBy) {
      case 'client':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByClient(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Client ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsByClient(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Client ', this.totCaMargesDetails);
          });
        }


        break;
      case 'article':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByArticle(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Article ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsByArticle(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Article ', this.totCaMargesDetails);
          });
        }

        break;
      case 'fournisseur':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByFournisseur(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Fournisseur ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsByFournisseur(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Fournisseur ', this.totCaMargesDetails);
          });
        }

        break;
      case 'vendeur':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByVendeur(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Vendeur ', data);
            this.analysesCaMargesDetails =  data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsByVendeur(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Vendeur ', this.totCaMargesDetails);
          });
        }

        break;
      case 'famille':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByFamille(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Famille ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsByFamille(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Famille ', this.totCaMargesDetails);
          });
        }

         break;
      case 'sousFamille':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsBySousFamille(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa SousFamille ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsBySousFamille(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa SousFamille ', this.totCaMargesDetails);
          });
        }

        break;
      case 'zone':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByZone(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Zone ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsByZone(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Zone ', this.totCaMargesDetails);
          });
        }



        break;
      case 'activite':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsBySecteur(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Secteur ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsBySecteur(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Zone ', this.totCaMargesDetails);
          });
        }



        break;
      case 'represan':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByRepresant(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Represant ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsByRepresant(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Represant ', this.totCaMargesDetails);
          });
        }
        break;
      case 'groupe':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByGroupe(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Groupe ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsByGroupe(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Groupe ', this.totCaMargesDetails);
          });
        }

        break;
      case 'classe':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByMag(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Mag ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve1Service.getTOTCaMargesDetailsByMag(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Mag ', this.totCaMargesDetails);
          });
        }


        break;
      case 'revCons':
        await this.viewMouve1Service.getAnalysesCaMargesDetailsByTypeComm(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa TypeComm ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
          await this.viewMouve1Service.getTOTCaMargesDetailsByTypeComm(
            this.dadteD,
            this.dadteF,
            this.codeClient,
            this.codeVendeur,
            this.codeArticle,
            this.codeFournisseur,
            this.codeFamille,
            this.codeSFamille,
            this.codeZone,
            this.codeActivite,
            this.codeRepresentant,
            this.codeTypolClient,
            this.codeTypecomm,
            this.codeGroupe,
            cod
          )
            .toPromise()
            .then((data) => {
              this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
              console.log('TOT CaMargesDetails dataaa TypeComm ', this.totCaMargesDetails);
        });
      }

        break;
      default:
        console.log('error');
    }

  }
  async afficherDetailsAnne_2(cod: string) {
    this.totCaMargesDetails = new Array();
    this.analysesCaMargesDetails = new Array();
    switch (this.selectedGroupBy) {
      case 'client':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByClient(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Client ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });


          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByClient(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Client ', this.totCaMargesDetails);
          });
        }
        break;
      case 'article':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByArticle(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Article ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByArticle(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Article ', this.totCaMargesDetails);
          });
        }

        break;
      case 'fournisseur':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByFournisseur(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Fournisseur ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByFournisseur(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Fournisseur ', this.totCaMargesDetails);
          });
        }
        break;
      case 'vendeur':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByVendeur(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Vendeur ', data);
            this.analysesCaMargesDetails =  data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByVendeur(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Vendeur ', this.totCaMargesDetails);
          });
        }
        break;
      case 'famille':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByFamille(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Famille ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByFamille(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Famille ', this.totCaMargesDetails);
          });
        }


         break;
      case 'sousFamille':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsBySousFamille(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa SousFamille ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsBySousFamille(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa SousFamille ', this.totCaMargesDetails);
          });
        }
        break;
      case 'zone':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByZone(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Zone ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByZone(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Zone ', this.totCaMargesDetails);
          });
        }







        break;
      case 'activite':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsBySecteur(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Secteur ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsBySecteur(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Zone ', this.totCaMargesDetails);
          });
        }



        break;
      case 'represan':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByRepresant(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Represant ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByRepresant(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Represant ', this.totCaMargesDetails);
          });
        }

        break;
      case 'groupe':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByGroupe(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Groupe ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByGroupe(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Groupe ', this.totCaMargesDetails);
          });
        }



        break;
      case 'classe':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByMag(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa Mag ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });

          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByMag(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa Mag ', this.totCaMargesDetails);
          });
        }
        break;
      case 'revCons':
        await this.viewMouve2Service.getAnalysesCaMargesDetailsByTypeComm(
          this.dadteD,
          this.dadteF,
          this.codeClient,
          this.codeVendeur,
          this.codeArticle,
          this.codeFournisseur,
          this.codeFamille,
          this.codeSFamille,
          this.codeZone,
          this.codeActivite,
          this.codeRepresentant,
          this.codeTypolClient,
          this.codeTypecomm,
          this.codeGroupe,
          cod
        )
          .toPromise()
          .then((data) => {
            console.log('analysesCaMargesDetails dataaa TypeComm ', data);
            this.analysesCaMargesDetails =
              data['_embedded'].analyseCaMargesDetailses;
          });
          if (this.analysesCaMargesDetails.length > 0) {
            await this.viewMouve2Service.getTOTCaMargesDetailsByTypeComm(
              this.dadteD,
              this.dadteF,
              this.codeClient,
              this.codeVendeur,
              this.codeArticle,
              this.codeFournisseur,
              this.codeFamille,
              this.codeSFamille,
              this.codeZone,
              this.codeActivite,
              this.codeRepresentant,
              this.codeTypolClient,
              this.codeTypecomm,
              this.codeGroupe,
              cod
            )
              .toPromise()
              .then((data) => {
                this.totCaMargesDetails = data['_embedded'].totMvtCaMargeses;
                console.log('TOT CaMargesDetails dataaa TypeComm ', this.totCaMargesDetails);
          });
        }
        break;
      default:
        console.log('error');
    }

  }

  async rowSelected(e) {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.cod = selected.cod;
      console.log('selected item grid ', this.cod);
    }
  }
  async afficherDetails() {

   this.analysesCaMargesDetails = new Array();
   this.totCaMargesDetails = new Array();

   this. totauxDetails = {
    valAchat: '0.000',
    valVenteVendeur: '0.000',
    mtRemise: '0.000',
    valVenteRemise: '0.000',
    valMarge: '0.000',
    valVenteReelle: '0.000',
    pourcCorrespondA: '0.000',
    correspondA: '0.000',
  };
   console.log('selectedYear   ', this.selectedYear );
   this.showDetailss = true;

      if (this.selectedYear === this.anneeCourante) {
        await this.afficherDetailsAnneCourante(this.cod);
   } else {
     if (this.selectedYear === this.annee1) {
          await this.afficherDetailsAnne_1(this.cod);
     } else {
       await this.afficherDetailsAnne_2(this.cod);
     }
    }
     if (this.totCaMargesDetails.length > 0) {
               this.totauxDetails.valAchat = Number( this.totCaMargesDetails[0].va).toFixed(3);
               this.totauxDetails.valVenteVendeur = Number(this.totCaMargesDetails[0].canr).toFixed(3);
               this.totauxDetails.mtRemise = Number(this.totCaMargesDetails[0].mtr).toFixed(3);
               // tslint:disable-next-line:max-line-length
               this.totauxDetails.valVenteRemise = Number(Number(this.totCaMargesDetails[0].canr) - Number(this.totCaMargesDetails[0].mtr)).toFixed(3);
               // 7
               ////////////// a verifier
             // tslint:disable-next-line:max-line-length
              this.totauxDetails.valMarge = Number(Number(this.totCaMargesDetails[0].canr) - Number(this.totCaMargesDetails[0].mtr) - Number( this.totCaMargesDetails[0].va)).toFixed(3);
               // 6
               if (Number(this.totCaMargesDetails[0].canr) !== 0) {
                // tslint:disable-next-line:max-line-length
                this.totauxDetails.pourcCorrespondA = Number(Number(this.totCaMargesDetails[0].mtr) / Number(this.totCaMargesDetails[0].canr) * 100).toFixed(3);
               } else {
                this.totauxDetails.pourcCorrespondA = 'NON DEF';
               }
         if ( Number( this.totCaMargesDetails[0].va) !== 0) {
              this.totauxDetails.correspondA = Number(( Number(this.totCaMargesDetails[0].canr) - Number(this.totCaMargesDetails[0].mtr)
                                               // tslint:disable-next-line:max-line-length
                                               - Number( this.totCaMargesDetails[0].va) ) / (Number( this.totCaMargesDetails[0].va)) * 100).toFixed(3);

            } else {
              this.totauxDetails.correspondA = 'NON DEF';
            }

            this.totauxDetails.valVenteReelle = Number(this.totCaMargesDetails[0].cava).toFixed(3);

              }



      console.log(' this.totauxDetails  ',  this.totauxDetails);

      this.showDetails = true;
      this.buttonInitialiserVisible = true;


  }

 async exportExcelTout(e) {
 // this.showDetailss = true;
  this.wasInside = true;

if (this.hiddenBtnAfficher) {
  this.analysesCaMarges.sort(function (ligne1, ligne2) {
    if (ligne1.id < ligne2.id) {
      return 1;
    }
      return -1;
  });

  const exportExcel = this.analysesCaMarges.map(obj => {
    return {
      'CODE': obj.cod,
      'DESIGNATION': obj.des,
      'CHIFFRE D\'AFFAIRES': obj.ca,
      'VALEUR A L\'ACHAT': obj.va,
      'MARGES': obj.mrg,
      'PART': obj.id,

    };
  });
  this.excelService.exportAsExcelFile(
    exportExcel,
   'analyses Ca Marges  ' + new Date().toLocaleDateString('en-GB')

  );

} else {
  console.log('selectedYear   ', this.selectedYear);
  console.log('dadteD   ', this.dateDebut);
  console.log('dadtef   ', this.dateFin);
  this.analysesCaMarges = new Array();
  // this. buttonInitialiserVisible = true;
 // this.hiddenBtnAfficher = false;
 // this.disabledCriteres = false;
   if (this.selectedYear === this.anneeCourante) {
        await this.afficherAnneCourante();
   } else {
     if (this.selectedYear === this.annee1) {
          await this.afficherAnne_1();

     } else {
       await this.afficherAnne_2();
     }
   }
   if (this.analysesCaMarges.length === 0 ) {

     this.msg = 'Aucun evenement avec ces critères !  ';
     this.op.show(e);

   } else {
     this.sumCa  = 0;
     for (const obj of this.analysesCaMarges ) {
       obj.mrg = Number(obj.mrg);
       obj.va = Number(obj.va);
       obj.ca = Number(obj.ca);
       this.sumCa = this.sumCa +  Number(obj.ca);
     }

     for (const obj of this.analysesCaMarges) {
       const moy  = (Number(obj.ca) / Number(this.sumCa) ) * 100;
         obj.id = moy;
     }
     this.analysesCaMarges.sort(function (ligne1, ligne2) {
       if (ligne1.id < ligne2.id) {
         return 1;
       }
         return -1;
     });

     const exportExcel = this.analysesCaMarges.map(obj => {
           return {
             'CODE': obj.cod,
             'DESIGNATION': obj.des,
             'CHIFFRE D\'AFFAIRES': obj.ca,
             'VALEUR A L\'ACHAT': obj.va,
             'MARGES': obj.mrg,
             'PART': obj.id,

           };
         });
         this.excelService.exportAsExcelFile(
           exportExcel,
          'analyses Ca Marges  ' + new Date().toLocaleDateString('en-GB')

         );



       }
}




  }



  exportExcel() {
      if (this.analysesCaMargesDetails.length > 0) {
        this.gridDetail.excelExport();
      }
  }
  afficherDuplicata() {
    if (this.selectedYear !== this.anneeCourante) {
      this.showConfirm = true;

    } else {
      this.showConfirm = false;
      const selectedRow: any = this.gridDetail.getSelectedRecords()[0];
      if (selectedRow !== null && selectedRow !== undefined) {
        console.log(String(selectedRow.combine).substr(0, 3));
        console.log(localStorage.getItem('natureDuplicata'));
        if (String(selectedRow.combine).substr(0, 3) === 'B/L') {
          localStorage.setItem('natureDuplicata', 'B/L      ');
          console.log(localStorage.getItem('natureDuplicata'));
          console.log(selectedRow.combine);
          console.log(String(selectedRow.combine).substr(9, 5));
          this.Duplicata.combine = String(selectedRow.combine).substr(9, 5);
        //  this.Duplicata.nature = 'B/L      ';
          this.Duplicata.afficher();
          this.Duplicata.disableCombine = true;
          this.Duplicata.hideButtonNvlSaisie = true;
          this.displayDuplicata = true;
        }
      }
    }


  }
  fermerDetails() {
    this.showDetails = false;
    this.analysesCaMargesDetails = new Array();
    this.buttonInitialiserVisible = false;
    this.showDetailss = false;

  }
}
