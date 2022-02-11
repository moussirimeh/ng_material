import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent,
  ExcelExportProperties,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import * as jspdf from 'jspdf';
import { OverlayPanel } from 'primeng/primeng';
import { CommandeFourService } from '../services/commandeFour.service';
import { VerifCommandeService } from '../services/verifCommande.service';
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
  selector: 'app-verification-commande',
  templateUrl: './verification-commande.component.html',
  styleUrls: ['./verification-commande.component.scss'],
  providers: [ExcelService]
})
export class VerificationCommandeComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  articles = [];
  numero: string;
  readonly = false;
  loader = false;
  societe;
  date;
  tab_articles: any;
  fournisseur: any;
  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  styleOvPanelError = {
    'text-align': 'center',
    'font-size': '14px',
    'background-color': ' #f8b7bd',
  };
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(
    private commandeFourService: CommandeFourService,
    private verifCommandeService: VerifCommandeService,
    private excelService: ExcelService
  ) {}

  async ngOnInit() {}
  verifierNumero() {
    // this.messageService.clear();
    // this.op.visible = false;
    const num: string = String(this.numero);
    this.numero = num;

    if (this.numero === 'null') {
      this.numero = '';
    } else {
      switch (this.numero.length) {
        case 1: {
          this.numero = '0000' + this.numero;
          break;
        }
        case 2: {
          this.numero = '000' + this.numero;
          break;
        }
        case 3: {
          this.numero = '00' + this.numero;
          break;
        }
        case 4: {
          this.numero = '0' + this.numero;
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  saisir() {
    this.numero = null;
    this.readonly = false;
    this.articles = [];
  }
  async Verifier(e) {
    this.readonly = true;
    this.loader = true;
    await this.verifCommandeService
      .VerifCmnd(this.numero)
      .toPromise()
      .catch(() => {
        console.log('error verif');
      });
    await this.verifCommandeService
      .ListCmd(this.numero)
      .toPromise()
      .then((data) => {
        console.log(data);

        this.articles = data['_embedded'].verifCommande;
        if (this.articles.length === 0) {
          this.msgs = 'Commande Inéxistante !';
          this.readonly = false;
          this.ov.show(e, document.getElementById('num'));
        } else {
          this.articles.map((el) => {
            el.dateDernAch
              ? (el.dateDernAch = el.dateDernAch.substring(8, 10) + '/' + el.dateDernAch.substring(5, 7) + '/' + el.dateDernAch.substring(0, 4))
              : (el.dateDernAch = '');
            el.numDernAch
              ? (el.numDernAch = el.numDernAch.substring(9, 14))
              : (el.numDernAch = '');
            el.qteCmd = Number(el.qteCmd);
          });
          this.readonly = true;
        }
        // }
      })
      .catch((data) => {
        console.log('error');
      });
      this.loader = false;
  }
  excelExport() {
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: 'Verif Commande ' + this.numero + '.xlsx',
    // };
    // this.grid.excelExport(excelExportProperties);
    const exportExcel = this.articles.map(obj => {
      return {
        'ARTICLE': obj.artCmd,
        'STK': Number(obj.qtStk),
        'RES': Number(obj.qteReserv),
        'CM_CL': Number(obj.qteComCl),
        'CM_FR': Number(obj.qtCom),
        'STK_EQ': Number(obj.qtEquiv),
        'CM_FR_EQ': Number(obj.qtEquivCom),
        'PR_STK': obj.profilStk,
        'NB_CL': Number(obj.nbrCl),
        'NB_BL': Number(obj.nbrBl),
        'NB_PC': Number(obj.qteTotal),
        'NB_PC1': Number(obj.qteTotal1),
        'NUM_ACH': Number(obj.numDernAch),
        'DAT_ACH': obj.dateDernAch,
        'QT_ACH': Number(obj.qteAchetee),
        'QT_VND': Number(obj.qteVendue),
        'MIN': Number(obj.qteMin),
        'MAX': Number(obj.qteMax),
        'QT_CMD': Number(obj.qteCmd),
        'QT_CONS': Number(obj.qteConseillee),
        'OBSERVATIONS': obj.observations,
      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
      'Verif Commande ' + this.numero

    );
  }
  // imprimer
  async imprimer() {
    await this.commandeFourService
      .detailCommandeFour(this.numero)
      .toPromise()
      .then((data) => {
        this.fournisseur = data['_embedded'].commandeFour[0].deno;
      });
    const doc1 = new jspdf('landscape');
    doc1.setFontSize(18);
    doc1.setFontStyle('bold');
    doc1.setFontStyle('Arial');
    this.date = new Date().toLocaleDateString('en-GB');
    doc1.text(
      'ETAT VERIFICATION COMMANDE N° ' +
        this.numero +
        ' EDITEE LE ' +
        this.date,
      148,
      20,
      'center'
    );
    doc1.text('FOURNISSEUR ' + this.fournisseur, 148, 27, 'center');
    doc1.text('DELAI DE LIVRAISON 90 JOURS', 148, 34, 'center');
    doc1.setFontSize(10);
    doc1.line(8, 39, 290, 39);

    // ligne vertical
    doc1.line(8, 39, 8, 200);
    doc1.line(290, 39, 290, 200);

    doc1.setFontSize(8);
    doc1.text('ARTICLE', 9, 42);
    doc1.text('STK', 38, 42);
    doc1.text('RES', 45, 42);
    doc1.text('CM_CL', 52, 42);
    doc1.text('CM_FR', 63, 42);
    doc1.text('STK_EQ', 75, 42);
    doc1.text('CM_FR_EQ', 87, 42);
    doc1.text('PR_STK', 103, 42);
    doc1.text('NB_CL', 115, 42);
    doc1.text('NB_BL', 125, 42);
    doc1.text('NB_PC', 135, 42);
    doc1.text('NB_PC_1', 145, 42);
    doc1.text('N°ACH', 160, 42);
    doc1.text('DAT_ACH', 174, 42);
    doc1.text('QT_AC', 190, 42);
    doc1.text('QT_VN', 201, 42);
    doc1.text('MIN', 212, 42);
    doc1.text('MAX', 218, 42);
    doc1.text('QT_CM', 226, 42);
    doc1.text('QT_CS', 237, 42);
    doc1.text('OBSERVATIONS', 255, 42);
    doc1.setFontSize(10);
    doc1.line(8, 44, 290, 44);
    let y = 49;
    let numPage = 1;

    if (this.articles === null || this.articles === undefined) {
    } else {
      for (this.tab_articles of this.articles) {
        // console.log('object ', this.tab_articles);

        doc1.setFontSize(9);
        doc1.setFontStyle('Arial');

        doc1.text(String(this.tab_articles.artCmd), 9, y);
        doc1.text(String(this.tab_articles.qtStk), 40, y);
        doc1.text(String(this.tab_articles.qteReserv), 48, y);
        doc1.text(String(this.tab_articles.qteComCl), 57, y);
        doc1.text(String(this.tab_articles.qtCom), 65, y);
        doc1.text(String(this.tab_articles.qtEquiv), 78, y);
        doc1.text(String(this.tab_articles.qtEquivCom), 93, y);
        doc1.text(String(this.tab_articles.profilStk), 107, y);
        doc1.text(String(this.tab_articles.nbrCl), 117, y);
        doc1.text(String(this.tab_articles.nbrBl), 128, y);
        doc1.text(String(this.tab_articles.qteTotal), 138, y);
        doc1.text(String(this.tab_articles.qteTotal1), 148, y);
        doc1.text(String(this.tab_articles.numDernAch), 162, y);
        doc1.text(String(this.tab_articles.dateDernAch), 175, y);
        doc1.text(String(this.tab_articles.qteAchetee), 192, y);
        doc1.text(String(this.tab_articles.qteVendue), 205, y);
        doc1.text(String(this.tab_articles.qteMin), 214, y);
        doc1.text(String(this.tab_articles.qteMax), 221, y);
        doc1.text(String(this.tab_articles.qteCmd), 229, y);
        doc1.text(String(this.tab_articles.qteConseillee), 240, y);
        doc1.setFontSize(8);
        doc1.text(String(this.tab_articles.observations), 247, y);
        y = y + 7;
        // passer a une nouvelle page

        if (y > 200) {
          doc1.setFontSize(10);
          doc1.line(8, 200, 290, 200);
          doc1.text(String(numPage), 135, 204);

          numPage++;
          doc1.addPage();
          // entete tableau

          doc1.setFontSize(10);

          // ligne vertical
          doc1.line(8, 12, 8, 200);
          doc1.line(290, 12, 290, 200);

          doc1.line(8, 12, 290, 12);

          doc1.setFontSize(8);
          doc1.text('ARTICLE', 9, 16);
          doc1.text('STK', 38, 16);
          doc1.text('RES', 45, 16);
          doc1.text('CM_CL', 52, 16);
          doc1.text('CM_FR', 63, 16);
          doc1.text('STK_EQ', 75, 16);
          doc1.text('CM_FR_EQ', 87, 16);
          doc1.text('PR_STK', 103, 16);
          doc1.text('NB_CL', 115, 16);
          doc1.text('NB_BL', 125, 16);
          doc1.text('NB_PC', 135, 16);
          doc1.text('NB_PC_1', 145, 16);
          doc1.text('N°ACH', 160, 16);
          doc1.text('DAT_ACH', 174, 16);
          doc1.text('QT_AC', 190, 16);
          doc1.text('QT_VN', 201, 16);
          doc1.text('MIN', 212, 16);
          doc1.text('MAX', 218, 16);
          doc1.text('QT_CM', 226, 16);
          doc1.text('QT_CS', 237, 16);
          doc1.text('OBSERVATIONS', 255, 16);
          doc1.setFontSize(10);
          doc1.line(8, 18, 290, 18);
          y = 23;
        }
      }

      doc1.setFontSize(10);
      doc1.line(8, 200, 290, 200);
      doc1.text(String(numPage), 135, 204);
    }
    window.open(doc1.output('bloburl'), '_blank');
  }
}
