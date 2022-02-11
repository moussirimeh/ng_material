import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EDemandeDevisService } from '../services/eDemandeDevis.service';
import { EDemandeDevis } from '../services/eDemandeDevis';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import {ExcelService} from '../services/excel.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { DDemandeDevisService } from '../services/dDemandeDevis.service';
import { DDemandeDevis } from '../services/dDemandeDevis';
import { SteService } from '../services/ste.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Ste } from '../services/ste';
import { ClientService } from '../services/client.service';


@Component({
  selector: 'app-consultation-demande-devis',
  templateUrl: './consultation-demande-devis.component.html',
  styleUrls: ['./consultation-demande-devis.component.scss'],
  providers: [MessageService, ConfirmationService, ExcelService ]
})
export class ConsultationDemandeDevisComponent implements OnInit {

  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('ejDialogg') ejDialogg: DialogComponent;
  @ViewChild('ejInnerDialog') ejInnerDialog: DialogComponent;



  @ViewChild('grid')
  public grid: GridComponent;

  @ViewChild('grid2')
  public grid2: GridComponent;
  codeClient;
  numeroDevis = '' ;
  numero = '';
  from: Date;
  to: Date;
  dateDebut: string;
  dateFin: string;
  demande: EDemandeDevis[];
  details: DDemandeDevis[];
  maxDate: Date;
  etat: { label: string; value: string; }[];
  article = '';
  note: any;
  noteDetail: any;
  code: string;
  public showCloseIcon = true;
  public animationSettings: Object = { effect: 'Zoom', duration: 400, delay: 0 };
  demandeEXECL = [];
  buttonShow: boolean;
  afficherShow = true;
  disabled = false;
  deno: any;


  constructor(
    private messageService: MessageService,
    private excelService: ExcelService,
    private steService: SteService,
    private clientService: ClientService,
    private eDemandeDevisService: EDemandeDevisService,
    private dDemandeDevisService: DDemandeDevisService
  ) {
    this.etat = [
      { label: '', value: '' },
      { label: 'En Cours', value: 'null' },
      { label: 'Traiter', value: 'Traiter' }

    ];

  }

  ngOnInit(


  ) {


    this.from = new Date();
    this.from.setDate(this.from.getDate() - 730);
    this.to = new Date();
    this.maxDate = new Date();
    this.codeClient = '4111068';

  }




  onOpenDialog(args, event: any) {

    this.note = args;
    // Call the show method to open the Dialog
    this.ejDialogg.show();

  }

