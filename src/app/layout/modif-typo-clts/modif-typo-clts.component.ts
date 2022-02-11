import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ClientService } from '../services/client.service';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { TabTypClService } from '../services/tab-typ-cl.service';
import { DatePipe } from '@angular/common';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-modif-typo-clts',
  templateUrl: './modif-typo-clts.component.html',
  styleUrls: ['./modif-typo-clts.component.scss']
})
export class ModifTypoCltsComponent implements OnInit {
  tabTabTypCl: any;
  readonly: boolean;
  ModifBTn = false;
  cltNonN =  false;
  Cltobj = false;
  btnNouvelSaisie: boolean;
  listeClients = new Array();
  selectedclt: any;
  codeClt: string;
  denoClt: string;
  magclt: string ;
  objclt: string ;
  hiddenModifBTn;

  codeTypologie: string ;
   // liste des typo clients
   listeTypeClt = new Array();
   typologieItems = [
     // { id: 'N', deno: 'N' },
     { id: 'M', deno: 'M' },
     { id: 'S', deno: 'S' },
     { id: 'C', deno: 'C' },
     { id: 'P', deno: 'P' },
     { id: 'I', deno: 'I' },
   ];
   @ViewChild('op')
   public op: OverlayPanel;
   msg: String;
  nouvelObjectif: any;
  nouvelleTypologie: any;
  wasInside: any;
  initTypo: any;
  initObj: any;


  constructor(
    private config: NgSelectConfig,
    private  clientService: ClientService,
    private loginService: LoginService,
    private tabTypClService: TabTypClService
  ) {
    this.config.notFoundText = 'Aucun élement trouvé' ;
    this.config.clearAllText = 'Supprimer tous ';
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {

      this.op.hide();
    }
    this.wasInside = false;
  }

  async chargerClients() {
    if (this.listeClients.length === 0) {
      await this.clientService
        .getClientsListByOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des clients ', data['_embedded'].clients);

          this.listeClients = data['_embedded'].clients;
        });
    }
  }


  intialiserSelectedClient() {
    this.nouvelleTypologie  = null;
    this.selectedclt = {
      id: null,
      code: null,
      deno: null,
      adresse: null,
      ville: null,
      post: null,
      respon: null,
      tel: null,
      agence: null,
      banque: null,
      telex: null,
      fax: null,
      cadnat: null,
      compte: null,
      edition: null,
      exonor: null,
      duree: null,
      reg: null,
      terme: null,
      marque: null,
      plafond: null,
      zone: null,
      comm: null,
      assujet: null,
      codeTva: null,
      timbre: null,
      ech: null,
      bloc: null,
      datBlc: null,
      typeC: null,
      regle: null,
      lettre: null,
      codeC: null,
      autor: null,
      eMail: null,
      typeComm: null,
      rec: null,
      vend: null,
      represant: null,
      secteur: null,
      objectif: null,
      nature: null,
      datCreat: null,
      mag: null,
      respons2: null,
      adresseusine: null,
      adressesiege: null,
      gsm1: null,
      gsm2: null,
      nouvMag: null,
      ca123: null,
      respons3: null,
      fonction1: null,
      fonction2: null,
      fonction3: null,
      eMail1: null,
      eMail2: null,
      eMail3: null,
      tel2: null,
      tel3: null,
      gsm3: null,
      codGroupe: null,
      modeReg: null,
      plafondEncours: null,
      indic: null,
      bcExige: null,
    };
  }
  public onSearchDeno(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  changeTypologieClt(e) {
    if (
      this.nouvelleTypologie  !== null &&
      this.nouvelleTypologie  !== undefined
    ) {
      this.codeTypologie = this.nouvelleTypologie.deno;
    } else {
      this.codeTypologie = '';
    }
  }

  changeClient(e) {
    this.wasInside = true;
    if (this.selectedclt !== null && this.selectedclt !== undefined) {
      console.log('mag = ', this.selectedclt.mag);
      console.log('objectclient=', this.selectedclt.objectif);
      this.codeClt = this.selectedclt.code;
      this.magclt = this.selectedclt.mag;
      this.initTypo = this.selectedclt.mag;
      this.initObj = this.selectedclt.objectif;
      this.objclt = this.selectedclt.objectif;
      if (this.selectedclt.mag === 'N') {
        // this.msg = 'Ce client est de typologie N , il ne peut etre modifié';
       // this.op.show(e, document.getElementById('antypo'));
         // this.cltNonN = false;
           this.hiddenModifBTn = false;
           this.readonly = false;
           this.Cltobj = false;

      } else {
        this.cltNonN = false;
        this.hiddenModifBTn = false;
        this.Cltobj = true;
      }

    } else {
      this.codeClt = null;
      this.denoClt = null;
      this.magclt = null;
      this.objclt = null;
    }
  }

  async Modifier() {
    this.op.hide();
    this.cltNonN = true;
    this.nouvelleTypologie = this.typologieItems.find(val =>  val.deno === this.magclt);
    this.codeTypologie = this.magclt;
    this.nouvelObjectif = this.objclt;
    this.readonly = true ;



  }
async Validermodif(e) {
  if (
    this.codeTypologie !== null &&
    this.codeTypologie !== undefined &&
    this.codeTypologie !== ''
  ) {

 const currentDate = new Date();
 const timestamp = currentDate.getTime();
 if (   this.Cltobj === true) {
this.tabTabTypCl =   { operateur: this.codeClt,  typologie: this.codeTypologie, date: timestamp   };

await this.tabTypClService
.createTypoClt(this.tabTabTypCl)
.toPromise()
.then((dataa) => {
  console.log('tabTypCl Created Success');
});

}
// mise a ajour objet client
this.selectedclt.mag = this.codeTypologie;
this.selectedclt.objectif = this.nouvelObjectif;

// mise a jour ancien mag et ancien object

this.objclt = this.nouvelObjectif;

await this.clientService
.updateClient(this.selectedclt)
.toPromise()
.then((data) => {
  console.log('clientUpdateSuccess');
  this.Annulermodif();
})
.catch((data) => {
  console.log('error client update');
});
this.magclt = this.selectedclt.mag ;


} else {
this.msg = 'Typologie Client obbligatoire';
this.op.show(document.getElementById('modif'), document.getElementById('novtypo'));
}
await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        this.selectedclt.code + ' ' + this.initTypo + ' ->' + this.selectedclt.mag + ' ' + this.initObj + ' ->' + this.selectedclt.objectif


      )
      .toPromise().then((data) => {
        console.log('procedureStockeModule ', data);
      });
this.hiddenModifBTn = true;
this.cltNonN = false;
this.readonly = false ;
}

  Annulermodif() {
    this.op.hide();
    this.codeTypologie = null;
    this.nouvelleTypologie = null;
    this.nouvelObjectif = null;
    this.hiddenModifBTn = true;
    this.cltNonN = false;
    this.readonly = false ;
  }
  nouvelleSaisie() {
     this.ModifBTn = false;

  }

  ngOnInit() {
    this.codeTypologie = '';
    this.listeTypeClt = this.typologieItems;
    this.hiddenModifBTn = true;


  }

}
