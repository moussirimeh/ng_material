import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ExcelExportProperties, GridComponent, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { OverlayPanel } from 'primeng/primeng';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { ComLService } from '../services/comL.service';
import { DdevisService } from '../services/ddevis.service';
import { EdevisService } from '../services/edevis.service';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { Groupe } from '../services/groupe';
import { GroupeService } from '../services/groupe.service';
import { MouveService } from '../services/mouve.service';
import { Represan } from '../services/represan';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { RepresanService } from '../services/represan.service';
import { SatisfactionService } from '../services/satisfaction.service';
import { Secteur } from '../services/secteur';
import { SecteurService } from '../services/secteur.service';
import { StockService } from '../services/stock.service';
import { Vendeur1 } from '../services/vendeur1';
import { Vendeur1Service } from '../services/vendeur1.service';
import { Zone } from '../services/zone';
import { ZoneService } from '../services/zone.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../services/excel.service';
import * as jspdf from 'jspdf';
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
  selector: 'app-etat-offre-envoye',
  templateUrl: './etat-offre-envoye.component.html',
  styleUrls: ['./etat-offre-envoye.component.scss'],
  providers: [DatePipe , ExcelService],
})
export class EtatOffreEnvoyeComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('grid2')
  public grid2: GridComponent;
  public searchOptions: SearchSettingsModel;
  datedeb = new Date();
  datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  fichClientBtnObserv = false ;
  datefin = new Date ();
  minDate = new Date (2010 , 0, 1 );
  public toolbarOptions: ToolbarItems[];
  readonly: boolean ;
  @Input() fromOutside = false ;
  tn: any;
  msg: string ;
  operateur = '<=';
  operateur1 = '>=';
  btnfichstk = false ;
  Vendeurs: any ;
  showObserv = false ;
  observation: string ;
  dbclickgrid1: boolean ;
  showGrid3: boolean ;
  tOTALSTF: any;
  nbroffre: any;
  stock = 'sup' ;
  SelectedVendeurs: any ;
  SelectedClients: any  ;
  SelectedConsRev: any ;
  montantsup: string ;
  montantinf: string ;
  codeclient: string ;
  codearticle: string ;
  codefour: string ;
  clients: any;
  SelectedFournisseur: any ;
  Selectedgroupe: any ;
  SelectedActivite: any ;
  SelectedZones: any ;
  listeArticles: any;
  SelectedArticles: any ;
  listeZones: any;
  listefournisseurs: any;
  listegroupe: any;
  SelectedRepresan: any ;
  listeActivite: any;
  listeRepresan: any;
  Selectedtypologie: any ;

  typologieItems = [
    { id: 0, deno: 'N' },
    { id: 1, deno: 'M' },
    { id: 2, deno: 'S' },
    { id: 3, deno: 'C' },
    { id: 4, deno: 'P' },
    { id: 5, deno: 'I' },
  ];
  ConsRevItems = [
    { id: 0, deno: 'C' },
    { id: 1, deno: 'R' },
  ];
  listeClientBycode: any;
  listearticleBycode: any;
  listefourBycode: any;
  listeOffenv = new Array();
  btnaff = false;
  showbtnRadio: boolean;
  showdialog: boolean;
  disabledbtn: boolean;
  showgrid2: boolean;
  selectedoffre: any;
  listeDetail: any;
  showTotaux: boolean;
  tOTALTTC: any;
  Soit: any;
  updateAgenda: any[];
  wasInside: any;
  devis: string;
  listeoffrByNum: any;
  btnaffStk: boolean;
  selectedDetail: any;
  selectedGrid3: any;
  listeGrid3: any;
  listeArticleNonStf: any ;
  ArticleNonSTF: {numDevis: string ; code: string ; design: string ; qtstk: string ; qtdevis: string ; qtstf: string ; reste: string} ;
  Arrayoffenv: { agenda: string ; cltDev: string ; dateEnvoi: string ; datedev: string ;
    deno: string ; mtsatisfTtc: string ; net: string ; numDevis: string ; pc: string ; ref: string ;
    representant: string  ; vndDeno: string ; };
  data: any[];
  sizeListe: number;
  listComl: any ;
  listeMouvewithDateStf: any;
  listeDdevisInEdevis: any;
  qtmv: number;
  qtdist: number;
  qtstf: number;
  selectedRef: any;
  codeArtcl: any;
  articles: any;
  btnselected = false ;
  societe: string;
  codevendeur: any;
  coderepres: any;
  label: string;
  Formshowyes = true ;
  findrowIndex: number;
  constructor(
    private vendeurService: Vendeur1Service ,
    private config: NgSelectConfig ,
    private clientService: ClientService ,
    private stockService: StockService ,
    private zoneService: ZoneService ,
    private fournisseurService: FournisseurService ,
    private groupeService: GroupeService ,
    private secteurService: SecteurService ,
    private represanService: RepresanService ,
    private edevisService: EdevisService ,
    private ddvisService: DdevisService,
    private satisfactionService: SatisfactionService,
    private comLService: ComLService,
    private mouveService: MouveService ,
    private datePipe: DatePipe,
    private excelService: ExcelService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
    this.showGrid3 = false ;
    this.btnaffStk = false ;
    this.showdialog = false ;

  }
   ngOnInit() {
     console.log('oniniiiiiiiiiit');
     if (this.Formshowyes === true ) {
      this.FormShow();
     }

    this.articles = new Array() ;
    this.disabledbtn = false ;
    this.toolbarOptions = ['ExcelExport'];
    this.showgrid2 = false ;
    this.showGrid3 = false ;
    this.codearticle = '';
    this.devis = '';
    this.codeclient = '';
    this.SelectedVendeurs = '' ;
    this.codevendeur = '' ;
    this.codefour = '';
    this.SelectedZones = '' ;
    this.SelectedActivite = '';
    this.Selectedgroupe = '' ;
    this.SelectedRepresan = '';
    this.coderepres = '' ;
    this.Selectedtypologie = '' ;
    this.SelectedConsRev = '' ;
    this.montantinf = '' ;
    this.montantsup = '' ;
    this.Vendeurs = new Array ();
    this.clients = new Array();
    this.listeZones = new Array() ;
    this.listeArticles = new Array() ;
    this.listeActivite = new Array() ;
    this.listeRepresan = new Array() ;
    this.listegroupe = new Array() ;
    this.listefournisseurs = new Array() ;

    this.tn = {
      firstDayOfWeek: 1,
      dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
      ],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ],
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
        'Decembre'
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
        'Dec'
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy'
    };
  }

  async chargerVendeur() {
   if ( this.Vendeurs.length === 0 ) {
     await this.vendeurService
     .getVendeur1ByDeno()
     .toPromise()
     .then(data => {
      this.Vendeurs = data['_embedded'].vendeur1 ;
      console.log('listevendeur = ' , this.Vendeurs);
     });
    }
  }
  changeVendeurs() {
    console.log('selectedvendeur =', this.SelectedVendeurs);

    if (this.SelectedVendeurs !== null && this.SelectedVendeurs !== undefined) {
     this.codevendeur = this.SelectedVendeurs.code ;
     console.log('code vendeur =',  this.codevendeur );
    } else { this.codevendeur = '' ; }
  }
  public onSearchVendeurs(word: string, item: Vendeur1): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async chargerClient() {
    if ( this.clients.length === 0 ) {
      await this.clientService
      .getClientsListByOrderByDeno()
      .toPromise()
      .then( data => {
        this.clients = data['_embedded'].clients ;
        console.log('listeclient = ', this.clients);

      }) ;
    }
  }
  changeClients() {
    console.log('selectedclient =', this.SelectedClients);

    if (this.SelectedClients !== null && this.SelectedClients !== undefined) {
     this.codeclient = this.SelectedClients.code ;
     console.log('code client ' , this.codeclient );

    } else { this.codeclient = '' ; }
  }
  public onSearchClients(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  changeArticle() {
    if (this.SelectedArticles !== null && this.SelectedArticles !== undefined) {
      this.codearticle = this.SelectedArticles.code;
    } else {
      this.codearticle = '';
    }
  }

  async rechArticle(mot) {
    //  this.listeStocks = new Array();
    console.log('mot', mot);
    await this.stockService
      .getStockByCode(mot)
      .toPromise()
      .then((data) => {
        this.articles = data['_embedded'].stocks;
        console.log('liste stock ', this.articles);
      });
  }


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

  changeZones() {}
  public onSearchZones(word: string, item: Zone): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
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

  changeFournisseur() {
    if (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined) {
      this.codefour = this.SelectedFournisseur ;
     } else { this.codefour = '' ; }
  }
  public onSearchfournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

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

  changeGroupe() {}
  public onSearchGroupe(word: string, item: Groupe): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

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
  changeActivite() {}
  public onSearchActivite(word: string, item: Secteur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

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

  changeRepresan() {
    console.log('selected repres ', this.SelectedRepresan);
    if (this.SelectedRepresan !== null && this.SelectedRepresan !== undefined) {
      this.coderepres = this.SelectedRepresan.code ;
     } else { this.coderepres = '' ; }

  }
  public onSearchRepresan(word: string, item: Represan): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  rowSelected() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedoffre = selected;
      this.btnselected = true ;
      console.log('selectedoffre************', this.selectedoffre);

    }
  }
  rowSelected2() {
    if (this.grid2.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid2.getSelectedRecords()[0];
      this.selectedDetail = selected;
      console.log('selectedDetail************', this.selectedDetail);

    }
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.selectedoffre = new Array() ;
      this.btnselected = false ;
      this.showObserv = false ;
      this.observation = '' ;
    }
  }
  annulerSelection2(): void {
    if (this.grid2.getSelectedRowIndexes()[0] >= 0) {
      this.grid2.selectRows([]);
      this.selectedDetail = new Array() ;
    }
  }
  async voirdetail() {

    await this.ddvisService
    .findByCombineOrderByRang(this.selectedoffre.numDevis)
    .toPromise()
    .then((data) => {
     this.listeDetail = data['_embedded'].ddevis ;
     console.log('listeDetail ****', this.listeDetail);

    });
    this.showgrid2 = true ;
    // selectedoffre
    if (this.listeOffenv.length > 0) {
      this.findrowIndex = this.listeOffenv.findIndex((el) => el.numDevis === this.selectedoffre.numDevis);
      console.log('index******' , this.findrowIndex) ;
      // this.grid.selectRows([findrowIndex]);
    }

  }
  async RechercheClient(e) {
    console.log('okkkk');

    await this.clientService
    .getClientByCode(this.codeclient)
    .toPromise()
    .then((data) => {
      this.clients = data['_embedded'].clients ;
      this.listeClientBycode = data['_embedded'].clients ;
      console.log(this.listeClientBycode);
    });
    if ( this.listeClientBycode.length !== 0) {
      console.log('deno client : ', this.listeClientBycode[0].deno);
      this.codeclient = this.listeClientBycode[0].code;
      console.log('selected client =', this.SelectedClients);

    } else {
      this.msg = 'Client est Inexistant!';
      this.op.show(e, document.getElementById('inputclient'));
    }
  }
  async RechercheArticle(e) {
    console.log('okkkk');

    await this.stockService
    .getStock(this.codearticle)
    .toPromise()
    .then((data) => {
      this.articles = data['_embedded'].stocks;
      this.listearticleBycode = data['_embedded'].stocks;
      console.log(this.listearticleBycode);
    });
    if ( this.listearticleBycode.length !== 0) {
      console.log('design article : ', this.listearticleBycode[0].design);
      this.SelectedArticles = this.listearticleBycode[0].design;
      console.log('selected article =', this.SelectedArticles);

    } else {
      this.msg = 'Article est Inexistant!';
      this.op.show(e, document.getElementById('inputarticle'));
    }
  }
  async RechercheFour(e) {
    console.log('okkkk');

    await this.fournisseurService
    .  getFourByCode(this.codefour)
    .toPromise()
    .then((data) => {
      this.listefournisseurs = data['_embedded'].fournisseurs;
      this.listefourBycode = data['_embedded'].fournisseurs;
      console.log(this.listefourBycode);
    });
    if ( this.listefourBycode.length !== 0) {
      console.log('deno four : ', this.listefourBycode[0].deno);
      this.SelectedFournisseur = this.listefourBycode[0].code;
      console.log('selected four =', this.SelectedFournisseur);

    } else {
      this.msg = 'Fournisseur est Inexistant!';
      this.op.show(e, document.getElementById('inputfour'));
    }
  }
  async Afficher(e) {
    if (this.fromOutside === true ) {
      console.log('okkkkkkkkkkkkkkk');
      this.datedebut = new Date();
      this.datedebut.setDate(this.datedebut.getDate() - 740 ) ;
    }
     console.log('Article = ', this.SelectedArticles === '');
     console.log('codeArticle****** = ', this.codearticle);
     console.log('Article****** = ', this.SelectedArticles );
    if (this.SelectedArticles !== null && this.SelectedArticles !== undefined && this.SelectedArticles !== '') {
      console.log(this.datedebut.toLocaleDateString('en-GB')
      , this.datefin.toLocaleDateString('en-GB'), +'art' + this.codearticle, +'dev' + this.devis, +'clt' + this.codeclient, +'vend' +
       this.codevendeur, +'four ' + this.codefour, +'zone' + this.SelectedZones, +'act' + this.SelectedActivite
      , + 'grp' +  this.Selectedgroupe, +'rep' + this.coderepres, +'typ' + this.Selectedtypologie, +'consrev' +
      this.SelectedConsRev, +'mntsup' + this.montantsup , +'mntinf' + this.montantinf);

      await this.edevisService
      .getListOffreEnvoyewitharticleTop100(this.datedebut.toLocaleDateString('en-GB')
      , this.datefin.toLocaleDateString('en-GB'), this.codearticle, this.devis, this.codeclient , this.codevendeur,
      this.codefour, this.SelectedZones, this.SelectedActivite
      , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
      this.SelectedConsRev, this.montantsup , this.montantinf)
      .toPromise()
      .then((data) => {
        this.data = data;
        console.log('liste offre avec article ' , this.data);
        this.listeOffenv = new Array();
        for ( let i = 0 ; i < this.data.length; i++) {
          const obj = data[i];
          this.Arrayoffenv = {agenda: '', cltDev: '', dateEnvoi: '', datedev: '', deno: '', mtsatisfTtc: '',
          net: '', numDevis: '', pc: '', ref: '', representant: '', vndDeno: ''};
          this.Arrayoffenv.numDevis = obj[0];
          const datedev: string = this.datePipe.transform(obj[1], 'dd/MM/yyyy');
          this.Arrayoffenv.datedev = datedev;
          this.Arrayoffenv.vndDeno = obj[2];
          this.Arrayoffenv.ref = obj[3];
          this.Arrayoffenv.deno = obj[4];
          this.Arrayoffenv.cltDev = obj[5];
          this.Arrayoffenv.net = Number(obj[6]).toFixed(3);
          const dateenv: string = this.datePipe.transform(obj[7], 'dd/MM/yyyy');
          this.Arrayoffenv.dateEnvoi = dateenv;
          this.Arrayoffenv.mtsatisfTtc = Number(obj[8]).toFixed(3);
          this.Arrayoffenv.pc = Number((obj[9]) * 100).toFixed(2);
          this.Arrayoffenv.agenda = obj[10];
          this.Arrayoffenv.representant = obj[11];
          this.listeOffenv.push(this.Arrayoffenv) ;
         }
      });
    } else {
      console.log(this.datedebut.toLocaleDateString('en-GB')
      , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient , this.codevendeur,
      this.codefour, this.SelectedZones, this.SelectedActivite
      , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
      this.SelectedConsRev, this.montantsup , this.montantinf);
      await this.edevisService
      .getListOffreEnvoyewithoutarticleTop100(this.datedebut.toLocaleDateString('en-GB')
      , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
      this.codefour, this.SelectedZones, this.SelectedActivite
      , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
      this.SelectedConsRev , this.montantsup , this.montantinf)
      .toPromise()
      .then((data) => {
        this.data = data;

        console.log('liste offre sans article ' , this.data);
        this.listeOffenv = new Array();
        for ( let i = 0 ; i < this.data.length; i++) {
          const obj = data[i];
          this.Arrayoffenv = {agenda: '', cltDev: '', dateEnvoi: '', datedev: '', deno: '', mtsatisfTtc: '',
          net: '', numDevis: '', pc: '', ref: '', representant: '', vndDeno: ''};
          this.Arrayoffenv.numDevis = obj[0];
          const datedev: string = this.datePipe.transform(obj[1], 'dd/MM/yyyy');
          this.Arrayoffenv.datedev = datedev;
          this.Arrayoffenv.vndDeno = obj[2];
          this.Arrayoffenv.ref = obj[3];
          this.Arrayoffenv.deno = obj[4];
          this.Arrayoffenv.cltDev = obj[5];
          this.Arrayoffenv.net = Number(obj[6]).toFixed(3);
          const dateenv: string = this.datePipe.transform(obj[7], 'dd/MM/yyyy');
          this.Arrayoffenv.dateEnvoi = dateenv;
          this.Arrayoffenv.mtsatisfTtc = Number(obj[8]).toFixed(3);
          this.Arrayoffenv.pc = Number((obj[9]) * 100).toFixed(2);
          this.Arrayoffenv.agenda = obj[10];
          this.Arrayoffenv.representant = obj[11];
          this.listeOffenv.push(this.Arrayoffenv) ;
         }
      });
    }
    if (this.listeOffenv.length !== 0) {
      if (this.listeOffenv.length === 500) {
       this.label = ' Voici les 500 premières lignes ' ;
       this.btnaff = true ;
        this.disabledbtn = true ;
        this.readonly = true ;
      } else {
        this.btnaff = true ;
        this.disabledbtn = true ;
        this.readonly = true ;
      }
    } else {
      this.showdialog = true ;
    }
  }

  NouvelleListe() {
    this.readonly = false;
    this.disabledbtn = false ;
    this.showbtnRadio = false ;
    this.btnaff = false ;
    this.listeOffenv = new Array() ;
    this.label = '' ;
    this.Initialiser();
  }
  FermerDialog() {
    this.disabledbtn = false ;
    this.showbtnRadio = true ;
    this.showdialog = false ;
    this.Initialiser();
  }

  Initialiser() {
    this.readonly = false;
    this.stock = 'sup' ;
    this.showTotaux = false ;
    this.btnaffStk = false ;
    this.showGrid3 = false ;
    this.showgrid2 = false ;
    this.datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
    this.datefin = new Date ();
    this.codearticle = '';
    this.devis = '';
    this.codeclient = '';
    this.SelectedClients = '' ;
    this.SelectedArticles = '' ;
    this.SelectedFournisseur = '';
    this.SelectedVendeurs = '' ;
    this.codevendeur = '' ;
    this.codefour = '';
    this.SelectedZones = '' ;
    this.SelectedActivite = '';
    this.Selectedgroupe = '' ;
    this.SelectedRepresan = '';
    this.coderepres = '' ;
    this.Selectedtypologie = '' ;
    this.SelectedConsRev = '' ;
    this.montantinf = '1000000' ;
    this.montantsup = '0' ;
    this.tOTALTTC = '';
    this.nbroffre = '';
    this.tOTALSTF = '';
    this.Soit = '';
    /*this.Vendeurs = new Array ();
    this.clients = new Array();
    this.listeZones = new Array() ;
    this.listeArticles = new Array() ;
    this.listeActivite = new Array() ;
    this.listeRepresan = new Array() ;
    this.listegroupe = new Array() ;
    this.listefournisseurs = new Array() ;
    this.articles = new Array() ; */

  }
  async AfficherTotaux() {
    if (this.SelectedArticles !== null && this.SelectedArticles !== undefined && this.SelectedArticles !== '') {
      console.log(this.datedebut.toLocaleDateString('en-GB')
      , this.datefin.toLocaleDateString('en-GB'), +'art' + this.codearticle, +'dev' + this.devis, +'clt' + this.codeclient, +'vend' +
       this.codevendeur, +'four ' + this.codefour, +'zone' + this.SelectedZones, +'act' + this.SelectedActivite
      , + 'grp' +  this.Selectedgroupe, +'rep' + this.coderepres, +'typ' + this.Selectedtypologie, +'consrev' +
      this.SelectedConsRev, +'mntsup' + this.montantsup , +'mntinf' + this.montantinf);

      await this.edevisService
      .getTotauxOffreEnvoyewitharticle(this.datedebut.toLocaleDateString('en-GB')
      , this.datefin.toLocaleDateString('en-GB'), this.codearticle, this.devis, this.codeclient , this.codevendeur,
      this.codefour, this.SelectedZones, this.SelectedActivite
      , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
      this.SelectedConsRev, this.montantsup , this.montantinf)
      .toPromise()
      .then((data) => {
        this.data = data;
        console.log('liste totaux avec article ' , this.data);
      });
    } else {
      console.log(this.datedebut.toLocaleDateString('en-GB')
      , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient , this.codevendeur,
      this.codefour, this.SelectedZones, this.SelectedActivite
      , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
      this.SelectedConsRev, this.montantsup , this.montantinf);
      await this.edevisService
      .getTotauxOffreEnvoyewithoutarticle(this.datedebut.toLocaleDateString('en-GB')
      , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
      this.codefour, this.SelectedZones, this.SelectedActivite
      , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
      this.SelectedConsRev , this.montantsup , this.montantinf)
      .toPromise()
      .then((data) => {
        this.data = data;
        console.log('liste totaux sans article ' , this.data);
      });
    }
    let net = 0 ;
    /*let mtsatisttc = 0 ;
    let net = 0 ;
    let i ;
    for ( i = 0 ; i < this.data.length ; i++ ) {
     if (this.listeOffenv[i].mtsatisfTtc !== null && this.listeOffenv[i].mtsatisfTtc !== undefined
       && this.listeOffenv[i].mtsatisfTtc !== '0.000' ) {
       mtsatisttc = mtsatisttc + parseFloat(this.listeOffenv[i].mtsatisfTtc) ;
      }
     if (this.listeOffenv[i].net !== null && this.listeOffenv[i].net !== undefined
      && this.listeOffenv[i].net !== '0.000' ) {
        net = net + parseFloat(this.listeOffenv[i].net) ;
      }
    }*/
    this.tOTALTTC =  Number(this.data[0][1]).toFixed(3);
    this.tOTALSTF =   Number(this.data[0][2]).toFixed(3) ;
    this.nbroffre = this.data[0][0] + ' offres';
    net = this.data[0][3];
    this.Soit = (100 * this.tOTALSTF /  this.tOTALTTC).toFixed(3) + '%' ;
    this.showTotaux = true ;
  }
  async EnregistrerObsrv(e) {
    this.wasInside = true;
     if (this.selectedoffre.length !== 0 ) {
      console.log('selectedoffre lenght ', this.selectedoffre.length);

      await this.edevisService
      .updateAgenda(this.observation , this.selectedoffre.numDevis)
      .toPromise()
      .then((data) => {
        this.updateAgenda = data ;
        console.log('update trueeee', this.updateAgenda);
      });
      this.selectedoffre.agenda = this.observation ;
      this.grid.refresh();
      this.annulerSelection();

    } else {
      console.log('selectedoffre lenght est 0 ', this.selectedoffre.length);
      this.msg = 'Aucun offre selectionné !!' ;
      this.op.show(e, document.getElementById('btnvalider'));
    }

  }
  AnnulerEnregis(e) {
    this.showObserv = false ;
    this.observation = '' ;
  }
  async verifierNum(e) {
    this.wasInside = true;
    if (this.devis !== null && this.devis !== undefined ) {
      await this.edevisService
      .listeOffrebyNum(this.devis)
      .toPromise()
      .then((data) => {
        this.listeoffrByNum = data['_embedded'].edevis ;
      });
      if (this.listeoffrByNum.length === 0) {
        this.msg = 'Devis Inéxistante !' ;
        this.op.show(e, document.getElementById('numdevis')) ;
      }
    }
  }
  async AfficherArticleStk(e) {

    console.log('radiobtn ******', this.stock);
    console.log(this.codearticle, this.codefour, this.datedebut.toLocaleDateString('en-GB')
    , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
     this.SelectedZones, this.SelectedActivite
    , this.Selectedgroupe, this.coderepres, this.Selectedtypologie, this.montantsup , this.montantinf);
   if (this.stock === 'tous') {
    await this.stockService.getListArticleNonStf(this.codearticle, this.codefour, this.datedebut.toLocaleDateString('en-GB')
    , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
     this.SelectedZones, this.SelectedActivite
    , this.Selectedgroupe, this.coderepres, this.Selectedtypologie, this.montantsup , this.montantinf)
    .toPromise()
    .then((data) => {
      this.data = data ;
    });
      this.sizeListe = this.data.length ;
      console.log('size liste ***', this.sizeListe);

   } else if (this.stock === 'sup') {
    await this.stockService.getListArticleNonStfSupZero(this.codearticle, this.codefour, this.datedebut.toLocaleDateString('en-GB')
    , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
     this.SelectedZones, this.SelectedActivite
    , this.Selectedgroupe, this.coderepres, this.Selectedtypologie, this.montantsup , this.montantinf)
    .toPromise()
    .then((data) => {
      this.data = data ;
    });
    this.sizeListe = this.data.length ;
      console.log('size liste ***', this.sizeListe);
      console.log(this.codearticle, this.codefour, this.datedebut.toLocaleDateString('en-GB')
      , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
       this.SelectedZones, this.SelectedActivite
      , this.Selectedgroupe, this.coderepres, this.Selectedtypologie, this.montantsup , this.montantinf);

   } else if (this.stock === 'egal') {
    await this.stockService.getListArticleNonStfEgalZero(this.codearticle, this.codefour, this.datedebut.toLocaleDateString('en-GB')
    , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
     this.SelectedZones, this.SelectedActivite
    , this.Selectedgroupe, this.coderepres, this.Selectedtypologie, this.montantsup , this.montantinf)
    .toPromise()
    .then((data) => {
      this.data = data ;
    });
    this.sizeListe = this.data.length;
      console.log('size liste ***', this.sizeListe);
   }
   console.log('data ****', this.data);

    this.listeArticleNonStf = new Array();
    if (this.sizeListe < 300) {
      for (let i = 0 ; i < this.data.length ; i++) {
        this.ArticleNonSTF = {numDevis: '' , code: '' , design: '', qtstk: '', qtdevis: '', qtstf: '', reste: ''} ;
        const obj = this.data[i];
       this.ArticleNonSTF.numDevis = obj[0] ;
       this.ArticleNonSTF.code = obj[1] ;
       this.ArticleNonSTF.design = obj[2] ;
       this.ArticleNonSTF.qtstk = obj[3] ;
       this.ArticleNonSTF.qtdevis = obj[4] ;
       this.ArticleNonSTF.qtstf = obj[5] ;
       this.ArticleNonSTF.reste = obj[6] ;
       this.listeArticleNonStf.push(this.ArticleNonSTF);
      }

      console.log('listeArticleNonSTF*****', this.listeArticleNonStf);
      this.btnaffStk = true;
    } else {
      this.msg = 'veuillez raffiner les critéres de recherche !';
      this.op.show(e, document.getElementById('btnAff2')) ;
    }


  }
  VoirListe() {
    this.btnaffStk = false ;
    this.showGrid3 = false ;
    this.showgrid2 = false ;
    this.listeDetail = new Array();
    setTimeout(() => {
      this.grid.selectRows([this.findrowIndex]);
    }, 100);
  }
  async excelExport() {
    if (this.disabledbtn === false ) {
      if (this.SelectedArticles !== null && this.SelectedArticles !== undefined && this.SelectedArticles !== '') {
        console.log(this.datedebut.toLocaleDateString('en-GB')
        , this.datefin.toLocaleDateString('en-GB'), this.codearticle, this.devis, this.codeclient, this.codevendeur,
        this.codefour, this.SelectedZones, this.SelectedActivite
        , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
        this.SelectedConsRev, this.montantsup , this.montantinf);

        await this.edevisService
        .getListOffreEnvoyewitharticle(this.datedebut.toLocaleDateString('en-GB')
        , this.datefin.toLocaleDateString('en-GB'), this.codearticle, this.devis, this.codeclient, this.codevendeur,
        this.codefour, this.SelectedZones, this.SelectedActivite
        , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
        this.SelectedConsRev, this.montantsup , this.montantinf)
        .toPromise()
        .then((data) => {
          this.listeOffenv = data['_embedded'].etatOffreEnvoyes;
          console.log('liste offre avec article ' , this.listeOffenv);
          for ( let i = 0 ; i < this.listeOffenv.length; i++) {
            this.listeOffenv[i].mtsatisfTtc = Number(this.listeOffenv[i].mtsatisfTtc).toFixed(3);
            this.listeOffenv[i].net = Number(this.listeOffenv[i].net).toFixed(3);
            this.listeOffenv[i].pc = Number((this.listeOffenv[i].pc) * 100).toFixed(2);
           }
        });
      } else {
        console.log(this.datedebut.toLocaleDateString('en-GB')
        , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
        this.codefour, this.SelectedZones, this.SelectedActivite
        , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
        this.SelectedConsRev, this.montantsup , this.montantinf);
        await this.edevisService
        .getListOffreEnvoyewithoutarticle(this.datedebut.toLocaleDateString('en-GB')
        , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
        this.codefour, this.SelectedZones, this.SelectedActivite
        , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
        this.SelectedConsRev , this.montantsup , this.montantinf)
        .toPromise()
        .then((data) => {
          this.listeOffenv = data['_embedded'].etatOffreEnvoyes;
          console.log('veriiiiiiiif', data['_embedded'].etatOffreEnvoyes);
          console.log('liste offre sans article ' , this.listeOffenv);
          for ( let i = 0 ; i < this.listeOffenv.length; i++) {
            this.listeOffenv[i].mtsatisfTtc = Number(this.listeOffenv[i].mtsatisfTtc).toFixed(3);
            this.listeOffenv[i].net = Number(this.listeOffenv[i].net).toFixed(3);
            this.listeOffenv[i].pc = Number((this.listeOffenv[i].pc) * 100).toFixed(2);
           }
        });
      }


      try {
          let nomFich;
             nomFich = 'ListeOffreEnvoyée';
          const exportExcel = this.listeOffenv.map(obj => {
            return {
              'N°Dev': obj.numDevis,
              'Date': obj.datedev,
              'Nom Clt': obj.deno,
              'Mt TTC': obj.net,
              'MT STF TTC': obj.mtsatisfTtc,
              '%': obj.pc,
              'Vendeur': obj.vndDeno,
              'Representant': obj.representant,
              'Observation': obj.agenda,
            };
          });
          this.excelService.exportAsExcelFile(
            exportExcel,
            nomFich + ' : ' + new Date().toLocaleDateString('en-GB')
          );
      } catch {
        console.log(' methode genererExcel');
      }
    } else {
      console.log('okkkk');
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'ListeOffreEnvoyée' + ' : ' + new Date().toLocaleDateString('en-GB') + '.xlsx'
      };
      this.grid.excelExport(excelExportProperties);
    }

    console.log(this.disabledbtn === false);

  }
  async AffciherGrid3() {
    await this.satisfactionService
    .getSatisf(this.selectedoffre.numDevis, this.selectedDetail.code)
    .toPromise()
    .then((data) => {
      this.listeGrid3 = data['_embedded'].satisfactions;
      console.log('selected grid3 ***' , this.listeGrid3);

    });
    this.showGrid3 = true ;

  }


  async FormShow() {
    await this.ddvisService
    .deleteDdevisEtatOffreEnv()
    .toPromise()
    .then((data) => {
      const getDelete = data ;
      console.log('resultat delete ddevis ', getDelete);

    });

    await this.edevisService
    .deleteEdevis()
    .toPromise()
    .then((data) => {
      const getDelete = data ;
      console.log('resultat delete edevis ', getDelete);

    });
    await this.comLService
    .getComL()
    .toPromise()
    .then((data) => {
      this.listComl = data['_embedded'].comL ;
      console.log('listeComl = ' , this.listComl);

    });

    const dateStf = this.listComl[0].date_satisf ;
    console.log('dateStf =' , dateStf);
    await this.mouveService
    .getMouveWithDateSatisf()
    .toPromise()
    .then((data) => {
      this.listeMouvewithDateStf = data['_embedded'].mouves ;
      console.log('listeMouvewithDateStf =' , this.listeMouvewithDateStf);
    });

    for (let i = 0 ; i < this.listeMouvewithDateStf.length ; i++) {
      const obj = this.listeMouvewithDateStf[i];
      this.qtmv = Number(obj.quantite) - Number(obj.qtOffre) ;
       this.qtdist = 0 ;
      await this.ddvisService
      .getDdevisByeCombineCodeInEdevis(obj.code, obj.operateur, obj.date)
      .toPromise()
      .then((data) => {
        this.listeDdevisInEdevis = data['_embedded'].ddevis ;
        console.log('listeDdevisInEdevis ***', this.listeDdevisInEdevis);

      });
      for (let j = 0 ; j < this.listeDdevisInEdevis.length ; j++) {
        const obj1 = this.listeDdevisInEdevis[j] ;
        if (this.qtmv > 0 ) {
           // qt_a_satisf := query2.fieldbyname('quantite').asfloat-
           // query2.fieldbyname('qt_satisf').asfloat;
            this.qtstf = Number(obj1.quantite) - Number(obj1.qtSatisf) ;
           if (this.qtmv <= this.qtstf) {
             await this.ddvisService
             .updateQtSatisfbyrang((Number(obj1.qtSatisf) + this.qtmv).toFixed(3), obj1.combine, obj.code, obj1.rang)
             .toPromise()
             .then((data) => {
               console.log(data);
             });

             const satisf = {
              id: null,
              sDevis: obj1.combine,
              sCombine: obj.combine,
              sCode: obj.code,
              sQuantite: this.qtmv,
              sDate: obj.date,
             };
             await this.satisfactionService
              .createSatisfaction(satisf)
              .subscribe((data) => {
                console.log('create satisf ', data);
              });
               const mntstf = Number(obj1.prix) * (100 - Number(obj1.tRemise)) / 100 * (100 + Number(obj1.tauxTva)) / 100 * this.qtmv ;
              await this.edevisService
              .updateNumero(String(mntstf) , obj1.combine)
              .toPromise()
              .then((data) => {
                console.log('update edevis ', data);

              });

              this.qtdist = this.qtdist + this.qtmv ;
              this.qtmv = 0 ;
           } else {
             await this.ddvisService
             .updateQtSatisfbyrang((Number(obj1.qtSatisf) + this.qtstf).toFixed(3), obj1.combine, obj.code, obj1.rang)
             .toPromise()
             .then((data) => {
              console.log(data);
             });

             const satisf = {
              id: null,
              sDevis: obj1.combine,
              sCombine: obj.combine,
              sCode: obj.code,
              sQuantite: this.qtstf,
              sDate: obj.date,
             };
             await this.satisfactionService
              .createSatisfaction(satisf)
              .subscribe((data) => {
                console.log('create satisf ', data);
              });

              const mntstf = Number(obj1.prix) * (100 - Number(obj1.tRemise)) / 100 * (100 + Number(obj1.tauxTva)) / 100 * this.qtstf ;
              await this.edevisService
              .updateNumero(String(mntstf) , obj1.combine)
              .toPromise()
              .then((data) => {
                console.log('update edevis ', data);

              });

              this.qtmv = this.qtmv - this.qtstf ;
              this.qtdist = this.qtdist + this.qtstf ;
           }
        }

      }

      if (this.qtdist > 0) {
        await this.mouveService
        .updateQtoffre((Number(obj.qtOffre) + this.qtdist).toFixed(3), obj.combine, obj.code)
        .toPromise()
        .then((data) => {
          console.log('updateMouve', data);
        });
      }


    }

    await this.comLService
    .updateDateStf()
    .toPromise()
    .then((data) => {
      console.log('update compl', data );
    });



  }
  deleteliste() {
    console.log('okkkk');
    this.SelectedArticles = '';
    this.articles = new Array() ;
  }



  async Apercu() {
    if (this.disabledbtn === false ) {
      this.AfficherTotaux();
      if (this.SelectedArticles !== null && this.SelectedArticles !== undefined && this.SelectedArticles !== '') {
        console.log(this.datedebut.toLocaleDateString('en-GB')
        , this.datefin.toLocaleDateString('en-GB'), this.codearticle, this.devis, this.codeclient, this.codevendeur,
        this.codefour, this.SelectedZones, this.SelectedActivite
        , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
        this.SelectedConsRev, this.montantsup , this.montantinf);

        await this.edevisService
        .getListOffreEnvoyewitharticle(this.datedebut.toLocaleDateString('en-GB')
        , this.datefin.toLocaleDateString('en-GB'), this.codearticle, this.devis, this.codeclient, this.codevendeur,
        this.codefour, this.SelectedZones, this.SelectedActivite
        , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
        this.SelectedConsRev, this.montantsup , this.montantinf)
        .toPromise()
        .then((data) => {
          this.listeOffenv = data['_embedded'].etatOffreEnvoyes;
          console.log('liste offre avec article ' , this.listeOffenv);
          for ( let i = 0 ; i < this.listeOffenv.length; i++) {
            this.listeOffenv[i].mtsatisfTtc = Number(this.listeOffenv[i].mtsatisfTtc).toFixed(3);
            this.listeOffenv[i].net = Number(this.listeOffenv[i].net).toFixed(3);
            this.listeOffenv[i].pc = Number((this.listeOffenv[i].pc) * 100).toFixed(2);
           }
        });
      } else {
        console.log(this.datedebut.toLocaleDateString('en-GB')
        , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
        this.codefour, this.SelectedZones, this.SelectedActivite
        , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
        this.SelectedConsRev, this.montantsup , this.montantinf);
        await this.edevisService
        .getListOffreEnvoyewithoutarticle(this.datedebut.toLocaleDateString('en-GB')
        , this.datefin.toLocaleDateString('en-GB'), this.devis, this.codeclient, this.codevendeur,
        this.codefour, this.SelectedZones, this.SelectedActivite
        , this.Selectedgroupe, this.coderepres, this.Selectedtypologie,
        this.SelectedConsRev , this.montantsup , this.montantinf)
        .toPromise()
        .then((data) => {
          this.listeOffenv = data['_embedded'].etatOffreEnvoyes;
          console.log('veriiiiiiiif', data['_embedded'].etatOffreEnvoyes);
          console.log('liste offre sans article ' , this.listeOffenv);
          for ( let i = 0 ; i < this.listeOffenv.length; i++) {
            this.listeOffenv[i].mtsatisfTtc = Number(this.listeOffenv[i].mtsatisfTtc).toFixed(3);
            this.listeOffenv[i].net = Number(this.listeOffenv[i].net).toFixed(3);
            this.listeOffenv[i].pc = Number((this.listeOffenv[i].pc) * 100).toFixed(2);
           }
        });
      }

    }
    const doc1 = new jspdf();
    let article ;
    let client ;
    let repres ;
    let vendeur ;
    doc1.setFontSize(10);
    doc1.setFontStyle('Arial');
    this.societe = globals.societe;
     doc1.text('SOCIETE..:  ' + this.societe, 9, 15);
     let temps = String(new Date().getUTCHours() + 1);
     temps = temps + ':' + String(new Date().getUTCMinutes());
     temps = temps + ':' + String(new Date().getUTCSeconds());
     console.log('datedu jour ', temps );
     const datedujour = new Date().toLocaleDateString('en-GB') ;
     doc1.text('Tunis, le : '  + datedujour + ' ' + temps , 152, 15);
     doc1.setFontSize(15);
     doc1.setFontStyle('bold');
     doc1.setTextColor(9, 4, 161);
     doc1.text('Rapport des offres envoyées', 50, 20);
     doc1.setFontStyle('Arial');
     doc1.setFontSize(10);
     doc1.setTextColor(0, 0, 0);
     doc1.text('Date début : ' + this.datedebut.toLocaleDateString('en-GB') , 9, 25);
     doc1.text('Date fin : ' + this.datefin.toLocaleDateString('en-GB') , 60, 25);
 if (this.codearticle !== null && this.codearticle !== undefined && this.codearticle !== '' ) {
      article = this.codearticle ;
    } else {
      article = 'tout';
    }
     doc1.text('Article : ' + article , 9, 30);
     if (this.SelectedVendeurs !== null && this.SelectedVendeurs  !== undefined && this.SelectedVendeurs  !== '' ) {
      vendeur = this.SelectedVendeurs.deno  ;
    } else {
      vendeur = 'tout';
    }
     doc1.text('Vendeur : ' + vendeur, 100, 30);
     if (this.SelectedRepresan !== null && this.SelectedRepresan !== undefined && this.SelectedRepresan  !== '' ) {
      repres = this.SelectedRepresan.deno  ;
    } else {
      repres = 'tout';
    }
     doc1.text('Représentant: ' + repres, 9 , 35);
     if (this.SelectedClients !== null && this.SelectedClients  !== undefined && this.SelectedClients  !== '' ) {
      client = this.SelectedClients.deno ;
    } else {
      client = 'tout';
    }
     doc1.text('Client : ' + client , 100, 35);
     doc1.text('Mt offr >= à '  + this.montantsup + 'DT  Et <= à ' + this.montantinf + 'DT' , 9 , 40);

     // entete du  tableau
     doc1.setFontStyle('Arial');
     doc1.line(1, 45, 209, 45);
     doc1.line(1, 45, 1, 287);
     doc1.line(209, 45, 209, 287);
     doc1.setFontStyle('bold');
     doc1.setTextColor(0, 0, 0);
     doc1.text('Devis', 2, 50);
     doc1.text('Date', 11, 50);
     doc1.text('Nom Clt', 25, 50);
     doc1.text('Vendeur', 87, 50);
     doc1.text('Mt offr', 144, 50, 'right');
     doc1.text('Mt stf', 157, 50, 'right');
     doc1.text('%', 165, 50, 'right');
     doc1.text('Observation', 170, 50);
     // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(1, 53, 209, 53);
     let y = 62;
     doc1.setFontStyle('Arial');
     let  numPage = 1;
    doc1.setFontSize(1);
    doc1.setFontStyle('Arial');
      for (const obj of this.listeOffenv) {
        doc1.setFontSize(8);
        doc1.setFontStyle('Arial');
        doc1.text(String(obj.numDevis), 2, y);
        doc1.text(String(obj.dateEnvoi), 11, y);
        doc1.text(String(obj.deno), 25, y);
        doc1.text(String(obj.vndDeno), 87, y);
        doc1.text(String(obj.net), 144, y, 'right');
        doc1.text(String(obj.mtsatisfTtc), 157, y, 'right');
        doc1.text(String(obj.pc), 165, y, 'right');
        doc1.text(String(obj.agenda), 170, y);
        y = y + 7;
        // passer a une nouvelle page

        if (y > 287) {
          doc1.setFontSize(10);
          doc1.line(1, 287, 209, 287);
          doc1.text('Page ' + numPage.toFixed(0), 100, 290 + 2);

          numPage++;
          doc1.addPage();
          // entete tableau

          doc1.setFontSize(10);

          // ligne vertical
          doc1.line(1, 12, 209, 12);
          doc1.line(1, 12, 1, 287);
          doc1.line(209, 12, 209, 287);
          doc1.setFontSize(10);
          doc1.setFontStyle('bold');
          doc1.text('Devis', 2, 16);
          doc1.text('Date', 11, 16);
          doc1.text('Nom Clt', 25, 16);
          doc1.text('Vendeur', 87, 16);
          doc1.text('Mt offr', 144, 16, 'right');
          doc1.text('Mt stf', 157, 16, 'right');
          doc1.text('%', 165, 16, 'right');
          doc1.text('Observation', 170, 16);
          doc1.setFontStyle('bold');
          doc1.line(1, 20, 209, 20);
           y = 24;
        }
      }
      doc1.setFontSize(10);
      doc1.setFontStyle('bold');
      doc1.text('Total TTC : ', 2, y);
      doc1.setFontSize(9);
      doc1.setFontStyle('Arial');
      doc1.text(this.tOTALTTC, 25, y);
      y = y + 7 ;
      doc1.setFontSize(10);
      doc1.setFontStyle('bold');
      doc1.text('Total STF : ', 2, y);
      doc1.setFontSize(9);
      doc1.setFontStyle('Arial');
      doc1.text(this.tOTALSTF, 25, y);
      y = y + 7 ;
      doc1.setFontSize(10);
      doc1.setFontStyle('bold');
      doc1.text('SOIT : ', 2, y);
      doc1.setFontSize(9);
      doc1.setFontStyle('Arial');
      doc1.text(this.Soit + '%', 15, y);

      doc1.line(1, 287, 209, 287);
      doc1.text('Page ' + numPage.toFixed(0), 100, 290 + 2);
    window.open(doc1.output('bloburl'), '_blank');
    console.log(this.disabledbtn === false);


  }

}
