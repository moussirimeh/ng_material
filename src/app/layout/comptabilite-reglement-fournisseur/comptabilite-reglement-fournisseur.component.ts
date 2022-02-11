import { Component, OnInit, Input , ViewChild, HostListener, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { NgSelectConfig } from '@ng-select/ng-select';
import * as jspdf from 'jspdf';
import { OverlayPanel } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';

import { BanqueService } from '../services/banque.service';
import { SteService } from '../services/ste.service';
import { Banque } from '../services/banque';
import { Achat0Service } from '../services/achat0.service';
import {Achat0} from '../services/achat0';
import {FournisseurService } from '../services/fournisseur.service';
import {Fournisseur } from '../services/fournisseur';
import {ConfirmationService} from 'primeng/api';
import { Table } from 'primeng/table';
import { LoginService } from 'src/app/login/login.service';
import {ViewEncapsulation} from '@angular/core';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-comptabilite-reglement-fournisseur',
  templateUrl: './comptabilite-reglement-fournisseur.component.html',
  styleUrls: ['./comptabilite-reglement-fournisseur.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [MessageService, ConfirmationService ]
})


export class ComptabiliteReglementFournisseurComponent implements OnInit  {
 // @Input() table: Table;
  @Input() row: any;
  @ViewChildren('row', { read: ElementRef }) rowElement: QueryList<ElementRef>;

@ViewChild('dt')
public table: Table;


@ViewChild('row')
public r: any;

      @ViewChild('op')
      public op: OverlayPanel;
        tn;
        datefin1;
        msgerror: string;
        public customAttributes: Object;

        fournisseurs;
        selectedFournisseur;
        codeFour;
        visibleBtnAfficher: boolean;

        liste = new  Array();
        datedebut = new Date();
        datefin = new Date();

           lst = new Array();

       numfact: string;
       date: Date;
       readonl: boolean;

       dateEch: Date;
       banques: Banque [];
       selectedBanque ;
       mntDevs;
       devs: string;
       mntdt;
       regle = new Array();

       dateReg: Date;
       id: string;
  SelectedFact: any;
  codeBanque: string;
  modif: boolean;
  ajout: boolean;
  supp: boolean;
  ste: any;
  societe: any;
  wasInside: boolean;
  msgs: boolean;

  position: string;
  btnafficher: boolean;
  btnNouvelleSaise: boolean;
  traitement: boolean;
  readonly: boolean;

