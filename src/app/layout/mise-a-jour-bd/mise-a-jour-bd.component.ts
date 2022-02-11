import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { StockService } from '../services/stock.service';
import { MouveService } from '../services/mouve.service';
import { LoginService } from 'src/app/login/login.service';
import { OverlayPanel } from 'primeng/primeng';
import { ViewMove3Service } from '../services/view-move3.service';
import { TabTypClService } from '../services/tab-typ-cl.service';
import { ClientService } from '../services/client.service';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-mise-a-jour-bd',
  templateUrl: './mise-a-jour-bd.component.html',
  styleUrls: ['./mise-a-jour-bd.component.scss']
})
export class MiseAJourBdComponent implements OnInit {
  blockedDocument: boolean;
  caStocks: any;
  resultQ3: any;
  ca_four_rest: Number;
  code_profiler: string;
  dat = new Date().toLocaleDateString('en-GB');
  ca_f_r: number;
  wasInside: boolean;
  @ViewChild('op')
  public op: OverlayPanel;
  msg = '';
   dateCourante = new Date().toLocaleDateString('en-GB');
   debutAnnDate = new Date('01/01/' + String(new Date().getFullYear() - 2)).toLocaleDateString('en-GB');
  styleOvPanelError = {
    'text-align': 'center',
    'font-size': '14px',
    'background-color': ' #f8b7bd'
  };
  styleOvPanelSuccess = {
    'text-align': 'center',
    'font-size': '12px',
    'background-color': ' #b7d8b7'
  };
  styleOvPanel = {};
  showdialog: boolean;
  modal: boolean;
 chif_af1: number;
 chif_af: number;
 createClientsTypeIResult: number;
 updateClientsTypeIResult: number;
 updateNouvMagCa123Result: number;
 updateMagCltResult: number;
 createClientsTypeNResult: number;
 reqExec  = false;
 listeClients: any[];
 listClientCodes: string[];
 affDet = true;
  constructor(private stockService: StockService,
    private mouveService:  MouveService ,
    private viewMove3Service: ViewMove3Service,
    private tabTypClService: TabTypClService,
    private clientService: ClientService,
    private loginService: LoginService) { }

  ngOnInit() {
    this.blockedDocument = false;
  }

  async afficherDeterminationClientsN(e) {
    // this.wasInside = true;
   // this.styleOvPanel = this.styleOvPanelSuccess;
   // this.styleopPanel = this.styleopPanelSuccess;
    this.affDet = false;
   // this.msg = ' La Determination Client Noyaux est lancer Veuillez vous patienter svp !';
    // this.op.show(e, document.getElementById('inptDet'));

     this.chif_af1 = 0;
     // Query1 ==> Get chiff aff Totale
    await  this.viewMove3Service.getCA()
    .toPromise()
    .then((data) => {
     this.chif_af = (data * 0.8);

   });
     console.log('chiffre affaire ' , this.chif_af);

      // Query2 Part 1 ==> INSERT TAB_TYP_CL Client avec mag is null
   await this.tabTypClService.createClientsTypeI()
   .toPromise()
   .then((data) => {
     this.createClientsTypeIResult = data;

   });

 console.log('Result INSERT TAB_TYP_CL Client avec mag Nbr ' , this.createClientsTypeIResult);

 // Query2 Part 2 ==> Update Client mag  I  where  mag
 await this.clientService.updateClientsTypeI()
 .toPromise()
 .then((data) => {
   this.updateClientsTypeIResult = data;
 });

 console.log('Update Client mag  I  where  mag. Nbr ' , this.updateClientsTypeIResult);

 // Query2 Part 3 ==> update Client  nouvMag  ca123
 await this.clientService.updateNouvMagCa123()
 .toPromise()
 .then((data) => {
   this.updateNouvMagCa123Result = data;
 });

 console.log('update Client  nouvMag  ca123. Nbr ' , this.updateNouvMagCa123Result);
 // Query 3
 await this.clientService.findByOrderByCa123Desc()
 .toPromise()
 .then((data) => {
   this.listeClients = data['_embedded'].clients;
 });

 console.log('Nbr List Client ' ,   this.listeClients.length);

 this.chif_af1 = 0;

 this.listClientCodes = new Array<string>();

  this.listeClients.forEach(function(cl) {

   this.chif_af1  = this.chif_af1  + Number(cl.ca123);


   if ( this.chif_af1 < this.chif_af) {
     this.listClientCodes.push(cl.code);
   }

  }, this);
  console.log('chif_af1 ' ,  this.chif_af1);
  console.log('chif_af ' ,  this.chif_af);
  console.log('listClientCodes ' ,  this.listClientCodes );

  if (this.listClientCodes !== undefined &&
    this.listClientCodes !== null &&
    this.listClientCodes.length > 0) {
  // Query4 update tout les clients recuperé par le forEach par codes
  await this.clientService.updateMagClt('N', this.listClientCodes)
  .toPromise()
  .then((data) => {
   this.updateMagCltResult = data;
 });

 console.log('updateMagClt listClientCodes  ' ,  this.updateMagCltResult);
 }

 await this.tabTypClService.createClientsTypeN()
 .toPromise()
  .then((data) => {
   this.createClientsTypeNResult = data;
 });

 console.log('createClientsTypeN Nbr ' ,  this.createClientsTypeNResult);
 this.reqExec = true;
 await this.loginService
       .procedureStockeModule(
         localStorage.getItem('login'),
         globals.selectedMenu,
         'determination topologie clts'
       )
       .toPromise().then((data) => {
         console.log('procedureStockeModule ', data);
       });




 }

















