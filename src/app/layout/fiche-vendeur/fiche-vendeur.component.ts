import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { GridComponent, ResizeService } from '@syncfusion/ej2-angular-grids';
import { Vendeur1Service } from '../services/vendeur1.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {MouveService} from '../services/mouve.service';
import {ViewMouveTableService} from '../services/view-mouve-table.service';
import {AchService } from '../services/ach.service';
import { ExcelService } from '../services/excel.service';
import { OverlayPanel } from 'primeng/primeng';
import { setCurrencyCode} from '@syncfusion/ej2-base';
setCurrencyCode('');
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
  selector: 'app-fiche-vendeur',
  templateUrl: './fiche-vendeur.component.html',
  styleUrls: ['./fiche-vendeur.component.scss'],
  providers: [ ExcelService, ResizeService]

})
export class FicheVendeurComponent implements OnInit {
  @ViewChild('gridVend')
  public grid: GridComponent;

  @ViewChild('grid2')
  public grid2: GridComponent;
  tn;
  @ViewChild('opp')
  public opp: OverlayPanel;
  msgerror;
  datedebut = new Date();
  minDate = new Date(new Date().getFullYear(), 0, 1);
  maxDate = new Date();
  datefin = new Date();
  afficherbtn: boolean;
  affichGrid: boolean;
  btnNvPeriod: boolean;
  vendeurs = new Array();
  selectedValue;
  public customAttributes: Object;
  trie: string;
  sommecas = 0;
  sommecaAs = 0;
  sommecaCs = 0;
  sommecaFour1s = 0;
  sommecaFour2s = 0;
  sommecaMs = 0;
  sommecaRs = 0;
  sommepourcs = 0;
  selectedVendeur: any;
  listeCAVendeur: any;
  affichGrid2: boolean;
  disab: boolean;
  disabledDate: boolean;
  wasInside: boolean;
  ach: any;
  nfour2: any;
  nfour1: any;
  four1: any;
  four2: any;
  readOnly: boolean;
  initialSort: { columns: { field: string; direction: string; }[]; };
  sommesTab: any[];


