import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { Zone } from '../services/zone';
import { ZoneService } from '../services/zone.service';
import { Vendeur1 } from '../services/vendeur1';
import { Vendeur1Service } from '../services/vendeur1.service';
import { ListeBlEncours } from '../services/listeBlEncours';
import { ListeBlEncoursService } from '../services/listeBlEncours.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { DuplicataComponent } from '../duplicata/duplicata.component';

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
  selector: 'app-black-page',
  templateUrl: './liste-bl-encours.component.html',
  styleUrls: ['./liste-bl-encours.component.scss'],
  providers: [MessageService, DatePipe]
})
export class ListeBlEncoursComponent implements OnInit {
  // dateDebut: Date = new Date();
  // dateFin: Date = new Date();
  @ViewChild(DuplicataComponent) Duplicata;
  displayDupicata = false;
  @Input() portail = false;
  dateDebut: Date = null;
  dateFin: Date = null;
  tn: any;
  @ViewChild('grid')
  public grid: GridComponent;
  clients: Client[];
  selectedClient: Client;
  vendeurs;
  selectedVendeur: Vendeur1;
  zones;
  selectedZone: Zone;
  revCons = [{ label: '', value: '' }, { label: 'R', value: 'R' }, { label: 'C', value: 'C' }];
  selectedRevCons = '';
  fieldDisable = false;
  bls = [];
  ste: Ste;
  constructor(
    private messageService: MessageService,
    private clientService: ClientService,
    private zoneService: ZoneService,
    private vendeur1Service: Vendeur1Service,
    private datePipe: DatePipe,
    private listeBlEncoursService: ListeBlEncoursService,
    private steService: SteService
  ) {}

  async ngOnInit() {
    this.tn = {
      firstDayOfWeek: 0,
      dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      dayNamesShort: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      dayNamesMin: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
      monthNames: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy'
    };
    this.selectedVendeur = { id: '', code: '', deno: '' };
    this.selectedZone = { id: '', code: '', deno: '' };
    this.viderSelectedClient();
    await this.vendeur1Service
      .getVendeur1sList()
      .toPromise()
      .then(data => {
        this.vendeurs = data['_embedded'].vendeur1;
        this.vendeurs.unshift({ id: '', code: null, deno: '' });
      });
    await this.zoneService
      .getZonesList()
      .toPromise()
      .then(data => {
        this.zones = data['_embedded'].zones;
        this.zones.unshift({ id: '', code: null, deno: '' });
      });
    await this.zoneService
      .getZonesList()
      .toPromise()
      .then(data => {
        this.zones = data['_embedded'].zones;
        this.zones.unshift({ id: '', code: null, deno: '' });
      });
    await this.clientService
      .getClientsListByOrderByDeno()
      .toPromise()
      .then(data => {
        this.clients = data['_embedded'].clients;
        this.clients.unshift(this.selectedClient);
      });
  }
  viderSelectedClient() {
    this.selectedClient = {
      id: null,
      code: '',
      deno: null,
      adresse: null,
      ville: null,
      post: null,
      respon: null,
      tel: null,
      agence: null,
      banque: null,
      telex: null,
      fax: null,
      cadnat: null,
      compte: null,
      edition: null,
      exonor: null,
      duree: null,
      reg: null,
      terme: null,
      marque: null,
      plafond: null,
      zone: null,
      comm: null,
      assujet: null,
      codeTva: null,
      timbre: null,
      ech: null,
      bloc: null,
      datBlc: null,
      typeC: null,
      regle: null,
      lettre: null,
      codeC: null,
      autor: null,
      eMail: null,
      typeComm: null,
      rec: null,
      vend: null,
      represant: null,
      secteur: null,
      objectif: null,
      nature: null,
      datCreat: null,
      mag: null,
      respons2: null,
      adresseusine: null,
      adressesiege: null,
      gsm1: null,
      gsm2: null,
      nouvMag: null,
      ca123: null,
      respons3: null,
      fonction1: null,
      fonction2: null,
      fonction3: null,
      eMail1: null,
      eMail2: null,
      eMail3: null,
      tel2: null,
      tel3: null,
      gsm3: null,
      codGroupe: null,
      modeReg: null,
      plafondEncours: null,
      indic: null,
      bcExige: null
    };
  }
  async afficher() {
    let dDebut = '',
      dFin = '';
    if (this.dateDebut !== null && this.dateFin !== null) {
      dDebut = this.datePipe.transform(this.dateDebut, 'yyyy-dd-MM');
      dFin = this.datePipe.transform(this.dateDebut, 'yyyy-dd-MM');
    }
    await this.listeBlEncoursService
      .getListeBlsEncours(dDebut, dFin, this.selectedVendeur.code, this.selectedZone.code, this.selectedClient.code, this.selectedRevCons)
      .toPromise()
      .then(data => {
        this.bls = data['_embedded'].listeBlEncours;
      });
    if (this.bls.length < 1) {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Erreur',
        detail: 'Aucun B/L Trouvé !'
      });
    }
  }
  annulerSelection() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  details() {
    const selectedRow: any = this.grid.getSelectedRecords()[0];
    this.Duplicata.combine = String(selectedRow.combine).substr(9, 14);
    // this.Duplicata.portail = true;
    this.Duplicata.afficher();
    this.displayDupicata = true;
  }
  async imprimer(index: number) {
    await this.steService
      .getSte()
      .toPromise()
      .then(data => {
        this.ste = data['_embedded'].ste;
      });
    const displayDate = new Date().toLocaleDateString('en-GB');
    const displayTime = new Date().toLocaleTimeString();

    const cols = [
      {
        operateur: 'Code Client',
        deno: 'Nom Client',
        combine: 'Numéro B/L',
        date: 'Date',
        ref: 'B.Commande',
        net: 'Montant TTC'
      }
    ];
    const blsTmp = [];
    let totalNet = 0;
    for (const bl of this.bls) {
      blsTmp.push({ operateur: bl.operateur, deno: bl.deno, combine: bl.combine, date: bl.date, ref: bl.ref, net: bl.net });
      totalNet = totalNet + Number(bl.net);
    }
    const doc1 = new jspdf('a4');
    doc1.setFontSize(9);
    doc1.setFontStyle('arial');
    doc1.text('SOCIETE : ' + this.ste[0].societe, 14, 10);
    doc1.text('Au : ' + displayDate + ' ' + displayTime, 150, 30);

    doc1.setFontSize(18);
    doc1.setFontStyle('arial');
    doc1.text('Liste des B/L non encore Facturés', 60, 30);

    doc1.autoTable({
      head: cols,
      body: blsTmp,
      startY: 50,
      theme: 'grid',
      columnStyles: {
        operateur: { cellWidth: 20 },
        deno: { cellWidth: 55 },
        combine: { cellWidth: 30 },
        date: { cellWidth: 25 },
        ref: { cellWidth: 30 },
        net: { cellWidth: 25, halign: 'right' }
      }
    });
    doc1.setFontSize(11);
    doc1.text('TOTAL (T.T.C) : ', 135, doc1.autoTable.previous.finalY + 10);
    doc1.text(totalNet.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '), 195, doc1.autoTable.previous.finalY + 10, 'right');
    if (index === 1) {
      doc1.autoPrint();
    }
    window.open(doc1.output('bloburl'), '_blank');
  }
}
