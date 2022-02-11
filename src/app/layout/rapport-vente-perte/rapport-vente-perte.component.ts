import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {StockService} from '../services/stock.service';
import {MouveService} from '../services/mouve.service';
import { FournisseurService } from '../services/fournisseur.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { FamilleService } from '../services/famille.service';
import { Fournisseur } from '../services/fournisseur';
import { RepresanService } from '../services/represan.service';
import { Represan } from '../services/represan';
import { Famille } from '../services/famille';
import { SfamilleService } from '../services/sfamille.service';
import { Sfamille } from '../services/sfamille';
import {Stock} from '../services/stock';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { SteService } from '../services/ste.service';

import {
  GridComponent,
  SearchSettingsModel,
  ToolbarItems,
  RowSelectEventArgs
} from '@syncfusion/ej2-angular-grids';
import * as jspdf from 'jspdf';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ExcelService } from '../services/excel.service';
import { OverlayPanel } from 'primeng/primeng';
import { Vendeur1 } from '../services/vendeur1';
import { float } from 'html2canvas/dist/types/css/property-descriptors/float';
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
  selector: 'app-rapport-vente-perte',
  templateUrl: './rapport-vente-perte.component.html',
  styleUrls: ['./rapport-vente-perte.component.scss'],
  providers: [ ExcelService]
})
export class RapportVentePerteComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('opp')
  public opp: OverlayPanel;
  msgerror: string;
  afficherbtn: boolean;
  readonly: boolean;
  public customAttributes: Object;
  tn: any;
  dat1 = new Date();
  dat2 = new Date();
  listRef = new Array();
  selectedRef;
  affichegrid: boolean;
  liste;
  codeArtcl: any;
  btnNouvelSaisie: boolean;
  ste: any;
  societe: any;
  wasInside: any;
  Nvperte: string;
  selectedFour: any;
  codeFour: string;
  listfour: any;
  listVend: any;
  selectedVendeur: any;
  codeVend: string;
  listfamilles: any;
  selectedfamille: any;
  codeFamille: string;
  listSfamilles: any;
  selectedSfamille: any;
  codeSFamille: string;
  listRepresentan: any[];
  codeRepresan: string;
  listReprsen: any;
  selectedRep: any;
  codeRep: string;
  date2: string;
  date1: string;
  calculValue: any;
  prixAchat;
  btnAffich: boolean;
  prixVente;
  marge;
  listes: any;
  listefs: any;
  listVends: any;
  listfamilless: any;
  listSfamilless: any;
  listReprsens: any;
  prixAchats: string;
  prixVentes: string;
constructor(
    private   config: NgSelectConfig,
    private   stockService: StockService,
    private   mouveService: MouveService,
    private   fournisseurService: FournisseurService,
    private   familleService: FamilleService,
    private   sfamilleService: SfamilleService,
    private   vendeur1Service: Vendeur1Service,
    private   steService: SteService,
    private   represanService: RepresanService,
    private   excelService: ExcelService ) {
     this.config.notFoundText = 'Aucun élément trouvé';
     this.config.clearAllText = 'Supprimer tous ';
     this.dat1.setDate(1);
     this.dat1.setMonth(0);
     }
async ChargerRepresentant() {
      if (this.listReprsen.length === 0 || this.listReprsen === undefined) {
        this.listReprsens = [];
          await this.represanService.getRepresansListOrderByDeno()
          .toPromise()
          .then(data => {
            console.log(data);
            this.listReprsen = data['_embedded'].represans;
            this.listReprsens = data['_embedded'].represans;
          });
        } else {
          this.listReprsen =  this.listReprsens;
        }

    }
async ChargerSFamilles() {


  if (this.listSfamilles.length === 0 || this.listSfamilles === undefined) {
    this.listSfamilles = [];
      await this.sfamilleService.getSousFamillesByOrderByNom()
      .toPromise()
      .then(data => {
        console.log(data);

         this.listSfamilles = data['_embedded'].sfamilles;
         this.listSfamilless = data['_embedded'].sfamilles;
      });
    } else {
      this.listSfamilles =  this.listSfamilless;
    }

}
async ChargerFamilles() {

  if (this.listfamilles.length === 0 || this.listfamilles === undefined) {
    this.listfamilless = [];
    await this.familleService
      .getFamillesByOrderByNom()
      .toPromise()
      .then(data => {
        console.log(data);

        this.listfamilles = data['_embedded'].familles;
        this.listfamilless = data['_embedded'].familles;
      });
    } else {
      this.listfamilles =  this.listfamilless;
    }

}
async ChargerVendeurs() {

  if (this.listVend.length === 0) {
    this.listVends = [];
          await this.vendeur1Service
          .getVendeur1ByDeno()
          .toPromise()
          .then(data => {
            console.log(data);

            this.listVend = data['_embedded'].vendeur1;
            this.listVends = data['_embedded'].vendeur1;
          });
  } else {
    this.listVends =  this.listVend;
  }

}

