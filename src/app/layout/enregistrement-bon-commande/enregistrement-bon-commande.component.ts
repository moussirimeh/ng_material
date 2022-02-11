import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Recettes } from '../services/recettes';
import { RecettesService } from '../services/recettes.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-enregistrement-bon-commande',
  templateUrl: './enregistrement-bon-commande.component.html',
  styleUrls: ['./enregistrement-bon-commande.component.scss'],

})
export class EnregistrementBonCommandeComponent implements OnInit {

  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  blocked: boolean;
  SelectedRecette: Recettes = {
          id:  '',
          combine:  '',
          date:  '',
          net:  '',
          ht:  '',
          remise:  '',
          operateur:  '',
          sens:  '',
          vendeur:  '',
          ref:  '',
          gel:  '',
          base0:  '',
          base10:  '',
          base17:  '',
          base29:  '',
          reg:  '',
          datReg:  '',
          caisse:  '',
          timbre:  '',
          modify:  '',
          livrObserv:  '',
          bcEqm:  '',
          livrObservat:  '',
          bonSort:  '',
  } ;
  recettes: null;
  readonly = true;
  nouvelleref = '';
  wasInside: boolean;
  combine = '';
  constructor(private recetteservice: RecettesService,
              private config: NgSelectConfig,
              private loginService: LoginService
               ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous'; }
  changerRef() {
     if (this.SelectedRecette !== null && this.SelectedRecette !== undefined) {
       this.nouvelleref = this.SelectedRecette.ref;
     }
    }
  ngOnInit() {

    this.SelectedRecette = null;
    // charger les recettes
    this.recetteservice.getRecettesListByOrderByCombine().toPromise().then(
      (data) => {
        console.log(data);
        this.recettes =  data['_embedded'].recettes;
          }
    );
    this.blocked = false;
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
       this.ovo.hide();

    }
    this.wasInside = false;

  }
//// chercher les combine des recettes en front end
public onSearchRecette(word: string, item: Recettes): boolean {
  return item.combine.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}
  async Enregistrer(e) {

    this.ovo.hide();
    this.wasInside = true;
    console.log(this.nouvelleref);
    console.log(this.SelectedRecette);

    if (this.SelectedRecette !== null && this.SelectedRecette !== undefined ) {
      this.combine = this.SelectedRecette.combine;
    } else {
      this.combine = '';
    }
    console.log(this.combine);

   if ((this.nouvelleref !== '') && (this.combine === '' )) {
      console.log('erreur :' + this.nouvelleref + 'different de lespace');
      this.ms = 'Conversion de type variant incorrecte !';
    this.ovo.show(e, document.getElementById('enreg'));
    } else if (this.nouvelleref !== '' && this.combine !== '' ) {

          this.ValiderBonCommande();

    }

  }
  /// la méthode pour valider la bon de commande
  async ValiderBonCommande () {
      const ref = this.SelectedRecette.ref;
    const bonCom: Recettes = {
      id:  this.SelectedRecette.id,
      combine:  this.SelectedRecette.combine,
      date:  this.SelectedRecette.date,
      net:  this.SelectedRecette.net,
      ht:  this.SelectedRecette.ht,
      remise:  this.SelectedRecette.remise,
      operateur: this.SelectedRecette.operateur,
      sens:  this.SelectedRecette.sens,
      vendeur:  this.SelectedRecette.vendeur,
      ref:  this.nouvelleref,
      gel:  this.SelectedRecette.gel,
      base0:  this.SelectedRecette.base0,
      base10:  this.SelectedRecette.base10,
      base17:  this.SelectedRecette.base17,
      base29:  this.SelectedRecette.base29,
      reg:  this.SelectedRecette.reg,
      datReg:  this.SelectedRecette.datReg,
      caisse:  this.SelectedRecette.caisse,
      timbre:  this.SelectedRecette.timbre,
      modify:  this.SelectedRecette.modify,
      livrObserv:  this.SelectedRecette.livrObserv,
      bcEqm: this.SelectedRecette.bcEqm,
      livrObservat:  this.SelectedRecette.livrObservat,
      bonSort:  this.SelectedRecette.bonSort,
    } ;
      console.log(bonCom);
      this.blocked = true;
      await this.recetteservice.updateRecettes(bonCom).toPromise().then(
        (data) => {
       //   this.SelectedRecette.ref = bonCom.ref;
          console.log('okk' + data);
          this.SelectedRecette = null;
          this.nouvelleref = null;

               }
      );

      this.recetteservice.getRecettesListByOrderByCombine().toPromise().then(
        (data) => {
          console.log(data);
          this.recettes =  data['_embedded'].recettes;
            });
      this.blocked = false;
              // MOOOOOOOOOOCHAR
              const codeUtil = localStorage.getItem('login');
              const moduteName = globals.selectedMenu;
              const paramMouchar = this.SelectedRecette.combine + ' AN bc ' + ref + ' NV bc ' + this.nouvelleref  ;
              this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
              .then((data) => {
                console.log(data);
              });


  }

}
