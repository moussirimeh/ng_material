import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import * as jspdf from 'jspdf';
import { EvolutionService } from '../services/evolution.service';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { AchatService } from '../services/achat.service';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-objectifs-frs-realise',
  templateUrl: './objectifs-frs-realise.component.html',
  styleUrls: ['./objectifs-frs-realise.component.scss']
})
export class ObjectifsFrsRealiseComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;
  SelectedFournisseur = '';
  fournisseurs = new Array() ;
  command = new Array() ;
  readonly: boolean ;
  btnaffich = true ;
  showConfirm: boolean;
  listeFourniseur = new Array();
  four: any;
  plafond: string;
  ListeMoins = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
  listeObjectifsFoursRealise: any;
  societe: string;
  listeVentes: any;
  vente: string;
  listeEvolutionByZone = new Array();
  msg: string;
  constructor(
    private config: NgSelectConfig ,
    private fournisseurService: FournisseurService,
    private evolutionService: EvolutionService ,
    private achatService: AchatService ,
    ) {
      this.config.notFoundText = 'Aucun élément trouvé';
      this.config.clearAllText = 'Supprimer tous';
     }
     @HostListener('document:click')
     clickout() {
          this.op.hide();
     }
  ngOnInit() {
    this.SelectedFournisseur = null;
    this.fournisseurService
    .getFournisseurListByOrderByDeno()
    .toPromise()
    .then(data => {
      this.fournisseurs = data['_embedded'].fournisseurs;
    });
  }
  changeFournisseur() {}
  public onSearchFournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async Afficher(e) {
    await this.fournisseurService
    .getFourByCode(this.SelectedFournisseur)
    .toPromise()
    .then(data => {
      this.listeFourniseur = data['_embedded'].fournisseurs;
    });
    console.log('code four = ', this.SelectedFournisseur);

    if ( this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined) {
     if (this.listeFourniseur[0].plafond !== '0.0') {
       this.four = this.listeFourniseur[0] ;
       await this.evolutionService
       .deleteEvolution()
       .toPromise()
       .then(data => {
        const resDelete = data;
       });
       for (let i = 1 ; i <= 12 ; i++) {
        let libMois ;
       switch (i) {
         case 1 : {
           libMois = ' JANVIER ' ;
           break;
         }
         case 2 : {
          libMois = ' FEVRIER ' ;
          break;
        }
        case 3 : {
          libMois = ' MARS ' ;
          break;
        }
        case 4 : {
          libMois = ' AVRIL ' ;
          break;
        }
        case 5 : {
          libMois = ' MAI ' ;
          break;
        }
        case 6 : {
          libMois = ' JUIN ' ;
          break;
        }
        case 7 : {
          libMois = ' JUILLET ' ;
          break;
        }
        case 8 : {
          libMois = ' AOUT ' ;
          break;
        }
        case 9 : {
          libMois = ' SEPTEMBRE ' ;
          break;
        }
        case 10 : {
          libMois = ' OCTOBRE ' ;
          break;
        }
        case 11 : {
          libMois = ' NOVEMBRE ' ;
          break;
        }
        case 12 : {
          libMois = ' DECEMBRE ' ;
          break;
        }
       }
       await this.evolutionService
       .InsertEvolutionRealise(this.four.code , String(i), libMois)
       .toPromise()
       .then(data => {
        const resInsert = data;
     });
      }
      await this.evolutionService
      .UpdateEvolutionRealise(this.four.code)
      .toPromise()
      .then(data => {
        const resUpdate = data;
      });
     await this.evolutionService
    .findByOrderByZone()
    .toPromise()
    .then(data => {
      this.listeEvolutionByZone = data['_embedded'].evolution;
    });
    const doc1 = new jspdf();
    doc1.setFontSize(12);
    doc1.setFontStyle('Arial');
    this.societe = globals.societe;
     doc1.text('SOCIETE..:  ' + this.societe, 9, 15);
     let temps = String(new Date().getUTCHours() + 1);
     temps = temps + ':' + String(new Date().getUTCMinutes());
     temps = temps + ':' + String(new Date().getUTCSeconds());
     console.log('datedu jour ', temps );
     const datedujour = new Date().toLocaleDateString('en-GB') ;
     doc1.text('Tunis, le : '  + datedujour + ' ' + temps , 152, 15);
     doc1.setFontSize(15);
     doc1.setFontStyle('bold');
     doc1.setTextColor(9, 4, 161);
     doc1.text('Evolution Objectif/CmdsFournisseur', 50, 27);
     doc1.setFontStyle('Arial');
     doc1.setFontSize(12);
     doc1.setTextColor(0, 0, 0);
     doc1.text('Fournisseur : ' + this.four.deno, 9, 35);
     doc1.text('Objectif/AN : ' + this.four.plafond, 9 , 40);
     // entete du  tableau
     doc1.setFontStyle('Arial');
     doc1.line(9, 45, 205, 45);
     doc1.line(9, 45, 9, 277);
     doc1.line(205, 45, 205, 277);
     doc1.setFontStyle('bold');
     doc1.setTextColor(0, 0, 0);
     doc1.text('Mois', 11, 50);
     doc1.text('Objectif', 60, 50, 'right');
     doc1.text('Document', 90, 50, 'right');
     doc1.text('Montant', 120, 50, 'right');
     doc1.text('Cumul', 155, 50, 'right');
     doc1.text('Ventes', 180, 50, 'right');
     doc1.text('Evolution', 203, 50, 'right');
     // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(9, 53, 205, 53);
     let y = 62;
     doc1.setFontStyle('Arial');
     let  numPage = 1;
       for (const obj of this.listeEvolutionByZone) {
         doc1.setFontSize(10);
         doc1.setFontStyle('Arial');
         doc1.text(obj.mois, 11, y);
         doc1.text(Number(obj.objectif).toFixed(3), 60, y, 'right');
         doc1.text(obj.commande, 90, y, 'right');
         doc1.text(Number(obj.montant).toFixed(3), 120, y, 'right');
         doc1.text(Number(obj.cumul).toFixed(3), 155, y, 'right');
         doc1.text(Number(obj.vente).toFixed(3), 180, y, 'right');
         doc1.text(Number(obj.evolution).toFixed(2), 203, y, 'right');
         y = y + 7;
         if (y > 277) {
           doc1.line(9, 277, 205, 277);
           doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
           numPage++;
           doc1.addPage();
           doc1.line(9, 12, 205, 12);
           doc1.line(9, 12, 9, 277);
           doc1.line(205, 12, 205, 277);
           doc1.setFontSize(10);
           doc1.setFontStyle('bold');
           doc1.setFontSize(12);
           doc1.setFontStyle('bold');
           doc1.setTextColor(0, 0, 0);
           doc1.text('Mois ', 11, 17);
           doc1.text('Objectif ', 60, 17, 'right');
           doc1.text('Document ', 90, 17, 'right');
           doc1.text('Montant ', 120, 17, 'right');
           doc1.text('Cumul ', 155, 17, 'right');
           doc1.text('Vente ', 180, 17, 'right');
           doc1.text('Evolution ', 203, 17, 'right');
           // creer la ligne
           doc1.setFontStyle('bold');
           doc1.line(9, 20, 205, 20);
           y = 24;
         }

       }

       doc1.line(9, 277, 205, 277);
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
       window.open(doc1.output('bloburl'), '_blank');
    } else {
      this.msg = 'Pas d\'objectif saisi pour ce fournisseur ';
      this.op.show(e, document.getElementById('btn'));
    }
  } else {

    await this.achatService
    .getObjectifsFoursRealise()
    .toPromise()
    .then(data => {
      this.listeObjectifsFoursRealise = data;
      console.log('liste frs = ', this.listeObjectifsFoursRealise);

    });
     const doc1 = new jspdf();
     doc1.setFontSize(12);
     doc1.setFontStyle('Arial');
     this.societe = globals.societe;
     doc1.text('SOCIETE..:  ' + this.societe, 9, 15);
     let temps = String(new Date().getUTCHours() + 1);
     temps = temps + ':' + String(new Date().getUTCMinutes());
     temps = temps + ':' + String(new Date().getUTCSeconds());
     console.log('datedu jour ', temps );
     const datedujour = new Date().toLocaleDateString('en-GB') ;
     doc1.text('Tunis, le : '  + datedujour + ' ' + temps , 152, 15);
     doc1.setFontSize(15);
     doc1.setFontStyle('bold');
     doc1.setTextColor(9, 4, 161);
     doc1.text('Evolution Objectif/CmdsFournisseur', 50, 27);

      // entete du  tableau
      doc1.line(9, 35, 205, 35);
      doc1.line(9, 35, 9, 277);
      doc1.line(205, 35, 205, 277);
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');
      doc1.setTextColor(0, 0, 0);
      doc1.text('Code ', 11, 40);
      doc1.text('Nom ', 30, 40);
      doc1.text('Obj.M.Cour ', 95, 40, 'right');
      doc1.text('Cum.M.cour ', 119, 40, 'right');
      doc1.text('Obj/An ', 140, 40, 'right');
      doc1.text('Cumul ', 160, 40 , 'right');
      doc1.text('Ventes ', 180, 40, 'right');
      doc1.text('Evolution ', 203, 40, 'right');
      // creer la ligne
      doc1.setFontStyle('bold');
      doc1.line(9, 43, 205, 43);
      let y = 52;
      doc1.setFontSize(9);
      doc1.setFontStyle('Arial');
      let  numPage = 1;

        for (const obj of this.listeObjectifsFoursRealise) {
          console.log('obj', obj);
          doc1.setFontSize(10);
          doc1.setFontStyle('Arial');
          doc1.text(obj[0], 11, y, 'left');
          doc1.text(obj[1], 30, y, 'left');
          doc1.text(Number(obj[3]).toFixed(3), 95, y, 'right');
          doc1.text(Number(obj[4]).toFixed(3), 117, y, 'right');
          doc1.text(Number(obj[2]).toFixed(3), 140, y, 'right');
          doc1.text(Number(obj[5]).toFixed(3), 160, y, 'right');
          doc1.text(Number(obj[7]).toFixed(2), 180, y, 'right');
          doc1.text(Number(obj[6]).toFixed(3), 203, y, 'right');
          y = y + 7;
          if (y > 277) {
            doc1.line(9, 277, 205, 277);
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
            numPage++;
            doc1.addPage();
            doc1.line(9, 12, 205, 12);
            doc1.line(9, 12, 9, 277);
            doc1.line(205, 12, 205, 277);
            doc1.setFontSize(10);
            doc1.setFontStyle('bold');
            doc1.setFontSize(12);
            doc1.setFontStyle('bold');
            doc1.setTextColor(0, 0, 0);
            doc1.text('Code ', 11, 17);
            doc1.text('Nom ', 30, 17);
            doc1.text('Obj.M.Cour ', 95, 17, 'right');
            doc1.text('Cum.M.cour ', 119, 17, 'right');
            doc1.text('Obj/An ', 140, 17, 'right');
            doc1.text('Cumul ', 160, 17, 'right');
            doc1.text('Ventes ', 180, 17 , 'right');
            doc1.text('Evol ', 203, 17, 'right');
            // creer la ligne
            doc1.setFontStyle('bold');
            doc1.line(9, 20, 205, 20);
            y = 24;
          }

        }


        doc1.line(9, 277, 205, 277);
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        window.open(doc1.output('bloburl'), '_blank');

    }
  }

}
