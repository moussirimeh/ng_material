import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Stock } from '../services/stock';
import { MouveService } from '../services/mouve.service';
import { Mouve1Service } from '../services/mouve1.service';
import { Mouve2Service } from '../services/mouve2.service';
import { CommandeService } from '../services/commande.service';
import { DemandeService } from '../services/demande.service';
import { DdevisService } from '../services/ddevis.service';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { ConfirmationService } from 'primeng/api';
import { EquivalenceService } from '../services/equivalence.service';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-fusionreference',
  templateUrl: './fusionreference.component.html',
  styleUrls: ['./fusionreference.component.scss'],
  providers: [ConfirmationService],
})
export class FusionreferenceComponent implements OnInit {
  stocks: Stock[] = [];
  stocks2: Stock[] = [];
  SelectedCode1 = '';
  SelectedCode2 = '';
  refAEcarter = null;
  rechCodeArt = '';
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
    let temp = [];
    await this.stockService
      .getStock(this.SelectedCode1)
      .toPromise()
      .then((data) => {
        temp = data['_embedded'].stocks;
      });
    if (temp.length !== 1) {
      this.msgs = 'Article non trouvée !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('refAgarder'));
    } else {
      temp = [];
      await this.stockService
        .getStock(this.SelectedCode2)
        .toPromise()
        .then((data) => {
          temp = data['_embedded'].stocks;
        });
      if (temp.length !== 1) {
        this.msgs = 'Article non trouvée !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('refAecarter'));
      } else {
        this.refAEcarter = temp[0];
        if (
          String(this.SelectedCode1) !== 'null' &&
          this.SelectedCode1 !== ''
        ) {
          if (
            String(this.SelectedCode2) !== 'null' &&
            this.SelectedCode2 !== ''
          ) {
            if (this.SelectedCode1 !== this.SelectedCode2) {
              this.confirmationService.confirm({
                message:
                  'Validez la fusion de ' +
                  this.SelectedCode1 +
                  ' avec ' +
                  this.SelectedCode2 +
                  ' ?' +
                  '\n' +
                  this.SelectedCode2 +
                  ' sera écarter',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Oui',
                rejectLabel: 'Non',
                accept: async () => {
                  await this.valider();
                },
              });
            } else {
              this.msgs =
                'La référence à garder et la référence à écarter sont identiques !!';
              this.styleOvPanel = this.styleOvPanelError;
              this.ov.show(e, document.getElementById('btValider'));
            }
          } else {
            this.msgs = 'Veuillez saisir la référence à écarter !!';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('refAecarter'));
          }
        } else {
          this.msgs = 'Veuillez saisir la référence à garder !!';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('refAgarder'));
        }
      }
    }
  }
  ngOnInit() {}
  async valider() {
    this.blockedDocument = true;
    await this.mouveService
      .updateFusion(this.SelectedCode2, this.SelectedCode1)
      .toPromise()
      .then(() => {})
      .catch(() => console.log('errorMouveUpdate'));
    await this.commandeService
      .updateFusion(this.SelectedCode2, this.SelectedCode1)
      .toPromise()
      .then(() => {})
      .catch(() => console.log('errorCommandeUpdate'));
    await this.demandeService
      .updateFusion(this.SelectedCode2, this.SelectedCode1)
      .toPromise()
      .then(() => {})
      .catch(() => console.log('errorDemandeUpdate'));
    await this.ddevisService
      .updateFusion(this.SelectedCode2, this.SelectedCode1)
      .toPromise()
      .then(() => {})
      .catch(() => console.log('errorDdevisUpdate'));
    await this.mouve1Service
      .updateFusion(this.SelectedCode2, this.SelectedCode1)
      .toPromise()
      .then(() => {})
      .catch(() => console.log('errorMouve1Update'));
    await this.mouve2Service
      .updateFusion(this.SelectedCode2, this.SelectedCode1)
      .toPromise()
      .then(() => {})
      .catch(() => console.log('errorMouve2Update'));
    await this.stockService
      .updateFusion(this.SelectedCode1, this.SelectedCode2)
      .toPromise()
      .then(() => {})
      .catch(() => console.log('errorStockUpdate'));
    await this.stockService
      .delete(this.refAEcarter.id)
      .toPromise()
      .then(() => {})
      .catch(() => console.log('errorStockDelete'));

    let equivs = [];
    await this.equivalenceService
      .getEquivParCodeArticle(this.SelectedCode2)
      .toPromise()
      .then((data) => {
        equivs = data['_embedded'].equivalences;
      });
    if (equivs.length > 0) {
      let key_1 = '';
      Object.keys(equivs[0]).forEach((key) => {
        if (key !== 'code' && key !== 'id') {
          if (equivs[0][key] === this.SelectedCode2) {
            key_1 = key;
            equivs[0][key] = null;
          }
          if (key_1 !== '') {
            equivs[0][key_1] = equivs[0][key];
            key_1 = key;
          }
          if ((key = 'code5')) {
            equivs[0][key] = null;
          }
        }
      });
      // console.log(equivs[0]);
      if (equivs[0].code2 !== null && equivs[0].code2 !== '') {
        await this.equivalenceService
          .updateEquivalence(equivs[0])
          .toPromise()
          .then(() => console.log('successUpEquiv'));
      } else {
        await this.equivalenceService
          .deleteEquivalence(equivs[0].id)
          .toPromise()
          .then(() => console.log('successDeleteEquiv'));
      }
    }

    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        this.SelectedCode2 + ' DEVIENT ' + this.SelectedCode1
      )
      .subscribe((data) => {
        console.log(data);
      });
    this.blockedDocument = false;
    this.SelectedCode1 = null;
    this.SelectedCode2 = null;
    this.stocks = [];
    this.stocks2 = [];
  }
}
