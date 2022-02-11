import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';


import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n} from '@syncfusion/ej2-base';
import { ExcelService } from '../services/excel.service';
import {DcomService } from '../services/dcom.service';

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
  selector: 'app-deficit-commande-frs',
  templateUrl: './deficit-commande-frs.component.html',
  styleUrls: ['./deficit-commande-frs.component.scss'],
  providers: [ExcelService]
})
export class DeficitCommandeFrsComponent implements OnInit {


  @ViewChild('grid')
  public grid: GridComponent;
  fournisseurs = new Array();
  SelectedFournisseur = null;
  msg = '';
  deficits = new Array();
  affichgrid: boolean;
  wasInside: boolean;
  public customAttributes: Object;
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  deficitCMDFour1 = new Array();
  deficitCMDFour2 = new Array();
  deficitCMDFour3 = new Array();
  deficitCMDFour4 = new Array();

  btnaffich: boolean;
  btnNvlSais: boolean;
  liste: any[];
  readonly: boolean;
  codefour: '';
  constructor( private fournisseurService: FournisseurService,
                private excelService: ExcelService,
                private  dcomService: DcomService,
                private config: NgSelectConfig) {
                  this.config.notFoundText = 'Aucun élément trouvé';
                  this.config.clearAllText = 'Supprimer tous';
                }
    // hostListener
    @HostListener('document:click')
    clickout() {
      if (!this.wasInside ) {
         this.ovo.hide();
      }
      this.wasInside = false;
    }
    changeFournisseur() {
      if ( this.SelectedFournisseur === null || this.SelectedFournisseur === undefined) {
        this.codefour = '';
      } else {
        this.codefour = this.SelectedFournisseur.id ;

      }
    }
    // methode rechercher les fournisseurs
    public onSearchFournisseur(word: string, item: Fournisseur): boolean {
      return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
    }
    NouvelleSaisie(e) {
      this.btnNvlSais = false;
      this.btnaffich = true;
      this.affichgrid = false;
      this.readonly = false;
      this.SelectedFournisseur = null;

    }
  async Afficher(e) {
    this.wasInside = true;
    this.deficitCMDFour1 = new Array();
     // [ '🐑', '🐑', '🐺',' 🕌'   ]
     if ( this.SelectedFournisseur === null || this.SelectedFournisseur === undefined) {
      this.codefour = '';
     } else {
       this.codefour =  this.SelectedFournisseur.code;
     }
     try {
      await this.dcomService.DeficitCMDFour(this.codefour)
      .toPromise().then(data => {
        console.log('deficitcmd four 1 ', data);
        this.deficitCMDFour1 = data;
      });
      this.deficits = new Array();
      for (const tab of this.deficitCMDFour1) {
        const obj = {
          type: '',
          code: '',
          commande: '',
          date: '',
          operateur: '',
          deno : '',
          debit: '',
          credit: ''
        };
          console.log('taaaaaab ', tab );
          obj.type = tab [0];
          obj.code = tab [1];
          obj.commande = tab [2];
          obj.date = tab [3];
          obj.operateur = tab [4];
          obj.deno = tab [5];
          obj.debit = tab [6];
          obj.credit = tab [7];
          console.log('objjjjjjj ', obj );
          this.deficits.push(obj)  ;
              }

       if (this.deficits.length === 0) {
         this.affichgrid = false;
           this.msg = 'aucune ligne trouvée ! ';
           this.ovo.show(e, document.getElementById('btnaffich'));
       } else {
           //  if (this.deficits.length <= 500) {

              this.affichgrid = true;
              this.readonly = true;
              this.btnNvlSais = true;
              this.btnaffich = false;
         /*   } else {
           this.affichgrid = false;
           this.msg = 'Veuillez choisir un fournisseur ! ';
          this.ovo.show(e, document.getElementById('btnaffich'));
          }*/

      }
    } catch (msg) {
        console.log('erreur afficher ', msg);

    }

        console.log('liste deficits ', this.deficits);
           //  this.grid.refresh();
      /*
      await this.dcomService.DeficitCMDFour2(this.codefour)
      .toPromise().then(data => {
        console.log('deficitcmd four 2 ', data['_embedded'].deficitCommandeFrses);
        this.deficitCMDFour2 = data['_embedded'].deficitCommandeFrses;
      });

      await this.dcomService.DeficitCMDFour3(this.codefour)
      .toPromise().then(data => {
        console.log('deficitcmd four 3 ', data['_embedded'].deficitCommandeFrses);
        this.deficitCMDFour3 = data['_embedded'].deficitCommandeFrses;
      });
      await this.dcomService.DeficitCMDFour4(this.codefour)
      .toPromise().then(data => {
        console.log('deficitcmd four 4 ', data['_embedded'].deficitCommandeFrses);
        this.deficitCMDFour4 = data['_embedded'].deficitCommandeFrses;
      });*/


      //  this.liste = this.deficitCMDFour1;
       /* this.liste  =  this.liste.concat(this.deficitCMDFour3);
        this.liste  =  this.liste.concat(this.deficitCMDFour4);*/


      /* for (const obj of this.liste) {
         if (obj.credit === '') {
             obj.credit = '0.0';
         }
         if (obj.debit === '') {
            obj.debit = '0.0';
        }

       }*/

    //   console.log('listeeee', this.liste );
      // this.liste.
   /*  this.deficits = this.liste.sort(function(a, b) {
        return  ( a.code > b.code ? 1 : a.code < b.code ? -1 : 0)  ;
       });*/
// 😇😇😇😇😇😇 supprimer les lignes répétées 😇😇😇😇😇😇😇😇😇
   /*    let i = 1;
       this.liste.forEach(element => {
         if (this.liste[i] === element) {
          const el = this.liste.splice(i - 1, 1);
          console.log('deleted element ', el);

         }
         if (i < this.liste.length - 2 ) {
          i++;
         }

       });*/

       // this.deficits = this.liste;
     //  this.deficits = this.liste ;
    }


