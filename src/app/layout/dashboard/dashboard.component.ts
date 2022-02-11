import { Component, OnInit } from '@angular/core';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import { BrouService } from '../services/brou.service';
import { CreancesClientsService } from '../services/creancesClients.service';
import { RecettesService } from '../services/recettes.service';
import * as jspdf from 'jspdf';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  places = [];
  baniere = [];
  responsiveOptions;
  ste: Ste = {
    id: '',
    logiciel: '',
    codep: '',
    societe: '',
    adresse: '',
    ville: '',
    tel: '',
    fax: '',
    deno: '',
    gros: '',
    compta: '',
    stock1Null: '',
    rec: '',
    instance: '',
    reservatio: '',
    gerant: '',
    datsave: '',
    soldecc: '',
    soldece: '',
    dsoldec: '',
    email: '',
    matricule: '',
    ligneImpot: ''
  };
  dataCommandes: any;
  dataFactures: any;
  dataBls: any;
  creanceClient: any = {
    id: '',
    deno: '',
    reg: '',
    ech: '',
    solde: '',
    montantC: '',
    imp: { value: '', pourc: 0 },
    r30: { value: '', pourc: 0 },
    r60: { value: '', pourc: 0 },
    r90: { value: '', pourc: 0 },
    r91: { value: '', pourc: 0 }
  };
  facturesPayes: number;
  facturesNonPayes: number;
  blsLivres: number;
  blsNonLivres: number;
  selectedClient;
  constructor(
    private steService: SteService,
    private brouService: BrouService,
    private recettesService: RecettesService,
    private clientService: ClientService,
    private creancesClientsService: CreancesClientsService
  ) {
    localStorage.setItem('isdashboard', 'true');
    this.places = [
      {
          imgSrc: 'assets/images/EQM.png',
          place: 'Cozy 5 Stars Apartment',
          description:
              // tslint:disable-next-line:max-line-length
              'The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.',
          charge: '$899/night',
          location: 'Barcelona, Spain'
      },
      {
          imgSrc: 'assets/images/EQM1.png',
          place: 'Office Studio',
          description:
              // tslint:disable-next-line:max-line-length
              'The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the night life in London, UK.',
          charge: '$1,119/night',
          location: 'London, UK'
      },
      {
          imgSrc: 'assets/images/EQM2.png',
          place: 'Beautiful Castle',
          description:
              // tslint:disable-next-line:max-line-length
              'The place is close to Metro Station and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Milan.',
          charge: '$459/night',
          location: 'Milan, Italy'
      }
  ];
    this.responsiveOptions = [
      {
        breakpoint: '500px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.dataCommandes = {
      labels: ['Non Soldé', 'Soldé'],
      datasets: [
        {
          data: [350, 130],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
  }
  async ngOnInit() {/*
    localStorage.setItem('codeClientPortail', '4111068');
    const codeClientPortail = localStorage.getItem('codeClientPortail');
    await this.brouService
      .getNumberOfFactsPortail(codeClientPortail, null)
      .toPromise()
      .then(data => {
        this.facturesNonPayes = Number(Number(data).toFixed(0));
      });
    await this.brouService
      .getNumberOfFactsPortail(codeClientPortail, '')
      .toPromise()
      .then(data => {
        this.facturesPayes =
          Number((Number(data) - this.facturesNonPayes).toFixed(0)) + 1;
      });
    this.dataFactures = {
      labels: ['Non Payés', 'Payés'],
      datasets: [
        {
          data: [this.facturesNonPayes, this.facturesPayes],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    await this.recettesService
      .getNumberOfBlsPortail(codeClientPortail, '')
      .toPromise()
      .then(data => {
        this.blsNonLivres = Number(Number(data).toFixed(0));
      });
    await this.brouService
      .getNumberOfFactsPortail(codeClientPortail, '')
      .toPromise()
      .then(data => {
        this.blsLivres = Number((Number(data) - this.blsNonLivres).toFixed(0));
      });
    this.dataBls = {
      labels: ['Non Livré', 'Livré'],
      datasets: [
        {
          data: [this.blsNonLivres, this.blsLivres],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }
      ]
    };
    await this.steService
      .getSte()
      .toPromise()
      .then(data => {
        this.ste = data['_embedded'].ste[0];
      });
    this.baniere = [
      { id: 1, name: 'SKF' },
      { id: 2, name: 'DANFOSS' },
      { id: 3, name: 'WEG' },
      { id: 4, name: 'ROSSI' },
      { id: 5, name: 'FESTO' },
      { id: 6, name: 'PNEUMAX' },
      { id: 7, name: 'TEXROPE' },
      { id: 8, name: 'BRAMPTON' },
      { id: 9, name: 'CHALLENGE' },
      { id: 10, name: 'ROCARR' },
      { id: 11, name: 'SIAM' },
      { id: 12, name: 'RULMECA' }
    ];
    await this.creancesClientsService
      .getCreancesClientPortail(codeClientPortail)
      .toPromise()
      .then(data => {
        this.creanceClient.id = data.id;
        this.creanceClient.deno = data.deno;
        this.creanceClient.reg = data.reg;
        this.creanceClient.ech = data.ech;
        this.creanceClient.solde = Number(data.solde)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.creanceClient.montantC = Number(data.montantC)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.creanceClient.imp.value = Number(data.imp)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.creanceClient.imp.pourc = Number(
          ((100 * Number(data.imp)) / Number(data.solde)).toFixed(0)
        );
        this.creanceClient.r30.value = Number(data.r30)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.creanceClient.r30.pourc = Number(
          ((100 * Number(data.r30)) / Number(data.solde)).toFixed(0)
        );
        this.creanceClient.r60.value = Number(data.r60)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.creanceClient.r60.pourc = Number(
          ((100 * Number(data.r60)) / Number(data.solde)).toFixed(0)
        );
        this.creanceClient.r90.value = Number(data.r90)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.creanceClient.r90.pourc = Number(
          ((100 * Number(data.r90)) / Number(data.solde)).toFixed(0)
        );
        this.creanceClient.r91.value = Number(data.r91)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.creanceClient.r91.pourc = Number(
          ((100 * Number(data.r91)) / Number(data.solde)).toFixed(0)
        );
      });*/
  }
  async imprimer() {
    await this.clientService
      .getClientByCode(localStorage.getItem('codeClientPortail'))
      .toPromise()
      .then(data => {
        this.selectedClient = data['_embedded'].clients[0];
      });
    // const displayDate = new Date().toLocaleDateString('en-GB');
    // const displayTime = new Date().toLocaleTimeString();
    const doc1 = new jspdf();
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text(this.ste.societe, 14, 10);
    doc1.text(this.ste.adresse, 14, 15);
    doc1.text(this.ste.codep + '     ' + this.ste.ville, 14, 20);
    doc1.text('Tel: ' + this.ste.tel + '   ' + 'Fax: ' + this.ste.fax, 14, 25);
    doc1.text('E-mail: ' + this.ste.email, 14, 30);

    doc1.setFontSize(12);
    doc1.setFontStyle('arial');

    doc1.rect(115, 10, 80, 32);
    doc1.text(this.selectedClient.deno, 120, 15);
    doc1.text(this.isNull(this.selectedClient.adresse), 120, 21);
    doc1.text(this.isNull(this.selectedClient.ville), 120, 27);
    doc1.text('Tel : ' + this.isNull(this.selectedClient.tel), 120, 33);
    doc1.text('Fax : ' + this.isNull(this.selectedClient.fax), 120, 39);

    doc1.setFontSize(15);
    doc1.setFontType('bold');
    doc1.text('Informations Utiles : ', 20, 50);
    doc1.setFontSize(12);
    doc1.setFontType('normal');
    window.open(doc1.output('bloburl'), '_blank');
  }
  isNull(chaine: any): string {
    if (chaine === null) {
      return '';
    } else {
      return chaine;
    }
  }
}
