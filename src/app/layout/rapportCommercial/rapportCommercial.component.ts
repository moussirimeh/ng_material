import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { RepresanService } from '../services/represan.service';
import { RapportCommercialService } from '../services/rapportCommercial.service';
import { RapportCommercial } from '../services/rapportCommercial';
import { RapcomCaCltZoneService } from '../services/rapcomCaCltZone.service';
import { RapcomCaCltZone } from '../services/rapcomCaCltZone';
import { RapcomCaNoyauxService } from '../services/rapcomCaNoyaux.service';
import { RapcomCaNoyaux } from '../services/rapcomCaNoyaux';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
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
  selector: 'app-rapportcommercial',
  templateUrl: './rapportCommercial.component.html',
  styleUrls: ['./rapportCommercial.component.scss'],
})
export class RapportCommercialComponent implements OnInit {
  represans;
  date = new Date();
  monthNames = [
    { num: '01', name: 'Janvier', dayNumber: '31' },
    { num: '02', name: 'Fevrier', dayNumber: '28' },
    { num: '03', name: 'Mars', dayNumber: '31' },
    { num: '04', name: 'Avril', dayNumber: '30' },
    { num: '05', name: 'Mai', dayNumber: '31' },
    { num: '06', name: 'Juin', dayNumber: '30' },
    { num: '07', name: 'Juillet', dayNumber: '31' },
    { num: '08', name: 'Aout', dayNumber: '31' },
    { num: '09', name: 'Septembre', dayNumber: '30' },
    { num: '10', name: 'Octobre', dayNumber: '31' },
    { num: '11', name: 'Novembre', dayNumber: '30' },
    { num: '12', name: 'Decembre', dayNumber: '31' },
  ];
  months: any[] = [];
  annee = this.date.getFullYear();
  annee_1 = this.date.getFullYear() - 1;
  afficherClicked = false;
  dateFin = '';
  selectedRepresant = null;
  enableSelectRepresant = false;
  selectedMonth = null;
  rapCom: RapportCommercial = {
    id: null,
    numRapport: null,
    codeRep: null,
    dateEnreg: null,
    mois: null,
    ca1: null,
    ca: null,
    caYtd1: null,
    caYtd: null,
    creanceTotal: null,
    retardTotal: null,
    retard130: null,
    retard3160: null,
    retard6190: null,
    retard91: null,
    impayes: null,
    commentairesVentes: null,
    commentairePaiments: null,
    commentaireZone: null,
    suiviCaClientsProspects: null,
    commentairesClientsNoyaux: null,
    affairesGagnees: null,
    affairesPerdues: null,
    affairesEncours: null,
    actionsEncours: null,
    infosConcurrence: null,
    ideesBesoins: null,
    valide: null,
  };
  rapComZone: RapcomCaCltZone = {
    id: null,
    zone: null,
    ca1: null,
    ca: null,
    numRapport: null,
  };
  rapComNoyaux: RapcomCaNoyaux = {
    id: null,
    codeClt: null,
    denoClt: null,
    ca1: null,
    ca: null,
    numRapport: null,
  };
  variationCa = null;
  variationCaYtd = null;
  objectifPourc = null;
  // retards = null;
  retardsPourc = null;
  zones = [];
  totalCaZone;
  totalCa1Zone;
  zonePourc;
  noyaux = [];
  totalCaNoyaux;
  totalCa1Noyaux;
  noyauxPourc;
  editEnable = false;
  enregistrerVisible = false;
  apercueVisible = true;
  validerVisible = false;
  verif = [];
  nomModule;

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
    private represanService: RepresanService,
    private rapportCommercialService: RapportCommercialService,
    private rapcomCaCltZoneService: RapcomCaCltZoneService,
    private rapcomCaNoyauxService: RapcomCaNoyauxService,
    private steService: SteService
  ) {}

  async ngOnInit() {
    this.months.push({ label: '', value: null });
    for (let i = 0; i <= this.date.getMonth(); i++) {
      this.months.push({ label: this.monthNames[i].name, value: i + 1 });
    }
    await this.represanService
      .getRepresansList()
      .toPromise()
      .then((data) => {
        this.represans = data['_embedded'].represans;
        this.represans.unshift({ id: '', code: null, deno: '' });
      });
    this.nomModule = globals.selectedMenu;
    if (this.nomModule === 'Enr/Cons Rap Commercial') {
      this.enableSelectRepresant = true;
      this.selectedRepresant = this.represans.find(
        (represan) =>
          represan.codeUtil ===
            localStorage.getItem('login').toLocaleLowerCase() ||
          represan.codeUtil === localStorage.getItem('login').toUpperCase()
      );
    }
  }
  initialiserRapport() {
    this.rapCom = {
      id: null,
      numRapport: null,
      codeRep: null,
      dateEnreg: null,
      mois: null,
      ca1: null,
      ca: null,
      caYtd1: null,
      caYtd: null,
      creanceTotal: null,
      retardTotal: null,
      retard130: null,
      retard3160: null,
      retard6190: null,
      retard91: null,
      impayes: null,
      commentairesVentes: null,
      commentairePaiments: null,
      commentaireZone: null,
      suiviCaClientsProspects: null,
      commentairesClientsNoyaux: null,
      affairesGagnees:
        '1.Affaire\r          Lot de\r          Montant\r' +
        '2.Affaire\r          Lot de\r          Montant\r' +
        '3.Affaire\r          Lot de\r          Montant\r',
      affairesPerdues:
        '1.Affaire\r          Lot de\r          Montant\r' +
        '2.Affaire\r          Lot de\r          Montant\r' +
        '3.Affaire\r          Lot de\r          Montant\r',
      affairesEncours:
        '1.Affaire\r          Lot de\r          Montant\r          Etat\r' +
        '2.Affaire\r          Lot de\r          Montant\r          Etat\r' +
        '3.Affaire\r          Lot de\r          Montant\r          Etat\r',
      actionsEncours: null,
      infosConcurrence: null,
      ideesBesoins: null,
      valide: null,
    };
    this.rapComZone = {
      id: null,
      zone: null,
      ca1: null,
      ca: null,
      numRapport: null,
    };
    this.rapComNoyaux = {
      id: null,
      codeClt: null,
      denoClt: null,
      ca1: null,
      ca: null,
      numRapport: null,
    };
  }
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    this.initialiserRapport();
    console.log(this.selectedRepresant);
    if (
      String(this.selectedRepresant) === 'undefined' ||
      this.selectedRepresant === null ||
      this.selectedRepresant.code === null
    ) {
      this.msgs = 'Veuillez selectionner un représentant !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('representant').focus();
      this.ov.show(e, document.getElementById('representant'));
    } else {
      if (this.selectedMonth === null || this.selectedMonth.value === null) {
        this.msgs = 'Veuillez selectionner un mois !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('mois').focus();
        this.ov.show(e, document.getElementById('mois'));
      } else {
        // panel ventes
        // let verif = [];
        await this.rapportCommercialService
          .getRapportCommercialByCodeRepAndMois(
            this.selectedRepresant.code,
            String(this.selectedMonth.value)
          )
          .toPromise()
          .then((data) => {
            this.verif = data['_embedded'].rapportCommercial;
          });
        if (this.verif.length === 0) {
          let evolCa = [];
          let evolCa1 = [];
          await this.rapportCommercialService
            .evolutionCa(this.selectedRepresant.code)
            .toPromise()
            .then((data) => {
              evolCa = data;
            });
          const evolCaTemp = [];
          for (let i = 1; i <= this.selectedMonth.value; i++) {
            const chiffAff = evolCa.find((e) => e[0] === i);
            if (String(chiffAff) !== 'undefined') {
              evolCaTemp.push(chiffAff);
            } else {
              evolCaTemp.push([i, 0]);
            }
          }
          evolCa = evolCaTemp;
          await this.rapportCommercialService
            .evolutionCa1(this.selectedRepresant.code)
            .toPromise()
            .then((data) => {
              evolCa1 = data;
            });
          const evolCa1Temp = [];
          for (let i = 1; i <= 12; i++) {
            const chiffAff1 = evolCa1.find((e) => e[0] === i);
            if (String(chiffAff1) !== 'undefined') {
              evolCa1Temp.push(chiffAff1);
            } else {
              evolCa1Temp.push([i, 0]);
            }
          }
          evolCa1 = evolCa1Temp;

          this.rapCom.ca = Number(
            String(evolCa[this.selectedMonth.value - 1][1])
          )
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.rapCom.ca1 = Number(
            String(evolCa1[this.selectedMonth.value - 1][1])
          )
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          if (Number(this.rapCom.ca1.replace(' ', '')) !== 0) {
            this.variationCa = (
              (Number(this.rapCom.ca.replace(' ', '')) /
                Number(this.rapCom.ca1.replace(' ', ''))) *
              100
            ).toFixed(2);
          } else {
            this.variationCa = '0.00';
          }

          let sommeYtd = 0;
          let sommeYtd1 = 0;
          for (let i = 0; i < this.selectedMonth.value; i++) {
            sommeYtd = sommeYtd + Number(evolCa[i][1]);
            sommeYtd1 = sommeYtd1 + Number(evolCa1[i][1]);
          }

          this.rapCom.caYtd = sommeYtd
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.rapCom.caYtd1 = sommeYtd1
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          if (sommeYtd1 !== 0) {
            this.variationCaYtd = ((sommeYtd / sommeYtd1) * 100).toFixed(2);
          } else {
            this.variationCaYtd = '0.00';
          }
          this.objectifPourc = (
            (sommeYtd * 100) /
            ((Number(this.selectedRepresant.objectif) / 12) *
              this.selectedMonth.value)
          ).toFixed(2);

          // panel suivi paiments
          this.dateFin =
            this.monthNames[this.selectedMonth.value - 1].dayNumber + '/';
          if (
            this.selectedMonth.value === 2 &&
            this.date.getFullYear() % 4 === 0
          ) {
            this.dateFin = '29/';
          }
          this.dateFin =
            this.dateFin +
            this.monthNames[this.selectedMonth.value - 1].num +
            '/' +
            this.date.getFullYear();
          if (this.date.getMonth() + 1 === this.selectedMonth.value) {
            this.dateFin = this.date.toLocaleDateString('en-GB');
          }
          let creances = [];
          await this.rapportCommercialService
            .getCreances(this.selectedRepresant.code, this.dateFin)
            .toPromise()
            .then((data) => {
              creances = data['_embedded'].rapportCommercialCreanceses;
            });
          let totSolde = 0,
            totR30 = 0,
            totR60 = 0,
            totR90 = 0,
            totR91 = 0,
            totImp = 0;
          for (const creance of creances) {
            totSolde = totSolde + Number(creance.solde);
            totR30 = totR30 + Number(creance.r30);
            totR60 = totR60 + Number(creance.r60);
            totR90 = totR90 + Number(creance.r90);
            totR91 = totR91 + Number(creance.r91);
            totImp = totImp + Number(creance.imp);
          }
          this.rapCom.creanceTotal = totSolde
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.rapCom.retard130 = totR30
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.rapCom.retard3160 = totR60
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.rapCom.retard6190 = totR90
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.rapCom.retard91 = totR91
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.rapCom.impayes = totImp
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.rapCom.retardTotal = (totR30 + totR60 + totR90 + totR91 + totImp)
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.retardsPourc = (
            ((totR30 + totR60 + totR90 + totR91 + totImp) / totSolde) *
            100
          ).toFixed(2);

          // noyaux
          await this.rapportCommercialService
            .getNoyaux(this.selectedRepresant.code, this.selectedMonth.value)
            .toPromise()
            .then((data) => {
              this.noyaux = data['_embedded'].rapportCommercialNoyauxes;
            });

          let totCaNoy = 0,
            totCa1Noy = 0;
          for (const noyau of this.noyaux) {
            totCaNoy = totCaNoy + noyau.ca;
            totCa1Noy = totCa1Noy + noyau.ca1;
          }
          this.totalCaNoyaux = totCaNoy
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.totalCa1Noyaux = totCa1Noy
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          if (totCa1Noy === 0) {
            this.noyauxPourc = '0';
          } else {
            this.noyauxPourc = ((totCaNoy / totCa1Noy) * 100).toFixed(2);
          }
          // zones
          await this.rapportCommercialService
            .getZones(this.selectedRepresant.code, this.selectedMonth.value)
            .toPromise()
            .then((data1) => {
              this.zones = data1['_embedded'].rapportCommercialZones;
            });
          let totCaZn = 0,
            totCa1Zn = 0;
          for (const zone of this.zones) {
            totCaZn = totCaZn + zone.ca;
            totCa1Zn = totCa1Zn + zone.ca1;
          }
          this.totalCaZone = totCaZn
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          this.totalCa1Zone = totCa1Zn
            .toFixed(3)
            .replace(/\d(?=(\d{3})+\.)/g, '$& ');
          if (totCa1Zn === 0) {
            this.zonePourc = '0';
          } else {
            this.zonePourc = ((totCaZn / totCa1Zn) * 100).toFixed(2);
          }
          this.editEnable = true;
          this.enregistrerVisible = true;
        } else {
          this.rapCom = this.verif[0];
          // ventes
          if (this.verif[0].valide === 'O') {
            this.rapCom.ca1 = Number(this.verif[0].ca1)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.ca = Number(this.verif[0].ca)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.variationCa = (
              (Number(this.rapCom.ca.replace(' ', '')) /
                Number(this.rapCom.ca1.replace(' ', ''))) *
              100
            ).toFixed(2);

            this.rapCom.caYtd = Number(this.verif[0].caYtd)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.caYtd1 = Number(this.verif[0].caYtd1)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.variationCaYtd = (
              (Number(this.verif[0].caYtd.replace(' ', '')) /
                Number(this.verif[0].caYtd1.replace(' ', ''))) *
              100
            ).toFixed(2);
            this.objectifPourc = (
              (Number(this.verif[0].caYtd.replace(' ', '')) * 100) /
              ((Number(this.selectedRepresant.objectif) / 12) *
                this.selectedMonth.value)
            ).toFixed(2);

            this.rapCom.commentairesVentes = this.verif[0].commentairesVentes;
            // creances
            this.dateFin =
              this.monthNames[this.selectedMonth.value - 1].dayNumber + '/';
            if (
              this.selectedMonth.value === 2 &&
              this.date.getFullYear() % 4 === 0
            ) {
              this.dateFin = '29/';
            }
            this.dateFin =
              this.dateFin +
              this.monthNames[this.selectedMonth.value - 1].num +
              '/' +
              this.date.getFullYear();
            if (this.date.getMonth() === this.selectedMonth.value) {
              this.dateFin = this.date.toLocaleDateString('en-GB');
            }
            this.rapCom.creanceTotal = Number(this.verif[0].creanceTotal)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.retard130 = Number(this.verif[0].retard130)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.retard3160 = Number(this.verif[0].retard3160)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.retard6190 = Number(this.verif[0].retard6190)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.retard91 = Number(this.verif[0].retard91)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.impayes = Number(this.verif[0].impayes)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');

            this.rapCom.retardTotal = (
              Number(this.verif[0].retard130.replace(' ', '')) +
              Number(this.verif[0].retard3160.replace(' ', '')) +
              Number(this.verif[0].retard6190.replace(' ', '')) +
              Number(this.verif[0].retard91.replace(' ', '')) +
              Number(this.verif[0].impayes.replace(' ', ''))
            )
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.retardsPourc = (
              ((Number(this.verif[0].retard130.replace(' ', '')) +
                Number(this.verif[0].retard3160.replace(' ', '')) +
                Number(this.verif[0].retard6190.replace(' ', '')) +
                Number(this.verif[0].retard91.replace(' ', '')) +
                Number(this.verif[0].impayes.replace(' ', ''))) /
                Number(this.verif[0].creanceTotal.replace(' ', ''))) *
              100
            ).toFixed(2);
            this.rapCom.commentairePaiments = this.verif[0].commentairePaiments;
            // zone
            await this.rapcomCaCltZoneService
              .getRapcomCaCltZone(this.verif[0].numRapport)
              .toPromise()
              .then((data) => {
                this.zones = data['_embedded'].rapportCommercialZones;
              });
            let totCaZn = 0,
              totCa1Zn = 0;
            for (const zone of this.zones) {
              totCaZn = totCaZn + Number(zone.ca);
              totCa1Zn = totCa1Zn + Number(zone.ca1);
            }

            this.totalCaZone = totCaZn
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.totalCa1Zone = totCa1Zn
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            if (totCa1Zn === 0) {
              this.zonePourc = '0';
            } else {
              this.zonePourc = ((totCaZn / totCa1Zn) * 100).toFixed(2);
            }
            this.rapCom.commentaireZone = this.verif[0].commentaireZone;
            // prospects
            this.rapCom.suiviCaClientsProspects =
              this.verif[0].suiviCaClientsProspects;
            // noyaux
            await this.rapcomCaNoyauxService
              .getRapcomCaNoyaux(this.verif[0].numRapport)
              .toPromise()
              .then((data) => {
                this.noyaux = data['_embedded'].rapportCommercialNoyauxes;
              });

            let totCaNoy = 0,
              totCa1Noy = 0;
            for (const noyau of this.noyaux) {
              totCaNoy = totCaNoy + Number(noyau.ca);
              totCa1Noy = totCa1Noy + Number(noyau.ca1);
            }
            this.totalCaNoyaux = totCaNoy
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.totalCa1Noyaux = totCa1Noy
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            if (totCa1Noy === 0) {
              this.noyauxPourc = '0';
            } else {
              this.noyauxPourc = ((totCaNoy / totCa1Noy) * 100).toFixed(2);
            }
            this.rapCom.commentairesClientsNoyaux =
              this.verif[0].commentairesClientsNoyaux;

            // aff gagnees
            this.rapCom.affairesGagnees = this.verif[0].affairesGagnees;
            // aff perdues
            this.rapCom.affairesPerdues = this.verif[0].affairesPerdues;
            // aff en cours
            this.rapCom.affairesEncours = this.verif[0].affairesEncours;
            // actions en cours
            this.rapCom.actionsEncours = this.verif[0].actionsEncours;
            // infos conc
            this.rapCom.infosConcurrence = this.verif[0].infosConcurrence;
            // idees et besoins
            this.rapCom.ideesBesoins = this.verif[0].ideesBesoins;

            this.editEnable = false;
            this.enregistrerVisible = false;
          } else {
            let evolCa = [];
            let evolCa1 = [];
            await this.rapportCommercialService
              .evolutionCa(this.selectedRepresant.code)
              .toPromise()
              .then((data) => {
                console.log(data);

                evolCa = data;
              });
            const evolCaTemp = [];
            for (let i = 1; i <= this.selectedMonth.value; i++) {
              const chiffAff = evolCa.find((e) => e[0] === i);
              if (String(chiffAff) !== 'undefined') {
                evolCaTemp.push(chiffAff);
              } else {
                evolCaTemp.push([i, 0]);
              }
            }
            evolCa = evolCaTemp;
            await this.rapportCommercialService
              .evolutionCa1(this.selectedRepresant.code)
              .toPromise()
              .then((data) => {
                evolCa1 = data;
              });
            const evolCa1Temp = [];
            for (let i = 1; i <= 12; i++) {
              const chiffAff1 = evolCa1.find((e) => e[0] === i);
              if (String(chiffAff1) !== 'undefined') {
                evolCa1Temp.push(chiffAff1);
              } else {
                evolCa1Temp.push([i, 0]);
              }
            }
            evolCa1 = evolCa1Temp;
            this.rapCom.ca = Number(
              String(evolCa[this.selectedMonth.value - 1][1])
            )
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');

            this.rapCom.ca1 = Number(
              String(evolCa1[this.selectedMonth.value - 1][1])
            )
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');

            this.variationCa = (
              (Number(this.rapCom.ca.replace(' ', '')) /
                Number(this.rapCom.ca1.replace(' ', ''))) *
              100
            ).toFixed(2);

            let sommeYtd = 0;
            let sommeYtd1 = 0;
            for (let i = 0; i < this.selectedMonth.value; i++) {
              sommeYtd = sommeYtd + Number(evolCa[i][1]);
              sommeYtd1 = sommeYtd1 + Number(evolCa1[i][1]);
            }

            this.rapCom.caYtd = sommeYtd
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.caYtd1 = sommeYtd1
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.variationCaYtd = ((sommeYtd / sommeYtd1) * 100).toFixed(2);
            this.objectifPourc = (
              (sommeYtd * 100) /
              ((Number(this.selectedRepresant.objectif) / 12) *
                this.selectedMonth.value)
            ).toFixed(2);

            // panel suivi paiments
            this.dateFin =
              this.monthNames[this.selectedMonth.value - 1].dayNumber + '/';
            if (
              this.selectedMonth.value === 2 &&
              this.date.getFullYear() % 4 === 0
            ) {
              this.dateFin = '29/';
            }
            this.dateFin =
              this.dateFin +
              this.monthNames[this.selectedMonth.value - 1].num +
              '/' +
              this.date.getFullYear();
            if (this.date.getMonth() === this.selectedMonth.value) {
              this.dateFin = this.date.toLocaleDateString('en-GB');
            }
            let creances = [];
            await this.rapportCommercialService
              .getCreances(this.selectedRepresant.code, this.dateFin)
              .toPromise()
              .then((data) => {
                creances = data['_embedded'].rapportCommercialCreanceses;
              });
            let totSolde = 0,
              totR30 = 0,
              totR60 = 0,
              totR90 = 0,
              totR91 = 0,
              totImp = 0;
            for (const creance of creances) {
              totSolde = totSolde + Number(creance.solde);
              totR30 = totR30 + Number(creance.r30);
              totR60 = totR60 + Number(creance.r60);
              totR90 = totR90 + Number(creance.r90);
              totR91 = totR91 + Number(creance.r91);
              totImp = totImp + Number(creance.imp);
            }
            this.rapCom.creanceTotal = totSolde
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.retard130 = totR30
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.retard3160 = totR60
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.retard6190 = totR90
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.retard91 = totR91
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.impayes = totImp
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.rapCom.retardTotal = (
              totR30 +
              totR60 +
              totR90 +
              totR91 +
              totImp
            )
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.retardsPourc = (
              ((totR30 + totR60 + totR90 + totR91 + totImp) / totSolde) *
              100
            ).toFixed(2);

            // noyaux
            await this.rapportCommercialService
              .getNoyaux(this.selectedRepresant.code, this.selectedMonth.value)
              .toPromise()
              .then((data) => {
                this.noyaux = data['_embedded'].rapportCommercialNoyauxes;
              });

            let totCaNoy = 0,
              totCa1Noy = 0;
            for (const noyau of this.noyaux) {
              totCaNoy = totCaNoy + noyau.ca;
              totCa1Noy = totCa1Noy + noyau.ca1;
            }
            this.totalCaNoyaux = totCaNoy
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.totalCa1Noyaux = totCa1Noy
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            if (totCa1Noy === 0) {
              this.noyauxPourc = '0';
            } else {
              this.noyauxPourc = ((totCaNoy / totCa1Noy) * 100).toFixed(2);
            }
            // zones
            await this.rapportCommercialService
              .getZones(this.selectedRepresant.code, this.selectedMonth.value)
              .toPromise()
              .then((data1) => {
                this.zones = data1['_embedded'].rapportCommercialZones;
              });
            let totCaZn = 0,
              totCa1Zn = 0;
            for (const zone of this.zones) {
              totCaZn = totCaZn + zone.ca;
              totCa1Zn = totCa1Zn + zone.ca1;
            }
            this.totalCaZone = totCaZn
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            this.totalCa1Zone = totCa1Zn
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& ');
            if (totCa1Zn === 0) {
              this.zonePourc = '0';
            } else {
              this.zonePourc = ((totCaZn / totCa1Zn) * 100).toFixed(2);
            }
            // aff gagnees
            this.rapCom.affairesGagnees = this.verif[0].affairesGagnees;
            // aff perdues
            this.rapCom.affairesPerdues = this.verif[0].affairesPerdues;
            // aff en cours
            this.rapCom.affairesEncours = this.verif[0].affairesEncours;
            // actions en cours
            this.rapCom.actionsEncours = this.verif[0].actionsEncours;
            // infos conc
            this.rapCom.infosConcurrence = this.verif[0].infosConcurrence;
            // idees et besoins
            this.rapCom.ideesBesoins = this.verif[0].ideesBesoins;
            this.editEnable = true;
            this.enregistrerVisible = true;
            this.validerVisible = true;
          }
        }
        this.afficherClicked = true;
      }
    }
    if (this.nomModule === 'Consult Rap Commerciaux') {
      this.editEnable = false;
      this.enregistrerVisible = false;
      this.validerVisible = false;
    }
  }
  async enregistrer() {
    if (this.verif.length === 0) {
      this.rapCom.mois = this.selectedMonth.value.toFixed(0);
      this.rapCom.codeRep = this.selectedRepresant.code;
      this.rapCom.dateEnreg = this.date.toLocaleDateString('en-GB');
      this.rapCom.valide = 'N';
      this.rapCom.ca = this.rapCom.ca.replace(' ', '');
      this.rapCom.ca1 = this.rapCom.ca1.replace(' ', '');
      this.rapCom.caYtd = this.rapCom.caYtd.replace(' ', '');
      this.rapCom.caYtd1 = this.rapCom.caYtd1.replace(' ', '');
      this.rapCom.creanceTotal = this.rapCom.creanceTotal.replace(' ', '');
      this.rapCom.impayes = this.rapCom.impayes.replace(' ', '');
      this.rapCom.retard130 = this.rapCom.retard130.replace(' ', '');
      this.rapCom.retard3160 = this.rapCom.retard3160.replace(' ', '');
      this.rapCom.retard6190 = this.rapCom.retard6190.replace(' ', '');
      this.rapCom.retard91 = this.rapCom.retard91.replace(' ', '');
      this.rapCom.retardTotal = this.rapCom.retardTotal.replace(' ', '');
      await this.rapportCommercialService
        .getMaxNumRapport()
        .toPromise()
        .then((data) => {
          this.rapCom.numRapport = (Number(data) + 1).toFixed(0);
        });
      await this.rapportCommercialService
        .createRapportCommercial(this.rapCom)
        .toPromise()
        .then((data) => {
          console.log('rap com insert success');
          this.rapCom.id = data.id;
        });
      for (const zon of this.zones) {
        const rapcomCaCltZone: RapcomCaCltZone = {
          id: null,
          zone: zon.zone,
          ca1: zon.ca1,
          ca: zon.ca,
          numRapport: this.rapCom.numRapport,
        };
        await this.rapcomCaCltZoneService
          .createRapcomCaCltZone(rapcomCaCltZone)
          .toPromise()
          .then((data) => {
            console.log('rap zone insert success');
          });
      }
      for (const noyau of this.noyaux) {
        const rapcomCaNoyaux: RapcomCaNoyaux = {
          id: null,
          codeClt: noyau.zone,
          denoClt: noyau.zone,
          ca1: noyau.ca1,
          ca: noyau.ca,
          numRapport: this.rapCom.numRapport,
        };
        await this.rapcomCaNoyauxService
          .createRapcomCaNoyaux(rapcomCaNoyaux)
          .toPromise()
          .then((data) => {
            console.log('rap noyaux insert success');
          });
      }
      this.validerVisible = true;
    } else {
      this.rapCom.mois = this.selectedMonth.value.toFixed(0);
      this.rapCom.codeRep = this.selectedRepresant.code;
      this.rapCom.dateEnreg = this.date.toLocaleDateString('en-GB');
      this.rapCom.valide = 'N';
      this.rapCom.ca = this.rapCom.ca.replace(' ', '');
      this.rapCom.ca1 = this.rapCom.ca1.replace(' ', '');
      this.rapCom.caYtd = this.rapCom.caYtd.replace(' ', '');
      this.rapCom.caYtd1 = this.rapCom.caYtd1.replace(' ', '');
      this.rapCom.creanceTotal = this.rapCom.creanceTotal.replace(' ', '');
      this.rapCom.impayes = this.rapCom.impayes.replace(' ', '');
      this.rapCom.retard130 = this.rapCom.retard130.replace(' ', '');
      this.rapCom.retard3160 = this.rapCom.retard3160.replace(' ', '');
      this.rapCom.retard6190 = this.rapCom.retard6190.replace(' ', '');
      this.rapCom.retard91 = this.rapCom.retard91.replace(' ', '');
      this.rapCom.retardTotal = this.rapCom.retardTotal.replace(' ', '');
      await this.rapportCommercialService
        .updateRapportCommercial(this.rapCom)
        .toPromise()
        .then((data) => {
          console.log('rap com update success');
        })
        .catch((error) => {
          console.log(error);
        });
      await this.rapcomCaCltZoneService
        .deleteByNumRapport(this.rapCom.numRapport)
        .toPromise()
        .then((data) => {
          console.log('rapcom zone delete success');
        });
      await this.rapcomCaNoyauxService
        .deleteByNumRapport(this.rapCom.numRapport)
        .toPromise()
        .then((data) => {
          console.log('rapcom noyaux delete success');
        });
      for (const zon of this.zones) {
        const rapcomCaCltZone: RapcomCaCltZone = {
          id: null,
          zone: zon.zone,
          ca1: zon.ca1,
          ca: zon.ca,
          numRapport: this.rapCom.numRapport,
        };
        await this.rapcomCaCltZoneService
          .createRapcomCaCltZone(rapcomCaCltZone)
          .toPromise()
          .then((data) => {
            console.log('rap zone insert success');
          });
      }
      for (const noyau of this.noyaux) {
        const rapcomCaNoyaux: RapcomCaNoyaux = {
          id: null,
          codeClt: noyau.zone,
          denoClt: noyau.zone,
          ca1: noyau.ca1,
          ca: noyau.ca,
          numRapport: this.rapCom.numRapport,
        };
        await this.rapcomCaNoyauxService
          .createRapcomCaNoyaux(rapcomCaNoyaux)
          .toPromise()
          .then((data) => {
            console.log('rap noyaux insert success');
          });
      }
    }
    // this.afficherClicked = false;
  }

  async valider() {
    this.rapCom.mois = this.selectedMonth.value.toFixed(0);
    this.rapCom.codeRep = this.selectedRepresant.code;
    this.rapCom.dateEnreg = this.date.toLocaleDateString('en-GB');
    this.rapCom.valide = 'O';
    this.rapCom.ca = this.rapCom.ca.replace(' ', '');
    this.rapCom.ca1 = this.rapCom.ca1.replace(' ', '');
    this.rapCom.caYtd = this.rapCom.caYtd.replace(' ', '');
    this.rapCom.caYtd1 = this.rapCom.caYtd1.replace(' ', '');
    this.rapCom.creanceTotal = this.rapCom.creanceTotal.replace(' ', '');
    this.rapCom.impayes = this.rapCom.impayes.replace(' ', '');
    this.rapCom.retard130 = this.rapCom.retard130.replace(' ', '');
    this.rapCom.retard3160 = this.rapCom.retard3160.replace(' ', '');
    this.rapCom.retard6190 = this.rapCom.retard6190.replace(' ', '');
    this.rapCom.retard91 = this.rapCom.retard91.replace(' ', '');
    this.rapCom.retardTotal = this.rapCom.retardTotal.replace(' ', '');
    console.log(this.rapCom);
    await this.rapportCommercialService
      .updateRapportCommercial(this.rapCom)
      .toPromise()
      .then((data) => {
        console.log('rap com update success');
      })
      .catch((error) => {
        console.log(error);
      });
    this.enregistrerVisible = false;
    this.validerVisible = false;
    this.editEnable = false;
  }

  async apercue() {
    const x = 14;
    let y = 10;
    let ste: Ste;
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        ste = data['_embedded'].ste[0];
      });
    const doc1 = new jspdf();
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text(ste.societe, x, y);
    doc1.text(ste.adresse, x, y + 5);
    doc1.text(ste.codep + '     ' + ste.ville, x, y + 10);
    doc1.text('Tel: ' + ste.tel + '   ' + 'Fax: ' + ste.fax, x, y + 15);
    doc1.text('E-mail: ' + ste.email, x, y * 3);

    doc1.text('Edité le ' + this.date.toLocaleString(), x + 136, y + 5);

    y = y + 30;
    doc1.setFontSize(18);
    doc1.setFontStyle('bold');
    doc1.text('Rapport Commercial', x + 66, y);

    y = y + 20;
    doc1.setFontSize(12);
    doc1.text('Commercial : ' + this.selectedRepresant.deno, x + 16, y);
    doc1.text('Mois : ' + this.selectedMonth.label, x + 126, y);

    y = y + 15;
    doc1.setFontSize(14);
    doc1.text('Ventes et Evolutions / Objectifs :', x, y);

    y = y + 10;
    doc1.setFontSize(10);
    doc1.text('CA ' + this.annee_1 + ' : ', x, y);
    doc1.text('CA ' + this.annee + ' : ', x, y + 6);
    doc1.text('Variation :', x, y + 12);

    doc1.text('CA YTD ' + this.annee_1 + ' : ', x + 86, y);
    doc1.text('CA YTD ' + this.annee + ' : ', x + 86, y + 6);
    doc1.text('Variation :', x + 86, y + 12);

    doc1.text('Commentaires :', x, y + 28);

    doc1.setFontStyle('normal');
    doc1.text(
      'On n\'est à ' +
        this.objectifPourc +
        ' % par rapport à notre objectif final',
      x + 20,
      y + 20
    );

    doc1.text(this.rapCom.ca1 + ' DT', x + 30, y);
    doc1.text(this.rapCom.ca + ' DT', x + 30, y + 6);
    doc1.text(this.variationCa + ' %', x + 30, y + 12);

    doc1.text(this.rapCom.caYtd1 + ' DT', x + 116, y);
    doc1.text(this.rapCom.caYtd + ' DT', x + 116, y + 6);
    doc1.text(this.variationCaYtd + ' %', x + 116, y + 12);

    y = y + 28;
    if (this.rapCom.commentairesVentes !== null) {
      const splitCommentairesVentes = doc1.splitTextToSize(
        this.rapCom.commentairesVentes,
        150
      );
      for (let i = 0; i < splitCommentairesVentes.length; i++) {
        if (y + 6 > 280) {
          doc1.addPage();
          y = 20;
        }
        doc1.text(x + 30, y, splitCommentairesVentes[i]);
        y = y + 6;
      }
      y = y + 4;
    } else {
      y = y + 20;
    }

    doc1.setFontSize(14);
    doc1.setFontStyle('bold');
    doc1.text('Suivi des paiments :', x, y);

    doc1.setFontSize(10);
    doc1.text('Créance totales au ' + this.dateFin + ' :', x, y + 10);
    doc1.text('Retard 1-30  :', x, y + 16);
    doc1.text('Retard 31-60 :', x, y + 22);
    doc1.text('Retard 61-90 :', x, y + 28);
    doc1.text('Retard > 90  :', x, y + 34);

    doc1.text('Impayés :', x + 86, y + 16);
    doc1.text('Retard :', x + 86, y + 22);
    doc1.text('Taux de retard :', x + 86, y + 28);

    doc1.text('Commentaires :', x, y + 42);

    doc1.setFontStyle('normal');
    doc1.text(this.rapCom.creanceTotal + ' DT', x + 50, y + 10);
    doc1.text(this.rapCom.retard130 + ' DT', x + 30, y + 16);
    doc1.text(this.rapCom.retard3160 + ' DT', x + 30, y + 22);
    doc1.text(this.rapCom.retard6190 + ' DT', x + 30, y + 28);
    doc1.text(this.rapCom.retard91 + ' DT', x + 30, y + 34);

    doc1.text(this.rapCom.impayes + ' DT', x + 116, y + 16);
    doc1.text(this.rapCom.retardTotal + ' DT', x + 116, y + 22);
    doc1.text(this.retardsPourc + ' %', x + 116, y + 28);

    // doc1.text(doc1.splitTextToSize(this.rapCom.commentairePaiments, 150), x + 30, y + 42);
    y = y + 42;
    if (this.rapCom.commentairePaiments !== null) {
      const splitCommentairePaiments = doc1.splitTextToSize(
        this.rapCom.commentairePaiments,
        150
      );
      for (let i = 0; i < splitCommentairePaiments.length; i++) {
        if (y + 6 > 280) {
          doc1.addPage();
          y = 20;
        }
        doc1.text(x + 30, y, splitCommentairePaiments[i]);
        y = y + 6;
      }
      y = y + 4;
    } else {
      y = y + 20;
    }
    doc1.setFontSize(14);
    // y = y + 60; // 190
    doc1.setFontStyle('bold');
    doc1.text('Evaluation et suivi CA Clients / Zone :', x, y);

    const cols = [
      {
        zone: 'ZONE',
        ca1: 'CA ' + this.annee_1,
        ca: 'CA ' + this.annee,
        variation: 'VARIATION',
      },
    ];
    const tabZone = [];
    for (const zon of this.zones) {
      tabZone.push({
        zone: zon.zone,
        ca1: zon.ca1,
        ca: zon.ca,
        variation: zon.variation,
      });
    }
    if (y + 10 > 270) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    doc1.autoTable({
      head: cols,
      body: tabZone,
      startY: y,
      theme: 'grid',
      columnStyles: {
        zone: { cellWidth: 50 },
        ca1: { cellWidth: 50, halign: 'right' },
        ca: { cellWidth: 50, halign: 'right' },
        variation: { cellWidth: 40, halign: 'right' },
      },
    });
    y = doc1.autoTable.previous.finalY;

    if (y + 8 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 8;
    }
    doc1.setFontSize(10);
    doc1.text('Totaux :', x, y);
    doc1.text(this.totalCa1Zone + ' DT', x + 100, y, 'right');
    doc1.text(this.totalCaZone + ' DT', x + 145, y, 'right');
    doc1.text(this.zonePourc + ' %', x + 180, y, 'right');

    if (y + 8 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 8;
    }
    doc1.text('Commentaires :', x, y);
    doc1.setFontStyle('normal');

    // doc1.text(doc1.splitTextToSize(this.rapCom.commentaireZone, 150), x + 30, y);
    if (this.rapCom.commentaireZone !== null) {
      const splitCommentaireZone = doc1.splitTextToSize(
        this.rapCom.commentaireZone,
        150
      );
      for (let i = 0; i < splitCommentaireZone.length; i++) {
        if (y > 280) {
          doc1.addPage();
          y = 20;
        }
        doc1.text(x + 30, y, splitCommentaireZone[i]);
        y = y + 6;
      }

      if (y + 4 > 280) {
        doc1.addPage();
        y = 20;
      } else {
        y = y + 4;
      }
    } else {
      y = y + 20;
    }
    doc1.setFontSize(14);
    doc1.setFontStyle('bold');
    doc1.text('Evaluation et suivi CA Clients Prospects :', x, y);
    if (y + 10 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    doc1.setFontSize(10);
    doc1.setFontStyle('normal');
    // doc1.text(doc1.splitTextToSize(this.rapCom.suiviCaClientsProspects, 180), x, y);
    if (this.rapCom.suiviCaClientsProspects !== null) {
      const splitSuiviCaClientsProspects = doc1.splitTextToSize(
        this.rapCom.suiviCaClientsProspects,
        180
      );
      for (let i = 0; i < splitSuiviCaClientsProspects.length; i++) {
        if (y + 6 > 280) {
          doc1.addPage();
          y = 20;
        }
        doc1.text(x, y, splitSuiviCaClientsProspects[i]);
        y = y + 6;
      }

      if (y + 4 > 280) {
        doc1.addPage();
        y = 20;
      } else {
        y = y + 4;
      }
    } else {
      y = y + 20;
    }
    doc1.setFontSize(14);
    doc1.setFontStyle('bold');
    doc1.text('Evaluation et suivi CA Clients Noyaux :', x, y);
    if (y + 10 > 270) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    const colsNoy = [
      {
        codeClient: 'Code Client',
        client: 'Client',
        ca1: 'CA ' + this.annee_1,
        ca: 'CA ' + this.annee,
        variation: 'VARIATION',
      },
    ];
    const tabNoy = [];
    for (const noy of this.noyaux) {
      tabNoy.push({
        codeClient: noy.codeClient,
        client: noy.client,
        ca1: noy.ca1,
        ca: noy.ca,
        variation: noy.variation,
      });
    }
    doc1.autoTable({
      head: colsNoy,
      body: tabNoy,
      startY: y,
      theme: 'grid',
      columnStyles: {
        codeClt: { cellWidth: 25 },
        denoClt: { cellWidth: 40 },
        ca1: { cellWidth: 25, halign: 'right' },
        ca: { cellWidth: 25, halign: 'right' },
        variation: { cellWidth: 25, halign: 'right' },
      },
    });
    y = doc1.autoTable.previous.finalY;
    if (y + 8 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 8;
    }
    doc1.setFontSize(10);
    doc1.text('Totaux :', x, y);
    doc1.setFontSize(9);
    doc1.text(this.totalCa1Noyaux + ' DT', x + 130, y, 'right');
    doc1.text(this.totalCaNoyaux + ' DT', x + 160, y, 'right');
    doc1.text(this.noyauxPourc + ' %', x + 180, y, 'right');
    doc1.setFontSize(10);

    if (y + 8 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 8;
    }
    doc1.text('Commentaires :', x, y);
    doc1.setFontStyle('normal');
    // doc1.text(doc1.splitTextToSize(this.rapCom.commentairesClientsNoyaux, 150), x + 30, y);
    if (this.rapCom.commentairesClientsNoyaux !== null) {
      const splitCommentairesClientsNoyaux = doc1.splitTextToSize(
        this.rapCom.commentairesClientsNoyaux,
        150
      );
      for (let i = 0; i < splitCommentairesClientsNoyaux.length; i++) {
        if (y + 6 > 280) {
          doc1.addPage();
          y = 20;
        }
        doc1.text(x + 30, y, splitCommentairesClientsNoyaux[i]);
        y = y + 6;
      }
      if (y + 4 > 280) {
        doc1.addPage();
        y = 20;
      } else {
        y = y + 4;
      }
    } else {
      y = y + 20;
    }
    doc1.setFontSize(14);
    doc1.setFontStyle('bold');
    doc1.text('Affaires significatives / symboliques-gagnées :', x, y);
    if (y + 10 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    doc1.setFontSize(10);
    doc1.setFontStyle('normal');
    let splits = [];
    if (this.rapCom.affairesGagnees !== null) {
      splits = this.rapCom.affairesGagnees.split('\r');
      let splitAffairesGagnees = [];
      for (let i = 0; i < splits.length; i++) {
        if (y + 6 > 280) {
          doc1.addPage();
          y = 20;
        }
        splitAffairesGagnees = doc1.splitTextToSize(splits[i], 180);
        // console.log(doc1.splitTextToSize(splits[i], 180));
        for (let j = 0; j < splitAffairesGagnees.length; j++) {
          doc1.text(x, y, splitAffairesGagnees[j]);
          y = y + 6;
        }
      }
      if (y + 4 > 280) {
        doc1.addPage();
        y = 20;
      } else {
        y = y + 4;
      }
    } else {
      y = y + 20;
    }
    doc1.setFontSize(14);
    doc1.setFontStyle('bold');
    doc1.text('Affaires significatives / symboliques-perdues :', x, y);
    if (y + 10 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    doc1.setFontSize(10);
    doc1.setFontStyle('normal');
    // doc1.text(doc1.splitTextToSize(this.rapCom.affairesPerdues, 180), x, y);
    if (this.rapCom.affairesPerdues !== null) {
      splits = this.rapCom.affairesPerdues.split('\r');
      let splitAffairesPerdues = [];
      for (let i = 0; i < splits.length; i++) {
        if (y + 6 > 280) {
          doc1.addPage();
          y = 20;
        }
        splitAffairesPerdues = doc1.splitTextToSize(splits[i], 180);
        // console.log(doc1.splitTextToSize(splits[i], 180));
        for (let j = 0; j < splitAffairesPerdues.length; j++) {
          doc1.text(x, y, splitAffairesPerdues[j]);
          y = y + 6;
        }
      }
      if (y + 4 > 280) {
        doc1.addPage();
        y = 20;
      } else {
        y = y + 4;
      }
    } else {
      y = y + 20;
    }
    doc1.setFontSize(14);
    doc1.setFontStyle('bold');
    doc1.text('Affaires significatives en cours de négociation :', x, y);
    if (y + 10 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    doc1.setFontSize(10);
    doc1.setFontStyle('normal');
    // doc1.text(doc1.splitTextToSize(this.rapCom.affairesEncours, 180), x, y);
    if (this.rapCom.affairesEncours !== null) {
      splits = this.rapCom.affairesEncours.split('\r');
      let splitAffairesEncours = [];
      for (let i = 0; i < splits.length; i++) {
        if (y + 6 > 280) {
          doc1.addPage();
          y = 20;
        }
        splitAffairesEncours = doc1.splitTextToSize(splits[i], 180);
        // console.log(doc1.splitTextToSize(splits[i], 180));
        for (let j = 0; j < splitAffairesEncours.length; j++) {
          doc1.text(x, y, splitAffairesEncours[j]);
          y = y + 6;
        }
      }

      if (y + 4 > 280) {
        doc1.addPage();
        y = 20;
      } else {
        y = y + 4;
      }
    } else {
      y = y + 20;
    }
    doc1.setFontSize(14);
    doc1.setFontStyle('bold');
    doc1.text('Actions en cours ou à planifier :', x, y);
    if (y + 10 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    doc1.setFontSize(10);
    doc1.setFontStyle('normal');
    // doc1.text(doc1.splitTextToSize(this.rapCom.actionsEncours, 180), x, y);
    if (this.rapCom.actionsEncours !== null) {
      const splitActionsEncours = doc1.splitTextToSize(
        this.rapCom.actionsEncours,
        180
      );
      for (let i = 0; i < splitActionsEncours.length; i++) {
        if (y + 6 > 280) {
          doc1.addPage();
          y = 20;
        }
        doc1.text(x, y, splitActionsEncours[i]);
        y = y + 6;
      }
      if (y + 4 > 280) {
        doc1.addPage();
        y = 20;
      } else {
        y = y + 4;
      }
    } else {
      y = y + 20;
    }
    doc1.setFontSize(14);
    doc1.setFontStyle('bold');
    doc1.text('Info Concurrence :', x, y);
    if (y + 10 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    doc1.setFontSize(10);
    doc1.setFontStyle('normal');
    // doc1.text(doc1.splitTextToSize(this.rapCom.infosConcurrence, 180), x, y);
    if (this.rapCom.infosConcurrence !== null) {
      const splitInfosConcurrence = doc1.splitTextToSize(
        this.rapCom.infosConcurrence,
        180
      );
      for (let i = 0; i < splitInfosConcurrence.length; i++) {
        if (y + 6 > 280) {
          doc1.addPage();
          y = 20;
        }
        doc1.text(x, y, splitInfosConcurrence[i]);
        y = y + 6;
      }
      if (y + 4 > 280) {
        doc1.addPage();
        y = 20;
      } else {
        y = y + 4;
      }
    } else {
      y = y + 20;
    }
    if (y + 10 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    doc1.setFontSize(14);
    doc1.setFontStyle('bold');
    doc1.text('Idées - Besoins - Infos diverses :', x, y);
    if (y + 10 > 280) {
      doc1.addPage();
      y = 20;
    } else {
      y = y + 10;
    }
    doc1.setFontSize(10);
    doc1.setFontStyle('normal');
    // doc1.text(x, y, doc1.splitTextToSize(this.rapCom.ideesBesoins, 180));
    if (this.rapCom.ideesBesoins !== null) {
      const splitIdeesBesoins = doc1.splitTextToSize(
        this.rapCom.ideesBesoins,
        180
      );
      for (let i = 0; i < splitIdeesBesoins.length; i++) {
        if (y > 280) {
          doc1.addPage();
          y = 20;
        }
        doc1.text(x, y, splitIdeesBesoins[i]);
        y = y + 6;
      }
    } else {
      y = y + 20;
    }
    window.open(doc1.output('bloburl'), '_blank');
  }
}
