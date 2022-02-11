import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'charts',
        loadChildren: './charts/charts.module#ChartsModule',
      },
      {
        path: 'components',
        loadChildren:
          './material-components/material-components.module#MaterialComponentsModule',
      },
      {
        path: 'forms',
        loadChildren: './forms/forms.module#FormsModule',
      },
      {
        path: 'grid',
        loadChildren: './grid/grid.module#GridModule',
      },
      {
        path: 'tables',
        loadChildren: './tables/tables.module#TablesModule',
      },
      {
        path: 'blank-page',
        loadChildren: './blank-page/blank-page.module#BlankPageModule',
      },
      {
        path: 'equivalence',
        loadChildren: './equivalence/equivalence.module#EquivalenceModule',
      },
      {
        path: 'changementreference',
        loadChildren:
          './changementReference/changementreference.module#ChangementreferenceModule',
      },
      {
        path: 'fusionreference',
        loadChildren:
          './fusionReference/fusionreference.module#FusionreferenceModule',
      },
      {
        path: 'impressionfactures',
        loadChildren:
          './impressionfactures/impressionfactures.module#ImpressionFacturesModule',
      },
      {
        path: 'releveClient',
        loadChildren: './releveClient/releveClient.module#ReleveClientModule',
      },
      {
        path: 'rapportfreclient',
        loadChildren: './rapportfreclient/rapportfreclient.module#RapportfreclientModule',
      },
     // consultationreference.inv
      {
        path: 'consultationreference',
        loadChildren: './consultationreference/consultationreference.module#ConsultationreferenceModule',
      },
// Modification Emplacement.
   {
     path: 'modificationemplacement',
     loadChildren: './modificationemplacement/modificationemplacement.module#ModificationemplacementModule',
     },
// historiquecreanceszone
     {
      path: 'historiquecreanceszone',
      loadChildren: './historiquecreanceszone/historiquecreanceszone.module#HistoriquecreanceszoneModule',
      },


