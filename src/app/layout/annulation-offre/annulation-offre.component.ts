import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { ConfirmationService, OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { EdevisService } from '../services/edevis.service';
import { DdevisService } from '../services/ddevis.service';
import { globals } from 'src/environments/environment';
setCulture('de-DE');
L10n.load({
  'de-DE': {
    grid: {
      EmptyRecord: [],
    },
  },
});
@Component({
  selector: 'app-annulation-offre',
  templateUrl: './annulation-offre.component.html',
  styleUrls: ['./annulation-offre.component.scss'],
  providers: [ConfirmationService],
})
export class AnnulationOffreComponent implements OnInit {
  offres = [];
  numeroOffre = '';
  disableNumOffre = false;
  blockDocument = false;
  enteteDevis = {
    id: '',
    numDev: '',
    datDev: '',
    net: '',
    ht: '',
    remise: '',
    cltDev: '',
    vendeur: '',
    ref: '',
    base0: '',
    base10: '',
    base17: '',
    base29: '',
    purDev: '',
    tauxTva: '',
    modep: '',
    delLiv: '',
    delOp: '',
    refDem: '',
    dateEnvoi: '',
    attention: '',
    basPage: '',
    suivie: '',
    agenda: '',
    mtSatisfTtc: '',
    remGen: '',
    denoClient: '',
    denoVendeur: '',
    adresseClient: '',
    villeClient: '',
  };
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
    private edevisService: EdevisService,
    private ddevisService: DdevisService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    document.getElementById('numOffre').focus();
  }
  async annulerOffre(e) {
    this.confirmationService.confirm({
      message:
        'Voulez-vous confirmer la suppression de l\'offre ' +
        this.numeroOffre +
        ' ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        await this.supprimerOffre();
        this.initialiser();
      },
    });
  }
  async supprimerOffre() {
    this.blockDocument = true;
    // delete ddevis
    await this.ddevisService
      .deleteDdevisByCombine(this.numeroOffre)
      .toPromise()
      .then();
    // delete edevis
    await this.edevisService
      .deleteEdevisById(this.enteteDevis.id)
      .toPromise()
      .then();
    // journalisation
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        this.numeroOffre
      )
      .toPromise()
      .then();
    this.blockDocument = false;
  }
  initialiser() {
    this.enteteDevis = {
      id: '',
      numDev: '',
      datDev: '',
      net: '',
      ht: '',
      remise: '',
      cltDev: '',
      vendeur: '',
      ref: '',
      base0: '',
      base10: '',
      base17: '',
      base29: '',
      purDev: '',
      tauxTva: '',
      modep: '',
      delLiv: '',
      delOp: '',
      refDem: '',
      dateEnvoi: '',
      attention: '',
      basPage: '',
      suivie: '',
      agenda: '',
      mtSatisfTtc: '',
      remGen: '',
      denoClient: '',
      denoVendeur: '',
      adresseClient: '',
      villeClient: '',
    };
    this.offres = [];
    this.numeroOffre = '';
    this.disableNumOffre = false;
    setTimeout(() => document.getElementById('numOffre').focus(), 10);
  }
  async validerNumOffre(e) {
    this.blockDocument = true;
    if (this.numeroOffre !== '0') {
      let tmp = '';
      for (let i = 0; i < 5 - this.numeroOffre.length; i++) {
        tmp = tmp + '0';
      }
      this.numeroOffre = tmp + this.numeroOffre;
    }
    let edevis = [];
    await this.edevisService
      .getEdevisForAnnulationOffre(this.numeroOffre)
      .toPromise()
      .then((data) => {
        edevis = data['_embedded'].edevisAnnulationOffres;
      });
    if (edevis.length > 0) {
      this.enteteDevis = edevis[0];
      this.enteteDevis.attention = String(this.enteteDevis.attention);
      let ddevis = [];
      await this.ddevisService
        .findByCombineOrderByRang(this.numeroOffre)
        .toPromise()
        .then((data) => {
          ddevis = data['_embedded'].ddevis;
        });
      if (ddevis.length > 0) {
        for (const ddev of ddevis) {
          ddev.quantite = Number(ddev.quantite).toFixed(2);
          ddev.prix = Number(ddev.prix).toFixed(3);
          ddev.tauxTva = Number(ddev.tauxTva).toFixed(2);
          ddev.tRemise = Number(ddev.tRemise).toFixed(2);
        }
      }
      this.offres = ddevis;
      this.disableNumOffre = true;
    } else {
      this.msgs = 'Offre client inéxistant !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('numOffre').focus();
      this.ov.show(e, document.getElementById('numOffre'));
    }
    this.blockDocument = false;
  }
}
