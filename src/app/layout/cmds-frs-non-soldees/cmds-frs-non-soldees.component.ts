import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ExcelExportProperties, GridComponent, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { CommandeService } from '../services/commande.service';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { StockService } from '../services/stock.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { NgSelectConfig } from '@ng-select/ng-select';
import { DatePipe } from '@angular/common';
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
  selector: 'app-cmds-frs-non-soldees',
  templateUrl: './cmds-frs-non-soldees.component.html',
  styleUrls: ['./cmds-frs-non-soldees.component.scss'],
  providers: [DatePipe , ExcelService],
})
export class CmdsFrsNonSoldeesComponent implements OnInit {
  public searchOptions: SearchSettingsModel;
  @ViewChild('grid1')
  public grid1: GridComponent;
  @ViewChild('grid2')
  public grid2: GridComponent;
  public toolbarOptions: ToolbarItems[];
  datedeb = new Date();
  datedebut = new Date (this.datedeb.getFullYear() - 2 , this.datedeb.getMonth(), this.datedeb.getDate());
  datefin = new Date ();
  minDate = new Date (2010 , 0, 1 );
  tn: any ;
  CmdFrsNonSoldee: {codefr: string ; four: string ; numcmd: string ;
     datcmd: string ; artcmd: string ; design: string ;
      qtecmd: string ; qtelivr: string ; diff: string ; pru: string ; total: string ; typecmd: string } ;
  numcmd: any ;
  typerech = '3' ;
  typef = 'E' ;
  articles: any;
  SelectedArticles: any;
  codearticle: string;
  listefournisseurs: any;
  SelectedFournisseur: any;
  codefour: any;
  readonly: boolean ;
  listeCmdsFrsNonSolde = new Array();
  data: any ;
  selectedCmd: any;
  listDetail: any;
  selectedDetail: any;
  btnexcel1: boolean;
  btnexcel2: boolean;
  btnaff = false ;
  listeCmdsFrsNonSoldeEXCEL = new Array();
   constructor(
     private stockService: StockService ,
     private fournisseurService: FournisseurService,
     private commandeService: CommandeService ,
     private config: NgSelectConfig ,
     private datePipe: DatePipe,
     private excelService: ExcelService
   ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
    }

