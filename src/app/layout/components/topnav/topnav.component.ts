import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { enableRipple } from '@syncfusion/ej2-base';
import {
  MenuItemModel,
  MenuEventArgs,
} from '@syncfusion/ej2-angular-navigations';
import { closest } from '@syncfusion/ej2-base';
import {
  BeforeOpenCloseMenuEventArgs,
  MenuAnimationSettingsModel,
} from '@syncfusion/ej2-angular-navigations';
import { TopnavService } from './topnav.service';
import { MenuItems } from './MenuItems';
import { LoginService } from 'src/app/login/login.service';
import { Dialog, OverlayPanel } from 'primeng/primeng';
import {
  MenuComponent,
  FieldSettingsModel,
} from '@syncfusion/ej2-angular-navigations';
import { FaService } from '../../services/fa.service';
import { RepresanService } from '../../services/represan.service';
import { SteService } from '../../services/ste.service';
import { MouveinventService } from '../../services/mouveinvent.service';
import { globals } from 'src/environments/environment';
enableRipple(true);

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopnavComponent implements OnInit {
  @ViewChild('menuID')
  private menuObj: MenuComponent;
  errorMessage = '';
  dateServeur = '';
  DateServeur: Date;
  year: number;
  month: number;
  dateinvent: string;
  invent: string;
  msg: string;
  cd: string;
  emplacement: string;
  emp: string;
  cod: string;
  blocked = true;
  listemp: any;
  constructor(
    public router: Router,
    private translate: TranslateService,
    private topnavService: TopnavService,
    private loginService: LoginService,
    private faService: FaService,
    private represanService: RepresanService,
    private steService: SteService,
    private mouveinventService: MouveinventService
  ) {
    this.router.events.subscribe((val) => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 100 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }
  private hiddenItems: string[] = [
    'Vente Instance',
    'Avoir Instance',
    'Enr Fre Fournisseur',
    'Modif Fre Fournisseur',
    'Transf Fre Frn Achat',
    'Doc Att Code Barre',
    'Impression des Traites',
    'Rapport Ventes Instance',
    'Rapport Instance Reglees',
    'Rapport transfert',
    'Reglemnt Instance',
    'Facture Magasin',
    'Etat Relance',
    'Toutes Les CMDs FRS',
    'Rapport Instance',
    'Rapport Duplicata C',
    'Rapport Instance ',
    'Etat Fres Exonorees',
    'Modification PAP',
    'Stock Profiler',
    'Etat Rupture Stock',
  ];
  showConfirmFactCollective = false;
  showConfirmINV = false;
  showINV = false;

  displayErrorDialog = false;
  mdpFactCollective = '';
  mdpInventaire = 'invokok';
  mdpInvent = null;

  listemouve_inv: any;

  public pushRightClass: string;
  public pushLeftClass: string;
  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  styleOvPanelError = {
    'text-align': 'center',
    'font-size': '14px',
    'background-color': ' #f8b7bd',
  };
  styleOvPanelSuccess = {
    'text-align': 'center',
    'font-size': '12px',
    'background-color': ' #b7d8b7',
  };
  styleOvPanel = {};
  public menuItems: MenuItemModel[] = [];
  public menus = [
    'NOMENCLATURE GENERAL',
    'VENTE',
    'OFFRE ET CMDS CLIENTS',
    'PROFORMAT ET CMDS FOURNISSEURS',
    'RAPPORTS',
    'ANALYSE',
    'GESTION DES CAISSES',
    'ADMINISTRATION',
    'COMPTABILITE',
    'CONTENTIEUX',
    'GESTION COMMERCIAUX',
    'INVENTAIRE',
  ];
  public animation: MenuAnimationSettingsModel = { duration: 800 };
  public IAmDoingSomething = true;
  public login: string;
  public mdp: string;
  public menuText = [[], [], [], [], [], [], [], [], [], [], [], []];
  /*public menuText1;
  public menuText2;
  public menuText3;
  public menuText4;
  public menuText5;
  public menuText6;
  public menuText7;
  public menuText8;
  public menuText9;
  public menuText10;
  public menuText11;*/
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }

  async ngOnInit() {
    await this.steService
      .getDateServeur()
      .toPromise()
      .then((dataa: string) => (this.dateServeur = dataa));
    const nameObj1 = [
      { text: 'Consultation Référence', iconCss: 'em-icons e-righttick' },
      { text: 'Ajout-Modif-Supp Référence', iconCss: 'em-icons e-righttick' },
      { text: 'Gestion des equivalences', iconCss: 'em-icons e-righttick' },
      { text: 'Fusion Références', iconCss: 'em-icons e-righttick' },
      { text: 'Ajustement Référence', iconCss: 'em-icons e-righttick' },
      { text: 'Catalogue des prix', iconCss: 'em-icons e-righttick' },
      { text: 'Consultation Client', iconCss: 'em-icons e-righttick' },
      { text: 'Consultation Fournisseur', iconCss: 'em-icons e-righttick' },
      { text: 'Ajout-Modif-Supp Fournisseur', iconCss: 'em-icons e-righttick' },
      { text: 'Liste des Marques', iconCss: 'em-icons e-righttick' },
      { text: 'Ajout-Modif-Supp des marques', iconCss: 'em-icons e-righttick' },
      { text: 'Changement Référence', iconCss: 'em-icons e-righttick' },
      { text: 'Liste des Familles', iconCss: 'em-icons e-righttick' },
      { text: 'Ajout-Modif-Supp Famille', iconCss: 'em-icons e-righttick' },
      { text: 'Liste des Sous Familles', iconCss: 'em-icons e-righttick' },
      {
        text: 'Ajout-Modif-Supp sous Familles',
        iconCss: 'em-icons e-righttick',
      },
      { text: 'Affectation Marque', iconCss: 'em-icons e-righttick' },
      {
        text: 'Ajout-Modif-Supp Réf + Modif PRIX',
        iconCss: 'em-icons e-righttick',
      },
      { text: 'Ajout Nouveau Client', iconCss: 'em-icons e-righttick' },
      { text: 'Modification Client', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj2 = [
      { text: 'Vente au Comptant', iconCss: 'em-icons e-righttick' },
      { text: 'Avoir Comptant', iconCss: 'em-icons e-righttick' },
      { text: 'Vente cpt avec Reservation', iconCss: 'em-icons e-righttick' },
      { text: 'Avoir cpt Reservation', iconCss: 'em-icons e-righttick' },
      { text: 'Vente Terme B/l', iconCss: 'em-icons e-righttick' },
      { text: 'Avoir Terme B/l', iconCss: 'em-icons e-righttick' },
      { text: 'Vente Terme avec Reserv', iconCss: 'em-icons e-righttick' },
      { text: 'Avoir Terme avec Reserv', iconCss: 'em-icons e-righttick' },
      { text: 'Reservation de stock', iconCss: 'em-icons e-righttick' },
      { text: 'Vente Instance' },
      { text: 'Avoir Instance' },
      {
        text: 'Duplicata',
        items: [
          { text: 'B/Livraison', iconCss: 'em-icons e-righttick' },
          { text: 'Comptant .P.', iconCss: 'em-icons e-righttick' },
          { text: 'Avoir B/L', iconCss: 'em-icons e-righttick' },
          { text: 'Avoir CPT .P.', iconCss: 'em-icons e-righttick' },
          { text: 'Comptant Res', iconCss: 'em-icons e-righttick' },
          { text: 'Avoir CPT Res', iconCss: 'em-icons e-righttick' },
          { text: 'B/L Trm Réserv', iconCss: 'em-icons e-righttick' },
          { text: 'Av Trm Réserv', iconCss: 'em-icons e-righttick' },
        ],
        iconCss: 'em-icons e-righttick',
      },
      { text: 'Livraison', iconCss: 'em-icons e-righttick' },
      { text: 'Ajout bon de Sortie', iconCss: 'em-icons e-righttick' },
      { text: 'Modif  bon de Sortie', iconCss: 'em-icons e-righttick' },
      { text: 'Annul  bon de Sortie', iconCss: 'em-icons e-righttick' },
      { text: 'Consultation bon de Sortie', iconCss: 'em-icons e-righttick' },
      { text: 'liste BS Ouverts', iconCss: 'em-icons e-righttick' },
      { text: 'liste BS Fermes', iconCss: 'em-icons e-righttick' },
      { text: 'Fermeture Bon Sortie', iconCss: 'em-icons e-righttick' },
      { text: 'Duplicata BS', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport des BS Fermés', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport des Livraisons', iconCss: 'em-icons e-righttick' },
      { text: 'Consultation Livraison', iconCss: 'em-icons e-righttick' },
      { text: 'Analyse CA Vendeur', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj3 = [
      { text: 'Nouvelle Offre(RG,MG)', iconCss: 'em-icons e-righttick' },
      { text: 'Modification Offre(RG,MG)', iconCss: 'em-icons e-righttick' },
      { text: 'Annulation Offre', iconCss: 'em-icons e-righttick' },
      { text: 'Copie Offre', iconCss: 'em-icons e-righttick' },
      { text: 'Etat Offre Envoye', iconCss: 'em-icons e-righttick' },
      { text: 'Nouvelle CMDs Client', iconCss: 'em-icons e-righttick' },
      { text: 'Modification CMDs Client', iconCss: 'em-icons e-righttick' },
      { text: 'Annulation CMDs Client', iconCss: 'em-icons e-righttick' },
      { text: 'Etat CMDs Client', iconCss: 'em-icons e-righttick' },
      { text: 'Offres / Clients', iconCss: 'em-icons e-righttick' },
      { text: 'Offres / Fournisseur', iconCss: 'em-icons e-righttick' },
      { text: 'Offres / Article', iconCss: 'em-icons e-righttick' },
      { text: 'Offres / Client / An', iconCss: 'em-icons e-righttick' },
      { text: 'Nouvelle Offre', iconCss: 'em-icons e-righttick' },
      { text: 'Modification Offre', iconCss: 'em-icons e-righttick' },
      { text: 'Etat des Visites Clients', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj4 = [
      { text: 'Nouveau Proforma', iconCss: 'em-icons e-righttick' },
      { text: 'Modification Proforma', iconCss: 'em-icons e-righttick' },
      { text: 'Annulation Proforma', iconCss: 'em-icons e-righttick' },
      { text: 'Nouvelle Commande', iconCss: 'em-icons e-righttick' },
      { text: 'Modification Commande', iconCss: 'em-icons e-righttick' },
      { text: 'Annulation Commande', iconCss: 'em-icons e-righttick' },
      { text: 'Duplicata Commande', iconCss: 'em-icons e-righttick' },
      { text: 'Achat', iconCss: 'em-icons e-righttick' },
      { text: 'Avoir sur Achat', iconCss: 'em-icons e-righttick' },
      { text: 'Relance Dynamique', iconCss: 'em-icons e-righttick' },
      { text: 'liste des Proformas', iconCss: 'em-icons e-righttick' },
      {
        text: 'Objectifs des  Fournisseurs / Realise ',
        iconCss: 'em-icons e-righttick',
      },
      { text: 'Etat Rupture Stock' },
      { text: 'Etat stock mort', iconCss: 'em-icons e-righttick' },
      { text: 'Reedition Rapport Achat', iconCss: 'em-icons e-righttick' },
      { text: 'Deficit Commande Frs', iconCss: 'em-icons e-righttick' },
      { text: 'Verification Commande', iconCss: 'em-icons e-righttick' },
      { text: 'Enr Fre Fournisseur' },
      { text: 'Modif Fre Fournisseur' },
      { text: 'Transf Fre Frn Achat' },
      { text: 'Doc Att Code Barre' },
    ];
    const nameObj5 = [
      { text: 'Etat Facture', iconCss: 'em-icons e-righttick' },
      { text: 'Facturation Individuelle', iconCss: 'em-icons e-righttick' },
      { text: 'Reconstitution Fre Terme', iconCss: 'em-icons e-righttick' },
      { text: 'Impression des Facture', iconCss: 'em-icons e-righttick' },
      { text: 'Impression des Traites' },
      { text: 'Rapport Comptant', iconCss: 'em-icons e-righttick' },
      { text: 'Etat Avoirs Comptant', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport Ventes Instance' },
      { text: 'Rapport Reservation', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport Instance Reglees' },
      { text: 'Rapport transfert' },
      { text: 'B/L En cours', iconCss: 'em-icons e-righttick' },
      { text: 'Reglemnt Instance' },
      { text: 'Facture Magasin' },
      { text: 'Etat TVA', iconCss: 'em-icons e-righttick' },
      { text: 'Etat Avoir Cpt Caisse', iconCss: 'em-icons e-righttick' },
      { text: 'liste des Clients', iconCss: 'em-icons e-righttick' },
      { text: 'Annulation Fre Terme', iconCss: 'em-icons e-righttick' },
      { text: 'Enreg Bon de Commande', iconCss: 'em-icons e-righttick' },
      { text: 'Modification B/L', iconCss: 'em-icons e-righttick' },
      { text: 'Annulation B/L', iconCss: 'em-icons e-righttick' },
      { text: 'Etat Avoirs Terme', iconCss: 'em-icons e-righttick' },
      { text: 'Ventes en Suspension TVA', iconCss: 'em-icons e-righttick' },
      { text: 'Facturation collective', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj6 = [
      { text: 'Etat Relance' },
      { text: 'CMDs FRS non Soldees', iconCss: 'em-icons e-righttick' },
      { text: 'Toutes Les CMDs FRS' },
      { text: 'Stock en Mouvement', iconCss: 'em-icons e-righttick' },
      { text: 'Stock Stable', iconCss: 'em-icons e-righttick' },
      { text: 'Valorisation', iconCss: 'em-icons e-righttick' },
      { text: 'Obejectifs FRS/CMDs', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport des entrées', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport des sorties', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport Ajustements', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport FRE Client', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport Instance' },
      { text: 'Rapport Duplicata C' },
      { text: 'Rapport Ventes a Perte', iconCss: 'em-icons e-righttick' },
      { text: 'Reception BL, Av Pour Fact', iconCss: 'em-icons e-righttick' },
      { text: 'BL, Av Non Recue Pour Fact', iconCss: 'em-icons e-righttick' },
      { text: 'Analyse Chiffres Affaires', iconCss: 'em-icons e-righttick' },
      { text: 'Fiche de Stock', iconCss: 'em-icons e-righttick' },
      { text: 'Fiche Client', iconCss: 'em-icons e-righttick' },
      { text: 'Fiche Vendeur', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj7 = [
      { text: 'Recettes Caisse Secondaire', iconCss: 'em-icons e-righttick' },
      { text: 'Depenses Caisse Secondaire', iconCss: 'em-icons e-righttick' },
      { text: 'Feuille Caisse Secondaire', iconCss: 'em-icons e-righttick' },
      { text: 'Recettes Caisse Principale', iconCss: 'em-icons e-righttick' },
      { text: 'Depenses Caisse Principale', iconCss: 'em-icons e-righttick' },
      { text: 'Feuille Caisse Principale', iconCss: 'em-icons e-righttick' },
      { text: 'Echeance Cheque', iconCss: 'em-icons e-righttick' },
      { text: 'Rapport Instance ' },
      { text: 'Etat des Reglement clts', iconCss: 'em-icons e-righttick' },
      { text: 'Etat des Regls Clt Cont', iconCss: 'em-icons e-righttick' },
      { text: 'Apurement des Regts cmpt', iconCss: 'em-icons e-righttick' },
      { text: 'Cons/Ann Apurts Cmpts', iconCss: 'em-icons e-righttick' },

      { text: 'Etat des Apurts Regts cmpts', iconCss: 'em-icons e-righttick' },
      { text: 'Changement/Annulation Titre', iconCss: 'em-icons e-righttick' },
      { text: 'Releve Client Comptant', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj8 = [
      { text: 'Accee a la Securite', iconCss: 'em-icons e-righttick' },
      { text: 'Authorisation Prix', iconCss: 'em-icons e-righttick' },
      { text: 'Authorisation Avoir', iconCss: 'em-icons e-righttick' },
      { text: 'Analyse Chif AFF/Mrgs', iconCss: 'em-icons e-righttick' },
      { text: 'Deblocage Client Niv 1', iconCss: 'em-icons e-righttick' },
      { text: 'Deblocage Client Niv 2', iconCss: 'em-icons e-righttick' },
      { text: 'Modif Remise Client', iconCss: 'em-icons e-righttick' },
      { text: 'Etat Fres Exonorees' },
      { text: 'Transf Fres a la Compta', iconCss: 'em-icons e-righttick' },
      { text: 'Modification PAP' },
      { text: 'Evolution Chif Aff', iconCss: 'em-icons e-righttick' },
      { text: 'Fiche de Stock Detailee', iconCss: 'em-icons e-righttick' },
      { text: 'TRANSIT', iconCss: 'em-icons e-righttick' },
      { text: 'Det des Clients N', iconCss: 'em-icons e-righttick' },
      { text: 'Historique des Typ Clts', iconCss: 'em-icons e-righttick' },
      { text: 'Modif Typologie Obj Clt', iconCss: 'em-icons e-righttick' },
      { text: 'Mise a Jour BD', iconCss: 'em-icons e-righttick' },
      { text: 'Autorisation Offre', iconCss: 'em-icons e-righttick' },
      { text: 'Stock Profiler' },
      { text: 'Details Clients', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj9 = [
      { text: 'Reglement Client', iconCss: 'em-icons e-righttick' },
      { text: 'Apurement Reg Client', iconCss: 'em-icons e-righttick' },
      { text: 'Releve Client', iconCss: 'em-icons e-righttick' },
      { text: 'Reglement Fournisseur', iconCss: 'em-icons e-righttick' },
      { text: 'Etat Engagement Four', iconCss: 'em-icons e-righttick' },
      { text: 'Creance Client', iconCss: 'em-icons e-righttick' },
      { text: 'Consult/annul Apurement', iconCss: 'em-icons e-righttick' },
      { text: 'Batch Client', iconCss: 'em-icons e-righttick' },
      { text: 'Historique Reg CLTS', iconCss: 'em-icons e-righttick' },
      { text: 'Consultation Reg FRS', iconCss: 'em-icons e-righttick' },
      { text: 'Etat Parametres', iconCss: 'em-icons e-righttick' },
      { text: 'Tableau de bord Financ.', iconCss: 'em-icons e-righttick' },
      {
        text: 'Etat des Apurs des regls clts',
        iconCss: 'em-icons e-righttick',
      },
      { text: 'Recouvrement' },
      {
        text: 'Reglement Client avec Mod Sup',
        iconCss: 'em-icons e-righttick',
      },
      { text: 'Etat des Reglement clts', iconCss: 'em-icons e-righttick' },
      { text: 'Gestion de la Tresorerie', iconCss: 'em-icons e-righttick' },
      { text: 'Situation de la Tresorerie', iconCss: 'em-icons e-righttick' },
      { text: 'reimpression Bordereau', iconCss: 'em-icons e-righttick' },
      { text: 'Reception reglt Fournisseur', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj10 = [
      { text: 'Transfert au cont', iconCss: 'em-icons e-righttick' },
      { text: 'Reglement Client Cont', iconCss: 'em-icons e-righttick' },
      { text: 'Releve Client Cont', iconCss: 'em-icons e-righttick' },
      { text: 'Creance Client Cont', iconCss: 'em-icons e-righttick' },
      { text: 'Batch Client Cont', iconCss: 'em-icons e-righttick' },
      { text: 'Apurement Reg Clts Cont', iconCss: 'em-icons e-righttick' },
      { text: 'Cons/annul Apur Clts Cont', iconCss: 'em-icons e-righttick' },
      { text: 'Etat des Apurs Des Regls Clts Cont' },
      {
        text: 'Reglement Clients Cont avec Mod Sup',
        iconCss: 'em-icons e-righttick',
      },
      { text: 'Etat des Regls Clt Cont', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj11 = [
      { text: 'Etablissement Programme', iconCss: 'em-icons e-righttick' },
      { text: 'Enregistrement Visite', iconCss: 'em-icons e-righttick' },
      { text: 'Mes Messages Envoyés', iconCss: 'em-icons e-righttick' },
      { text: 'Mes Messages Récus', iconCss: 'em-icons e-righttick' },
      { text: 'Consultation Visites', iconCss: 'em-icons e-righttick' },
      { text: 'Les Messages Envoyés', iconCss: 'em-icons e-righttick' },
      { text: 'Enreg Act Recouv', iconCss: 'em-icons e-righttick' },
      { text: 'Enreg Act Mult Recouv', iconCss: 'em-icons e-righttick' },
      { text: 'Consultation Action Rec', iconCss: 'em-icons e-righttick' },
      { text: 'Enr/Cons Rap Commercial', iconCss: 'em-icons e-righttick' },
      { text: 'Consult Rap Commerciaux', iconCss: 'em-icons e-righttick' },
      { text: 'Validation des visites', iconCss: 'em-icons e-righttick' },
      { text: 'Affectation Recouvrement', iconCss: 'em-icons e-righttick' },
      { text: 'Consult Mission de Recouv', iconCss: 'em-icons e-righttick' },
      { text: 'Chif Aff Repres/Four', iconCss: 'em-icons e-righttick' },
      { text: 'Historique des créances', iconCss: 'em-icons e-righttick' },
    ];
    const nameObj12 = [
      { text: 'Lancement Inventaire', iconCss: 'em-icons e-righttick' },
      { text: 'Saisie Inventaire', iconCss: 'em-icons e-righttick' },
      { text: 'Consultation Référence Inv.', iconCss: 'em-icons e-righttick' },
      { text: 'Consultation Emplacement', iconCss: 'em-icons e-righttick' },

      { text: 'Modification Emplacement', iconCss: 'em-icons e-righttick' },
      { text: 'Etat Inventaire', iconCss: 'em-icons e-righttick' },
      { text: 'Mise à Jour Inventaire', iconCss: 'em-icons e-righttick' },
    ];
    this.pushRightClass = 'push-right';
    this.pushLeftClass = 'push-left';
    this.login = localStorage.getItem('login');
    this.mdp = localStorage.getItem('mdp');
    /*this.menuText1 = [];
    this.menuText2 = [];
    this.menuText3 = [];
    this.menuText4 = [];
    this.menuText5 = [];
    this.menuText6 = [];
    this.menuText7 = [];
    this.menuText8 = [];
    this.menuText9 = [];
    this.menuText10 = [];
    this.menuText11 = [];*/
    let data = [];
    await this.topnavService
      .getLoginName(this.login)
      .toPromise()
      .then((dataa) => {
        data = dataa;
      });
    const st1: string = data['_embedded'].users[0].menu1;
    const menu1 = st1.split('');
    for (let i = 0; i < menu1.length; i++) {
      if (menu1[i] === 'A') {
        this.menuText[0].push(nameObj1[i]);
      }
    }
    const st2: string = data['_embedded'].users[0].menu2;
    const menu2 = st2.split('');
    for (let i = 0; i < 10; i++) {
      if (menu2[i] === 'A') {
        this.menuText[1].push(nameObj2[i]);
      }
    }

    if (
      menu2[10] === 'A' ||
      menu2[11] === 'A' ||
      menu2[12] === 'A' ||
      menu2[13] === 'A' ||
      menu2[14] === 'A' ||
      menu2[15] === 'A' ||
      menu2[16] === 'A' ||
      menu2[17] === 'A'
    ) {
      this.menuText[1].push({
        text: 'Duplicata',
        items: [],
        iconCss: 'em-icons e-righttick'
      });
      for (let i = 10; i < 18; i++) {
        if (menu2[i] === 'A') {
          this.menuText[1][this.menuText[1].length - 1].items.push(
            nameObj2[11].items[i - 10]
          );
        }
      }
    }

    for (let i = 20; i < menu2.length; i++) {
      if (menu2[i] === 'A') {
        this.menuText[1].push(nameObj2[i - 8]);
      }
    }

    const st3: string = data['_embedded'].users[0].menu3;
    const menu3 = st3.split('');
    for (let i = 0; i < menu3.length; i++) {
      if (menu3[i] === 'A') {
        this.menuText[2].push(nameObj3[i]);
      }
    }

    const st4: string = data['_embedded'].users[0].menu4;
    const menu4 = st4.split('');
    for (let i = 0; i < menu4.length; i++) {
      if (menu4[i] === 'A') {
        this.menuText[3].push(nameObj4[i]);
      }
    }

    const st5: string = data['_embedded'].users[0].menu5;
    const menu5 = st5.split('');
    for (let i = 0; i < menu5.length; i++) {
      if (menu5[i] === 'A') {
        this.menuText[4].push(nameObj5[i]);
      }
    }

    const st6: string = data['_embedded'].users[0].menu6;
    const menu6 = st6.split('');
    for (let i = 0; i < menu6.length; i++) {
      if (menu6[i] === 'A') {
        this.menuText[5].push(nameObj6[i]);
      }
    }

    const st7: string = data['_embedded'].users[0].menu7;
    const menu7 = st7.split('');
    for (let i = 0; i < menu7.length; i++) {
      if (menu7[i] === 'A') {
        this.menuText[6].push(nameObj7[i]);
      }
    }

    const st8: string = data['_embedded'].users[0].menu8;
    const menu8 = st8.split('');
    for (let i = 0; i < menu8.length - 1; i++) {
      if (menu8[i] === 'A') {
        this.menuText[7].push(nameObj8[i]);
      }
    }

    const st9: string = data['_embedded'].users[0].menu9;
    const menu9 = st9.split('');
    for (let i = 0; i < menu9.length; i++) {
      if (menu9[i] === 'A') {
        this.menuText[8].push(nameObj9[i]);
      }
    }

    const st10: string = data['_embedded'].users[0].menu10;
    const menu10 = st10.split('');
    for (let i = 0; i < menu10.length; i++) {
      if (menu10[i] === 'A') {
        this.menuText[9].push(nameObj10[i]);
      }
    }

    const st11: string = data['_embedded'].users[0].menu11;
    const menu11 = st11.split('');
    for (let i = 0; i < menu11.length; i++) {
      if (menu11[i] === 'A') {
        this.menuText[10].push(nameObj11[i]);
      }
    }

    let dateDebutInventaire,
      dateFinInventaire = '';
    await this.steService
      .getDateDebutInventaire()
      .toPromise()
      .then((dataa: string) => (dateDebutInventaire = dataa));

    await this.steService
      .getDateFinInventaire()
      .toPromise()
      .then((dataa: string) => (dateFinInventaire = dataa));
    console.log(
      'this.dateServeur',
      this.dateServeur,
      new Date(dateDebutInventaire)
    );
    console.log(
      'dateDebutInventaire',
      dateDebutInventaire,
      new Date(dateDebutInventaire)
    );
    console.log(
      'dateFinInventaire',
      dateFinInventaire,
      new Date(dateFinInventaire)
    );
    const st12: string = data['_embedded'].users[0].menu12;
    const menu12 = st12.split('');
    if (menu12[0] === 'A') {
      this.menuText[11].push(nameObj12[0]);
    }
    for (let i = 1; i < menu12.length; i++) {
      if (
        menu12[i] === 'A' &&
        dateDebutInventaire !== '' &&
        dateFinInventaire !== ''
      ) {
        if (
          new Date(this.dateServeur) >= new Date(dateDebutInventaire) &&
          new Date(this.dateServeur) <= new Date(dateFinInventaire)
        ) {
          this.menuText[11].push(nameObj12[i]);
        }
      }
    }

    for (let i = 0; i < this.menuText.length; i++) {
      if (this.menuText[i].length > 0) {
        this.menuItems.push({
          text: this.menus[i],
          items: this.menuText[i],
        });
      }
    }
    this.IAmDoingSomething = false;
    setTimeout(() => (this.IAmDoingSomething = true), 1);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }
  async itemSelect(args: MenuEventArgs) {
    // localStorage.setItem('selectedMenu', args.item.text);
    globals.selectedMenu = args.item.text;
    /***  NOMENCLATURE GENERAL ***/
    // Consultation Référence
    if (args.item.text === 'Consultation Référence') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/consultaionref']);
      // 'Nouvelle CMDs Client'
    }

    // 'Etat des Regls Clt Cont'
    if (args.item.text === 'Etat des Regls Clt Cont') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Etat-des-Reglemnts-Clts']);
        });
    }

    // 'Consultation Emplacement'
    if (args.item.text === 'Consultation Emplacement') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/consultation-emplacement']);
        });
    }
    // 'Saisie Inventaire'
    if (args.item.text === 'Saisie Inventaire') {
      this.router.navigate(['/saisie-inventaire']);
      localStorage.setItem('isdashboard', 'false');
    }
// Mise à Jour Inventaire
if (args.item.text === 'Mise à Jour Inventaire') {
  localStorage.setItem('isdashboard', 'false');
  this.router.navigate(['/miseajourinventaire']);
}
// etat Inventaire
if (args.item.text === 'Etat Inventaire') {
  localStorage.setItem('isdashboard', 'false');
  this.router.navigate(['/etatinventaire']);
}
    // 'Etat des Reglemnts Clts  --> comptabilite'
    if (args.item.text === 'Etat des Reglement clts') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Etat-des-Reglemnts-Clts']);
        });
    }

    // 'Annulation CMDs Client'

    if (args.item.text === 'Annulation CMDs Client') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Annulation-CMD-Client']);
        });
    }
    // 'Evolution des chiffres d affaires'
    if (args.item.text === 'Evolution Chif Aff') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Evolution-des-chiffres-aff']);
        });
    }
    // 'Determination des clients Noyeau'
    if (args.item.text === 'Det des Clients N') {
      this.router.navigate(['/det-clients-noyeau']);
      localStorage.setItem('isdashboard', 'false');
    }
    // 'Gestion de la Tresorerie'
    if (args.item.text === 'Gestion de la Tresorerie') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Gestion-de-la-Tresorerie']);
        });
    }

    // Historique des Typ Clts
    if (args.item.text === 'Historique des Typ Clts') {
      this.router.navigate(['/historique-typo-clients']);
      localStorage.setItem('isdashboard', 'false');
    }

    // Modif Typo Clts

    if (args.item.text === 'Modif Typologie Obj Clt') {
      this.router.navigate(['/modif-typo-clts']);
      localStorage.setItem('isdashboard', 'false');
    }

    // DeblocageCltsN1
    if (args.item.text === 'Deblocage Client Niv 1') {
      this.router.navigate(['/releveClient']);
      localStorage.setItem('isdashboard', 'false');
    }
    // DeblocageCltsN2
    if (args.item.text === 'Deblocage Client Niv 2') {
      this.router.navigate(['/releveClient']);
      localStorage.setItem('isdashboard', 'false');
    }
    // stockenmouvement
    if (args.item.text === 'Stock en Mouvement') {
      this.router.navigate(['/stockenmouvement']);
      localStorage.setItem('isdashboard', 'false');
    }

    // Rapport FRE Client
    if (args.item.text === 'Rapport FRE Client') {
      this.router.navigate(['/rapportfreclient']);
      localStorage.setItem('isdashboard', 'false');
    }

    // Consultation Référence Inv.
    if (args.item.text === 'Consultation Référence Inv.') {
      this.router.navigate(['/consultationreference']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Modification Emplacement.

    if (args.item.text === 'Modification Emplacement') {
      this.router.navigate(['/modificationemplacement']);
      localStorage.setItem('isdashboard', 'false');
    }

    // Rapport avoir Comptant

    if (args.item.text === 'Etat Avoirs Comptant') {
      // this.router.navigate(['/rapportavoirscomptant']);
      // localStorage.setItem('isdashboard', 'false');*/
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['etatavoirterme']);
        });
    }

    if (args.item.text === 'Modification CMDs Client') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Modif-CMD-Client']);
        });
    }

    if (args.item.text === 'Nouvelle CMDs Client') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Nouvelle-CMDs-Client']);
        });
    }

    // 'Ajout-Modif-Supp Réf + Modif PRIX'

    if (args.item.text === 'Ajout-Modif-Supp Réf + Modif PRIX') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/ajout-modif-supp-ref']);
        });
    }

    // 'Situation de la Tresorerie'
    if (args.item.text === 'Situation de la Tresorerie') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Situation-de-la-Tresorerie']);
        });
    }

    // 'Batch Client'      'Batch Client Cont'
    if (args.item.text === 'Batch Client') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/batch-client']);
        });
    }

    if (args.item.text === 'Batch Client Cont') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/batch-client']);
        });
    }
    if (args.item.text === 'Fiche de Stock Detailee') {
      this.router.navigate(['/fiche-stock-detail']);
      localStorage.setItem('isdashboard', 'false');
    }
    if (args.item.text === 'Fiche de Stock') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/fiche-stock']);
        });
    }

    // 'Tableau de bord Financ.'
    if (args.item.text === 'Tableau de bord Financ.') {
      this.router.navigate(['/tableau-de-bord-Financ']);
      localStorage.setItem('isdashboard', 'false');
    }

    // 'Mise a Jour BD'
    if (args.item.text === 'Mise a Jour BD') {
      this.router.navigate(['/Mise-a-Jour-BD']);
      localStorage.setItem('isdashboard', 'false');
    }

    // Analyse Chiffres Affaires
    if (args.item.text === 'Analyse Chiffres Affaires') {
      this.router.navigate(['/Analyse-Chiffres-Affaires']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Ajout-Modif-Supp Référence
    if (args.item.text === 'Ajout-Modif-Supp Référence') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/ajout-modif-supp-ref']);
        });
    }
    // Gestion des equivalences
    if (args.item.text === 'Gestion des equivalences') {
      this.router.navigate(['/equivalence']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Historique des créances
    if (args.item.text === 'Historique des créances') {
      this.router.navigate(['/historiquecreanceszone']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Fusion Références
    if (args.item.text === 'Fusion Références') {
      this.router.navigate(['/fusionreference']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Ajustement Référence
    if (args.item.text === 'Ajustement Référence') {
      this.router.navigate(['/ajustementReference']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Catalogue des prix
    if (args.item.text === 'Catalogue des prix') {
      this.router.navigate(['/catalogueprix']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Consultation Client
    if (args.item.text === 'Consultation Client') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['client']);
        });
    }
    // Consultation Fournisseur
    if (args.item.text === 'Consultation Fournisseur') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['fournisseur']);
        });
    }
    // Ajout-Modif-Supp Fournisseur
    if (args.item.text === 'Ajout-Modif-Supp Fournisseur') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['fournisseur']);
        });
    }
    // Liste des Marques
    if (args.item.text === 'Liste des Marques') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['marques']);
        });
    }
    // Ajout-Modif-Supp des marques
    if (args.item.text === 'Ajout-Modif-Supp des marques') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['marques']);
        });
    }
    // Changement Référence
    if (args.item.text === 'Changement Référence') {
      this.router.navigate(['/changementreference']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Liste des Familles
    if (args.item.text === 'Liste des Familles') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['familles']);
        });
    }
    // Ajout-Modif-Supp Famille
    if (args.item.text === 'Ajout-Modif-Supp Famille') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['familles']);
        });
    }
    // Liste des Sous Familles
    if (args.item.text === 'Liste des Sous Familles') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['sfamilles']);
        });
    }
    // Ajout-Modif-Supp sous Familles
    if (args.item.text === 'Ajout-Modif-Supp sous Familles') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['sfamilles']);
        });
    }
    // Affectation Marque
    if (args.item.text === 'Affectation Marque') {
      this.router.navigate(['/affectationmarque']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Ajout-Modif-Supp Réf + Modif PRIX

    // Ajout Nouveau Client
    if (args.item.text === 'Ajout Nouveau Client') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['client']);
        });
    }

    // 'Modif Remise Client'
    // Modification Client
    if (args.item.text === 'Modif Remise Client') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['client']);
        });
    }
    // Modification Client
    if (args.item.text === 'Modification Client') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['client']);
        });
    }

    /** VENTE **/
    // Vente au Comptant
    if (args.item.text === 'Vente au Comptant') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['vente']);
        });
    }
    // Avoir Comptant
    if (args.item.text === 'Avoir Comptant') {
      let fa = [];
      let dda = 3000;
      await this.faService
        .getFa()
        .toPromise()
        .then((data) => (fa = data['_embedded'].fa));
      /*let dateServeur = '';
      await this.steService
        .getDateServeur()
        .toPromise()
        .then((data: string) => (dateServeur = data));*/
      // console.log(fa[0].tempsAvoir);
      dda = Math.abs(
        (new Date(this.dateServeur).getTime() -
          new Date(fa[0].tempsAvoir).getTime()) /
          1000
      );
      if (fa[0].avoirflag === '1' && dda <= 300) {
        localStorage.setItem('isdashboard', 'false');
        this.router
          .navigateByUrl('/dashboard', { skipLocationChange: true })
          .then(() => {
            localStorage.setItem('isdashboard', 'false');
            this.router.navigate(['avoir']);
          });
      } else {
        this.errorMessage = 'Veuillez demander l\'Autorisation, SVP.';
        this.displayErrorDialog = true;
      }
    }
    // Vente cpt avec Reservation
    if (args.item.text === 'Vente cpt avec Reservation') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['vente']);
        });
    }
    // Avoir cpt Reservation
    if (args.item.text === 'Avoir cpt Reservation') {
      let fa = [];
      let dda = 3000;
      await this.faService
        .getFa()
        .toPromise()
        .then((data) => (fa = data['_embedded'].fa));
      /*let dateServeur = '';
      await this.steService
        .getDateServeur()
        .toPromise()
        .then((data: string) => (dateServeur = data));*/
      dda = Math.abs(
        (new Date(this.dateServeur).getTime() -
          new Date(fa[0].tempsAvoir).getTime()) /
          1000
      );
      if (fa[0].avoirflag === '1' && dda <= 300) {
        localStorage.setItem('isdashboard', 'false');
        this.router
          .navigateByUrl('/dashboard', { skipLocationChange: true })
          .then(() => {
            localStorage.setItem('isdashboard', 'false');
            this.router.navigate(['avoir']);
          });
      } else {
        this.errorMessage = 'Veuillez demander l\'Autorisation, SVP.';
        this.displayErrorDialog = true;
      }
    }
    // Vente Terme B/l
    if (args.item.text === 'Vente Terme B/l') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['vente']);
        });
    }
    // Avoir Terme B/l
    if (args.item.text === 'Avoir Terme B/l') {
      let fa = [];
      let dda = 3000;
      await this.faService
        .getFa()
        .toPromise()
        .then((data) => (fa = data['_embedded'].fa));
      /*let dateServeur = '';
      await this.steService
        .getDateServeur()
        .toPromise()
        .then((data: string) => (dateServeur = data));*/
      dda = Math.abs(
        (new Date(this.dateServeur).getTime() -
          new Date(fa[0].tempsAvoir).getTime()) /
          1000
      );
      if (fa[0].avoirflag === '1' && dda <= 300) {
        localStorage.setItem('isdashboard', 'false');
        this.router
          .navigateByUrl('/dashboard', { skipLocationChange: true })
          .then(() => {
            localStorage.setItem('isdashboard', 'false');
            this.router.navigate(['avoir']);
          });
      } else {
        this.errorMessage = 'Veuillez demander l\'Autorisation, SVP.';
        this.displayErrorDialog = true;
      }
    }
    // Vente Terme avec Reserv
    if (args.item.text === 'Vente Terme avec Reserv') {
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['vente']);
        });
    }
    // Avoir Terme avec Reserv
    if (args.item.text === 'Avoir Terme avec Reserv') {
      let fa = [];
      let dda = 3000;
      await this.faService
        .getFa()
        .toPromise()
        .then((data) => (fa = data['_embedded'].fa));
      /*let dateServeur = '';
      await this.steService
        .getDateServeur()
        .toPromise()
        .then((data: string) => (dateServeur = data));*/
      dda = Math.abs(
        (new Date(this.dateServeur).getTime() -
          new Date(fa[0].tempsAvoir).getTime()) /
          1000
      );
      if (fa[0].avoirflag === '1' && dda <= 300) {
        localStorage.setItem('isdashboard', 'false');
        this.router
          .navigateByUrl('/dashboard', { skipLocationChange: true })
          .then(() => {
            localStorage.setItem('isdashboard', 'false');
            this.router.navigate(['avoir']);
          });
      } else {
        this.errorMessage = 'Veuillez demander l\'Autorisation, SVP.';
        this.displayErrorDialog = true;
      }
    }
    // Reservation de stock
    if (args.item.text === 'Reservation de stock') {
      this.router.navigate(['/reservationstock']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Vente Instance
    // Avoir Instance
    // ********** Duplicata **********
    //
    // Livraison
    if (args.item.text === 'Livraison') {
      this.router.navigate(['/Livraison']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Ajout bon de Sortie
    if (args.item.text === 'Ajout bon de Sortie') {
      this.router.navigate(['/AjoutBondeSortie']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Modif  bon de Sortie
    if (args.item.text === 'Modif  bon de Sortie') {
      this.router.navigate(['/ModifBondeSortie']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Annul  bon de Sortie
    if (args.item.text === 'Annul  bon de Sortie') {
      this.router.navigate(['/AnnulBondeSortie']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Consultation bon de Sortie
    if (args.item.text === 'Consultation bon de Sortie') {
      this.router.navigate(['/ConsultBondeSortie']);
      localStorage.setItem('isdashboard', 'false');
    }
    // liste BS Ouverts
    if (args.item.text === 'liste BS Ouverts') {
      this.router.navigate(['/vente-bsouverts']);
      localStorage.setItem('isdashboard', 'false');
    }
    // liste BS Fermes
    if (args.item.text === 'liste BS Fermes') {
      this.router.navigate(['/VenteBsfermes']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Fermeture Bon Sortie
    if (args.item.text === 'Fermeture Bon Sortie') {
      this.router.navigate(['/FermetureBondeSortie']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Duplicata BS
    if (args.item.text === 'Duplicata BS') {
      this.router.navigate(['/DuplicatBS']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Rapport des BS Fermés
    if (args.item.text === 'Rapport des BS Fermés') {
      this.router.navigate(['/RapportBS']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Rapport des Livraisons
    if (args.item.text === 'Rapport des Livraisons') {
      this.router.navigate(['/RaportLivraison']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Consultation Livraison
    if (args.item.text === 'Consultation Livraison') {
      this.router.navigate(['/ConsultationLivraison']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Analyse CA Vendeur
    if (args.item.text === 'Analyse CA Vendeur') {
      this.router.navigate(['/AnalyseCAVendeur']);
      localStorage.setItem('isdashboard', 'false');
    }
    /** OFFRE ET CMDS CLIENTS **/
    // Nouvelle Offre(RG,MG)
    if (args.item.text === 'Nouvelle Offre(RG,MG)') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/nouvelle-offre-rg-mg']);
        });
    }
    // Nouvelle Offre
    if (args.item.text === 'Nouvelle Offre') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/nouvelle-offre-rg-mg']);
        });
    }
    // Modification Offre(RG,MG)
    if (args.item.text === 'Modification Offre(RG,MG)') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/modification-offre-rg-mg']);
        });
    }
    // Modification Offre
    if (args.item.text === 'Modification Offre') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/modification-offre-rg-mg']);
        });
    }
    // Annulation Offre
    if (args.item.text === 'Annulation Offre') {
      this.router.navigate(['/annulation-offre']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Copie Offre
    if (args.item.text === 'Copie Offre') {
      this.router.navigate(['/copie-offre']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Etat Offre Envoye
    if (args.item.text === 'Etat Offre Envoye') {
      this.router.navigate(['/etat-offre-envoye']);
      localStorage.setItem('isdashboard', 'false');
    }
     // Details Clients
     if (args.item.text === 'Details Clients') {
      this.router.navigate(['/detail-client']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Nouvelle CMDs Client
    // Modification CMDs Client
    // Annulation CMDs Client
    // Etat CMDs Client
    if (args.item.text === 'Etat CMDs Client') {
      this.router.navigate(['/etat-commande-client']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Rapport Reservation
    if (args.item.text === 'Rapport Reservation') {
      this.router.navigate(['/rapportreservation']);
      localStorage.setItem('isdashboard', 'false');
    }

    // Offres / Clients
    if (args.item.text === 'Offres / Clients') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/offre-client']);
    }
    // Offres / Fournisseur
    if (args.item.text === 'Offres / Fournisseur') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/offre-fournisseur']);
    }
    // Offres / Article
    if (args.item.text === 'Offres / Article') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/offre-article']);
    }
    // Offres / Client / An
    if (args.item.text === 'Offres / Client / An') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/offre-client-an']);
    }
    // Etat des Visites Clients
    if (args.item.text === 'Etat des Visites Clients') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/etat-visite-client']);
    }
    /** PROFORMAT ET CMDS FOURNISSEURS **/
    // Etat Facture
    if (args.item.text === 'Etat Facture') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/etat-facture']);
    }
    // Facturation Individuelle
    if (args.item.text === 'Facturation Individuelle') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/facturationTermeIndiv']);
    }
    // Reconstitution Fre Terme
    if (args.item.text === 'Reconstitution Fre Terme') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/reconstitution-facture-terme']);
    }
    // Facturation collective
    if (args.item.text === 'Facturation collective') {
      this.mdpFactCollective = '';
      this.showConfirmFactCollective = true;
      /*
        localStorage.setItem("isdashboard", "false");
        this.router.navigate(["/facturationCollective"]);*/
    }
    // Annulation Fre Terme
    if (args.item.text === 'Annulation Fre Terme') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/annulationFacture']);
    }
    // Impression des Facture
    if (args.item.text === 'Impression des Facture') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/impressionfactures']);
    }
    // Impression des Traites
    // Rapport Comptant
    if (args.item.text === 'Rapport Comptant') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/rapport-comptant']);
    }

    // Creance Client Cont
    if (args.item.text === 'Creance Client') {
      this.router.navigate(['/Creance-Client']);
      localStorage.setItem('isdashboard', 'false');
    }
    // creance client cont

    if (args.item.text === 'Creance Client Cont') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Creance-Client-Cont']);
        });
    }

    // 'Avoir sur Achat'

    if (args.item.text === 'Avoir sur Achat') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Avoir-sur-Achat']);
        });
    }
    // 'Stock Stable'
    if (args.item.text === 'Stock Stable') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Stock-Stable']);
        });
    }
    // Achat
    if (args.item.text === 'Achat') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Achat']);
        });
    }
    // transit
    if (args.item.text === 'TRANSIT') {
      this.router.navigate(['/transit']);
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/etat-tva']);
    }
    // Etat Avoir Cpt Caisse
    if (args.item.text === 'Etat Avoir Cpt Caisse') {
      this.router.navigate(['/etatavoircomptantcaisse']);
      localStorage.setItem('isdashboard', 'false');
    }
    // liste des Clients
    if (args.item.text === 'liste des Clients') {
      this.router.navigate(['/listedesclients']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Enreg Bon de Commande
    if (args.item.text === 'Enreg Bon de Commande') {
      this.router.navigate(['/enregbncommande']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Modification B/L
    if (args.item.text === 'Modification B/L') {
      this.router.navigate(['/modification-bl']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Annulation B/L
    // Etat Avoirs Terme
    if (args.item.text === 'Etat Avoirs Terme') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['etatavoirterme']);
        });
    }
    // Ventes en Suspension TVA
    if (args.item.text === 'Ventes en Suspension TVA') {
      this.router.navigate(['/ventes-suspension-tva']);
      localStorage.setItem('isdashboard', 'false');
    }
    /** RAPPORTS **/
    // Nouveau Proforma
    if (args.item.text === 'Nouveau Proforma') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/demande-proforma']);
    }
    // Modification Proforma
    if (args.item.text === 'Modification Proforma') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/modification-proforma']);
    }
    // Annulation Proforma
    if (args.item.text === 'Annulation Proforma') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/annulation-proforma']);
    }
    // Nouvelle Commande
    if (args.item.text === 'Nouvelle Commande') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/nouvelle-commande']);
    }
    // Modification Commande
    if (args.item.text === 'Modification Commande') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['modification-commande']);
        });
    }
    // Annulation Commande
    if (args.item.text === 'Annulation Commande') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/annulation-commande']);
    }
    // Duplicata Commande
    if (args.item.text === 'Duplicata Commande') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['modification-commande']);
        });
    }
    // Achat
    // Avoir sur Achat
    // Relance Dynamique
    if (args.item.text === 'Relance Dynamique') {
      this.router.navigate(['/relance-dynamique']);
      localStorage.setItem('isdashboard', 'false');
    }
    // liste des Proformas
    if (args.item.text === 'liste des Proformas') {
      this.router.navigate(['/listedesproformats']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Objectifs des  Fournisseurs / Realise
    if (args.item.text === 'Objectifs des  Fournisseurs / Realise ') {
      this.router.navigate(['/objectifs-fours-realise']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Etat stock mort
    if (args.item.text === 'Etat stock mort') {
      this.router.navigate(['/etatstockmort']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Reedition Rapport Achat
    if (args.item.text === 'Reedition Rapport Achat') {
      this.router.navigate(['/reeditionrapacht']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Deficit Commande Frs
    if (args.item.text === 'Deficit Commande Frs') {
      this.router.navigate(['/Deficit-Commande-Frs']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Verification Commande
    if (args.item.text === 'Verification Commande') {
      this.router.navigate(['/Verification-Commande']);
      localStorage.setItem('isdashboard', 'false');
    }
    /** ANALYSE **/
    // Etat Relance
    // CMDs FRS non Soldees
    if (args.item.text === 'CMDs FRS non Soldees') {
      this.router.navigate(['/cmds-frs-non-soldees']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Toutes Les CMDs FRS
    // Stock en Mouvement
    // Stock Stable
    // Valorisation
    if (args.item.text === 'Valorisation') {
      this.router.navigate(['/valorisation-stock']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Obejectifs FRS/CMDs
    if (args.item.text === 'Obejectifs FRS/CMDs') {
      this.router.navigate(['/objectifs-frs-cmds']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Rapport des entrées
    if (args.item.text === 'Rapport des entrées') {
      this.router.navigate(['/rapportachat']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Rapport des sorties
    if (args.item.text === 'Rapport des sorties') {
      this.router.navigate(['/rapportvente']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Rapport Ajustements
    if (args.item.text === 'Rapport Ajustements') {
      this.router.navigate(['/rapport-ajustements']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Rapport FRE Client
    // Rapport Instance
    // Rapport Duplicata C
    // Rapport Ventes a Perte
    if (args.item.text === 'Rapport Ventes a Perte') {
      this.router.navigate(['/Rapport-Ventes-a-Perte']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Reception BL, Av Pour Fact
    if (args.item.text === 'Reception BL, Av Pour Fact') {
      this.router.navigate(['/reception-bl-av-fact']);
      localStorage.setItem('isdashboard', 'false');
    }
    //
    // BL, Av Non Recue Pour Fact
    if (args.item.text === 'BL, Av Non Recue Pour Fact') {
      this.router.navigate(['/blavoir-bl-non-recu']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Analyse Chiffres Affaires
    if (args.item.text === 'Analyse Chiffres Affaires') {
      this.router.navigate(['/Analyse-Chiffres-Affaires']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Fiche de Stock
    // Fiche Client
    if (args.item.text === 'Fiche Client') {
      this.router.navigate(['/Fiche-Client']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Fiche Vendeur
    if (args.item.text === 'Fiche Vendeur') {
      this.router.navigate(['/Fiche-Vendeur']);
      localStorage.setItem('isdashboard', 'false');
    }

    // 'Etat des Apurts Regts cmpts'
    if (args.item.text === 'Etat des Apurts Regts cmpts') {
      this.router.navigate(['/Etat-Appur-Reg-Clts']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Etat-Appur-Reg-Clts
    if (args.item.text === 'Etat des Apurs des regls clts') {
      this.router.navigate(['/Etat-Appur-Reg-Clts']);
      localStorage.setItem('isdashboard', 'false');
    }

    //  'Etat des Apurs Des Regls Clts Cont'
    // Etat-Appur-Reg-Clts
    if (args.item.text === 'Etat des Apurs Des Regls Clts Cont') {
      this.router.navigate(['/Etat-Appur-Reg-Clts']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Etat-Parametres
    if (args.item.text === 'Etat Parametres') {
      this.router.navigate(['/Etat-Parametres']);
      localStorage.setItem('isdashboard', 'false');
    }

    /** GESTION DES CAISSES **/
    // Recettes Caisse Secondaire
    if (args.item.text === 'Recettes Caisse Secondaire') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/recettes-caisse-secondaire']);
    }
    // Depenses Caisse Secondaire
    if (args.item.text === 'Depenses Caisse Secondaire') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/depenses-caisse-secondaire']);
    }
    // Feuille Caisse Secondaire
    if (args.item.text === 'Feuille Caisse Secondaire') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/feuille-caisse-secondaire']);
    }
    // Recettes Caisse Principale
    if (args.item.text === 'Recettes Caisse Principale') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/recettes-caisse-principale']);
    }
    // Depenses Caisse Principale
    if (args.item.text === 'Depenses Caisse Principale') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/depenses-caisse-principale']);
    }
    // Feuille Caisse Principale
    if (args.item.text === 'Feuille Caisse Principale') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/feuille-caisse-principale']);
    }
    // Rapport Instance
    // Etat des Reglemnts Clts
    // Etat des Regts Clts Cont
    // Apurement des Regts cmpt
    if (args.item.text === 'Apurement des Regts cmpt') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/apurement-regts-cmpt']);
    }
    // Cons/Ann Apurts Cmpts
    if (args.item.text === 'Cons/Ann Apurts Cmpts') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/cons-ann-apurts-cmpt']);
    }
    // Etat des Apurts Regts cmpts
    // Changement/Annulation Titre
    if (args.item.text === 'Changement/Annulation Titre') {
      this.router.navigate(['/changement-titre']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Releve Client Comptant
    if (args.item.text === 'Releve Client Comptant') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/releveClient']);
        });
    }

    /** ADMINISTRATION **/
    // Accee a la Securite
    if (args.item.text === 'Accee a la Securite') {
      this.router.navigate(['/accessecurite']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Authorisation Prix
    if (args.item.text === 'Authorisation Prix') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['authorisation-prix-avoir']);
        });
    }
    // Authorisation Avoir
    if (args.item.text === 'Authorisation Avoir') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['authorisation-prix-avoir']);
        });
    }
    // Analyse Chif AFF/Mrgs
    if (args.item.text === 'Analyse Chif AFF/Mrgs') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/analyse-ca-marges']);
    }
    // Deblocage Client Niv 1
    // Deblocage Client Niv 2
    // Modif Remise Client
    // Etat Fres Exonorees
    if (args.item.text === 'Etat Fres Exonorees') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/etat-fres-exonorees']);
    }
    // Transf Fres a la Compta
    if (args.item.text === 'Transf Fres a la Compta') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/Transf-Fres-Cpt']);
    }
    // Modification PAP
    // Evolution Chif Aff
    // Fiche de Stock Detailee
    // TRANSIT
    if (args.item.text === 'TRANSIT') {
      this.router.navigate(['/transit']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Det des Clients N
    // Historique des Typ Clts
    // Modif Typologie Obj Clt
    // Mise a Jour BD
    if (args.item.text === 'Mise a Jour BD') {
      this.router.navigate(['/Mise-a-Jour-BD']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Mise a Jour Prix
    // Autorisation Offre
    if (args.item.text === 'Autorisation Offre') {
      this.router.navigate(['/autorisation-offre']);
      localStorage.setItem('isdashboard', 'false');
    }
    /** COMPTABILITE **/
    // Reglement Client
    if (args.item.text === 'Reglement Client') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['reglementClient']);
        });
    }
    // Apurement Reg Client
    if (args.item.text === 'Apurement Reg Client') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/appurement-reglement']);
        });
    }
    // Releve Client
    if (args.item.text === 'Releve Client') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/releveClient']);
        });
    }
    // Reglement Fournisseur
    if (args.item.text === 'Reglement Fournisseur') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/Reglement-Fournisseur']);
    }
    // Etat Engagement Four
    if (args.item.text === 'Etat Engagement Four') {
      this.router.navigate(['/Etat-Engagement-Four']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Creance Client
    if (args.item.text === 'Creance Client') {
      this.router.navigate(['/Creance-Client']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Consult/annul Apurement
    if (args.item.text === 'Consult/annul Apurement') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/consultation-reglement-client']);
        });
    }
    // Batch Client
    // Historique Reg CLTS
    // Consultation Reg FRS
    if (args.item.text === 'Consultation Reg FRS') {
      this.router.navigate(['/Consultation-Reg-FRS']);
      localStorage.setItem('isdashboard', 'false');
    }

    // Historique Reg CLTS

    if (args.item.text === 'Historique Reg CLTS') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/Historique-Reg-Clts']);
        });
    }

    //
    // Etat Parametres
    // Tableau de bord Financ.
    if (args.item.text === 'Tableau de bord Financ.') {
      this.router.navigate(['/tableau-de-bord-Financ']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Etat des Apurs des regls clts
    // Reglement Client avec Mod Sup
    if (args.item.text === 'Reglement Client avec Mod Sup') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['reglementClient']);
        });
    }
    // Etat des Reglement clts
    // Gestion de la Tresorerie
    // Situation de la Tresorerie
    // reimpression Bordereau
    // Reception reglt Fournisseur
    if (args.item.text === 'Reception reglt Fournisseur') {
      this.router.navigate(['/Reception-reglt-Fournisseur']);
      localStorage.setItem('isdashboard', 'false');
    }

    /** CONTENTIEUX **/
    // Transfert au cont
    if (args.item.text === 'Transfert au cont') {
      this.router.navigate(['/transfert-au-contentieux']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Reglement Client Cont
    if (args.item.text === 'Reglement Client Cont') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['reglementClient']);
        });
    }
    // 'B/L En cours'
    if (args.item.text === 'B/L En cours') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['BL-En-cours']);
        });
    }

    // Releve Client Cont
    if (args.item.text === 'Releve Client Cont') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/releveClient']);
        });
    }
    // Creance Client Cont
    // Batch Client Cont
    // Apurement Reg Clts Cont
    if (args.item.text === 'Apurement Reg Clts Cont') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/appurement-reglement']);
        });
    }
    // Cons/annul Apur Clts Cont
    if (args.item.text === 'Cons/annul Apur Clts Cont') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/consultation-reglement-client']);
        });
    }
    // 'reimpression Bordereau'
    if (args.item.text === 'reimpression Bordereau') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['reimpression-Bordereau']);
        });
    }
    // Etat des Apurs Des Regls Clts

    if (args.item.text === 'Reglement Clients Cont avec Mod Sup') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['reglementClient']);
        });
    }
    // Etat des Regls Clt Cont

    /** GESTION COMMERCIAUX **/
    // Etablissement Programme
    if (args.item.text === 'Etablissement Programme') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/programmation-visite']);
    }
    // Enregistrement Visite
    if (args.item.text === 'Enregistrement Visite') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/enregistrement-visite']);
    }
    // Mes Messages Envoyés
    /*if (args.item.text === 'Mes Messages Envoyés') {
      this.router.navigate(['/mesmessagesenv']);
    }*/
    if (args.item.text === 'Mes Messages Envoyés') {
      localStorage.setItem('typeMessages', 'envoyes');
      localStorage.setItem('isdashboard', 'false');
      // this.router.navigate(["/mes-messages-visites"]);
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/mes-messages-visites']);
        });
    }
    // Mes Messages Récus
    if (args.item.text === 'Mes Messages Récus') {
      localStorage.setItem('typeMessages', 'recus');
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/mes-messages-visites']);
        });
    }
    // Consultation Visites
    if (args.item.text === 'Consultation Visites') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/consultation-visite']);
    }
    // Les Messages Envoyés
    if (args.item.text === 'Les Messages Envoyés') {
      localStorage.setItem('typeMessages', 'tout');
      localStorage.setItem('isdashboard', 'false');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/mes-messages-visites']);
        });
    }
    if (args.item.text === 'B/Livraison') {
      localStorage.setItem('natureDuplicata', 'B/L      ');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/duplicata']);
        });
    }
    if (args.item.text === 'Comptant .P.') {
      localStorage.setItem('natureDuplicata', 'FACTUREP ');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/duplicata']);
        });
    }
    if (args.item.text === 'Avoir B/L') {
      localStorage.setItem('natureDuplicata', 'AVOIR    ');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/duplicata']);
        });
    }
    if (args.item.text === 'Avoir CPT .P.') {
      localStorage.setItem('natureDuplicata', 'AVOIRP   ');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/duplicata']);
        });
    }
    if (args.item.text === 'Comptant Res') {
      localStorage.setItem('natureDuplicata', 'FACTURE3 ');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/duplicata']);
        });
    }
    if (args.item.text === 'Avoir CPT Res') {
      localStorage.setItem('natureDuplicata', 'AVOIR3   ');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/duplicata']);
        });
    }
    if (args.item.text === 'B/L Trm Réserv') {
      localStorage.setItem('natureDuplicata', 'B/L2     ');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/duplicata']);
        });
    }
    if (args.item.text === 'Av Trm Réserv') {
      localStorage.setItem('natureDuplicata', 'AVOIR2   ');
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['/duplicata']);
        });
    }

    if (args.item.text === 'Etat Facture') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/etat-facture']);
    }
    if (args.item.text === 'Etat TVA') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/etat-tva']);
    }
    // Enreg Act Mult Recouv
    if (args.item.text === 'Enreg Act Mult Recouv') {
      this.router.navigate(['/enregactrecouvmult']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Consultation Action Rec
    if (args.item.text === 'Consultation Action Rec') {
      this.router.navigate(['/consultationactionrecouv']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Enr/Cons Rap Commercial
    if (args.item.text === 'Enr/Cons Rap Commercial') {
      let represans = [];
      await this.represanService
        .getRepresansList()
        .toPromise()
        .then((data) => {
          represans = data['_embedded'].represans;
        });
      const selectedRepresant = represans.find(
        (represan) =>
          represan.codeUtil ===
            localStorage.getItem('login').toLocaleLowerCase() ||
          represan.codeUtil === localStorage.getItem('login').toUpperCase()
      );
      console.log(selectedRepresant);
      if (String(selectedRepresant) !== 'undefined') {
        this.router
          .navigateByUrl('/dashboard', { skipLocationChange: true })
          .then(() => {
            localStorage.setItem('isdashboard', 'false');
            this.router.navigate(['rapportCommercial']);
          });
      } else {
        this.errorMessage = 'Vous êtes pas un commercial !';
        this.displayErrorDialog = true;
      }
    }
    // Consult Rap Commerciaux
    if (args.item.text === 'Consult Rap Commerciaux') {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          localStorage.setItem('isdashboard', 'false');
          this.router.navigate(['rapportCommercial']);
        });
    }
    // Enreg Act Recouv
    if (args.item.text === 'Enreg Act Recouv') {
      this.router.navigate(['/enregactrecouv']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Validation des visites
    if (args.item.text === 'Validation des visites') {
      this.router.navigate(['/validationdesvisites']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Affectation Recouvrement
    if (args.item.text === 'Affectation Recouvrement') {
      this.router.navigate(['/affectation-action-recouvrement']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Consult Mission de Recouv
    if (args.item.text === 'Consult Mission de Recouv') {
      this.router.navigate(['/consultation-mission-recouvrement']);
      localStorage.setItem('isdashboard', 'false');
    }
    // Chif Aff Repres/Four
    if (args.item.text === 'Chif Aff Repres/Four') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/chiffAffRepresFour']);
    }
    // Echeance Cheque
    if (args.item.text === 'Echeance Cheque') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/echeance-cheque']);
    }
    // Annulation B/L
    if (args.item.text === 'Annulation B/L') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/annulation-BL']);
    }

    /** Inventaire **/
    // Lancement Inventaire
    if (args.item.text === 'Lancement Inventaire') {
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/lancement-inventaire']);
    }
  }
  confirmFactCollective(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.mdp === this.mdpFactCollective) {
      this.showConfirmFactCollective = false;
      localStorage.setItem('isdashboard', 'false');
      this.router.navigate(['/facturationCollective']);
    } else {
      this.msgs = 'Mot de passe incorrecte !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('mdpFactCollect').focus();
      this.ov.show(e, document.getElementById('mdpFactCollect'));
    }
  }

  toggleSidebar() {
    if (this.IAmDoingSomething === true) {
      this.IAmDoingSomething = false;
    } else {
      this.IAmDoingSomething = true;
    }
  }

  async onLoggedout() {
    await this.loginService
      .procedureStocke(localStorage.getItem('login'), 'SORTIE')
      .toPromise()
      .then((data) => {});
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('login');
    localStorage.removeItem('selectedMenu');
    localStorage.removeItem('mdp');

    this.router.navigate(['/login']);
    window.close();
  }

  changeLang(language: string) {
    this.translate.use(language);
  }
  public onBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
    // Restricting sub menu wrapper height
    if (args.items.length > 13) {
      (closest(args.element, '.e-menu-wrapper') as HTMLElement).style.height =
        '68vh';
    }
    // Handling sub menu items
    for (let i = 0; i < args.items.length; i++) {
      if (this.hiddenItems.indexOf(args.items[i].text) > -1) {
        this.menuObj.hideItems([args.items[i].text], false);
      }
    }
  }
}