async ChargerFournisseurs() {
    if (this.listfour.length === 0 ) {
      this.listefs = [];
      await this.fournisseurService
      .getFournisseurListByOrderByDeno()
      .toPromise()
      .then(data => {
        console.log(data);

        this.listfour = data['_embedded'].fournisseurs;
        this.listefs = data['_embedded'].fournisseurs;

      });
    } else {
      this.listfour = this.listefs ;
    }
}



public onSearchItem(word: string, item: any): boolean {
    return item.code.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}


async ChargerArticles() {
if (this.listRef.length === 0) {
  this.listes = [];
                      await this.stockService
                      .getStockList('')
                      .toPromise()
                      .then(data => {
                        this.listRef = data['_embedded'].stocks;
                        this.listes = data['_embedded'].stocks;
                      });
                    } else {
                      this.listRef =   this.listes;
                    }
      }

async onSearchFournisseurs(word: string) {

        await this.fournisseurService.getFourListByDeno(word)
        .toPromise()
        .then(data => {
          this.listfour = data['_embedded'].fournisseurs;
        });
}

public onSearchFournisseur(word: string, item: Fournisseur): boolean {
  return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}

public onSearchFamille(word: string, item: Famille): boolean {
  return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}
public onSearchSFamille(word: string, item: Sfamille): boolean {
  return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}

public onSearchVendeur(word: string, item: Vendeur1): boolean {
  return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}

public onSearchRepres(word: string, item: Represan): boolean {
  return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}

async onSearchArticles(word: string) {

              await this.stockService.getStockList(word)
                    .toPromise()
                    .then(data => {
                          this.listRef = data['_embedded'].stocks;
                    });
                  }

changeFournisseur() {
                  if (this.selectedFour === null || this.selectedFour === undefined) {
                    this.codeFour = '';
                    console.log('code four', this.codeFour + '...');

                     } else {
                      this.codeFour = this.selectedFour.code;
                      console.log('code four', this.codeFour + '...');
                  }
          }


changeRepresen() {

            if (this.selectedRep === null || this.selectedRep === undefined) {
              this.codeRep = '';
              console.log('code rep', this.codeRep + '...');

               } else {
                this.codeRep = this.selectedRep.code;
                console.log('code rep', this.codeRep);
            }
    }

changearticle() {

            if (this.selectedRef === null || this.selectedRef === undefined) {
              this.codeArtcl = '';
              console.log('code artcl', this.codeArtcl + '...');

               } else {
                this.codeArtcl = this.selectedRef.code;
                console.log('code artcl', this.codeArtcl);
            }
    }


changeVendeur() {
      console.log('selected vend', this.selectedVendeur );

      if (this.selectedVendeur === null || this.selectedVendeur === undefined) {
        this.codeVend = '';
        console.log('code vend', this.codeVend + '...');

         } else {
          this.codeVend = this.selectedVendeur.code;
          console.log('code vend', this.codeVend);
      }
}

changeFamilles() {

  if (this.selectedfamille === null || this.selectedfamille === undefined) {
    this.codeFamille = '';
    console.log('code famille', this.codeFamille  + '...');

     } else {
      this.codeFamille  = this.selectedfamille.code;
      console.log('code famille', this.codeFamille );
  }
  }
changeSFamilles() {

    if (this.selectedSfamille === null || this.selectedSfamille === undefined) {
      this.codeSFamille = '';
      console.log('code sous famille', this.codeSFamille  + '...');

       } else {
        this.codeSFamille  = this.selectedSfamille.code;
        console.log('code sous famille', this.codeSFamille );
    }
    }


