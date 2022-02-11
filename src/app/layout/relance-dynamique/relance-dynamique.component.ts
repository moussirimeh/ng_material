import { Component, OnInit, ViewChild , HostListener} from '@angular/core';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { VerifCommandeService } from '../services/verifCommande.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { NgSelectConfig } from '@ng-select/ng-select';
import * as jspdf from 'jspdf';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../services/excel.service';
import { OverlayPanel } from 'primeng/primeng';
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
  selector: 'app-relance-dynamique',
  templateUrl: './relance-dynamique.component.html',
  styleUrls: ['./relance-dynamique.component.scss'],
  providers: [DatePipe , ExcelService],
})
export class RelanceDynamiqueComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;
  fournisseurs = new Array() ;
  SelectedFournisseur: any ;
  readonly: boolean ;
  codefour: any;
  numCmd = 'R_DYN' ;
  rep: any;
  liste = new Array();
  obj: any;
  delai: string ;
  labeldelai: boolean;
  msg: string ;
  wasInside: any;
  constructor(
    private fournisseurService: FournisseurService,
    private verifCommandeService: VerifCommandeService ,
    private datePipe: DatePipe,
    private config: NgSelectConfig,
    private excelService: ExcelService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
  }
 @HostListener('document:click', ['$event.target'])
  clickout(e) {
    console.log(this.wasInside, e);

    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }


  ngOnInit() {
    this.labeldelai = false  ;
    this.readonly = false ;
  }

  async chargerFournisseur() {
    if (this.fournisseurs.length === 0) {
        await this.fournisseurService
          .getFournisseurListByOrderByDeno()
          .toPromise()
          .then((data) => {
            this.fournisseurs = data['_embedded'].fournisseurs;
            console.log('liste des fournisseurs ',  this.fournisseurs);
          });
    }
    }

    changeFournisseur(e) {
      this.op.hide() ;
      this.wasInside = true ;
      if (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined) {
        console.log('selected four ' , this.SelectedFournisseur);
        this.codefour = this.SelectedFournisseur.code ;
        this.labeldelai = true ;
        this.delai = this.SelectedFournisseur.delai ;
        if (this.SelectedFournisseur.delai === null || this.SelectedFournisseur.delai === '0'  ) {
          this.delai = '0' ;
          this.msg = 'Il faut specifier le délai de livraison de ce fournisseur';
          this.op.show(e, document.getElementById('four'));
         // this.wasInside = false ;
        }
       } else {
          this.codefour = '' ;
          this.delai = '' ;
          this.labeldelai = false  ;
        }
    }
    public onSearchfournisseur(word: string, item: Fournisseur): boolean {
      return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
    }
  test(e) {
    this.op.hide();
    this.wasInside = true ;
    setTimeout(async () => {
      await this.Afficher(e) ;
       }, 10);
  }
  async Afficher(e) {
    console.log(e);
    if (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined && this.SelectedFournisseur !== '') {
      if (this.SelectedFournisseur.delai === null || this.SelectedFournisseur.delai === '0' ) {
        this.msg = 'Il faut specifier le délai de livraison de ce fournisseur';
        this.op.show(e);
      } else {
    await this.verifCommandeService.VerifCmndbyFour(this.codefour)
    .toPromise()
    .then((data) => {
      this.rep = data ;
      console.log('******** rep *****', this.rep);

    });


  await this.verifCommandeService.findByNumCmdOrderByRangAscArtCmdAsc(this.numCmd)
  .toPromise()
  .then((data) => {
    this.liste = data['_embedded'].verifCommande ;
    console.log('liste *****' , this.liste);
  });
  for (let i = 0 ; i < this.liste.length ; i++) {
    const dateformat: string = this.datePipe.transform( this.liste[i].datVerif, 'dd/MM/yyyy');
    this.liste[i].datVerif = dateformat ;

    const dateformat1: string = this.datePipe.transform( this.liste[i].dateDernAch, 'dd/MM/yyyy');
    this.liste[i].dateDernAch = dateformat ;
    if (this.liste[i].numDernAch === null) {
      this.liste[i].numDernAch = '' ;
    } else {
      this.liste[i].numDernAch = this.liste[i].numDernAch.substring(9, 14) ;
    }

    this.liste[i].qteCmd = Number(this.liste[i].qteCmd).toFixed(0);
  }
  this.readonly = true ;
}
} else {

  this.msg = 'Il faut choisir un fournisseur';
  this.op.show(e, document.getElementById('btnaff'));
}
  }
  nouvelleSaisie() {
    this.SelectedFournisseur = '' ;
    this.liste = new Array() ;
    this.readonly = false ;
    this.labeldelai = false ;
  }
  async Apercu() {
    const doc1 = new jspdf('landscape');
    doc1.setFontSize(15);
    doc1.setFontStyle('bold');
    doc1.setFontStyle('Arial');
    let temps = String(new Date().getUTCHours() + 1);
     temps = temps + ':' + String(new Date().getUTCMinutes());
     temps = temps + ':' + String(new Date().getUTCSeconds());
     console.log('datedu jour ', temps );
     const datedujour = new Date().toLocaleDateString('en-GB') ;
    doc1.text('Etat de Relance dynamique      Edite le ' + datedujour, 148, 20, 'center');
    doc1.text('FOURNISSEUR ' + this.SelectedFournisseur.deno, 148, 27, 'center');
    doc1.text('DELAI DE LIVRAISON ' + this.delai + ' JOURS', 148, 34, 'center');
    doc1.setFontSize(10);
    doc1.line(7, 39, 290, 39);
    // ligne vertical
    doc1.line(7, 39, 7, 200);
    doc1.line(290, 39, 290, 200);
    doc1.setFontSize(8);
    doc1.text('ARTICLE', 8, 42);
    doc1.text('STK', 32, 42);
    doc1.text('RES', 39, 42);
    doc1.text('CM_CL', 46, 42);
    doc1.text('CM_FR', 57, 42);
    doc1.text('STK_EQ', 69, 42);
    doc1.text('CM_FR_EQ', 81, 42);
    doc1.text('PR_STK', 97, 42);
    doc1.text('NB_CL', 109, 42);
    doc1.text('NB_BL', 119, 42);
    doc1.text('NB_PC', 129, 42);
    doc1.text('NB_PC_1', 139, 42);
    doc1.text('N°ACH', 152, 42);
    doc1.text('DAT_ACH', 164, 42);
    doc1.text('QT_AC', 180, 42);
    doc1.text('QT_VN', 191, 42);
    doc1.text('MIN', 202, 42);
    doc1.text('MAX', 208, 42);
    doc1.text('QT_CM', 216, 42);
    doc1.text('QT_CS', 227, 42);
    doc1.text('OBSERVATIONS', 242, 42);
    doc1.setFontSize(10);
    doc1.line(7, 44, 290, 44);
    let y = 49;
    let numPage = 1;
    doc1.setFontSize(7);
    doc1.setFontStyle('Arial');
      for (this.obj of this.liste) {
        doc1.setFontSize(7);
        doc1.setFontStyle('Arial');
        doc1.text(String(this.obj.artCmd), 8, y);
        doc1.text(String(this.obj.qtStk), 36, y);
        doc1.text(String(this.obj.qteReserv), 42, y);
        doc1.text(String(this.obj.qteComCl), 50, y);
        doc1.text(String(this.obj.qtCom), 61, y);
        doc1.text(String(this.obj.qtEquiv), 74, y);
        doc1.text(String(this.obj.qtEquivCom), 89, y);
        doc1.text(String(this.obj.profilStk), 103, y);
        doc1.text(String(this.obj.nbrCl), 113, y);
        doc1.text(String(this.obj.nbrBl), 124, y);
        doc1.text(String(this.obj.qteTotal), 134, y);
        doc1.text(String(this.obj.qteTotal1), 144, y);
        doc1.text(String(this.obj.numDernAch), 154, y);
        doc1.text(String(this.obj.dateDernAch), 165, y);
        doc1.text(String(this.obj.qteAchetee), 184, y);
        doc1.text(String(this.obj.qteVendue), 197, y);
        doc1.text(String(this.obj.qteMin), 206, y);
        doc1.text(String(this.obj.qteMax), 213, y);
        doc1.text(String(this.obj.qteCmd), 221, y);
        doc1.text(String(this.obj.qteConseillee), 232, y);
        doc1.setFontSize(8);
        doc1.text(String(this.obj.observations), 239, y);
        y = y + 7;
        // passer a une nouvelle page

        if (y > 200) {
          doc1.setFontSize(10);
          doc1.line(7, 200, 290, 200);
          doc1.text(String(numPage), 135, 204);

          numPage++;
          doc1.addPage();
          // entete tableau

          doc1.setFontSize(10);

          // ligne vertical
          doc1.line(7, 12, 7, 200);
          doc1.line(290, 12, 290, 200);

          doc1.line(7, 12, 290, 12);

          doc1.setFontSize(8);
          doc1.text('ARTICLE', 8, 16);
          doc1.text('STK', 32, 16);
          doc1.text('RES', 39, 16);
          doc1.text('CM_CL', 46, 16);
          doc1.text('CM_FR', 57, 16);
          doc1.text('STK_EQ', 69, 16);
          doc1.text('CM_FR_EQ', 81, 16);
          doc1.text('PR_STK', 97, 16);
          doc1.text('NB_CL', 109, 16);
          doc1.text('NB_BL', 119, 16);
          doc1.text('NB_PC', 129, 16);
          doc1.text('NB_PC_1', 139, 16);
          doc1.text('N°ACH', 152, 16);
          doc1.text('DAT_ACH', 164, 16);
          doc1.text('QT_AC', 180, 16);
          doc1.text('QT_VN', 191, 16);
          doc1.text('MIN', 202, 16);
          doc1.text('MAX', 208, 16);
          doc1.text('QT_CM', 216, 16);
          doc1.text('QT_CS', 227, 16);
          doc1.text('OBSERVATIONS', 242, 16);
          doc1.setFontSize(10);
          doc1.line(7, 18, 290, 18);
          y = 23;
        }
      }
      doc1.setFontSize(10);
      doc1.line(7, 200, 290, 200);
      doc1.text(String(numPage), 135, 204);
    window.open(doc1.output('bloburl'), '_blank');
  }


  Excel() {
    const exportExcel = this.liste.map(obj => {
      return {
        'ARTICLE': obj.artCmd,
        'STK': Number(obj.qtStk),
        'RES': Number(obj.qteReserv),
        'CM_CL': Number(obj.qteComCl),
        'CM_FR': Number(obj.qtCom),
        'STK_EQ': Number(obj.qtEquiv),
        'CM_FR_EQ': Number(obj.qtEquivCom),
        'PR_STK': obj.profilStk,
        'NB_CL': Number(obj.nbrCl),
        'NB_BL': Number(obj.nbrBl),
        'NB_PC': Number(obj.qteTotal),
        'NB_PC1': Number(obj.qteTotal1),
        'NUM_ACH': Number(obj.numDernAch),
        'DAT_ACH': obj.dateDernAch,
        'QT_ACH': Number(obj.qteAchetee),
        'QT_VND': Number(obj.qteVendue),
        'MIN': Number(obj.qteMin),
        'MAX': Number(obj.qteMax),
        'QT_CMD': Number(obj.qteCmd),
        'QT_CONS': Number(obj.qteConseillee),
        'OBSERVATIONS': obj.observations,
      };
    });
    this.excelService.exportAsExcelFile(exportExcel, ' Etat Relance Dynamique ');
  }

}