 /* @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
     this.op.hide();
    }
    this.wasInside = false;
  }*/

  async  miseAjourStockProfiler(e) {
    this.wasInside = true;
    this.op.hide();
    this.resultQ3  = new Array();
    this.styleOvPanel = this.styleOvPanelError;
    this.msg = 'La détermination du stock profiler est entraint de s\'effectuer veuillez patienter ... ';
     this.op.show(e, document.getElementById('miseAjourStockProfiler'));
     this.blockedDocument = true;

   await  this.stockService.updateStockProfiler().toPromise().then(data => {
      console.log('UpdateStockProfiler1 ', data);
    });


   this.caStocks = new Array();
    // query 2
   await  this.stockService.getCAStock().toPromise().then(data => {
     console.log('query 2 ', data);
      this.caStocks = data;
    });





    let i = 0;
    let ca = Number(this.caStocks[0][1]);
    while (i < this.caStocks.length && ca > 100  ) {
     // console.log('Entrééé query     2', i);
     // console.log('item sum(ca) by op ' + i + '*********************** ', this.caStocks[i]);
/*
      const op = this.caStocks[i][0];
      console.log('operateuur ', op );
*/
// this.caStocks[i][0] => code operateur
      await  this.stockService.getCAStockByOp(this.caStocks[i][0]).toPromise().then(data => {
         console.log('query 3 ', data);
         this.resultQ3 = data;
       });

       console.log(this.caStocks[i][1], Number(this.caStocks[i][1]), Number(this.caStocks[i][1]) * 0.7);

       let ca_f_rA = Number(this.caStocks[i][1]) * 0.7;

       // ca_f_rA = Number(this.ca_four_restA);
            console.log('1er rest de R2', ca_f_rA );
          let j = 0;
          while (j <  this.resultQ3.length  && ca_f_rA > 50  ) {
            console.log('Entrééé query     3', i);
            console.log(' stock ca by op ' + j + '*********************** ', this.resultQ3[j]);
            const code = this.resultQ3[j][0];
            console.log('cooooooooooooode ' + j + '    ', code);
           await this.stockService.UpdateStockProfilerCa('A' , code).toPromise().then(data => {
              console.log('query 4', data);
          });
          // const val = Number(this.resultQ3[j][1]);
               console.log('vaaaaaaaaaal',  Number(this.resultQ3[j][1]));
          ca_f_rA = ca_f_rA -  Number(this.resultQ3[j][1]);
            console.log('reeeeeest', ca_f_rA );
            console.log('jjjjjjjjjj', j );
          j++;
          }



       let ca_f_rB = Number(this.caStocks[i][1]) * 0.2;
       console.log('ca_four_rest    B avant boucle *************************  ', ca_f_rB);

         // let k = 0;
          while (j <  this.resultQ3.length && ca_f_rB > 50  ) {

            const code = this.resultQ3[j][0];
            console.log('cooooooooooooode k ', code);
           await this.stockService.UpdateStockProfilerCa('B', code).toPromise().then(data => {
            console.log('query 4', data);
          });
          ca_f_rB = ca_f_rB - Number(this.resultQ3[j][1]);

          console.log('ca_four_rest   B dans  boucle *************************  ' + j + '************* ', ca_f_rB );
            j++;
          }


        let ca_f_rC = Number(this.caStocks[i][1]) * 0.1;


          while (j <  this.resultQ3.length  && ca_f_rC > 50  && Number(this.resultQ3[j][1]) > 10  ) {
            const code = this.resultQ3[j][0];
          console.log('cooooooooooooode  ' + j + '   ', code);

           await this.stockService.UpdateStockProfilerCa('C', code).toPromise().then(data => {
              console.log('query 4 ', data);
          });
          ca_f_rC = ca_f_rC - Number(this.resultQ3[j][1]);
          j++;
          }
        /*  if (i === 5) {
            break;
          }*/
     i++;
     ca = Number(this.caStocks[i][1]);
     console.log('iii ',   i);

    }

















    console.log('determination stock profiler ');

   this.blockedDocument = false;



   const codeUtil = localStorage.getItem('login');
   const moduteName = globals.selectedMenu;
const paramMouchar =  'Mise a jour stock profiler' ;
this.loginService
.procedureStockeModule(
  codeUtil, moduteName, paramMouchar
)
.subscribe((data) => {
  console.log('procedure stock', data);
});
// this.op.hide();
this.styleOvPanel = this.styleOvPanelSuccess;
this.msg = 'La détermination du stock profiler est effectuée avec succes !  ';
this.op.show(e);

  }



