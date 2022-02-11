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
  selector: 'app-fusionreference',
  templateUrl: './fusionreference.component.html',
  styleUrls: ['./fusionreference.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class FusionreferenceComponent implements OnInit {
  stocks: Stock[] = [];
  SelectedCode1 = null;
  SelectedCode2 = null;
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
    if (this.SelectedCode1 !== null) {
      if (this.SelectedCode2 !== null) {
        if (this.SelectedCode1.code !== this.SelectedCode2.code) {
          this.confirmationService.confirm({
            message: 'Valider la Fusion de ' + this.SelectedCode1.code + ' avec ' + this.SelectedCode2.code + ' ?',
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
            detail: 'La référence à garder et la référence à écarter sont identiques !!'
          });
        }
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Erreur',
          detail: 'Veuillez selectionner la référence à écarter !!'
        });
      }
    } else {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez selectionner la référence à garder !!'
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
        const temp = data['_embedded'].stocks;
        this.stocks = temp;
      });
  }
  async applyFilterArtParCode(filterValue: string) {
    await this.stockService
      .getStockList(filterValue)
      .toPromise()
      .then(data => {
        const temp = data['_embedded'].stocks;
        this.stocks = temp;
      });
  }
  async valider() {
    await this.mouveService
      .updateFusion(this.SelectedCode1.code, this.SelectedCode2.code)
      .toPromise()
      .then(data => {
        console.log('successUpMouve');
      })
      .catch(error => console.log('errorMouveUpdate'));
    await this.commandeService
      .updateFusion(this.SelectedCode1.code, this.SelectedCode2.code)
      .toPromise()
      .then(dataCommande => {
        console.log('successUpCommande');
      })
      .catch(error => console.log('errorCommandeUpdate'));
    await this.demandeService
      .updateFusion(this.SelectedCode1.code, this.SelectedCode2.code)
      .toPromise()
      .then(dataDemande => {
        console.log('successUpDemande');
      })
      .catch(error => console.log('errorDemandeUpdate'));
    await this.ddevisService
      .updateFusion(this.SelectedCode1.code, this.SelectedCode2.code)
      .toPromise()
      .then(dataDdevis => {
        console.log('successUpDdevis');
      })
      .catch(error => console.log('errorDdevisUpdate'));
    await this.mouve1Service
      .updateFusion(this.SelectedCode1.code, this.SelectedCode2.code)
      .toPromise()
      .then(dataMouve1 => {
        console.log('successUpMouve1');
      })
      .catch(error => console.log('errorMouve1Update'));
    await this.mouve2Service
      .updateFusion(this.SelectedCode1.code, this.SelectedCode2.code)
      .toPromise()
      .then(dataMouve2 => {
        console.log('successUpMouve2');
      })
      .catch(error => console.log('errorMouve2Update'));
    await this.stockService
      .updateFusion(this.SelectedCode1.code, this.SelectedCode2.code)
      .toPromise()
      .then(dataStock => {
        console.log('successUpStock');
      })
      .catch(error => console.log('errorStockUpdate'));
    await this.stockService
      .delete(this.SelectedCode2.id)
      .toPromise()
      .then(dataStockDelete => {
        console.log('successDelStock');
      })
      .catch(error => console.log('errorStockDelete'));
    console.log('update success');
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Success',
      detail: 'Références fusionnées avec succès'
    });
    this.SelectedCode1 = '';
    this.SelectedCode2 = '';
    this.stocks = [];
    this.reloadDataArts();
  }
}
