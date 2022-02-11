import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { ClientService } from '../services/client.service';
import { TabTypClService } from '../services/tab-typ-cl.service';
import { ViewMove3Service } from '../services/view-move3.service';
import { OverlayPanel } from 'primeng/primeng';
import { globals } from 'src/environments/environment';


@Component({
  selector: 'app-det-clients-noyeau',
  templateUrl: './det-clients-noyeau.component.html',
  styleUrls: ['./det-clients-noyeau.component.scss']
})
export class DetClientsNoyeauComponent implements OnInit {

  constructor(
    private viewMove3Service: ViewMove3Service,
    private loginService: LoginService,
    private tabTypClService: TabTypClService,
    private clientService: ClientService
  ) {

   }

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
 @ViewChild('op')
  public op: OverlayPanel;
  msg: String;
  wasInside: any;

  styleopPanelSuccess = {
    'text-align': 'center',
    'font-size': '12px',
    'background-color': ' #b7d8b7',
  };
  styleopPanel = {};

   @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {

      this.op.hide();
    }
    this.wasInside = false;
  }

 async afficher() {
  // this.wasInside = true;
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
        ''
      )
      .toPromise().then((data) => {
        console.log('procedureStockeModule ', data);
      });




}



  ngOnInit() {
  }



}
function e(e: any, arg1: HTMLElement) {
  throw new Error('Function not implemented.');
}

