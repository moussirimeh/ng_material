import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Elivraison } from '../services/elivraison';
import { ElivraisonService } from '../services/elivraison.service';
import {LivreurService} from '../services/livreur.service';
import * as jspdf from 'jspdf';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import { RecettesBonSortie } from '../services/RecettesBonSortie';
import { RecettesService } from '../services/recettes.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-vente-dup-bs',
  templateUrl: './vente-dup-bs.component.html',
  styleUrls: ['./vente-dup-bs.component.scss'],
  providers: [MessageService]
})
export class VenteDupBsComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;
  msgerror: string;
  elivraisons: Elivraison[];
  elivraison: Elivraison = {
    id: null,
    numero: '',
    dated: '',
    datef: '',
    livreur: '',
    camuion: ''
  };
  chauffeur: any;
  date: string;
  numero: string;
  chauff: string;
  constructor(
    private elivraisonService: ElivraisonService,
    private messageService: MessageService,
    private steService: SteService,
    private recettesService: RecettesService,
    private config: NgSelectConfig,
    private livreurService: LivreurService

    ) {
      this.config.notFoundText = 'Aucun élément trouvé';
      this.config.clearAllText = 'Supprimer tous ';
    }
  ste: Ste;
  wasInside: boolean;
  readonly = false;
  Societe: Ste;
  recBS: RecettesBonSortie[];
  public customAttributes: Object;
  async ngOnInit() {
    this.customAttributes = { class: 'customcss' };
    document.getElementById('num').focus();
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
       this.messageService.clear();
       this.op.hide();

    }
    this.wasInside = false;

  }

  verifierNumero() {
    if (this.numero === 'null') {
      this.numero = '';
    } else {
      switch (this.numero.length) {
        case 1: {
          this.numero = '0000' + this.numero;
          break;
        }
        case 2: {
          this.numero = '000' + this.numero;
          console.log(this.numero);
          break;
        }
        case 3: {
          this.numero = '00' + this.numero;
          break;
        }
        case 4: {
          this.numero = '0' + this.numero;
          break;
        }
        default: {
          break;
        }
      }
    }
  }



  getByNumero(e) {
    this.messageService.clear();
    this.wasInside = true;
    // recuperer bon de sortie selon numero
     this.elivraisonService
            .getElivraisonByNumero(this.numero)
            .toPromise()
            .then(data => {
              this.elivraison = data['_embedded'].elivraisons[0];
              console.log(this.elivraison);
              // si bon de sortie inéxistant
              if (this.elivraison === undefined) {
                this.msgerror = 'Bon de sortie inéxistant !';
                  this.op.show(e, document.getElementById('num'));

              } else {
                    console.log('bs methode getByNumero() ', this.elivraison);
              }
      });
  }
  async afficher(e) {
    // recuperer bon de sortie selon numero
    this.elivraisonService
      .getElivraisonByNumero(this.numero)
      .toPromise()
      .then(async data => {
        this.elivraison = data['_embedded'].elivraisons[0];
        console.log(this.elivraison);

        // si bon de sortie inéxistant
        if (this.elivraison === undefined) {
             this.msgerror = 'Bon de sortie inéxistant !';
             this.op.show(e, document.getElementById('num'));
        } else {
          if (this.elivraison.datef !== null) {

           await this.livreurService.getByCode(this.elivraison.livreur)
                .toPromise()
                .then(data => {
                  this.chauff = data.nom;
                  console.log('data chauffeur', data);
                  console.log('chauff', this.chauff);
            });

           await this.recettesService
                .duplicataBS(this.numero)
                .toPromise()
                .then(data => {
                  this.recBS = data['_embedded'].recettesBonSorts;
                  console.log('recettes ', this.recBS);
              });

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
                this.Societe = this.ste[0];
                console.log(this.Societe);
              });

            doc1.text('Société  : ' + this.Societe.societe, 15, 20);
          /*  doc1.text('Adresse : ' + this.Societe.adresse, 15, 25);
            doc1.text('Ville      : ' + this.Societe.ville, 15, 30);
            doc1.text('Tel         : ' + this.Societe.tel, 15, 35);
            doc1.text('Fax         : ' + this.Societe.fax, 15, 40);
            doc1.text('email       : ' + this.Societe.email, 15, 45);*/
           let temps = String(new Date().getUTCHours() + 1);
           temps = temps + ':' + String(new Date().getUTCMinutes());
           temps = temps + ':' + String(new Date().getUTCSeconds());
           // toLocaleTimeString();
            console.log('teeeeeeeeeeeemps ', temps);

            this.date = new Date().toLocaleDateString('en-GB');


            doc1.text('Tunis, le : ' + this.date + '  ' + temps, 140, 20);

            doc1.setFontSize(20);
            doc1.text('Bon de sortie N° ' + this.elivraison.numero, 70, 35);

            doc1.setFontSize(12);
            doc1.setFontStyle('Arial');
            doc1.text('Nom du chauffeur : ' + this.chauff , 15, 45);
            doc1.text('Numero du camion : ' + this.elivraison.camuion, 15, 50);
            doc1.text('Date du          : ' + this.elivraison.dated, 15, 55);
            doc1.text('Jusqu\'au         : ' + this.elivraison.datef, 80, 55);



            // entete tableau des recettes
            doc1.setFontSize(12);
            doc1.setFontStyle('bold');
            doc1.text('Client', 10, 67);
            doc1.text('Adresse', 80, 67);
            doc1.text('N° BL/F', 150, 67);
            doc1.text('Nbre de Colis', 175, 67);
            // creer la ligne
            doc1.setFontStyle('bold');
            doc1.line(9, 72, 205, 72);
            // afficher la liste des recettes
            let y = 80;
            let numPage = 1;
            doc1.setFontSize(10);
            doc1.setFontStyle('Arial');
            for (const rec of this.recBS) {
              doc1.setFontSize(9);
              doc1.setFontStyle('Arial');
              doc1.text(rec.nomClient, 10, y);
              doc1.text(rec.adresseClient, 80, y);
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
                doc1.text('Adresse', 80, 24);
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
            window.open(doc1.output('bloburl'), '_blank');
            this.ngOnInit();
            // message de suivi pour le processus de visualisation

          } else {
             this.msgerror = 'Bon de sortie est ouvert !';
             this.op.show(e, document.getElementById('num'));

          }
        }
      });
  }
}