async visualiser() {
      this.readonly = true;
      // creer le document pdf

        const doc1 = new jspdf();
        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
        await this.steService.getSte()
                  .toPromise()
                  .then(data => {
                      this.ste = data['_embedded'].ste;
                      this.societe = this.ste[0];

                         });
        doc1.text('SOCIETE...: ' + this.societe.societe , 10, 20);
        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
        doc1.setTextColor(48, 48, 48);
        const date = new Date();
        doc1.text('Tunis, le ' + date.toLocaleDateString('en-GB') , 160, 25);


        doc1.setFontSize(20);
        doc1.setFontStyle('bold');
        doc1.setTextColor(0, 51, 153);
        doc1.setFontStyle('Arial');
        doc1.text('Etat des Ventes à Perte' , 70, 33);

        // les critères de recherche
        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
        doc1.setTextColor(48, 48, 48);

        doc1.text('Journées du : ' + this.dat1.toLocaleDateString('en-GB') , 10, 43);
        doc1.text('au : ' + this.dat2.toLocaleDateString('en-GB') , 60, 43);

        doc1.text('Fournisseur :' + this.codeFour , 10, 50);  doc1.text('Famille :' + this.codeFamille , 70, 50);
        doc1.text('Article :' + this.codeArtcl , 10, 55); doc1.text('Sous famille:' + this.codeSFamille , 70, 55);
        doc1.text('Representant :' + this.codeRepresan , 10, 60);  doc1.text('Vendeur:' + this.codeVend , 70, 60);




               // entete du  tableau
               doc1.setFontSize(72);
               doc1.setFontStyle('bold');
               doc1.setLineWidth(0.5);
               doc1.line(9, 65, 206, 65);

               doc1.setFontStyle('bold');

               doc1.setFontSize(11);
               doc1.setFontStyle('Arial');
               doc1.setTextColor(48, 48, 48);

               doc1.text('Référence'  , 10, 70);
               doc1.text('Qte'  , 40, 70);
               doc1.text('Pièce'  , 50, 70) ;
               doc1.text('Pr Revient'  , 74, 70);
               doc1.text('Pr Vente'  , 94, 70);
               doc1.text('Rem'  , 114, 70);
               doc1.text('PV Rem'  , 128, 70);
               doc1.text('Mrg'  , 146, 70);
               doc1.text('Vendeur'  , 157, 70);
               doc1.text('Fournisseur'  , 180, 70);

               doc1.setFontSize(72);
               doc1.setFontStyle('bold');
               doc1.setLineWidth(0.5);
               doc1.line(9, 75, 206, 75);
               doc1.setFontSize(13);
               doc1.setFontStyle('bold');

               let y = 80;
               let numPage = 1;
               doc1.setFontSize(9);
               doc1.setFontStyle('Arial');
               for (const bs of this.liste) {
                doc1.setFontSize(9);
                doc1.setFontStyle('Arial');
                doc1.text(bs.code  , 11, y);
                doc1.text(bs.quantite  , 47, y, 'right') ;
                doc1.text(bs.combine  , 51, y);
                doc1.text(bs.achat  , 92, y, 'right');
                doc1.text(bs.prix  , 110, y, 'right');
                doc1.text(bs.tRemise  , 124, y, 'right');

                doc1.text(bs.pvr.toString()  , 142, y, 'right');
                doc1.text(bs.mrg.toString()  , 155, y, 'right');

                doc1.text(bs.vendDeno.substring(0, 10)  , 157, y);
                doc1.text(bs.fourDeno.substring(0, 13)  , 181, y);
                y = y + 7;

                 // passer a une nouvelle page
                 if (y > 277) {
                  doc1.line(10, y - 3, 200, y - 3, 'FD');
                  doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                  numPage++;
                  doc1.addPage();
                  // entete tableau
                  doc1.setFontStyle('bold');
                  doc1.setLineWidth(0.5);
                  doc1.line(9, 10, 205, 10);

                  doc1.setFontSize(10);



               doc1.setFontSize(11);
               doc1.setFontStyle('Arial');
               doc1.setTextColor(48, 48, 48);


               doc1.text('Référence'  , 10, 17);
               doc1.text('Qte'  , 40, 17);
               doc1.text('Pièce'  , 50, 17) ;
               doc1.text('Pr Revient'  , 74, 17);
               doc1.text('Pr Vente'  , 94, 17);
               doc1.text('Rem'  , 114, 17);
               doc1.text('PV Rem'  , 128, 17);
               doc1.text('Mrg'  , 146, 17);
               doc1.text('Vendeur'  , 157, 17);
               doc1.text('Fournisseur'  , 180, 17);


                  // creer la ligne
               doc1.setLineWidth(0.5);
               doc1.setFontStyle('bold');
               doc1.line(9, 20, 205, 20);
                  y = 25;
                }

               }

               doc1.line(10, 280, 205, 280, 'FD');
               doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
               window.open(doc1.output('bloburl'), '_blank');



    }

genererExcel(): void {
      this.readonly = true;
      try {
         if ( this.liste === undefined ) {

         } else {

           const exportExcel = this.liste.map(
            obj => {
                return {
                    'Référence' : obj.code,
                    'Qte': obj.quantite,
                    'Pièce': obj.combine,
                    'Pr Revient': obj.achat,
                    'Pr Vente': obj.prix,
                    'Rem': obj.tRemise,
                    'PV Remisé': obj.pvr,
                    'Marge': obj.mrg,
                    'Vendeur': obj.vendDeno,
                    'Representant': obj.representDeno,
                    'Fournisseur': obj.fourDeno

                };
            }
        );
        const datee = new Date();
          this.excelService.exportAsExcelFile(exportExcel, 'vente_a_perte_' + datee.toLocaleDateString('en-GB'));
         }
        } catch {
          console.log(' methode genererExcel');

        }
      }

      @HostListener('document:click')
  clickout() {
        if (!this.wasInside) {
          if (this.opp !== null && this.opp !== undefined) {
            this.opp.hide();
          }

        }
        this.wasInside = false;
    }

