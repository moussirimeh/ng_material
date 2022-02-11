import { Injectable } from '@angular/core';
import { StringFilterUI } from '@syncfusion/ej2-angular-grids';
import * as jspdf from 'jspdf';
import { globals } from 'src/environments/environment';
import { ClientService } from './client.service';
import { DdevisService } from './ddevis.service';
import { EdevisService } from './edevis.service';
import { NomClientOffreService } from './nomClientOffre.service';
import { RepresanService } from './represan.service';
import { SteService } from './ste.service';
import { StockService } from './stock.service';
import { Vendeur1Service } from './vendeur1.service';

@Injectable({
  providedIn: 'root',
})
export class ImpressionOffreService {
  constructor(
    private clientService: ClientService,
    private edevisService: EdevisService,
    private stockService: StockService,
    private vendeur1Service: Vendeur1Service,
    private ddevisService: DdevisService,
    private represanService: RepresanService,
    private nomClientOffreService: NomClientOffreService,
    private steService: SteService
  ) {}
  async imprimer(numOffre, entete, totaux) {
    let remiseGlobale;
    let codeClient;
    let selectedClient;
    let codeVendeur;
    let refCmd;
    let basDePage;
    let responsable;
    let selectedStock;
    let listeStockCMD;
    let selectedVendeur;
    let ville;
    let codeTva;
    let tel;
    let fax;
    let m;
    let adresse;
    let v_marge;
    let flag_timbre;
    let flag_exonor;
    let dated;
    let tvach;
    let s_netch;
    await this.edevisService
      .findByNumDev(numOffre)
      .toPromise()
      .then((data) => {
        console.log(data['_embedded'].edevis[0]);
        if (data['_embedded'].edevis[0]) {
          remiseGlobale = data['_embedded'].edevis[0].remGen;
          codeClient = data['_embedded'].edevis[0].cltDev;
          codeVendeur = data['_embedded'].edevis[0].vendeur;
          refCmd = data['_embedded'].edevis[0].ref;
          basDePage = data['_embedded'].edevis[0].basPage;
          responsable = data['_embedded'].edevis[0].attention;
          dated = data['_embedded'].edevis[0].datDev;
        }
      });
    // si offre inéxistant
    if (!codeClient) {
    } else {
      await this.ddevisService
        .findByCombineOrderByRang(numOffre)
        .toPromise()
        .then((data) => {
          let ddev = [];
          const details = data['_embedded'].ddevis;
          details.map(async (el) => {
            await this.stockService
              .getStock(el.code)
              .toPromise()
              .then((data) => {
                if (data['_embedded'].stocks[0]) {
                  (el.achat = data['_embedded'].stocks[0].achat),
                    (el.operateur = data['_embedded'].stocks[0].operateur);
                }
              });
            const ddevis = {
              id: el.id,
              code: el.code,
              qte: el.quantite,
              marge: el.tRemise,
              prix: el.prix,
              prixInit: el.prix / (1 - remiseGlobale / 100),
              tva: el.tauxTva,
              design: el.design,
              agenda: el.cartech,
              rang: el.rang,
              min: el.coutVenteMinim,
              prixtot: Number(el.prix * el.quantite).toFixed(3),
              achat: el.achat ? el.achat : 0,
              coefMarge:
                el.operateur === '4011052' || el.operateur === '4011574'
                  ? 1.2
                  : 1.25,
            };
            ddev.push(ddevis);
            ddev = ddev.sort((a, b) =>
              Number(a.rang) > Number(b.rang) ? 1 : -1
            );
          });
          selectedStock = ddev.sort((a, b) =>
            Number(a.rang) > Number(b.rang) ? 1 : -1
          );
          listeStockCMD = selectedStock;
        });
      await this.vendeur1Service
        .getVendeur1ByCode(codeVendeur)
        .toPromise()
        .then((data) => {
          selectedVendeur = data['_embedded'].vendeur1[0];
        });
      // this.totaliser(e, listeStockCMD);
      console.log(codeClient);
      if (
        codeClient.trim() === '7200' ||
        codeClient.trim() === '7300' ||
        codeClient.trim() === '7500'
      ) {
        await this.nomClientOffreService
          .getNomClientOffreByNumDev(numOffre)
          .toPromise()
          .then((data) => {
            selectedClient = data['_embedded'].NomClientOffre[0];

            ville = selectedClient.ville;
            codeTva = selectedClient.codeTva;
            selectedClient.tel ? (tel = selectedClient.tel) : (tel = '');
            selectedClient.fax ? (fax = selectedClient.fax) : (fax = '');
            m = selectedClient.deno;
            adresse = selectedClient.adresse;
            flag_timbre = true;
            selectedClient.represant = '99';
          });
      } else {
        await this.clientService
          .getClientByCode(codeClient)
          .toPromise()
          .then((data) => {
            selectedClient = data['_embedded'].clients[0];

            ville = selectedClient.ville;
            codeTva = selectedClient.codeTva;
            selectedClient.tel
              ? (tel = selectedClient.tel)
              : (tel = '         ');
            selectedClient.fax ? (fax = selectedClient.fax) : (fax = '');
            m = selectedClient.deno;
            adresse = selectedClient.adresse;
            /*selectedClient.respon
              ? (responsable = 'Mr. ' + selectedClient.respon)
              : (responsable = 'Mr.');*/
            if (
              Number(selectedClient.marque) > 0 &&
              (selectedClient.terme === 'O' || selectedClient.typeC === 'O')
            ) {
              v_marge = selectedClient.marque;
            } else {
              v_marge = 0;
            }

            if (selectedClient.timbre === 'O') {
              flag_timbre = true;
            } else {
              flag_timbre = false;
            }
            if (selectedClient.exonor === 'O') {
              flag_exonor = true;
            } else {
              flag_exonor = false;
            }
          });
      }
      let represantant = '';
      await this.represanService
        .findByCode(selectedClient.represant)
        .toPromise()
        .then((data) => {
          represantant = data['_embedded'].represans[0].deno;
        });
      if (totaux) {
        let s_Total1 = 0;
        let s_remise = 0;
        let s_base0 = 0;
        let s_net = 0;
        let s_ht = 0;
        let tva13 = 0;
        let tva19 = 0;
        let tva7 = 0;
        let s_base18 = 0;
        let s_base10 = 0;
        let s_base29 = 0;
        let tva = 0;
        for (const obj of listeStockCMD) {
          s_Total1 = s_Total1 + Number(obj.prixtot);
          s_remise = s_remise + Number(obj.prixtot) * Number(obj.marge) * 0.01;
          s_remise = s_remise + Number(obj.prixtot) * Number(obj.marge) * 0.01;
          switch (Number(obj.tva).toFixed(2)) {
            case '0.00': {
              s_base0 =
                s_base0 + Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
              break;
            }
            case '13.00': {
              s_base10 =
                s_base10 + Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
              break;
            }
            case '19.00': {
              s_base18 =
                s_base18 + Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
              break;
            }
            case '7.00': {
              s_base29 =
                s_base29 + Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
              break;
            }
          }
        }
        tva = s_base10 * 0.13 + s_base18 * 0.19 + s_base29 * 0.07;
        s_net = s_base0 + s_base10 * 1.13 + s_base18 * 1.19 + s_base29 * 1.07;
        s_ht = s_base0 + s_base10 + s_base18 + s_base29;
        s_remise = s_Total1 - s_ht;

        tva13 = s_base10 * 0.13;
        tva19 = s_base18 * 0.19;
        tva7 = s_base29 * 0.07;
        tvach = Number(tva).toFixed(3);
        if (flag_timbre) {
          s_net = s_net + 0.6;
        }
        s_netch = Number(s_net).toFixed(3);
      }

      let societe;
      const doc1 = new jspdf();
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');
      const signImg = new Image();
      societe = await globals.societe;
      if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
        signImg.src = 'assets/images/offres/signatures/' + codeVendeur + '.jpg';
      }
      if (entete) {
        if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
          const img = new Image();
          img.src = 'assets/images/offres/entete.jpg';
          doc1.addImage(img, 'JPEG', 10, 10, 190, 30);
        } else {
          await this.steService
            .getSte()
            .toPromise()
            .then((data) => {
              societe = data['_embedded'].ste[0];
            });
          doc1.text('SOCIETE..:  ' + societe.societe, 9, 15);
          doc1.text('ADRESSE..:  ' + societe.adresse, 9, 20);
          doc1.text('VILLE....:  ' + societe.ville, 9, 25);
          doc1.text('TEL......:  ' + societe.tel, 9, 30);
          doc1.text('FAX......:  ' + societe.fax, 9, 35);
          doc1.text('E-MAIL...:  ' + societe.email, 9, 40);
        }
      }
      doc1.text('Tunis, le : ' + dated, 165, 50);
      doc1.setFontSize(24);
      doc1.setFontStyle('bold');
      doc1.text('Offre de Prix N°:' + numOffre, 63, 50);
      doc1.setFontSize(12);
      doc1.text(
        '(Merci de rappeler ce numero d\'offre en cas de commande)',
        50,
        57
      );

