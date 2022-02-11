import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { TMoucharService } from '../services/tMouchar.service';
import { TMouchar } from '../services/tMouchar';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { LoginService } from 'src/app/login/login.service';
import { ExcelService } from '../services/excel.service';
import { noUndefined } from '@angular/compiler/src/util';
import { Login } from 'src/app/login/login';

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
  selector: 'app-acces-securite',
  templateUrl: './acces-securite.component.html',
  styleUrls: ['./acces-securite.component.scss'],
  providers: [  ExcelService]
})
export class AccesSecuriteComponent implements OnInit {

  public customAttributes: Object;
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  hidden: boolean;
  utilisateur: any;
  lenght = 0;
  btnNouvelleSaisie: boolean;
  datedeb = new Date();
  datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  minDate = new Date (2010 , 12, 1 );
  datefin = new Date ();
  tn: any;
  parametre = '';
  operation = '';
  validee: boolean;
  readonlynom = true;
  readonly: boolean;
  acces: TMouchar[];
  trie = 'date';
  from = '';
  to = '';
  tab_acces: any;
  cas2 = false ;
  cas3 = false ;
  cas4 = false ;
  listeUsers = new Array();
  cas1 = true ;
  wasInside: boolean ;
  valide = false ;
  selectedUser: any;
  constructor( private tMoucharService: TMoucharService,
               private config: NgSelectConfig,
               private  loginService: LoginService,
               private excelService: ExcelService
               ) {
                this.config.notFoundText = 'Aucun élément trouvé';
                this.config.clearAllText = 'Supprimer tous ';
               }


async excel(e) {

  this.wasInside = true;
  this.acces = new Array();


    this.ovo.hide();
    this.cas1 = false;
    this.cas2 = false;
    this.cas3 = false;
    this.cas4 = false;
  //  console.log(this.trie);
    this.from = this.datedebut.toLocaleDateString('en-GB') + ' 00:00:00.000';
    this.to = this.datefin.toLocaleDateString('en-GB') + ' 23:59:59.999';
    if (this.utilisateur === null) {
      this.utilisateur = '';
    }
    if ( this.operation === null) {
      this.operation = '';
    }
    if ( this.parametre === null) {
      this.parametre = '';
    }


    console.log('user  : ', this.utilisateur);
    console.log('operation  : ', this.operation );
    console.log('parametre  : ', this.parametre );
    console.log('from  : ', this.from );
    console.log('to  : ', this.to );
      await this.tMoucharService.rechercheTMoucharByDate(this.utilisateur, this.operation , this.parametre,
                  this.from, this.to).toPromise().then(
                (data) => {
                  this.acces = data['_embedded'].tmouchar;
                  this.lenght = this.acces.length;
                    // console.log(this.acces);
                }
              );
              for (this.tab_acces of this.acces) {
                    this.tab_acces.date = (this.tab_acces.mDateTemp).substring(0, 19);
                }

                if (this.lenght === 0) {
                  this.ms = 'Aucun accès !';
                  this.valide = false ;
                  this.ovo.show(e, document.getElementById('affiche'));
                  this.hidden = false;
                } else {
                  this.valide = false ;
                  this.readonly = false;
                  this.btnNouvelleSaisie = false;
                  this.hidden = false;
                  this.validee = true;
                }

                        try {
                          if (this.acces === undefined) {
                          } else {
                            const exportExcel = this.acces.map(obj => {
                              return {

                                  'Utilisateur': obj.mCodeUt,
                                 'Date et temps': obj.mDateTemp,
                                 'Opération': obj.mCodeOp,
                                 'parametre': obj.mParam

                              };
                            });
                            this.excelService.exportAsExcelFile(
                              exportExcel,
                              ' acces securité : ' + new Date().toLocaleDateString('en-GB')

                            );
                          }
                        } catch {
                          console.log(' methode genererExcel');
                        }

            }








 async chargerUsers() {
   if (this.listeUsers.length === 0 ) {
     await this.loginService.getUserByCodeUtil('')
       .toPromise()
       .then(data => {
         this.listeUsers = data['_embedded'].users;
         console.log('liste users', this.listeUsers  );

       });
   }
 }
 init() {
   this.selectedUser = null;
   this.utilisateur = '';
   this.parametre = null;
   this.operation = null;
   this.datedeb = new Date();
   this.datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
   this.acces = new Array();

 }
changeUser() {
   if (this.selectedUser === null || this.selectedUser === undefined ) {
         this.utilisateur = '';
   } else {
    this.utilisateur = this.selectedUser.codeUtil;
   }
 }

 public onSearchUser(word: string, item: User): boolean {
    return item.nPUtil.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}

