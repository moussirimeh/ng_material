import { Component, OnInit, ViewChild } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MarqueService } from '../services/marque.service';
import { EDemandeDevisService } from '../services/eDemandeDevis.service';
import { DDemandeDevisService } from '../services/dDemandeDevis.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { StockService } from '../services/stock.service';
import { EDemandeDevis } from '../services/eDemandeDevis';
import { Marque } from '../services/marque';
import { DDemandeDevis } from '../services/dDemandeDevis';

setCulture('fr-FR');
L10n.load({
  'fr-FR': {
    grid: {
      EmptyRecord: ' ',
      EmptyDataSourceError: ' '
    }
  }
});
@Component({
  selector: 'app-demande-devis',
  templateUrl: './demande-devis.component.html',
  styleUrls: ['./demande-devis.component.scss'],
  providers: [MessageService, DatePipe]
})
export class DemandeDevisComponent implements OnInit {
  displayNote = false;
  displayValider = false;
  note = { index: 0, text: '' };
  noteFinal = '';
  detDemDevis: DDemDevis[] = [];
  clonedDemDevis: { [s: string]: DDemDevis } = {};
  stocks = [];
  brands = [];
  marques: { [key: string]: Object }[] = [];
  selectedMarque: Marque = { code: '', nom: '', id: '' };
  codeArticle = '';
  designationArticle = '';
  @ViewChild('gridStock')
  public gridStock: GridComponent;
  selectedType = 'Tout';
  types: any[];
  constructor(
    private marqueService: MarqueService,
    private messageService: MessageService,
    private stockService: StockService,
    private eDemandeDevisService: EDemandeDevisService,
    private dDemandeDevisService: DDemandeDevisService
  ) {
    this.types = [
      { label: 'Tout', value: 'Tout' },
      { label: 'Disponible Uniquement', value: 'Disponible' }
    ];
  }

