import {
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { ImpressionFactures } from '../services/impressionFacture';
import { ImpressionFacturesService } from '../services/impressionFactures.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import * as jspdf from 'jspdf';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Login } from 'src/app/login/login';

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
  selector: 'app-impressionfactures',
  templateUrl: './impressionfactures.component.html',
  styleUrls: ['./impressionfactures.component.scss'],
  providers: [DatePipe],
})
export class ImpressionFacturesComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @Input() codeCltRelve = null;
  @Input() numChecked = false;
  dateChecked = false;
  dateVisible = false;
  date = new Date();
  @Input() numero1 = '';
  @Input() numero2 = '';
  clients: Client[];
  factures: ImpressionFactures[] = [];
  selectedClient: Client;
  @Input() numDisable = false;
  afficherClicked = false;
  @Input() relve = true;
  tn: any;
  factsAimp: any[] = [];
  dataTva = [];
  progressValue;
  progressVisible = false;
  //////////////////////////////////////////
  res;
  plus;
  diz;
  s;
  un;
  mil;
  mil2;
  ent;
  deci;
  centi;
  pl;
  pl2;
  conj;

  t = [
    '',
    'Un',
    'Deux',
    'Trois',
    'Quatre',
    'Cinq',
    'Six',
    'Sept',
    'Huit',
    'Neuf',
  ];
  t2 = [
    'Dix',
    'Onze',
    'Douze',
    'Treize',
    'Quatorze',
    'Quinze',
    'Seize',
    'Dix-sept',
    'Dix-huit',
    'Dix-neuf',
  ];
  t3 = [
    '',
    '',
    'Vingt',
    'Trente',
    'Quarante',
    'Cinquante',
    'Soixante',
    'Soixante',
    'Quatre-vingt',
    'Quatre-vingt',
  ];
  //////////////////////////////////////////
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
    private clientService: ClientService,
    private impressionFacturesService: ImpressionFacturesService,
    private datePipe: DatePipe,
    private steService: SteService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  async ngOnInit() {
    this.tn = {
      firstDayOfWeek: 1,
      dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
      ],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
      monthNames: [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre',
      ],
      monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Avr',
        'Mai',
        'Jun',
        'Jul',
        'Aou',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy',
    };
    this.intialiserSelectedClient();
    await this.reloadDataClients();
  }
  async applyFilterClientParDeno(filtredValue: string) {
    await this.clientService
      .getClientsTop100ByDenoStartsWith(filtredValue)
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }
  async reloadDataClients() {
    await this.clientService
      .getClientsList()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
        this.clients.unshift(this.selectedClient);
      });
  }

  intialiserSelectedClient() {
    this.selectedClient = {
      id: null,
      code: null,
      deno: '',
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
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    let dat = null;
    if (!this.dateChecked) {
      dat = '';
    } else {
      dat = this.datePipe.transform(this.date, 'yyyy-dd-MM');
    }
    if (!this.numChecked) {
      this.numero1 = '';
      this.numero2 = '';
    } else {
      if (this.numero1.length !== 5) {
        this.msgs = 'Numero 1 incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('num1').focus();
        this.ov.show(e, document.getElementById('num1'));
        return;
      }
      if (this.numero2.length !== 5) {
        this.msgs = 'Numero 2 incorrect !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('num2').focus();
        this.ov.show(e, document.getElementById('num2'));
        return;
      }
    }
    if (this.codeCltRelve === null || this.codeCltRelve === '') {
      if (this.selectedClient !== null) {
        if (this.selectedClient.id !== null || this.selectedClient.id !== '') {
          await this.impressionFacturesService
            .getImprFactList(
              dat,
              this.selectedClient.code,
              this.numero1,
              this.numero2
            )
            .toPromise()
            .then((data) => {
              this.factures = data['_embedded'].impressionfactures;
            });
        } else {
          await this.impressionFacturesService
            .getImprFactList(dat, '', this.numero1, this.numero2)
            .toPromise()
            .then((data) => {
              this.factures = data['_embedded'].impressionfactures;
            });
        }
      } else {
        await this.impressionFacturesService
          .getImprFactList(dat, '', this.numero1, this.numero2)
          .toPromise()
          .then((data) => {
            this.factures = data['_embedded'].impressionfactures;
          });
      }
    } else {
      await this.impressionFacturesService
        .getImprFactList(dat, this.codeCltRelve, this.numero1, this.numero2)
        .toPromise()
        .then((data) => {
          this.factures = data['_embedded'].impressionfactures;
        });
    }
    if (this.factures.length < 1) {
      this.msgs = 'Aucune Facture pour ces paramètres !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btAfficher'));
    } else {
      for (const fac of this.factures) {
        fac.net = fac.net.replace(/\d(?=(\d{3})+\.)/g, '$& ');
      }
    }
  }
  async imprimerDetails() {
    this.progressValue = 0;
    this.progressVisible = true;
    const longLignes = 204;
    const startFooter = 218;
    let compteur = 1;
    const doc1 = new jspdf();
    for (const fc of this.factures) {
      await this.impressionFacturesService
        .getFactAimprimer(fc.numero)
        .toPromise()
        .then((data) => {
          this.factsAimp = data['_embedded'].factureImprims;
        });
      await this.impressionFacturesService
        .getTvaFacture(fc.numero)
        .toPromise()
        .then((data) => {
          this.dataTva = data;
        });

      let clt = {
        id: '',
        code: '',
        deno: '',
        adresse: '',
        ville: '',
        post: '',
        respon: '',
        tel: '',
        agence: '',
        banque: '',
        telex: '',
        fax: '',
        cadnat: '',
        compte: '',
        edition: '',
        exonor: '',
        duree: '',
        reg: '',
        terme: '',
        marque: '',
        plafond: '',
        zone: '',
        comm: '',
        assujet: '',
        codeTva: '',
        timbre: '',
        ech: '',
        bloc: '',
        datBlc: '',
        typeC: '',
        regle: '',
        lettre: '',
        codeC: '',
        autor: '',
        eMail: '',
        typeComm: '',
        rec: '',
        vend: '',
        represant: '',
        secteur: '',
        objectif: '',
        nature: '',
        datCreat: '',
        mag: '',
        respons2: '',
        adresseusine: '',
        adressesiege: '',
        gsm1: '',
        gsm2: '',
        nouvMag: '',
        ca123: '',
        respons3: '',
        fonction1: '',
        fonction2: '',
        fonction3: '',
        eMail1: '',
        eMail2: '',
        eMail3: '',
        tel2: '',
        tel3: '',
        gsm3: '',
        codGroupe: '',
        modeReg: '',
        plafondEncours: '',
        indic: '',
        bcExige: '',
      };
      if (String(clt) !== 'undefined') {
        clt = this.clients.find((i) => i.code === fc.operateur);
      }
      // Details client
      doc1.setFontSize(10);
      doc1.text(clt.deno, 115, 35);
      doc1.text(this.isNull(clt.adresse), 115, 42);
      doc1.text(clt.ville, 115, 49);
      doc1.text(this.isNull(clt.codeTva), 115, 56);

      // HEADER of table
      doc1.text(fc.numero, 68, 75);
      doc1.text(fc.date, 90, 75);
      doc1.text(fc.operateur, 117, 75);
      let pages = 1;
      doc1.text(String(pages), 197, 75);
      doc1.setFontSize(8);
      if (Number(fc.modeReg) > 0) {
        doc1.text(fc.reg + ' ' + fc.modeReg + ' JOURS DATE FACTURE', 135, 75);
      } else {
        doc1.text(fc.reg, 135, 75);
      }
      if (fc.sens === 'D') {
        doc1.setFontSize(18);
        doc1.setFontType('bold');
        doc1.text('AVOIR', 15, 78);
        doc1.setFontType('normal');
      }

      // position de debut de la zone des details
      let start = 91;

      // parcour et saisie des lignes de la table de details
      let sommeRemise = 0;
      for (const fact of this.factsAimp) {
        doc1.setFontSize(9);
        doc1.text(fact.code, 53, start);
        if (String(fact.design).length < 28) {
          doc1.text(fact.design, 86, start);
        } else {
          doc1.text(fact.design.substring(0, 27), 86, start);
        }

        doc1.setFontSize(10);
        doc1.text(fact.date, 2, start);
        doc1.text(fact.piece, 22, start);
        if (this.isNull(fact.ref0).length < 10) {
          doc1.text(this.isNull(fact.ref0), 34, start);
        } else {
          doc1.text(this.isNull(fact.ref0).substring(0, 9), 34, start);
        }
        doc1.text(Number(fact.quantite).toFixed(0), 150, start, 'right');
        doc1.text(
          Number(fact.prix)
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          172,
          start,
          'right'
        );
        if (Number(fact.tRemise) > 0) {
          doc1.text(Number(fact.tRemise).toFixed(0), 179, start, 'right');
        }

        doc1.text(
          Number(fact.h)
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          202,
          start,
          'right'
        );
        sommeRemise = sommeRemise + Number(fact.tRemise);
        start = start + 6;
        if (start > longLignes) {
          if (sommeRemise > 0) {
            doc1.text('REM', 179, 85, 'right');
          }
          doc1.addPage();
          pages++;
          // Details client
          doc1.setFontSize(10);
          doc1.text(clt.deno, 115, 35);
          doc1.text(this.isNull(clt.adresse), 115, 42);
          doc1.text(clt.ville, 115, 49);
          doc1.text(this.isNull(clt.codeTva), 115, 56);

          // HEADER of table
          doc1.text(fc.numero, 68, 75);
          doc1.text(fc.date, 90, 75);
          doc1.text(fc.operateur, 117, 75);
          doc1.text(String(pages), 197, 75);
          doc1.setFontSize(8);
          if (Number(fc.modeReg) > 0) {
            doc1.text(
              fc.reg + ' ' + fc.modeReg + ' JOURS DATE FACTURE',
              135,
              75
            );
          } else {
            doc1.text(fc.reg, 135, 75);
          }
          if (fc.sens === 'D') {
            doc1.setFontSize(18);
            doc1.setFontType('bold');
            doc1.text('AVOIR', 15, 78);
            doc1.setFontType('normal');
          }
          start = 91;
        }
      }
      if (sommeRemise > 0) {
        doc1.text('REM', 179, 85, 'right');
      }
      doc1.setFontSize(10);
      let sommeTva = 0;
      for (let i = 0; i < this.dataTva.length; i++) {
        doc1.text(this.dataTva[i][0], 5, i * 5 + (startFooter + 2));

        sommeTva =
          sommeTva +
          Number(
            (
              (Number(this.dataTva[i][0]) *
                Math.abs(Number(Number(this.dataTva[i][1]).toFixed(3)))) /
              100
            ).toFixed(3)
          );

        doc1.text(
          Math.abs(Number(this.dataTva[i][1]))
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          36,
          i * 5 + (startFooter + 2),
          'right'
        );

        doc1.text(
          (
            (Number(this.dataTva[i][0]) *
              Math.abs(Number(Number(this.dataTva[i][1]).toFixed(3)))) /
            100
          )
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          54,
          i * 5 + (startFooter + 2),
          'right'
        );
      }

      const ht = Number(Number(fc.htt).toFixed(3));
      doc1.text(
        Number(fc.htt)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        200,
        startFooter - 5,
        'right'
      );
      let remise = 0;
      if (Number(fc.remise) > 0) {
        doc1.text('REMISE:', 156, startFooter);
        doc1.text(
          Number(fc.remise)
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          200,
          startFooter,
          'right'
        );
        remise = Number(Number(fc.remise).toFixed(3));
      }

      doc1.text(
        sommeTva.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        200,
        startFooter + 6,
        'right'
      );
      let timbre = 0;
      if (Number(fc.timbre) > 0) {
        doc1.text(Number(fc.timbre).toFixed(3), 200, startFooter + 13, 'right');
        timbre = Number(Number(fc.timbre).toFixed(3));
      }
      const net = ht + Number(Number(sommeTva).toFixed(3)) + timbre - remise;
      doc1.setFontType('bold');
      doc1.text(
        net.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        200,
        startFooter + 19,
        'right'
      );
      doc1.text(this.trans(net.toFixed(3)), 85, startFooter + 27);
      doc1.setFontType('normal');
      doc1.text(
        'Droit de Timbre Loi 93-53 payé sur Etat',
        70,
        startFooter + 35
      );
      compteur++;
      this.progressValue = Number(
        ((compteur / this.factures.length) * 100).toFixed(0)
      );
      if (compteur <= this.factures.length) {
        doc1.addPage();
      }
    }
    this.progressValue = 100;
    window.open(doc1.output('bloburl'), '_blank');
    this.progressVisible = false;
  }
  async imprimerGros() {
    this.progressValue = 0;
    this.progressVisible = true;
    const longLignes = 225;
    const startFooter = 235;
    let compteur = 1;
    const doc1 = new jspdf();
    for (const fc of this.factures) {
      await this.impressionFacturesService
        .getFactAimprimerGros(fc.numero)
        .toPromise()
        .then((data) => {
          this.factsAimp = data['_embedded'].factureImprims;
        });
      await this.impressionFacturesService
        .getTvaFactureGros(fc.numero)
        .toPromise()
        .then((data) => {
          this.dataTva = data;
        });
      let clt = {
        id: '',
        code: '',
        deno: '',
        adresse: '',
        ville: '',
        post: '',
        respon: '',
        tel: '',
        agence: '',
        banque: '',
        telex: '',
        fax: '',
        cadnat: '',
        compte: '',
        edition: '',
        exonor: '',
        duree: '',
        reg: '',
        terme: '',
        marque: '',
        plafond: '',
        zone: '',
        comm: '',
        assujet: '',
        codeTva: '',
        timbre: '',
        ech: '',
        bloc: '',
        datBlc: '',
        typeC: '',
        regle: '',
        lettre: '',
        codeC: '',
        autor: '',
        eMail: '',
        typeComm: '',
        rec: '',
        vend: '',
        represant: '',
        secteur: '',
        objectif: '',
        nature: '',
        datCreat: '',
        mag: '',
        respons2: '',
        adresseusine: '',
        adressesiege: '',
        gsm1: '',
        gsm2: '',
        nouvMag: '',
        ca123: '',
        respons3: '',
        fonction1: '',
        fonction2: '',
        fonction3: '',
        eMail1: '',
        eMail2: '',
        eMail3: '',
        tel2: '',
        tel3: '',
        gsm3: '',
        codGroupe: '',
        modeReg: '',
        plafondEncours: '',
        indic: '',
        bcExige: '',
      };
      if (String(clt) !== 'undefined') {
        clt = this.clients.find((i) => i.code === fc.operateur);
      }
      /*
        await this.clientService
          .getClientByCode(fc.operateur)
          .toPromise()
          .then((data) => {
            if (data['_embedded'].clients.length > 0) {
              clt = data['_embedded'].clients[0];
            }
          });*/
      doc1.setFontSize(10);
      // doc1.setFont('courier'); // courier,times,helvetica...
      doc1.text(fc.numero, 75, 94);
      doc1.text(fc.date, 99, 94);
      doc1.setFontSize(11);

      doc1.text(clt.deno, 105, 50);
      doc1.text(this.isNull(clt.adresse), 105, 57);
      doc1.text(this.isNull(clt.ville), 105, 64);
      doc1.text(this.isNull(clt.codeTva), 105, 71);
      doc1.setFontSize(10);
      doc1.text(fc.operateur, 168, 94);
      doc1.setFontSize(8);
      console.log(fc);
      if (Number(fc.modeReg) > 0) {
        doc1.text(fc.reg + ' ' + fc.modeReg + ' JOURS DATE FACTURE', 118, 94);
      } else {
        doc1.text(fc.reg, 123, 94);
      }

      let pages = 1;
      doc1.setFontSize(10);
      doc1.text(String(pages), 200, 94);

      if (fc.sens === 'D') {
        doc1.setFontSize(18);
        doc1.setFontType('bold');
        doc1.text('AVOIR', 15, 95);
        doc1.setFontType('normal');
        doc1.setFontSize(10);
      }
      // position de debut de la zone des details
      let start = 111;
      /*if (fc.sens === 'C') {
          doc1.text('REM', 167, start - 10);
        }*/

      // parcour de table de details
      for (const fact of this.factsAimp) {
        doc1.setFontSize(10);
        // test sur le nom de societé pour choisir le type d\'impression

        doc1.text(fact.date, 8, start);
        doc1.text(this.isNull(fact.ref0), 35, start);
        doc1.text(fact.piece, 68, start);
        doc1.text(fact.code, 108, start);
        doc1.text(
          Number(fact.ht)
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          200,
          start,
          'right'
        );

        start = start + 6;
        if (start > longLignes) {
          doc1.addPage();
          pages++;
          doc1.setFontSize(10);
          // doc1.setFont('courier'); // courier,times,helvetica...
          doc1.text(fc.numero, 75, 94);
          doc1.text(fc.date, 99, 94);
          doc1.setFontSize(11);

          doc1.text(clt.deno, 105, 50);
          doc1.text(this.isNull(clt.adresse), 105, 57);
          doc1.text(this.isNull(clt.ville), 105, 64);
          doc1.text(this.isNull(clt.codeTva), 105, 71);
          doc1.setFontSize(10);
          doc1.text(fc.operateur, 168, 94);
          doc1.setFontSize(8);
          if (Number(fc.modeReg) > 0) {
            doc1.text(
              fc.reg + ' ' + fc.modeReg + ' JOURS DATE FACTURE',
              118,
              94
            );
          } else {
            doc1.text(fc.reg, 123, 94);
          }
          // let pages = 1;
          doc1.setFontSize(10);
          doc1.text(String(pages), 200, 94);

          if (fc.sens === 'D') {
            doc1.setFontSize(18);
            doc1.setFontType('bold');
            doc1.text('AVOIR', 15, 95);
            doc1.setFontType('normal');
            doc1.setFontSize(10);
          }
          start = 111;
        }
      }

      let sommeTva = 0;

      for (let i = 0; i < this.dataTva.length; i++) {
        doc1.text(this.dataTva[i][0], 8, i * 5 + (startFooter + 2));

        sommeTva =
          sommeTva +
          Number(
            (
              (Number(this.dataTva[i][0]) *
                Math.abs(Number(Number(this.dataTva[i][1]).toFixed(3)))) /
              100
            ).toFixed(3)
          );

        doc1.text(
          Math.abs(Number(this.dataTva[i][1]))
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          40,
          i * 5 + (startFooter + 2),
          'right'
        );

        doc1.text(
          (
            (Number(this.dataTva[i][0]) *
              Math.abs(Number(Number(this.dataTva[i][1]).toFixed(3)))) /
            100
          )
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          58,
          i * 5 + (startFooter + 2),
          'right'
        );
      }

      const ht = Number(Number(fc.htt).toFixed(3));
      doc1.text(
        Number(fc.htt)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& '),
        200,
        startFooter - 5,
        'right'
      );
      let remise = 0;
      if (Number(fc.remise) > 0) {
        doc1.text('REMISE:', 165, startFooter);
        doc1.text(
          Number(fc.remise)
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          200,
          startFooter,
          'right'
        );
        remise = Number(Number(fc.remise).toFixed(3));
      }

      doc1.text(
        sommeTva.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        200,
        startFooter + 6,
        'right'
      );
      let timbre = 0;
      if (Number(fc.timbre) > 0) {
        doc1.text(Number(fc.timbre).toFixed(3), 200, startFooter + 13, 'right');
        timbre = Number(Number(fc.timbre).toFixed(3));
      }
      const net = ht + Number(Number(sommeTva).toFixed(3)) + timbre - remise;
      doc1.setFontType('bold');
      doc1.text(
        net.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        200,
        startFooter + 19,
        'right'
      );
      doc1.text(this.trans(net.toFixed(3)), 85, startFooter + 27);
      doc1.setFontType('normal');
      doc1.text(
        'Droit de Timbre Loi 93-53 payé sur Etat',
        70,
        startFooter + 35
      );
      compteur++;
      this.progressValue = Number(
        ((compteur / this.factures.length) * 100).toFixed(0)
      );
      if (compteur <= this.factures.length) {
        doc1.addPage();
      }
    }
    this.progressValue = 100;
    window.open(doc1.output('bloburl'), '_blank');
    this.progressVisible = false;
  }
  async imprimer(evenement) {
    this.wasInside = true;
    this.ov.hide();
    if (this.factures.length > 0) {
      if (this.factures.length < 101) {
        let ste: Ste;
        await this.steService
          .getSte()
          .toPromise()
          .then((data) => {
            ste = data['_embedded'].ste;
          });
        if (
          ste[0].deno === 'CHAMAM DIVISION GROS' ||
          ste[0].deno === 'SMD (STE MODERNE DISTRIBUTION)'
        ) {
          await this.imprimerGros();
        } else {
          await this.imprimerDetails();
        }
      } else {
        this.msgs = 'Nombre de factures supérieur à 100';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(evenement, document.getElementById('apercu'));
      }
    }
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }

  isNull(chaine: any): string {
    if (chaine === null) {
      return '';
    } else {
      return chaine;
    }
  }
  //////////////////////////////////////////
  // traitement des deux parties du nombre;
  decint(n) {
    switch (n.length) {
      case 1:
        return this.dix(n);
      case 2:
        return this.dix(n);
      case 3:
        return this.cent(n.charAt(0)) + ' ' + this.decint(n.substring(1));
      default:
        this.mil = n.substring(0, n.length - 3);

        if (this.mil.length < 4) {
          this.un = this.mil === 1 ? '' : this.decint(this.mil);

          return (
            this.un +
            this.mille(this.mil) +
            ' ' +
            this.decint(n.substring(this.mil.length))
          );
        } else {
          this.mil2 = this.mil.substring(0, this.mil.length - 3);
          return (
            this.decint(this.mil2) +
            this.million(this.mil2) +
            ' ' +
            this.decint(n.substring(this.mil2.length))
          );
        }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // traitement des nombres entre 0 et 99, pour chaque tranche de 3 chiffres;
  dix(n) {
    if (n < 10) {
      return this.t[Number(n)];
    } else if (Number(n) > 9 && Number(n) < 20) {
      return this.t2[n.charAt(1)];
    } else {
      this.plus =
        n.charAt(1) === '0' && n.charAt(0) !== '7' && n.charAt(0) !== '9'
          ? ''
          : n.charAt(1) === '1' && n.charAt(0) < '8'
          ? ' et '
          : '-';
      this.diz =
        n.charAt(0) === '7' || n.charAt(0) === '9'
          ? this.t2[n.charAt(1)]
          : this.t[n.charAt(1)];
      this.s = n === '80' ? 's' : '';
      return this.t3[n.charAt(0)] + this.s + this.plus + this.diz;
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // traitement des mots "cent", "mille" et "million"
  cent(n) {
    return Number(n) > 1
      ? this.t[Number(n)] + ' Cents'
      : Number(n) === 1
      ? ' Cent'
      : '';
  }

  mille(n) {
    return Number(n) >= 1 ? ' Milles' : 'Mille';
  }

  million(n) {
    return Number(n) >= 1 ? ' Millions' : ' Million';
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // conversion du nombre
  trans(n) {
    // vérification de la valeur saisie
    if (!/^\d+[.,]?\d*$/.test(n)) {
      return 'L\'expression entrée n\'est pas un nombre.';
    }

    // séparation entier + décimales
    n = n.replace(/(^0+)|(\.0+$)/g, '');
    n = n.replace(/([.,]\d{3})\d+/, '$1');
    const n1 = n.replace(/[,.]\d*/, '');
    // const n2 = n1 !== n ? n.replace(/\d*[,.]/, '') : false;
    const n2 = String(Number(n.replace(/\d*[,.]/, '')));

    // variables de mise en forme

    this.ent = !n1 ? '' : this.decint(n1);
    this.deci = !n2 ? '' : this.decint(n2);
    if (!n1 && !n2) {
      return 'Entrez une valeur non nulle!';
    }
    this.conj = !n2 || !n1 ? '' : '  et ';
    const euro = !n1 ? '' : !/[23456789]00$/.test(n1) ? ' Dinar' : 's Dinar';
    this.centi = !n2 ? '' : ' millime';
    this.pl = n1 > 1 ? 's' : '';
    this.pl2 = Number(n2) > 1 ? 's' : '';

    // expression complète en toutes lettres
    // return (' ' + this.ent + euro + this.pl + this.conj + this.deci + this.centi + this.pl2)
    return (
      ' ' +
      this.ent +
      euro +
      this.pl +
      this.conj +
      n2 +
      this.centi +
      this.pl2
    )
      .replace(/\s+/g, ' ')
      .replace('cent s E', 'cents E')
      .replace('Un Mille', 'Mille');
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  focusNextInput(index) {
    if (index === 0) {
      if (this.numero1 !== '0') {
        let tmp = '';
        for (let i = 0; i < 5 - this.numero1.length; i++) {
          tmp = tmp + '0';
        }
        this.numero1 = tmp + this.numero1;
      }
      document.getElementById('num2').focus();
    } else {
      if (this.numero2 !== '0') {
        let tmp = '';
        for (let i = 0; i < 5 - this.numero2.length; i++) {
          tmp = tmp + '0';
        }
        this.numero2 = tmp + this.numero2;
      }
      document.getElementById('btAfficher').focus();
    }
  }
}