async afficher(e) {
  this.wasInside = true;
  this.opp.hide();
  const nvperte = this.Nvperte;

      this.wasInside = true;

      if (this.dat1 === null) {

      } else {
       this.date1 = this.dat1.toLocaleDateString('en-GB');
       // this.date1 = '01/01/2020';
        if (this.dat2 === null) {
      } else {
         this.date2 = this.dat2.toLocaleDateString('en-GB');
        console.log('Niveau de perte', nvperte);
        console.log('date1 ', this.date1);
        console.log('date2 ', this.date2);
        console.log('code four ', this.codeFour );
        console.log('code Famille ', this.codeFamille );
        console.log('code sous Famille ', this.codeSFamille );
        console.log('code Artcl ', this.codeArtcl );
        console.log('code vend ', this.codeVend );
        console.log('code rep ', this.codeRep );


  await this.mouveService.rapportAPerte(this.date1, this.date2, this.Nvperte, this.codeFour,
                                        this.codeFamille, this.codeSFamille, this.codeArtcl, this.codeVend, this.codeRep )
        .toPromise()
        .then(data => {
          this.liste = data['_embedded'].venteAPertes;
          console.log('rapport perte ', data);

        });
      }
         this.prixAchat = 0;
         this.prixVente = 0;
         this.marge = 0;
      for (const vent of this.liste) {
        vent.achat = Number(vent.achat);
        vent.mrg = Number(vent.mrg);
        vent.prix = Number(vent.prix);
        vent.pvr = Number(vent.pvr);
        vent.tRemise = Number(vent.tRemise);
        vent.quantite = Number(vent.quantite);
        this.prixAchat = this.prixAchat + (vent.achat * vent.quantite) ;
        this.prixVente = this.prixVente + (vent.pvr * vent.quantite) ;


      }
      this.marge = ( (  this.prixVente - this.prixAchat  ) * 100 / this.prixAchat ) ;

      // this.prixAchats = this.prixAchat.toFixed(3) ;
    //   this.prixVentes = this.prixVente.toFixed(3) ;
    //  const mrg = Number(this.marge).toFixed(3);
    const mrg = Number(this.marge);
      this.marge = Number(mrg).toFixed(2);
      this.prixAchats = this.prixAchat.toFixed(3);
      this.prixVentes = this.prixVente.toFixed(3);
      if (this.liste.length > 0) {
        this.btnAffich = false;
        this.affichegrid = true;
        this.btnNouvelSaisie = true;
        this.readonly = true;
      } else {

                   this.msgerror = 'aucune vente avec ces critères !';
                   this.opp.show(e, document.getElementById('btnaf'));



      }

}


}


ngOnInit() {
  this.btnAffich = true;

  this.listfour = new Array();
  this.listRef = new Array();
  this.listSfamilles = new Array();
  this.listfamilles = new Array();
  this.listReprsen = new Array();
  this.listVend = new Array();
  this.listRepresentan = new Array();
  this.Nvperte = '1';

  this.selectedRef = null;
  this.codeArtcl = '';
  this.codeVend = '';
  this.codeSFamille = '';
  this.codeFamille = '';
  this.codeFour = '';
  this.codeRep = '';
  this.codeRepresan = '';
  this.btnNouvelSaisie = false;
  this.listRef = new Array();
  this.affichegrid = false;
  this.customAttributes = { class: 'customcss' };
  this.tn = {
    firstDayOfWeek: 1,
    dayNames: [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi'
    ],
    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ],
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
      'Decembre'
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
      'Dec'
    ],
    today: 'Ajourd\'hui',
    clear: 'Annuler',
    dateFormat: 'dd/mm/yyyy'
  };
}

nouvelleSaisie() {
  this.btnAffich = true;
  this.readonly = false;
  this.affichegrid = false;
  this.btnNouvelSaisie = false;
}

initialiser() {
  this.selectedFour = null;
  this.dat1 = new Date(new Date().getFullYear(), 0, 1);
  this.dat2 = new Date();
  this.selectedRef = null;
  this.selectedRep = null;
  this.selectedSfamille = null;
  this.selectedVendeur = null;
  this.selectedfamille = null;
  this.Nvperte = '1';
  this.codeArtcl = '';
  this.codeVend = '';
  this.codeSFamille = '';
  this.codeFamille = '';
  this.codeFour = '';
  this.codeRep = '';
  this.codeRepresan = '';

}



}