      doc1.setFontStyle('Arial');
      doc1.text('A l\'attention de: ' + responsable, 9, 77);
      doc1.text('Votre Ref N°: ', 9, 91);
      if (refCmd) {
        doc1.text(refCmd, 35, 91);
      }
      const notreRef =
        selectedVendeur.deno.trim().charAt(0) +
        numOffre +
        '/' +
        dated.substring(8, 10);
      doc1.text('Notre Ref N°: ' + notreRef, 9, 98);
      doc1.text(m.trim(), 125, 77);
      if (adresse) {
        doc1.text(adresse, 125, 84);
      }
      if (ville) {
        doc1.text(ville, 125, 91);
      }
      if (String(tel).length > 0 && String(fax).length > 0) {
        doc1.text('TEL: ' + tel + ' FAX: ' + fax, 125, 98);
      } else {
        if (String(tel).length > 0) {
          doc1.text('TEL: ' + tel, 125, 98);
        } else {
          if (String(fax).length > 0) {
            doc1.text('FAX: ' + fax, 125, 98);
          }
        }
      }
      doc1.text('Messieurs,', 20, 114);
      doc1.text(
        'Nous vous remettons, notre meilleure offre de prix et délai, pour le materiel dénommé ci-dessous:',
        9,
        121
      );
      // entete du  tableau
      // doc1.line(9, 130, 205, 130);
      // doc1.line(9, 130, 9, 280);
      // doc1.line(205, 130, 205, 280);
      doc1.setFontSize(10);
      doc1.setFontStyle('bold');
      doc1.text('N°', 10, 133);
      doc1.text('Réf.Article', 15, 133);
      doc1.text('Désignation', 60, 133);
      doc1.text('Qte', 130, 133);
      doc1.text('TVA', 140, 133);
      doc1.text('Pu HT', 150, 133);
      doc1.text('Rem', 162, 133);
      doc1.text('Pu Net HT', 171, 133);
      doc1.text('T.Net HT', 190, 133);

