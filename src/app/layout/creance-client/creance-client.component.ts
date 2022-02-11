import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/overlaypanel';
import { NgSelectConfig } from '@ng-select/ng-select';
import { GroupeService } from '../services/groupe.service';
import { ZoneService } from '../services/zone.service';
import { RepresanService } from '../services/represan.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { RecouvService } from '../services/recouv.service';
import { BrouService } from '../services/brou.service';
import * as jspdf from 'jspdf';
import { ExcelService } from '../services/excel.service';
import { BrouContService } from '../services/brouCont.service';
import { ConsultationMissionRecouvrementComponent } from '../consultation-mission-recouvrement/consultation-mission-recouvrement.component';
import { RowSelectEventArgs } from '@syncfusion/ej2-grids';
import {
  GridComponent,
  SearchSettingsModel,
  ToolbarService,
  ResizeService,
} from '@syncfusion/ej2-angular-grids';
import { globals } from 'src/environments/environment';
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
  selector: 'app-creance-client',
  templateUrl: './creance-client.component.html',
  styleUrls: ['./creance-client.component.scss'],
  providers: [ExcelService]
})
export class CreanceClientComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('op')
  public op: OverlayPanel;
  @ViewChild(ConsultationMissionRecouvrementComponent) ConsultMissionsRecouv;

  msg = '';
  wasInside: boolean;
  tn: any;
  datefin: Date = new Date();
  readonly: boolean;

  public sortOptions: object;
hiddenBtnMissionrecouv  = true;
  typologieItems = [
                    {id: '', deno: 'Tout'},
                    {id: 'N', deno: 'N'},
                    {id: 'M', deno: 'M'},
                    {id: 'S', deno: 'S'},
                    {id: 'C', deno: 'C'},
                    {id: 'P', deno: 'P'},
                    {id: 'I', deno: 'I'}];
selectedTypo;

modRegItems = [
  {id: 0, deno: 'Tout'},
  {id: 1, deno: 'Virement-chèque'},
  {id: 2, deno: 'Traite'}
        ];
selectedModReg;

typeRCItems = [
  {id: 'T', deno: 'Tout'},
  {id: 'R', deno: 'Revendeur'},
  {id: 'C', deno: 'Consommateur'}
        ];
  selectedtype;

  vendeurs = [];
  selectedVendeur: any = null;
  zones = [];
  selectedZone: any = null;

  representants = [];
  selectedRepresentant: any = null;
  recouvs;
  selectedRecouv: any = null;
  groupes = [];
  selectedGroupe: any = null;
  btnafficher: boolean;
  liste = new Array();

  date;
  recouv;
  typo;
  zone;
  vend;
  groupe;
  repres;
  type;
  mode;
  tutoSoldes: any;
  tutoR30s: string;
  tutoR60s: string;
  tutoR90s: string;
  tutoR91s: string;
  imps: string;
  totRetard: string;
  societe = '';
  nbClient: number;
  module: string;
  showConfirm: boolean;
  showConsultMissions: boolean;
  selectedClient: any;

  constructor(
    private zoneService: ZoneService,
    private represanService: RepresanService,
    private groupeService: GroupeService,
    private vendeur1Service: Vendeur1Service,
    private recouvService: RecouvService,
    private brouService: BrouService,
    private brouContService: BrouContService,
    private config: NgSelectConfig,

    private excelService: ExcelService
    ) {
      this.config.notFoundText = 'aucun élément trouvé';
      this.config.clearAllText = 'Supprimer tous';
    }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      if (this.op !== undefined && this.op !== null ) {
        this.op.hide();
      }

    }
    this.wasInside = false;
  }
  annulerSelection() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
    this.hiddenBtnMissionrecouv  = true;
  }

  async showMissionsRecouv(e) {
    console.log( 'selected client code ', this.selectedClient.id);

    this.ConsultMissionsRecouv.selectedClient = this.selectedClient;
    this.ConsultMissionsRecouv.codeClient = this.selectedClient.id;
    await this.ConsultMissionsRecouv.chercherClientParCode(e);
    await this.ConsultMissionsRecouv.afficher(e);
    this.ConsultMissionsRecouv.hideNvlSaisieButton = true;
    this.showConfirm = false;
    this.showConsultMissions = true;
  }


