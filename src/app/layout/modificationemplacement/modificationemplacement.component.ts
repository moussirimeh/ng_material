import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { NgSelectConfig } from '@ng-select/ng-select';
import { StockService } from '../services/stock.service';
import { MouveinventService } from '../services/mouveinvent.service';
import { OverlayPanel } from 'primeng/primeng';
import { SteService } from '../services/ste.service';
import { Table } from 'primeng/table';

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
  selector: 'app-modificationemplacement',
  templateUrl: './modificationemplacement.component.html',
  styleUrls: ['./modificationemplacement.component.scss']
})
export class ModificationemplacementComponent implements OnInit {
  readonly = false ;
  btnaff = false ;
  emplacement:  string;
  liste = new Array();
  selected_art: any;
  @ViewChild('op')
  public op: OverlayPanel;
  @ViewChild('dt')
  public dt: Table;
  msg: String;
  wasInside: any;
  qte: string;
  id: string;
  codearticle: string ;
  dateServeur: Date;
  year: number;
  month: number;
  dateinvent: string ;
  invent: string ;
  selectedArticle = [0];
  listeBD: any;

  constructor( private config: NgSelectConfig ,
    private stockService: StockService,
    private mouveinventService: MouveinventService ,
    private steService: SteService,
  ) { this.config.notFoundText = 'Aucun élement trouvé' ;
     this.config.clearAllText = 'Supprimer tous '; }


  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {

      this.op.hide();
    }
    this.wasInside = false;
  }
  @HostListener('keyup.enter', ['$event'])
  onClick(event: Event) {
    if (this.dt !== undefined ) {
      this.dt.handleVirtualScroll('keyup.enter');
      event.preventDefault();
    }

  }



  recherche() {
    console.log('code **** ' , this.codearticle );
    const findrowIndex = this.liste.findIndex((el) => (el.code).toUpperCase() >= (this.codearticle).toUpperCase());
    console.log('****index grid*****', findrowIndex);
    this.selectedArticle =  (this.liste[findrowIndex]);
    if (this.liste[findrowIndex] !== null && this.liste[findrowIndex] !== undefined ) {
      document
      .getElementById(
        `row_${this.liste[findrowIndex].code}`)
      .scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'start',
      });
    }
  }
     async afficher(e) {
      this.wasInside = true;
      this.op.hide();
      await this.steService
     .getDateServeur()
     .toPromise()
     .then((data: string) => (this.dateServeur = new Date(data)));
      this.year = this.dateServeur.getFullYear();
      this.month = this.dateServeur.getMonth() + 1;
      this.dateinvent = String(this.year).substring(2, 4) ;
      if (this.month === 1) {
       this.dateinvent = String(Number(this.dateinvent) - 1) ;
      }
      this.invent = 'INVENT' + this.dateinvent ;
      const combine = this.invent + ' ' +  this.emplacement ;

       await this.mouveinventService
       .findByCombine(combine)
       .toPromise()
       .then((data) => {
        console.log('liste inventaire ', data);
       this.listeBD = data['_embedded'].mouvesinvent;

     });

     if (this.listeBD.length !== undefined && this.listeBD !== null &&  this.listeBD.length > 0) {
     // this.msg = ' Emplacement Inéxistant  !' ;
      // this.op.show(e, document.getElementById('emp')) ;



      for (let i = 0 ; i < this.listeBD.length ; i++) {

         const obj = {
          rang : i,
          quantite: Number(this.listeBD[i].quantite).toFixed(0) ,
          code : this.listeBD[i].code,
          id: this.listeBD[i].id
        };
        this.liste.push(obj) ;
      }

      this.btnaff = true ;
      this.liste.sort(function(a, b) {
        return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
      });
      } else { this.msg = ' Emplacement Inéxistant  !' ;
        this.op.show(e, document.getElementById('emp')) ; }
       // this.emplacement = '' ;
    }


    annulerSaisie( data) {
      console.log('data ', data);

      if (data.quantite === null || data.quantite === undefined || data.quantite === '' ) {
        data.quantite = Number(this.listeBD[data.rang].quantite).toFixed(0);
      }

    }
      initialiser() {
        this.btnaff = false ;
        this.liste = new Array() ;
        this.codearticle = '';
        this.op.hide();
      }
      async update(data) {
        if (data.quantite === null || data.quantite === undefined || data.quantite === '' ) {
          data.quantite = '0';
        }
        await this.mouveinventService
        .updateChangementINV( data.quantite , data.id)
        .toPromise()
        .then((data) => {
         console.log('modif quantite ', data);

      });
    }

        ngOnInit() {
          this.listeBD = new Array();
          document.getElementById('emp').focus();
         }



}
