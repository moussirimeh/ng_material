import { Component, OnInit , ViewChild, HostListener, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { Fournisseur } from '../services/fournisseur';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TransitService } from '../services/Transit.service';
import * as jspdf from 'jspdf';
import { ExcelService } from '../services/excel.service';
import { Transit } from '../services/Transit';
import { LoginService } from 'src/app/login/login.service';
import { OverlayPanel } from 'primeng/primeng';
import {ConfirmationService} from 'primeng/api';
import { Table } from 'primeng/table';
import { globals } from 'src/environments/environment';


@Component({
  selector: 'app-transit',
  templateUrl: './transit.component.html',
  styleUrls: ['./transit.component.scss'],
  providers: [ExcelService, ConfirmationService],
})
export class TransitComponent implements OnInit {
  @ViewChildren('row', { read: ElementRef }) rowElement: QueryList<ElementRef>;

  @ViewChild('dt')
  public table: Table;



  public customAttributes: Object;
  readonly = true;
  readonlynom = true;
  valideAjt = true;
  SelectedTransit: Transit;

  fournisseurs: any;

  tn: any;
  value1: boolean;
  value2: boolean;
  value3: boolean;
  value4: boolean;
  value5: boolean;
  value6: boolean;
  value7: boolean;


  transits = new Array();
  tab_transit: any;
  transitsTraitm: any;
  tab_transitTraitm: any;
  date = '';
  nouvId: string;
  blocked: boolean;
  wasInside: boolean;



  msg: string;
  @ViewChild('op')
  public op: OverlayPanel;
  affichAppercu: boolean;
  affichExcel: boolean;
  listestransit: any[];
  chargement: boolean;

  displayDialog: boolean;

  btnajut: boolean;
  longtransits: any;
  rang: any;
  readonlyNORD: boolean;