  async  onOpenDialogg(args) {

    this.code = args;
    await this.dDemandeDevisService.detailDemandeDevis(this.code).toPromise().then(data => {
        this.details = data['_embedded'].dDemandeDevis; });


    this.ejDialog.show();

  }

public onOpenInnerDialog(args, event: any): void {
  this.noteDetail = args;
    this.ejInnerDialog.show();
}
  async afficher() {

    this.dateDebut = new Date(this.from).toLocaleDateString('en-GB');
    this.dateFin = new Date(this.to).toLocaleDateString('en-GB');
    if (this.numeroDevis === 'Traiter') {
      await this.eDemandeDevisService.demandeDevisTraiter(this.codeClient,
        this.numero, this.article, this.dateDebut, this.dateFin).toPromise().then(data => {
          console.log(data);

          this.demande = data['_embedded'].eDemandeDevis;


        });
    } else {

      await this.eDemandeDevisService.etatdemandeDevis(this.codeClient,
        this.numero, this.article, this.numeroDevis, this.dateDebut, this.dateFin).toPromise().then(data => {
          console.log(data);
          this.demande = data['_embedded'].eDemandeDevis;

        });
    }

    for (const c of this.demande) {
      this.demandeEXECL.push({
        Code: c.numero,
        Date: c.date,
        Numerodevis: c.numeroDevis,
        Note:  c.note,

      });
    }
    if (this.demande.length !== 0) {
      this.afficherShow = false;
      this.buttonShow = true;
    } else {
      this.messageService.add({ severity: 'warn', summary: 'ERREUR', detail: 'DEMANDE de Devis inéxistant!' });

  }
    this.disabled = true;
    await this.clientService
    .getDeno(this.codeClient)
    .toPromise()
    .then(data => {
      this.deno = data;
    });
  }
  public etatValue = (field: string, data: { numeroDevis: string }, column: Object) => {

    if ((data.numeroDevis) !== null) {
      return field = 'Traité';
    } else {
      return field = 'En cours';
    }
  }
  initialiser() {
    this.numero = '';
    this.article = '';
    this.from = new Date();
    this.from.setDate(this.from.getDate() - 730);
    this.to = new Date();
    this.numeroDevis = '';
    this.afficherShow = true;
    this.buttonShow = false;
    this.disabled = false;
    this.demande = [];
  }
  excel(): void {

    this.excelService.exportAsExcelFile(this.demandeEXECL, 'Demande de devis du client N°' + this.codeClient);

  }
  excelDetail(): void {
    const detailEXECL = [];
    for (const c of this.details) {
      detailEXECL.push({
        CodeArticle: c.codeArticle,
        Designation: c.designation,
        Quantite: c.quantite,
        Prix: c.prixArticle,
        Marque: c.marque,
        Note:  c.note,

      });
    }
    this.excelService.exportAsExcelFile(detailEXECL, 'Details de demande de devis N°' + this.code + ' du client' + this.deno);

  }
 async apercue() {
  const x = 14;
  let y = 10;
  let ste: Ste;
  await this.steService
    .getSte()
    .toPromise()
    .then(data => {
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

  doc1.text('Edité le ' + (new Date).toLocaleString(), x + 136, y + 5);

  y = y + 35;
    doc1.setFontSize(18);
    doc1.setFontStyle('bold');
    doc1.text('Les Demande de Devis ' , x + 50, y);
    y = y + 8;
    doc1.setFontSize(12);
    doc1.setFontStyle('arial');
    doc1.text('Du  ' + this.dateDebut + '  ' + ' au    ' + this.dateFin, x + 50, y);
    doc1.text('Client : ' + this.deno, x + 126, y);
    y = y + 20;
    const cols = [
      {
        code: 'Code',
        date: 'Date',
        etat: 'Etat',
        numeroDevis: 'N°devis',
        note: 'Note',

      }
    ];
    const demandeDevis = [];
    for (const d of this.demande) {
      demandeDevis.push({
        code: d.numero,
        date: d.date,
        etat: '',
        numeroDevis: d.numeroDevis,
        note: d.note,

      });
    }
    doc1.autoTable({
      head: cols,
      body: demandeDevis,
      startY: y,
      theme: 'grid',
      styles: { fontSize: 10, textColor: 20 },
      columnStyles: {

        code: { cellWidth: 20 },
        date: { cellWidth: 20},
        etat: { cellWidth: 20 },
        numeroDevis: { cellWidth: 20 },
        note: { cellWidth: 40 }

      }
    });
    y = doc1.autoTable.previous.finalY;


  window.open(doc1.output('bloburl'), '_blank');
 }
 async apercueDetail() {
  const x = 14;
  let y = 10;
  let ste: Ste;
  await this.steService
    .getSte()
    .toPromise()
    .then(data => {
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

  doc1.text('Edité le ' + (new Date).toLocaleString(), x + 136, y + 5);

  y = y + 35;
    doc1.setFontSize(18);
    doc1.setFontStyle('bold');
    doc1.text('Demande de Devis N° ' + this.code , x + 50, y);
    y = y + 8;
    doc1.setFontSize(12);
    doc1.setFontStyle('arial');

    doc1.text('Client : ' + this.deno, x + 130, y);
    y = y + 20;
    const cols = [
      {
        code: 'Code Article',
        designation: 'Designation',
        quantite: 'Quantite',
        prixArticle: 'Prix Article',
        marque: 'Marque',
        note: 'Note',

      }
    ];
    const demandeDevis = [];
    for (const d of this.details) {
      demandeDevis.push({
        code: d.codeArticle,
        designation: d.designation,
        quantite: d.quantite,
        prixArticle: d.prixArticle,
        marque: d.marque,
        note: d.note,
      });
    }
    doc1.autoTable({
      head: cols,
      body: demandeDevis,
      startY: y,
      theme: 'grid',
      styles: { fontSize: 9, textColor: 20 },
      columnStyles: {

        code: { cellWidth: 20 },
        designation: { cellWidth: 20},
        quantite: { cellWidth: 20 },
        prixArticle: { cellWidth: 20 },
        marque: { cellWidth: 20 },
        note: { cellWidth: 40 }

      }
    });
    y = doc1.autoTable.previous.finalY;


  window.open(doc1.output('bloburl'), '_blank');
 }


}
