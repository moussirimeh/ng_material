import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Elivraison } from '../services/elivraison';
import { ElivraisonService } from '../services/elivraison.service';
import {
  GridComponent,
  RowSelectEventArgs
} from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import * as jspdf from 'jspdf';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import {RecettesService} from '../services/recettes.service';
import { RecettesBonSortie } from '../services/RecettesBonSortie';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import {formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { LoginService } from 'src/app/login/login.service';
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
  selector: 'app-vent-ferm-bs',
  templateUrl: './vent-ferm-bs.component.html',
  styleUrls: ['./vent-ferm-bs.component.scss'],
  providers: [MessageService]
})
export class VentFermBsComponent implements OnInit {
  @ViewChild('grid')
  private grid: GridComponent;
  elivraisons: Elivraison[];
  elivraison: Elivraison = {
    id: null,
    numero: '',
    dated: '',
    datef: '',
    livreur: '',
    camuion: ''
  };
  wasInside: boolean;
  msgerror: string;
  @ViewChild('op')
  public op: OverlayPanel;
  chauffeur: any;
  date: string;
  selected: any;
  constructor(
    private elivraisonService: ElivraisonService,
    private messageService: MessageService,
    private steService: SteService,
    private recettesService: RecettesService,
    private loginService: LoginService,
    private config: NgSelectConfig

    ) {
      this.config.notFoundText = 'Aucun élément trouvé';
      this.config.clearAllText = 'Supprimer tous ';
    }
  ste: Ste;
  Societe: Ste;
  recBS: RecettesBonSortie[] ;
  public customAttributes: Object;
  async ngOnInit() {
    this.customAttributes = { class: 'customcss' };
    // recuperer la liste des bons de sortie ouverts
    await this.elivraisonService
      .getBSOuverts()
      .toPromise()
      .then(data => {
        this.elivraisons = data['_embedded'].bondSorties;
        console.log(this.elivraisons);
      });
  }
  // recupérer la ligne sélectionnée
  rowSelected(e) {

              this.selected = this.grid.getSelectedRecords()[0];
              console.log(this.selected.numero);
              // recuperer la liste des recettes d'un bon de sortie séléctioné
              this.recettesService.duplicataBS(this.selected.numero)
              .toPromise()
              .then(data => {
              this.recBS = data['_embedded'].recettesBonSorts;
                console.log('recettes ', this.recBS);
              });

  }
@HostListener('document:click')
    clickout() {
      if (!this.wasInside) {
        this.messageService.clear();
        this.op.hide();
      }
      this.wasInside = false;
}
  async afficher(e) {
    this.wasInside = false;
    // recuperer le bon de sortie selon id du bon sortie séléctionné
    try {
                        if (this.selected !== null && this.selected !== undefined ) {
                          this.wasInside = false;
                            await this.elivraisonService
                              .getElivraisonByNumero(this.selected.numero)
                              .toPromise()
                              .then(data => {
                                this.elivraison = data['_embedded'].elivraisons[0];
                              });

                              // modifier date de fermeture
                              this.date = new Date().toLocaleDateString('en-GB');
                              this.elivraison.datef = this.date;
                              // fermer le bon de sortie
                              this.elivraisonService.updateElivraison(this.elivraison).subscribe(
                                data => {
                                  console.log(' fermeture bon sortie avec succés', this.elivraison);
                                  const codeUtil = localStorage.getItem('login');
                                  const moduteName = globals.selectedMenu;
                                  const paramMouchar = 'N° ' + this.elivraison.numero;
                                  this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
                                  .then((data) => {
                                    console.log(data);
                                  });
                                },
                                error => console.log('erreur')
                              );

                            // recuperer les donnees de la societe
                            await this.steService
                              .getSte()
                              .toPromise()
                              .then(data => {
                                this.ste = data['_embedded'].ste;
                                this.Societe = this.ste[0];
                                console.log(this.Societe);
                              });

                        // gerer le document pdf pour visualiser les donnees avant l'impresssion
                        // creer le document pdf
                        const doc1 = new jspdf();


                          doc1.setFontSize(12);
                          doc1.setFontStyle('Arial');
                          doc1.text('Société  : ' + this.Societe.societe, 15, 20);

                          doc1.setFontSize(20);
                          doc1.text('Bon de sortie N° ' + this.elivraison.numero, 80, 30);

                          doc1.setFontSize(12);
                          doc1.setFontStyle('Arial');
                          doc1.text('Nom du chauffeur : ' +  this.selected.livreur, 15, 40);
                          doc1.text('Numero du camion : ' +  this.selected.camuion, 15, 45);
                          doc1.text('Date du          : ' +  this.selected.dated, 15, 50);
                          doc1.text('Jusqu\'au         : ' +  this.elivraison.datef, 80, 50);
                          const temps = formatDate(new Date(), ' HH:mm:ss ', 'fr-FR', '+01');
                        //  const time = String(temps);
                          console.log(temps);
                          // this.date = new Date().toLocaleDateString('en-GB');
                          const jour = new Date().getDay();

                          doc1.text('Tunis, le : '  + this.elivraison.datef + '     ' + temps, 136, 50);

                          // entete tableau des recettes
                          doc1.setFontSize(13);
                          doc1.setFontStyle('bold');
                          doc1.text('Client', 10, 60);
                          doc1.text('Adresse', 85, 60);
                          doc1.text('N° BL/F', 150, 60);
                          doc1.text('Nbre de Colis', 175, 60);
                          // creer la ligne
                          doc1.setFontStyle('bold');
                          doc1.line(9, 65, 205, 65);
                          // afficher la liste des recettes
                          let y = 72;
                          let numPage = 1;
                          doc1.setFontSize(10);
                          doc1.setFontStyle('Arial');
                          for (const rec of this.recBS) {
                                            doc1.setFontSize(9);
                                          doc1.setFontStyle('Arial');
                                          // console.log(rec);
                                            doc1.text(rec.nomClient, 10, y);
                                            doc1.text(rec.adresseClient, 85, y);
                                            doc1.text(rec.piece, 150, y);
                                            doc1.text(rec.nbc, 190, y);
                                            y = y + 7;
                                                      // passer a une nouvelle page
                                                            if (y > 277) {
                                                                            doc1.line(10, y - 3, 200, y - 3, 'FD');
                                                                            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                                                                            numPage++;
                                                                            doc1.addPage();
                                                                            // entete tableau des recettes
                                                                            doc1.setFontSize(13);
                                                                            doc1.setFontStyle('bold');
                                                                            doc1.text('Client', 10, 24);
                                                                            doc1.text('Adresse', 85, 24);
                                                                            doc1.text('N° BL/F', 150, 24);
                                                                            doc1.text('Nbre de Colis', 175, 24);
                                                                            // creer la ligne
                                                                            doc1.setFontStyle('bold');
                                                                            doc1.line(9, 27, 205, 27);
                                                                            y = 32;
                                                                          }
                                      }
                                      doc1.line(10, 280, 200, 280, 'FD');
                                      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                                      // ouvrir le document dans une nouvelle page web
                                      window.open(doc1.output('bloburl'), '_blank');
                                        this.ngOnInit();

                                        } else {
                                          this.wasInside = true;
                                          this.msgerror =  'Sélectionner un bon de sortie !';
                                          this.op.show(e, document.getElementById('verif'));
                                        }




         this.ngOnInit();
         this.selected = null;

      } catch {
            console.log('methode afficher');
          }
  }
}