  // ajouuuuuuuuuuuuuuuuuuuuuuut
  nmOrdre: string;
  montantfact: number;
  montantproforma: number;
  dateReglm = new Date();
  dateSrt = new Date();
  dateRms = new Date();
  dateArv = new Date();
  dateFact = new Date();
  dateProf = new Date();
  dateEnv = new Date();
  observation: string;
  SelectedFournisseur: any;
  nmrCmd: any;
  readOnlyID: boolean;
  edittrans: any;
  idscrall: string;
  tr: any;
  constructor(
    private fournisseurService: FournisseurService,
    private config: NgSelectConfig,
    private loginService: LoginService,
    private transitService: TransitService,
    private confirmationService: ConfirmationService,
    private excelService: ExcelService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  onClick(valid) {
    console.log('id scrall on click ', valid);

    const el =  this.rowElement.find(r => r.nativeElement.getAttribute('id') === valid ) ;
    console.log('on click ellllllll', el);

    if (el !== undefined) {

          el.nativeElement.scrollIntoView({behavior: 'smooth', inline: 'start', block: 'start'});
    }
  }
  viderChamp(val) {
   val = null;
  }
  newRow() {
    this.tr = {
      id: '#',
      numOrdre: null,
      nomFrs: null,
      numCmd: null,
      dateEnv: null,
      mntProf: null,
      dateProf: null,
      mntFact: null,
      dateFact: null,
      dateArr: null,
      dateRem: null,
      dateSort: null,
      dateReg: null,
      observation: null
    };
    return this.tr ;

  }

changeFournisseur(obj) {
    let i = 0; let existe = false;
    while ( i < this.fournisseurs.length && existe === false ) {
        if (this.fournisseurs[i].deno === obj) {
          existe = true;
          this.SelectedFournisseur = this.fournisseurs[i];
          break;
        } else {
          i++;
        }
      }
    if (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined) {
     // this.codeBanque = this.selectedBanque.code;
    } else {
    //  this.codeBanque = '';
    }
      console.log('change fournisseur ', this.SelectedFournisseur);

   }



  onRowEditInit(val) {
    console.log('vaaaal init ', val);
    this.readOnlyID = false;
    this.readonlyNORD = true;
    this.displayDialog = true;
    this.nmOrdre = val.id;
    // this.SelectedFournisseur.deno = val.nomFrs;
    this.changeFournisseur(val.nomFrs);
    this.montantfact = val.mntFact;
    this.montantproforma = val.mntProf;
    this.dateReglm = val.dateReg;
    if (this.dateReglm  !== null && this.dateReglm  !== undefined ) {
      this.value7 = true;
      this.dateReglm = this.ConvertStringToDate(this.dateReglm);
      this.getVisibilityy(this.value7);
    } else {
      this.getVisibilityy(false);
    }

    this.dateSrt = val.dateSort;
    if (this.dateSrt !== null && this.dateSrt !== undefined ) {
      this.value6 = true;
      this.dateSrt = this.ConvertStringToDate(this.dateSrt);
      this.getVisibilityy(this.value6);
    } else {
      this.getVisibilityy(false);
    }


    this.dateRms = val.dateRem;
    if (this.dateRms !== null && this.dateRms !== undefined ) {
      this.value5 = true;
      this.dateRms = this.ConvertStringToDate(this.dateRms);
      this.getVisibilityy(this.value5);
    } else {
      this.getVisibilityy(false);
    }

    this.dateArv = val.dateArr;
    if (this.dateArv !== null && this.dateArv !== undefined ) {
      this.value4 = true;
      this.dateArv = this.ConvertStringToDate(this.dateArv);
      this.getVisibilityy(this.value4);
    } else {
      this.getVisibilityy(false);
    }

    this.dateFact = val.dateFact;
    if (this.dateFact !== null && this.dateFact !== undefined ) {
      this.value3 = true;
      this.dateFact = this.ConvertStringToDate(this.dateFact);
      this.getVisibilityy(this.value3);
    } else {
      this.getVisibilityy(false);
    }

    this.dateProf = val.dateProf;
    if (this.dateProf !== null && this.dateProf !== undefined ) {
      this.value2 = true;
      this.dateProf = this.ConvertStringToDate(this.dateProf);
      this.getVisibilityy(this.value2);
    } else {
      this.getVisibilityy(false);
    }

    this.dateEnv = val.dateEnv;
    if (this.dateEnv !== null && this.dateEnv !== undefined ) {
      this.value1 = true;
      this.dateEnv = this.ConvertStringToDate(this.dateEnv);
      this.getVisibilityy(this.value1);
    } else {
      this.getVisibilityy(false);
    }

    this.observation = val.observation;
    this.nmrCmd = val.numCmd;
    this.edittrans = val;
  }



   async save(e) {
    this.wasInside = true;
    this.op.hide();
    let transit: Transit;
    transit = new Transit();
    transit.id = this.nmOrdre;
    transit.numOrdre = null;
    transit.nomFrs = this.nmOrdre;
    transit.numCmd = this.nmrCmd;
    if (this.dateEnv !== null && this.dateEnv !== undefined ) {
      console.log('daaaaaaaaaaaaate', this.dateEnv);

      transit.dateEnv = this.dateEnv.toLocaleDateString('en-GB') ;
    }
    transit.mntFact = (Number(this.montantfact).toFixed(3)).toString();
    transit.mntProf = (Number(this.montantproforma).toFixed(3)).toString();
    if (this.dateProf !== null && this.dateProf !== undefined) {
      transit.dateProf = this.dateProf.toLocaleDateString('en-GB');
    }
    if (this.dateFact !== null && this.dateFact !== undefined) {
      transit.dateFact = this.dateFact.toLocaleDateString('en-GB');
    }
    if (this.dateArv !== null && this.dateArv !== undefined) {
      transit.dateArr = this.dateArv.toLocaleDateString('en-GB');
    }
    if (this.dateRms !== null && this.dateRms !== undefined) {
      transit.dateRem = this.dateRms.toLocaleDateString('en-GB');
    }
    if (this.dateSrt !== null && this.dateSrt !== undefined) {
      transit.dateSort = this.dateSrt.toLocaleDateString('en-GB');
    }
    if (this.dateReglm !== null && this.dateReglm !== undefined) {
      transit.dateReg = this.dateReglm.toLocaleDateString('en-GB');
    }
    transit.observation = this.observation;
    console.log('transit save ', transit);
    if (
      this.SelectedFournisseur === null ||
      this.SelectedFournisseur === undefined
    ) {
      this.msg = 'Fournisseur est obligatoire !!';
      this.op.show(e, document.getElementById('frs'));
    } else {
      transit.nomFrs = this.SelectedFournisseur.deno;
      console.log('selected four ', this.SelectedFournisseur);
      const trans = [...this.transits];
      if (transit.id === null) {
        this.blocked = true;
       await   this.transitService.createTableTransit(transit)
          .toPromise().then(data => {
            console.log('create data ', data);
             transit.id = data.id;
          });
          if ( this.transits.length > 0) {
            this.affichAppercu = true;
            this.affichExcel = true;
          }
            if (transit) {
              this.idscrall = null;
           //  console.log('transit ', transit );
                this.longtransits = this.transits.length;
                this.idscrall = this.tr.id;
               // console.log('id scralllllll ', this.idscrall);
                this.onClick(this.idscrall);
                this.transits[this.transits.length - 1] = transit;
                this.tr = null;
                this.blocked = false;
           await   this.loginService.procedureStockeModule(
            localStorage.getItem('login'),
            globals.selectedMenu,
            transit.id
          ).subscribe((data) => {
            console.log('procedure stock', data);
          });

            } else {
                this.transits = trans;
            }

          this.SelectedTransit = transit;
          this.initadd();

          this.displayDialog = false;
          transit = null;
      } else {
        this.blocked = true;
          await   this.transitService.updateTableTransit(transit)
           .toPromise().then(data => {
           console.log('update data ', data);

        });

        trans[this.transits.indexOf(this.edittrans)] = transit;
        this.transits = trans;
           const codeUtil = localStorage.getItem('login');
           const moduteName = globals.selectedMenu;
           const paramMouchar =
             'A ' + transit.id + ' MNT ' + transit.mntFact + ' F ' + transit.nomFrs;
           this.loginService
             .procedureStockeModule(codeUtil, moduteName, paramMouchar)
             .toPromise()
             .then((data) => {
               console.log(data);
               this.blocked = false;
             });




            // this.table.initRowEdit(transit);
           this.initadd();
          this.blocked = false;
          this.displayDialog = false;
          transit = null;
      }

    }

  }

getVisibilityy(val) {
    if (!val) {
      return 'hidden';
    }

}
initadd() {
  this.readOnlyID = true;
  this.nmOrdre = null;
  this.SelectedFournisseur = null;
  this.montantfact = 0.000;
  this.montantproforma = 0.000;
  this.dateReglm = null;
  this.dateSrt = null;
  this.dateRms = null;
  this.dateArv = null;
  this.dateFact = null;
  this.dateProf = null;
  this.dateEnv = null;
  this.observation = null;
  this.nmrCmd = null;
}
  add() {
    this.displayDialog = true;
    this.initadd();
  }
  onRowEditCancel() {
    this.value1 = false;
    this.value2 = false;
    this.value3 = false;
    this.value4 = false;
    this.value5 = false;
    this.value6 = false;
    this.value7 = false;
    if ( this.transits[this.transits.length - 1].id === '#') {
      this.transits.splice(this.transits.length - 1, 1);
    }
    if ( this.transits.length === 0) {
      this.affichAppercu = false;
      this.affichExcel = false;
    }

    this.initadd();
    this.displayDialog = false;

  }


  async supprimer(index: number) {
    this.wasInside = true;
    this.op.hide();
           await  this.confirmationService.confirm({
                      message: 'Voulez vous vraiment supprimer cette ligne ?',
                      header: 'Confirmation',
                      icon: 'pi pi-exclamation-triangle',
                      acceptLabel: 'Oui',
                      rejectLabel: 'Non',
                      accept: () => {
                        console.log('element id', this.transits[index].id);
                        const idd = this.transits[index].id;
                        console.log('iddd supp ', idd);

                         this.transitService.deleteTableTransit(this.transits[index].id)
                        .toPromise().then(data => {console.log('supprimer', data);
                      });

                          this.loginService
                          .procedureStockeModule(
                            localStorage.getItem('login'),
                            globals.selectedMenu,
                            'Supp ' + this.transits[index].id
                          )
                          .subscribe((data) => {
                            console.log('procedure stock', data);
                          });

                          if (index > -1) {

                            this.transits.splice(index, 1);
                            this.longtransits = this.transits.length;
                            this.rang = this.transits.length;
                            for (let i = index; i < this.transits.length; i++) {
                              this.transits[i].rang = i + 1;
                            }
                          }

                          if ( this.transits.length === 0) {
                            this.affichAppercu = false;
                            this.affichExcel = false;
                          }

                      },
                      reject: () => {
                      }
                      });

  }
@HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }

  getVisibilityApercu() {
    if (this.affichAppercu === false) {
      return 'hidden';
    }
  }
  getVisibilityExcel() {
    if (this.affichExcel === false) {
      return 'hidden';
    }
  }



 async ngOnInit() {
    this.readOnlyID = true;
    this.btnajut = true;
    this.listestransit = new Array();
    this.affichAppercu = true;
    this.affichExcel = true;
    this.blocked = false;


    this.value1 = false;
    this.value2 = false;
    this.value3 = false;
    this.value4 = false;
    this.value5 = false;
    this.value6 = false;
    this.value7 = false;
    this.customAttributes = { class: 'customcss' };

    /// charger les fournisseurs
    this.fournisseurService
      .getFournisseurListByOrderByDeno()
      .toPromise()
      .then((data) => {
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
        'Samedi',
      ],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
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
        'Decembre',
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
        'Dec',
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy',
    };
    /// charger les transits
   await this.transitService
      .getTransit()
      .toPromise()
      .then((data) => {
        console.log(data);
        this.transits = data['_embedded'].tableTransit;
        this.transitsTraitm = data['_embedded'].tableTransit;
      });
      if ( this.transits.length === 0) {
        this.affichAppercu = false;
        this.affichExcel = false;
      }
      console.log('table ', this.transits);

  }


