import { Component, OnInit, ViewChild , HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { NgSelectConfig } from '@ng-select/ng-select';
import { GridComponent, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ExcelService } from '../services/excel.service';
import { OverlayPanel } from 'primeng/primeng';
import { HistCreanceService } from '../services/histCreance.service';

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
  selector: 'app-historiquecreanceszone',
  templateUrl: './historiquecreanceszone.component.html',
  styleUrls: ['./historiquecreanceszone.component.scss'],
  providers: [ ExcelService]
})

export class HistoriquecreanceszoneComponent implements OnInit {

  @ViewChild('grid')
  public grid: GridComponent;
  public searchOptions: SearchSettingsModel;
  wasInside: any;
  @ViewChild('op')
   public op: OverlayPanel;
  readonly: boolean ;
  btnaff: boolean;
  btancien: boolean;
  tn: any;
  listeHistActuelle: any;
  listeHistAnncien: any;

  datedebut = new Date ('03/01/2021');
  datefin = new Date ('03/01/2021');
  minDate = new Date (2010 , 0, 1 );
  D1: string;
  D2: string;
  selectedradio = '1';
  constructor(
    private config: NgSelectConfig ,
    private excelService: ExcelService,
    private histCreanceService: HistCreanceService,


  ) {  this.config.notFoundText = 'Aucun élément trouvé';
  this.config.clearAllText = 'Supprimer tous'; }

  ngOnInit() {
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
    const anneeCourante = new Date ().getFullYear().toString();
    this.datedebut = new Date ('03/01/' + anneeCourante);
     this.datefin = new Date ('03/01/' + anneeCourante);
    this.listeHistActuelle = new Array();
    this.listeHistAnncien = new Array();
    this.btnaff = false;
    this.btancien = false;

  }
  async afficher() {
  this.D1 = this.datedebut.toLocaleDateString('en-GB');
  this.D2 = this.datefin.toLocaleDateString('en-GB');
  this.readonly = true ;
  this.btnaff = true;

  console.log('rdbtn *****' , this.selectedradio );

   if (this.selectedradio === '1') {
  this.btancien = false;

    await this.histCreanceService.getHistoriqueActuelle()
    .toPromise()
    .then((data) => {
      this.listeHistActuelle = data['_embedded'].historiquecreances;

     console.log('liste  historique ' , this.listeHistActuelle);
     });
     for (let i = 0 ; i < this.listeHistActuelle.length ; i++) {
      this.listeHistActuelle[i].pourcentage = Number(this.listeHistActuelle[i].pourcentage).toFixed(1) ;
   }
 } else {
   this.btancien = true;
    this.readonly = false ;


  await this.histCreanceService.getHistoriqueancienne (this. D1 , this.D2)
  .toPromise()
  .then((data) => {
   this.listeHistActuelle = data['_embedded'].histCreanceAnnciens;

   console.log('listeHistAnncien ' , this.listeHistActuelle);
   });
   for (let i = 0 ; i < this.listeHistActuelle.length ; i++) {
    this.listeHistActuelle[i].pourcentage = Number(this.listeHistActuelle[i].pourcentage).toFixed(1) ;
 }
 }

}



  async nouvelleSaisie() {

    this.listeHistActuelle = new Array();
    this.btnaff = false ;
    this.readonly = false ;
    this.btancien = false;
    this.selectedradio = '1';
  }
    async gererExcel() {
      this.D1 = this.datedebut.toLocaleDateString('en-GB');
      this.D2 = this.datefin.toLocaleDateString('en-GB');
      if (this.selectedradio === '1') {
        this.btancien = false;
         await this.histCreanceService.getHistoriqueActuelle()
         .toPromise()
         .then((data) => {
           this.listeHistActuelle = data['_embedded'].historiquecreances;

          console.log('liste  historique ' , this.listeHistActuelle);
          });
      } else {
        this.btancien = true;
        this.readonly = false ;
      //  this.btnaff = true;
       await this.histCreanceService.getHistoriqueancienne (this. D1 , this.D2)
       .toPromise()
       .then((data) => {
        this.listeHistActuelle = data['_embedded'].histCreanceAnnciens;

        console.log('listeHistAnncien ' , this.listeHistActuelle);
        });
      }


      try {
        let nomFich;
           nomFich = 'listeHistActuelle';

        const exportExcel = this.listeHistActuelle.map(obj => {
          return {
            'DU': obj.du,
            'AU': obj.au,
            'Zone': obj.zone,

            'Solde_debut': obj.solde_debut,
            'Solde_Fin': obj.solde_fin,
             'Pourcentage' : obj.pourcentage,


          };
        });
        this.excelService.exportAsExcelFile(
          exportExcel,
          nomFich + ' : ' + new Date().toLocaleDateString('en-GB')
        );
      } catch {
      console.log(' methode genererExcel');
      }



    }










}