  async  stockStable(e) {
    this.op.hide();
    this.styleOvPanel = this.styleOvPanelError;
    this.msg = 'La détermination du stock stable est entraint de s\'effectuer veuillez patienter ... ';
    this.op.show(e, document.getElementById('stkstable'));
    this.blockedDocument = true;

  await  this.stockService.udateStockStable(this.dat)
  .toPromise().then(data => {
    console.log('data ', data);
    const dt = data;
  });
  this.blockedDocument = false;

  /*
           const codeUtil = localStorage.getItem('login');
           const moduteName = globals.selectedMenu;
           const paramMouchar = 'N°V ' + this.SelectedVisite.numVisite + ' CL ' + this.SelectedVisite.codeClt ;
           this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
  */
  const codeUtil = localStorage.getItem('login');
  const moduteName = globals.selectedMenu;
  const paramMouchar =  'Mise a jour stock stable  ' ;
  this.loginService
  .procedureStockeModule(
    codeUtil, moduteName, paramMouchar
  )
  .subscribe((data) => {
    console.log('procedure stock', data);
  });

  this.styleOvPanel = this.styleOvPanelSuccess;
  this.msg = 'La détermination du stock stable  est effectuée avec succes ! ';
       this.op.show(e);
    }

 async  miseAjour(e) {
  this.op.hide();
  this.styleOvPanel = this.styleOvPanelError;
  this.msg = 'La mise à jour est entraint de s\'effectuer veuillez patienter ... ';
  this.op.show(e, document.getElementById('miseAjour'));
  this.blockedDocument = true;
await  this.mouveService.updateQTE().toPromise().then(data => {
  console.log('data ', data);
  const dt = data;
});
this.blockedDocument = false;

/*
   const codeUtil = localStorage.getItem('login');
         const moduteName = globals.selectedMenu;
         const paramMouchar = 'N°V ' + this.SelectedVisite.numVisite + ' CL ' + this.SelectedVisite.codeClt ;
         this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
*/
const codeUtil = localStorage.getItem('login');
const moduteName = globals.selectedMenu;
const paramMouchar =  'Mise a jour Qte  ' ;
this.loginService
.procedureStockeModule(
  codeUtil, moduteName, paramMouchar
)
.subscribe((data) => {
  console.log('procedure stock', data);
});

this.styleOvPanel = this.styleOvPanelSuccess;
this.msg = 'La mise à jour est effectuée avec succes ! ';
     this.op.show(e);
  }

  async MajStockMort(e) {
    this.op.hide();
    this.styleOvPanel = this.styleOvPanelError;
    this.msg = 'La détermination du stock mort est entraint de s\'effectuer veuillez patienter ... ';
     this.op.show(e, document.getElementById('MajStockMort'));
    this.blockedDocument = true;

    await this.stockService.modifyTaxeStockNonStable().toPromise().then(
      (data) => {
        console.log('ok  : modifyTaxeStockNonStable');

      }
    );
    await this.stockService.modifyTaxeStockMort().toPromise().then(
      (data) => {
        console.log('ok : modifyTaxeStockMort');

      }
    );
    this.blockedDocument = false;
    const codeUtil = localStorage.getItem('login');
    const moduteName = globals.selectedMenu;
    const paramMouchar = 'Mise a jour Stock mort ' ;
    this.loginService
      .procedureStockeModule(codeUtil, moduteName, paramMouchar)
      .subscribe((data) => {
        console.log('procedure stock', data);
      });
      this.styleOvPanel = this.styleOvPanelSuccess;
      this.msg = 'La détermination du stock mort est effectuée avec succes ! ';
     this.op.show(e);

  }

}
