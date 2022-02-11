import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent,
  ExcelExportProperties,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import * as jspdf from 'jspdf';
import { OverlayPanel } from 'primeng/primeng';
import { DdevisService } from '../services/ddevis.service';

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
  selector: 'app-autorisation-offre',
  templateUrl: './autorisation-offre.component.html',
  styleUrls: ['./autorisation-offre.component.scss'],
})
export class AutorisationOffreComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  articles = [];
  numero: string;
  readonly = false;
  societe;
  date;
  tab_articles: any;
  marge: any;
  nbrArtHorsStk: any;
  coutOffreTotal: any;
  coutAchatTotal: any;
  selectedArticle: any;
  afficheNouvCout = false;
  coutVenteMin: any;
  codeArticle: any;
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
  constructor(private ddevisService: DdevisService) {}

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
    await this.ddevisService
      .getArticlesOffre(this.numero)
      .toPromise()
      .then((data) => {
        this.articles = data['_embedded'].articlesOffres;
        // this.clients.unshift(this.selectedClient);
        this.articles.map(el => {
          el.coutDeVenteRemise = Number(el.coutDeVenteRemise).toFixed(3);
          el.achat = Number(el.achat).toFixed(3);
          el.marge = Number(el.marge).toFixed(2);
          el.coutVenteMinim ? el.coutVenteMinim = Number(el.coutVenteMinim).toFixed(3) : console.log(el.coutVenteMinim);
        });
      })
      .catch((data) => {
        console.log('error get articles');
      });
    if (this.articles.length === 0) {
      this.readonly = false;
      this.articles = [];
      this.msgs = 'Offre Inéxistant !';
      this.ov.show(e, document.getElementById('num'));
    } else {
      this.readonly = true;
      await this.ddevisService
        .nbrArtHorsStk(this.numero)
        .toPromise()
        .then((data) => {
          data ? this.nbrArtHorsStk = Number(data).toFixed(3) : this.nbrArtHorsStk = 0 ;
        })
        .catch(() => {
          console.log('error');
        });
      await this.ddevisService
        .coutOffreTotal(this.numero)
        .toPromise()
        .then((data) => {
          this.coutOffreTotal = Number(data).toFixed(3);
        })
        .catch(() => {
          console.log('error');
        });
      await this.ddevisService
        .coutAchatTotal(this.numero)
        .toPromise()
        .then((data) => {
          if (data && Number(data) !== 0) {
            this.coutAchatTotal = Number(data).toFixed(3);
            this.marge = (((Number(this.coutOffreTotal) / Number(this.coutAchatTotal)) * 100) - 100).toFixed(2);
          } else {
            this.coutAchatTotal = 'Non Caluclé' ;
            this.marge = 'Non Caluclé' ;
          }
        })
        .catch(() => {
          this.coutAchatTotal = 'Non Caluclé' ;
          this.marge = 'Non Caluclé' ;
        });
    }
  }
  async coutDeVenteMinimal(e) {
    this.grid.selectRows([this.selectedArticle]);
    this.codeArticle = e.rowData.code;
    this.coutVenteMin = e.rowData.coutDeVenteRemise;
    this.afficheNouvCout = true;
  }
  async changerCoutMin(e) {
    await this.ddevisService
      .updateCoutVenteMin(this.coutVenteMin, this.numero, this.codeArticle)
      .toPromise();
    await this.ddevisService
      .getArticlesOffre(this.numero)
      .toPromise()
      .then((data) => {
        this.articles = data['_embedded'].articlesOffres;
        // this.clients.unshift(this.selectedClient);
        this.articles.map(el => {
          el.coutDeVenteRemise = Number(el.coutDeVenteRemise).toFixed(3);
          el.achat = Number(el.achat).toFixed(3);
          el.marge = Number(el.marge).toFixed(2);
        });
      })
      .catch((data) => {
        console.log('error get articles');
      });
    this.afficheNouvCout = false;
  }
}