async  ngOnInit() {
  this.sortOptions = { columns: [{ field: 'solde', direction: 'Descending' }] };
  this.module = globals.selectedMenu;
  this.date = new Date().toLocaleDateString('en-GB');
  this.recouv = '';
  this.typo = '';
  this.zone = '';
  this.vend = '';
  this.groupe = '';
  this.repres = '';
  this.type = 'T';
  this. mode = 0;
this.selectedtype = this.typeRCItems[0];
this.selectedTypo = this.typologieItems[0];
this.selectedModReg = this.modRegItems[0];
  this.tutoSoldes = '0.000';
  this.tutoR30s = '0.000';
  this.tutoR60s = '0.000';
  this.tutoR90s = '0.000';
  this.tutoR91s = '0.000';
  this.imps = '0.000';
  this.totRetard = '0.000';



    this.btnafficher = true;
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

    await this.zoneService
    .getZonesList()
    .toPromise()
    .then(data => {
      this.zones = data['_embedded'].zones;
    })
    .catch(data => {
      console.log('error reload data zones');
    })
    .finally(() => {
      // this.grid.refresh();
    });


    await this.vendeur1Service
    .getVendeur1sList()
    .toPromise()
    .then(data => {
      this.vendeurs = data['_embedded'].vendeur1;
    })
    .catch(data => {
      console.log('error reload data vendeurs');
    })
    .finally(() => {
      // this.grid.refresh();
    });
    await this.represanService
    .getRepresansList()
    .toPromise()
    .then(data => {
      this.representants = data['_embedded'].represans;

    })
    .catch(data => {
      console.log('error reload data representants');
    })
    .finally(() => {
      // this.grid.refresh();
    });

    await this.groupeService
    .getGroupesList()
    .toPromise()
    .then(data => {
      this.groupes  = data['_embedded'].groupes;

    })
    .catch(data => {
      console.log('error reload data groupes');
    })
    .finally(() => {
      // this.grid.refresh();
    });
    await this.recouvService
    .getRecouvsList()
    .toPromise()
    .then((data) => {
      this.recouvs = data['_embedded'].recouvs;
     // this.recouvs.unshift({ id: '', code: null, deno: '' });
    })
    .catch(data => {
      console.log('error reload data recouvreur');
    })
    .finally(() => {
      // this.grid.refresh();
    });



  }

  nouvelSaisie() {
    this.readonly = false;
    this.btnafficher = true;
  }

  rowSelected1(args: RowSelectEventArgs) {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedClient = selected;
      console.log( 'selected client ', this.selectedClient);

      this.hiddenBtnMissionrecouv  = false;
      // this.selectedstkmrq.code = this.selectedstock.code;
    }
  }

  async chargerCreances() {
    this.liste = new Array();
    if (this.datefin !== null && this.datefin !== undefined ) {
      this.date = this.datefin.toLocaleDateString('en-GB');
    } else {
      this.date = new Date().toLocaleDateString('en-GB');
    }

    if (this.selectedRecouv !== null && this.selectedRecouv !== undefined ) {
      console.log('recouvreeeeeur', this.selectedRecouv);

       this.recouv = this.selectedRecouv.code;
    } else {
      this.recouv = '';
    }


    if (this.selectedTypo !== null && this.selectedTypo !== undefined ) {
      console.log('Typooooo', this.selectedTypo);

       this.typo = this.selectedTypo.id;
    } else {
      this.typo = '';
    }

    if (this.selectedZone !== null && this.selectedZone !== undefined ) {
      console.log('Zoooon', this.selectedZone);

       this.zone = this.selectedZone.code;
    } else {
      this.zone = '';
    }

    if (this.selectedVendeur !== null && this.selectedVendeur !== undefined ) {
      console.log('Vendeeeeeeeeur', this.selectedVendeur);

      this.vend = this.selectedVendeur.code;
    } else {
      this.vend = '';
    }


    if (this.selectedGroupe !== null && this.selectedGroupe !== undefined ) {
      console.log('Grouuupe', this.selectedGroupe);

      this.groupe = this.selectedGroupe.code;
    } else {
      this.groupe = '';
    }

    if (this.selectedRepresentant !== null && this.selectedRepresentant !== undefined ) {
      console.log('Representant ', this.selectedRepresentant);

      this.repres  = this.selectedRepresentant.code;
    } else {
      this.repres = '';
    }

    if (this.selectedtype !== null && this.selectedtype !== undefined ) {
      console.log('Type ', this.selectedtype);

      this.type  = this.selectedtype.id;
    } else {
      this.type = 'T';
    }

    if (this.selectedModReg !== null && this.selectedModReg !== undefined ) {
      console.log('Mode ', this.selectedModReg);

      this.mode  = this.selectedModReg.id;
    } else {
      this. mode = 0;
    }

    if (this.module === 'Creance Client Cont') {
      // getCreanceClientCont
      // tslint:disable-next-line:max-line-length
      await this.brouContService.getCreanceClientCont(this.date, this.zone, this.typo , this.type, this.recouv, this.groupe, this.mode, this.vend, this.repres)
      .toPromise()
      .then(data => {
        console.log('data ', data);
        this.liste = data['_embedded'].creancesClients;
      });
    } else {

    // tslint:disable-next-line:max-line-length
    await this.brouService.getCreanceClient(this.date, this.zone, this.typo , this.type, this.recouv, this.groupe, this.mode, this.vend, this.repres)
    .toPromise()
    .then(data => {
      console.log('data ', data);
      this.liste = data['_embedded'].creancesClients;
    });
    }
  }

 async  afficher(e) {
   this.wasInside = true;
  // this.op.hide();
  //  this.btnafficher = false;

await this.chargerCreances();
if (this.liste.length > 0) {
  this.nbClient = this.liste.length;
  this.btnafficher = false;
  this.op.hide();
  this.readonly = true;
  let tutoSolde = 0;
  let tutoR30 = 0;
  let tutoR60 = 0;
  let tutoR90 = 0;
  let tutoR91 = 0;
  let tutoImp = 0;
  console.log('listeeeeeeeee, ', this.liste);
  let montant_c = 0;
  for (const ob of this.liste) {
    montant_c = Number(ob.montantC);
    ob.r91 = Number(ob.r91) - montant_c ;
    if (ob.r91 < 0) {
      montant_c = -ob.r91;
      ob.r91 = 0;
    } else {
      montant_c = 0;
    }
    ob.r90 = Number(ob.r90) -  montant_c;
    if (ob.r90 < 0) {
      montant_c = -ob.r90;
      ob.r90 = 0;
    } else {
      montant_c = 0;
    }
    ob.r60 = Number(ob.r60) -  montant_c;
    if (ob.r60 < 0) {
      montant_c = -ob.r60;
      ob.r60 = 0;
    } else {
      montant_c = 0;
    }

    ob.r30 = Number(ob.r30) -  montant_c;
    if (ob.r30 < 0) {
      montant_c = -ob.r30;
      ob.r30 = 0;
    } else {
      montant_c = 0;
    }
    ob.solde = Number(ob.solde);

    ob.imp = Number(ob.imp) - montant_c;
    if (ob.imp < 0) {
      ob.imp = 0;
    }

    tutoSolde = tutoSolde +  ob.solde;
    tutoR30 = tutoR30 + ob.r30;
    tutoR60 = tutoR60 + ob.r60;
    tutoR90 = tutoR90 + ob.r90;
    tutoR91 = tutoR91 + ob.r91;
    tutoImp = tutoImp + ob.imp;

  }
  console.log('listeeeeeeeeeeeeeee1, ', this.liste);
  this.tutoSoldes = Number(tutoSolde).toFixed(3);
  this.tutoR30s = Number(tutoR30).toFixed(3);
  this.tutoR60s = Number(tutoR60).toFixed(3);
  this.tutoR90s = Number(tutoR90).toFixed(3);
  this.tutoR91s = Number(tutoR91).toFixed(3);
  this.imps = Number(tutoImp).toFixed(3);
  const tot =  tutoR30 + tutoR60 + tutoR90 + tutoR91 + tutoImp;
  this.totRetard = Number(tot).toFixed(3);
} else {
  this.btnafficher = true;
  this.readonly = false;
  this.msg = 'aucune créance trouvée ';
this.op.show(e, document.getElementById('affichBtnn'));
}

  }
  initialiser() {
    // this.btnafficher = true;
    this.selectedVendeur = null;
    this.selectedRepresentant = null;
    this.selectedGroupe = null;
    this.selectedZone = null;
    this.datefin = new Date();
    this.selectedtype = this.typeRCItems[0];
    this.selectedTypo = this.typologieItems[0];
    this.selectedModReg = this.modRegItems[0];
    this.selectedRecouv = null;
    this.date = new Date().toLocaleDateString('en-GB');
    this.recouv = '';
    this.typo = '';
    this.zone = '';
    this.vend = '';
    this.groupe = '';
    this.repres = '';
    this.type = 'T';
    this. mode = 0;

  }
  public onSearchItems(word: string, item: any): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}



