import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { OverlayPanel } from 'primeng/primeng';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {MessageService} from 'primeng/components/common/messageservice';
import {Vendeur1Service} from '../services/vendeur1.service';
import {Vendeur1} from '../services/vendeur1';
import {RecettesService} from '../services/recettes.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { NgSelectComponent } from '@ng-select/ng-select';
import { globals } from 'src/environments/environment';

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
  selector: 'app-vente-analyse-ca',
  templateUrl: './vente-analyse-ca.component.html',
  styleUrls: ['./vente-analyse-ca.component.scss'],
  providers: [MessageService]
})
export class VenteAnalyseCaComponent implements OnInit {
  @ViewChild('ngs') ngs: NgSelectComponent;
  @ViewChild('op')
  public op: OverlayPanel;
  public customAttributes: Object;
  ttf;
  AvoirBLH;
  TotCACptt;
  BLH;
  dat1 = new Date();
  dat2 = new Date();
  tn;
  motpass;
  listeVendeurs: Vendeur1[];
  selectedVendeur;
  AnalVend;
  truepass: boolean;
  editEnablel: boolean;
  ttfact = 0;
  AvoirHT = 0;
  BLHT = 0;
  AvoirBLHT = 0;
  TotCATerme = 0;
  Tventes = 0;
  Tavoirs = 0;
  TCA = 0;
  TotCACpt = 0;

  var_tot_cpt = 0;
  var_tot_terme = 0;
  var_tot_ventes = 0;
  var_tot_avoirs = 0;
  var_tot_cptt = 0;
  AvoirH ;
  tc ;
  tav ;
  tve;
  tota;
  wasInside: boolean;
  readonly = true;
  msgerror: string;

  btnnvs: boolean;
  readonlyv: boolean;
  btnaffich: boolean;
  selectedVendeurMotpass: any;
  constructor( private vendeurService: Vendeur1Service,
               private messageService: MessageService,
               private recettesService: RecettesService,
               private config: NgSelectConfig

               ) {
                 this.config.notFoundText = 'Aucun élément trouvé';
                 this.config.clearAllText = 'Supprimer tous ';
               }
setFocus = () => {
   this.ngs.focus();
          }

