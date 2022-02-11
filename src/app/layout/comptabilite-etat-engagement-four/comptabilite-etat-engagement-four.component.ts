import { Component, OnInit , ViewChild, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { NgSelectConfig } from '@ng-select/ng-select';
import * as jspdf from 'jspdf';
import { OverlayPanel } from 'primeng/primeng';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { BanqueService } from '../services/banque.service';
import { SteService } from '../services/ste.service';
import { Banque } from '../services/banque';
import { Achat0Service } from '../services/achat0.service';


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
  selector: 'app-comptabilite-etat-engagement-four',
  templateUrl: './comptabilite-etat-engagement-four.component.html',
  styleUrls: ['./comptabilite-etat-engagement-four.component.scss'],
  providers: [MessageService]
})
export class ComptabiliteEtatEngagementFourComponent implements OnInit {

// declaration des variables
@ViewChild('op')
public op: OverlayPanel;
  tn;
  datefin1;
  datedeb1;
  type: Array<{id: string , text: string }> = [
    {id: 'o', text: 'Obligations cautionnées'},
    {id: 'l', text: 'Fournisseurs locaux'},
    {id: 'e', text: 'Fournisseurs étrangers'}
    ];
   selectedType: any;
   public customAttributes: Object;
   banques: Banque [];
   selectedBanque ;
   scode = '';
   btnNouvelSaisie: boolean;