async Excel(e) {

  try {
    if (this.btnafficher) {
      await this.chargerCreances();
    } else {
    }

    if (this.liste.length === 0) {
      this.btnafficher = true;
      this.readonly = false;
      this.msg = 'aucune créance trouvée ';
    this.op.show(e, document.getElementById('excelBtnn'));
    } else {
      let nomFich;
      if (this.module === 'Creance Client Cont' ) {
         nomFich = 'Liste des créances des clients cont';
      } else {
         nomFich = 'Liste des créances des clients ';
      }
      const exportExcel = this.liste.map(obj => {
        return {
          'Compte': obj.id,
          'Désignation': obj.deno,
          'Tel': obj.tel,
          'Fax': obj.fax,
          'Règlement': obj.reg,
          'Echéance': obj.ech,
          'solde': Number( Number(obj.solde).toFixed(3)),
          'Ret 1-30': Number( Number(obj.r30).toFixed(3)),
          'Ret 31-60': Number( Number(obj.r60).toFixed(3)),
          'Ret 60-90': Number( Number(obj.r90).toFixed(3)),
          'Ret > 90': Number(Number(obj.r91).toFixed(3)),
          'Impayé': Number(Number(obj.imp).toFixed(3))


        };
      });
      this.excelService.exportAsExcelFile(
        exportExcel,
        nomFich + ' : ' + new Date().toLocaleDateString('en-GB')

      );
    }
  } catch {
    console.log(' methode genererExcel');
  }
}


