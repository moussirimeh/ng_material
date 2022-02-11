import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import { GridComponent, RowSelectEventArgs, EditSettingsModel } from '@syncfusion/ej2-angular-grids';

import { setCulture, L10n} from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { ClientService } from '../services/client.service';
import { StockService } from '../services/stock.service';
import { RepresanService } from '../services/represan.service';
import { FournisseurService } from '../services/fournisseur.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { EtatCommandeClientService } from '../services/etatCommandeClient.service';
import { DetailCommandeClientService } from '../services/detailCommandeClient.service';
import * as jspdf from 'jspdf';

import { ExcelService } from '../services/excel.service';

setCulture('fr-FR');
L10n.load({
  'fr-FR': {
    grid: {
      EmptyRecord: ' ',
      EmptyDataSourceError: ' '
    }
  }
});
import {
  ExcelExportProperties,
  ToolbarService,
  ToolbarItems,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { SteService } from '../services/ste.service';
import { DatePipe } from '@angular/common';
import { SuivicmdsRep } from '../services/SuivicmdsRep';
import { float } from 'html2canvas/dist/types/css/property-descriptors/float';
import { SuivicmdsClient } from '../services/suivicmdclient';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-etat-commande-client',
  templateUrl: './etat-commande-client.component.html',
  styleUrls: ['./etat-commande-client.component.scss'],
  providers: [DatePipe, ExcelService, ToolbarService]
})
export class EtatCommandeClientComponent implements OnInit {


  @ViewChild('grid')
  public grid: GridComponent;

  @ViewChild('grid2')
  public grid2: GridComponent;
  @ViewChild('grid1')
  public grid1: GridComponent;
  @ViewChild('gridSelctionnee')
   public gridSelctionnee: GridComponent;
  @ViewChild('op')
   public op: OverlayPanel;
   msg: String;
   wasInside: any;
   public sortOptions: object;
   public editSettings: EditSettingsModel;
   readonly: boolean ;
   btnaff: boolean;
   readonlyRepresentant: boolean;

  selected_clt: any; // Client ngSelect
  selected_Rep: any; // Representant ngSelect
  selected_art: any; // Commande Contenant L'Article ngSelect
  selected_Four: any; // Commandes Contenant des articles Fourniseur  ngSelect
  codeRep = null;
  codeFrs = null ;
  dated: Date;
  date_debut: string;
  date_fin: string;
  cmd_clt = '' ;  // N° Cmd Client
  cmd_eqm = ''; // N° Cmd EQM
  code_clt = ''; // Client Valeur Selectioner
  code_rep = ''; // Representant Valeur Selectioner
  deno = '';
  selectedradiobtcmdQPES = '3'; // possible valeurs '1' ou  '2' ou '3' (Radio button Commandes Qui Peuvent etre soldées)
  selectedradiobtcmd = '1';  // possible valeurs '1' ou  '2' ou '3'(Radio button Commandes)
  code_art = ''; // Commande Contenant L'Article  Valeur Selectioner
  selectedradiobtart = '2'; // possible valeurs '1' ou  '2' ou '3' Radio button  Commande Contenant L'Article
  selectedradiobtfrn = '2'; //  possible valeurs '1' ou  '2' ou '3'
  code_frn = ''; // Commandes Contenant des articles Fourniseur Valeur Selectioner
  listeClients = new Array();
  listeRepresan = new Array();
  listeArticles = new Array();
  listefournisseurs = new Array();
  datasourceGrid: any[];
  datasourceGrid1: any[];
  datasourceGrid2: any[];
  selectedGridCmd: any;
  listeRechCmd = new Array();
  listeSuiviRep: SuivicmdsRep[];
  listeSuivicmdsClient: SuivicmdsClient[];
  listeArticleCmd = new Array();
  listeArticleSolde = new Array();
  date: Date;
  btninitialiser = false  ;

  to: Date;
  combine: string;

  maxDate: Date;
  choix: string;

  societe: any;
  entete: any;
  datepipe: any;




