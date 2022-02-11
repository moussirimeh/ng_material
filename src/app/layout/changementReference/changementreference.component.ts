import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Stock } from '../services/stock';
import { MouveService } from '../services/mouve.service';
import { Mouve1Service } from '../services/mouve1.service';
import { Mouve2Service } from '../services/mouve2.service';
import { CommandeService } from '../services/commande.service';
import { DemandeService } from '../services/demande.service';
import { DdevisService } from '../services/ddevis.service';
import { EquivalenceService } from '../services/equivalence.service';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { ConfirmationService } from 'primeng/api';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-changementreference',
  templateUrl: './changementreference.component.html',
  styleUrls: ['./changementreference.component.scss'],
  providers: [ConfirmationService],
})
export class ChangementreferenceComponent implements OnInit {
  stocks: Stock[];
  blockedDocument = false;
  SelectedAncCode = '';
  SelectedNvCode = '';
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
    private stockService: StockService,
    private commandeService: CommandeService,
    private demandeService: DemandeService,
    private ddevisService: DdevisService,
    private mouveService: MouveService,
    private mouve1Service: Mouve1Service,
    private mouve2Service: Mouve2Service,
    private equivalenceService: EquivalenceService,
    private loginService: LoginService,
    private confirmationService: ConfirmationService
  ) {}

  async confirm(e) {
    this.wasInside = true;
    this.ov.hide();
    if (
      String(this.SelectedAncCode) !== 'null' &&
      this.SelectedAncCode !== ''
    ) {
      if (
        String(this.SelectedNvCode) !== 'null' &&
        this.SelectedNvCode !== ''
      ) {
        if (this.SelectedAncCode !== this.SelectedNvCode) {
          let temp = [];
          await this.stockService
            .getStock(this.SelectedAncCode)
            .toPromise()
            .then((data) => {
              temp = data['_embedded'].stocks;
            });
          if (temp.length !== 1) {
            this.msgs = 'Article non trouvée !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('ancRef'));
          } else {
            await this.stockService
              .exists(this.SelectedNvCode)
              .toPromise()
              .then((data) => {
                if (!data) {
                  this.confirmationService.confirm({
                    message:
                      'Validez le changement de ' +
                      this.SelectedAncCode +
                      ' avec ' +
                      this.SelectedNvCode +
                      ' ?',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'Oui',
                    rejectLabel: 'Non',
                    accept: async () => {
                      await this.valider(e);
                    },
                  });
                  // this.reloadDataArts();
                } else {
                  this.msgs = 'La nouvelle référence déjà existant !!';
                  this.styleOvPanel = this.styleOvPanelError;
                  document.getElementById('nvlRef').focus();
                  this.ov.show(e, document.getElementById('nvlRef'));
                }
              });
          }
        } else {
          this.msgs = 'L\'ancienne et la nouvelle référence sont identiques !!';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btValider'));
        }
      } else {
        this.msgs = 'Veuillez saisir la nouvelle référence !!';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('nvlRef'));
      }
    } else {
      this.msgs = 'Veuillez sélectionner l\'ancienne référence !!';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('ancRef'));
    }
  }

  ngOnInit() {}
  async applyFilterArtParCode(filterValue: string) {
    await this.stockService
      .getStockList(filterValue)
      .toPromise()
      .then((data) => {
        this.stocks = data['_embedded'].stocks;
      });
  }

  async valider(e) {
    this.blockedDocument = true;
    const ancCode = this.SelectedAncCode;
    const nvCode = this.SelectedNvCode;
    await this.mouveService
      .updateFusion(ancCode, nvCode)
      .toPromise()
      .then(
        (data) => {
          console.log('successUpMouve');
        },
        (error) => console.log('errorMouve')
      );
    await this.commandeService
      .updateFusion(ancCode, nvCode)
      .toPromise()
      .then(
        (data1) => {
          console.log('successUpCommande');
        },
        (error) => console.log('errorCommande')
      );
    await this.demandeService
      .updateFusion(ancCode, nvCode)
      .toPromise()
      .then(
        (data2) => {
          console.log('successUpDemande');
        },
        (error) => console.log('errorDemande')
      );
    await this.ddevisService
      .updateFusion(ancCode, nvCode)
      .toPromise()
      .then(
        (data3) => {
          console.log('successUpDdevis');
        },
        (error) => console.log('errorDdevis')
      );
    await this.mouve1Service
      .updateFusion(ancCode, nvCode)
      .toPromise()
      .then(
        (data4) => {
          console.log('successUpMouve1');
        },
        (error) => console.log('errorMouve1')
      );
    await this.mouve2Service
      .updateFusion(ancCode, nvCode)
      .toPromise()
      .then(
        (data5) => {
          console.log('successUpMouve2');
        },
        (error) => console.log('errorMouve2')
      );
    await this.stockService
      .updateChangement(ancCode, nvCode)
      .toPromise()
      .then(
        (data6) => {
          console.log('successUpStock');
        },
        (error) => console.log('errorStock')
      );
      let equivs = [];
      await this.equivalenceService
        .getEquivParCodeArticle(ancCode)
        .toPromise()
        .then((data) => {
          equivs = data['_embedded'].equivalences;
        });
      if (equivs.length > 0) {
        Object.keys(equivs[0]).forEach((key) => {
          if (equivs[0][key] === ancCode) {
            equivs[0][key] = nvCode;
          }
        });
        await this.equivalenceService
          .updateEquivalence(equivs[0])
          .toPromise()
          .then(() => console.log('successUpEquiv'));
      }
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        'ANC ' + ancCode + ' NOUV ' + nvCode
      )
      .subscribe((data) => {
        console.log(data);
      });
    this.blockedDocument = false;
    this.SelectedAncCode = null;
    this.SelectedNvCode = '';
    this.stocks = [];
  }
}