async imprimer (e) {
  // initailisation
 // let titre: string ;

 if (this.btnafficher) {
  await this.chargerCreances();
} else {
}
    /// créer doc jspdf

    if (this.liste.length === 0) {
      this.btnafficher = true;
      this.readonly = false;
      this.msg = 'aucune créance trouvée ';
    this.op.show(e, document.getElementById('impBtnn'));
    } else {
      this.nbClient = this.liste.length;
     let tutoSolde = 0;
      let tutoR30 = 0;
      let tutoR60 = 0;
      let tutoR90 = 0;
      let tutoR91 = 0;
      let tutoImp = 0;
      for (const ob of this.liste) {
        ob.solde = Number(ob.solde);
        ob.r30 = Number(ob.r30);
        ob.r60 = Number(ob.r60);
        ob.r90 = Number(ob.r90);
        ob.r91 = Number(ob.r91);
        ob.imp = Number(ob.imp);
        tutoSolde = tutoSolde +  ob.solde;
        tutoR30 = tutoR30 + ob.r30;
        tutoR60 = tutoR60 + ob.r60;
        tutoR90 = tutoR90 + ob.r90;
        tutoR91 = tutoR91 + ob.r91;
        tutoImp = tutoImp + ob.imp;
        ob.solde = Number(ob.solde).toFixed(3);
        ob.r30 = Number(ob.r30).toFixed(3);
        ob.r60 = Number(ob.r60).toFixed(3);
        ob.r90 = Number(ob.r90).toFixed(3);
        ob.r91 = Number(ob.r91).toFixed(3);
        ob.imp = Number(ob.imp).toFixed(3);
      }
      this.tutoSoldes = Number(tutoSolde).toFixed(3);
      this.tutoR30s = Number(tutoR30).toFixed(3);
      this.tutoR60s = Number(tutoR60).toFixed(3);
      this.tutoR90s = Number(tutoR90).toFixed(3);
      this.tutoR91s = Number(tutoR91).toFixed(3);
      this.imps = Number(tutoImp).toFixed(3);
      const tot =  tutoR30 + tutoR60 + tutoR90 + tutoR91 + tutoImp;
      this.totRetard = Number(tot).toFixed(3);
    const doc1 = new jspdf();
    doc1.setFontSize(12);
    doc1.setFontStyle('Arial');

   this.societe = globals.societe;
    console.log('societe ', this.societe);
   doc1.text('SOCIETE..:  ' + this.societe, 9, 15);


    const temps = this.datefin.toLocaleDateString('en-GB');
    doc1.text('Tunis, le : '  + temps, 165, 17);


    doc1.setFontSize(24);
    doc1.setFontStyle('bold');
    if (this.module === 'Creance Client Cont') {
        doc1.text('Créances générales des clients contentieux  '  , 35, 27);
    } else {
       doc1.text('Créances générales des clients  '  , 50, 27);
    }



      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');
      doc1.text('Mode de règlement :  ' , 45, 35, 'right');
      doc1.setFontStyle('bold');
      if ( this.selectedModReg !== null && this.selectedModReg !== undefined ) {
      doc1.text( this.selectedModReg.deno , 47, 35);
      }
      doc1.setFontStyle('Arial');
      doc1.text('Division: ' , 105, 35, 'right');
      doc1.setFontStyle('bold');
      if ( this.selectedTypo !== null && this.selectedTypo !== undefined ) {
      doc1.text( this.selectedTypo.deno , 107, 35);
      }

      doc1.setFontStyle('Arial');
      doc1.text('Recouvreur: ' , 160, 35, 'right');
      doc1.setFontStyle('bold');
     if ( this.selectedRecouv !== null && this.selectedRecouv !== undefined ) {
      doc1.text( this.selectedRecouv.deno , 162, 35);
     }

     doc1.setFontSize(12);
     doc1.setFontStyle('Arial');
     doc1.text('Type :  ' , 45, 42, 'right');
     doc1.setFontStyle('bold');
     if (this.selectedtype !== null  && this.selectedtype !== undefined) {
      doc1.text( this.selectedtype.deno , 47, 42);
      console.log('type ', this.selectedtype);
     }


     doc1.setFontStyle('Arial');
     doc1.text('Zone: ' , 105, 42, 'right');
     if (this.selectedZone !== null  && this.selectedZone !== undefined) {
     doc1.setFontStyle('bold');
     doc1.text( this.selectedZone.deno , 107, 42);
     }

     doc1.setFontStyle('Arial');
     doc1.text('Représentant: ' , 160, 42, 'right');
     doc1.setFontStyle('bold');
     doc1.setFontSize(9);
    if ( this.selectedRepresentant !== null && this.selectedRepresentant !== undefined ) {
     doc1.text( this.selectedRepresentant.deno , 161, 42);
    }
    doc1.setFontSize(12);

    doc1.setFontStyle('Arial');
    doc1.text('Total Clients: ' , 105, 49, 'right');
    doc1.setFontStyle('bold');
    doc1.text(  this.nbClient.toString() , 107, 49);
    doc1.setFontStyle('Arial');
    doc1.text('Groupe : ' , 160, 49, 'right');
    doc1.setFontStyle('bold');

  if ( this.selectedGroupe !== null && this.selectedGroupe !== undefined ) {
    if (this.selectedGroupe.deno.length > 16) {
      doc1.setFontSize(10);
      doc1.text( this.selectedGroupe.deno.substring(0, 19) , 162, 49);
    } else {
      doc1.text( this.selectedGroupe.deno , 162, 49);
    }

   }

       // entete du  tableau
       doc1.setFontStyle('bold');
       doc1.line(9, 54, 205, 54);
       doc1.setFontSize(12);
       doc1.setFontStyle('bold');
       doc1.text('Compte', 10, 59);
       doc1.text('Raison Sociale', 27, 59);
       doc1.text('Reg', 75, 59);
       doc1.text('Ech', 84, 59);
       doc1.text('Solde', 96, 59);
       doc1.text('Ret 1-30', 109, 59);
       doc1.text('Ret 31-60', 127, 59);
       doc1.text('Ret 61-90', 148, 59);
       doc1.text('Ret >90', 170, 59);
       doc1.text('Impayé', 188, 59);


   // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(9, 63, 205, 63);

    let y = 68;
    doc1.setFontSize(9);
    doc1.setFontStyle('Arial');

    if (this.liste.length > 0) {
      let numPage = 1;
      let i = 0;
      for (const obj of this.liste ) {
          i++;
        doc1.setFontSize(9);
        doc1.setFontStyle('Arial');
        doc1.text(obj.id, 10, y);
        let cl = '';
        if (obj.deno.length > 24) {
          cl = obj.deno.substring(0, 24);
          doc1.text(cl, 27, y);
        } else {
          doc1.text(obj.deno, 27, y);
        }

        let regg = '';
        if (obj.reg === 'TRAITE') {
          regg = 'TR';
        }
        if (obj.reg === 'VIREMENT') {
          regg = 'VIR';
        }
        if (obj.reg === 'CHEQUE') {
          regg = 'CH';
        }
        doc1.text(regg, 77, y);
        doc1.text(obj.ech, 86, y);
        doc1.text(obj.solde, 108, y, 'right');
        doc1.text(obj.r30, 122, y, 'right');
        doc1.text(obj.r60, 144, y, 'right');
        doc1.text(obj.r90, 164, y, 'right');
        doc1.text(obj.r91, 185, y, 'right');
        doc1.text(obj.imp, 205, y, 'right');
        y = y + 7;
        if (y > 277) {
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

          numPage++;
          doc1.addPage();
          doc1.line(9, 12, 205, 12);

          doc1.setFontSize(12);
          doc1.setFontStyle('bold');
          doc1.text('Compte', 10, 17);
          doc1.text('Raison Sociale', 27, 17);
          doc1.text('Reg', 75, 17);
          doc1.text('Ech', 84, 17);
          doc1.text('Solde', 96, 17);
          doc1.text('Ret 1-30', 109, 17);
          doc1.text('Ret 31-60', 127, 17);
          doc1.text('Ret 61-90', 148, 17);
          doc1.text('Ret >90', 170, 17);
          doc1.text('Impayé', 188, 17);


     // creer la ligne
       doc1.setFontStyle('bold');
       doc1.line(9, 20, 205, 20);
       y = 24;
        }


        }

     // creer la ligne
     console.log('yyyyyyyyyy', y);

     if (y === 24) {
      doc1.setFontStyle('bold');
      doc1.line(9, 280, 205, 280);
      y = 17;
     } else {
      doc1.setFontStyle('bold');
      doc1.line(9, y, 205, y);
     }
     y = y + 7;
     doc1.setFontSize(14);
    doc1.setFontStyle('bold');
     doc1.text('Totaux : ', 10, y );

     doc1.setFontSize(8);
     doc1.setFontStyle('Arial');
     doc1.text(this.tutoSoldes.toString(), 108, y, 'right');
     doc1.text(this.tutoR30s.toString(), 122, y, 'right');
     doc1.text(this.tutoR60s.toString(), 144, y, 'right');
     doc1.text(this.tutoR90s.toString(), 164, y, 'right');
     doc1.text(this.tutoR91s.toString(), 185, y, 'right');
     doc1.text(this.imps.toString(), 205, y, 'right');
     y = y + 7;
     doc1.setFontSize(14);
    doc1.setFontStyle('bold');
     doc1.text('Total Retard   : ' + this.totRetard.toString(), 10, y );
     doc1.setFontStyle('Arial');
     doc1.setFontSize(9);
    doc1.text('Page ' + numPage.toFixed(0), 100, 289);
    window.open(doc1.output('bloburl'), '_blank');


      }
    }
}

}


