import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { StockService } from '../services/stock.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import { Vendeur1Service } from '../services/vendeur1.service';
import { Vendeur1 } from '../services/vendeur1';
import { LoginService } from 'src/app/login/login.service';
import { FaService } from '../services/fa.service';
import { DatePipe } from '@angular/common';
import { SteService } from '../services/ste.service';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-authorisation-prix-avoir',
  templateUrl: './authorisation-prix-avoir.component.html',
  styleUrls: ['./authorisation-prix-avoir.component.scss'],
  providers: [DatePipe],
})
export class AuthorisationPrixAvoirComponent implements OnInit {
  vendeurs = [];
  articles = [];
  selectedArticle = null;
  selectedVendeur = null;
  authorisationPrix = true;
  blockedDocument = false;
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
    private vendeur1Service: Vendeur1Service,
    private stockService: StockService,
    private faService: FaService,
    private loginService: LoginService,
    private steService: SteService,
    private config: NgSelectConfig,
    private datePipe: DatePipe
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  async ngOnInit() {
    if (globals.selectedMenu === 'Authorisation Avoir') {
      this.authorisationPrix = false;
    }
    if (globals.selectedMenu === 'Authorisation Prix') {
      // charger les vendeurs
      this.vendeur1Service
        .getVendeur1ByDeno()
        .toPromise()
        .then((data) => {
          this.vendeurs = data['_embedded'].vendeur1;
        });
      // charger les articles
      /*await this.stockService
      .getStockList('')
      .toPromise()
      .then((data) => {
        this.articles = data['_embedded'].stocks;
      });*/
    }
  }
  /// recherche pour les clients en front
  public onSearchVendeur(word: string, item: Vendeur1): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async onSearchArtParCode(word: string) {
    await this.stockService
      .getStockList(word)
      .toPromise()
      .then((data) => {
        this.articles = data['_embedded'].stocks;
      });
  }

  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    let fa: any = {};
    await this.faService
      .getFa()
      .toPromise()
      .then((data) => {
        fa = data['_embedded'].fa[0];
      });
    let dateSys;
    await this.steService
      .getDateServeur()
      .toPromise()
      .then((data: string) => (dateSys = data));
    if (this.authorisationPrix) {
      if (this.selectedVendeur === null) {
        this.msgs = 'Veuillez saisir un vendeur !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('vendeur').focus();
        this.ov.show(e, document.getElementById('vendeur'));
      } else {
        if (this.selectedArticle === null) {
          this.msgs = 'Veuillez saisir un article !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('article').focus();
          this.ov.show(e, document.getElementById('article'));
        } else {
          this.blockedDocument = true;
          fa.prixflag = '1';
          fa.tempsPrix = this.datePipe.transform(
            dateSys,
            'dd/MM/yyyy HH:mm:ss.SSS'
          );
          fa.tempsAvoir = this.datePipe.transform(
            fa.tempsAvoir,
            'dd/MM/yyyy HH:mm:ss.SSS'
          );
          fa.vendeur = this.selectedVendeur.code;
          fa.reference = this.selectedArticle.code;
          await this.faService
            .updateFa(fa)
            .toPromise()
            .then((data) => {});
          await this.loginService
            .procedureStockeModule(
              localStorage.getItem('login'),
              globals.selectedMenu,
              'ref ' +
                this.selectedArticle.code +
                ' vend ' +
                this.selectedVendeur.code
            )
            .toPromise()
            .then((data) => {
              console.log(data);
            });
          this.selectedVendeur = null;
          this.selectedArticle = null;
          this.blockedDocument = false;
        }
      }
    } else {
      this.blockedDocument = true;
      fa.avoirflag = '1';
      fa.tempsPrix = this.datePipe.transform(
        fa.tempsPrix,
        'dd/MM/yyyy HH:mm:ss.SSS'
      );
      fa.tempsAvoir = this.datePipe.transform(
        dateSys,
        'dd/MM/yyyy HH:mm:ss.SSS'
      );

      await this.faService
        .updateFa(fa)
        .toPromise()
        .then((data) => {});
      await this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          ' '
        )
        .toPromise()
        .then((data) => {
          console.log(data);
        });
      this.blockedDocument = false;
      this.msgs = 'L\'authorisation d\'avoir est donnée !';
      this.styleOvPanel = this.styleOvPanelSuccess;
      this.ov.show(e);
    }
  }
}
