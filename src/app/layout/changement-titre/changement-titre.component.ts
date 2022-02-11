import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GridComponent, RowSelectEventArgs, SearchSettingsModel, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { NgSelectConfig } from '@ng-select/ng-select';
import { BrouService } from '../services/brou.service';
import { CaisseService } from '../services/caisse.service';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { SoldcsService } from '../services/soldcs.service';
import { SteService } from '../services/ste.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { CaissePService } from '../services/caisseP.service';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';
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
  selector: 'app-changement-titre',
  templateUrl: './changement-titre.component.html',
  styleUrls: ['./changement-titre.component.scss'],
  providers: [DatePipe],
})
export class ChangementTitreComponent implements OnInit {
  selectionOptions: SelectionSettingsModel;
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('op')
  public op: OverlayPanel;
  public searchOptions: SearchSettingsModel;
  readonly: boolean ;
  datedeb = new Date();
  datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  datefin = new Date ();
  minDate = new Date (2010 , 0, 1 );
  dateerg = new Date();
  dateerg1 = new Date();
  dateechang1 = new Date();
  DateSys = new Date();
  tn: any ;
  col: string ;
  clients = new Array();
  SelectedClients: any ;
  codeclient: any;
  typePiece = [
    { id : '1' , type : 'chéque'},
    { id : '2' , type : 'Traite'},
    { id : '3' , type : 'Espece'}
  ];
  Selectedtype: any ;
  dateValS: any;
  dateValp: any;
  data: any ;
  ArrayTitre: {piece: string ; numero: string ; montant: string ; date: string ; ech: string ; bnqclt: string ;
  caisse: string ; observ: string ; client: string ; tire: string ; apurement: string ; id: string ; regle: string ; select: boolean };
  listeselectedgrid = new Array ;
  type: string;
  listeTitre = new Array();
  selectedtitre: any;
  Piece: string;
  Numero: string;
  Montant: string;
  Dateenrg: string;
  Dateech: string;
  pMontant: any ;
  Banque: string;
  Observation: string;
  Client: string;
  Tire: string;
  btndbclick: boolean;
  Rdpiece1: any;

