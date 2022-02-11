import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { ClientService } from '../services/client.service';
import { DatePipe } from '@angular/common';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { AffectationRecouvrementService } from '../services/affectationRecouvrement.service';
import { ActionRecouvService } from '../services/actionRecouv.service';
import { AffectationRecouvrement } from '../services/affectationRecouvrement';
import { SteService } from '../services/ste.service';
import { Ste } from '../services/ste';
import * as jspdf from 'jspdf';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Client } from '../services/client';
import { NgSelectConfig } from '@ng-select/ng-select';
import { globals } from 'src/environments/environment';
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
  selector: 'app-consultation-mission-recouvrement',
  templateUrl: './consultation-mission-recouvrement.component.html',
  styleUrls: ['./consultation-mission-recouvrement.component.scss'],
  providers: [DatePipe],
})
export class ConsultationMissionRecouvrementComponent implements OnInit {
  ste: Ste;
  users = [];
  selectedDest: any = null;
  selectedInit: any = null;
  clients = [];
  @Input() selectedClient: any = null;
  tn: any;
  dateFinPrevue: Date = new Date();
  dateMin: Date = new Date();
  selectedSituation = 'O';
  selectedLues = 'T';
  showGridMission = false;
  showGridAction = false;
  missions = [];
  actions = [];
  @ViewChild('gridMissions')
  public gridMissions: GridComponent;
  @ViewChild('gridActions')
  public gridActions: GridComponent;
  @ViewChild('gridMissionsNonLues')
  public gridMissionsNonLues: GridComponent;
  @Input() hideNvlSaisieButton = false;
  @Input() codeClient = '';
  hideBtFermerMission = true;
  hideMissionsNonLuesCtrl = true;
  blockDocument = false;
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
    'font-size': '14px',
    'background-color': ' #b7d8b7',
  };
  styleOvPanel = {};
  constructor(
    private loginService: LoginService,
    private clientService: ClientService,
    private affectationRecouvrementService: AffectationRecouvrementService,
    private actionRecouvService: ActionRecouvService,
    private steService: SteService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  async ngOnInit() {
    this.dateFinPrevue.setDate(this.dateFinPrevue.getDate() + 90);
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
    await this.testMissionNonLues();
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
  async recherche(filterValue: string) {
    await this.clientService
      .searchClientByDenoStartsWith(filterValue)
      .toPromise()
      .then((data) => {
        const clientsTmp = data['_embedded'].clients;
        this.clients = clientsTmp;
      })
      .catch((data) => {
        console.log('error reload data clients');
      })
      .finally(() => {
        // this.grid.refresh();
      });
  }
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    let codeClt = '';
    if (this.selectedClient !== null) {
      codeClt = this.selectedClient.code;
    }
    let codeInit = '';
    if (this.selectedInit !== null) {
      codeInit = this.selectedInit.codeUtil;
    }
    let codeDest = '';
    if (this.selectedDest !== null) {
      codeDest = this.selectedDest.codeUtil;
    }
    await this.affectationRecouvrementService
      .getMissionsRecouv(
        codeClt,
        codeInit,
        codeDest,
        this.selectedSituation,
        this.selectedLues,
        this.dateFinPrevue.toLocaleDateString('en-GB')
      )
      .toPromise()
      .then((data) => {
        this.missions = data['_embedded'].missionRecouvrements;
      });
    if (this.missions.length > 0) {
      this.showGridMission = true;
    } else {
      this.msgs = 'Aucune mission trouvée !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e);
    }
  }
  annulerSelectionMissions() {
    if (this.gridMissions.getSelectedRowIndexes()[0] >= 0) {
      this.gridMissions.selectRows([]);
      this.hideBtFermerMission = true;
      this.showGridAction = false;
      this.actions = [];
    }
  }
  annulerSelectionActions() {
    if (this.gridActions.getSelectedRowIndexes()[0] >= 0) {
      this.gridActions.selectRows([]);
    }
  }
  async showDetails() {
    if (this.gridMissions.getSelectedRecords().length > 0) {
      const selectedRow: any = this.gridMissions.getSelectedRecords()[0];
      await this.actionRecouvService
        .getActionRecouvByNumMission(selectedRow.numMission)
        .toPromise()
        .then((data) => {
          console.log(data);
          this.actions = data['_embedded'].actionRecouv;
        });
      this.showGridAction = true;
    }
  }
  async fermerMission() {
    if (
      this.missions.length > 0 &&
      this.gridMissions.getSelectedRecords().length > 0
    ) {
      const selectedRow: any = this.gridMissions.getSelectedRecords()[0];
      const affRecouv: AffectationRecouvrement = {
        numMission: selectedRow.numMission,
        codeClt: selectedRow.codeClt,
        codeInitiateur: selectedRow.codeInitiateur,
        codeDestinataire: selectedRow.codeDestinataire,
        montant: selectedRow.montant,
        details: selectedRow.details,
        dateDebut: selectedRow.dateDebut,
        dateFin: selectedRow.dateFin,
        codeSituation: 'F',
        lue: String(selectedRow.lue)[0],
      };
      await this.affectationRecouvrementService
        .updateAffectationRecouvrement(affRecouv)
        .toPromise()
        .then((data) => {});
      this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          'FERM. MISSION RECOUV. ' + selectedRow.numMission
        )
        .subscribe((data) => {});
      this.missions.splice(this.gridMissions.getSelectedRowIndexes()[0], 1);
      this.gridMissions.refresh();
    }
  }
  nvlSaisie() {
    this.showGridMission = false;
    this.showGridAction = false;
    this.missions = [];
    this.actions = [];
    this.hideBtFermerMission = true;
  }
  async apercu() {
    if (this.missions.length > 0) {
      await this.steService
        .getSte()
        .toPromise()
        .then((data) => {
          this.ste = data['_embedded'].ste[0];
        });
      const displayDate = new Date().toLocaleDateString('en-GB');
      const doc1 = new jspdf();
      // page a4 (210 x 297 mm)
      let numPage = 1;
      const longPage = 265;
      doc1.setFontSize(10);
      doc1.setFontStyle('arial');
      doc1.text('SOCIETE  :   ' + this.ste.societe, 14, 10);
      doc1.text('ADRESSE :   ' + this.ste.adresse, 14, 15);
      doc1.text('VILLE       :   ' + this.ste.ville, 14, 20);
      doc1.text('TEL           :   ' + this.ste.tel, 14, 25);
      doc1.text('FAX          :   ' + this.ste.fax, 14, 30);
      doc1.text('E-mail       :   ' + this.ste.email, 14, 35);

      doc1.setFontSize(18);
      doc1.setFontStyle('arial');
      doc1.text('Suivi des missions de recouvrement', 65, 45);

      doc1.setFontSize(10);
      doc1.setFontStyle('arial');
      doc1.text('Edité le : ' + displayDate, 170, 55);

      doc1.setFontStyle('italic');
      doc1.text('Action', 10, 65);
      doc1.text('Date', 120, 65);
      doc1.text('Effectuée par', 150, 65);
      doc1.text('N°Visite', 185, 65);

      let y = 70;
      doc1.setFontStyle('normal');
      for (const mis of this.missions) {
        doc1.setDrawColor(0);
        doc1.setFillColor(216, 223, 227);
        doc1.rect(10, y - 4, 190, 11, 'F');

        doc1.text('Designation Client', 10, y);
        doc1.text('Date Debut', 60, y);
        doc1.text('Date Fin Prévue', 80, y);
        doc1.text('Initiateur', 110, y);
        doc1.text('Destinataire', 130, y);
        doc1.text('Montant', 155, y);
        doc1.text('Details', 175, y);

        y = y + 5;
        doc1.setFontStyle('bold');

        if (String(mis.denoClt).length > 19) {
          doc1.text(String(mis.denoClt).substr(0, 18) + '.', 10, y);
        } else {
          doc1.text(mis.denoClt, 10, y);
        }
        doc1.text(mis.dateDebut, 60, y);
        doc1.text(mis.dateFin, 80, y);
        doc1.text(mis.codeInitiateur, 110, y);
        doc1.text(mis.codeDestinataire, 130, y);
        doc1.text(mis.montant, 170, y, 'right');
        doc1.text(mis.details, 175, y);

        y = y + 6;
        doc1.setFontStyle('normal');
        let actionsTmp = [];
        await this.actionRecouvService
          .getActionRecouvByNumMission(mis.numMission)
          .toPromise()
          .then((data) => {
            actionsTmp = data['_embedded'].actionRecouv;
          });
        if (actionsTmp.length > 0) {
          for (const act of actionsTmp) {
            let nbrLignes = 1;
            const longLigne = 65;
            if ((String(act.action).length % longLigne) / longLigne < 0.5) {
              nbrLignes =
                Number((String(act.action).length / longLigne).toFixed(0)) + 1;
            } else {
              nbrLignes = Number(
                (String(act.action).length / longLigne).toFixed(0)
              );
            }
            for (let i = 1; i <= nbrLignes; i++) {
              if (i === 1) {
                if (i === nbrLignes) {
                  doc1.text(
                    String(act.action).substr((i - 1) * longLigne, longLigne),
                    10,
                    y
                  );
                } else {
                  doc1.text(
                    String(act.action).substr((i - 1) * longLigne, longLigne) +
                      '-',
                    10,
                    y
                  );
                }
                doc1.text(act.date, 120, y);
                doc1.text(act.effectueePar, 150, y);
                if (String(act.numVisite) !== 'null') {
                  doc1.text(act.numVisite, 185, y);
                } else {
                  doc1.text('', 185, y);
                }
              } else {
                if (i === nbrLignes) {
                  doc1.text(
                    String(act.action).substr((i - 1) * longLigne, longLigne),
                    10,
                    y
                  );
                } else {
                  doc1.text(
                    String(act.action).substr((i - 1) * longLigne, longLigne) +
                      '-',
                    10,
                    y
                  );
                }
              }
              y = y + 6;
              if (y > longPage) {
                doc1.setFontStyle('normal');
                doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                numPage++;
                doc1.addPage();

                doc1.setFontStyle('italic');
                doc1.text('Action', 10, 15);
                doc1.text('Date', 120, 15);
                doc1.text('Effectuée par', 150, 15);
                doc1.text('N°Visite', 185, 15);

                doc1.setFontStyle('normal');
                y = 20;
              }
            }
          }
          y = y + 1;
        } else {
          doc1.text('aucune action', 10, y);
          y = y + 7;
          if (y > longPage) {
            doc1.setFontStyle('normal');
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
            numPage++;
            doc1.addPage();

            doc1.setFontStyle('italic');
            doc1.text('Action', 10, 15);
            doc1.text('Date', 120, 15);
            doc1.text('Effectuée par', 150, 15);
            doc1.text('N°Visite', 185, 15);

            doc1.setFontStyle('normal');
            y = 20;
          }
        }
        if (y > longPage) {
          doc1.setFontStyle('normal');
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
          numPage++;
          doc1.addPage();

          doc1.setFontStyle('italic');
          doc1.text('Action', 10, 15);
          doc1.text('Date', 120, 15);
          doc1.text('Effectuée par', 150, 15);
          doc1.text('N°Visite', 185, 15);

          doc1.setFontStyle('normal');
          y = 20;
        }
      }
      doc1.text('Page ' + numPage.toFixed(0), 100, 289);
      window.open(doc1.output('bloburl'), '_blank');
    }
  }
  async chercherClientParCode(e) {
    console.log(this.codeClient);

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
            document.getElementById('codeClt').focus();
            this.ov.show(e, document.getElementById('codeClt'));
            this.selectedClient = null;
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
    }
  }
  rowSelected() {
    this.hideBtFermerMission = false;
  }
  async testMissionNonLues() {
    let missionsNonLues = [];
    // get missons ouverts non lues
    await this.affectationRecouvrementService
      .getMissionsRecouv('', '', localStorage.getItem('login'), 'O', 'N', '')
      .toPromise()
      .then((data) => {
        console.log(data);

        missionsNonLues = data['_embedded'].missionRecouvrements;
      });
    if (missionsNonLues.length > 0) {
      this.hideMissionsNonLuesCtrl = false;
      this.missions = missionsNonLues;
    }
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  annulerSelectionMissionsNonLues() {
    if (this.gridMissionsNonLues.getSelectedRowIndexes()[0] >= 0) {
      this.gridMissionsNonLues.selectRows([]);
    }
  }
  async lireMission() {
    if (this.gridMissionsNonLues.getSelectedRecords().length > 0) {
      this.blockDocument = true;
      const selectedRow: any = this.gridMissionsNonLues.getSelectedRecords()[0];
      const affectRecouv: AffectationRecouvrement = {
        numMission: selectedRow.numMission,
        codeClt: selectedRow.codeClt,
        codeInitiateur: selectedRow.codeInitiateur,
        codeDestinataire: selectedRow.codeDestinataire,
        montant: selectedRow.montant,
        details: selectedRow.details,
        dateDebut: selectedRow.dateDebut,
        dateFin: selectedRow.dateFin,
        codeSituation: String(selectedRow.codeSituation)[0],
        lue: 'O',
      };
      await this.affectationRecouvrementService
        .updateAffectationRecouvrement(affectRecouv)
        .toPromise()
        .then();
      // delete item from array missions
      this.missions.splice(this.missions.indexOf(selectedRow), 1);
      this.gridMissionsNonLues.refresh();
      if (this.missions.length === 0) {
        this.hideMissionsNonLuesCtrl = true;
      }
      this.blockDocument = false;
    }
  }
}