  constructor(
    private clientService: ClientService,
    private fournisseurService: FournisseurService,
    private stockService: StockService,
    private represanService: RepresanService,
    private config: NgSelectConfig,
    private steService: SteService,
    private datePipe: DatePipe,
    private excelService: ExcelService,
    private etatCommandeClientService: EtatCommandeClientService ,
    private detailCommandeClientService: DetailCommandeClientService,

  ) {
    this.config.notFoundText = 'aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {

      this.op.hide();
    }
    this.wasInside = false;
  }


  gererExcelgrid() {
    const exportExcel = this.datasourceGrid.map(obj => {
      return {
        'NotreNumero': obj.notreNumero,
        'NumeroClt': obj.numeroClient,
        'Date': obj.dateCmd,
        'CodeClt': obj.codeClt,
        'DesingationClt ': obj.designationClt,

      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
     'EtatCMDClient  ' + new Date().toLocaleDateString('en-GB')

    );
    }

    gererExcelgrid1() {
      const exportExcel = this.datasourceGrid1.map(obj => {
        return {
          'CODE': obj.code,
          'Prix': obj.prix,
          'T_Remise': obj.tRemise,
          'Taux_Tva': obj.tauxTva,
          'Quantite': obj.quantite,
          'Livre ': obj.livre,
          'Solde': obj.solde,
          'Reserv': obj.reserv,
          'EnStock': obj.enStock,
          'Qt_EcCom': obj.qtCom,
          'DatePr ': obj.datePr,

        };
      });
      this.excelService.exportAsExcelFile(
        exportExcel,
       'EtatCMDClient  ' + new Date().toLocaleDateString('en-GB')

      );
    }
    gererExcelgrid2() {
      const exportExcel = this.datasourceGrid2.map(obj => {
        return {
          'NumCmd': obj.numcmd,
          'Date': obj.date,
          'Client': obj.client,
          'Code': obj.code,
          'Desingation': obj.desingation,
          'Quantite ': obj.quantite,
          'Livre': obj.livre,
          'Reserv': obj.reserv,
          'QteStk': obj.qteStk,
          'QtEnCmd': obj.qtEnCmd,
          'Representant': obj.representant,
          'Fournisseur' : obj.fournisseur,

        };
      });
      this.excelService.exportAsExcelFile(
        exportExcel,
       'EtatCMDClient  ' + new Date().toLocaleDateString('en-GB')

      );

    }


  async chargerClients() {
    if (this.listeClients.length === 0) {
      await this.clientService
        .getClientsListByOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des clients ', data['_embedded'].clients);

          this.listeClients = data['_embedded'].clients;
        });
    }
  }
  changeClient() {
    if (this.selected_clt !== null && this.selected_clt !== undefined) {
      this.code_clt = this.selected_clt.code;
    } else {
      this.code_clt = '';
    }
  }
  public onSearchDeno(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }


  changeRepresentant() {
    if (this.selected_Rep !== null && this.selected_Rep !== undefined) {
      this.code_rep = this.selected_Rep.code;
    } else {
      this.code_rep = '';
    }
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
  async rechArticle(mot) {
    //  this.listeStocks = new Array();
    console.log('mot', mot);
    await this.stockService
      .getStockList(mot)
      .toPromise()
      .then((data) => {
        console.log('liste Article ', data);
        this.listeArticles = data['_embedded'].stocks;
      });
  }

  async chargerArticle() {
    if (this.listeArticles.length === 0) {
      await this.stockService
        .getTop50ByCodeStartsWith('')
        .toPromise()
        .then((data) => {
          console.log('liste des Articles ', data);
          this.listeArticles = data['_embedded'].stocks;
        });
      console.log(this.listeArticles);
    }
  }
  changeArticle() {
    if (this.selected_art !== null && this.selected_art !== undefined) {
      this.code_art = this.selected_art.code;
    } else {
      this.code_art = '';
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
  changeFour() {
    if (this.selected_Four !== null && this.selected_Four !== undefined) {
      this.code_frn = this.selected_Four.code;
    } else {
      this.code_frn = '';
    }
  }

    ngOnInit() {
    this.Dcommande();

    this.to = new Date();
    this.date = new Date();
    this.date.setDate(this.date.getDate() - 730);
    this.cmd_clt = '';
    this.maxDate = new Date();
    this.date_fin = this.to.toLocaleDateString('en-GB');
    this.date_debut = this.date.toLocaleDateString('en-GB');
    this.listeSuiviRep = [];
    this.listeSuivicmdsClient = [];




  }




    async afficher() {
    this.readonly = true ;
    this.btnaff = true;
    this.wasInside = true;

    this. datasourceGrid2 = new Array();

    this.date_fin = this.to.toLocaleDateString('en-GB');
    this.date_debut = this.date.toLocaleDateString('en-GB');
    const cmd_clt = this.cmd_clt;
    const cmd_eqm = this.cmd_eqm;
    const code_clt =  this.code_clt;
    const code_rep = this.code_rep;
    const selectedradiobtcmd = this.selectedradiobtcmd;
    const selectedradiobtcmdQPES = this.selectedradiobtcmdQPES;
    const code_art = this.code_art;
    const selectedradiobtart = this.selectedradiobtart;
    const code_frn = this.code_frn;
    const selectedradiobtfrn = this.selectedradiobtfrn;

    await this.etatCommandeClientService.RechCmd(
    this.date_debut,
    this.date_fin,
    this.cmd_clt,
    this.cmd_eqm,
    this.code_clt,
    this.code_rep,
    this.selectedradiobtcmdQPES,
    this.selectedradiobtcmd,
    this.code_art,
    this.selectedradiobtart,
    this.code_frn,
    this.selectedradiobtfrn,
    )
    .toPromise()
    .then((data) => {
     this.listeRechCmd = data['_embedded'].etatCommandeClient ;
      console.log('liste rech ****' , this.listeRechCmd);
     });


     this.datasourceGrid = this.listeRechCmd;

  }



  async nouvelleSaisie() {

    this.listeRechCmd = new Array();
    this.listeArticleSolde = new Array();
    this.listeArticleCmd = new Array();
    this.btnaff = false ;
    this.readonly = false ;


  }


  async afficherLesArticlesCommandeStock() {
    this.readonly = true ;
    this.btnaff = true;
   await this.detailCommandeClientService.articlecommandeavecstock( this.date_debut,
     this.date_fin,
      this.code_art,
      this.code_frn )
   .toPromise()
   .then((data) => {
    this.listeArticleSolde = data['_embedded'].detailCommandeStkClts;
    // console.log('liste article soldeee ****' , data);
    // console.log('liste article soldeee ****' , this.listeArticleSolde);
    });
    this.datasourceGrid2 = this.listeArticleSolde ;
  }




    async afficherTousLesArticles(e) {
      this.readonly = true ;
      this.btnaff = true;
     await this.detailCommandeClientService.detailCommande(this.selectedGridCmd.notreNumero , '0')
     .toPromise()
     .then((data) => {
     this.listeArticleCmd = data['_embedded'].detailCommandeClient;
    // console.log('liste articleCmd ****' , data);
     });

    this.datasourceGrid1 = this.listeArticleCmd;
  }

    rowSelectedNumero(e) {

     if (this.grid.getSelectedRowIndexes()[0] >= 0) {
        const selected: any = this.grid.getSelectedRecords()[0];
       this.selectedGridCmd = selected;

       }
   // console.log('selected notre numero  Grid ', this.selectedGridCmd  );

  }

  async afficherLesArticlesSolde(e) {
    this.readonly = true ;
    this.btnaff = true;
  if (this.selectedGridCmd !== null && this.selectedGridCmd !== undefined) {
     await this.detailCommandeClientService.detailCommande(this.selectedGridCmd.notreNumero , '1')
     .toPromise()
     .then((data) => {
     this.listeArticleCmd = data['_embedded'].detailCommandeClient;
    // console.log('liste articleCmdNonSolde ****' , data);
     });
    }

    this.datasourceGrid1 = this.listeArticleCmd;

  }

  initialiser() {
    this.selected_clt = null;
    this.selected_Rep = null;
    this.selected_art = null;
    this.selected_Four = null;
    this.datasourceGrid = new Array();
    this.datasourceGrid1 = new Array();

    this.combine = null;
    this.date = new Date();
    this.date.setDate(this.date.getDate() - 730);
    this.to = new Date();
    this.date_fin = this.to.toLocaleDateString('en-GB');
    this.date_debut = this.date.toLocaleDateString('en-GB');
    this.cmd_clt = '';
    this.cmd_eqm = '';
    this.code_clt = '';
    this.code_rep = '';
    this.code_art = '';
    this.code_frn = '';
    this .selectedradiobtcmdQPES = '3';
    this. selectedradiobtcmd = '1';

     this. selectedradiobtart = '2';
     this.selectedradiobtfrn = '2';
  }

  async GetArticles(listeSuiviRep) {
    this.readonly = true ;
    this.btnaff = true;
    await Promise.all(listeSuiviRep.map(async (val) => {
      await this.etatCommandeClientService.GetSuivicmdArticle(val.numCmdEqm)
      .toPromise()
      .then((data) => {
       val.articles = data['_embedded'].suivicmdArticles ;
       });
    }));

    }

    public onSearchItem(word: string, item): boolean {
      return item.code.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
    }


  async suivicmdRep(e) {
    this.readonly = true ;
    this.btnaff = true;
    this.wasInside = true;
   if ( this.code_rep !== undefined && this.code_rep !== null && this.code_rep !== '') {

    this.date_fin = this.to.toLocaleDateString('en-GB');
    this.date_debut = this.date.toLocaleDateString('en-GB');

    await this.etatCommandeClientService.GetSuivicmdsRep( this.date_debut, this.date_fin, this.code_rep)
    .toPromise()
    .then((data) => {
     this.listeSuiviRep = data['_embedded'].suivicmdsReps ;
     });

  if (this.listeSuiviRep !== undefined && this.listeSuiviRep !== null &&  this.listeSuiviRep.length > 0 ) {
    await this.GetArticles(this.listeSuiviRep);

       const doc1 = new jspdf();
       doc1.setFontSize(12);
       doc1.setFontStyle('Arial');
       this.societe = await globals.societe;
      if (this.societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
        const img = new Image();
        img.src = 'assets/images/offres/entete.jpg';
        doc1.addImage(img, 'JPEG', 10, 10, 190, 30);
      } else {
        await this.steService
        .getSte()
        .toPromise()
        .then((data) => {
          this.societe = data['_embedded'].ste[0];
        });
        doc1.text('SOCIETE..:  ' + this.societe.societe, 9, 15);
        doc1.text('ADRESSE..:  ' + this.societe.adresse, 9, 20);
        doc1.text('VILLE....:  ' + this.societe.ville, 9, 25);
        doc1.text('TEL......:  ' + this.societe.tel, 9, 30);
        doc1.text('FAX......:  ' + this.societe.fax, 9, 35);
        doc1.text('E-MAIL...:  ' + this.societe.email, 9, 40);
      }
    doc1.text('Edité, le : '  + this.date_fin , 165, 50);
    doc1.setFontSize(24);
    doc1.setFontStyle('Arial');
    doc1.setFontSize(11);
    doc1.setTextColor(0, 0, 0);

    doc1.text('Représentant :'  + this.selected_Rep.deno, 9, 60);
     // liste suivi article

    doc1.text('Code Article' , 9, 75);
    doc1.text('Description' , 40, 75);
    doc1.text('Prix' , 100, 75);
    doc1.text('Remise' , 120, 75);
    doc1.text('Qt_Cmd' , 140, 75);
    doc1.text('Qt_Liv' , 168, 75);
    doc1.text('Solde' , 189, 75);

      // entete du  tableau

    // liste suivi Rep
      doc1.setFontSize(10);
      doc1.setFontStyle('bold');
      let y = 78;
      let numPage = 1;
      doc1.setFontStyle('Arial');
      // créer la ligne vertical
     // doc1.setFontStyle('bold');
      let Total = 0;
      for ( let i = 0 ; i < this.listeSuiviRep.length; i++) {

        const SuiviRep = this.listeSuiviRep[i];
        if (y > 277) {
          this.FinPagePDF(doc1, numPage);
          numPage++;
            y = 20;
        }
          doc1.setFontStyle('bold');
          doc1.setFontSize(10);


         if ((y + 5 + 15 + 5) > 277) {
          this.FinPagePDF(doc1, numPage);
          numPage++;
            y = 20;
         }
          doc1.setFontStyle('bold');
          doc1.setFontSize(10);


        doc1.setFillColor(228, 228, 228);
        doc1.rect(9, y, 195, 15, 'F');
        y = y + 5;

       doc1.text('N°CommandeEQM', 9, y);
       doc1.text('DateCommande', 60 , y);
       doc1.text('N°CommandeClient', 100, y);
       doc1.text('DesignationClient', 167, y, 'right');
       y = y + 7;
       if (y > 277) {
        this.FinPagePDF(doc1, numPage);
        numPage++;
          y = 20;
       }
        doc1.setFontStyle('Arial');
        doc1.setFontSize(9);


       doc1.text(SuiviRep.numCmdEqm ? SuiviRep.numCmdEqm : ' '   , 10, y, 'left');
       doc1.text(SuiviRep.dateCmd ? SuiviRep.dateCmd : ' '   , 60, y, 'left');
       doc1.text(SuiviRep.numCmdClt ? SuiviRep.numCmdClt :  ' '   , 100 , y, 'left');
       doc1.text(SuiviRep.designationClt ? SuiviRep.designationClt : ' '     , 140, y, 'left');
       y = y + 10;
       if (y > 277) {
        this.FinPagePDF(doc1, numPage);
        numPage++;
          y = 20;
      }
        doc1.setFontStyle('Arial');
        doc1.setFontSize(8);

       if (SuiviRep.articles.length !== 0) {

        for ( let j = 0 ; j < SuiviRep.articles.length; j++) {
          if (j > 0) {
          y = y + 5;
        }
          if (y > 277) {
            this.FinPagePDF(doc1, numPage);
            numPage++;
              y = 20;
          }
            doc1.setFontStyle('Arial');
            doc1.setFontSize(8);

          const SuiviRepArticles = SuiviRep.articles[j];
         doc1.text(SuiviRepArticles.codeart ? SuiviRepArticles.codeart : ' ', 9, y, 'left');
         doc1.text(SuiviRepArticles.design ? SuiviRepArticles.design : ' ' , 40, y, 'left');
         doc1.text(SuiviRepArticles.prix ? SuiviRepArticles.prix : ' ', 100 , y, 'left');
         doc1.text(SuiviRepArticles.remise ? SuiviRepArticles.remise : ' ', 120, y, 'left');
         doc1.text(SuiviRepArticles.qtecomd ? SuiviRepArticles.qtecomd : ' ', 140, y, 'left');
         doc1.text(SuiviRepArticles.qtelivr ? SuiviRepArticles.qtelivr : ' ', 170, y, 'left');
        doc1.text(SuiviRepArticles.solde ? SuiviRepArticles.solde : ' ', 189, y, 'left');
        Total = Total + (  ((Number.parseFloat( SuiviRepArticles.prix)
                        * Number.parseFloat(SuiviRepArticles.solde) )
                        * ((100 - Number.parseFloat(SuiviRepArticles.remise) ) / 100)));

          if (j === (SuiviRep.articles.length - 1)) {
            y = y + 5;
          }

           if (y > 277) {
            this.FinPagePDF(doc1, numPage);
            numPage++;
              y = 20;
          }
            doc1.setFontStyle('Arial');
            doc1.setFontSize(9);

        }
      }
       y = y + 5;
       if (y > 277) {
        this.FinPagePDF(doc1, numPage);
        numPage++;
          y = 20;
      }
        doc1.setFontStyle('Arial');
        doc1.setFontSize(9);


    }

   const TotalFixed = Total.toFixed(3);
   // doc1.setFillColor(228, 228, 228);

   if ((y + 20 + 10 ) > 277) {
    this.FinPagePDF(doc1, numPage);
    numPage++;
      y = 20;
    }

    // doc1.rect(50, y, 100, 20);
    y = y + 10;
    doc1.setFontStyle('bold');
    doc1.setFontSize(10);
    doc1.text('TOTAL :' + TotalFixed , 9, y);

    doc1.line(9, 277, 205, 277);
    doc1.setFontSize(11);
    doc1.setFontStyle('bold');
    doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
    window.open(doc1.output('bloburl'), '_blank');

    } else {
    this.msg = 'aucune commande en cours trouvée !';
    this.op.show(e, document.getElementById('inputRep'));
    }
  } else {
    this.msg = 'Selectionner un Représentant svp !';
    this.op.show(e, document.getElementById('inputRep'));
  }

  }

  FinPagePDF( doc1, numPage) {
    doc1.line(9, 277, 205, 277);
    doc1.setFontSize(11);
    doc1.setFontStyle('bold');

    doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

    doc1.addPage();
    doc1.setFontStyle('Arial');
    doc1.setFontSize(11);
    doc1.setTextColor(0, 0, 0);
    // liste suivi article
    doc1.text('Code Article' , 9, 8);
    doc1.text('Description' , 40, 8);
    doc1.text('Prix' , 100, 8);
    doc1.text('Remise' , 120, 8);
    doc1.text('Qt_Cmd' , 140, 8);
    doc1.text('Qt_Liv' , 168, 8);
    doc1.text('Solde' , 189, 8);
  }

  async suivicmdclt(e) {
    this.readonly = true ;
    this.btnaff = true;
    this.wasInside = true;
   if ( this.code_clt !== undefined && this.code_clt !== null && this.code_clt !== '') {

    this.date_fin = this.to.toLocaleDateString('en-GB');
    this.date_debut = this.date.toLocaleDateString('en-GB');

    await this.etatCommandeClientService.GetSuivicmdsClient( this.date_debut, this.date_fin, this.code_clt)
    .toPromise()
    .then((data) => {
     this.listeSuivicmdsClient = data['_embedded'].suivicmdsClients;
     });

  if (this.listeSuivicmdsClient !== undefined && this.listeSuivicmdsClient !== null &&  this.listeSuivicmdsClient.length > 0 ) {
    await this.GetArticles(this.listeSuivicmdsClient);

       const doc1 = new jspdf();
       doc1.setFontSize(12);
       doc1.setFontStyle('Arial');
       this.societe = await globals.societe;
      if (this.societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
        const img = new Image();
        img.src = 'assets/images/offres/entete.jpg';
        doc1.addImage(img, 'JPEG', 10, 10, 190, 30);
      } else {
        await this.steService
        .getSte()
        .toPromise()
        .then((data) => {
          this.societe = data['_embedded'].ste[0];
        });
        doc1.text('SOCIETE..:  ' + this.societe.societe, 9, 15);
        doc1.text('ADRESSE..:  ' + this.societe.adresse, 9, 20);
        doc1.text('VILLE....:  ' + this.societe.ville, 9, 25);
        doc1.text('TEL......:  ' + this.societe.tel, 9, 30);
        doc1.text('FAX......:  ' + this.societe.fax, 9, 35);
        doc1.text('E-MAIL...:  ' + this.societe.email, 9, 40);
      }
    doc1.text('Edité, le : '  + this.date_fin , 165, 50);
    doc1.setFontSize(24);
    doc1.setFontStyle('Arial');
    doc1.setFontSize(11);
    doc1.setTextColor(0, 0, 0);
    doc1.text('Code Client : ' + this.code_clt, 9, 55);
    doc1.text('Designation Client : ' + this.selected_clt.deno, 9, 60);
     // liste suivi article

     doc1.text('Code Article' , 9, 75);
     doc1.text('Description' , 44, 75);
     doc1.text('Prix' , 100, 75);
     doc1.text('Remise' , 120, 75);
     doc1.text('Qt_Cmd' , 140, 75);
     doc1.text('Qt_Liv' , 168, 75);
     doc1.text('Solde' , 189, 75);
     // entete du  tableau

    // liste suivi clt
    doc1.setFontSize(10);
    doc1.setFontStyle('bold');
    let y = 78;
    let numPage = 1;
    doc1.setFontStyle('Arial');


      let Total = 0;
      for ( let i = 0 ; i < this.listeSuivicmdsClient.length; i++) {
        // tslint:disable-next-line:no-shadowed-variable
        const  SuivicmdsClient = this.listeSuivicmdsClient[i];

        if (y > 277) {
          this.FinPagePDF(doc1, numPage);
          numPage++;
            y = 20;
        }
          doc1.setFontStyle('bold');
          doc1.setFontSize(10);


         if ((y + 5 + 15 + 5) > 277) {
          this.FinPagePDF(doc1, numPage);
          numPage++;
            y = 20;
         }
          doc1.setFontStyle('bold');
          doc1.setFontSize(10);


        doc1.setFillColor(228, 228, 228);
        doc1.rect(9, y, 195, 15, 'F');
        y = y + 5;

       doc1.text('N°CommandeEQM', 9, y);
       doc1.text('DateCommande', 60 , y);
       doc1.text('N°CommandeClient', 100, y);

       y = y + 7;
       if (y > 277) {
        this.FinPagePDF(doc1, numPage);
        numPage++;
          y = 20;
       }
        doc1.setFontStyle('Arial');
        doc1.setFontSize(9);


       doc1.text(SuivicmdsClient.numCmdEqm ? SuivicmdsClient.numCmdEqm : ' ', 10, y, 'left');
       doc1.text(SuivicmdsClient.dateCmd ? SuivicmdsClient.dateCmd  : ' ' , 60, y, 'left');
       doc1.text(SuivicmdsClient.numCmdClt ? SuivicmdsClient.numCmdClt : ' ', 100 , y, 'left');
       y = y + 10;
       if (y > 277) {
        this.FinPagePDF(doc1, numPage);
        numPage++;
          y = 20;
      }
        doc1.setFontStyle('Arial');
        doc1.setFontSize(8);

       if (SuivicmdsClient.articles.length !== 0) {

        for ( let j = 0 ; j < SuivicmdsClient.articles.length; j++) {

            if (j > 0) {
        y = y + 5;
      }

          if (y > 277) {
            this.FinPagePDF(doc1, numPage);
            numPage++;
              y = 20;
          }
            doc1.setFontStyle('Arial');
            doc1.setFontSize(8);
          const SuivicmdsClientArticles = SuivicmdsClient.articles[j];
          doc1.text(SuivicmdsClientArticles.codeart ? SuivicmdsClientArticles.codeart : ' ', 9, y, 'left');
          doc1.text(SuivicmdsClientArticles.design ? SuivicmdsClientArticles.design : ' ', 44, y, 'left');
          doc1.text(SuivicmdsClientArticles.prix ? SuivicmdsClientArticles.prix : ' ', 100 , y, 'left');
          doc1.text(SuivicmdsClientArticles.remise ? SuivicmdsClientArticles.remise : ' ', 120, y, 'left');
          doc1.text(SuivicmdsClientArticles.qtecomd ? SuivicmdsClientArticles.qtecomd : ' ', 140, y, 'left');
          doc1.text(SuivicmdsClientArticles.qtelivr ? SuivicmdsClientArticles.qtelivr : ' ', 170, y, 'left');
         doc1.text(SuivicmdsClientArticles.solde ? SuivicmdsClientArticles.solde : ' ', 189, y, 'left');
         Total = Total + (  ((Number.parseFloat( SuivicmdsClientArticles.prix)
                        * Number.parseFloat(SuivicmdsClientArticles.solde) )
                        * ((100 - Number.parseFloat(SuivicmdsClientArticles.remise) ) / 100)));
            if (j === (SuivicmdsClient.articles.length - 1)) {
          y = y + 5;
        }

           if (y > 277) {
            this.FinPagePDF(doc1, numPage);
            numPage++;
              y = 20;
          }
            doc1.setFontStyle('Arial');
            doc1.setFontSize(9);

        }
      }


      y = y + 5;
      if (y > 277) {
       this.FinPagePDF(doc1, numPage);
       numPage++;
         y = 20;
     }
       doc1.setFontStyle('Arial');
       doc1.setFontSize(9);


   }
   const TotalFixed = Total.toFixed(3);

   if ((y + 20 + 10 ) > 277) {
    this.FinPagePDF(doc1, numPage);
    numPage++;
      y = 20;
    }

    // doc1.rect(9, y, 195, 20); //
    y = y + 10;
    doc1.setFontStyle('bold');
    doc1.setFontSize(10);
    doc1.text('TOTAL :' + TotalFixed , 9, y);

    doc1.line(9, 277, 205, 277);
    doc1.setFontSize(11);
    doc1.setFontStyle('bold');
    doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
    window.open(doc1.output('bloburl'), '_blank');
    } else {
    this.msg = 'aucune commande en cours trouvée !';
    this.op.show(e, document.getElementById('inputclient'));
    }
  } else {
    this.msg = 'Selectionner un Client svp !';
    this.op.show(e, document.getElementById('inputclient'));
  }

  }


  async Dcommande() {

    await this.etatCommandeClientService.deletecommande()
    .toPromise()
    .then((data) => {
      const getDelete = data ;
      console.log('resultat delete commande ', getDelete);
     });


     await this.etatCommandeClientService.deletecomm()
     .toPromise()
     .then((data) => {
       const getDel = data ;
       console.log('resultat delete commmmmmmm ', getDel);
      });






  }

  }