  constructor(private vendeur1Service: Vendeur1Service,
               private mouveService: MouveService,
               private viewMouveTableService: ViewMouveTableService,
               private achService: AchService,
               private excelService: ExcelService) {
    this.datedebut.setDate(1);
    this.datedebut.setMonth(0);
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.opp.hide();
    }
    this.wasInside = false;

  }

  rowSelected() {

    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedVendeur = selected;
      // this.affichGrid2 = true;
      this.disab = true;
    } else {
      this.disab = false;
    }
  }
  annulerSelection() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.affichGrid2 = false;
      this.listeCAVendeur = new Array();
      this.selectedVendeur = null;
      this.disab = false;
      this.opp.hide();
    }
  }
  Nouvperiode() {
    this.disabledDate = false;
     this.affichGrid = false;
    this.affichGrid2 = false;
    this.btnNvPeriod = false;
    this.afficherbtn = true;
   // this.minDate = new Date(new Date().getFullYear(), 0, 1);
  //  this.maxDate = new Date(new Date().getFullYear(), 11, 31);

  }
  genererExcel(): void {

    try {
       if ( this.vendeurs === undefined || this.vendeurs === null || this.vendeurs.length === 0 ) {

       } else {




  for (const vend of this.vendeurs) {
          if (vend.ca !== null) {
            vend.ca = Number(vend.ca).toFixed(3);


          }
          if (vend.caA !== null) {
            vend.caA = Number(vend.caA).toFixed(3);
          }

          if (vend.caC !== null) {
          vend.caC = Number(vend.caC).toFixed(3);
         // vend.caC = parseFloat(vend.caC);
          }

          if (vend.caFour1 !== null) {
           vend.caFour1 = Number(vend.caFour1).toFixed(3);
          }
          if (vend.caFour2 !== null) {
            vend.caFour2 = Number(vend.caFour2).toFixed(3);
          }
          if (vend.caM !== null) {
            vend.caM = Number(vend.caM).toFixed(3);

          }

          if (vend.caR !== null) {
          vend.caR = Number(vend.caR).toFixed(3);

          }

          if (vend.pourc !== null) {
            vend.pourc = Number(vend.pourc).toFixed(3);
        }

      }




         const exportExcel = this.vendeurs.map(
          obj => {
              return {
                  'Code vendeur' : obj.code,
                  'Nom ': obj.deno,
                  'Objectif/Mois': obj.caM,
                  'Objectif/Période': obj.caA,
                  'CA Realisé': obj.ca,
                  '%': obj.pourc,
                  'CA Rev': obj.caR,
                  'CA Cons': obj.caC,
                  'ca Four 1': obj.caFour1,
                  'Ca Four 2': obj.caFour2,

              };
          }
      );
      const datrap = new Date();
        this.excelService.exportAsExcelFile(exportExcel, 'Fiche_vendeur_' + datrap.toLocaleDateString('en-GB'));
       }
      } catch {
        console.log(' methode genererExcel');

      }
    }
    genererExcel2(): void {

      try {
         if ( this.listeCAVendeur === undefined || this.listeCAVendeur === null || this.listeCAVendeur.length === 0 ) {

         } else {

           const exportExcel = this.listeCAVendeur.map(
            obj => {
                return {
                    'Code ' : obj.code,
                    'Désignation ': obj.designation,
                    'Va': obj.va,
                    'Canr': obj.canr,
                    'Mtr': obj.mtr,
                    'Car': obj.car,
                    'Mrg': obj.mrg,


                };
            }
        );
        const datrap = new Date();
          this.excelService.exportAsExcelFile(exportExcel, 'Fiche_vendeur_' + datrap.toLocaleDateString('en-GB'));
         }
        } catch {
          console.log(' methode genererExcel');

        }
      }

 async afficher2(e) {
 // this.disab = false;

 this.wasInside =  true;
// this.disabledDate = true;
    const d1 = this.datedebut.toLocaleDateString('en-GB');
    const d2 = this.datefin.toLocaleDateString('en-GB');
    console.log('d1 ', d1);
    console.log('d2 ', d2);
    console.log('selected val ', this.selectedValue);

  //  console.log('selectedVendeur code ', this.selectedVendeur.code);

    if (this.selectedVendeur !== null && this.selectedVendeur !== undefined) {
      const codevend = this.selectedVendeur.code;
if (this.selectedValue !== null && this.selectedValue !== undefined) {


       switch (this.selectedValue) {
            case 'fournisseur': {

              await this.mouveService.getCaVendeurFour(d1, d2, codevend)
              .toPromise().then(data => {console.log('ca vend famille ', data);
                this.listeCAVendeur = data['_embedded'].caVendeurs;
              });
               break; }


            case 'zone': {

              await this.mouveService.getCaVendeurZone(d1, d2, codevend)
              .toPromise().then(data => {console.log('ca vend famille ', data);
                this.listeCAVendeur = data['_embedded'].caVendeurs;
              });
               break; }

            case 'article': {

              await this.mouveService.getCaVendeurMouve(d1, d2, codevend)
              .toPromise().then(data => {console.log('ca vend famille ', data);
                this.listeCAVendeur = data['_embedded'].caVendeurs;
              });
               break; }
            case 'secteur': {

              await this.mouveService.getCaVendeurSecteur(d1, d2, codevend)
              .toPromise().then(data => {console.log('ca vend famille ', data);
                this.listeCAVendeur = data['_embedded'].caVendeurs;
              });
               break; }
            case 'famille': {

              await this.mouveService.getCaVendeurFamille(d1, d2, codevend)
              .toPromise().then(data => {console.log('ca vend famille ', data);
                this.listeCAVendeur = data['_embedded'].caVendeurs;
              });
               break; }
            case 'representant': {

              await this.mouveService.getCaVendeurRepresan(d1, d2, codevend)
              .toPromise().then(data => {console.log('ca vend famille ', data);
                this.listeCAVendeur = data['_embedded'].caVendeurs;
              });
               break; }
            case 'client': {

              await this.mouveService.getCaVendeurClient(d1, d2, codevend)
              .toPromise().then(data => {console.log('ca vend famille ', data);
                this.listeCAVendeur = data['_embedded'].caVendeurs;
              });
               break; }
            case 'sousfamille':
              {

                await this.mouveService.getCaVendeurSfamille(d1, d2, codevend)
                .toPromise().then(data => {console.log('ca vend famille ', data);
                  this.listeCAVendeur = data['_embedded'].caVendeurs;
                });
                 break; }

       }
       if (this.listeCAVendeur.length > 0) {
        this.affichGrid2 = true;
       // this.btnNvPeriod = true;
        // this.readOnly = false;

        // this.selectedValue = null;
       } else {
         this.msgerror = 'aucune ligne trouvée !';
         this.opp.show(e, document.getElementById('affichbt2'));
        // this.btnNvPeriod = true;
       //  this.readOnly = false;

       }
      }

    }

  }

  changeTrieCode() {
    console.log('trie  ', this.trie   );

    if (this.trie === 'code') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }

   }

   changeTrieDeno() {
    console.log('trie  ', this.trie   );
    if (this.trie === 'deno') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.deno > b.deno ? 1 : a.deno < b.deno ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }
   }


   changeTrieCaM() {
    console.log('trie  ', this.trie   );
    if (this.trie === 'caM') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.caM > b.caM ? 1 : a.caM < b.caM ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }
   }

   changeTrieCaA() {
    console.log('trie  ', this.trie   );
    if (this.trie === 'caA') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.caA > b.caA ? 1 : a.caA < b.caA ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }
   }

   changeTrieCa() {
    console.log('trie  ', this.trie   );
    if (this.trie === 'ca') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.ca > b.ca ? 1 : a.ca < b.ca ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }
   }

   changeTriePourc() {
    console.log('trie  ', this.trie   );
    if (this.trie === 'pourc') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.pourc > b.pourc ? 1 : a.pourc < b.pourc ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }
   }

   changeTrieCaR() {
    console.log('trie  ', this.trie   );
    if (this.trie === 'caR') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.caR > b.caR ? 1 : a.caR < b.caR ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }
   }



  changeTrieCaC() {
    console.log('trie  ', this.trie   );
    if (this.trie === 'caC') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.caC > b.caC ? 1 : a.caC < b.caC ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }
   }

   changeTrieCaFour1() {
    console.log('trie  ', this.trie   );
    if (this.trie === 'caFour1') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.caFour1 > b.caFour1 ? 1 : a.caFour1 < b.caFour1 ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }
   }


   changeTrieCaFour2() {
    console.log('trie  ', this.trie   );
    if (this.trie === 'caFour2') {
      this.vendeurs = this.vendeurs.sort(function(a, b) {
        return a.caFour2 > b.caFour2 ? 1 : a.caFour2 < b.caFour2 ? -1 : 0;
      });
      if (this.grid !== undefined) {
        this.grid.refresh();
      }
    }
   }

   dayDiff(d1, d2) {

    d1 = d1.getTime() / 86400000;
    d2 = d2.getTime() / 86400000;
    const d3 = d2 - d1 + 1 ;
    return Number(d3).toFixed(0);
  }
  async updateFucheVendeur() {
  //  this.listeCAVendeur = new Array();
  // this.updateFait = false;
    await  this.viewMouveTableService.deleteAll()
    .toPromise()
    .then(data => {
      console.log('deleteeeeee', data);

    });
  await this.viewMouveTableService.AddAllViewMouves()
      .toPromise()
      .then(data => {
        console.log('inseeeeeeert ', data);

      });
  await this.achService.getAchList()
      .toPromise()
      .then(data => {

        this.ach = data['_embedded'].ach;
        console.log('achhhhhhhhh ', this.ach );
      });
if (this.ach !== undefined && this.ach !== null ) {
        this.nfour1 = this.ach[0].nFour1;
        this.nfour2 = this.ach[0].nFour2;
        if (this.nfour1 === null || this.nfour1 === 'null' || this.nfour1 === undefined ) {
          this.nfour1 = 'Ca_    ';
        } else {
          this.nfour1 = 'Ca_' + this.nfour1;
        }

        if (this.nfour2 === null || this.nfour2 === 'null' || this.nfour2 === undefined ) {
          this.nfour2 = 'Ca_    ';
        } else {
          this.nfour2 = 'Ca_' + this.nfour2;
        }


        this.four1 = this.ach[0].four1;
        this.four2 = this.ach[0].four2;
         const d1 = this.datedebut.toLocaleDateString('en-GB');
         const d2 = this.datefin.toLocaleDateString('en-GB');
       await this.vendeur1Service.updateFicheVendeur(d1, d2, this.four1, this.four2)
        .toPromise()
        .then(data => {
           console.log('dataaaa', data);

        });

      }


  }



  async afficher(e) {

    this.vendeurs = new Array();
    let liste  = new Array();
    await this.updateFucheVendeur().then(data => {
      console.log('updateeeeeee vendeuuur', data);

    });
    this.disab = true;
    this.opp.hide();
    this.wasInside = true;

    let sommeca = 0;
    let sommecaA = 0;
    let sommecaC = 0;
    let sommecaFour1  = 0;
    let sommecaFour2  = 0;
    let sommecaM  = 0;
    let sommecaR  = 0;
    this.sommesTab = new Array();


    await this.vendeur1Service
      .getFicheVendeur1()
      .toPromise()
      .then((data) => {
        console.log('fiche vendeur ', data);
        liste = data['_embedded'].ficheVendeurs;
        console.log('liste des venseurs ', liste  );
      });

        for (const vend of liste) {
         if (Number(vend.pourc) > 300 ) {
            vend.pourc = '';
          } else {
            if (Number(vend.pourc) !== 0) {
              vend.pourc = Number(vend.pourc);
            }

          }

          if (vend.ca !== null) {
            vend.ca = Number(vend.ca);
          // vend.ca = parseFloat(vend.ca);
            sommeca = Number(sommeca) + Number( vend.ca);
            console.log('somme ca ', sommeca);

          }
          if (vend.caA !== null) {

           // vend.caA = parseFloat(vend.caA);
            vend.caA = Number(vend.caA);

            sommecaA = Number(sommecaA ) +  Number(vend.caA);
          }

          if (vend.caC !== null) {
          vend.caC = Number(vend.caC);

            sommecaC = Number(sommecaC) + Number(vend.caC);
          }

         /* if (vend.caFour1 !== null) {
            sommecaFour1 = Number(sommecaFour1) + Number(vend.caFour1);
            vend.caFour1 = Number(vend.caFour1);
            console.log('caaaaaaa four 111   ', vend.caFour1 );

          }*/
          if (vend.caFour1 !== null) {
            sommecaFour1 = Number(sommecaFour1) + Number(vend.caFour1);
           vend.caFour1 = Number(vend.caFour1);
          }
          if (vend.caFour2 !== null) {
            sommecaFour2 = Number(sommecaFour2) + Number(vend.caFour2);
            vend.caFour2 = Number(vend.caFour2);
          }
          if (vend.caM !== null) {
            vend.caM = Number(vend.caM);

            sommecaM  = Number(sommecaM)  + Number(vend.caM);
          }

          if (vend.caR !== null) {
            sommecaR = Number(sommecaR) + Number(vend.caR);
          vend.caR = Number(vend.caR);

          }


        }

        this.vendeurs = liste;

        this.initialSort = { columns: [{ field: 'deno', direction: 'Ascending' }] };

        if (this.vendeurs.length === 0 ) {
            this.msgerror = 'aucun vendeur trouvé';
            this.opp.show(e, document.getElementById('btAfficher'));

        } else {


         this.readOnly = false;


       this.sommecas = Number(sommeca);
       const nbjrs = this.dayDiff(this.datedebut, this.datefin);
       const objParJour =  Number(sommecaM) / 30;
      // console.log('nombre des jours ', objParJour);
        this.sommecaAs = Number(objParJour * Number(nbjrs));
    // this.sommecaAs = Number( sommecaA).toFixed(3);
         this.sommecaCs = Number(sommecaC);
         this.sommecaFour1s = Number( sommecaFour1);
         this.sommecaFour2s = Number( sommecaFour2);
         this.sommecaMs = Number( sommecaM);
         this.sommecaRs = Number( sommecaR);
         this.sommepourcs = Number(Number(sommeca) /  Number( sommecaA) * 100);
         const toto = {
          deno : '',
          caM: this.sommecaMs,
          caA: this.sommecaAs,
          ca:  this.sommecaAs,
          pourc:  this.sommepourcs,
          caR: this.sommecaRs,
          caC: this.sommecaCs,
          caFour1: this.sommecaFour1s,
          caFour2: this.sommecaFour2s
        };
      this.sommesTab.push(toto);


        }

        if ( this.vendeurs.length > 0) {
          this.disabledDate = true;
          this.affichGrid = true;

          this.btnNvPeriod = true;
          this.afficherbtn = false;
    //   this.grid.refresh();
        } else {
          this.affichGrid = false;
        }
  }



 async ngOnInit() {
    this.affichGrid = false;
    this.btnNvPeriod = false;
    this.disab = true;
    this.listeCAVendeur = new Array();
    this.affichGrid2 = false;
    this.selectedValue = 'article';
    this.afficherbtn = true;
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




  }
}