  ngOnInit() {
    console.log('daaaaaaaaaaaaaaaay', this.datedeb.getDate());
    this.articles = new Array();
    this.btnexcel2 = false ;
    this.btnexcel1 = false ;
    this.toolbarOptions = ['ExcelExport'];
    // this.articles = new Array();
    this.listefournisseurs = new Array() ;
    this.SelectedFournisseur = '';
    this.listDetail = new Array() ;
    this.SelectedArticles = '' ;
    this.numcmd = '';
    this.codefour = '';
    this.codearticle = '' ;
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

  Initialiser() {
    this.btnaff = false ;
    this.readonly = false ;
    this.articles = new Array() ;
    this.btnexcel2 = false ;
    this.btnexcel1 = false ;
    // this.articles = new Array();
    this.listefournisseurs = new Array() ;
    this.SelectedFournisseur = '';
    this.SelectedArticles = '' ;
    this.numcmd = '';
    this.codefour = '';
    this.codearticle = '' ;
    this.listeCmdsFrsNonSolde = new Array();
    this.listDetail = new Array() ;
    this.datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
    this.datefin = new Date() ;
    this.typef = 'E' ;
    this.typerech = '3' ;
  }

  async rechArticle(mot) {
    this.articles = new Array();
    console.log('mot', mot);
    await this.stockService
    .getStockByCode(mot)
    .toPromise()
    .then((data) => {
      this.articles = data['_embedded'].stocks;
      console.log('liste stock ', this.articles);
    });
  }

  changeArticle() {
    if (this.SelectedArticles !== null && this.SelectedArticles !== undefined) {
      this.codearticle = this.SelectedArticles.code;
      console.log('stk ****' ,  this.SelectedArticles );

    } else {
      this.codearticle = '';
    }
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
      console.log('selected four ' , this.SelectedFournisseur);
      if (this.SelectedFournisseur.typef === 'L') {
        this.typef = 'L' ;
      } else  if (this.SelectedFournisseur.typef === 'E') {
        this.typef = 'E' ;
      } else { this.typef = '' ; }
      this.codefour = this.SelectedFournisseur.code ;
     } else { this.codefour = '' ; }
  }
  public onSearchfournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async Afficher() {
    console.log(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'),
    this.codefour, this.codearticle, this.typef, this.numcmd, this.typerech);
    console.log('four' , this.codefour );
    console.log('article' , this.codearticle);



    await this.commandeService. getListeCmdFrsNonSoldee(this.datedebut.toLocaleDateString('en-GB'),
    this.datefin.toLocaleDateString('en-GB'), this.codefour , this.codearticle,  this.typef , this.numcmd , this.typerech)
    .toPromise().then((data) => {
      this.data = data ;
      console.log(this.data);
    });
    this.listeCmdsFrsNonSolde = new Array() ;
    for (let i = 0 ; i < this.data.length ; i++) {
      this.CmdFrsNonSoldee = {codefr : '' , four : '' , numcmd: '' ,
        datcmd : '' , artcmd : '' , design : '' ,
        qtecmd: '' , qtelivr : '' , diff : '' , pru : '' , total : '' , typecmd: '' } ;
        const obj = this.data[i];
        this.CmdFrsNonSoldee.codefr = obj[0];
        this.CmdFrsNonSoldee.four = obj[1];
        this.CmdFrsNonSoldee.numcmd = obj[2];
        const dateformat: string = this.datePipe.transform(obj[3], 'dd/MM/yyyy');
        this.CmdFrsNonSoldee.datcmd = dateformat;
        this.CmdFrsNonSoldee.artcmd = obj[4];
        this.CmdFrsNonSoldee.design = obj[5];
        this.CmdFrsNonSoldee.qtecmd = obj[6];
        this.CmdFrsNonSoldee.qtelivr = obj[7];
        this.CmdFrsNonSoldee.diff = obj[8];
        this.CmdFrsNonSoldee.pru = Number(obj[9]).toFixed(3);
        this.CmdFrsNonSoldee.total = Number(obj[10]).toFixed(3);
        this.CmdFrsNonSoldee.typecmd = obj[11];
        this.listeCmdsFrsNonSolde.push(this.CmdFrsNonSoldee);

    }

  console.log('listecmdfrs********' , this.listeCmdsFrsNonSolde);

    this.btnexcel1 = true ;
    this.readonly = true ;
    this.btnaff = true ;
  }
  public dataBound(args): void {
    if (this.listeCmdsFrsNonSolde.length > 0) {
      if (this.SelectedArticles !== '' || this.SelectedArticles !== null || this.SelectedArticles !== undefined) {
        console.log('article selectonnée ' , this.SelectedArticles);
      const findrowIndex = this.listeCmdsFrsNonSolde.findIndex((el) => el.artcmd === this.SelectedArticles.code);
      // this.grid.selectedRowIndex = findrowIndex;
      setTimeout(() => {
        this.grid1.selectRows([findrowIndex]);
      }, 100);
      console.log('****index grid*****', findrowIndex);
    }
    }
  }
  async voirdetail() {
   await this.commandeService.getListeDetailCmdFrs(this.selectedCmd.numcmd)
      .toPromise()
      .then((data) => {
        this.listDetail = data['_embedded'].cmdsFrsNonSoldees ;
        console.log('listeCmds =' , this.listDetail);

     });
     if (this.listDetail.length !== 0) {
      this.btnexcel2 = true ;
      for (let i = 0 ; i < this.listDetail.length ; i++) {
        this.listDetail[i].prix = Number(this.listDetail[i].prix).toFixed(3);
        this.listDetail[i].qtecmd = Number(this.listDetail[i].qtecmd).toFixed(0);
        this.listDetail[i].qteliv = Number(this.listDetail[i].qteliv).toFixed(0);
      }
     }

  }
  public dataBound2(args): void {
    if (this.listDetail.length > 0) {
      const findrowIndex = this.listDetail.findIndex((el) => el.codeart === this.selectedCmd.artcmd);
     // this.grid.selectedRowIndex = findrowIndex;
     setTimeout(() => {
       this.grid2.selectRows([findrowIndex]);
     }, 100);

    }
  }

  rowSelected() {
    if (this.grid1.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid1.getSelectedRecords()[0];
      this.selectedCmd = selected;
      console.log('selectedCmd************', this.selectedCmd);

    }
  }