  ngOnInit() {
    this.hidden = false;
  this.btnNouvelleSaisie = false;
    this.validee = true;
    this.readonly = false;
    // calendrier en francais
    this.acces = new Array();
    this.utilisateur = '';
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
@HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ovo.hide();
    }
    this.wasInside = false;

  }

chageTrieUser() {
  console.log('utlst', this.trie + 'utlst');

  if (this.trie === 'utlst') {
    this.acces = this.acces.sort(function(a, b) {
      return a.mCodeUt > b.mCodeUt ? 1 : a.mCodeUt < b.mCodeUt ? -1 : 0;
    });
    if (this.grid !== undefined) {
      this.grid.refresh();
    }
  }

 }
chageTrieDate() {
  console.log('date', this.trie + 'date');

  if  ( this.trie === 'date') {
    console.log('liste avant trie', this.acces);

    this.acces = this.acces.sort(function(a, b) {
      return a.mDateTemp > b.mDateTemp ? 1 : a.mDateTemp < b.mDateTemp ? -1 : 0;
    });
    if (this.grid !== undefined) {
      this.grid.refresh();
    }
  }

}

chageTrieOpert() {

  if (this.trie === 'opert') {
    this.acces = this.acces.sort(function(a, b) {
      return a.mCodeOp > b.mCodeOp ? 1 : a.mCodeOp < b.mCodeOp ? -1 : 0;
    });
  }
  if (this.grid !== undefined) {
    this.grid.refresh();
  }


}
chageTrieParam() {
  console.log('param', this.trie + 'param');
  if  (this.trie === 'param') {
    this.acces = this.acces.sort(function(a, b) {
      return a.mParam > b.mParam ? 1 : a.mParam < b.mParam ? -1 : 0;
    });
  }
  if (this.grid !== undefined) {
    this.grid.refresh();
  }
}

NouvelleSaisie(e) {
 this.readonly = false;
 this.btnNouvelleSaisie = false;
 this.valide = false;
 this.validee = true;
 this.hidden = false;

}

async Afficher(e) {
  this.wasInside = true;
  this.acces = new Array();


    this.ovo.hide();
    this.cas1 = false;
    this.cas2 = false;
    this.cas3 = false;
    this.cas4 = false;
  //  console.log(this.trie);
    this.from = this.datedebut.toLocaleDateString('en-GB') + ' 00:00:00.000';
    this.to = this.datefin.toLocaleDateString('en-GB') + ' 23:59:59.999';
    if (this.utilisateur === null) {
      this.utilisateur = '';
    }
    if ( this.operation === null) {
      this.operation = '';
    }
    if ( this.parametre === null) {
      this.parametre = '';
    }


    if ((this.utilisateur === '' ) && (this.operation === ''
     ) && (this.parametre === '' )) {
          this.valide = false ;
          this.ms = 'Veuillez donner un utilisateur ou une opération ou  un paramètre !';
          this.ovo.show(e, document.getElementById('affiche'));
  } else {
    console.log('user  : ', this.utilisateur);
    console.log('operation  : ', this.operation );
    console.log('parametre  : ', this.parametre );
    console.log('from  : ', this.from );
    console.log('to  : ', this.to );
      await this.tMoucharService.rechercheTMoucharByDate(this.utilisateur, this.operation , this.parametre,
                  this.from, this.to).toPromise().then(
                (data) => {
                  this.acces = data['_embedded'].tmouchar;
                  this.lenght = this.acces.length;
                    // console.log(this.acces);
                }
              );
              for (this.tab_acces of this.acces) {
                    this.tab_acces.date = (this.tab_acces.mDateTemp).substring(0, 19);
                }

                if (this.lenght === 0) {
                  this.ms = 'Aucun accès !';
                  this.valide = false ;
                  this.ovo.show(e, document.getElementById('affiche'));
                  this.hidden = false;
                } else {
                  console.log('leeeeeeeeeeength  ', this.lenght);
                  if (this.lenght > 1500) {


                    this.ms = 'veuillez raffiner les critères de recherche  !';
                    this.valide = false ;
                    this.ovo.show(e, document.getElementById('affiche'));
                    this.hidden = false;
                  } else {
                    this.valide = true ;
                    this.readonly = true;
                    this.btnNouvelleSaisie = true;
                    this.hidden = true;
                    this.validee = false;
                  }

                }

  }



  }
  rowSelected() {
    this.readonlynom = true;
    this.readonly = true;

    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
     // this.SelectedAction = selected;

    }
  }

}
export class User {
  id: string;
  login: string;
  pwd: string;
  nPUtil: string;

}