  async ngOnInit() {
    await this.stockService
      .getStockByCode(this.codeArticle)
      .toPromise()
      .then(data => {
        this.stocks = data['_embedded'].stocks;
      });
    await this.marqueService
      .getMarquesList()
      .toPromise()
      .then(data => {
        this.marques = data['_embedded'].marques;
      });
  }
  annulerSelection() {
    if (this.gridStock.getSelectedRowIndexes()[0] >= 0) {
      this.gridStock.selectRows([]);
    }
  }
  ajouter() {
    if (this.detDemDevis.length < 1) {
      this.detDemDevis.push({
        id: String(this.detDemDevis.length + 1),
        numero: null,
        codeArticle: null,
        designation: '',
        quantite: '1',
        prixArticle: '',
        marque: { code: '', nom: '', id: '' },
        note: '',
        modifiable: true
      });
    } else {
      if (
        this.detDemDevis[this.detDemDevis.length - 1].codeArticle !== '' &&
        this.detDemDevis[this.detDemDevis.length - 1].codeArticle !== null
      ) {
        if (
          this.detDemDevis[this.detDemDevis.length - 1].designation !== '' &&
          this.detDemDevis[this.detDemDevis.length - 1].designation !== null
        ) {
          let i = 0;
          for (const dem of this.detDemDevis) {
            if (
              this.detDemDevis[this.detDemDevis.length - 1].codeArticle ===
              dem.codeArticle
            ) {
              i++;
            }
          }
          if (i < 2) {
            this.detDemDevis.push({
              id: String(this.detDemDevis.length + 1),
              numero: null,
              codeArticle: null,
              designation: '',
              quantite: '1',
              prixArticle: '',
              marque: { code: '', nom: '', id: '' },
              note: '',
              modifiable: true
            });
          } else {
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Error',
              detail: 'La référence est déjà saisie'
            });
          }
        } else {
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: 'La designation est obligatoire'
          });
        }
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Error',
          detail: 'La référence est obligatoire'
        });
      }
    }
  }
  async addArticle() {
    const selectedRow: any = this.gridStock.getSelectedRecords()[0];
    if (this.detDemDevis.length < 1) {
      this.detDemDevis.push({
        id: String(this.detDemDevis.length + 1),
        numero: null,
        codeArticle: selectedRow.code,
        designation: selectedRow.design,
        quantite: '1',
        prixArticle: '',
        marque: { code: '', nom: '', id: '' },
        note: '',
        modifiable: false
      });
    } else {
      if (
        this.detDemDevis[this.detDemDevis.length - 1].codeArticle !== '' &&
        this.detDemDevis[this.detDemDevis.length - 1].codeArticle !== null
      ) {
        if (
          this.detDemDevis[this.detDemDevis.length - 1].designation !== '' &&
          this.detDemDevis[this.detDemDevis.length - 1].designation !== null
        ) {
          if (
            this.detDemDevis[this.detDemDevis.length - 1].quantite !== '' &&
            this.detDemDevis[this.detDemDevis.length - 1].quantite !== null &&
            Number(this.detDemDevis[this.detDemDevis.length - 1].quantite) >
              0 &&
            String(
              Number(this.detDemDevis[this.detDemDevis.length - 1].quantite)
            ) !== 'NaN'
          ) {
            let i = 0;
            for (const dem of this.detDemDevis) {
              if (
                this.detDemDevis[this.detDemDevis.length - 1].codeArticle ===
                dem.codeArticle
              ) {
                i++;
              }
            }
            if (!this.refExist(selectedRow.code) || i < 1) {
              this.detDemDevis.push({
                id: String(this.detDemDevis.length + 1),
                numero: null,
                codeArticle: selectedRow.code,
                designation: selectedRow.design,
                quantite: '1',
                prixArticle: '',
                marque: { code: '', nom: '', id: '' },
                note: '',
                modifiable: false
              });
            } else {
              this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'La référence est déjà saisie'
              });
            }
          } else {
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Error',
              detail: 'La quantité est incorrecte'
            });
          }
        } else {
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: 'La désignation est obligatoire'
          });
        }
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Error',
          detail: 'La référence est obligatoire'
        });
      }
    }
  }
  async rechercheArticle(ind: number) {
    this.stocks = [];
    if (ind === 0) {
      this.designationArticle = '';
      if (this.selectedType === 'Tout') {
        await this.stockService
          .getStockByCode(this.codeArticle)
          .toPromise()
          .then(data => {
            this.stocks = data['_embedded'].stocks;
          });
      } else {
        await this.stockService
          .getStockByCodeAndQte(this.codeArticle, '0')
          .toPromise()
          .then(data => {
            this.stocks = data['_embedded'].stocks;
          });
      }
    }
    if (ind === 1) {
      this.codeArticle = '';
      if (this.selectedType === 'Tout') {
        await this.stockService
          .getStockByDesign(this.designationArticle)
          .toPromise()
          .then(data => {
            this.stocks = data['_embedded'].stocks;
          });
      } else {
        await this.stockService
          .getStockByDesignAndQte(this.designationArticle, '0')
          .toPromise()
          .then(data => {
            this.stocks = data['_embedded'].stocks;
          });
      }
    }
  }

  async onRowEditInit(demDevis: DDemDevis) {
    this.clonedDemDevis[demDevis.codeArticle] = { ...demDevis };
  }

  onRowEditSave(demDevis: DDemDevis) {
    if (Number(demDevis.quantite) > 0) {
      delete this.clonedDemDevis[demDevis.codeArticle];
    } else {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Error',
        detail: 'La quantité est obligatoire'
      });
    }
  }

  onRowEditCancel(demDevis: DDemDevis, index: number) {
    this.detDemDevis[index] = this.clonedDemDevis[demDevis.codeArticle];
    delete this.clonedDemDevis[demDevis.codeArticle];
  }
  onRowDelete(index: number) {
    if (index > -1) {
      this.detDemDevis.splice(index, 1);
    }
  }
  testetRefSaisie(ref: string) {
    if (this.detDemDevis.length < 1) {
      return true;
    } else {
      if (ref === '') {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Error',
          detail: 'La référence est obligatoire'
        });
        return false;
      } else {
        if (this.refExist(ref)) {
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: 'La référence est déjà saisie'
          });
          return false;
        } else {
          return true;
        }
      }
    }
  }
  refExist(ref: string) {
    const obj = this.detDemDevis.find(data => data.codeArticle === ref);
    if (String(obj) !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }
  redigerNote(index: number) {
    this.displayNote = true;
    this.note.index = index;
    this.note.text = this.detDemDevis[index].note;
  }
  enregNote() {
    this.detDemDevis[this.note.index].note = this.note.text;
    this.displayNote = false;
  }
  confirmer() {
    /*if (
      this.detDemDevis.length > 0 &&
      (this.detDemDevis[this.detDemDevis.length - 1].codeArticle === '' ||
        this.detDemDevis[this.detDemDevis.length - 1].codeArticle === null)
    ) {
      this.onRowDelete(this.detDemDevis.length - 1);
    }*/
    let i = 0;
    let ref = '';
    for (let j = 0; j <= this.detDemDevis.length - 1; j++) {
      for (const dem of this.detDemDevis) {
        if (this.detDemDevis[j].codeArticle === dem.codeArticle) {
          i++;
        }
      }
      if (i >= 2) {
        ref = this.detDemDevis[j].codeArticle;
        break;
      } else {
        i = 0;
        ref = '';
      }
    }
    if (i < 2) {
      if (this.detDemDevis.length > 0) {
        if (
          this.detDemDevis[this.detDemDevis.length - 1].codeArticle !== '' &&
          this.detDemDevis[this.detDemDevis.length - 1].codeArticle !== null
        ) {
          if (
            this.detDemDevis[this.detDemDevis.length - 1].designation !== '' &&
            this.detDemDevis[this.detDemDevis.length - 1].designation !== null
          ) {
            if (
              this.detDemDevis[this.detDemDevis.length - 1].quantite !== '' &&
              this.detDemDevis[this.detDemDevis.length - 1].quantite !== null &&
              Number(this.detDemDevis[this.detDemDevis.length - 1].quantite) >
                0 &&
              String(
                Number(this.detDemDevis[this.detDemDevis.length - 1].quantite)
              ) !== 'NaN'
            ) {
              this.displayValider = true;
            } else {
              this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Erreur',
                detail: 'Quantité Incorrecte'
              });
            }
          } else {
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Erreur',
              detail: 'Désignation Obligatoire'
            });
          }
        } else {
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'Erreur',
            detail: 'Référence Obligatoire'
          });
        }
      } else {
        console.log(this.detDemDevis.length);
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'Erreur',
          detail: 'Aucune référence saisie '
        });
      }
    } else {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Error',
        detail: 'Référence [' + ref + '] déjà saisie deux fois ou plus !'
      });
    }
    /*if (
      this.detDemDevis.length > 0 &&
      (this.detDemDevis[this.detDemDevis.length - 1].codeArticle === '' ||
        this.detDemDevis[this.detDemDevis.length - 1].codeArticle === null)
    ) {
      this.onRowDelete(this.detDemDevis.length - 1);
    }*/
  }
  async valider() {
    localStorage.setItem('codeClientPortail', '4111068');
    const codeClientPortail = localStorage.getItem('codeClientPortail');
    let num = '';
    if (this.detDemDevis.length > 0) {
      console.log(this.detDemDevis.length);

      await this.eDemandeDevisService
        .getMaxNumero()
        .toPromise()
        .then(data => {
          num = String(Number(data) + 1);
        });
      const eDemandeDevis: EDemandeDevis = {
        id: null,
        numero: num,
        date: new Date().toLocaleDateString('en-GB'),
        codeClient: codeClientPortail,
        numeroDevis: null,
        note: this.noteFinal
      };
      this.eDemandeDevisService
        .createEDemandeDevis(eDemandeDevis)
        .toPromise()
        .then(data => {});
      for (const dDemDevis of this.detDemDevis) {
        const ddevis: DDemandeDevis = {
          id: null,
          numero: num,
          codeArticle: dDemDevis.codeArticle,
          designation: dDemDevis.designation,
          quantite: dDemDevis.quantite,
          prixArticle: dDemDevis.prixArticle,
          marque: dDemDevis.marque.code,
          note: dDemDevis.note
        };
        this.dDemandeDevisService
          .createDDemandeDevis(ddevis)
          .toPromise()
          .then(data => {});
      }
      this.detDemDevis = [];
      this.displayValider = false;
      this.messageService.add({
        key: 'tc',
        severity: 'success',
        summary: 'Success',
        detail: 'La demande de devis est bien enregistrée sous le numéro ' + num
      });
    } else {
      console.log(this.detDemDevis.length);
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'Aucune référence saisie '
      });
    }
  }
  loadMore() {
    /*
    const element = document.getElementById("flux");
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      console.log("load more ok");
      this.stockService
        .getMoreStocks(
          this.stocks[this.stocks.length - 1].code,
          this.codeArticle,
          this.designationArticle
        )
        .toPromise()
        .then(data => { this.stocks.push(...data['_embedded'].stocks); });

      this.gridStock.refresh();
      // element is at the end of its scroll, load more content
    }*/
    // const element = document.getElementById("flux");
    if (
      this.gridStock.getContent().children[0].scrollHeight -
        this.gridStock.getContent().children[0].scrollTop ===
      this.gridStock.getContent().children[0].clientHeight
    ) {
      if (this.selectedType === 'Tout') {
        this.stockService
          .getMoreStocks(this.stocks[this.stocks.length - 1].code, '-1')
          .toPromise()
          .then(data => {
            this.stocks.push(...data['_embedded'].stocks);
          });
      } else {
        this.stockService
          .getMoreStocks(this.stocks[this.stocks.length - 1].code, '0')
          .toPromise()
          .then(data => {
            this.stocks.push(...data['_embedded'].stocks);
          });
      }

      this.gridStock.refresh();
    }
  }
}
export interface DDemDevis {
  id: string;
  numero: string;
  codeArticle: string;
  designation: string;
  quantite: string;
  prixArticle: string;
  marque: Marque;
  note: string;
  modifiable: boolean;
}