  listepiece = [
    {type : 'Espece' , value : 'ESPECE'},
    {type : 'chéque' , value : 'CHEQUE'},
    {type : 'Traite' , value : 'TRAITE'},
    {type : 'Virement' , value : 'VIR.BNQ'},
    {type : 'CarteB' , value : 'CARTEB'},
  ];
  initialSort: { columns: { field: string; direction: string; }[]; };
  btnrmpl = false ;
  mnt: any;
  selectedrow: any;
  trie = 'mnt';
  btntri: boolean;
  Maxid: any;
  resAnnulTitre: any ;
  resRemplacertitrebrou: any ;
  resRemplacertitrecaisse: any ;
  resUpdatecaisse: any ;
  resAnnulTitreCaisse: any ;
  msg: string;
  numero1: string;
  montant1: string;
  banque1: string;
  tire1: string;
  observ1: string;
  wasInside: any;
  listeRemplacerTitre1 = new Array();
  ArrayRemplacerTitre1: {piece: string ; numero: string ; montant: string ; date: string ; ech: string ;
     bnqclt: string ; observ: string ; client: string ; tire: string};
  showdialog: boolean;
  SommeMnt: number;
  MntTotal: number;
  btnaff: boolean;
  clientselected: any;
  btnannRemp: boolean;
  btnvalid: boolean;
  btnajout: boolean;
  disableGrid = false ;
  constructor(
    private clientService: ClientService ,
    private soldcsService: SoldcsService ,
    private steService: SteService ,
    private caisseService: CaisseService ,
    private datePipe: DatePipe,
    private brouService: BrouService,
    private caissepService: CaissePService,
    private loginService: LoginService ,
    private config: NgSelectConfig ,
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false ;
  }
  ngOnInit() {
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick' };
    this.btnannRemp = false ;
    this.btnvalid = false ;
    this.SommeMnt = 0 ;
    this.observ1 = '' ;
    this.tire1 = '' ;
    this.montant1 = '' ;
    this.banque1 = '' ;
    this.numero1 = '';
    this.MntTotal = 0 ;
    this.Selectedtype = '1';
    this.Rdpiece1 = 'CHEQUE';
    this.btndbclick = false ;
    this.type = '' ;
    this.SelectedClients = '' ;
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

  async chargerClient() {
    if ( this.clients.length === 0 ) {
      await this.clientService
      .getClientsListByOrderByDeno()
      .toPromise()
      .then( data => {
        this.clients = data['_embedded'].clients ;
        console.log('listeclient = ', this.clients);

      }) ;
    }
  }
  changeClients() {
    console.log('selectedclient =', this.SelectedClients);

    if (this.SelectedClients !== null && this.SelectedClients !== undefined) {
     this.codeclient = this.SelectedClients ;
    } else { this.codeclient = '' ; }
  }
  public onSearchClients(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  rowSelected(args: RowSelectEventArgs) {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selectedd: any = this.grid.getSelectedRecords()[0];
      this.selectedtitre = selectedd;
      console.log('selectedtitre************', this.selectedtitre);

    }
    const selectedrecords: object[] = this.grid.getSelectedRecords();  // Get the selected records.
    this.listeselectedgrid = selectedrecords;
    console.log('listeselectedgrid ******  ', this.listeselectedgrid);
    if (this.selectedtitre.apurement === null) {
      this.selectedtitre.select = true ;
     // this.grid.refresh();
    } else {
      this.showdialog = true ;

    }
    this.btndbclick = true ;
  }
  annulerSelection(): void {
    console.log('annulation selection *****');
    const selectedrecords: object[] = this.grid.getSelectedRecords();  // Get the selected records.
    this.listeselectedgrid = selectedrecords;
    console.log('listeselectedgrid ******  ', this.listeselectedgrid);
    /*if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.selectedtitre = new Array() ;
    }*/
  }

  async Afficher() {

  await this.soldcsService
  .getMaxDateValS()
  .toPromise()
  .then((data) => {
    this.dateValS = data ;
  }) ;


  await this.steService
  .getDateCaisse()
  .toPromise()
  .then((data) => {
    this.dateValp = data;
  });
  /*{ id : '2' , type : 'Traite'},
    { id : '3' , type : 'Espece'}*/
  switch (this.Selectedtype) {
    case '1': {
      this.type = 'CH';
      break;
    }
    case '2': {
      this.type = 'TR';
      break;
    }
    case '3': {
      this.type = 'ESP';
      break;
    }
    default: {
      break;
    }
  }
  const dateP: string = this.datePipe.transform(this.dateValp, 'dd/MM/yyyy');
  const dateS: string = this.datePipe.transform(this.dateValS, 'dd/MM/yyyy');
  console.log(dateP, dateS, this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB')
  , this.type, this.SelectedClients);
  console.log('convert date = ', dateP);

  this.listeTitre = new Array();
  await this.caisseService
  .getListbytitre(dateP, dateS, this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB')
  , this.type, this.SelectedClients)
  .toPromise()
  .then((data) => {
    this.data = data ;
    console.log('****', data);

  });
  for (let i = 0 ; i < this.data.length ; i++) {
    this.ArrayTitre = {piece : '' , numero : '' , montant : '' , date : '' , ech : '' , bnqclt : '' ,
      caisse : '' , observ : '' , client : '' , tire : '' , apurement: '' , id: '' , regle: '' , select : false };
    const obj = this.data[i];
    this.ArrayTitre.piece = obj[0] ;
    this.ArrayTitre.numero = obj[1] ;
    this.ArrayTitre.montant = obj[2] ;
    const dateErg: string = this.datePipe.transform(obj[3], 'dd/MM/yyyy');
    this.ArrayTitre.date = dateErg ;
    const dateEch: string = this.datePipe.transform(obj[4], 'dd/MM/yyyy');
    this.ArrayTitre.ech = dateEch;
    this.ArrayTitre.bnqclt = obj[5] ;
    this.ArrayTitre.caisse = obj[6] ;
    this.ArrayTitre.observ = obj[7] ;
    this.ArrayTitre.client = obj[8] ;
    this.ArrayTitre.tire = obj[9] ;
    this.ArrayTitre.apurement = obj[10] ;
    this.ArrayTitre.id = obj[11] ;
    this.ArrayTitre.regle = obj[12] ;
    this.ArrayTitre.select = false;
    this.listeTitre.push(this.ArrayTitre);
  }
  this.initialSort = { columns: [{ field: 'date', direction: 'Ascending' }
  , { field: 'montant', direction: 'Ascending' }, { field: 'ech', direction: 'Ascending' }
  , { field: 'client', direction: 'Ascending' }] };

  this.grid.refresh();
  this.btntri = true ;
  this.btnaff = true ;
  this.readonly = true ;
}

Abondonner() {
  this.listeselectedgrid = new Array();
  this.disableGrid = false ;
  this.btnannRemp = false ;
  this.btnrmpl = false ;
  this.btnvalid = false ;
  this.btndbclick = false ;
  this.btnajout = false ;
  this.btnannRemp = false ;
  this.Piece = '' ;
  this.Numero = '';
  this.Montant = '' ;
  this.Dateenrg = '' ;
  this.Dateech = '';
  this.Banque = '';
  this.Observation = '';
  this.Client = '';
  this.Tire = '';
  this.AnnulerRemplacement();
  for (let i = 0 ; i < this.listeTitre.length ; i++) {
    const obj = this.listeTitre[i];
    if (obj.select === true) {
      obj.select = false;
    }
  }
  this.grid.refresh();
}

RemplacerTitre(e) {
  this.wasInside = true;
  let verif = true ;
  const clientselected = this.listeselectedgrid[0].client;
  if (this.listeselectedgrid.length === 1) {
    this.clientselected = clientselected ;
    this.MntTotal = this.listeselectedgrid[0].montant ;
    this.btnrmpl = true ;
    this.disableGrid = true ;
  } else {
    for (let i = 0 ; i < this.listeselectedgrid.length ; i++) {
      const obj = this.listeselectedgrid[i];
      this.MntTotal = this.MntTotal + this.listeselectedgrid[i].montant ;
      if (clientselected !== obj.client) {
        verif = false ;

      }
    }
    if (verif === true) {
      this.clientselected = clientselected ;
      this.btnrmpl = true ;
      this.disableGrid = true ;
    } else {
     this.msg = 'il faut selectionner le même client' ;
     this.op.show(e, document.getElementById('btnremp'));
     this.listeselectedgrid = new Array() ;
     this.disableGrid = false ;
     for (let i = 0 ; i < this.listeTitre.length ; i++) {
      const obj = this.listeTitre[i];
      if (obj.select === true) {
        obj.select = false;
      }
    }
    this.grid.refresh();
    }
  }
 console.log('montant *****', this.MntTotal);

}
SeRapprocher() {
  this.trie = 'mnt' ;
  this.tribyMontant();
  let i = 0; let existe = false;
    while ( i < this.listeTitre.length && existe === false ) {
        if (this.listeTitre[i].montant >= this.pMontant) {
          existe = true;
          this.selectedrow = this.listeTitre[i] ;
          break;
        } else {
          i++;
        }
      }
      console.log('mnt *******', this.selectedrow);
      /*this.listeTitre = this.listeTitre.filter(el => Number(el.montant) >= Number(this.pMontant));
      console.log('****numero trouve*****', this.listeTitre);
      // this.grid.selectRows([numero]);*/
      console.log('obsrv ****', this.selectedrow.observ);

  const findrowIndex = this.listeTitre.findIndex((el) => el.montant === this.selectedrow.montant);
  // this.grid.selectedRowIndex = findrowIndex;
  setTimeout(() => {
    this.grid.selectRows([findrowIndex]);
  }, 100);
  console.log('****index grid*****', findrowIndex);

}
  async AnnulerTitre(e) {
    this.wasInside = true;
    if (this.listeselectedgrid.length === 1) {
      const obj = this.listeselectedgrid[0];
      if (obj.date <= this.dateValp) {
        if (obj.apurement === null ) {
          if (obj.caisse === 'T') {
            await this.brouService
            .getMaxId()
            .toPromise()
            .then((data) => {
              this.Maxid = data ;
              console.log('Max id = ***' , this.Maxid );

            });
            this.Maxid = Number(this.Maxid) + 1 ;
            if ( obj.regle === null) {
              obj.regle = '';
            }
            console.log('annuler titre *****', obj.client , obj.piece
              , obj.numero,
              obj.montant, obj.id, this.Maxid
              , obj.date, this.DateSys.toLocaleDateString('en-GB'), '0'
              , obj.regle);
            await this.brouService.annulerTitreBrou(obj.client , obj.piece
              , obj.numero, obj.montant, obj.id
              , obj.date, this.DateSys.toLocaleDateString('en-GB'), '0'
              , obj.regle)
              .toPromise()
              .then((data) => {
                this.resAnnulTitre = data ;
                console.log('resultat annuler titre : ***', this.resAnnulTitre);

              });
              this.grid.refresh();
          } else {
            if (obj.regle === null) {
              obj.regle = '';
            }
            await this.caisseService.updtaEtatCaisse(obj.client , obj.piece , obj.numero ,
              obj.caisse , obj.id , obj.date )
              .toPromise()
              .then((data) => {
                this.resUpdatecaisse = data ;
                console.log('resultat update etat caisse : ***' , this.resUpdatecaisse );
              });
              console.log(obj.client , obj.piece , obj.numero ,
                obj.montant , obj.caisse , obj.id , obj.date ,
                this.DateSys.toLocaleDateString('en-GB') , obj.apurement , obj.regle);

            await this.caissepService.annulerTitreCaisse(obj.client , obj.piece , obj.numero ,
              obj.montant , obj.caisse , obj.id , obj.date ,
               this.DateSys.toLocaleDateString('en-GB') , '0' , obj.regle)
               .toPromise()
               .then((data) => {
                 this.resAnnulTitreCaisse = data ;
                 console.log('resultat annuler ntitre caisse : **** ', this.resAnnulTitreCaisse);
               });

               await this.loginService
               .procedureStockeModule(
                 localStorage.getItem('login'),
                 globals.selectedMenu,
                 obj.piece + ',' + Number(obj.montant).toFixed(3) + 'DT'
               )
               .toPromise().then((data) => {
                 console.log('procedureStockeModule ', data);
               });
               this.grid.refresh();
          }
          for (let i = 0 ; i < this.listeTitre.length ; i++) {
            const obj1 = this.listeTitre[i];
            if (obj1.select === true) {
              obj1.select = false;
              const index: number = this.listeTitre.indexOf(obj1);
              if (index !== -1) {
                this.listeTitre.splice(index, 1);
              }
            }
          }
          this.grid.refresh();
        } else {
          this.msg = 'Cette piéce est appurée' ;
          console.log('msg ****', this.msg);
          this.op.show(e, document.getElementById('btnAnn'));
        }
        this.grid.refresh();
      } else {
        this.msg = 'Caisse pas encore validée' ;
        console.log('msg ****', this.msg);
        this.op.show(e, document.getElementById('btnAnn'));
      }
    } else {
      this.msg = 'il faut selectionner une seule ligne ' ;
      this.op.show(e, document.getElementById('btnAnn'));
    }


}
AnnulerRemplacement() {

  this.listeRemplacerTitre1 = new Array() ;
  this.btnannRemp = false ;
  this.btnvalid = false ;
  this.SommeMnt = 0 ;
  this.btnajout = false ;

}
AjouterRemplacement() {

}
tribyMontant() {
  console.log('utlst', this.trie + 'utlst');

  if (this.trie === 'mnt') {
    this.listeTitre = this.listeTitre.sort(function(a, b) {
      return Number(a.montant) > Number(b.montant) ? 1 : Number(a.montant) < Number(b.montant) ? -1 : 0;
    });

    if (this.grid !== undefined) {
      console.log('liste trie ******', this.listeTitre);
      this.grid.refresh();
    }
  }

 }
 tribyDateEnreg() {
  console.log('utlst', this.trie + 'utlst');

  if (this.trie === 'datenrg') {
    this.listeTitre = this.listeTitre.sort(function(a, b) {
      if (a.date != null && b.date != null) {
        if (
          new Date(
            +a.date.split('/')[2],
            +a.date.split('/')[1] - 1,
            +a.date.split('/')[0]
          ) <
          new Date(
            +b.date.split('/')[2],
            +b.date.split('/')[1] - 1,
            +b.date.split('/')[0]
          )
        ) {
          return -1;
        }
        if (
          new Date(
            +a.date.split('/')[2],
            +a.date.split('/')[1] - 1,
            +a.date.split('/')[0]
          ) >
          new Date(
            +b.date.split('/')[2],
            +b.date.split('/')[1] - 1,
            +b.date.split('/')[0]
          )
        ) {
          return 1;
        }
        return 0;
      }
      return 0;
    });

    if (this.grid !== undefined) {
      console.log('liste trie ******', this.listeTitre);
      this.grid.refresh();
    }
  }

 }

 tribyDateEch() {
  console.log('utlst', this.trie + 'utlst');

  if (this.trie === 'datech') {
    this.listeTitre = this.listeTitre.sort(function(a, b) {
      if (a.ech != null && b.ech != null) {
        if (
          new Date(
            +a.ech.split('/')[2],
            +a.ech.split('/')[1] - 1,
            +a.ech.split('/')[0]
          ) <
          new Date(
            +b.ech.split('/')[2],
            +b.ech.split('/')[1] - 1,
            +b.ech.split('/')[0]
          )
        ) {
          return -1;
        }
        if (
          new Date(
            +a.ech.split('/')[2],
            +a.ech.split('/')[1] - 1,
            +a.ech.split('/')[0]
          ) >
          new Date(
            +b.ech.split('/')[2],
            +b.ech.split('/')[1] - 1,
            +b.ech.split('/')[0]
          )
        ) {
          return 1;
        }
        return 0;
      }
      return 0;
    });

    if (this.grid !== undefined) {
      console.log('liste trie ******', this.listeTitre);
      this.grid.refresh();
    }
  }

 }
 async tribyClient() {
  if (this.trie === 'clt') {
    this.listeTitre = this.listeTitre.sort(function(a, b) {
      return a.client < b.client ? 1 : a.client > b.client ? -1 : 0;
    });

    if (this.grid !== undefined) {
      console.log('liste trie ******', this.listeTitre);
      this.grid.refresh();
    }
  }

}
Initialiser() {
  this.readonly = false ;
  this.btnaff = false ;
  this.codeclient = '' ;
  this.listeTitre = new Array() ;
  this.Selectedtype = '1';
  this.pMontant = '';
  this.datefin = new Date();
  this.datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  this.btnrmpl = false ;
  this.btndbclick = false ;
  this.btntri = false ;
  this.listeselectedgrid = new Array();
  this.listeRemplacerTitre1 = new Array();
  this.disableGrid = false ;
  this.SelectedClients = '';
}
Supprimer1() {
  this.Rdpiece1 = 'CHEQUE' ;
  this.numero1 = '';
  this.montant1 = '';
  this.dateerg1 = new Date();
  this.dateechang1 = new Date();
  this.banque1 = '';
  this.tire1 = '';
  this.observ1 = '';
}

Ajouter1(e) {
  this.wasInside = true;
  let verif ;
  if (this.Rdpiece1 === 'ESPECE') {
    if (this.montant1 === null || this.montant1 === undefined || this.montant1 === '') {
      verif = false ;
     this.msg = 'verifier votre saisie';
     this.op.show(e, document.getElementById('btniconajout'));
    }
  } else if (this.montant1 === null || this.montant1 === undefined || this.montant1 === '' ||
  this.numero1 === null || this.numero1 === undefined || this.numero1 === ''
  || this.banque1 === null || this.banque1 === undefined || this.banque1 === '' || this.tire1 === null || this.tire1 === undefined ||
  this.tire1 === '') {
    verif = false ;
   this.msg = 'verifier votre saisie';
   this.op.show(e, document.getElementById('btniconajout'));
  }
  if (verif !== false) {


  console.log('date ****', this.dateerg1.toLocaleDateString('en-GB'));
  this.ArrayRemplacerTitre1 = {piece: '' , numero:  '' ,  montant:  '' ,  date:  '' ,  ech:  '' ,
    bnqclt:  '' ,  observ:  '' , client:  '' ,  tire:  '' };
    this.ArrayRemplacerTitre1.piece = this.Rdpiece1 ;
    this.ArrayRemplacerTitre1.numero = this.numero1 ;
    this.ArrayRemplacerTitre1.montant = this.montant1 ;
    this.ArrayRemplacerTitre1.date =  this.dateerg1.toLocaleDateString('en-GB') ;
    this.ArrayRemplacerTitre1.ech = this.dateechang1.toLocaleDateString('en-GB');
    this.ArrayRemplacerTitre1.bnqclt = this.banque1 ;
    this.ArrayRemplacerTitre1.observ = this.observ1 ;
    this.ArrayRemplacerTitre1.client = this.clientselected ;
    this.ArrayRemplacerTitre1.tire = this.tire1  ;
    this.SommeMnt = this.SommeMnt + Number(this.montant1) ;
    console.log('somme ****', this.SommeMnt);
    console.log('montant totale ******* ok ' , Number(this.MntTotal.toFixed(3)));

   this.listeRemplacerTitre1.push(this.ArrayRemplacerTitre1);
   console.log('liste remplacement *****', this.listeRemplacerTitre1);
   this.Supprimer1();
   this.btnannRemp = true ;
   if (Number(this.MntTotal.toFixed(3)) === this.SommeMnt) {
     this.btnvalid = true ;
     this.btnajout = true ;
   }
  }
}

  async ValiderRemplacement() {
         for (let i = 0 ; i < this.listeselectedgrid.length ; i++) {
           const obj = this.listeselectedgrid[i];
           if (obj.caisse === 'T') {
            await this.brouService
            .getMaxId()
            .toPromise()
            .then((data) => {
              this.Maxid = data ;
              console.log('Max id = ***' , this.Maxid );

            });
            this.Maxid = Number(this.Maxid) + 1 ;
            if ( obj.regle === null) {
              obj.regle = '';
            }
            console.log(obj.client , obj.piece
              , obj.numero,
              obj.montant, obj.id, this.Maxid
              , obj.date, this.DateSys.toLocaleDateString('en-GB'), '0'
              , obj.regle);
            await this.brouService.annulerTitreBrou(obj.client , obj.piece
              , obj.numero, obj.montant, obj.id
              , obj.date, this.DateSys.toLocaleDateString('en-GB'), '0'
              , obj.regle)
              .toPromise()
              .then((data) => {
                this.resAnnulTitre = data ;
                console.log('resultat annuler titre : ***', this.resAnnulTitre);

              });
              for (let i = 0 ; i < this.listeRemplacerTitre1.length ; i++) {
                const obj1 = this.listeRemplacerTitre1[i];
                console.log('***brou****', obj1.client, obj1.piece, obj1.numero
                  , obj1.montant, obj1.date, obj1.ech, '', '', obj1.bnqclt, obj1.tire);
                await this.brouService.RemplacerTitreBrou(obj1.client, obj1.piece, obj1.numero
                  , obj1.montant, obj1.date, obj1.ech, '', '', obj1.bnqclt, obj1.tire)
                  .toPromise()
                  .then((data) => {
                    this.resRemplacertitrebrou = data ;
                    console.log('resultat remplacer titre brou : ***', this.resRemplacertitrebrou);
                  });

              }
           } else {
             if (obj.regle === null) {
              obj.regle = '';
             }
              await this.caisseService.updtaEtatCaisse(obj.client , obj.piece , obj.numero ,
              obj.caisse , obj.id , obj.date )
              .toPromise()
              .then((data) => {
                this.resUpdatecaisse = data ;
                console.log('resultat update etat caisse : ***' , this.resUpdatecaisse );
              });
              console.log(obj.client , obj.piece , obj.numero ,
                obj.montant , obj.caisse , obj.id , obj.date ,
                this.DateSys.toLocaleDateString('en-GB') , obj.apurement , obj.regle);

             await this.caissepService.annulerTitreCaisse(obj.client , obj.piece , obj.numero ,
              obj.montant , obj.caisse , obj.id , obj.date ,
               this.DateSys.toLocaleDateString('en-GB') , '0' , obj.regle)
               .toPromise()
               .then((data) => {
                 this.resAnnulTitreCaisse = data ;
                 console.log('resultat annuler ntitre caisse : **** ', this.resAnnulTitreCaisse);
               });

               for (let i = 0 ; i < this.listeRemplacerTitre1.length ; i++) {
                const obj1 = this.listeRemplacerTitre1[i];
                console.log(obj1.client, obj1.piece, obj1.numero
                  , obj1.montant, obj1.date, obj1.ech, '', '', obj1.bnqclt, obj1.tire);
                await this.caissepService.RemplacerTitreCaisse(obj1.client, obj1.piece, obj1.numero
                  , obj1.montant, obj1.date, obj1.ech, '', '', obj1.bnqclt, obj1.tire)
                  .toPromise()
                  .then((data) => {
                    this.resRemplacertitrecaisse = data ;
                    console.log('resultat remplacer titre caisse : ***', this.resRemplacertitrecaisse);
                  });

              }
            }

          }
          this.btnrmpl = false ;
          this.btnvalid = false ;
          this.btnrmpl = false ;
          this.btndbclick = false ;
          this.btnajout = false ;
          this.btnannRemp = false ;
          this.listeselectedgrid = new Array();
          this.listeRemplacerTitre1 = new Array();
          for (let i = 0 ; i < this.listeTitre.length ; i++) {
            const obj = this.listeTitre[i];
            if (obj.select === true) {
              obj.select = false;
              const index: number = this.listeTitre.indexOf(obj);
              if (index !== -1) {
                this.listeTitre.splice(index, 1);
              }
            }
          }
          this.grid.refresh();
          this.disableGrid = false ;
          this.MntTotal = 0 ;
          this.SommeMnt = 0;

  }

closedialog() {
  this.showdialog = false ;
  this.grid.refresh();
}
}