  readonlyy: boolean;
  readOnNumFact: boolean;
  appercu: boolean;
  rang = 0;
  listeLength = 0;
  clonedfact: { [s: string]: any; } = {};
  selectedRow = '';
  clickaddnew: boolean;
  lstavantadd: any;
  longliste: number;
  btnajut: boolean;
  disable: boolean;
  idAjout = 0;
  initReg: String;
  readonly1: boolean;



constructor(private messageService: MessageService,
            private config: NgSelectConfig,
            private banqueService: BanqueService,
            private steService: SteService,
            private confirmationService: ConfirmationService,
            private fournisseurService: FournisseurService,
            private achat0Service: Achat0Service,
            private loginService: LoginService ) {
        this.config.notFoundText = 'Aucun élément trouvé';
        this.config.clearAllText = 'Supprimer tous ';

}


init() {
this.selectedFournisseur = null;
this.liste = new Array();
this.datefin = new Date();
this.datedebut = new Date(2017, 0, 1);
this.codeFour = '';
}

changeRegle() {


console.log('change regle', this.regle);
if (this.regle.length > 0) {
  this.initReg = 'O';
 this.regle = ['O'];

} else {
  this.initReg = 'N';
  this.regle = [];

}


}

async onRowEditSave(car:  Achat0, e ) {

  this.wasInside = true;
  this.op.hide();
  this.btnajut = true;
  this.disable = false;
  console.log('car', car);

  let fact: any;
  fact = {
    id : null,
    numero : car.numero,
    date : car.date,
    net : car.net,
    operateur : this.codeFour,
    typef : car.typef,
    sens : car.sens,
    echeance : car.echeance,
    montant : car.montant,
    devise : car.devise,
    banque : this.codeBanque,
    regle : this.initReg ,
    op1 : car.op1,
    recu : car.recu,
    dat_regl :  car.dat_regl
  } ;

  if (fact.numero === null || fact.numero === undefined || fact.numero === '' ) {
    this.table.initRowEdit(car);
    this.msgerror = 'numero du facture est obligatoire ! ';

    this.op.show(e, document.getElementById(`row_${car.id }_num`));
  } else {

      if ( (car.banque === undefined || car.banque === null)  ) {


        this.table.initRowEdit(car);
        this.msgerror = 'banque est obligatoire ! ';
        this.op.show(e, document.getElementById(`row_${car.id }_bnq`));
       } else {

         if ((fact.banque === null || fact.banque === undefined)) {
          this.table.initRowEdit(car);
          this.msgerror = 'banque est obligatoire ! ';
          this.op.show(e, document.getElementById(`row_${car.id }_bnq`));
      } else {

        if (fact.net === null || fact.net === undefined || fact.net === '' ) {
          this.table.initRowEdit(car);
          this.msgerror = 'Montant en DT est obligatoire ! ';
          this.op.show(e, document.getElementById(`row_${car.id }_net`));
       } else {
                          car.net = (Number(car.net).toFixed(3)).toString();
                          if (fact.montant !== null) {
                            car.montant = (Number(car.montant).toFixed(3)).toString();
                          }
                          car.net = (Number(car.net).toFixed(3)).toString();
                          if ((this.regle === undefined || this.regle === null ) && car.regle === 'N') {
                            car.regle = 'N';
                            fact.regle = 'N';
                            fact.dat_regl = null;
                          } else {
                            if (this.regle.length > 0) {
                              car.regle = 'O';
                              fact.regle = 'O';
                          } else {
                            car.regle = 'N';
                            fact.regle = 'N';
                            car.dat_regl = null;
                          }
                          }

                          console.log('fact regle', fact.regle);

                          if ((fact.regle === 'O') && ( fact.dat_regl === null ||  fact.dat_regl === undefined) ) {
                            this.table.initRowEdit(car);
                            this.msgerror = 'Date de reglement est obligatoire ! ';
                            this.op.show(e, document.getElementById(`row_${car.id }_dat_regl`));
                          } else {



                                            fact.date = fact.date.toLocaleDateString('en-GB');
                                            if (fact.echeance === null || fact.echeance === undefined) {
                                              fact.echeance = null;
                                            } else {
                                              fact.echeance = fact.echeance.toLocaleDateString('en-GB');

                                            }

                                            if ( fact.dat_regl === null ||  fact.dat_regl === undefined) {
                                              fact.dat_regl = null;
                                            } else {
                                              fact.dat_regl = fact.dat_regl.toLocaleDateString('en-GB');
                                            }
                                           fact.recu = 'N';
                                           car.recu  = 'N';
                                          if (car.id === '#' + this.idAjout.toString()) {

                                            console.log('fact avant create', fact);

                                            await this.achat0Service.createFacture(fact).toPromise()
                                            .then(data => {
                                            console.log('create ', data);
                                            this.disable = false;
                                            this.btnajut = true;
                                            this.appercu = true;
                                            this.btnNouvelleSaise = true;
                                            this.idAjout ++;
                                            car.id = data.id;


                                          });
                                          await this.loginService
                                          .procedureStockeModule(
                                            localStorage.getItem('login'),
                                            globals.selectedMenu,
                                            'Ajt ' + car.numero
                                          )
                                          .subscribe((data) => {
                                            console.log('procedure stock', data);
                                          });
                                            } else {
                                              fact.id = car.id;
                                              await this.achat0Service.update(fact).toPromise()
                                            .then(data => {
                                            console.log('modif ', data);
                                            this.disable = false;
                                            this.btnajut = true;
                                          });
                                         /* this.initReg = null;
                                          fact.regle = null;
                                          car.regle = null;*/
                                             this.appercu = true;
                                             this.btnNouvelleSaise = true;
                                             const param = 'Modif ' + fact.numero + ' NvReg ' + fact.regle ;
                                             console.log('lenght ', param.length);

                                         await this.loginService
                                          .procedureStockeModule(
                                            localStorage.getItem('login'),
                                            globals.selectedMenu,
                                            param
                                          ).toPromise()
                                          .then((data) => {
                                            console.log('procedure stock', data);
                                          });

                                            }
      }
      }
    }
    }
  }

}

@HostListener('document:click')
    clickout() {
          if (!this.wasInside) {
            if (this.op !== undefined && this.op !== null) {this.op.hide(); }
          }
          this.wasInside = false;

        if (this.liste !== null && this.liste !== undefined) {
          if (this.liste.length > this.longliste ) {
            this.onClick();
          }
        }

  }
changeBanque(obj) {
    let i = 0; let existe = false;
    while ( i < this.banques.length && existe === false ) {
        if (this.banques[i].deno === obj) {
          existe = true;
          this.selectedBanque = this.banques[i];
          break;
        } else {
          i++;
        }
      }
    if (this.selectedBanque !== null && this.selectedBanque !== undefined) {
      this.codeBanque = this.selectedBanque.code;
    } else {
      this.codeBanque = '';
    }
      console.log('change banque ', this.selectedBanque);

   }
   getWidth() {
     return 'width : 100%';
   }

async onRowEditInit(fact: any) {

   this.readonly = true;
  this.readonlyy = true;
    this.btnajut = false;
    this.appercu = false;

    this.btnNouvelleSaise = false;
    this.disable = true;
    let i = 0; let existe = false;
    while ( i < this.banques.length && existe === false ) {
        if (this.banques[i].deno === fact.banque) {
          existe = true;
          this.selectedBanque = this.banques[i];
          this.codeBanque = this.selectedBanque.code;
          break;
        } else {
          i++;
        }
    }
        if (fact.regle === 'O') {
          this.regle = ['O'];
          this.readonly1 = true;
          this.readonlyy = true;


        } else {
          this.regle = [];
          this.readonly1 = false;
          this.readonlyy = false;

        }


    this.clonedfact[fact.id] = {...fact};
    console.log('edit fact', fact);


  }
async afficher(e) {

  this.btnajut = true;
  this.liste = new Array();
  this.lstavantadd = new Array();


  this.wasInside = true;
  this.op.hide();
  this.SelectedFact = null;
  this.traitement = false;
  const datef = this.datefin.toLocaleDateString('en-GB');
  const dated = this.datedebut.toLocaleDateString('en-GB');

  if (this.codeFour === null || this.codeFour === undefined || this.codeFour === '' ) {
    this.msgerror = 'veuillez choisir un fournisseur !!';
    this.op.show(e, document.getElementById('frns'))  ;
    this.btnafficher = false;
    this.readonl = false;
    this.readonlyy = false;
  } else {
    this.readonlyy = true;
    this.readonl = true;
    this.btnafficher = false;
  await this.achat0Service.getFactureFournisseurPeriod(this.codeFour, datef, dated)
       .toPromise()
       .then(data => {

         this.liste = data['_embedded'].reglementFours;
         this.lst = data['_embedded'].reglementFours;
          this.longliste = data['_embedded'].reglementFours.length;
         this.lstavantadd = data['_embedded'].reglementFours;

         if (this.longliste === 0 || this.longliste === undefined) {
          this.appercu = false;
          this.btnafficher = true;
           this.btnNouvelleSaise = true;
           this.visibleBtnAfficher = false;
       } else {
           this.appercu = true;

           this.btnafficher = true;
           this.btnNouvelleSaise = true;
           this.visibleBtnAfficher = false;
           console.log('liste reglement frns                ', this.liste );

           for (const ob of this.liste ) {
            if (ob.net !== null) {
              ob.net = Number(ob.net).toFixed(3);
             }
             if (ob.montant !== null) {
              ob.montant = Number(ob.montant).toFixed(3);
             }

             if (ob.date !== null) {
              ob.date = this.ConvertStringToDate(ob.date);
             }

             if (ob.echeance !== null) {
            ob.echeance = this.ConvertStringToDate(ob.echeance);
           }
           if (ob.dat_regl !== null) {
            ob.dat_regl = this.ConvertStringToDate(ob.dat_regl );
           }
         }
       }



       });
       await this.banqueService.listeBanque()
       .toPromise()
       .then(data => {
         this.banques = data['_embedded'].banque;


       });
      }

}

onRowEditCancel(car: any, index: number) {
  this.disable = false;
  this.btnajut = true;
  this.appercu = true;
  this.btnNouvelleSaise = true;
    this.liste[index] = this.clonedfact[car.id];
    delete this.clonedfact[car.id];
    if (index > -1 && car.id === '#' + this.idAjout.toString()) {

      this.liste.splice(index, 1);
      this.rang = this.liste.length;
      if (this.rang === 0) {
         this.appercu = false;
      }
      for (let i = index; i < this.liste.length; i++) {
        this.liste[i].rang = i + 1;
      }
    }


}

async onClick() {
  if (this.clickaddnew ) {
    this.readonly = false;
  const el = await this.rowElement.find(r => r.nativeElement.getAttribute('id') === '#' + this.idAjout.toString() ) ;
  if (el !== undefined) {
    this.disable = true;

       await el.nativeElement.scrollIntoView({behavior: 'smooth', inline: 'start', block: 'start'});
       this.btnajut = false;
       this.appercu = false;
       this.btnNouvelleSaise = false;
       this.readonly1 = false;
       this.readonlyy = true;
       this.readonly = false;

     }this.clickaddnew = false;
   } else {

   }

}

newRow() {
  this.clickaddnew = true;
  this.readonly = false;
  this.readonlyy = false;
  let fact: any;
    fact = {
      id : '#' + this.idAjout.toString() ,
      numero : null,
      date : new Date(),
      net : null,
      operateur : this.codeFour,
      typef : null,
      sens : null,
      echeance : null,
      montant : null,
      devise : null,
      banque : null,
      regle : null ,
      op1 : null,
      recu : 'N',
      dat_regl : null
    } ;

  return fact ;


}

async supprimer(index: number) {
  this.wasInside = true;
  this.op.hide();
         await  this.confirmationService.confirm({
                    message: 'Voulez vous vraiment supprimer cette facture ?',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'Oui',
                    rejectLabel: 'Non',
                    accept: () => {
                      console.log('element id', this.liste[index].id);
                            const num =  this.liste[index].numero;
                      this.achat0Service.delete( this.liste[index].id)
                        .toPromise().then(data => {console.log('supprimer', data);

                        });

                        this.appercu = true;
                        this.btnNouvelleSaise = true;
                        if (index > -1) {

                          this.liste.splice(index, 1);
                          this.longliste = this.liste.length;
                          this.rang = this.liste.length;
                          for (let i = index; i < this.liste.length; i++) {
                            this.liste[i].rang = i + 1;
                          }
                        }

                        if (this.liste.length === 0 ) {
                          this.btnafficher = true;
                          this.appercu = false;

                        }
                        if (num !== null && num !== undefined) {   this.loginService
                        .procedureStockeModule(
                          localStorage.getItem('login'),
                          globals.selectedMenu,
                          'Supp ' + num
                        )
                        .subscribe((data) => {
                          console.log('procedure stock', data);
                        });
                      }
                    },
                    reject: () => {
                    }
                    });

}

async apercu() {
  let listeapercu = new Array();
  this.btnNouvelleSaise = true;
  const datef = this.datefin.toLocaleDateString('en-GB');
  const dated = this.datedebut.toLocaleDateString('en-GB');
 await this.achat0Service.getFactureFournisseurPeriod(this.codeFour, datef, dated)
  .toPromise()
  .then(async data => {
       listeapercu = data['_embedded'].reglementFours;
       console.log(this.liste);


      // si la liste est vide afficher un message
    if (this.liste.length === 0) {
          this.messageService.add({ key: 'k', severity: 'error', summary: 'Erreur',
        detail: 'Aucune facture pour cette période !!', sticky: true });
      } else {


            // gerer le document pdf pour visualiser les donnees avant l'impresssion
            // creer le document pdf
            const doc1 = new jspdf();

            doc1.setFontSize(14);
            doc1.setFontStyle('Arial');
              // recupérer les données de la sociéte
              await this.steService
                 .getSte()
                 .toPromise()
                .then(data => {
                      this.ste = data['_embedded'].ste;
                      this.societe = this.ste[0];
                     // console.log(this.societe);
              });
            doc1.text('Société  : ' + this.societe.societe, 9, 20);

            doc1.setFontSize(22);
            doc1.setFontStyle('Arial');
            doc1.setFontStyle('bold');
            doc1.setTextColor(0, 51, 153);
            doc1.text('Règlements des Fournisseurs', 50 , 32);

            const datef = this.datefin.toLocaleDateString('en-GB');
            const dated = this.datedebut.toLocaleDateString('en-GB');
            doc1.setFontSize(12);
            doc1.setFontStyle('Arial');
            doc1.setTextColor(48, 48, 48);
            doc1.text('Date de Début :  ' + dated , 9, 40);
            doc1.text('Date de Fin :       ' + datef , 80, 40);
            doc1.text('Code Fournisseur :  ' + this.codeFour , 9, 47);
            doc1.text('Raison Sociale :  ' + this.selectedFournisseur.deno , 80, 47);


              // entete du  tableau
              doc1.setFontSize(12);
              doc1.setFontStyle('bold');
              doc1.setLineWidth(0.25);
              doc1.line(9, 54, 205, 54);
              doc1.setFontSize(13);
              doc1.setFontStyle('bold');
              doc1.text('Date', 10, 61);
              doc1.text('Numéro', 40, 61);
              doc1.text('Mnt en Devise', 70, 61);
              doc1.text('Devise', 105, 61);
              doc1.text('Montant en DT', 135, 61);
              doc1.text('R', 182, 61);
              // creer la ligne
              doc1.setLineWidth(0.25);
              doc1.setFontStyle('bold');
              doc1.line(9, 65, 205, 66);


              let y = 73;
              let numPage = 1;
              doc1.setFontSize(10);
              doc1.setFontStyle('Arial');
              if (listeapercu.length > 0) {
              for (const bs of listeapercu ) {
               // console.log('fact ', bs);

                doc1.setFontSize(9);
                doc1.setFontStyle('Arial');
                doc1.text(bs.date, 10, y);
                doc1.text(bs.numero, 45, y);
                // console.log('montant');


                if (bs.net !== null) {
                  bs.net = Number(bs.net).toFixed(3);
                 }
                 if (bs.montant !== null) {
                  bs.montant = Number(bs.montant).toFixed(3);
                 }



                if (bs.montant === null ) {
                  bs.montant = '';
                }
                  doc1.text(bs.montant, 71, y);

                if (bs.devise === null ) {
                  bs.devise = '';
                }
                  doc1.text(bs.devise, 105, y);

              if (bs.net === null ) {
                bs.net = '';
                doc1.text(bs.net, 136, y);
              } else {
                doc1.text(bs.net, 135, y);
              }
              if (bs.regle === null ) {
                doc1.text('N', 182, y);
              } else {
                doc1.text(bs.regle, 182, y); }

                y = y + 7;
                // passer a une nouvelle page
                if (y > 277) {
                  doc1.line(10, y - 3, 200, y - 3, 'FD');
                  doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                  numPage++;
                  doc1.addPage();
                  // entete tableau
                  doc1.setFontStyle('bold');
                  doc1.line(9, 10, 205, 10);
                  doc1.setFontSize(13);
                  doc1.setFontStyle('bold');

                  doc1.text('Date', 10, 17);
                  doc1.text('Numéro', 40, 17);
                  doc1.text('Mnt en Devise', 70, 17);
                  doc1.text('Devise', 105, 17);
                  doc1.text('Montant en Dt', 135, 17);
                  doc1.text('R', 182, 17);
                  // creer la ligne
                  doc1.setFontStyle('bold');
                  doc1.line(9, 24, 205, 24);
                  y = 32;
                }
              }
            }
              doc1.line(10, 280, 200, 280, 'FD');
              doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
              window.open(doc1.output('bloburl'), '_blank');
             // this.ngOnInit();

      }
  });
                }

ConvertStringToDate(dateString) {
                  const formdate: string = dateString.replace('/', '-');
                  const formdat: string = formdate.replace('/', '-');
                  let dateR = '';
                  dateR =
                    String(formdat).substring(3, 5) +
                    '-' +
                    String(formdat).substring(0, 2) +
                    '-' +
                    String(formdat).substring(6, 10);
                    const convertDate = new Date(dateR);
                    return convertDate;
  }

nouvelleSaisie() {
  this.readonl = false;
  this.btnafficher = false;

  this.selectedBanque = null;

  this.visibleBtnAfficher = true;


  this.liste = new Array();
}

changeFournisseur() {
          if (this.selectedFournisseur !== null && this.selectedFournisseur !== undefined) {
              this.codeFour = this.selectedFournisseur.code;

          } else {
            this.codeFour = '';

            this.op.hide();
           // this.wasInside = false;
          }
}
public onSearchFournisseur(word: string, item: Fournisseur): boolean {
  return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}
public onSearchFournisseurParCode(word: string, item: Fournisseur): boolean {
  return item.code.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}

ngOnInit() {
   this.readonly1 = false;
  this.btnajut = false;
  this.lstavantadd = new Array();
  this.clickaddnew = false;
  this.readonly = true;

  this.disable = false;

      this.btnafficher = false;
      this.visibleBtnAfficher = true;
      this.datedebut.setDate(1) ;
      this.datedebut.setMonth(0);
      this.datedebut.setFullYear(2017);
      this.selectedBanque = null;
      this.selectedFournisseur = null;
      this.fournisseurService.findByOrderByDeno()
      .toPromise()
      .then(data => {
        this.fournisseurs = data['_embedded'].fournisseurs;
      });

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
    this.customAttributes = { class: 'customcss' };

  }


}

