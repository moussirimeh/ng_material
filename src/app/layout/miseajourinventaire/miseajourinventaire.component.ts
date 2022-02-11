import { Component, OnInit , ViewChild, HostListener} from '@angular/core';

import { L10n, setCulture } from '@syncfusion/ej2-base';
import { NgSelectConfig } from '@ng-select/ng-select';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { StockService } from '../services/stock.service';
import { MouveinventService } from '../services/mouveinvent.service';
import { SteService } from '../services/ste.service';
import { OverlayPanel } from 'primeng/primeng';
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
  selector: 'app-miseajourinventaire',
  templateUrl: './miseajourinventaire.component.html',
  styleUrls: ['./miseajourinventaire.component.scss']
})


export class MiseajourinventaireComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  dateServeur: Date;
  cd: string;
  emp: string ;
  cod: string ;
  blocked = true;
  listemouve_inv: any;
  showConfirmINV = false;
  displayErrorDialog = false;
  articlesDepEmpl = [];
  mdpInventaire = '';
  styleOvPanel = {};
  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  public mdp: string;

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
  router: any;
  listemp: any;
  emplacement: string;
  reqExec  = false;
  affMise = true;
  DateServeur: Date;
  year: number;
  month: number;
  dateinvent: string ;
  invent: string ;
  msg: string;
  mdpInvent = null;
  showcard = true;
  constructor(  private config: NgSelectConfig ,
    private mouveinventService: MouveinventService ,
    private steService: SteService,

    private stockService: StockService, ) { this.config.notFoundText = 'Aucun élement trouvé' ;
    this.config.clearAllText = 'Supprimer tous '; }

    @HostListener('document:click')
    clickout() {
      if (!this.wasInside) {

        this.ov.hide();
      }
      this.wasInside = false;
    }
    async  confirmer(e) {
      this.ov.hide();
     this.wasInside = true;
   // inv  this.showcard = false;
    // this.msgs = 'La mise à jour est entraint de s\'effectuer veuillez patienter ... ';
    // this.styleOvPanel = this.styleOvPanelSuccess;
   //  this.ov.show(e, document.getElementById('conf'));




    /*  await this.steService
      .getDateServeur()
      .toPromise()
      .then((data: string) => (this.DateServeur = new Date(data)));
       this.year = this.DateServeur.getFullYear();
       this.month = this.DateServeur.getMonth() + 1;
       this.dateinvent = String(this.year).substring(2, 4) ;
       this.invent = 'INVENT' + this.dateinvent ;
       if (this.month === 1) {
        this.dateinvent = String(Number(this.dateinvent) - 1) ;
       }
       this.invent = 'INVENT' + this.dateinvent ;
        console.log('dateinv   ******* ' , this.dateinvent);*/
   // query1
    await this.mouveinventService
    // this.invent
        .updatemplacement( )
        .toPromise()
        .then((data) => {
      //   console.log('update init emplacement  ', data);

      });

    // query_mouve invent
    await this.mouveinventService
    .getlistemp()
    .toPromise()
    .then((data) => {
    console.log('liste emplacement '  , data);
    this.listemouve_inv = data['_embedded'].listeemps;

    });

    // let articlesDepEmpl = [];
    let emplac = '';
    let i = 0;
    let cod = this.listemouve_inv[0].code;
    while ( i < this.listemouve_inv.length ) {
     // console.log('code      ' + i, this.listemouve_inv[i].code);
       if (cod === this.listemouve_inv[i].code ) {
        emplac = emplac  + this.listemouve_inv[i].emp + '/';
      //  console.log('emplacement     ', emplac);

           i++;
       } else {
          if (emplac.length > 50) {
            this.articlesDepEmpl.push({code: this.listemouve_inv[i - 1].code});
          }
               // query_maj_emp
           await this.mouveinventService
           .updateemplacement(emplac, cod)
              .toPromise()
            .then((data) => {
           //  console.log('query maj emp  ', data);
           });

           emplac = '';
          cod = this.listemouve_inv[i].code;
       }
    }

/*

  // query2
   await this.mouveinventService
   .getlisteem(this.listemouve_inv[i].code)
   .toPromise()
   .then((data) => {
   console.log('la valeur du emplacement **'  , data);
   if (data['_embedded'] !== undefined && data['_embedded'].listeems !== undefined && data['_embedded'].listeems.length > 0) {

   this.emplacement = data['_embedded'].listeems[0].emplacement ; }


      });


   if  ((this.emplacement.length + this.listemouve_inv[i].emp.length) > '49') {
    this.articlesDepEmpl.push({code: this.listemouve_inv[i].code});
     // this.cod = this.listemouve_inv[i].code;
     // this.msg = 'Trop d-emplacement pour la référence ' + this.cod;
     // this.ov.show(e, document.getElementById('conf'));

   } else {
   // query_maj_emp
   await this.mouveinventService
  .updateemplacement(this.listemouve_inv[i].emp, this.listemouve_inv[i].code)
   .toPromise()
  .then((data) => {
   console.log('query maj emp  ', data);

   });

   }






*/


   this.ov.hide();
   this.showConfirmINV = false;
   this.reqExec = true;

        }



   async confirmInv(e) {
    this.ov.hide();
      this.wasInside = true;

      if (this.mdpInvent === this.mdpInventaire) {
        this.showcard = false;
        await this.confirmer(e);
        console.log('mot passe' , this.mdpInvent );


      } else {
        this.showcard = true;
        this.msgs = 'Mot de passe incorrecte !';
        this.styleOvPanel = this.styleOvPanelError;


        this.ov.show(e, document.getElementById('mdpInv'));


      }

    }

    Annuler() {

      this.mdpInvent = null;
      this.ov.hide();
    }




  ngOnInit() {
    this.mdpInventaire = 'invokok';
    this.mdpInvent = null;
    setTimeout(() => {
      document.getElementById('mdpInv').focus();
    }, 0);

  }


}
