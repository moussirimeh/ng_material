import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { ClientService } from '../services/client.service';
import { DatePipe } from '@angular/common';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { ActionRecouvService } from '../services/actionRecouv.service';
import { AffectationRecouvrementService } from '../services/affectationRecouvrement.service';
import { AffectationRecouvrement } from '../services/affectationRecouvrement';
import { ConsultationMissionRecouvrementComponent } from '../consultation-mission-recouvrement/consultation-mission-recouvrement.component';
import { OverlayPanel } from 'primeng/overlaypanel';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Client } from '../services/client';
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
  selector: 'app-affectation-action-recouvrement',
  templateUrl: './affectation-action-recouvrement.component.html',
  styleUrls: ['./affectation-action-recouvrement.component.scss'],
})
export class AffectationActionRecouvrementComponent implements OnInit {
  @ViewChild(ConsultationMissionRecouvrementComponent) ConsultMissionsRecouv;
  users = [];
  selectedDest: any = null;
  selectedInit: any = null;
  clients = [];
  selectedClient: any = null;
  montant = '';
  details = '';
  tn: any;
  dateFinPrevue: Date = new Date();
  dateMin: Date = new Date();
  @ViewChild('grid')
  public grid: GridComponent;
  releves = [];
  showGrid = false;
  creances = 0;
  showConfirm = false;
  showConsultMissions = false;
  codeClient = '';
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
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(
    private loginService: LoginService,
    private clientService: ClientService,
    private actionRecouvService: ActionRecouvService,
    private affectationRecouvrementService: AffectationRecouvrementService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  async ngOnInit() {
    this.dateFinPrevue.setDate(this.dateFinPrevue.getDate() + 60);
    this.tn = {
      firstDayOfWeek: 1,
      dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
      ],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
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
        'Decembre',
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
        'Dec',
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy',
    };
    await this.loginService
      .getLoginsListByOrder()
      .toPromise()
      .then((data) => {
        this.users = data['_embedded'].users;
      });
      await this.clientService
      .getClientsAffectationRecouvrementByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }
  /*async recherche(filterValue: string) {
    await this.clientService
      .searchClientByDenoStartsWith(filterValue)
      .toPromise()
      .then((data) => {
        const clientsTmp = data['_embedded'].clients;
        this.clients = clientsTmp;
      })
      .catch((data) => {
        // console.log('error reload data clients');
      })
      .finally(() => {
        // this.grid.refresh();
      });
  }*/
  async releve(index: number, e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.selectedClient !== null) {
      await this.actionRecouvService
        .getRelevesForAffect(this.selectedClient.code)
        .toPromise()
        .then((data) => {
          this.releves = data['_embedded'].releveAffectActRecouvs;
        });
      if (this.releves.length > 0) {
        this.creances = 0;
        for (const rlv of this.releves) {
          this.creances =
            this.creances + (Number(rlv.debit) - Number(rlv.credit));
        }
        if (index === 1) {
          this.showGrid = true;
        }
      } else {
        if (index === 1) {
          this.msgs = 'Aucune piece trouvée pour ce client';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('relv'));
        }
      }
    } else {
      if (index === 1) {
        this.msgs = 'Veuillez selectionner un client';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('clt'));
      }
    }
  }
  async enregistrer(e) {
    this.ov.hide();
    this.wasInside = true;
    await this.releve(0, e);
    if (this.selectedDest !== null) {
      if (this.selectedClient !== null) {
        if (
          String(Number(this.montant)) === 'NaN' ||
          Number(this.montant) <= 0
        ) {
          this.msgs = 'Montant erronné !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('mnt'));
        } else {
          // if (Number(this.montant) <= this.creances) {
            let affectRecouv = [];
            await this.affectationRecouvrementService
              .getFirstAffectationRecouvrementByCodeCltAndCodeSituation(
                this.selectedClient.code,
                'O'
              )
              .toPromise()
              .then((data) => {
                affectRecouv = data['_embedded'].affectationRecouvrement;
              });

            if (affectRecouv.length === 0) {
              const affRec: AffectationRecouvrement = {
                numMission: null,
                codeClt: this.selectedClient.code,
                codeInitiateur: localStorage.getItem('login'),
                codeDestinataire: this.selectedDest.codeUtil,
                montant: this.montant,
                details: this.details,
                dateDebut: new Date().toLocaleDateString('en-GB'),
                dateFin: this.dateFinPrevue.toLocaleDateString('en-GB'),
                codeSituation: 'O',
                lue: 'N',
              };
              if (
                localStorage.getItem('login').toUpperCase() ===
                this.selectedDest.codeUtil.toUpperCase()
              ) {
                affRec.lue = 'O';
              }
              await this.affectationRecouvrementService
                .createAffectationRecouvrement(affRec)
                .toPromise()
                .then((data) => {})
                .catch((error) => {
                  /*
                  this.messageService.add({
                    key: 'tc',
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur : ' + String(error)
                  });*/
                });
                this.selectedDest = null;
                  this.selectedClient = null;
                  // this.clients = [];
                  this.codeClient = '';
                  this.montant = '';
                  this.details = '';
                  this.dateFinPrevue = new Date();
                  this.dateFinPrevue.setDate(this.dateFinPrevue.getDate() + 60);
                  this.showGrid = false;
            } else {
              this.showConfirm = true;
              // si oui ===> module Consultation Action De Recouvrement affectRecouv[0].numMission
            }
          /*} else {
            this.msgs =
              'Montant depassant la créance : ' + this.creances.toFixed(3);
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('mnt'));
          }*/
        }
      } else {
        this.msgs = 'Veuillez selectionner un client';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('clt'));
      }
    } else {
      this.msgs = 'Veuillez selectionner un destinataire';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('desti'));
    }
  }
  annulerSelection() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  addPiece() {
    const selectedRow: any = this.grid.getSelectedRecords()[0];
    if (this.details === '') {
      this.details =
        this.details + selectedRow.piece + ' ' + selectedRow.numero;
    } else {
      this.details =
        this.details + ', ' + selectedRow.piece + ' ' + selectedRow.numero;
    }
  }
  async showMissionsRecouv(e) {
    this.ConsultMissionsRecouv.selectedClient = this.selectedClient;
    this.ConsultMissionsRecouv.codeClient = this.ConsultMissionsRecouv.selectedClient.code;
    await this.ConsultMissionsRecouv.chercherClientParCode(e);
    await this.ConsultMissionsRecouv.afficher(e);
    this.ConsultMissionsRecouv.hideNvlSaisieButton = true;
    this.showConfirm = false;
    this.showConsultMissions = true;
  }
  async chercherClientParCode(e) {
    if (this.codeClient !== '') {
      await this.clientService
        .getClientByCode(this.codeClient)
        .toPromise()
        .then((data) => {
          if (data['_embedded'].clients.length > 0) {
            this.selectedClient = data['_embedded'].clients[0];
          } else {
            this.msgs = 'Client non trouvé !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('clt'));
            this.selectedClient = null;
          }
        });
    }
  }
  syncCodeClient() {
    if (this.selectedClient !== null) {
      this.codeClient = this.selectedClient.code;
    } else {
      this.codeClient = '';
      this.details = '';
    }
  }
  formatterMontant() {
    if (String(Number(this.montant)) === 'NaN') {
      this.montant = '';
    } else {
      this.montant = Number(this.montant).toFixed(3);
    }
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
}
