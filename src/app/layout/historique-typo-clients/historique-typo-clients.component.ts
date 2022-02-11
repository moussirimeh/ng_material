import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ClientService } from '../services/client.service';
import {NgSelectConfig} from '@ng-select/ng-select' ;
import { OverlayPanel } from 'primeng/primeng';
import { TabTypClService } from '../services/tab-typ-cl.service';
import { DatePipe } from '@angular/common';
import { L10n, setCulture } from '@syncfusion/ej2-base';
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
import {
  ExcelExportProperties,
  ToolbarService,
  ToolbarItems,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-historique-typo-clients',
  templateUrl: './historique-typo-clients.component.html',
  styleUrls: ['./historique-typo-clients.component.scss'],
  providers: [DatePipe, ExcelService, ToolbarService]

})
export class HistoriqueTypoClientsComponent implements OnInit {
  readonly: boolean;
  affichBTn: boolean;
  afficherGrid = false;
  btnNouvelSaisie: boolean;
  listeClients = new Array();
  selectedclt: any;
  codeClt: string;
  denoClt: string;



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
  datasourceGrid: any[];
  listehistorique = new Array();

  constructor( private clientService: ClientService ,
    private config: NgSelectConfig ,
    private tabTypClService: TabTypClService,
    private datePipe: DatePipe,
    private excelService: ExcelService
    ) {
      this.config.notFoundText = 'Aucun élement trouvé' ;
      this.config.clearAllText = 'Supprimer tous ';
      }

  async chargerClients() {
    if (this.listeClients.length === 0) {
      await this.clientService
        .getClientsListByOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des clients ', data['_embedded'].clients);

          this.listeClients = data['_embedded'].clients;
        });
    }
  }
  async applyFilterClientParCode(e) {
    let filteredElements = [];
    await this.clientService
      .getClientByCode(e.target.value)
      .toPromise()
      .then((data) => {
        filteredElements = data['_embedded'].clients;
      });
    if (filteredElements.length > 0) {
      this.selectedclt = filteredElements[0];

    } else {

      this.msgs = 'Code Client Inexistant !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('codeClt').focus();
      this.ov.show(e, document.getElementById('codeClt'));
    }
  }

  intialiserSelectedClient() {

    this.selectedclt = {
      id: null,
      code: null,
      deno: null,
      adresse: null,
      ville: null,
      post: null,
      respon: null,
      tel: null,
      agence: null,
      banque: null,
      telex: null,
      fax: null,
      cadnat: null,
      compte: null,
      edition: null,
      exonor: null,
      duree: null,
      reg: null,
      terme: null,
      marque: null,
      plafond: null,
      zone: null,
      comm: null,
      assujet: null,
      codeTva: null,
      timbre: null,
      ech: null,
      bloc: null,
      datBlc: null,
      typeC: null,
      regle: null,
      lettre: null,
      codeC: null,
      autor: null,
      eMail: null,
      typeComm: null,
      rec: null,
      vend: null,
      represant: null,
      secteur: null,
      objectif: null,
      nature: null,
      datCreat: null,
      mag: null,
      respons2: null,
      adresseusine: null,
      adressesiege: null,
      gsm1: null,
      gsm2: null,
      nouvMag: null,
      ca123: null,
      respons3: null,
      fonction1: null,
      fonction2: null,
      fonction3: null,
      eMail1: null,
      eMail2: null,
      eMail3: null,
      tel2: null,
      tel3: null,
      gsm3: null,
      codGroupe: null,
      modeReg: null,
      plafondEncours: null,
      indic: null,
      bcExige: null,
    };
  }

async afficher() {
  this.affichBTn = false;
  this.afficherGrid = true;
  this.readonly = true;
   this.datasourceGrid = new Array();
// service historique Client //
  await this.tabTypClService.historiqueTypoClt( this.codeClt)
  .toPromise()
  .then((data) => {
    this.listehistorique = data['_embedded'].tabTypCl;

    console.log('historique clt =', this.listehistorique);

    this.datasourceGrid =   this.listehistorique.map(function(val) {
        return  {
          operateur : val.operateur,
          date : this.datePipe.transform(val.date, 'dd/MM/yyyy HH:mm:SS '),
          typologie : val.typologie,
          denoClt : this.denoClt
         };
    }, this);



 });

}
  public onSearchDeno(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  changeClient() {
    if (this.selectedclt !== null && this.selectedclt !== undefined) {
      this.codeClt = this.selectedclt.code;
      this.denoClt = this.selectedclt.deno;
    } else {
      this.codeClt = '';
      this.denoClt = '';

    }
    console.log('code client = ', this.selectedclt);

  }
  nouvelleSaisie() {
    this.afficherGrid = false;
    this.affichBTn = true;
    this.readonly = false;
    this.btnNouvelSaisie = false;
  }
  gererExcel() {
    const exportExcel = this.datasourceGrid.map(obj => {
      return {
        'Code Client': obj.operateur,
        'Dénomination ': obj.denoClt,
        'Date': obj.date,
        'Typologie': obj.typologie

      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
     'historique typologie: ' + new Date().toLocaleDateString('en-GB')

    );
    }
  ngOnInit() {
    this.affichBTn = true;


  }

}
