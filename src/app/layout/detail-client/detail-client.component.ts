import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ExcelExportProperties, GridComponent, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { Groupe } from '../services/groupe';
import { GroupeService } from '../services/groupe.service';
import { Zone } from '../services/zone';
import { ZoneService } from '../services/zone.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
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
  selector: 'app-detail-client',
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.scss']
})
export class DetailClientComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('op')
  public op: OverlayPanel;
  public searchOptions: SearchSettingsModel;
  listeZones: any;
  SelectedZones: any ;
  readonly: boolean ;
  listegroupe: any;
  Selectedgroupe: any ;
  tva: string ;
  radiobtn = '1' ;
  Cingerant: string ;
  nomgerant: string ;
  clients: any;
  SelectedClients: any ;
  codeclient: string ;
  liste: any ;
  selected: any;
  btnaff = false ;
  msg: string;
  wasInside: any;

  constructor(
    private config: NgSelectConfig ,
    private groupeService: GroupeService ,
    private zoneService: ZoneService ,
    private clientService: ClientService ,
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
   }
   @HostListener('document:click')
   clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
   }

  ngOnInit() {
    this.listeZones = new Array() ;
    this.listegroupe = new Array() ;
    this.clients = new Array() ;
    this.liste = new Array();
    this.SelectedZones = '' ;
    this.codeclient = '' ;
    this.Selectedgroupe = '' ;
    this.tva = '' ;
    this.Cingerant = '' ;
    this.nomgerant = '' ;
  }

  rowSelected() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selected = selected;
      console.log('selectedoffre************', this.selected);

    }
  }

  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.selected = new Array() ;
    }
  }

  async chargerZone() {
    if (this.listeZones.length === 0) {
      await this.zoneService
        .getZonesList()
        .toPromise()
        .then((data) => {
          console.log('liste des zones ', data);
          this.listeZones = data['_embedded'].zones;
        });
    }
  }

  changeZones() {}
  public onSearchZones(word: string, item: Zone): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async chargerGroupe() {
    if (this.listegroupe.length === 0) {
      await this.groupeService
        .getGroupesList()
        .toPromise()
        .then((data) => {
          console.log('liste des groupes', data);
          this.listegroupe = data['_embedded'].groupes;
        });
    }
  }

  changeGroupe() {}
  public onSearchGroupe(word: string, item: Groupe): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async chargerClient() {
    if ( this.clients.length === 0 ) {
      await this.clientService
      .getClientsListByOrderByDeno()
      .toPromise()
      .then( data => {
        this.clients = data['_embedded'].clients ;
        console.log('listeclient = ', this.clients);

      }) ;
    }
  }
  changeClients() {
    console.log('selectedclient =', this.SelectedClients);

    if (this.SelectedClients !== null && this.SelectedClients !== undefined) {
     this.codeclient = this.SelectedClients.code ;
     console.log('code client ' , this.codeclient );

    } else { this.codeclient = '' ; }
  }
  public onSearchClients(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async Afficher(e) {
    this.wasInside = true;
    await this.clientService
    .listeDetailClient(this.SelectedZones, this.codeclient, this.Selectedgroupe, this.tva, this.Cingerant, this.nomgerant)
    .toPromise()
    .then( data => {
      this.liste = data;
      console.log('listedetailclient = ', this.liste);

    }) ;

    if (this.liste.length !== 0) {
      this.btnaff = true ;
    } else {
      this.msg = 'Aucun Client selectioné !';
      this.op.show(e, document.getElementById('btnAfficher'));
    }

  }
  Initialiser() {
    this.radiobtn = '1' ;
    this.SelectedClients = new Array() ;
    this.SelectedZones = '' ;
    this.codeclient = '' ;
    this.Selectedgroupe = '' ;
    this.tva = '' ;
    this.Cingerant = '' ;
    this.nomgerant = '' ;
  }
  NouvelleListe() {
    this.btnaff = false ;
    this.liste = new Array() ;
    this.SelectedClients = new Array() ;
    this.SelectedZones = '' ;
    this.codeclient = '' ;
    this.Selectedgroupe = '' ;
    this.tva = '' ;
    this.Cingerant = '' ;
    this.nomgerant = '' ;
  }
  excelExport() {
    if (this.liste.length !== 0) {
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'ListeDetailsClient' + ' : ' + new Date().toLocaleDateString('en-GB') + '.xlsx'
      };
      this.grid.excelExport(excelExportProperties);
    }
  }
}