   async genererExcel(e) {
      if ( this.SelectedFournisseur === null || this.SelectedFournisseur === undefined) {
       this.codefour = '';
      } else {
        this.codefour =  this.SelectedFournisseur.code;
      }
       // [ '🐑', '🐑', '🐺',' 🕌'   ]
        await this.dcomService.DeficitCMDFour(this.codefour)
        .toPromise().then(data => {

          console.log('deficitcmd four 1 ', data);
          this.deficitCMDFour1 = data;
        });
        this.deficits = new Array();
        for (const tab of this.deficitCMDFour1) {
          const obj = {
            type: '',
            code: '',
            commande: '',
            date: '',
            operateur: '',
            deno : '',
            debit: '',
            credit: ''
          };
             console.log('taaaaaab ', tab );
             obj.type = tab [0];
             obj.code = tab [1];
             obj.commande = tab [2];
             obj.date = tab [3];
             obj.operateur = tab [4];
             obj.deno = tab [5];
             obj.debit = tab [6];
             obj.credit = tab [7];
             console.log('objjjjjjj ', obj );
             this.deficits.push(obj)  ;
                }


      try {
        if (this.deficits.length === 0) {
          this.affichgrid = false;
            this.msg = 'aucune ligne trouvée ! ';
            this.ovo.show(e, document.getElementById('btnaffich'));

         } else {

           const exportExcel = this.deficits.map(
            obj => {
                return {
                    'Code' : obj.code,
                    'Commande': obj.commande,
                    'Date': obj.date,
                    'Opérateur': obj.operateur,
                    'Dénomination': obj.deno,
                    'Débit': obj.debit,
                    'Crédit': obj.credit

                };
            }
        );
          const daterap = new Date().toLocaleDateString('en-GB');
          this.excelService.exportAsExcelFile(exportExcel, 'deficit commande fournisseur ' + daterap);
         }
        } catch {
          console.log(' methode genererExcel');

        }

    }





  async ngOnInit() {
    this.btnaffich = true;
    this.readonly = false;
    this.btnNvlSais = false;
    this.SelectedFournisseur = null;
    this.codefour = '';
       // style de ejs grid
       this.customAttributes = { class: 'customcss' };
       // initailisation

        /// charger les fournisseurs
        await  this.fournisseurService
    .getFournisseurListByOrderByDeno()
    .toPromise()
    .then(data => {
      this.fournisseurs = data['_embedded'].fournisseurs;
    });



    await this.dcomService.updateDeficitCMDFour()
    .toPromise().then(data => {
      console.log(' update deficitcmd four 1 ', data);

    });

      }


}
