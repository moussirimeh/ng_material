import {
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
} from '@angular/core';
import { DuplicataEntete } from '../services/duplicataEntete';
import { DuplicataDetail } from '../services/duplicataDetail';
import { DuplicataService } from '../services/duplicata.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { OverlayPanel } from 'primeng/primeng';
import { NomClientService } from '../services/nomClient.service';
import { globals } from 'src/environments/environment';

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
  selector: 'app-duplicata',
  templateUrl: './duplicata.component.html',
  styleUrls: ['./duplicata.component.scss'],
})
export class DuplicataComponent implements OnInit {
  nature = '';
  docEntete: DuplicataEntete = {
    id: '',
    combine: '',
    date: '',
    operateur: '',
    vendeur: '',
    ref: '',
    ht: '',
    sens: '',
    remise: '',
    timbre: '',
    net: '',
    base0: '',
    base10: '',
    base17: '',
    base29: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    codeTva: '',
    reg: '',
    denoVendeur: '',
  };
  docDetails: any[] = [];
  @Input() combine = '';
  @Input() portail = false;
  @Input() hideButtonNvlSaisie = false;
  disableCombine = false;
  @Input() selectedValuesDup = true;
  disableDupCheckbox = true;
  totalBrut = '';
  ste: Ste;
  test = [];
  titreDoc = '';
  @Input() imprimerDirect = false;
  base10 = '';
  base29 = '';
  base17 = '';
  remise = '';
  net = '';
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
    private duplicataService: DuplicataService,
    private nomClientService: NomClientService,
    private steService: SteService
  ) {}

  async ngOnInit() {
    if (globals.selectedMenu === 'B/Livraison' ||
    globals.selectedMenu === 'B/L Trm Réserv') {
      this.titreDoc = 'B/LIVRAISON';
    }
    if (globals.selectedMenu === 'Comptant .P.') {
      this.titreDoc = 'FACTURE COMPTANT';
    }
    if (globals.selectedMenu === 'Avoir B/L' ||
    globals.selectedMenu === 'Av Trm Réserv') {
      this.titreDoc = 'AVOIR B/L';
    }
    if (globals.selectedMenu === 'Avoir CPT .P.') {
      this.titreDoc = 'AVOIR COMPTANT';
    }

    if (globals.selectedMenu === 'Comptant Res') {
      this.titreDoc = 'F.COMPTANT';
    }
    if (globals.selectedMenu === 'Avoir CPT Res') {
      this.titreDoc = 'AVOIR/F.COMPTANT';
    }
    if (globals.selectedMenu === 'B/L En cours') {
      this.titreDoc = 'B/L En cours';
    }

    this.nature = localStorage.getItem('natureDuplicata');

    if (document.getElementById('numero') !== null) {
      document.getElementById('numero').focus();
    }
    if (
      localStorage.getItem('login').toUpperCase() === 'BRAHIM' ||
      localStorage.getItem('login').toUpperCase() === 'CKHALED' ||
      localStorage.getItem('login').toUpperCase() === 'KHMAIS'
    ) {
      this.disableDupCheckbox = false;
    }
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste[0];
      });
  }

  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.imprimerDirect) {
      if (this.nature === 'B/L      ' || this.nature === 'B/L2     ') {
        this.titreDoc = 'B/LIVRAISON';
      }
      if (this.nature === 'AVOIR    ' || this.nature === 'AVOIR2   ') {
        this.titreDoc = 'AVOIR B/L';
      }
      if (this.nature === 'FACTUREP ') {
        this.titreDoc = 'FACTURE COMPTANT';
      }
      if (this.nature === 'AVOIRP   ') {
        this.titreDoc = 'AVOIR COMPTANT';
      }
      if (this.nature === 'FACTURE3 ') {
        this.titreDoc = 'F.COMPTANT';
      }
      if (this.nature === 'AVOIR3   ') {
        this.titreDoc = 'AVOIR/F.COMPTANT';
      }
    }
    if (this.combine.length > 0) {
      if (this.combine !== '0') {
        let tmp = '';
        for (let i = 0; i < 5 - this.combine.length; i++) {
          tmp = tmp + '0';
        }
        this.combine = tmp + this.combine;
      }
    }
    if (
      this.combine.length === 5 &&
      Number(this.combine).toString() !== 'NaN'
    ) {

      // let test = [];
      console.log('nat + comb ', this.nature , this.combine);

      await this.duplicataService
        .getEntete(this.nature + this.combine)
        .toPromise()
        .then((data) => {
          // this.docEntete = data['_embedded'].duplicata[0];
          this.test = data['_embedded'].duplicata;
        });
      console.log('teeeeeeeeeeeeeeeeeest ', this.test);

      if (this.test.length > 0) {
        if (
          this.titreDoc !== 'B/LIVRAISON' &&
          this.titreDoc !== 'AVOIR B/L'
        ) {
          let nomClient = null;
          await this.nomClientService
            .getNomClientByCombine(this.nature + this.combine)
            .toPromise()
            .then((data) => {
              nomClient = data['_embedded'].NomClient;
            });
          if (nomClient.length > 0) {
            this.test[0].deno = nomClient[0].deno;
            this.test[0].adresse = nomClient[0].adresse;
            this.test[0].codeTva = nomClient[0].codeTva;
          }
        }
        this.docEntete = this.test[0];
        this.base10 = ((Number(this.docEntete.base10) * 0.13).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.base17 = ((Number(this.docEntete.base17) * 0.19).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.base29 = ((Number(this.docEntete.base29) * 0.07).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.remise = Number(this.docEntete.remise).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.net = Number(this.docEntete.net).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& ');
        let docDetailsTmp = [];
        await this.duplicataService
          .getDetail(this.nature + this.combine)
          .toPromise()
          .then((data) => {
            docDetailsTmp = data['_embedded'].duplicataDetails;
          });
        let TotBrut = 0;
        const tmp = [];
        for (const doc of docDetailsTmp) {
          tmp.push({
            id: doc.id,
            code: doc.code,
            design: doc.design,
            quantite: Number(doc.quantite).toFixed(2),
            tRemise: Number(doc.tRemise).toFixed(2),
            tauxTva: doc.tauxTva,
            prix: Number(doc.prix).toFixed(3),
            total: (Number(doc.prix) * Number(doc.quantite)).toFixed(3),
            codeAimprimer: doc.codeAimprimer,
          });
          this.docDetails = tmp;
          TotBrut = TotBrut + Number(doc.prix) * Number(doc.quantite);
        }
        this.totalBrut = TotBrut.toFixed(3);
        this.disableCombine = true;
      } else {
        if (!this.imprimerDirect) {
          this.msgs = 'Pièce inéxistante !';
          this.styleOvPanel = this.styleOvPanelError;
          setTimeout(() => {
            document.getElementById('numero').focus();
        }, 0);
          this.ov.show(e);
        }
      }
    } else {
      if (!this.imprimerDirect) {
        this.msgs = 'Pièce inéxistante !';
        this.styleOvPanel = this.styleOvPanelError;
      setTimeout(() => {
          document.getElementById('numero').focus();
      }, 0);
        this.ov.show(e);
      }
    }
  }
  nvlSaisie() {
    this.docEntete = {
      id: '',
      combine: '',
      date: '',
      operateur: '',
      vendeur: '',
      ref: '',
      ht: '',
      sens: '',
      remise: '',
      timbre: '',
      net: '',
      base0: '',
      base10: '',
      base17: '',
      base29: '',
      deno: '',
      adresse: '',
      ville: '',
      post: '',
      codeTva: '',
      reg: '',
      denoVendeur: '',
    };
    this.base10 = '';
    this.base29 = '';
    this.base17 = '';
    this.remise = '';
    this.net = '';
    this.docDetails = [];
    this.disableCombine = false;
    this.combine = '';
    this.totalBrut = '';
  }
  /*
  async imprimer(index: number) {
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data["_embedded"].ste[0];
      });
    let longLignes = 130;
    let startFooter = 186;
    if (this.ste.deno === "CHAMAM DIVISION GROS") {
      longLignes = 200;
      startFooter = 235;
    }

    const doc1 = new jspdf();
    doc1.setFontSize(15);
    doc1.setFontStyle("arial");
    doc1.setFontType("italic");
    if (this.selectedValuesDup) {
      if (
        this.ste.deno === "CHAMAM DIVISION GROS" ||
        this.ste.deno === "SMD (STE MODERNE DISTRIBUTION)"
      ) {
        doc1.text("DUPLICATA", 60, 31);
      } else {
        doc1.text("DUPLICATA", 60, 25);
      }
    }
    doc1.setFontType("normal");
    doc1.setFontSize(12);
    doc1.text(this.docEntete.deno, 105, 35);
    doc1.text(this.isNull(this.docEntete.adresse), 105, 42);
    doc1.text(
      this.isNull(this.docEntete.post) + " " + this.docEntete.ville,
      105,
      49
    );
    doc1.text("Code TVA : " + this.isNull(this.docEntete.codeTva), 105, 56);
    doc1.setFontSize(13);
    doc1.setFontType("bold");
    if (
      this.ste.deno === "CHAMAM DIVISION GROS" ||
      this.ste.deno === "SMD (STE MODERNE DISTRIBUTION)"
    ) {
      if (this.nature === "B/L      ") {
        doc1.text("B/LIVRAISON", 3, 66);
        doc1.text(this.combine, 50, 68);
      } else {
        doc1.text("B/LIVRAISON", 3, 62);
        doc1.text(this.combine, 26, 68);
      }
    }
    doc1.setFontType("normal");
    doc1.setFontSize(10);
    doc1.text(this.docEntete.date, 92, 67);
    doc1.text(this.docEntete.reg, 128, 67);
    doc1.text(this.docEntete.operateur, 163, 67);

    let pages = 1;
    doc1.text(String(pages), 192, 67);

    doc1.text("Rem", 188, 72);

    let start = 78;
    doc1.setFontSize(9);
    let compteur = 1;
    for (const doc of this.docDetails) {
      if (
        this.ste.deno === "CHAMAM DIVISION GROS" ||
        this.ste.deno === "SMD (STE MODERNE DISTRIBUTION)"
      ) {
        doc1.text(String(compteur), 5, start);
        doc1.text(this.isNull(doc.codeAimprimer), 15, start);
        doc1.text(doc.design, 40, start);
        doc1.text(Number(doc.quantite).toFixed(0), 120, start, "right");
        doc1.text(doc.prix, 145, start, "right");
        doc1.text(doc.total, 170, start, "right");
        doc1.text(doc.tRemise, 183, start, "right");
        doc1.text(doc.tauxTva, 193, start, "right");
        doc1.text(
          (
            Number(doc.total) -
            (Number(doc.total) * Number(doc.tRemise)) / 100
          ).toFixed(3),
          209,
          start,
          "right"
        );
      } else {
        doc1.text(this.isNull(this.docEntete.ref), 8, start);
        doc1.text(Number(doc.quantite).toFixed(0), 32, start, "right");
        doc1.text(doc.design, 49, start);
        doc1.text(doc.code, 107, start);
        doc1.text(doc.prix, 153, start, "right");
        doc1.text(doc.total, 178, start, "right");
        doc1.text(doc.tRemise, 193, start, "right");
        doc1.text(doc.tauxTva, 203, start, "right");
      }
      compteur++;
      start = start + 5;
      if (start > longLignes) {
        doc1.addPage();
        pages++;
        doc1.setFontSize(15);
        doc1.setFontStyle("arial");
        doc1.setFontType("italic");
        if (this.selectedValuesDup) {
          if (
            this.ste.deno === "CHAMAM DIVISION GROS" ||
            this.ste.deno === "SMD (STE MODERNE DISTRIBUTION)"
          ) {
            doc1.text("DUPLICATA", 60, 31);
          } else {
            doc1.text("DUPLICATA", 60, 25);
          }
        }
        doc1.setFontType("normal");
        doc1.setFontSize(12);
        doc1.text(this.docEntete.deno, 105, 35);
        doc1.text(this.isNull(this.docEntete.adresse), 105, 42);
        doc1.text(
          this.isNull(this.docEntete.post) + " " + this.docEntete.ville,
          105,
          49
        );
        doc1.text("Code TVA : " + this.isNull(this.docEntete.codeTva), 105, 56);
        doc1.setFontSize(13);
        doc1.setFontType("bold");
        if (
          this.ste.deno === "CHAMAM DIVISION GROS" ||
          this.ste.deno === "SMD (STE MODERNE DISTRIBUTION)"
        ) {
          if (this.nature === "B/L      ") {
            doc1.text("B/LIVRAISON", 3, 66);
            doc1.text(this.combine, 50, 68);
          } else {
            doc1.text("B/LIVRAISON", 3, 62);
            doc1.text(this.combine, 26, 68);
          }
        }
        doc1.setFontType("normal");
        doc1.setFontSize(10);
        doc1.text(this.docEntete.date, 92, 67);
        doc1.text(this.docEntete.reg, 128, 67);
        doc1.text(this.docEntete.operateur, 163, 67);

        doc1.text(String(pages), 192, 67);

        doc1.text("Rem", 188, 72);

        start = 78;
        doc1.setFontSize(9);
      }
    }
    doc1.setFontSize(10);

    doc1.text(this.docEntete.denoVendeur, 5, startFooter);
    if (
      this.ste.deno === "CHAMAM DIVISION GROS" ||
      this.ste.deno === "SMD (STE MODERNE DISTRIBUTION)"
    ) {
      if (Number(this.docEntete.base29) > 0) {
        doc1.text("7", 5, startFooter - 30);
        doc1.text(
          (Number(this.docEntete.base29) / 0.07).toFixed(3),
          25,
          startFooter - 30
        );
      }
      if (Number(this.docEntete.base10) > 0) {
        doc1.text("13", 5, startFooter - 25);
        doc1.text(
          (Number(this.docEntete.base10) / 0.13).toFixed(3),
          25,
          startFooter - 25
        );
      }
      if (Number(this.docEntete.base17) > 0) {
        doc1.text("19", 5, startFooter - 20);
        doc1.text(
          (Number(this.docEntete.base17) / 0.19).toFixed(3),
          25,
          startFooter - 20
        );
      }
      doc1.text("Remise", 145, startFooter - 28);
      doc1.text(
        Number(this.docEntete.remise).toFixed(3),
        145,
        startFooter - 23
      );
      doc1.text(
        (Number(this.docEntete.remise) + Number(this.docEntete.ht)).toFixed(3),
        120,
        startFooter - 23
      );
      const displayDate = new Date().toLocaleDateString('en-GB');
      const displayTime = new Date().toLocaleTimeString();
      doc1.text(
        displayDate + " " + displayTime.substring(0, 5),
        180,
        startFooter
      );
    }
    // doc1.autoPrint();
    window.open(doc1.output("bloburl"), "_blank");

    /*const printPage = async sURL => {
      const oHiddFrame = document.createElement('iframe');
      const printPromise = new Promise<void>((resolve, reject) => {
          oHiddFrame.onload = function () {
              try {
                  oHiddFrame.contentWindow.focus(); // Required for IE
                  oHiddFrame.contentWindow.print();
                  resolve();
              } catch (error) {
                  reject(error);
              }
          };
      });
      oHiddFrame.style.position = 'fixed';
      oHiddFrame.style.right = '0';
      oHiddFrame.style.bottom = '0';
      oHiddFrame.style.width = '0';
      oHiddFrame.style.height = '0';
      oHiddFrame.style.border = '0';
      oHiddFrame.src = sURL;
      document.body.appendChild(oHiddFrame);
      await printPromise;
  };
  printPage(doc1.output('bloburl'))
    .catch ( error => {
        // Fallback printing method
        doc1.autoPrint();
        doc1.output('dataurlnewwindow');
    });*/
  // }

  isNull(chaine: any): string {
    if (chaine === null) {
      return '';
    } else {
      return chaine;
    }
  }
  async imprimerCDG() {
    const longLignes = 154;
    const startFooter = 195;

    const doc1 = new jspdf();
    doc1.setFontSize(15);
    doc1.setFont('Helvetica');
    // doc1.setFontType('italic');
    if (this.selectedValuesDup) {
      doc1.fromHTML('<b><i>DUPLICATA</i></b>', 60, 31);
    }
    doc1.setFontType('normal');
    doc1.setFontSize(12);
    doc1.text(this.docEntete.deno, 115, 35);
    doc1.text(this.isNull(this.docEntete.adresse), 115, 41);
    doc1.text(
      this.isNull(this.docEntete.post) + ' ' + this.docEntete.ville,
      115,
      47
    );
    doc1.text('Code TVA : ' + this.isNull(this.docEntete.codeTva), 115, 53);
    doc1.setFontSize(12);
    doc1.setFontType('bold');

    /*if (this.nature === 'B/L      ') {
      doc1.text('B/LIVRAISON', 8, 66);
      doc1.text(this.combine, 50, 68);
    }*/
    doc1.text(this.titreDoc, 8, 64);
    doc1.text(this.combine, 50, 68);
    doc1.setFontType('normal');
    doc1.setFontSize(10);
    doc1.text(this.docEntete.date, 99, 67);
    doc1.text(this.isNull(this.docEntete.reg), 130, 67);
    doc1.text(this.docEntete.operateur, 168, 67);

    let pages = 1;
    doc1.text(String(pages), 203, 67);
    if (Number(this.docEntete.remise) > 0) {
      doc1.text('Rem', 178, 76);
    }

    let start = 83;
    doc1.setFontSize(9);
    let compteur = 1;
    this.docDetails.sort((a, b) =>
      a.codeAimprimer < b.codeAimprimer
        ? -1
        : a.ncodeAimprimer > b.codeAimprimer
        ? 1
        : 0
    );
    console.log(this.docDetails);
    for (const doc of this.docDetails) {
      doc1.text(String(compteur), 6, start);
      doc1.text(this.isNull(doc.codeAimprimer), 15, start);
      doc1.text(doc.design, 42, start);
      doc1.text(Number(doc.quantite).toFixed(0), 127, start, 'right');
      doc1.text(Number(doc.prix).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '), 148, start, 'right');
      doc1.text(Number(doc.total).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '), 173, start, 'right');
      if (Number(this.docEntete.remise) > 0) {
        doc1.text(doc.tRemise, 183, start, 'right');
      }
      doc1.text(doc.tauxTva, 192, start, 'right');
      doc1.text(
        (
          Number(doc.total) -
          (Number(doc.total) * Number(doc.tRemise)) / 100
        ).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        210,
        start,
        'right'
      );

      compteur++;
      start = start + 6;
      if (start > longLignes && compteur < this.docDetails.length) {
        doc1.addPage();
        pages++;
        doc1.setFontSize(15);
        doc1.setFont('Helvetica');
        // doc1.setFontType('italic');
        if (this.selectedValuesDup) {
          doc1.fromHTML('<b><i>DUPLICATA</i></b>', 60, 31);
        }
        doc1.setFontType('normal');
        doc1.setFontSize(12);
        doc1.text(this.docEntete.deno, 115, 35);
        doc1.text(this.isNull(this.docEntete.adresse), 115, 41);
        doc1.text(
          this.isNull(this.docEntete.post) + ' ' + this.docEntete.ville,
          115,
          47
        );
        doc1.text('Code TVA : ' + this.isNull(this.docEntete.codeTva), 115, 53);
        doc1.setFontSize(12);
        doc1.setFontType('bold');

        /*if (this.nature === 'B/L      ') {
          doc1.text('B/LIVRAISON', 8, 66);
          doc1.text(this.combine, 50, 68);
        }*/
        doc1.text(this.titreDoc, 8, 64);
        doc1.text(this.combine, 50, 68);
        doc1.setFontType('normal');
        doc1.setFontSize(10);
        doc1.text(this.docEntete.date, 99, 67);
        doc1.text(this.docEntete.reg, 130, 67);
        doc1.text(this.docEntete.operateur, 168, 67);

        doc1.text(String(pages), 203, 67);
        if (Number(this.docEntete.remise) > 0) {
          doc1.text('Rem', 178, 76);
        }

        start = 83;
        doc1.setFontSize(9);
      }
    }
    doc1.setFontSize(10);

    doc1.text(this.docEntete.denoVendeur, 5, startFooter + 7);
    // tva
    if (Number(this.docEntete.base0) > 0) {
      doc1.text('0', 5, startFooter - 30);
      doc1.text(
        Number(this.docEntete.base0).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        35,
        startFooter - 30,
        'right'
      );
      if (
        this.titreDoc !== 'B/LIVRAISON' &&
        this.titreDoc !== 'AVOIR B/L'
      ) {
        doc1.text('0.000', 55, startFooter - 30, 'right');
      }
    }
    if (Number(this.docEntete.base29) > 0) {
      doc1.text('7', 5, startFooter - 25);
      doc1.text(
        Number(this.docEntete.base29).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        35,
        startFooter - 25,
        'right'
      );
      if (
        this.titreDoc !== 'B/LIVRAISON' &&
        this.titreDoc !== 'AVOIR B/L'
      ) {
        doc1.text(
          ((Number(this.docEntete.base29) * 0.07).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          55,
          startFooter - 25,
          'right'
        );
      }
    }
    if (Number(this.docEntete.base10) > 0) {
      doc1.text('13', 5, startFooter - 20);
      doc1.text(
        Number(this.docEntete.base10).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        35,
        startFooter - 20,
        'right'
      );
      if (
        this.titreDoc !== 'B/LIVRAISON' &&
        this.titreDoc !== 'AVOIR B/L'
      ) {
        doc1.text(
          ((Number(this.docEntete.base10) * 0.13).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          55,
          startFooter - 20,
          'right'
        );
      }
    }
    if (Number(this.docEntete.base17) > 0) {
      doc1.text('19', 5, startFooter - 15);
      doc1.text(
        Number(this.docEntete.base17).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        35,
        startFooter - 15,
        'right'
      );
      if (
        this.titreDoc !== 'B/LIVRAISON' &&
        this.titreDoc !== 'AVOIR B/L'
      ) {
        doc1.text(
          ((Number(this.docEntete.base17) * 0.19).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          55,
          startFooter - 15,
          'right'
        );
      }
    }
    // fin tva
    if (Number(this.docEntete.remise) > 0) {
      doc1.text('Remise', 140, startFooter - 36);
      doc1.text(
        Number(this.docEntete.remise).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        142,
        startFooter - 23
      );
    }
    doc1.text(
      (Number(this.docEntete.remise) + Number(this.docEntete.ht)).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
      120,
      startFooter - 23
    );
    if (
      this.titreDoc !== 'B/LIVRAISON' &&
      this.titreDoc !== 'AVOIR B/L'
    ) {
      doc1.text(
        ((
          Number(this.docEntete.base29) +
          Number(this.docEntete.base10) +
          Number(this.docEntete.base17)
        ).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        169,
        startFooter - 23,
        'right'
      );
      doc1.text(
        Number(this.docEntete.timbre).toFixed(3),
        181,
        startFooter - 23,
        'right'
      );
      doc1.text(
        Number(this.docEntete.net).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        210,
        startFooter - 23,
        'right'
      );
      doc1.text(
        this.trans(Number(this.docEntete.net).toFixed(3)),
        85,
        startFooter
      );
      doc1.setFontType('normal');
      if (Number(this.docEntete.timbre) > 0) {
        doc1.text('Droit de Timbre payé sur l\'Etat', 5, startFooter);
      }
    }
    const displayDate = new Date().toLocaleDateString('en-GB');
    const displayTime = new Date().toLocaleTimeString();
    doc1.text(
      displayDate + ' ' + displayTime.substring(0, 5),
      180,
      startFooter + 7
    );

    if (this.imprimerDirect) {
      const printPage = async (sURL) => {
        const oHiddFrame = document.createElement('iframe');
        const printPromise = new Promise<void>((resolve, reject) => {
          oHiddFrame.onload = function () {
            try {
              oHiddFrame.contentWindow.focus(); // Required for IE
              oHiddFrame.contentWindow.print();
              resolve();
            } catch (error) {
              reject(error);
            }
          };
        });
        oHiddFrame.style.position = 'fixed';
        oHiddFrame.style.right = '0';
        oHiddFrame.style.bottom = '0';
        oHiddFrame.style.width = '0';
        oHiddFrame.style.height = '0';
        oHiddFrame.style.border = '0';
        oHiddFrame.src = sURL;
        document.body.appendChild(oHiddFrame);
        await printPromise;
      };
      printPage(doc1.output('bloburl')).catch((error) => {
        // Fallback printing method
        doc1.autoPrint();
        doc1.output('dataurlnewwindow');
      });
    } else {
      window.open(doc1.output('bloburl'), '_blank');
    }
  }
  async imprimerDetails() {
    const longLignes = 139;
    const startFooter = 186;

    const doc1 = new jspdf();
    doc1.setFontSize(18);
    doc1.setFont('Helvetica');
    // doc1.setFontType('bold');
    // doc1.setFontType('italic');
    if (this.selectedValuesDup) {
      doc1.fromHTML('<b><i>DUPLICATA</i></b>', 60, 30);
    }
    doc1.setFontType('normal');
    doc1.setFontSize(10);
    doc1.text(this.docEntete.deno, 105, 34);
    doc1.text(this.isNull(this.docEntete.adresse), 105, 40);
    doc1.text(
      this.isNull(this.docEntete.post) + ' ' + this.docEntete.ville,
      105,
      46
    );
    doc1.text('Code TVA : ' + this.isNull(this.docEntete.codeTva), 105, 52);
    doc1.setFontSize(13);
    doc1.setFontType('bold');
    doc1.text(this.titreDoc, 10, 64);
    doc1.text(this.combine, 30, 69);
    doc1.setFontType('normal');
    doc1.setFontSize(10);
    doc1.text(this.docEntete.date, 102, 69);
    doc1.text(this.isNull(this.docEntete.reg), 136, 69);
    doc1.text(this.docEntete.operateur, 169, 69);

    let pages = 1;
    doc1.text(String(pages), 200, 69);
    if (Number(this.docEntete.remise) > 0) {
      doc1.text('Rem', 195, 77);
    }

    let start = 84;
    // doc1.setFontSize(8);
    let compteur = 1;
    for (const doc of this.docDetails) {
      doc1.setFontSize(10);
      doc1.text(compteur.toFixed(0), 7, start);
      doc1.text(this.isNull(this.docEntete.ref), 12, start);
      doc1.text(Number(doc.quantite).toFixed(0), 45, start, 'right');
      doc1.setFontSize(8);
      doc1.text(doc.design, 60, start);
      doc1.text(doc.codeAimprimer, 119, start);
      doc1.text(Number(doc.prix).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '), 163, start, 'right');
      doc1.text(Number(doc.total).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '), 186, start, 'right');
      if (Number(this.docEntete.remise) > 0) {
        doc1.text(doc.tRemise, 199, start, 'right');
      }
      doc1.text(doc.tauxTva, 209, start, 'right');

      compteur++;
      start = start + 6;
      if (start > longLignes && compteur < this.docDetails.length) {
        doc1.addPage();
        pages++;
        doc1.setFontSize(15);
        doc1.setFont('Helvetica');
        if (this.selectedValuesDup) {
          doc1.fromHTML('<b><i>DUPLICATA</i></b>', 60, 30);
        }
        doc1.setFontType('normal');
        doc1.setFontSize(10);
        doc1.text(this.docEntete.deno, 105, 34);
        doc1.text(this.isNull(this.docEntete.adresse), 105, 40);
        doc1.text(
          this.isNull(this.docEntete.post) + ' ' + this.docEntete.ville,
          105,
          46
        );
        doc1.text('Code TVA : ' + this.isNull(this.docEntete.codeTva), 105, 52);
        doc1.setFontSize(13);
        doc1.setFontType('bold');
        doc1.text(this.titreDoc, 10, 64);
        doc1.text(this.combine, 30, 69);
        doc1.setFontType('normal');
        doc1.setFontSize(10);
        doc1.text(this.docEntete.date, 102, 69);
        doc1.text(this.isNull(this.docEntete.reg), 136, 69);
        doc1.text(this.docEntete.operateur, 169, 69);

        doc1.text(String(pages), 200, 69);
        if (Number(this.docEntete.remise) > 0) {
          doc1.text('Rem', 195, 75);
        }
        start = 84;
        doc1.setFontSize(8);
      }
    }
    doc1.setFontSize(10);
    doc1.text(this.docEntete.denoVendeur, 5, startFooter - 10);
    if (
      this.titreDoc !== 'B/LIVRAISON' &&
      this.titreDoc !== 'AVOIR B/L'
    ) {
      // tva
      if (Number(this.docEntete.base0) > 0) {
        doc1.text('0', 10, startFooter - 30, 'right');
        doc1.text(
          Number(this.docEntete.base0).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          30,
          startFooter - 30,
          'right'
        );
        doc1.text('0.000', 50, startFooter - 30, 'right');
      }
      if (Number(this.docEntete.base29) > 0) {
        doc1.text('7', 10, startFooter - 25, 'right');
        doc1.text(
          Number(this.docEntete.base29).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          30,
          startFooter - 25,
          'right'
        );
        doc1.text(
          ((Number(this.docEntete.base29) * 0.07).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          50,
          startFooter - 25,
          'right'
        );
      }
      if (Number(this.docEntete.base10) > 0) {
        doc1.text('13', 10, startFooter - 20, 'right');
        doc1.text(
          Number(this.docEntete.base10).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          30,
          startFooter - 20,
          'right'
        );
        doc1.text(
          ((Number(this.docEntete.base10) * 0.13).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          50,
          startFooter - 20,
          'right'
        );
      }
      if (Number(this.docEntete.base17) > 0) {
        doc1.text('19', 10, startFooter - 15, 'right');
        doc1.text(
          Number(this.docEntete.base17).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          30,
          startFooter - 15,
          'right'
        );
        doc1.text(
          ((Number(this.docEntete.base17) * 0.19).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          50,
          startFooter - 15,
          'right'
        );
      }
      // fin tva
      doc1.text(
        (Number(this.docEntete.remise) + Number(this.docEntete.ht)).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        200,
        startFooter - 34,
        'right'
      );
      if (Number(this.docEntete.remise) > 0) {
        doc1.text('Remise', 156, startFooter - 28);
        doc1.text(
          Number(this.docEntete.remise).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          200,
          startFooter - 28,
          'right'
        );
      }
      doc1.text(
        ((
          Number(this.docEntete.base29) * 0.07 +
          Number(this.docEntete.base10) * 0.13 +
          Number(this.docEntete.base17) * 0.19
        ).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        200,
        startFooter - 22,
        'right'
      );
      doc1.text(
        Number(this.docEntete.timbre).toFixed(3),
        200,
        startFooter - 16,
        'right'
      );
      doc1.text(
        Number(this.docEntete.net).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        200,
        startFooter - 10,
        'right'
      );

      doc1.text(
        this.trans(Number(this.docEntete.net).toFixed(3)),
        85,
        startFooter + 1
      );
      doc1.setFontType('normal');
      if (Number(this.docEntete.timbre) > 0) {
        doc1.text(
          'Droit de Timbre Loi 93-53 payé sur l\'Etat',
          70,
          startFooter + 7
        );
      }
    }

    if (this.imprimerDirect) {
      const printPage = async (sURL) => {
        const oHiddFrame = document.createElement('iframe');
        const printPromise = new Promise<void>((resolve, reject) => {
          oHiddFrame.onload = function () {
            try {
              oHiddFrame.contentWindow.focus(); // Required for IE
              oHiddFrame.contentWindow.print();
              resolve();
            } catch (error) {
              reject(error);
            }
          };
        });
        oHiddFrame.style.position = 'fixed';
        oHiddFrame.style.right = '0';
        oHiddFrame.style.bottom = '0';
        oHiddFrame.style.width = '0';
        oHiddFrame.style.height = '0';
        oHiddFrame.style.border = '0';
        oHiddFrame.src = sURL;
        document.body.appendChild(oHiddFrame);
        await printPromise;
      };
      printPage(doc1.output('bloburl')).catch((error) => {
        // Fallback printing method
        doc1.autoPrint();
        doc1.output('dataurlnewwindow');
      });
    } else {
      window.open(doc1.output('bloburl'), '_blank');
    }
  }
  async imprimerSMD() {
    const longLignes = 132;
    const startFooter = 181;

    const doc1 = new jspdf();
    doc1.setFontSize(15);
    doc1.setFont('Helvetica');
    // doc1.setFontType('italic');
    if (this.selectedValuesDup) {
      doc1.fromHTML('<b><i>DUPLICATA</i></b>', 60, 31);
    }
    doc1.setFontType('normal');
    doc1.setFontSize(12);
    doc1.text(this.docEntete.deno, 115, 39);
    doc1.text(this.isNull(this.docEntete.adresse), 115, 45);
    doc1.text(
      this.isNull(this.docEntete.post) + ' ' + this.docEntete.ville,
      115,
      51
    );
    doc1.text('Code TVA : ' + this.isNull(this.docEntete.codeTva), 115, 57);
    doc1.setFontSize(12);
    doc1.setFontType('bold');

    /*if (this.nature === 'B/L      ') {
      doc1.text('B/LIVRAISON', 8, 66);
      doc1.text(this.combine, 50, 68);
    }*/
    doc1.text(this.titreDoc, 8, 66);
    doc1.text(this.combine, 50, 70);
    doc1.setFontType('normal');
    doc1.setFontSize(10);
    doc1.text(this.docEntete.date, 99, 70);
    doc1.text(this.isNull(this.docEntete.reg), 130, 70);
    doc1.text(this.docEntete.operateur, 168, 70);

    let pages = 1;
    doc1.text(String(pages), 203, 70);
    if (Number(this.docEntete.remise) > 0) {
      doc1.text('Rem', 175, 77);
    }

    let start = 85;
    doc1.setFontSize(9);
    let compteur = 1;
    this.docDetails.sort((a, b) =>
      a.codeAimprimer < b.codeAimprimer
        ? -1
        : a.ncodeAimprimer > b.codeAimprimer
        ? 1
        : 0
    );
    for (const doc of this.docDetails) {
      doc1.text(String(compteur), 5, start);
      doc1.text(this.isNull(doc.codeAimprimer), 14, start);
      doc1.text(doc.design, 41, start);
      doc1.text(Number(doc.quantite).toFixed(0), 127, start, 'right');
      doc1.text(Number(doc.prix).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '), 148, start, 'right');
      doc1.text(Number(doc.total).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '), 173, start, 'right');
      if (Number(this.docEntete.remise) > 0) {
        doc1.text(doc.tRemise, 181, start, 'right');
      }
      doc1.text(doc.tauxTva, 190, start, 'right');
      doc1.text(
        (
          Number(doc.total) -
          (Number(doc.total) * Number(doc.tRemise)) / 100
        ).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        210,
        start,
        'right'
      );

      compteur++;
      start = start + 5;
      if (start > longLignes && compteur < this.docDetails.length) {
        doc1.addPage();
        pages++;
        doc1.setFontSize(15);
        doc1.setFont('Helvetica');
        // doc1.setFontType('italic');
        if (this.selectedValuesDup) {
          doc1.fromHTML('<b><i>DUPLICATA</i></b>', 60, 31);
        }
        doc1.setFontType('normal');
        doc1.setFontSize(12);
        doc1.text(this.docEntete.deno, 115, 39);
        doc1.text(this.isNull(this.docEntete.adresse), 115, 45);
        doc1.text(
          this.isNull(this.docEntete.post) + ' ' + this.docEntete.ville,
          115,
          51
        );
        doc1.text('Code TVA : ' + this.isNull(this.docEntete.codeTva), 115, 57);
        doc1.setFontSize(12);
        doc1.setFontType('bold');

        /*if (this.nature === 'B/L      ') {
      doc1.text('B/LIVRAISON', 8, 66);
      doc1.text(this.combine, 50, 68);
    }*/
        doc1.text(this.titreDoc, 8, 66);
        doc1.text(this.combine, 50, 70);
        doc1.setFontType('normal');
        doc1.setFontSize(10);
        doc1.text(this.docEntete.date, 99, 70);
        doc1.text(this.isNull(this.docEntete.reg), 130, 70);
        doc1.text(this.docEntete.operateur, 168, 70);

        doc1.text(String(pages), 203, 70);
        if (Number(this.docEntete.remise) > 0) {
          doc1.text('Rem', 175, 77);
        }

        start = 85;
        doc1.setFontSize(9);
      }
    }
    doc1.setFontSize(10);

    doc1.text(this.docEntete.denoVendeur, 5, startFooter + 7);
    // tva
    if (Number(this.docEntete.base0) > 0) {
      doc1.text('0', 5, startFooter - 30);
      doc1.text(
        Number(this.docEntete.base0).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        34,
        startFooter - 30,
        'right'
      );
      if (
        this.titreDoc !== 'B/LIVRAISON' &&
        this.titreDoc !== 'AVOIR B/L'
      ) {
        doc1.text('0.000', 52, startFooter - 30, 'right');
      }
    }
    if (Number(this.docEntete.base29) > 0) {
      doc1.text('7', 5, startFooter - 25);
      doc1.text(
        Number(this.docEntete.base29).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        34,
        startFooter - 25,
        'right'
      );
      if (
        this.titreDoc !== 'B/LIVRAISON' &&
        this.titreDoc !== 'AVOIR B/L'
      ) {
        doc1.text(
          ((Number(this.docEntete.base29) * 0.07).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          52,
          startFooter - 25,
          'right'
        );
      }
    }
    if (Number(this.docEntete.base10) > 0) {
      doc1.text('13', 5, startFooter - 20);
      doc1.text(
        Number(this.docEntete.base10).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        34,
        startFooter - 20,
        'right'
      );
      if (
        this.titreDoc !== 'B/LIVRAISON' &&
        this.titreDoc !== 'AVOIR B/L'
      ) {
        doc1.text(
          ((Number(this.docEntete.base10) * 0.13).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          52,
          startFooter - 20,
          'right'
        );
      }
    }
    if (Number(this.docEntete.base17) > 0) {
      doc1.text('19', 5, startFooter - 15);
      doc1.text(
        Number(this.docEntete.base17).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        34,
        startFooter - 15,
        'right'
      );
      if (
        this.titreDoc !== 'B/LIVRAISON' &&
        this.titreDoc !== 'AVOIR B/L'
      ) {
        doc1.text(
          ((Number(this.docEntete.base17) * 0.19).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          52,
          startFooter - 15,
          'right'
        );
      }
    }
    // fin tva
    if (Number(this.docEntete.remise) > 0) {
      doc1.text('Remise', 138, startFooter - 38);
      doc1.text(
        Number(this.docEntete.remise).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        141,
        startFooter - 23
      );
    }
    doc1.text(
      (Number(this.docEntete.remise) + Number(this.docEntete.ht)).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
      118,
      startFooter - 23
    );
    if (
      this.titreDoc !== 'B/LIVRAISON' &&
      this.titreDoc !== 'AVOIR B/L'
    ) {
      doc1.text(
        ((
          Number(this.docEntete.base29) * 0.07 +
          Number(this.docEntete.base10) * 0.13 +
          Number(this.docEntete.base17) * 0.19
        ).toFixed(4).match(/^-?\d+(?:\.\d{0,3})?/)[0]).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        167,
        startFooter - 23,
        'right'
      );
      doc1.text(
        Number(this.docEntete.timbre).toFixed(3),
        179,
        startFooter - 23,
        'right'
      );
      doc1.text(
        Number(this.docEntete.net).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
        210,
        startFooter - 23,
        'right'
      );
      doc1.text(
        this.trans(Number(this.docEntete.net).toFixed(3)),
        85,
        startFooter
      );
      doc1.setFontType('normal');
      if (Number(this.docEntete.timbre) > 0) {
        doc1.text('Droit de Timbre payé sur l\'Etat', 5, startFooter);
      }
    }
    const displayDate = new Date().toLocaleDateString('en-GB');
    const displayTime = new Date().toLocaleTimeString();
    doc1.text(
      displayDate + ' ' + displayTime.substring(0, 5),
      180,
      startFooter + 7
    );

    if (this.imprimerDirect) {
      const printPage = async (sURL) => {
        const oHiddFrame = document.createElement('iframe');
        const printPromise = new Promise<void>((resolve, reject) => {
          oHiddFrame.onload = function () {
            try {
              oHiddFrame.contentWindow.focus(); // Required for IE
              oHiddFrame.contentWindow.print();
              resolve();
            } catch (error) {
              reject(error);
            }
          };
        });
        oHiddFrame.style.position = 'fixed';
        oHiddFrame.style.right = '0';
        oHiddFrame.style.bottom = '0';
        oHiddFrame.style.width = '0';
        oHiddFrame.style.height = '0';
        oHiddFrame.style.border = '0';
        oHiddFrame.src = sURL;
        document.body.appendChild(oHiddFrame);
        await printPromise;
      };
      printPage(doc1.output('bloburl')).catch((error) => {
        // Fallback printing method
        doc1.autoPrint();
        doc1.output('dataurlnewwindow');
      });
    } else {
      window.open(doc1.output('bloburl'), '_blank');
    }
  }
  async imprimer(index: number) {
    if (index === 0) {
      this.imprimerDirect = true;
    } else {
      this.imprimerDirect = false;
    }
    if (this.ste.societe === 'CHAMAM DIVISION GROS') {
      await this.imprimerCDG();
    } else {
      if (this.ste.societe === 'SMD (STE MODERNE DISTRIBUTION)') {
        await this.imprimerSMD();
      } else {
        await this.imprimerDetails();
      }
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
}
