import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock.service';
import { Stock } from '../services/stock';
import { MouveService } from '../services/mouve.service';
import { Mouve1Service } from '../services/mouve1.service';
import { Mouve2Service } from '../services/mouve2.service';
import { CommandeService } from '../services/commande.service';
import { DemandeService } from '../services/demande.service';
import { DdevisService } from '../services/ddevis.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-changementreference',
  templateUrl: './changementreference.component.html',
  styleUrls: ['./changementreference.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ChangementreferenceComponent implements OnInit {
  stocks: Stock[];

  SelectedAncCode = null;
  SelectedNvCode = null;
  constructor(
    private messageService: MessageService,
    private stockService: StockService,
    private commandeService: CommandeService,
    private demandeService: DemandeService,
    private ddevisService: DdevisService,
    private mouveService: MouveService,
    private mouve1Service: Mouve1Service,
    private mouve2Service: Mouve2Service,
    private confirmationService: ConfirmationService
  ) {}

  confirm() {
    if (this.SelectedAncCode !== null) {
      if (this.SelectedNvCode !== null) {
        if (this.SelectedAncCode.code !== this.SelectedNvCode) {
          this.stockService.exists(this.SelectedNvCode).subscribe(data => {
            if (!data) {
              this.confirmationService.confirm({
                message: 'Valider le changement de ' + this.SelectedAncCode.code + ' par ' + this.SelectedNvCode + ' ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Oui',
                rejectLabel: 'Non',
                accept: () => {
                  this.valider();
                  this.reloadDataArts();
                },
                reject: () => {}
              });
            } else {
              this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Erreur',
                detail: 'La nouvelle référence déjà existant !!'
              });
            }
          });
        } else {
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Erreur',
            detail: 'L\' ancienne et la nouvelle référence sont identiques !!'
          });
        }
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Erreur',
          detail: 'Veuillez saisir la nouvelle référence !!'
        });
      }
    } else {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez sélectionner l ancienne référence !!'
      });
    }
  }

  ngOnInit() {
    this.reloadDataArts();
  }
  async reloadDataArts() {
    await this.stockService
      .getStockList('')
      .toPromise()
      .then(data => {
        this.stocks = data['_embedded'].stocks;
      });
  }
  async applyFilterArtParCode(filterValue: string) {
    await this.stockService
      .getStockList(filterValue)
      .toPromise()
      .then(data => {
        this.stocks = data['_embedded'].stocks;
      });
  }

  async valider() {
    const ancCode = this.SelectedAncCode.code;
    const nvCode = this.SelectedNvCode;
    await this.mouveService.updateFusion(ancCode, nvCode).toPromise().then(
      data => {
        console.log('successUpMouve');
      },
      error => console.log('errorMouve')
    );
    await this.commandeService.updateFusion(ancCode, nvCode).toPromise().then(
      data1 => {
        console.log('successUpCommande');
      },
      error => console.log('errorCommande')
    );
    await this.demandeService.updateFusion(ancCode, nvCode).toPromise().then(
      data2 => {
        console.log('successUpDemande');
      },
      error => console.log('errorDemande')
    );
    await this.ddevisService.updateFusion(ancCode, nvCode).toPromise().then(
      data3 => {
        console.log('successUpDdevis');
      },
      error => console.log('errorDdevis')
    );
    await this.mouve1Service.updateFusion(ancCode, nvCode).toPromise().then(
      data4 => {
        console.log('successUpMouve1');
      },
      error => console.log('errorMouve1')
    );
    await this.mouve2Service.updateFusion(ancCode, nvCode).toPromise().then(
      data5 => {
        console.log('successUpMouve2');
      },
      error => console.log('errorMouve2')
    );
    await this.stockService.updateChangement(ancCode, nvCode).toPromise().then(
      data6 => {
        console.log('successUpStock');
      },
      error => console.log('errorStock')
    );
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Success',
      detail: 'Article changé avec succès'
    });
    console.log('update success');
    this.SelectedAncCode = '';
    this.SelectedNvCode = '';
    this.stocks = [];
    this.reloadDataArts();
  }
}