  async Appercu() {
    const doc1 = new jspdf('landscape');
    doc1.setFontSize(18);
    doc1.setFontStyle('bold');
    doc1.setFontStyle('Arial');
    this.date = new Date().toLocaleDateString('en-GB');
    doc1.text('ETAT DE TRANSIT EDITE LE   : ' + this.date, 75, 20);
    doc1.setFontSize(10);
    doc1.line(8, 25, 290, 25);

    // ligne vertical
    doc1.line(8, 25, 8, 200);
    doc1.line(290, 25, 290, 200);

    doc1.setFontSize(9);
    doc1.text('Num_ord', 9, 28);
    doc1.text('Nom Fournisseur', 25, 28);
    doc1.text('Nm_cmd', 80, 28);
    doc1.text('Dat_Env', 93, 28);
    doc1.text('Mnt_Pr', 108, 28);
    doc1.text('Dat_Pr', 120, 28);
    doc1.text('Mnt_Fac', 133, 28);
    doc1.text('Dat_Fac', 148, 28);
    doc1.text('Dat_Ar', 161, 28);
    doc1.text('Dat_Rem', 174, 28);
    doc1.text('Dat_Srt', 188, 28);
    doc1.text('Dat_Reg', 201, 28);
    doc1.text('OBS', 218, 28);
    doc1.setFontSize(10);
    doc1.line(8, 30, 290, 30);
    let y = 35;
    let numPage = 1;

    if (this.transits === null || this.transits  === undefined) {
    } else {
      for (this.tab_transitTraitm of this.transits ) {
        // console.log('object ', this.tab_transitTraitm);

        doc1.setFontSize(7);
        doc1.setFontStyle('Arial');
        if (this.tab_transitTraitm.dateEnv !== null  && this.tab_transitTraitm.dateEnv !== undefined ) {
          this.tab_transitTraitm.dateEnv = this.tab_transitTraitm.dateEnv;

        } else {
          this.tab_transitTraitm.dateEnv = '';
        }
        if (this.tab_transitTraitm.dateProf !== null && this.tab_transitTraitm.dateProf !== undefined ) {
          this.tab_transitTraitm.dateProf = this.tab_transitTraitm.dateProf;
        } else {
          this.tab_transitTraitm.dateProf = '';
        }
        if (this.tab_transitTraitm.dateFact !== null && this.tab_transitTraitm.dateFact !== undefined   ) {
          this.tab_transitTraitm.dateFact = this.tab_transitTraitm.dateFact;
        } else {
          this.tab_transitTraitm.dateFact = '';
        }
        if (this.tab_transitTraitm.dateArr !== null  && this.tab_transitTraitm.dateArr !== undefined ) {
          this.tab_transitTraitm.dateArr = this.tab_transitTraitm.dateArr;
        } else {
          this.tab_transitTraitm.dateArr = '';
        }

        if (this.tab_transitTraitm.dateRem !== null &&  this.tab_transitTraitm.dateRem !== undefined ) {
          this.tab_transitTraitm.dateRem = this.tab_transitTraitm.dateRem;
        } else {
          this.tab_transitTraitm.dateRem = '';
        }
        if (this.tab_transitTraitm.dateSort !== null && this.tab_transitTraitm.dateSort !== undefined ) {
          this.tab_transitTraitm.dateSort = this.tab_transitTraitm.dateSort;
        } else {
          this.tab_transitTraitm.dateSort = '';
        }
        if (this.tab_transitTraitm.dateReg !== null && this.tab_transitTraitm.dateReg !== undefined  ) {
          this.tab_transitTraitm.dateReg = this.tab_transitTraitm.dateReg;
        } else {
          this.tab_transitTraitm.dateReg = '';
        }
        if (
          this.tab_transitTraitm.numOrdre === null ||
          String(this.tab_transitTraitm.numOrdre) === ''
        ) {
          this.tab_transitTraitm.numOrdre = '';
        }
        if (
          this.tab_transitTraitm.nomFrs === null ||
          String(this.tab_transitTraitm.nomFrs) === ''
        ) {
          this.tab_transitTraitm.nomFrs = '';
        }
        if (
          this.tab_transitTraitm.numCmd === null ||
          String(this.tab_transitTraitm.numCmd) === ''
        ) {
          this.tab_transitTraitm.numCmd = '';
        }
        if (
          this.tab_transitTraitm.mntProf === null ||
          String(this.tab_transitTraitm.mntProf) === ''
        ) {
          this.tab_transitTraitm.mntProf = '';
        } else {
          this.tab_transitTraitm.mntProf = String(
            parseFloat(this.tab_transitTraitm.mntProf).toFixed(3)
          );
        }
        if (
          this.tab_transitTraitm.mntFact === null ||
          String(this.tab_transitTraitm.mntFact) === ''
        ) {
          this.tab_transitTraitm.mntFact = '';
        } else {
          this.tab_transitTraitm.mntFact = String(
            parseFloat(this.tab_transitTraitm.mntFact).toFixed(3)
          );
        }
        if (
          this.tab_transitTraitm.observation === null ||
          String(this.tab_transitTraitm.observation) === ''
        ) {
          this.tab_transitTraitm.observation = '';
        }

        doc1.text(String(this.tab_transitTraitm.id), 9, y);
        doc1.text(String(this.tab_transitTraitm.nomFrs), 24, y);
        doc1.text(String(this.tab_transitTraitm.numCmd), 80, y);
        doc1.text(String(this.tab_transitTraitm.dateEnv), 93, y);
        doc1.text(String(this.tab_transitTraitm.mntProf), 108, y);
        doc1.text(String(this.tab_transitTraitm.dateProf), 120, y);
        doc1.text(String(this.tab_transitTraitm.mntFact), 133, y);
        doc1.text(String(this.tab_transitTraitm.dateFact), 148, y);
        doc1.text(String(this.tab_transitTraitm.dateArr), 161, y);
        doc1.text(String(this.tab_transitTraitm.dateRem), 174, y);
        doc1.text(String(this.tab_transitTraitm.dateSort), 188, y);
        doc1.text(String(this.tab_transitTraitm.dateReg), 201, y);
        doc1.text(String(this.tab_transitTraitm.observation), 218, y);
        y = y + 7;
        // passer a une nouvelle page

        if (y > 200) {
          doc1.setFontSize(10);
          doc1.line(8, 200, 290, 200);
          doc1.text(String(numPage), 135, 204);

          numPage++;
          doc1.addPage();
          // entete tableau

          doc1.setFontSize(10);

          // ligne vertical
          doc1.line(8, 12, 8, 200);
          doc1.line(290, 12, 290, 200);

          doc1.line(8, 12, 290, 12);

          doc1.setFontSize(9);
          doc1.text('Num_ord', 9, 16);
          doc1.text('Nom Fournisseur', 25, 16);
          doc1.text('Nm_cmd', 80, 16);
          doc1.text('Dat_Env', 93, 16);
          doc1.text('Mnt_Pr', 108, 16);
          doc1.text('Dat_Pr', 120, 16);
          doc1.text('Mnt_Fac', 133, 16);
          doc1.text('Dat_Fac', 148, 16);
          doc1.text('Dat_Ar', 161, 16);
          doc1.text('Dat_Rem', 174, 16);
          doc1.text('Dat_Srt', 188, 16);
          doc1.text('Dat_Reg', 201, 16);
          doc1.text('OBS', 218, 16);
          doc1.setFontSize(10);
          doc1.line(8, 18, 290, 18);
          y = 23;
        }
      }

      doc1.setFontSize(10);
      doc1.line(8, 200, 290, 200);
      doc1.text(String(numPage), 135, 204);
    }
    window.open(doc1.output('bloburl'), '_blank');
  }
  Excel(): void {
    try {
      if (this.transitsTraitm === undefined) {
      } else {
        const exportExcel = this.transitsTraitm.map((obj) => {
          return {
            Num_ord: obj.id,
            nomFrs: obj.nomFrs,
            numCmd: obj.numCmd,
            dateEnv: obj.dateEnv,
            mntProf: obj.mntProf,
            dateProf: obj.dateProf,
            Mnt_Fac: obj.Mnt_Fac,
            dateFact: obj.dateFact,
            dateArr: obj.dateArr,
            dateRem: obj.dateRem,
            dateSort: obj.dateSort,
            dateReg: obj.dateReg,
            OBS: obj.observation,
          };
        });
        this.excelService.exportAsExcelFile(exportExcel, 'Liste des transits');
      }
    } catch {}
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

  // methode rechercher les fournisseurs en front end
  public onSearchFournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

}
