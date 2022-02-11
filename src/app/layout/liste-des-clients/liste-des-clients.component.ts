import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n} from '@syncfusion/ej2-base';
import { ZoneService } from '../services/zone.service';
import { Zone } from '../services/zone';
import { Vendeur1Service } from '../services/vendeur1.service';
import { SecteurService } from '../services/secteur.service';
import { Secteur } from '../services/secteur';
import { Groupe } from '../services/groupe';
import { GroupeService } from '../services/groupe.service';
import { ClientService } from '../services/client.service';
import { ExcelService } from '../services/excel.service';
import * as jspdf from 'jspdf';
import { SteService } from '../services/ste.service';
import { Ste } from '../services/ste';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Vendeur1 } from '../services/vendeur1';
import { OverlayPanel } from 'primeng/primeng';
import {formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
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
  selector: 'app-liste-des-clients',
  templateUrl: './liste-des-clients.component.html',
  styleUrls: ['./liste-des-clients.component.scss'],
  providers: [ ExcelService]

})
export class ListeDesClientsComponent implements OnInit {

  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('grid')
  public grid2: GridComponent;
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  codevendeur = '' ;
  codegroupe = '';
  codezone = '' ;
  vendeurs: any;
  personnes: any;
  ngselectDisabled = true ;
  ste: Ste;
  societe: any;
  selectedVendeur: any ;
  codesecteur = '';
  activite: any ;
  groupe: any ;
  data: any ;
  readonlynom = true;
  readonly = true;
  denozone = 'Global' ;
  zones: Zone [] ;
  display = false;
  SelectedZone: Zone = {
    id : '',
    code: '',
    deno: '',
  };
  existezone = false ;
  existesecteur = false ;
  valideCode = true;
   denosecteur = 'Global';
   secteurs: Secteur [];
   groupes: Groupe [] ;
   clients: any;
   tab_client: any ;
   clientstraitment: any;
   afficherClicked = false;
   valide = true;
   selectedGroupe: Groupe = {
    id : '',
    code: '',
    deno: '',
   };
   public customAttributes: Object;
   progressVisible = false;
   denogroupe = '';
   selectedSecteur: Secteur = {
    id : '',
    code: '',
    deno: '',
   } ;
   date = '';
   denotypologie = '';
   selectedTypologie: any ;
   selectedType: any ;
   selectedNature: any ;
   option = {id: '', text: 'Tout', } ;
   nature = '' ;
   tab_client_grid: any;
   typologies: Array<{id: string , text: string }> = [
    {id: 'N', text: 'N'},
    {id: 'M', text: 'M'},
    {id: 'S', text: 'S'},
    {id: 'C', text: 'C'},
    {id: 'P', text: 'P'},
    {id: 'I', text: 'I'}
    ];
    natures: Array<{id: string , text: string }> = [
      {id: '', text: 'Tout', },
      {id: 'P', text: 'Privé'},
      {id: 'E', text: 'Etatique'}
      ];
    codetypologie = '';
   typescomm: Array<{id: string , text: string }> = [
    {id: '', text: 'Tout'},
    {id: 'R', text: 'Revendeur'},
    {id: 'C', text: 'Consomateur'},
    ];
    typecomm = '' ;
   typeclient = 'Tout';
   natureclient = 'Tout';
   denoclient = '';
   codenature = '';
   codetype = '';
   wasInside: boolean ;
   secteur: any;
  btnafficher: boolean;
  constructor(private zoneService: ZoneService,
              private vendeur1Service: Vendeur1Service,
              private secteurService: SecteurService,
              private groupeService: GroupeService,
              private clientService: ClientService,
              private excelService: ExcelService,
              private steService: SteService,
              private config: NgSelectConfig) {
                this.config.notFoundText = 'Aucun élément trouvé';
                this.config.clearAllText = 'Supprimer tous';
                }
  ngOnInit() {
    this.btnafficher = true;

    // charger vendeurs
    this.vendeur1Service.getVendeur1ByDeno().toPromise().then(
      (data) => {
        this.vendeurs = data['_embedded'].vendeur1;
      }
    );
    // charger les groupes
    this.groupeService.getGroupeByDeno('').toPromise().then(
      (data) => {
        this.groupes = data['_embedded'].groupes;
      }
    );
     // charger les secteurs
    this.secteurService.getSecteurByDeno().toPromise().then(
      (data) => {
        this.secteurs = data['_embedded'].secteurs;

      }
    );
     // charger les zones
    this.zoneService.getZoneByDeno().toPromise().then(
      (data) => {
        this.zones = data['_embedded'].zones;

      }
    );
    // initialiser
    this.selectedType = {id: '', text: 'Tout', };
    this.selectedNature = {id: '', text: 'Tout', };
    this.clients = new Array() ;
    this.SelectedZone = null;
    this.selectedVendeur = null;
    this.selectedType = null;
    this.selectedTypologie = null;
    this.selectedNature = null;
    this.selectedSecteur = null;
    this.selectedGroupe = null;
  }
  @HostListener('document:click')
    clickout() {
      if (!this.wasInside) {
        this.ovo.hide();

      }
      this.wasInside = false;

    }
    // mles méthodes de recherche en front end pour les ng select
    public onSearchZones(word: string, item: Zone): boolean {
      return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchVendeurs(word: string, item: Vendeur1): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}
public onSearchGroupes(word: string, item: Groupe): boolean {
  return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}
public onSearchSecteurs(word: string, item: Secteur): boolean {
  return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}

/// la méthode pour afficher les clients selon les critères
  async Afficher (e) {

    this.wasInside = true;
    this.afficherClicked = true;
    this.ovo.hide();
    // test sur les input et les ng select
    if (String(this.selectedTypologie) === 'null' || String(this.selectedTypologie) === 'undefined'
    || this.selectedTypologie === null || this.selectedTypologie === undefined) {
    } else {
      this.codetypologie = this.selectedTypologie.id;
      this.denotypologie = this.selectedTypologie.text ;

    }
    if (String(this.selectedType) === 'null' || String(this.selectedType) === 'undefined'
    || this.selectedType === null || this.selectedType === undefined) {

     } else {
      this.typeclient = this.selectedType.text;
       this.codetype = this.selectedType.id ;

      }
      if (String(this.selectedNature) === 'null' || String(this.selectedNature) === 'undefined'
      || this.selectedNature === null || this.selectedNature === undefined) {
      } else {
        this.codenature = this.selectedNature.id ;
        this.natureclient = this.selectedNature.text;
      }
    if (this.SelectedZone !== null) {
      this.codezone = this.SelectedZone.code ;
      this.denozone = this.SelectedZone.deno;
    }
    if (this.selectedSecteur !== null) {
      this.codesecteur = this.selectedSecteur.code ;
      this.denosecteur = this.selectedSecteur.deno;
    }
    if (this.selectedVendeur !== null) {
      this.codevendeur = this.selectedVendeur.code ;
      this.denoclient = this.selectedVendeur.deno ;
    }
    if (this.selectedGroupe !== null) {
      this.codegroupe = this.selectedGroupe.code ;
    }


     // afficher
    await this.clientService.rechercherClient(this.codezone, this.codetypologie, this.codesecteur,
       this.codetype, this.codenature, this.codevendeur, this.codegroupe).toPromise().then(
      (data) => {
        // datasource pour le grid
        console.log(data);
        this.clients = data['_embedded'].listeClientses ;
        // datasource pour le traitement
        this.clientstraitment = data['_embedded'].listeClientses ;
      }
    );

    if (this.clients.length > 0) {

      // pour l'affichage en front end
      for (this.tab_client_grid of this.clients) {
        this.btnafficher = false;
        if (this.tab_client_grid.objectif === null || String(this.tab_client_grid.objectif) === '') {
        this.tab_client_grid.objectifT = '';
        } else  {
          this.tab_client_grid.objectifT = parseFloat(this.tab_client_grid.objectif).toFixed(3);
          }

      }

       } else {
        this.btnafficher = true;
       }
    this.wasInside = true;
    // si pas des clients
    if (this.clients.length === 0) {
      this.valide = false;
      this.ms = 'Aucun client trouvé pour ces critères!';
     this.ovo.show(e, document.getElementById('btn'));
     this.afficherClicked = false;
    this.ngselectDisabled = true ;
    this.clients = null;
    this.clientstraitment = null ;
    this.typeclient = 'Tout';
    this.natureclient = 'Tout';
    this.codetype = '';
    this.codenature = '';

    this.denotypologie = '';
    this.denoclient = '';
    this.denozone = 'Global';
    this.denosecteur = 'Global';
    this.typecomm = '' ;
    this.nature = '' ;
    this.codezone = '';
    this.codetypologie = '';
    this.codesecteur = '';
    this.codevendeur = '';
    this.codegroupe = '';

    } else {
      this.ngselectDisabled = false ;
      this.valide = true;
      this.afficherClicked = true ;



    }
    console.log(this.clients);
  }
  // methode excel
  Excel(args): void {

    try {
      if ( this.clientstraitment === undefined) {

      } else {

        const exportExcel = this.clientstraitment.map(
         obj => {

          if ( (obj.objectif) !== null) {
             return {
                 'Code' : obj.code,
                 'Raison Social': obj.deno,
                 'Tél': obj.tel,
                 'Fax': obj.fax,
                 'Echéance': obj.ech,
                 'Objectif': parseFloat(obj.objectif).toFixed(0),
                 'Typologie': obj.mag,
                 'activité': obj.denoActivite,
                 'Rev/Cons': obj.typeComm,
                 'Etat/Priv': obj.nature,
             }; } else {
              return {
                'Code' : obj.code,
                'Raison Social': obj.deno,
                'Tél': obj.tel,
                'Fax': obj.fax,
                'Echéance': obj.ech,
                'Objectif': '',
                'Typologie': obj.mag,
                'activité': obj.denoActivite,
                'Rev/Cons': obj.typeComm,
                'Etat/Priv': obj.nature,
            };
             }
            }
     );
       this.excelService.exportAsExcelFile(exportExcel, 'Liste des clients' + this.denoclient + 'de la zone '
       + this.denozone + 'et du nature: ' + this.natureclient + 'et du  type' + this.typeclient + 'et de la classe:' + this.denotypologie);
      }
     } catch {

     }
}
// pour le réaisir
  async NouvelleSaisie () {
    this.btnafficher = true;
    this.valide = false ;
    this.afficherClicked = false;
    this.ngselectDisabled = true ;
    this.clients = null;
    this.clientstraitment = null ;
    this.typeclient = 'Tout';
    this.natureclient = 'Tout';
    this.codetype = '';
    this.codenature = '';

    this.denotypologie = '';
    this.denoclient = '';
    this.denozone = 'Global';
    this.denosecteur = 'Global';
    this.typecomm = '' ;
    this.nature = '' ;
    this.codezone = '';
    this.codetypologie = '';
    this.codesecteur = '';
    this.codevendeur = '';
    this.codegroupe = '';

  }
  // imprimer
  async Imprimer (evenement) {
    const doc1 = new jspdf();
    doc1.setFontSize(10);
    doc1.setFontStyle('Arial');
    await this.steService
    .getSte()
    .toPromise()
    .then(data => {
      this.ste = data['_embedded'].ste;
      this.societe = this.ste[0];
    });
    doc1.text('SOCIETE.: ' + this.societe.societe, 15, 15);
    doc1.text('ADRESSE: ' + this.societe.adresse, 15, 20);
    const temps = formatDate(new Date(), ' HH:mm:ss ', 'fr-FR', '+01');
    this.date = new Date().toLocaleDateString('en-GB');
        doc1.text('Tunis, le   : ' + this.date + '  ' + temps, 145, 15);
        doc1.setFontSize(18);
        doc1.setFontStyle('bold');
        doc1.setFontStyle('Arial');
        doc1.text('Liste des Clients', 92, 28);
        doc1.setFontSize(11);
        doc1.setFontStyle('Arial');
        doc1.text('Zone de recouvrement ' , 15, 33);
        doc1.text (this.denozone, 51, 33);
        doc1.text('Classe ', 15, 39 );
        doc1.text (this.denotypologie, 51, 39);
        doc1.text('Secteur ', 15, 45);
        doc1.text (this.denosecteur, 51, 45);
        doc1.text('Type client ' , 15, 51);
        doc1.text (this.typeclient, 51, 51);
        doc1.text('Nature client ' , 15, 57);
        doc1.text (this.natureclient, 51, 57);
        doc1.text('Client ' , 15, 63);
        doc1.text (this.denoclient, 51, 63);
        // entete tabl
        doc1.setFontSize(10);
        doc1.line(9, 66, 205, 66);

        doc1.setFontSize(10);
        doc1.setFontStyle('bold');
        doc1.text('Code', 10, 70);
        doc1.text('Nom Client', 28, 70);
        doc1.text('Télé.', 82, 70);
        doc1.text('Fax', 103, 70);
        doc1.text('Objectif', 127, 70);
        doc1.text('Ech', 143, 70);
        doc1.text('Cls', 151, 70);
        doc1.text('Sect', 158, 70);
        doc1.text('R/C', 185, 70);
        doc1.text('Et/P', 196, 70);

        doc1.setFontStyle('bold');
        doc1.line(9, 72, 205, 72);
        let y = 75;
        let numPage = 1;

        if ( this.clientstraitment === null || this.clientstraitment === undefined) {
        } else {
        for (this.tab_client of this.clientstraitment) {

          doc1.setFontSize(7);
          doc1.setFontStyle('Arial');
          if (this.tab_client.objectif === null || String(this.tab_client.objectif) === '') {
            this.tab_client.objectif = '';
            } else  {
              this.tab_client.objectif = parseFloat(this.tab_client.objectif).toFixed(3);
              }
            if (this.tab_client.ech === null || String(this.tab_client.ech) === '') {
                this.tab_client.ech = '';
            }
            if (this.tab_client.mag === null || String(this.tab_client.mag) === '') {
                  this.tab_client.mag = '';
            }
            if (this.tab_client.denoActivite === null || String(this.tab_client.denoActivite) === '') {
                    this.tab_client.denoActivite = '';
            }
            if (this.tab_client.typeComm === null || String(this.tab_client.typeComm) === '') {
                      this.tab_client.typeComm = '';
            }
            if (this.tab_client.nature === null || String(this.tab_client.nature) === '') {
              this.tab_client.nature = '';
            }
            if (this.tab_client.tel === null || String(this.tab_client.tel) === '') {
              this.tab_client.tel = '';
            }
            if (this.tab_client.fax === null || String(this.tab_client.fax) === '') {
              this.tab_client.fax = '';
            }

          doc1.text(String(this.tab_client.code), 10, y);
          doc1.text(String(this.tab_client.deno), 28, y);
          doc1.text(String(this.tab_client.tel), 82, y);
          doc1.text(String(this.tab_client.fax), 103, y);
          doc1.text(String(this.tab_client.objectif), 129, y);
          doc1.text(String(this.tab_client.ech), 145, y);
          doc1.text(String(this.tab_client.mag), 153, y);
          doc1.text(String(this.tab_client.denoActivite), 158, y);
          doc1.text(String(this.tab_client.typeComm), 187, y);
          doc1.text(String(this.tab_client.nature), 198, y);

          y = y + 5;

          // passer a une nouvelle page

          if (y > 277) {
            numPage++;
            doc1.addPage();
            // entete tableau
            doc1.setFontSize(10);
        doc1.line(9, 12, 205, 12);

        doc1.setFontSize(10);
        doc1.setFontStyle('bold');
        doc1.text('Code', 10, 16);
        doc1.text('Nom Client', 28, 16);
        doc1.text('Télé.', 82, 16);
        doc1.text('Fax', 103, 16);
        doc1.text('Objectif', 127, 16);
        doc1.text('Ech', 143, 16);
        doc1.text('Cls', 151, 16);
        doc1.text('Sect', 158, 16);
        doc1.text('R/C', 185, 16);
        doc1.text('Et/P', 196, 16);

        doc1.setFontStyle('bold');
        doc1.line(9, 18, 205, 18);
            y = 23;
          }

        }
      }

        if (evenement === 'preview' ) {
          window.open(doc1.output('bloburl'), '_blank');
        }
        this.progressVisible = false;



  }

}