  liste: any;
  date: string;
  wasInside: boolean;
  ste: any;
  societe: any;
  listeimpression: any;
  bnq: string;
  sid: string;
  stext: string;
  visible = false;
  editEnable = false;
  msgerror: string;
  readOnly: boolean;
  ejsg: boolean;
  mois: any;
  annee: any;

constructor(private messageService: MessageService,
            private config: NgSelectConfig,
            private banqueService: BanqueService,
            private steService: SteService,
            private achat0Service: Achat0Service ) {
        this.config.notFoundText = 'Aucun élément trouvé';
        this.config.clearAllText = 'Supprimer tous ';
  }


nouvelleSaisie() {
     //   this.datefin1 = new Date();
      //  this.selectedBanque = null;
      //  this.selectedType = null;
       // this.scode = '';
        this.liste = null;
        this.visible = false;
        this.btnNouvelSaisie = false;
        this.readOnly = false;
        this.ejsg = false;
}


async ngOnInit() {
          this.ejsg = false;
           this.btnNouvelSaisie = false;
           this.readOnly = false;
              this.selectedBanque = null;

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
              this.datefin1 = new Date();
              this.datedeb1 = new Date(new Date().getFullYear(), 0, 1);

              this.selectedType = this.type[2];
              this.sid = this.selectedType.id;
              this.stext = this.selectedType.text;
              console.log('selected type code', this.sid);

              await this.banqueService.getBanque()
                      .toPromise()
                      .then(data => {
                         console.log(data);
                         this.banques = data['_embedded'].banque;
                         console.log(this.banques);
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
changeBanque() {
            if (this.selectedBanque !== null && this.selectedBanque !== undefined) {
              this.scode = this.selectedBanque.code;
              this.bnq = this.selectedBanque.deno;
              console.log('selected banque code', this.scode);

            } else {
              this.scode = '';
              this.bnq = '';
              console.log('selected banque code', this.scode);
            }
    }


changeType() {
              if (this.selectedType !== null && this.selectedType !== undefined) {
                this.sid = this.selectedType.id;
                this.stext = this.selectedType.text;
                console.log('selected type code', this.sid);

              } else {
                this.sid = '';
                this.stext  = '';
                console.log('selected type code', this.sid);
              }
    }
    init() {
      this.selectedType = this.type[2];
      this.sid = this.selectedType.id;
      this.stext = this.selectedType.text;
      console.log('selected type code', this.sid);

      this.selectedBanque = null;
      this.liste = new Array();
      this.datefin1 = new Date();
      this.datedeb1 = new Date(new Date().getFullYear(), 0, 1);
    }


async afficher(e) {
    this.wasInside = true;
    if (this.selectedType === null || this.selectedType === undefined) {
        this.msgerror =  'Veillez choisir un type !';
        this.op.show(e, document.getElementById('typ'));
    } else {
                if (this.selectedBanque === null || this.selectedBanque === undefined) {
                    this.msgerror =  'Veillez choisir une banque !';
                    this.op.show(e, document.getElementById('bnq'));
                } else {
                            const typ = this.sid;
                            const dateff = this.datefin1.toLocaleDateString('en-GB');
                            const datedeb = this.datedeb1.toLocaleDateString('en-GB');
                            const bnq = this.scode;
                            console.log('type :', typ);
                            console.log('datef :', dateff );
                            console.log('datedeb :', datedeb);
                            console.log('bnq :', bnq);

                        await this.achat0Service.EngagementFournisseurs(datedeb, dateff, bnq, typ)
                                .toPromise()
                                .then(data => {
                                    this.liste = data['_embedded'].engagementFournisseurs;
                                    console.log('liste', this.liste);


                        });

                        if (this.liste.length === 0) {
                          this.ejsg = false;
                          this.readOnly = false;
                          this.msgerror =  'aucun engagement !';
                          this.op.show(e, document.getElementById('affich'));
                        } else {
                            for (const et of this.liste) {
                                if (et.net !== null ) {
                                  et.net = Number(et.net).toFixed(3);
                                }
                                if (et.montant !== null ) {
                                  et.montant = Number(et.montant).toFixed(3);
                                }
                            }
                            console.log('lissssssssssssssssssssste ', this.liste);


                          this.btnNouvelSaisie = true;
                          this.readOnly = true;
                          this.ejsg = true;


                        }


                        this.visible = true;
                        this.editEnable = false;

                }}
            }

 strMois(mois: string) {
        // liste des mois
        let stmois = '';
        switch (mois) {
            case '01': stmois = 'Janvier';
                break;
            case '02': stmois = 'Février';
                break;
            case '03': stmois = 'Mars';
                break;
            case '04': stmois = 'Avril';
                break;
            case '05': stmois = 'Mai';
                break;
            case '06': stmois = 'Juin';
                break;
            case '07': stmois = 'Juillet';
                break;
            case '08': stmois = 'Août';
                break;
            case '09': stmois = 'Septembre';
                break;
            case '10': stmois = 'Octobre';
                break;
            case '11': stmois = 'Novembre';
                break;
            case '12': stmois = 'Décembre';
                break;
            default:

}
return stmois;
}



async appercu() {
  /* try {*/
    if (this.liste !== null && this.liste !== undefined && this.liste.length !== 0) {
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

     doc1.setFontSize(22);
     doc1.setFontStyle('Arial');
     doc1.setFontStyle('bold');
     doc1.setTextColor(0, 51, 153);
     doc1.text('Etat des engagements à payer', 50 , 32);

     doc1.setFontSize(12);
     doc1.setFontStyle('Arial');
     doc1.setTextColor(48, 48, 48);
     const dateimpression = new Date().toLocaleDateString('en-GB');
     doc1.text('Edit le  : ' + dateimpression, 166 , 32);

     doc1.setFontStyle('bold');
     doc1.text('Date d\'échéance du : ' + this.datedeb1 .toLocaleDateString('en-GB'), 10, 40);
     doc1.text('au : ' + this.datefin1.toLocaleDateString('en-GB'), 75, 40);
     doc1.text('Banque : ' + this.bnq, 10, 45);
     doc1.text( this.stext, 27, 50);





       let numPage = 1;
       doc1.setFontSize(12);
       doc1.setFontStyle('Arial');


       let i = 0;
       if ( this.liste.length > 1) {
        this.mois = this.liste[1].echeance.substring(5, 3);
        this.annee = this.liste[1].echeance.substring(10, 6);
       }

       let sommemontant = 0;
       let y = 54;

   while (i < this.liste.length) {
            sommemontant = 0;
            const moisi = this.liste[i].echeance.substring(5, 3);
            const anneei = this.liste[i].echeance.substring(10, 6);
            if (this.mois === moisi && this.annee === anneei ) {

                await this.achat0Service.ImpressionEngagementFournisseurs(this.datedeb1.toLocaleDateString('en-GB'), this.datefin1.toLocaleDateString('en-GB'),
                    this.scode, this.sid, this.mois, this.annee)
                    .toPromise()
                    .then(data => {
                      console.log('data impression', data );
                      this.listeimpression = data['_embedded'].engagementFournisseurs;
                    });


                    if (this.liste.listeimpression === 0) {

                    } else {
                        for (const et of this.listeimpression) {
                            if (et.net !== null ) {
                              et.net = Number(et.net).toFixed(3);
                            }
                            if (et.montant !== null ) {
                              et.montant = Number(et.montant).toFixed(3);
                            }
                        }
                      }




                     let y_lignevertical = y ;
                      // entete du  tableau
                      doc1.setFontSize(72);
                      doc1.setFontStyle('bold');
                      doc1.setLineWidth(0.15);
                      doc1.line(9, y, 205, y);
                       y = y + 6;

                    doc1.setFontSize(13);
                    doc1.setFontStyle('bold');
                    doc1.text('Fournisseurs', 10, y);
                    doc1.text('Facture', 55, y);
                    doc1.text('Date Fac', 85, y);
                    doc1.text('Echéance', 110, y);

                    doc1.text('Mnt en DVS',  133, y);
                    doc1.text('Devise',  164, y);
                    doc1.text('Mnt en DT', 182 , y);
                    y = y + 3;
                    // creer une ligne
                    doc1.setFontStyle('bold');
                    doc1.setLineWidth(0.15);
                    doc1.line(9, y, 205, y);

                    y = y + 7;
            for (const item of this.listeimpression) {
              doc1.setFontSize(10);
              doc1.setFontStyle('Arial');
              doc1.text(item.deno.substring(0, 19), 10, y);
              doc1.text(item.numero, 56, y);
              doc1.text(item.date, 85, y);
              doc1.text(item.echeance, 110, y);
              if (item.net === null) {
                item.net = '';
                }

              if (item.montant === null) {
                item.montant = '';
                }
              doc1.text(item.montant,  158, y, 'right');
              if (item.devise === null) {
                item.devise = '';
                 }
              doc1.text(item.devise,  165, y);
              doc1.text(item.net, 203, y, 'right');
              if (item.net === '') {
                item.net = '0';
              }

              sommemontant = sommemontant + parseFloat(item.net);

              y = y + 7;
              if (y > 267) {
                doc1.line(9, y_lignevertical, 9, y - 4);
                doc1.line(205, y_lignevertical, 205, y - 4);
              } else {
                doc1.line(9, y_lignevertical, 9, y);
                doc1.line(205, y_lignevertical, 205, y);
              }



        // passer a une nouvelle page
        if (y > 257) {
                  doc1.setLineWidth(0.45);
                  doc1.line(5, 285, 206, 285, 'FD');
                  doc1.setFontStyle('bold');
                  doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                  numPage++;
                  doc1.addPage();
                  y = 17;
                //  y_lignevertical = y - this.listeimpression.length - 13 ;
                y_lignevertical = 13;
             } else {

             }
            }




              doc1.setFontSize(72);
              doc1.setLineWidth(0.15);
              doc1.setFontStyle('bold');
              doc1.line(9, y, 205, y);
/////////////////


              y = y + 5;
              doc1.setFontSize(13);
              doc1.setFontStyle('bold');

              const somme = (Math.round(sommemontant * 100) / 100).toFixed(3);


             doc1.text('Total:  ' + this.strMois(this.mois)  + '/' + this.annee, 95, y  );
              doc1.text(somme.toString(), 203, y , 'right' );
              // y = y + 1;
              doc1.setLineWidth(0.15);
              doc1.setFontStyle('bold');
            //  doc1.line(9, y, 205, y);


                  y = y + 5;
              i = i + this.listeimpression.length ;
              console.log('i= ', i);
            } else {
              this.mois = moisi;
              this.annee = anneei;
            }


       }
        doc1.setFontSize(13);
        doc1.line(10, 280, 200, 280, 'FD');
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        window.open(doc1.output('bloburl'), '_blank');

} else {
    console.log('aucune facture');

}

/*} catch {
       console.log(' methode apperçu');

     }*/

}

}
