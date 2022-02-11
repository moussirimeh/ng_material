import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { embeddedViewEnd } from '@angular/core/src/render3';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';
import { ClientService } from '../services/client.service';
import { FactureService } from '../services/facture.service';
import { TransfCptService } from '../services/transf-cpt.service';
import { TransferfactComptabilite } from '../services/transferfact-comptabilite';

@Component({
  selector: 'app-transf-cpt',
  templateUrl: './transf-cpt.component.html',
  styleUrls: ['./transf-cpt.component.scss']
})
export class TransfCptComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;
  transCpt: TransferfactComptabilite ;
  datedeb = new Date();
  datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  datefin = new Date ();
  minDate = new Date (2010 , 12, 1 );
  readonly: boolean ;
  showConfirm: boolean ;
  showOk: boolean ;
  Encour: boolean ;
  tn: any;
  msg: string ;
  header: string ;
  listeFacuteInDate = new Array();
  senreg: string;
  scleenreg: string ;
  showLancer: boolean ;
  numfr: string;
  listeClientBycode: any;
  constructor(
    private transfCptService: TransfCptService ,
    private factureService: FactureService ,
    private clientservice: ClientService ,
    private loginService: LoginService
    ) { }
    @HostListener('document:click')
    clickout() {
        this.op.hide();
    }
  ngOnInit() {
    this.showLancer = true ;
    this.showConfirm = false ;
    this.showOk = false ;
    this.Encour = false ;
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
  async Lancer(e) {


    await this.transfCptService
    .deleteTransfCpt()
    .toPromise()
    .then(data => {
      const resdelete = data;
      console.log('resultatDelete = ', resdelete );
    });

    await this.factureService
    .updateTrspAndTaxepmFacture(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'))
    .toPromise()
    .then(data => {
      const resUpdate = data;
      console.log('resultatUpdate = ', resUpdate );
    });

    await this.factureService
    .getFactureinDate(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'))
    .toPromise()
    .then(data => {
      this.listeFacuteInDate = data['_embedded'].factures ;
      console.log('listeFact =', this.listeFacuteInDate);

    });

    console.log('liste : ', this.listeFacuteInDate.length);

    if (this.listeFacuteInDate.length === 0) {
      console.log('open = true ');

      this.msg = 'Aucune Facture Pour Ces Dates';
      this.op.show(e, document.getElementById('btnLancer'));
    } if (this.listeFacuteInDate.length !== 0) {
      this.showConfirm = true ;
      this.header = 'Le Nombre de Factures Pour Ces Dates est de ' + this.listeFacuteInDate.length + ' Factures';
    }



  }
  async ClickOui() {
    this.showConfirm = false ;
    this.showLancer = false ;
    this.Encour = true ;
    for (const obj of this.listeFacuteInDate) {
      if (obj.sens === 'C') {
        this.numfr = 'FACT' + obj.numero + '          ' ;
      } else {
        this.numfr = 'AVOIR' + obj.numero + '          ' ;
      }
      let espace = '' ;
      for (let i = 0 ; i < 10 - (Number(obj.timbre).toFixed(3)).length ; i++) {
        espace = espace + ' ';

      }
      let espace2 = '' ;
      for (let i = 0 ; i < 10 - (Number(obj.net).toFixed(3)).length ; i++) {
        espace2 = espace2 + ' ';

      }
      this.senreg = this.numfr + obj.date.substr(6, 4) + obj.date.substr(3, 2) + obj.date.substr(0, 2) + obj.operateur +
      obj.sens + espace +
      Number(obj.timbre).toFixed(3) + espace2 +
      Number(obj.net).toFixed(3) ;
      this.scleenreg = 'R' + obj.numero ;
      console.log('senreg ', this.senreg);
      /**************************Service******************************** */
      this.transCpt = {
        id : '',
        cleenreg: this.scleenreg,
        enreg: this.senreg ,
      };
      console.log('insertR = ', this.transCpt);
      await this.transfCptService
      .InsertTransfCpt(this.transCpt)
      .toPromise()
      .then(
        (data) => {},
        (error) => console.log('errorAddEquiv')
      );
      /*************************************************************** */
      /**********************vider  ***************************/
      this.transCpt = {
        id : '',
        cleenreg: '',
        enreg: '' ,
      };
      this.senreg = '' ;
      this.scleenreg = '' ;
      // this.numfr = '' ;
      /****************************************************** */
      this.scleenreg = 'A' + obj.numero ;
      if (Number(obj.base29) +  Number(obj.base17) +  Number(obj.base10) === 0 ) {
        espace = '' ;
        for (let i = 0 ; i < 10 - ((Number(obj.base0) -  Number(obj.taxePm) +  Number(obj.transport) ).toFixed(3)).length ; i++) {
        espace = espace + ' ' ;
       }
        this.senreg = this.numfr + '00.00' +
        espace + Number(Number(obj.base0) -  Number(obj.taxePm) -  Number(obj.transport)) ;
       /**************************Service******************************** */
        this.transCpt = {
          id : '',
          cleenreg: this.scleenreg,
          enreg: this.senreg ,
        };
        console.log('insertA = ', this.transCpt);
        await this.transfCptService
        .InsertTransfCpt(this.transCpt)
        .toPromise()
        .then(
          (data) => {},
          (error) => console.log('errorAddEquiv')
        );
        /*************************************************************** */
        /**********************vider  ***************************/
        this.transCpt = {
          id : '',
          cleenreg: '',
          enreg: '' ,
        };
        this.senreg = '' ;
        // this.numfr = '' ;
        /*************************************************************** */
        if ( Number(obj.taxePm) > 0) {
          espace = '' ;
        for (let i = 0 ; i < 10 - (Number(obj.taxePm).toFixed).length ; i++) {
        espace = espace + ' ' ;
       }
          this.senreg = this.numfr + '00.00' + espace + Number(obj.taxePm).toFixed(3) ;
         /**************************Service******************************** */
         this.transCpt = {
          id : '',
          cleenreg: this.scleenreg ,
          enreg: this.senreg + 'P' ,
         };
         console.log('insertA = ', this.transCpt);
         await this.transfCptService
         .InsertTransfCpt(this.transCpt)
         .toPromise()
         .then(
          (data) => {},
          (error) => console.log('errorAddEquiv')
         );
         /*************************************************************** */
         /**********************vider  ***************************/
         this.transCpt = {
          id : '',
          cleenreg: '',
          enreg: '' ,
         };
         this.senreg = '' ;
         // this.numfr = '' ;
         /*************************************************************** */
        }

        if ( Number(obj.transport) !== 0) {
          espace = '' ;
          for (let i = 0 ; i < 10 - (Number(obj.transport).toFixed).length ; i++) {
          espace = espace + ' ' ;
         }
          this.senreg = this.numfr + '00.00' + espace + Number(obj.transport).toFixed(3) ;
         /**************************Service******************************** */
         this.transCpt = {
          id : '',
          cleenreg: this.scleenreg ,
          enreg: this.senreg + 'T' ,
         };

         await this.transfCptService
         .InsertTransfCpt(this.transCpt)
         .toPromise()
         .then(
          (data) => {},
          (error) => console.log('errorAddEquiv')
         );
         /*************************************************************** */
         /**********************vider  ***************************/
         this.transCpt = {
          id : '',
          cleenreg: '',
          enreg: '' ,
         };
         this.senreg = '' ;
         // this.numfr = '' ;
         /*************************************************************** */
        }
        /***query2.parambyname('cl').asstring := 'C'+query1numero.asstring;
        senreg := query1operateur.asstring+'EXONORE '; */
        this.scleenreg = 'C' + obj.numero ;
        this.senreg = obj.operateur + 'EXONORE' ;


      } else {

        if ( Number(obj.base17) > 0) {
          espace = '' ;
          for (let i = 0 ; i < 10 - ((Number(obj.base17) - Number(obj.taxePm)).toFixed).length ; i++) {
          espace = espace + ' ' ;
         }
          this.senreg = this.numfr + '19.00' + espace + (Number(obj.base17) - Number(obj.taxePm)).toFixed(3) ;
         /**************************Service******************************** */
         this.transCpt = {
          id : '',
          cleenreg: this.scleenreg,
          enreg: this.senreg ,
         };

         await this.transfCptService
         .InsertTransfCpt(this.transCpt)
         .toPromise()
         .then(
          (data) => {},
          (error) => console.log('errorAddEquiv')
         );
         /*************************************************************** */
         /**********************vider  ***************************/
         this.transCpt = {
          id : '',
          cleenreg: '',
          enreg: '' ,
         };
         this.senreg = '' ;
        // this.numfr = '' ;
         /*************************************************************** */
        }

        if ( Number(obj.base29) !== 0) {
          espace = '' ;
          for (let i = 0 ; i < 10 - (Number(obj.base29).toFixed).length ; i++) {
          espace = espace + ' ' ;
         }
          this.senreg = this.numfr + '07.00' + espace + Number(obj.base29).toFixed(3) ;
         /**************************Service******************************** */
         this.transCpt = {
          id : '',
          cleenreg: this.scleenreg,
          enreg: this.senreg ,
         };
         console.log('insertA = ', this.transCpt);
         await this.transfCptService
         .InsertTransfCpt(this.transCpt)
         .toPromise()
         .then(
          (data) => {},
          (error) => console.log('errorAddEquiv')
         );
         /*************************************************************** */
         /**********************vider  ***************************/
         this.transCpt = {
          id : '',
          cleenreg: '',
          enreg: '' ,
         };
         this.senreg = '' ;
         // this.numfr = '' ;
         /*************************************************************** */
        }
        /******if query1base10.asfloat > 0 then
        begin
        senreg := numfr+'13.00'+
        stringofchar(' ', 10-length(FloatToStrF(query1base10.AsFloat
        -query1transport.asfloat,ffFixed,10,3)))+
        FloatToStrF(query1base10.AsFloat-query1transport.asfloat,ffFixed,10,3);
        query2.parambyname('enr').asstring := senreg;
        query2.execsql;
        end; */
        if ( Number(obj.base10) > 0) {
          espace = '' ;
          for (let i = 0 ; i < 10 - ((Number(obj.base10) - Number(obj.transport)).toFixed).length ; i++) {
          espace = espace + ' ' ;
         }
          this.senreg = this.numfr + '13.00' + espace + (Number(obj.base10) - Number(obj.transport)).toFixed(3) ;
         /**************************Service******************************** */
         this.transCpt = {
          id : '',
          cleenreg: this.scleenreg,
          enreg: this.senreg ,
         };
         await this.transfCptService
         .InsertTransfCpt(this.transCpt)
         .toPromise()
         .then(
          (data) => {},
          (error) => console.log('errorAddEquiv')
         );
         /*************************************************************** */
         /**********************vider  ***************************/
         this.transCpt = {
          id : '',
          cleenreg: '',
          enreg: '' ,
         };
         this.senreg = '' ;
         // this.numfr = '' ;
         /*************************************************************** */
        }

        if ( Number(obj.transport) > 0) {
          espace = '' ;
          for (let i = 0 ; i < 10 - (Number(obj.transport).toFixed).length ; i++) {
          espace = espace + ' ' ;
         }
          this.senreg = this.numfr + '13.00' + espace + Number(obj.transport).toFixed(3) ;
         /**************************Service******************************** */
         this.transCpt = {
          id : '',
          cleenreg: this.scleenreg,
          enreg: this.senreg + 'T' ,
         };

         await this.transfCptService
         .InsertTransfCpt(this.transCpt)
         .toPromise()
         .then(
          (data) => {},
          (error) => console.log('errorAddEquiv')
         );
         /*************************************************************** */
         /**********************vider  ***************************/
         this.transCpt = {
          id : '',
          cleenreg: '',
          enreg: '' ,
         };
         this.senreg = '' ;
         // this.numfr = '' ;
         /*************************************************************** */
        }
        /**if query1taxe_pm.asfloat > 0 then
        begin
        senreg := numfr+'19.00'+
        stringofchar(' ', 10-length(FloatToStrF(query1taxe_pm.asfloat,ffFixed,10,3)))+
        FloatToStrF(query1taxe_pm.asfloat,ffFixed,10,3);
        query2.parambyname('enr').asstring := senreg+'P';
        query2.execsql;
        end; */
        if ( Number(obj.taxePm) > 0) {
          espace = '' ;
          for (let i = 0 ; i < 10 - (Number(obj.taxePm).toFixed).length ; i++) {
          espace = espace + ' ' ;
         }
          this.senreg = this.numfr + '19.00' + espace + Number(obj.taxePm).toFixed(3) ;
         /**************************Service******************************** */
         this.transCpt = {
          id : '',
          cleenreg: this.scleenreg,
          enreg: this.senreg + 'P' ,
         };

         await this.transfCptService
         .InsertTransfCpt(this.transCpt)
         .toPromise()
         .then(
          (data) => {},
          (error) => console.log('errorAddEquiv')
         );
         /*************************************************************** */
         /**********************vider  ***************************/
         this.transCpt = {
          id : '',
          cleenreg: '',
          enreg: '' ,
         };
         this.senreg = '' ;
         // this.numfr = '' ;
         /*************************************************************** */
        }
        this.scleenreg = 'C' + obj.numero ;
        this.senreg = obj.operateur + '   ' ;
      }
      await this.clientservice.getClientByCode(obj.operateur)
      .toPromise()
      .then(data => {
        this.listeClientBycode = data['_embedded'].clients ;

      });
      if (this.listeClientBycode.length === 1) {
        console.log('listeClient = ', this.listeClientBycode[0].deno  );
        espace = '' ;
          for (let i = 0 ; i < 30 - (this.listeClientBycode[0].deno).length ; i++) {
          espace = espace + ' ' ;
         }
        this.senreg = this.senreg + this.listeClientBycode[0].deno + espace ;
      } else {
        this.senreg = ' ' + '30' ;
      }
      /**************************Service******************************** */
      this.transCpt = {
        id : '',
        cleenreg: this.scleenreg,
        enreg: this.senreg ,
       };

       await this.transfCptService
       .InsertTransfCpt(this.transCpt)
       .toPromise()
       .then(
        (data) => {},
        (error) => console.log('errorAddEquiv')
       );
       /*************************************************************** */



    }
    this.Encour = false ;
    this.showOk = true ;
    await this.loginService
    .procedureStockeModule(
      localStorage.getItem('login'),
      globals.selectedMenu, ''
    )
    .toPromise().then((data) => {
      console.log('procedureStockeModule ', data);
    });
  }

}
