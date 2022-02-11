import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import { LivreurService } from '../services/livreur.service';
import { ElivraisonService } from '../services/elivraison.service';
import { MessageService } from 'primeng/api';
import { Elivraison} from '../services/elivraison';
import { SteService} from '../services/ste.service';
import { Ste } from '../services/ste';
import * as jspdf from 'jspdf';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import {formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
@Component({
  selector: 'app-vente-rapportbs',
  templateUrl: './vente-rapportbs.component.html',
  styleUrls: ['./vente-rapportbs.component.scss'],
  providers: [MessageService]
})
export class VenteRapportbsComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;
  dateDebut:  Date;
  dateFin: Date;
  listeBS: Elivraison [];
  ste: Ste[];
  societe: Ste;
  date: any;
  wasInside: boolean;
  public customAttributes: Object;
  msgerror: string;
  tn: any;
   constructor(private livreurService: LivreurService ,
    private elivraisonService: ElivraisonService,
    private steService: SteService,
    private messageService: MessageService,
    private config: NgSelectConfig

    ) {
      this.config.notFoundText = 'Aucun élément trouvé';
      this.config.clearAllText = 'Supprimer tous ';
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
            this.messageService.clear();
            this.wasInside = true;
            // verifier si les dates sont justes et n'est pas vides
            if (this.dateDebut === undefined  || this.dateDebut === null) {
                 document.getElementById('fx_Requested_date').focus();
                  this.msgerror = 'Date début est obligatoire !';
                  this.op.show(e, document.getElementById('deb'));
            } else {
                      if (this.dateFin === undefined || this.dateFin === null ) {
                        document.getElementById('fx_Requested_date2').focus();
                        this.msgerror = 'Date fin est obligatoire !';
                        this.op.show(e, document.getElementById('jsq'));
                      } else {
                          if (this.dateDebut > this.dateFin) {
                            document.getElementById('fx_Requested_date').focus();
                            this.msgerror = 'Date début doit être inférieur à date fin !';
                            this.op.show(e, document.getElementById('deb'));
                          } else {
                            const dateD = this.dateDebut.toLocaleDateString('en-GB');
            const dateF =  this.dateFin.toLocaleDateString('en-GB');
            // recuperer la liste des bons de sortie entre les dates donnees
            await this.elivraisonService.rapportBS(dateD, dateF)
            .toPromise()
            .then(async data => {
              this.listeBS = data['_embedded'].bondSorties;
              console.log(this.listeBS);
                // si la liste est vide afficher un message
              if (this.listeBS.length === 0) {

                  this.msgerror = 'Aucune livraison pour cette période !!';
                  this.op.show(e, document.getElementById('btn'));
                } else {


                      // gerer le document pdf pour visualiser les donnees avant l'impresssion
                      // creer le document pdf
                      const doc1 = new jspdf();

                      doc1.setFontSize(12);
                      doc1.setFontStyle('Arial');
                        // recupérer les données de la sociéte
                        await this.steService
                        .getSte()
                        .toPromise()
                        .then(data => {
                          this.ste = data['_embedded'].ste;
                          this.societe = this.ste[0];
                          console.log(this.societe);
                        });
                      doc1.text('Société  : ' + this.societe.societe, 10, 20);
                      doc1.setFontSize(12);
                      doc1.setFontStyle('Arial');
                      // recuperer la date et le temps du systeme
                      const temps = formatDate(new Date(), ' HH:mm:ss ', 'fr-FR', '+01');
                      this.date = new Date().toLocaleDateString('en-GB');

                      doc1.text('Tunis, le : '  + this.date + '  ' + temps, 130, 20);

                      doc1.setFontSize(24);
                      doc1.setFontStyle('bold');
                      doc1.setFontStyle('Arial');
                      doc1.text('Liste des bons de sortie fermés', 55, 30);
                      doc1.setFontSize(12);
                        doc1.setFontStyle('Arial');
                      doc1.text('Date de fermeture du :' + this.dateDebut.toLocaleDateString('en-GB'), 10, 40);
                      doc1.text('jusqu\'au :' + this.dateFin.toLocaleDateString('en-GB'), 100, 40);
                        // entete du  tableau
                        doc1.setFontSize(12);
                        doc1.setFontStyle('bold');
                        doc1.line(9, 50, 205, 50);
                        doc1.setFontSize(13);
                        doc1.setFontStyle('bold');
                        doc1.text('Numero', 10, 55);
                        doc1.text('Date d\'ouver', 30, 55);
                        doc1.text('Date de ferm', 70, 55);
                        doc1.text('Livreur', 110, 55);
                        doc1.text('Camion', 170, 55);
                        // creer la ligne
                        doc1.setFontStyle('bold');
                        doc1.line(9, 60, 205, 60);


                        let y = 65;
                        let numPage = 1;
                        doc1.setFontSize(10);
                        doc1.setFontStyle('Arial');
                        for (const bs of this.listeBS) {
                          doc1.setFontSize(9);
                          doc1.setFontStyle('Arial');
                          doc1.text(bs.numero, 10, y);
                          doc1.text(bs.dated, 30, y);
                          doc1.text(bs.datef, 70, y);
                          doc1.text(bs.livreur, 110, y);
                          doc1.text(bs.camuion, 170, y);
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
                            doc1.text('Numero', 10, 17);
                            doc1.text('Date d\'ouver', 30, 17);
                            doc1.text('Date de ferm', 70, 17);
                            doc1.text('Livreur', 110, 17);
                            doc1.text('Camion', 170, 17);
                            // creer la ligne
                            doc1.setFontStyle('bold');
                            doc1.line(9, 24, 205, 24);
                            y = 32;
                          }
                        }
                        doc1.line(10, 280, 200, 280, 'FD');
                        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                        window.open(doc1.output('bloburl'), '_blank');
                       // this.ngOnInit();

                }
            });
                          }

                      }


            }
}
ngOnInit() {
      // parametrage du calendrier
      this.customAttributes = { class: 'customcss' };
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
  }