  ngOnInit() {
          this.btnaffich = true;
          this.setFocus();
          this.readonlyv = false;
           this.btnnvs = false;
          this.truepass = false;
          this.editEnablel = false;
          this.ChargerVendeurs();
          this.customAttributes = { class: 'customcss' };

          console.log('societe', globals.societe);
           // const st = 'CHAMAM DIVISION GROS';
            // globals.societe
          if (globals.societe === 'CHAMAM DIVISION GROS') {
            this.validerDate();
          } else {
            const anne_courante = new Date();
            this.dat1.setDate(1);
            this.dat1.setMonth(0);
            this.dat1.setFullYear(anne_courante.getFullYear());
            this.dat2 = new Date();
            this.readonly = false;
          }



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
onSearchVendeur(word: string, item: Vendeur1): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async ChargerVendeurs () {
            await this.vendeurService.getVendeur1ByDeno()
            .toPromise()
            .then(data => {
              this.listeVendeurs = data['_embedded'].vendeur1;
            });
}
fermerlisteVendeurs() {
  this.listeVendeurs = new Array();
}

validerDate() {
  this.readonly = true;
   let year ;  let mon ;
   const datesys: Date = new Date();
  // datesys.setMonth(0);

   year = datesys.getFullYear();
   mon = datesys.getMonth();

    const jour1 = 26;
    const jour2 = 25;
  if (mon === 0) {
        year = year - 1;
        this.dat1 .setDate(jour1);
        this.dat1 .setMonth(12);
        this.dat1 .setFullYear(year);

        this.dat2 .setDate(jour2);
        this.dat2 .setMonth(mon);
        this.dat2 .setFullYear(year + 1);


   } else {
          const m = datesys.getMonth() - 1;
          this.dat1.setDate(jour1);
          this.dat1.setMonth(m);
          this.dat1.setFullYear(year);

          this.dat2.setDate(jour2);
          this.dat2.setMonth(mon);
          this.dat2.setFullYear(year);

          }

         }


@HostListener('document:click')
      clickout() {
        if (!this.wasInside) {
          this.messageService.clear();
          if (this.op !== null && this.op !== undefined) {
          this.op.hide();
        }
        }
        this.wasInside = false;
}
changeVendeurs() {
  console.log('venseeeeeeeeeeur ', this.selectedVendeur );

  if (this.selectedVendeur === null || this.selectedVendeur === undefined) {
    this.selectedVendeurMotpass = null;
  } else {
    this.selectedVendeurMotpass = this.selectedVendeur.pass;
  }
}

async afficher(e) {
  this.messageService.clear();
  this.wasInside = true;


     // try {

          console.log(this.selectedVendeur);
          if (this.selectedVendeur === null || this.selectedVendeur === undefined) {
            this.setFocus();
            this.msgerror = 'Veuillez choisir un vendeur !';
            this.op.show(e, document.getElementById('sv'));

              } else {


                if (this.motpass === null || this.motpass === undefined ) {
                  document.getElementById('pwd').focus();
                  this.msgerror = 'Veuillez saisir votre mot de passe !';
                  this.op.show(e, document.getElementById('pwd'));
                } else {



                    if (this.selectedVendeurMotpass  === this.motpass) {

                      this.AnalVend = new Array();
                    // remplir grid

                      await  this.recettesService.getRecAnalyseCAVend(this.selectedVendeur.code , this.dat1.toLocaleDateString('en-GB'), this.dat2.toLocaleDateString('en-GB'))
                             .toPromise()
                             .then(data => {
                               this.AnalVend = data['_embedded'].analyseCAVendeurs;
                               console.log('liste ', this.AnalVend);

                             });
                            if (this.AnalVend.length === 0) {
                              this.msgerror = 'Aucun mouvement pour ce vendeur !';
                              this.op.show(e, document.getElementById('sv'));
                              this.readonlyv = false;
                              this.readonly = false;
                              this.btnnvs = false;
                              this.btnaffich = true;
                            } else {

                              this.btnnvs = true;
                              this.readonlyv = true;
                              this.readonly = true;
                              this.btnaffich = false;

                             for (const rec of this.AnalVend) {
                              rec.net = Number(rec.net).toFixed(3);
                              rec.remise = Number(rec.remise).toFixed(3);
                              rec.ht = Number(rec.ht).toFixed(3);
                            }


                    // TT facture


                    await  this.recettesService.SommeFactVendeur(this.selectedVendeur.code , this.dat1.toLocaleDateString('en-GB'), this.dat2.toLocaleDateString('en-GB'))
                    .toPromise()
                    .then(data => {
                      this.ttfact =  data;
                      console.log('total facture DATA ', data );
                      console.log('total facture ', this.ttfact );

                      this.var_tot_cpt =  (Math.round(this.var_tot_cpt * 1000) / 1000)  + (Math.round(this.ttfact * 1000) / 1000);
                      this.var_tot_ventes = (Math.round(this.var_tot_ventes * 1000) / 1000)  + (Math.round(this.ttfact * 1000) / 1000);


                    });

                    // TT avoir i p 3

                    await  this.recettesService.SommeAVOIRpi3Vendeur(this.selectedVendeur.code , this.dat1.toLocaleDateString('en-GB'), this.dat2.toLocaleDateString('en-GB'))
                    .toPromise()
                    .then(data => {
                      this.AvoirHT =  data;
                      this.var_tot_cpt =  (Math.round( this.var_tot_cpt  * 1000) / 1000)  - (Math.round(this.AvoirHT  * 1000) / 1000);
                      this.var_tot_avoirs =  (Math.round(this.var_tot_avoirs * 1000) / 1000)  + (Math.round(this.AvoirHT  * 1000) / 1000) ;
                      this.TotCACpt =  this.var_tot_cpt;
                    });

                    // TT  b/l


                        await  this.recettesService.SommeBLVendeur(this.selectedVendeur.code , this.dat1.toLocaleDateString('en-GB'), this.dat2.toLocaleDateString('en-GB'))
                        .toPromise()
                        .then(data => {
                          this.BLHT =  data;

                          this.var_tot_terme =  (Math.round(this.var_tot_terme * 1000) / 1000)  + (Math.round(this.BLHT * 1000) / 1000);
                          this.var_tot_ventes = (Math.round(this.var_tot_ventes * 1000) / 1000)  + (Math.round(this.BLHT * 1000) / 1000);

                        });

                      // TT avoirB/L


                        await  this.recettesService.SommeAVOIRVendeur(this.selectedVendeur.code , this.dat1.toLocaleDateString('en-GB'), this.dat2.toLocaleDateString('en-GB'))
                        .toPromise()
                        .then(data => {
                          this.AvoirBLHT =  data;
                          this.var_tot_terme = (Math.round(this.var_tot_terme * 1000) / 1000) - (Math.round(this.AvoirBLHT  * 1000) / 1000);
                          this.var_tot_avoirs = (Math.round(this.var_tot_avoirs * 1000) / 1000)  + (Math.round(this.AvoirBLHT  * 1000) / 1000);

                        });


                        this.TotCATerme =  this.var_tot_terme;
                        this.Tventes =  this.var_tot_ventes;
                        this.Tavoirs = this.var_tot_avoirs;
                        this.TCA = this.var_tot_ventes - this.var_tot_avoirs ;
                        this. tc = this.TCA;

                        this.ttf = Number(this.ttfact).toFixed(3);
                        this.TotCACptt =  (Math.round( this.TotCACpt * 1000) / 1000).toFixed(3);
                        this.BLH = (Math.round(this.BLHT * 1000) / 1000).toFixed(3);
                        this. AvoirH = (Math.round(this.AvoirHT * 1000) / 1000).toFixed(3);

                        this. tav = (Math.round(this.Tavoirs * 1000) / 1000).toFixed(3);
                        this. tve = (Math.round(this.Tventes * 1000) / 1000).toFixed(3);
                        this. tota = (Math.round(this.TotCATerme * 1000) / 1000).toFixed(3);
                        this.  tc = (Math.round(this.TCA * 1000) / 1000).toFixed(3);
                        this.AvoirBLH = (Math.round( this.AvoirBLHT * 1000) / 1000).toFixed(3);

                        this.truepass = true;
                        this.motpass = '';
                      }}  else {
                        document.getElementById('pwd').focus();
                      this.msgerror = 'mot de passe est incorrect !';
                      this.op.show(e, document.getElementById('pwd'));

                    }}
                }
/*
      } catch {
        console.log('methode afficher');
      }*/
}


NouvelleSaisie() {
        this.btnaffich = true;
        this.messageService.clear();
        this.wasInside = true;
         this.truepass = false;
         this.motpass = '';
         this.selectedVendeur = null;
         this.readonlyv = false;
         this.btnnvs = false;
          this.ttf = 0;
         this.ttfact = 0;
         this.AvoirHT = 0;
         this.BLHT = 0;
         this.AvoirBLHT = 0;
         this.TotCATerme = 0;
         this.Tventes = 0;
         this.Tavoirs = 0;
         this.TCA = 0;
         this.TotCACpt = 0;

         this. var_tot_cpt = 0;
         this.var_tot_terme = 0;
         this. var_tot_ventes = 0;
         this. var_tot_avoirs = 0;
         this.var_tot_cptt = 0;
         this. AvoirH = 0;
         this. tc = 0;
         this. tav = 0;
         this. tve = 0;
         this. tota = 0;
         this.readonly = false;

}


}