      // creer la ligne
      doc1.line(9, 135, 205, 135);
      let y = 140;
      let numPage = 1;
      doc1.setFontSize(10);
      doc1.setFontStyle('Arial');
      // créer la ligne vertical
      doc1.setFontStyle('bold');
      let r = 1;
      let PUHT = 0;
      let TotHt = 0;
      let totalremise = 0;
      let tot;
      listeStockCMD.forEach(function (value) {
        doc1.setFontSize(9);
        doc1.setFontStyle('Arial');
        doc1.text(Number(r).toFixed(0), 10, y);
        doc1.text(value.code, 15, y);
        doc1.text(value.design, 60, y);
        doc1.text(Number(value.qte).toFixed(2), 135, y, 'right');
        doc1.text(Number(value.prix).toFixed(3), 160, y, 'right');
        doc1.text(Number(value.tva).toFixed(2), 147, y, 'right');
        if (Number(value.marge)>0){
        doc1.text(Number(value.marge).toFixed(2), 169, y, 'right');}
        PUHT = value.prix - (value.prix * value.marge) / 100;
        doc1.setFontStyle('bold');
        doc1.text(Number(PUHT).toFixed(3), 185, y, 'right');
        doc1.setFontStyle('normal');
        TotHt = PUHT * value.qte;
        doc1.text(Number(TotHt).toFixed(3), 204, y, 'right');
        totalremise = totalremise + TotHt;
        if (value.agenda && value.agenda !== '') {
          // y = y + 5;
          const splitAgenda = doc1.splitTextToSize(value.agenda, 60);
          for (let i = 0; i < splitAgenda.length; i++) {
            y = y + 5;
            // if (y > 280) {
            //   doc1.addPage();
            //   y = 20;
            // }
            doc1.text(60, y, splitAgenda[i]);
            // y = y + 5;
          }
        }
        y = y + 7;
        r = r + 1;
        // passer a une nouvelle page
        doc1.line(9, y - 4, 205, y - 4, 'FD');
        if (y > 277) {
          // doc1.line(9, y - 3, 205, y - 3, 'FD');
          if (entete) {
            if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
              const img = new Image();
              img.src = 'assets/images/offres/bp.jpg';
              doc1.addImage(img, 'JPEG', 10, 282, 190, 15);
            }
          }
          doc1.setFontSize(12);
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
          numPage++;
          doc1.addPage();
          // entete tableau
          // doc1.line(9, 12, 205, 12);
          if (listeStockCMD.length > r) {
            doc1.setFontSize(10);
            doc1.setFontStyle('bold');
            doc1.text('N°', 10, 17);
            doc1.text('Réf.Article', 15, 17);
            doc1.text('Désignation', 60, 17);
            doc1.text('Qte', 130, 17);
            doc1.text('TVA', 140, 17);
            doc1.text('Pu HT', 150, 17);
            doc1.text('Rem', 162, 17);
            doc1.text('Pu Net HT', 171, 17);
            doc1.text('T.Net HT', 190, 17);

            // creer la ligne

            doc1.line(9, 20, 205, 20);
            y = 26;
          } else {
            y = 15;
          }

          // if (numPage > 1) {
          // doc1.line(9, y - 14, 9, y + 254, 'FD');
          // doc1.line(205, y - 14, 205, y + 254, 'FD');
          // }
        }
      });

      //  doc1.line(9, y - 6, 205, y - 6, 'FD');

      //  doc1.line(9, 130, 9, y - 6);
      //  doc1.line(205, 130, 205, y - 6);

      doc1.setFontSize(12);
      let y1 = y + 1;
      if (y1 + 25 > 277) {
        if (entete) {
          if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
            const img = new Image();
            img.src = 'assets/images/offres/bp.jpg';
            doc1.addImage(img, 'JPEG', 10, 282, 190, 15);
          }
        }
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        numPage++;
        doc1.addPage();
        y1 = 17;
      }
      doc1.text(basDePage, 9, y1);

      if (totaux) {
        tot = totalremise.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& ');
        doc1.text('Total Net HT : ', 150, y1);
        doc1.text(tot, 204, y1, 'right');
        doc1.text('Total TVA     :', 150, y1 + 6);
        doc1.text(
          Number(tvach)
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          204,
          y1 + 6,
          'right'
        );
        if (flag_timbre) {
          doc1.text('Timbre           :', 150, y1 + 12);
          doc1.text('0.600', 204, y1 + 12, 'right');
        }
        doc1.setFontStyle('bold');
        doc1.text('Total TTC    :', 150, y1 + 18);
        doc1.text(
          Number(s_netch)
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          204,
          y1 + 18,
          'right'
        );
        doc1.setFontStyle('normal');
      }
      y1 = y1 + 30;
      if (y1 + 50 > 277) {
        if (entete) {
          if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
            const img = new Image();
            img.src = 'assets/images/offres/bp.jpg';
            doc1.addImage(img, 'JPEG', 10, 282, 190, 15);
          }
        }
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        numPage++;
        doc1.addPage();
        y1 = 17;
      }

      doc1.text(
        'Ces prix pourront être révisés et dépendront nottamment de la parité Devise/Dinar et de taux des droits' +
          '\net taxes en vigueur le jour de dédouanement\n' +
          '\n\tTout en espérant que notre offre retiendrait favorablement votre attention,\n' +
          '\nOffre établit par Mr : ' +
          selectedVendeur.deno +
          '\nOffre suivi par Mr   : ' +
          represantant,
        9,
        y1
      );

      if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
        const tabSignV = [
          '02',
          '03',
          '04',
          '05',
          '09',
          '14',
          '28',
          '29',
          '30',
          '36',
          '39',
          '40',
          '46',
        ];

        if (tabSignV.includes(codeVendeur)) {
          doc1.addImage(signImg, 'JPEG', 125, y1 + 15);
        }
      }
      if (entete) {
        if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
          const img = new Image();
          img.src = 'assets/images/offres/bp.jpg';
          doc1.addImage(img, 'JPEG', 10, 282, 190, 15);
        }
      }
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      window.open(doc1.output('bloburl'), '_blank');
    }
  }
}