// MiseajourinventaireModule
{
  path: 'miseajourinventaire',
  loadChildren: './miseajourinventaire/miseajourinventaire.module#MiseajourinventaireModule',
  },
  // etatinventaire
{
  path: 'etatinventaire',
  loadChildren: './etatinventaire/etatinventaire.module#EtatinventaireModule',
  },
      {
        path: 'rapportreservation',
        loadChildren: './rapportreservation/rapportreservation.module#RapportreservationModule',
      },
      {
        path: 'stockenmouvement',
        loadChildren: './stockenmouvement/stockenmouvement.module#StockenmouvementModule',
      },
      {
        path: 'rapportavoirscomptant',
        loadChildren: './rapportavoirscomptant/rapportavoirscomptant.module#RapportavoirscomptantModule',
      },

      {
        path: 'client',
        loadChildren: './client/client.module#ClientModule',
      },
      {
        path: 'ajustementReference',
        loadChildren:
          './ajustementReference/ajustementReference.module#AjustementReferenceModule',
      },
      {
        path: 'catalogueprix',
        loadChildren:
          './catalogueprix/catalogueprix.module#CatalogueprixModule',
      },
      {
        path: 'appurement-reglement',
        loadChildren:
          './appurement-reglement/appurement-reglement.module#AppurementReglementModule',
      },
      {
        path: 'reglementClient',
        loadChildren:
          './reglementClient/reglementClient.module#ReglementClientModule',
      },
      {
        path: 'consultation-reglement-client',
        loadChildren:
          './consultation-reglement-client/consultation-reglement-client.module#ConsultationReglementClientModule',
      },
      {
        path: 'recettes-caisse-secondaire',
        loadChildren:
          './recettes-caisse-secondaire/recettes-caisse-secondaire.module#RecettesCaisseSecondaireModule',
      },
      {
        path: 'recettes-caisse-principale',
        loadChildren:
          './recettes-caisse-principale/recettes-caisse-principale.module#RecettesCaissePrincipaleModule',
      },
      {
        path: 'depenses-caisse-secondaire',
        loadChildren:
          './depenses-caisse-secondaire/depenses-caisse-secondaire.module#DepensesCaisseSecondaireModule',
      },
      {
        path: 'depenses-caisse-principale',
        loadChildren:
          './depenses-caisse-principale/depenses-caisse-principale.module#DepensesCaissePrincipaleModule',
      },
      {
        path: 'feuille-caisse-secondaire',
        loadChildren:
          './feuille-caisse-secondaire/feuille-caisse-secondaire.module#FeuilleCaisseSecondaireModule',
      },
      {
        path: 'feuille-caisse-principale',
        loadChildren:
          './feuille-caisse-principale/feuille-caisse-principale.module#FeuilleCaissePrincipaleModule',
      },
      {
        path: 'apurement-regts-cmpt',
        loadChildren:
          './apurement-regts-cmpt/apurement-regts-cmpt.module#ApurementRegtsCmptModule',
      },
      {
        path: 'facturationTermeIndiv',
        loadChildren:
          './facturationTermeIndiv/facturationTermeIndiv.module#FacturationTermeIndivModule',
      },
      {
        path: 'apurement-regts-cmpt',
        loadChildren:
          './apurement-regts-cmpt/apurement-regts-cmpt.module#ApurementRegtsCmptModule',
      },
      {
        path: 'appurement-reglement',
        loadChildren:
          './appurement-reglement/appurement-reglement.module#AppurementReglementModule',
      },
      {
        path: 'facturationCollective',
        loadChildren:
          './facturationCollective/facturationCollective.module#FacturationCollectiveModule',
      },
      {
        path: 'fournisseur',
        loadChildren: './fournisseur/fournisseur.module#FournisseurModule',
      },

      {
        path: 'cons-ann-apurts-cmpt',
        loadChildren:
          './cons-ann-apurts-cmpt/cons-ann-apurts-cmpt.module#ConsAnnApurtsCmptModule',
      },
      {
        path: 'annulationFacture',
        loadChildren:
          './annulationFacture/annulationFacture.module#AnnulationFactureModule',
      },
      {
        path: 'reconstitution-facture-terme',
        loadChildren:
          './reconstitution-facture-terme/reconstitution-facture-terme.module#ReconstitutionFactureTermeModule',
      },
      {
        path: 'reconstitutionFacture',
        loadChildren:
          './reconstitutionFacture/reconstitutionFacture.module#ReconstitutionFactureModule',
      },
      {
        path: 'objectifs-frs-cmds',
        loadChildren:
          './objectifs-frs-cmds/objectifs-frs-cmds.module#ObjectifsFrsCmdsModule',
      },
      // Objectifs des  Fournisseurs / Realise
      {
        path: 'objectifs-fours-realise',
        loadChildren:
          './objectifs-frs-realise/objectifs-frs-realise.module#ObjectifsFrsRealiseModule',
      },
      {
        path: 'rapportCommercial',
        loadChildren:
          './rapportCommercial/rapportCommercial.module#RapportCommercialModule',
      },
      {
        path: 'chiffAffRepresFour',
        loadChildren:
          './chiffAffRepresFour/chiffAffRepresFour.module#ChiffAffRepresFourModule',
      },
      {
        path: 'programmation-visite',
        loadChildren:
          './programmation-visite/programmation-visite.module#ProgrammationVisiteModule',
      },
      {
        path: 'enregistrement-visite',
        loadChildren:
          './enregistrement-visite/enregistrement-visite.module#EnregistrementVisiteModule',
      },
      {
        path: 'consultation-visite',
        loadChildren:
          './consultation-visite/consultation-visite.module#ConsultationVisiteModule',
      },
      {
        path: 'reglement-client-cont',
        loadChildren:
          './reglement-client-cont/reglement-client-cont.module#ReglementClientContModule',
      },
      {
        path: 'demande-proforma',
        loadChildren:
          './demande-proforma/demande-proforma.module#DemandeProformaModule',
      },
      {
        path: 'modification-proforma',
        loadChildren:
          './modification-proforma/modification-proforma.module#ModificationProformaModule',
      },
      {
        path: 'annulation-proforma',
        loadChildren:
          './annulation-proforma/annulation-proforma.module#AnnulationProformaModule',
      },
      {
        path: 'nouvelle-commande',
        loadChildren:
          './nouvelle-commande/nouvelle-commande.module#NouvelleCommandeModule',
      },
      {
        path: 'vente',
        loadChildren:
          './vente/vente.module#VenteModule',
      },
      {
        path: 'avoir',
        loadChildren:
          './avoir/avoir.module#AvoirModule',
      },
      {
        path: 'modification-commande',
        loadChildren:
          './modification-commande/modification-commande.module#ModificationCommandeModule',
      },
      {
        path: 'annulation-commande',
        loadChildren:
          './annulation-commande/annulation-commande.module#AnnulationCommandeModule',
      },
      {
        path: 'etat-commande-client',
        loadChildren:
          './etat-commande-client/etat-commande-client.module#EtatCommandeClientModule',
      },
      {
        path: 'consultation-demande-devis',
        loadChildren:
          './consultation-demande-devis/consultation-demande-devis.module#ConsultationDemandeDevisModule',
      },
      {
        path: 'consultaionref',
        loadChildren:
          './consultation-ref/consultation-ref.module#ConsultationRefModule',
      },
      {
        path: 'affectationmarque',
        loadChildren:
          './affectation-marque/affectation-marque.module#AffectationMarqueModule',
      },
      {
        path: 'mesmessagesenv',
        loadChildren:
          './mes-messages-env/mes-messages-env.module#MesMessagesEnvModule',
      },
      {
        path: 'enregactrecouv',
        loadChildren:
          './enreg-act-recouv/enreg-act-recouv.module#EnregActRecouvModule',
      },
      {
        path: 'enregactrecouvmult',
        loadChildren:
          './enreg-act-recouv-mult/enreg-act-recouv-mult.module#EnregActRecouvMultModule',
      },
      {
        path: 'consultationactionrecouv',
        loadChildren:
          './consultaion-action-recouvrement/consultaion-action-recouvrement.module#ConsultaionActionRecouvrementModule',
      },
      {
        path: 'FermetureBondeSortie',
        loadChildren: './vent-ferm-bs/vent-ferm-bs.module#VentFermBsModule',
      },
      {
        path: 'AnnulBondeSortie',
        loadChildren:
          './vente-annul-bs/vente-annul-bs.module#VenteAnnulBsModule',
      },
      {
        path: 'ModifBondeSortie',
        loadChildren:
          './vente-modif-bs/vente-modif-bs.module#VenteModifBSModule',
      },
      {
        path: 'AjoutBondeSortie',
        loadChildren:
          './vente-ajout-bs/vente-ajout-bs.module#VenteAjoutBSModule',
      },
      {
        path: 'VenteBsfermes',
        loadChildren:
          './vente-bsfermes/vente-bsfermes.module#VenteBsfermesModule',
      },
      {
        path: 'ConsultBondeSortie',
        loadChildren:
          './vente-conslt-bs/vente-conslt-bs.module#VenteConsltBsModule',
      },
      {
        path: 'vente-bsouverts',
        loadChildren:
          './vente-bsouverts/vente-bsouverts.module#VenteBSOuvertsModule',
      },
      {
        path: 'DuplicatBS',
        loadChildren: './vente-dup-bs/vente-dup-bs.module#VenteDupBsModule',
      },
      {
        path: 'RapportBS',
        loadChildren:
          './vente-rapportbs/vente-rapportbs.module#VenteRapportbsModule',
      },
      {
        path: 'validationdesvisites',
        loadChildren:
          './validation-des-visites/validation-des-visites.module#ValidationDesVisitesModule',
      },
      {
        path: 'reservationstock',
        loadChildren:
          './reservation-stock/reservation-stock.module#ReservationStockModule',
      },
      {
        path: 'listedesclients',
        loadChildren:
          './liste-des-clients/liste-des-clients.module#ListeDesClientsModule',
      },
      {
        path: 'Transf-Fres-Cpt',
        loadChildren:
          './transf-cpt/transf-cpt.module#TransfCptModule',
      },
      {
        path: 'listedesproformats',
        loadChildren:
          './liste-des-proformats/liste-des-proformats.module#ListeDesProformatsModule',
      },
      {
        path: 'etatstockmort',
        loadChildren:
          './etat-stock-mort/etat-stock-mort.module#EtatStockMortModule',
      },
      {
        path: 'etatavoircomptantcaisse',
        loadChildren:
          './etat-avoir-comptant-caisse/etat-avoir-comptant-caisse.module#EtatAvoirComptantCaisseModule',
      },
      {
        path: 'enregbncommande',
        loadChildren:
          './enregistrement-bon-commande/enregistrement-bon-commande.module#EnregistrementBonCommandeModule',
      },
      {
        path: 'etatavoirterme',
        loadChildren:
          './etat-avoirs-terme/etat-avoirs-terme.module#EtatAvoirsTermeModule',
      },
      {
        path: 'etatavoirterme',
        loadChildren:
          './etat-avoir-comptant/etat-avoir-comptant.module#EtatAvoirComptantModule',
      },
      {
        path: 'rapportachat',
        loadChildren:
          './rapport-des-achats/rapport-des-achats.module#RapportDesAchatsModule',
      },
      {
        path: 'rapportvente',
        loadChildren:
          './rapport-des-ventes/rapport-des-ventes.module#RapportDesVentesModule',
      },
      {
        path: 'transit',
        loadChildren: './transit/transit.module#TransitModule',
      },
      {
        path: 'reeditionrapacht',
        loadChildren:
          './reedition-rapport-achat/reedition-rapport-achat.module#ReeditionRapportAchatModule',
      },
      {
        path: 'accessecurite',
        loadChildren:
          './acces-securite/acces-securite.module#AccesSecuriteModule',
      },
      {
        path: 'ConsultationLivraison',
        loadChildren:
          './vente-cons-livraison/vente-cons-livraison.module#VenteConsLivraisonModule',
      },
      {
        path: 'Livraison',
        loadChildren:
          './vente-livraison/vente-livraison.module#VenteLivraisonModule',
      },
      {
        path: 'RaportLivraison',
        loadChildren:
          './vente-raport-livraison/vente-raport-livraison.module#VenteRaportLivraisonModule',
      },
      {
        path: 'AnalyseCAVendeur',
        loadChildren:
          './vente-analyse-ca/vente-analyse-ca.module#VenteAnalyseCaModule',
      },
      {
        path: 'blank-page',
        loadChildren: './blank-page/blank-page.module#BlankPageModule',
      },
      {
        path: 'appurement-reglement',
        loadChildren:
          './appurement-reglement/appurement-reglement.module#AppurementReglementModule',
      },
      {
        path: 'consultation-reglement-client',
        loadChildren:
          './consultation-reglement-client/consultation-reglement-client.module#ConsultationReglementClientModule',
      },
      {
        path: 'recettes-caisse-secondaire',
        loadChildren:
          './recettes-caisse-secondaire/recettes-caisse-secondaire.module#RecettesCaisseSecondaireModule',
      },
      {
        path: 'recettes-caisse-principale',
        loadChildren:
          './recettes-caisse-principale/recettes-caisse-principale.module#RecettesCaissePrincipaleModule',
      },
      {
        path: 'depenses-caisse-secondaire',
        loadChildren:
          './depenses-caisse-secondaire/depenses-caisse-secondaire.module#DepensesCaisseSecondaireModule',
      },
      {
        path: 'depenses-caisse-principale',
        loadChildren:
          './depenses-caisse-principale/depenses-caisse-principale.module#DepensesCaissePrincipaleModule',
      },
      {
        path: 'feuille-caisse-secondaire',
        loadChildren:
          './feuille-caisse-secondaire/feuille-caisse-secondaire.module#FeuilleCaisseSecondaireModule',
      },
      {
        path: 'feuille-caisse-principale',
        loadChildren:
          './feuille-caisse-principale/feuille-caisse-principale.module#FeuilleCaissePrincipaleModule',
      },
      {
        path: 'apurement-regts-cmpt',
        loadChildren:
          './apurement-regts-cmpt/apurement-regts-cmpt.module#ApurementRegtsCmptModule',
      },
      {
        path: 'cons-ann-apurts-cmpt',
        loadChildren:
          './cons-ann-apurts-cmpt/cons-ann-apurts-cmpt.module#ConsAnnApurtsCmptModule',
      },
      {
        path: 'programmation-visite',
        loadChildren:
          './programmation-visite/programmation-visite.module#ProgrammationVisiteModule',
      },
      {
        path: 'enregistrement-visite',
        loadChildren:
          './enregistrement-visite/enregistrement-visite.module#EnregistrementVisiteModule',
      },
      {
        path: 'consultation-visite',
        loadChildren:
          './consultation-visite/consultation-visite.module#ConsultationVisiteModule',
      },
      {
        path: 'reglement-client-cont',
        loadChildren:
          './reglement-client-cont/reglement-client-cont.module#ReglementClientContModule',
      },
      {
        path: 'demande-proforma',
        loadChildren:
          './demande-proforma/demande-proforma.module#DemandeProformaModule',
      },
      {
        path: 'modification-proforma',
        loadChildren:
          './modification-proforma/modification-proforma.module#ModificationProformaModule',
      },
      {
        path: 'annulation-proforma',
        loadChildren:
          './annulation-proforma/annulation-proforma.module#AnnulationProformaModule',
      },
      {
        path: 'nouvelle-commande',
        loadChildren:
          './nouvelle-commande/nouvelle-commande.module#NouvelleCommandeModule',
      },
      {
        path: 'modification-commande',
        loadChildren:
          './modification-commande/modification-commande.module#ModificationCommandeModule',
      },
      {
        path: 'annulation-commande',
        loadChildren:
          './annulation-commande/annulation-commande.module#AnnulationCommandeModule',
      },
      {
        path: 'etat-commande-client',
        loadChildren:
          './etat-commande-client/etat-commande-client.module#EtatCommandeClientModule',
      },
      {
        path: 'consultation-demande-devis',
        loadChildren:
          './consultation-demande-devis/consultation-demande-devis.module#ConsultationDemandeDevisModule',
      },
      {
        path: 'liste-bl-encours',
        loadChildren:
          './liste-bl-encours/liste-bl-encours.module#ListeBlEncoursModule',
      },
      {
        path: 'duplicata',
        loadChildren: './duplicata/duplicata.module#DuplicataModule',
      },
      {
        path: 'demande-devis',
        loadChildren: './demande-devis/demande-devis.module#DemandeDevisModule',
      },
      {
        path: 'ajout-modif-supp-ref',
        loadChildren:
          './ajout-modif-supp-ref/ajout-modif-supp-ref.module#AjoutModifSuppRefModule',
      },
      {
        path: 'etat-facture',
        loadChildren: './etat-facture/etat-facture.module#EtatFactureModule',
      },
      {
        path: 'etat-tva',
        loadChildren: './etat-tva/etat-tva.module#EtatTvaModule',
      },
      {
        path: 'rapport-comptant',
        loadChildren:
          './rapport-comptant/rapport-comptant.module#RapportComptantModule',
      },
      {
        path: 'analyse-ca-marges',
        loadChildren:
          './analyse-ca-marges/analyse-ca-marges.module#AnalyseCaMargesModule',
      },
      {
        path: 'mes-messages-visites',
        loadChildren:
          './mes-messages-visites/mes-messages-visites.module#MesMessagesVisitesModule',
      },
      {
        path: 'affectation-action-recouvrement',
        loadChildren:
          './affectation-action-recouvrement/affectation-action-recouvrement.module#AffectationActionRecouvrementModule',
      },
      {
        path: 'consultation-mission-recouvrement',
        loadChildren:
          './consultation-mission-recouvrement/consultation-mission-recouvrement.module#ConsultationMissionRecouvrementModule',
      },

      {
        path: 'black-page',
        loadChildren: './black-page/black-page.module#BlackPageModule',
      },
      {
        path: 'marques',
        loadChildren: './marques/marques.module#MarquesModule',
      },
      {
        path: 'familles',
        loadChildren: './familles/familles.module#FamillesModule',
      },
      {
        path: 'Etat-Engagement-Four',
        loadChildren:
          './comptabilite-etat-engagement-four/comptabilite-etat-engagement-four.module#ComptabiliteEtatEngagementFourModule',
      },
      {
        path: 'Reglement-Fournisseur',
        loadChildren:
          './comptabilite-reglement-fournisseur/comptabilite-reglement-fournisseur.module#ComptabiliteReglementFournisseurModule',
      },
       // CMDs FRS non Soldees
       {
        path: 'cmds-frs-non-soldees',
        loadChildren:
          './cmds-frs-non-soldees/cmds-frs-non-soldees.module#CmdsFrsNonSoldeesModule',
      },
      // relance-dynamique
     {
        path: 'relance-dynamique',
        loadChildren:
          './relance-dynamique/relance-dynamique.module#RelanceDynamiqueModule',
      },
      // changement Titre
      {
        path: 'changement-titre',
        loadChildren:
          './changement-titre/changement-titre.module#ChangementTitreModule',
      },
      {
        path: 'Reception-reglt-Fournisseur',
        loadChildren:
          './reception-reglt-fournisseur/reception-reglt-fournisseur.module#ReceptionRegltFournisseurModule',
      },
      // Etat-des-Reglemnts-Clts
      {
        path: 'Etat-des-Reglemnts-Clts',
        loadChildren:
          './etat-reg-clts/etat-reg-clts.module#EtatRegCltsModule',
      },
       // Annulation cmd client
       {
        path: 'Annulation-CMD-Client',
        loadChildren:
          './annulation-cmd-clt/annulation-cmd-clt.module#AnnulationCmdCltModule'
      },
      // 'Stock Stable'
      {
        path: 'Stock-Stable',
        loadChildren:
          './stock-stable/stock-stable.module#StockStableModule'
      },
      // etat-appur-reg-clts
      {
        path: 'Etat-Appur-Reg-Clts',
        loadChildren:
          './etat-appur-reg-clts/etat-appur-reg-clts.module#EtatAppurRegCltsModule'
      },

      // Etat-Parametres
      {
        path: 'Etat-Parametres',
        loadChildren:
          './etat-paramtres/etat-paramtres.module#EtatParamtresModule'
      },
      //  Avoir-sur-Achat
      {
        path: 'Avoir-sur-Achat',
        loadChildren:
          './avoir-sur-achat/avoir-sur-achat.module#AvoirSurAchatModule'
      },

        // Achat
        {
          path: 'Achat',
          loadChildren:
            './achat/achat.module#AchatModule'
        },
        // '/Historique-Reg-Clts'
        {
          path: 'Historique-Reg-Clts',
          loadChildren:
            './historique-reg-clts/historique-reg-clts.module#HistoriqueRegCltsModule'
        },
      // Modif cmd client
      {
        path: 'Modif-CMD-Client',
        loadChildren:
          './modif-cmd-client/modif-cmd-client.module#ModifCmdClientModule'
      },
     // batch-client

     {
      path: 'batch-client',
      loadChildren:
        './batch-client/batch-client.module#BatchClientModule'
    },

   // batch-client       // batch-client cont

     {
      path: 'batch-client',
      loadChildren:
        './batch-client/batch-client.module#BatchClientModule'
    },

        {
          path: 'batch-client',
          loadChildren:
            './batch-client/batch-client.module#BatchClientModule'
        },

      // Nouvelle-CMDs-Client
      {
        path: 'Nouvelle-CMDs-Client',
        loadChildren:
          './nouvelle-cmd-client/nouvelle-cmd-client.module#NouvelleCmdClientModule'
      },

      // Consultation Reg FRS
      {
        path: 'Consultation-Reg-FRS',
        loadChildren:
          './consultation-reg-four/consultation-reg-four.module#ConsultationRegFourModule',
      },
      // rapport-ajustements
      {
        path: 'rapport-ajustements',
        loadChildren:
          './rapport-ajustement/rapport-ajustement.module#RapportAjustementModule',
      },
      // Rapport-Ventes-a-Perte
      {
        path: 'Rapport-Ventes-a-Perte',
        loadChildren:
          './rapport-vente-perte/rapport-vente-perte.module#RapportVentePerteModule',
      },
      // Fiche Client
      {
        path: 'Fiche-Client',
        loadChildren: './fiche-client/fiche-client.module#FicheClientModule',
      },
      // 'reimpression-Bordereau'
      {
        path: 'reimpression-Bordereau',
        loadChildren: './reimpression-bord/reimpression-bord.module#ReimpressionBordModule',
      },
      // Situation-de-la-Tresorerie
      {
        path: 'Situation-de-la-Tresorerie',
        loadChildren: './consultation-tresorerie/consultation-tresorerie.module#ConsultationTresorerieModule',
      },
      // Gestion-de-la-Tresorerie'
      {
        path: 'Gestion-de-la-Tresorerie',
        loadChildren: './gestion-tresorerie/gestion-tresorerie.module#GestionTresorerieModule',
      },
      // Fiche Vendeur
      {
        path: 'Fiche-Vendeur',
        loadChildren: './fiche-vendeur/fiche-vendeur.module#FicheVendeurModule',
      },
      // Deficit Commande Frs
      {
        path: 'Deficit-Commande-Frs',
        loadChildren:
          './deficit-commande-frs/deficit-commande-frs.module#DeficitCommandeFrsModule',
      },
      // B/L En cours
      {
        path: 'BL-En-cours',
        loadChildren: './bl-en-cours/bl-en-cours.module#BlEnCoursModule',
      },
      // Analyse-Chiffres-Affaires
      {
        path: 'Analyse-Chiffres-Affaires',
        loadChildren:
          './analyse-chiff-aff/analyse-chiff-aff.module#AnalyseChiffAffModule',
      },
      // Determination-clients-Noyeau
     {
        path: 'det-clients-noyeau',
        loadChildren: './det-clients-noyeau/det-clients-noyeau.module#DetClientsNoyeauModule',
      },
      // historiqu-des-typ-clts
      {
        path: 'historique-typo-clients',
        loadChildren: './historique-typo-clients/historique-typo-clients.module#HistoriqueTypoClientsModule',
      },
      // Modif typo clts
      {
        path: 'modif-typo-clts',
        loadChildren: './modif-typo-clts/modif-typo-clts.module#ModifTypoCltsModule',
      },
      // Deblocage clts N1
      {
        path: 'deblocageclts',
        loadChildren: './deblocageclts/deblocageclts.module#DeblocagecltsModule',
      },
      // Deblocage clts N2
      {
        path: 'deblocagecltsn2',
        loadChildren: './deblocagecltsn2/deblocagecltsn2.module#Deblocagecltsn2Module',
      },

      // bl avoir non recu
      {
        path: 'blavoir-bl-non-recu',
        loadChildren: './blavoir-bl-non-recu/blavoir-bl-non-recu.module#BlavoirBlNonRecuModule',
      },
      // reception bl avoir
      {
        path: 'reception-bl-av-fact',
        loadChildren: './reception-bl-av-fact/reception-bl-av-fact.module#ReceptionBlAvFactModule',
      },
      // Mise-a-Jour-BD'
      {
        path: 'Mise-a-Jour-BD',
        loadChildren:
          './mise-a-jour-bd/mise-a-jour-bd.module#MiseAJourBdModule',
      },
      // Etat Offre Envoye
      {
        path: 'etat-offre-envoye',
        loadChildren:
          './etat-offre-envoye/etat-offre-envoye.module#EtatOffreEnvoyeModule',
      },
      // creance-client
      {
        path: 'Creance-Client',
        loadChildren:
          './creance-client/creance-client.module#CreanceClientModule',
      },
      // '/tableau-de-bord-Financ'
      {
        path: 'tableau-de-bord-Financ',
        loadChildren:
          './tableau-de-bord/tableau-de-bord.module#TableauDeBordModule',
      },
      // Creance-Client-Cont

      {
        path: 'Creance-Client-Cont',
        loadChildren:
          './creance-client/creance-client.module#CreanceClientModule',
      },
      // evolution-des chiffres d affaires
      {
        path: 'Evolution-des-chiffres-aff',
        loadChildren:
          './evolution-chiffres-affaires/evolution-chiffres-affaires.module#EvolutionChiffresAffairesModule',
      },
      {
        path: 'sfamilles',
        loadChildren: './sfamilles/sfamilles.module#SfamillesModule',
      },
      {
        path: 'transfert-au-contentieux',
        loadChildren:
          './transfert-au-contentieux/transfert-au-contentieux.module#TransfertAuContentieuxModule',
      },
      {
        path: 'echeance-cheque',
        loadChildren:
          './echeance-cheque/echeance-cheque.module#EcheanceChequeModule',
      },
      {
        path: 'offre-client',
        loadChildren: './offre-client/offre-client.module#OffreClientModule',
      },
      {
        path: 'offre-fournisseur',
        loadChildren:
          './offre-fournisseur/offre-fournisseur.module#OffreFournisseurModule',
      },
      {
        path: 'offre-article',
        loadChildren: './offre-article/offre-article.module#OffreArticleModule',
      },
      {
        path: 'ventes-suspension-tva',
        loadChildren: './ventes-suspension-tva/ventes-suspension-tva.module#VentesSuspensionTvaModule',
      },
      {
        path: 'fiche-stock-detail',
        loadChildren: './fiche-stock-detail/fiche-stock-detail.module#FicheStockDetailModule',
      },
      {
        path: 'fiche-stock',
        loadChildren: './fiche-stock-detail/fiche-stock-detail.module#FicheStockDetailModule',
      },
      {
        path: 'valorisation-stock',
        loadChildren: './valorisation-stock/valorisation-stock.module#ValorisationStockModule',
      },
      {
        path: 'etat-visite-client',
        loadChildren: './etat-visite-client/etat-visite-client.module#EtatVisiteClientModule',
      },
      {
        path: 'annulation-BL',
        loadChildren: './annulation-bl/annulation-bl.module#AnnulationBLModule',
      },
      {
        path: 'offre-client-an',
        loadChildren: './offre-client-an/offre-client-an.module#OffreClientAnModule'
      },
      {
        path: 'Verification-Commande',
        loadChildren:
          './verification-commande/verification-commande.module#VerificationCommandeModule'
      },
      {
        path: 'nouvelle-offre-rg-mg',
        loadChildren:
          './nouvelle-offre-rg-mg/nouvelle-offre-rg-mg.module#NouvelleOffreRgMgModule'
      },
      {
        path: 'autorisation-offre',
        loadChildren:
          './autorisation-offre/autorisation-offre.module#AutorisationOffreModule'
      },
      {
        path: 'modification-offre-rg-mg',
        loadChildren:
          './modification-offre-rg-mg/modification-offre-rg-mg.module#ModificationOffreRgMgModule'
      },
      {
        path: 'authorisation-prix-avoir',
        loadChildren:
          './authorisation-prix-avoir/authorisation-prix-avoir.module#AuthorisationPrixAvoirModule'
      }, // bl avoir non recu
      {
        path: 'blavoir-bl-non-recu',
        loadChildren: './blavoir-bl-non-recu/blavoir-bl-non-recu.module#BlavoirBlNonRecuModule',
      },
      // reception bl avoir
      {
        path: 'reception-bl-av-fact',
        loadChildren: './reception-bl-av-fact/reception-bl-av-fact.module#ReceptionBlAvFactModule',
      },
      // Modification B/L
      {
        path: 'modification-bl',
        loadChildren: './modification-bl/modification-bl.module#ModificationBlModule',
      },
      // annulation-offre
      {
        path: 'annulation-offre',
        loadChildren: './annulation-offre/annulation-offre.module#AnnulationOffreModule',
      },
      // 'Saisie Inventaire'
      {
        path: 'saisie-inventaire',
        loadChildren:
          './saisie-inventaire/saisie-inventaire.module#SaisieInventaireModule'
      },
      // 'Consultation Emplacement'
      {
        path: 'consultation-emplacement',
        loadChildren:
          './consultation-emplacement/consultation-emplacement.module#ConsultationEmplacementModule'
      },
      // Details Clients
      {
        path: 'detail-client',
        loadChildren:
          './detail-client/detail-client.module#DetailClientModule'
      },
      {
        path: 'copie-offre',
        loadChildren:
          './copie-offre/copie-offre.module#CopieOffreModule'
      },
      {
        path: 'lancement-inventaire',
        loadChildren:
          './lancement-inventaire/lancement-inventaire.module#LancementInventaireModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
