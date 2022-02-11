import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AchatService } from '../services/achat.service';
import { SteService } from '../services/ste.service';
import * as jspdf from 'jspdf';
import { Ste } from '../services/ste';
import { MouveService } from '../services/mouve.service';
import { OverlayPanel } from 'primeng/primeng';
import {InputText} from 'primeng/inputtext';
import {formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@Component({
  selector: 'app-reedition-rapport-achat',
  templateUrl: './reedition-rapport-achat.component.html',
  styleUrls: ['./reedition-rapport-achat.component.scss']
})
export class ReeditionRapportAchatComponent implements OnInit {

  @ViewChild('ovo')
  public ovo: OverlayPanel;

  @ViewChild('numero')
  public numero: InputText;
  public nmAchat = '';
  achat = '';
  achats: any;
  ste: Ste;
  societe: any;
  date;
  reedictionAchat: any;
  valide = true;
  valide2 = true ;
  wasInside: boolean;
  ms = '';

  constructor(private achatService: AchatService,
              private steService: SteService,
              private mouveService: MouveService) { }

  ngOnInit() {

   document.getElementById('numero').focus();
  }

  verifierNumero() {
  /*
    if (this.op !== null && this.op !== undefined) {
      this.op.visible = false;
    }*/

    const num: string = String(this.nmAchat );
    this.nmAchat  = num;

          if (this.nmAchat  === 'null') {
              this.nmAchat  = '';
          } else {
              switch (this.nmAchat .length) {
                case 1: {
                  this.nmAchat  = '0000' +  this.nmAchat ;
                  break;
                }
                case 2: {
                  this.nmAchat  = '000' +  this.nmAchat ;
                  break;
                }
                case  3: {
                  this.nmAchat  = '00' +  this.nmAchat ;
                  break;
                }
                case  4: {
                  this.nmAchat  = '0' +  this.nmAchat ;
                  break;
                }
                default: {
                  break;
                }
            }
            }

  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ovo.hide();
    }
    this.wasInside = false;

  }
  async Imprimer(e) {
    this.wasInside = true;

    this.ovo.hide();
    if (this.nmAchat !== '') {
     // this.verifierNumero();
      this.achat = 'ACHAT    ' + this.nmAchat;
      await this.achatService.rechercheAchats(this.achat).toPromise().then(
        (data) => {

          this.achats = data['_embedded'].reeditionRapAchts[0];
          console.log('achat  ', this.achats);
        }
      );
      await this.mouveService.getRedictionAchats(this.achat).toPromise().then(
        (data) => {

         const liste = data['_embedded'].reedictionAchats;
          console.log('mouvemeentttt', this.reedictionAchat);
          if (liste.length > 0) {
            for (const ob of liste) {
              console.log('ob ', ob);
               if (ob.variation != null) {
                 ob.variation = Number(ob.variation).toFixed(2);
                 if (ob.variation > 10000) {
                   ob.variation = '* NDF';
                 }
               }
            }
          }
          this.reedictionAchat = liste;



        }
      );
    } else if (this.nmAchat === '') {
      this.valide = false ;
    }
     if (this.achats === undefined) {
      this.valide = false ;
      this.ms = 'Aucun rapport d\'achat trouvé !';
     this.ovo.show(e, document.getElementById('visualiser'));
      } else {
        if ((this.reedictionAchat === undefined || this.reedictionAchat.length === 0 ) && this.achats !== undefined  ) {
          // + this.achats.dateAchat
          const datee = this.achats.dateAchat.substr(6, 4);
          this.ms = 'Achat effectué en ' + datee + ' ne peut être visualiser ! ';
          this.ovo.show(e, document.getElementById('visualiser'));

        } else {


    if (this.reedictionAchat !== undefined) {

      this.valide2 = false;
      if (this.reedictionAchat.codeMouve === null || String(this.reedictionAchat.codeMouve) === '') {
        this.reedictionAchat.codeMouve = '';
      }
      if (this.reedictionAchat.desStock === null || String(this.reedictionAchat.desStock) === '') {
          this.reedictionAchat.desStock = '';
      }
      if (this.reedictionAchat.numCmd === null || String(this.reedictionAchat.numCmd) === '') {
        this.reedictionAchat.numCmd = '';
      }
      if (this.reedictionAchat.qteMouve === null || String(this.reedictionAchat.qteMouve) === '') {
        this.reedictionAchat.qteMouve = '';
      }
      if (this.reedictionAchat.ancPv === null || String(this.reedictionAchat.ancPv) === '') {
        this.reedictionAchat.ancPv = '';
      } else {
        this.reedictionAchat.ancPv = parseFloat(this.reedictionAchat.ancPv).toFixed(3);
      }
      if (this.reedictionAchat.nouvPv === null || String(this.reedictionAchat.nouvPv) === '') {
        this.reedictionAchat.nouvPv = '';
      } else {
        this.reedictionAchat.nouvPv = parseFloat(this.reedictionAchat.nouvPv).toFixed(3);
      }
      if (this.reedictionAchat.prixMnOrg === null || String(this.reedictionAchat.prixMnOrg) === '') {
        this.reedictionAchat.prixMnOrg = '';
      } else {
        this.reedictionAchat.prixMnOrg = parseFloat(this.reedictionAchat.prixMnOrg).toFixed(3);
      }

      if (this.reedictionAchat.prixAch === null || String(this.reedictionAchat.prixAch) === '') {
        this.reedictionAchat.prixAch = '';
      } else {
        this.reedictionAchat.prixAch = parseFloat(this.reedictionAchat.prixAch).toFixed(3);
      }


      if (this.reedictionAchat.pvCalc === null || String(this.reedictionAchat.pvCalc) === '') {
        this.reedictionAchat.pvCalc = '';
      } else {
        this.reedictionAchat.pvCalc = parseFloat(this.reedictionAchat.pvCalc).toFixed(3);
      }
      if (this.reedictionAchat.variation === null || String(this.reedictionAchat.variation) === '') {
        this.reedictionAchat.variation = '';
      } else {
        this.reedictionAchat.variation = parseFloat(this.reedictionAchat.variation).toFixed(2);
      }
    }
      const doc1 = new jspdf();
      doc1.setFontSize(10);
      doc1.setFontStyle('Arial');
      await this.steService
      .getSte()
      .toPromise()
      .then(data => {
        this.ste = data['_embedded'].ste;
        this.societe = this.ste[0];
      });

        doc1.text('SOCIETE.: ' + this.societe.societe, 10, 15);

        const temps = formatDate(new Date(), ' HH:mm:ss ', 'fr-FR', '+01');
                  this.date = new Date().toLocaleDateString('en-GB');
                //  this.date1 = this.from.toLocaleDateString('en-GB');
            if (this.achats !== undefined) {

                doc1.setFontSize(18);
                doc1.setFontStyle('bold');
                doc1.setFontStyle('Arial');
                doc1.text('ACHAT N° : ' + this.nmAchat, 80, 30);
                doc1.setFontSize(10);
                doc1.setFontStyle('Arial');
                doc1.text('DU  ' + this.achats.dateAchat.substring(0, 10) , 135, 18);
                doc1.text('Edité le ' + this.date + '  ' + temps, 162, 18);
                doc1.text('FOURNISSEUR : ' + this.achats.nomFour, 10, 35);
                doc1.text('FACTURE : ' + this.achats.refAchat, 10, 40);
              }
                let y = 58;
      let numPage = 1;
      if (this.reedictionAchat !== undefined) {
        doc1.setFontSize(8);
        doc1.setFontStyle('bold');
        doc1.line(9, 45, 205, 45);
        doc1.text('Référence', 10, 50);
        doc1.text('Désignation', 42, 50);
        doc1.text('N° Cmd', 85, 50);
        doc1.text('QTE', 101, 50);
        doc1.text('Pr-Org', 115, 50);
        doc1.text('Pr-Dt', 135, 50);
        doc1.text('PV-Calc', 147, 50);
        doc1.text('Nouv-PV', 162, 50);
        doc1.text('Anc-PV', 178, 50);
        doc1.text('% VAR', 192, 50);
        const tab = new Array();
        // tab.indexOf;


        for (const ach of this.reedictionAchat) {


          doc1.setFontSize(7);
        doc1.setFontStyle('Arial');
        doc1.text(String(ach.codeMouve), 10, y);

        doc1.setFontSize(6);
        doc1.text(String(ach.desStock), 42, y);
      //  doc1.setFontSize(8);
        if (ach.numCmd === null) {
          ach.numCmd = '';
        }
        doc1.text(String(ach.numCmd), 86, y);
        doc1.text(String(ach.qteMouve), 107, y, 'right');
        doc1.text(Number(ach.prixMnOrg).toFixed(3), 124, y, 'right');
        doc1.text(Number(ach.prixAch).toFixed(3), 142, y, 'right');
        doc1.text(Number(ach.pvCalc).toFixed(3), 158, y, 'right');
        doc1.text(Number(ach.nouvPv).toFixed(3), 175, y, 'right');
        doc1.text(Number(ach.ancPv).toFixed(3), 189, y, 'right');
        doc1.text(String(ach.variation), 203, y, 'right');




        y = y + 7;


        if (y > 270) {

          doc1.addPage();
          numPage++;






          doc1.line(9, 12, 205, 12);
          doc1.setFontSize(8);
         doc1.setFontStyle('bold');


        // doc1.line(9, 17, 205, 45);
         doc1.text('Référence', 10, 17);
         doc1.text('Désignation', 42, 17);
         doc1.text('N° Cmd', 85, 17);
         doc1.text('QTE', 101, 17);
         doc1.text('Pr-Org', 115, 17);
         doc1.text('Pr-Dt', 135, 17);
         doc1.text('PV-Calc', 147, 17);
         doc1.text('Nouv-PV', 162, 17);
         doc1.text('Anc-PV', 178, 17);
         doc1.text('% VAR', 192, 17);
         doc1.line(9, 20, 205, 20);

        doc1.setFontSize(8);
        doc1.setFontStyle('Arial');

        y = 25;

        }
        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
     //   doc1.setFontStyle('bold');
        doc1.line(9, 284, 205, 284, 'FD');
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);




         doc1.setFontSize(10);
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
      }
      }

      if (y > 267) {
        doc1.addPage();
        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
     //   doc1.setFontStyle('bold');
        doc1.line(9, 284, 205, 284, 'FD');
        doc1.text('Page ' + (numPage + 1).toFixed(0), 100, 287 + 2);
        doc1.setFontStyle('bold');
        doc1.setFontSize(16);
        doc1.line(7, 12, 207, 12);
        doc1.line(7, 12, 7, 20);
        doc1.setFontSize(16);
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
        doc1.setFontSize(10);
        doc1.text('* NDF : Non défini' , 10, 22);
        if (this.achats !== undefined) {
          doc1.text(String(this.achats.totDev ) + '  ' + String(this.achats.devise), 102, 17);
         console.log('totaaaal', this.achats);

          }
          doc1.setFontSize(16);
          doc1.setFontStyle('Arial');
          doc1.setFontStyle('bold');
          doc1.line(7, 20, 207, 20);
          doc1.line(207, 12, 207, 20);


      } else {
        doc1.setFontStyle('bold');
        doc1.setFontSize(16);
        doc1.line(7, y + 2, 207, y + 2);
        doc1.line(7, y + 2, 7, y + 13);
        doc1.setFontSize(16);
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
        doc1.text('Total : ' , 75, y + 10);
        doc1.setFontSize(10);
        doc1.text('* NDF : Non défini' , 10, y + 18);

          const total = Number(this.achats.totDev).toFixed(3);
          doc1.text(String(total) + '  ' + String(this.achats.devise), 102, y + 10);


          doc1.setFontSize(16);
          doc1.setFontStyle('Arial');
          doc1.setFontStyle('bold');
          doc1.line(7, y + 13, 207, y + 13);
          doc1.line(207, y + 2, 207, y + 13);

      }


     /*   doc1.setFontSize(10);
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        doc1.line(9, 45, 9, y + 11);*/
      //  doc1.line(205, 45, 205, y + 11);
        if (this.achats !== undefined) {
        //  doc1.line(10, 280, 205, 280, 'FD');
        doc1.setDisplayMode('175%');
          window.open(doc1.output('bloburl'), '_blank');
        }
  }
}
}
  async imprimer(e, code: string) {
    console.log('code achat rap ',  code);

    this.wasInside = true;

    this.ovo.hide();

     // this.verifierNumero();

      this.achat = 'ACHAT    ' + code;
      const cod = 'ACHAT    ' + code;
      await this.achatService.rechercheAchats(cod).toPromise().then(
        (data) => {

          this.achats = data['_embedded'].reeditionRapAchts[0];
          console.log('entete achat  ', this.achats);
        }
      );
      await this.mouveService.getRedictionAchats(cod).toPromise().then(
        (data) => {

         const liste = data['_embedded'].reedictionAchats;
          console.log('mouvemeentttt', liste);
          if (liste.length > 0) {
            for (const ob of liste) {
              console.log('ob ', ob);
               if (ob.variation != null) {
                 ob.variation = Number(ob.variation).toFixed(2);
                 if (ob.variation > 10000) {
                   ob.variation = '* NDF';
                 }
               }
            }
          }
          this.reedictionAchat = liste;
          console.log('this.reedictionAchat  **** ', this.reedictionAchat);


        }
      );

      const doc1 = new jspdf();
      doc1.setFontSize(10);
      doc1.setFontStyle('Arial');
      await this.steService
      .getSte()
      .toPromise()
      .then(data => {
        this.ste = data['_embedded'].ste;
        this.societe = this.ste[0];
      });

        doc1.text('SOCIETE.: ' + this.societe.societe, 10, 15);

        const temps = formatDate(new Date(), ' HH:mm:ss ', 'fr-FR', '+01');
                  this.date = new Date().toLocaleDateString('en-GB');
                //  this.date1 = this.from.toLocaleDateString('en-GB');
            if (this.achats !== undefined) {

                doc1.setFontSize(18);
                doc1.setFontStyle('bold');
                doc1.setFontStyle('Arial');
                doc1.text('ACHAT N° : ' + code, 80, 30);
                doc1.setFontSize(10);
                doc1.setFontStyle('Arial');
                doc1.text('DU  ' + this.achats.dateAchat.substring(0, 10) , 135, 18);
                doc1.text('Edité le ' + this.date + '  ' + temps, 162, 18);
                doc1.text('FOURNISSEUR : ' + this.achats.nomFour, 10, 35);
                doc1.text('FACTURE : ' + this.achats.refAchat, 10, 40);
              }
                let y = 58;
      let numPage = 1;
      if (this.reedictionAchat !== undefined) {

        doc1.setFontSize(8);
        doc1.setFontStyle('bold');
        doc1.line(9, 45, 205, 45);
        doc1.text('Référence', 10, 50);
        doc1.text('Désignation', 42, 50);
        doc1.text('N° Cmd', 85, 50);
        doc1.text('QTE', 101, 50);
        doc1.text('Pr-Org', 115, 50);
        doc1.text('Pr-Dt', 135, 50);
        doc1.text('PV-Calc', 147, 50);
        doc1.text('Nouv-PV', 162, 50);
        doc1.text('Anc-PV', 178, 50);
        doc1.text('% VAR', 192, 50);
        const tab = new Array();
         // tab.indexOf;


        for (const ach of this.reedictionAchat) {


          doc1.setFontSize(7);
        doc1.setFontStyle('Arial');
        doc1.text(String(ach.codeMouve), 10, y);
        doc1.setFontSize(6);
        doc1.text(String(ach.desStock), 42, y);
       // doc1.setFontSize(8);
        if (ach.numCmd === null) {
          ach.numCmd = '';
        }
        doc1.text(String(ach.numCmd), 86, y);
        doc1.text(String(ach.qteMouve), 107, y, 'right');
        doc1.text(Number(ach.prixMnOrg).toFixed(3), 124, y, 'right');
        doc1.text(Number(ach.prixAch).toFixed(3), 142, y, 'right');
        doc1.text(Number(ach.pvCalc).toFixed(3), 158, y, 'right');
        doc1.text(Number(ach.nouvPv).toFixed(3), 175, y, 'right');
        doc1.text(Number(ach.ancPv).toFixed(3), 189, y, 'right');
        doc1.text(String(ach.variation), 203, y, 'right');





        y = y + 7;


        if (y > 270) {

          doc1.addPage();
          numPage++;






          doc1.line(9, 12, 205, 12);
          doc1.setFontSize(8);
         doc1.setFontStyle('bold');


         doc1.text('Référence', 10, 17);
         doc1.text('Désignation', 42, 17);
         doc1.text('N° Cmd', 85, 17);
         doc1.text('QTE', 101, 17);
         doc1.text('Pr-Org', 115, 17);
         doc1.text('Pr-Dt', 130, 17);
         doc1.text('PV-Calc', 147, 17);
         doc1.text('Nouv-PV', 162, 17);
         doc1.text('Anc-PV', 178, 17);
         doc1.text('% VAR', 192, 17);
         doc1.line(9, 20, 205, 20);

        doc1.setFontSize(8);
        doc1.setFontStyle('Arial');

        y = 25;

        }
        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
     //   doc1.setFontStyle('bold');
        doc1.line(9, 284, 205, 284, 'FD');
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);




         doc1.setFontSize(10);
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
      }
      }

      if (y > 267) {
        doc1.addPage();
        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
     //   doc1.setFontStyle('bold');
        doc1.line(9, 284, 205, 284, 'FD');
        doc1.text('Page ' + (numPage + 1).toFixed(0), 100, 287 + 2);
        doc1.setFontStyle('bold');
        doc1.setFontSize(16);
        doc1.line(7, 12, 207, 12);
        doc1.line(7, 12, 7, 20);
        doc1.setFontSize(16);
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
        doc1.setFontSize(10);
        doc1.text('* NDF : Non défini' , 10, 22);
        if (this.achats !== undefined) {
          doc1.text(String(this.achats.totDev ) + '  ' + String(this.achats.devise), 102, 17);
         console.log('totaaaal', this.achats);

          }
          doc1.setFontSize(16);
          doc1.setFontStyle('Arial');
          doc1.setFontStyle('bold');
          doc1.line(7, 20, 207, 20);
          doc1.line(207, 12, 207, 20);


      } else {
        doc1.setFontStyle('bold');
        doc1.setFontSize(16);
        doc1.line(7, y + 2, 207, y + 2);
        doc1.line(7, y + 2, 7, y + 13);
        doc1.setFontSize(16);
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
        doc1.text('Total : ' , 75, y + 10);
        doc1.setFontSize(10);
        doc1.text('* NDF : Non défini' , 10, y + 18);
        if (this.achats !== undefined) {
          const total = Number(this.achats.totDev).toFixed(3);
          doc1.text(String(total) + '  ' + String(this.achats.devise), 102, y + 10);

          }
          doc1.setFontSize(16);
          doc1.setFontStyle('Arial');
          doc1.setFontStyle('bold');
          doc1.line(7, y + 13, 207, y + 13);
          doc1.line(207, y + 2, 207, y + 13);

      }


     /*   doc1.setFontSize(10);
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        doc1.line(9, 45, 9, y + 11);*/
      //  doc1.line(205, 45, 205, y + 11);
        if (this.achats !== undefined) {
        //  doc1.line(10, 280, 205, 280, 'FD');
        doc1.setDisplayMode('175%');
          window.open(doc1.output('bloburl'), '_blank');
        }


}

}
