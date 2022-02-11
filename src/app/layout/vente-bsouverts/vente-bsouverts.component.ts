import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolbarItems } from '@syncfusion/ej2-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Elivraison } from '../services/elivraison';
import {ElivraisonService} from '../services/elivraison.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';

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
  selector: 'app-vente-bsouverts',
  templateUrl: './vente-bsouverts.component.html',
  styleUrls: ['./vente-bsouverts.component.scss']
})
export class VenteBSOuvertsComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  elivraisons: Elivraison[];
  constructor(private elivraisonService: ElivraisonService) { }
  public customAttributes: Object;
  async ngOnInit() {
    this.customAttributes = {class: 'customcss'};

      // recuperer la liste des bons de sortie ouverts
            await this.elivraisonService
            .getBSOuverts()
            .toPromise()
            .then(data => {
              this.elivraisons = data['_embedded'].bondSorties;
              console.log(data);
              console.log(this.elivraisons);
            })
            .catch(data => {
              console.log('error get elivraisons');
            });

  }


// annuler la selection d'une ligne de l'ejs grid
annulerSelection(): void {
        if (this.grid.getSelectedRowIndexes()[0] >= 0) {
          this.grid.selectRows([]);
        }

}


}