  annulerSelection(): void {
    if (this.grid1.getSelectedRowIndexes()[0] >= 0) {
      this.grid1.selectRows([]);
      this.selectedCmd = new Array() ;
      this.listDetail = new Array();
    }
  }

  rowSelected1() {
    if (this.grid2.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid2.getSelectedRecords()[0];
      this.selectedDetail = selected;
      console.log('selectedCmd************', this.selectedCmd);

    }
  }

  annulerSelection1(): void {
    if (this.grid2.getSelectedRowIndexes()[0] >= 0) {
      this.grid2.selectRows([]);
      this.selectedDetail = new Array() ;
    }
  }

  async excelExport1() {
    console.log('okkkk');
    if (this.listeCmdsFrsNonSolde.length === 0) {
      await this.commandeService. getListeCmdFrsNonSoldee(this.datedebut.toLocaleDateString('en-GB'),
      this.datefin.toLocaleDateString('en-GB'), this.codefour , this.SelectedArticles,  this.typef , this.numcmd , this.typerech)
      .toPromise().then((data) => {
        this.data = data ;
        console.log(this.data);
      });
      this.listeCmdsFrsNonSoldeEXCEL = new Array() ;
      for (let i = 0 ; i < this.data.length ; i++) {
        this.CmdFrsNonSoldee = {codefr : '' , four : '' , numcmd: '' ,
          datcmd : '' , artcmd : '' , design : '' ,
          qtecmd: '' , qtelivr : '' , diff : '' , pru : '' , total : '' , typecmd: '' } ;
          const obj = this.data[i];
          this.CmdFrsNonSoldee.codefr = obj[0];
          this.CmdFrsNonSoldee.four = obj[1];
          this.CmdFrsNonSoldee.numcmd = obj[2];
          const dateformat: string = this.datePipe.transform(obj[3], 'dd/MM/yyyy');
          this.CmdFrsNonSoldee.datcmd = dateformat;
          this.CmdFrsNonSoldee.artcmd = obj[4];
          this.CmdFrsNonSoldee.design = obj[5];
          this.CmdFrsNonSoldee.qtecmd = obj[6];
          this.CmdFrsNonSoldee.qtelivr = obj[7];
          this.CmdFrsNonSoldee.diff = obj[8];
          this.CmdFrsNonSoldee.pru = Number(obj[9]).toFixed(3);
          this.CmdFrsNonSoldee.total = Number(obj[10]).toFixed(3);
          this.CmdFrsNonSoldee.typecmd = obj[11];
          this.listeCmdsFrsNonSoldeEXCEL.push(this.CmdFrsNonSoldee);
      }
      try {
        let nomFich;
           nomFich = 'listeCmdsFrsNonSoldee';
        const exportExcel = this.listeCmdsFrsNonSoldeEXCEL.map(obj => {
          return {
            'Fournisseur': obj.four,
            'N°cmd': obj.numcmd,
            'Date': obj.datcmd,
            'Article': obj.artcmd,
            'Designation': obj.design,
            'QteCmd': obj.qtecmd,
            'Qtelivr': obj.qtelivr,
            'Diff': obj.diff,
            'Prix': obj.pru,
            'Total': obj.total,
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
      try {
        let nomFich;
           nomFich = 'listeCmdsFrsNonSoldee';
        const exportExcel = this.listeCmdsFrsNonSolde.map(obj => {
          return {
            'Fournisseur': obj.four,
            'N°cmd': obj.numcmd,
            'Date': obj.datcmd,
            'Article': obj.artcmd,
            'Designation': obj.design,
            'QteCmd': obj.qtecmd,
            'Qtelivr': obj.qtelivr,
            'Diff': obj.diff,
            'Prix': obj.pru,
            'Total': obj.total,
          };
        });
        this.excelService.exportAsExcelFile(
          exportExcel,
          nomFich + ' : ' + new Date().toLocaleDateString('en-GB')
        );
    } catch {
      console.log(' methode genererExcel');
    }
    }
  }
  excelExport2() {
    console.log('okkkk');
    const excelExportProperties: ExcelExportProperties = {
      fileName: 'listeCmdsFrsNonSoldeeDetail.xlsx'
    };
    this.grid2.excelExport(excelExportProperties);
  }
  deleteliste() {
    console.log('okkkk');

    this.articles = new Array() ;

  }

}
