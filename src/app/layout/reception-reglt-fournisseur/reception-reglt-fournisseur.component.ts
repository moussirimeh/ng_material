import {
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";

import { NgSelectConfig } from "@ng-select/ng-select";
import * as jspdf from "jspdf";
import { OverlayPanel } from "primeng/primeng";
import { MessageService } from "primeng/components/common/messageservice";

import { BanqueService } from "../services/banque.service";
import { SteService } from "../services/ste.service";
import { Banque } from "../services/banque";
import { Achat0Service } from "../services/achat0.service";
import { Achat0 } from "../services/achat0";
import { FournisseurService } from "../services/fournisseur.service";

import { ConfirmationService } from "primeng/api";
import { Table } from "primeng/table";
import { LoginService } from "src/app/login/login.service";
import { ViewEncapsulation } from "@angular/core";
import { globals } from "src/environments/environment";

@Component({
  selector: "app-reception-reglt-fournisseur",
  templateUrl: "./reception-reglt-fournisseur.component.html",
  styleUrls: ["./reception-reglt-fournisseur.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService, ConfirmationService],
})
export class ReceptionRegltFournisseurComponent implements OnInit {
  // @Input() table: Table;
  @Input() row: any;
  @ViewChildren("row", { read: ElementRef }) rowElement: QueryList<ElementRef>;

  @ViewChild("dt")
  public table: Table;

  @ViewChild("row")
  public r: any;

  @ViewChild("op")
  public op: OverlayPanel;
  tn;
  datefin1;
  msgerror: string;
  public customAttributes: Object;

  fournisseurs;
  selectedFournisseur;
  codeFour;
  visibleBtnAfficher: boolean;

  liste = new Array();
  datedebut = new Date();
  datefin = new Date();
  blocked: boolean;
  lst = new Array();

  numfact: string;
  date: Date;
  readonl: boolean;

  dateEch: Date;
  banques: Banque[];
  selectedBanque;
  mntDevs;
  devs: string;
  mntdt;
  regle;
  recu = new Array();

  dateReg: Date;
  id: string;
  SelectedFact: any;
  codeBanque: string;
  modif: boolean;
  ajout: boolean;
  supp: boolean;
  ste: any;
  societe: any;
  wasInside: boolean;
  msgs: boolean;

  position: string;
  btnafficher: boolean;
  btnNouvelleSaise: boolean;
  traitement: boolean;
  readonly: boolean;
  readonlyy: boolean;
  readOnNumFact: boolean;
  appercu: boolean;
  rang = 0;
  listeLength = 0;
  clonedfact: { [s: string]: any } = {};
  selectedRow = "";
  clickaddnew: boolean;
  lstavantadd: any;
  longliste: number;
  btnajut: boolean;
  disable: boolean;
  idAjout = 0;
  initReg: String;
  initRecu: string;

  constructor(
    private messageService: MessageService,
    private config: NgSelectConfig,
    private banqueService: BanqueService,
    private steService: SteService,
    private confirmationService: ConfirmationService,
    private fournisseurService: FournisseurService,
    private achat0Service: Achat0Service,
    private loginService: LoginService
  ) {
    this.config.notFoundText = "Aucun élément trouvé";
    this.config.clearAllText = "Supprimer tous ";
  }
  init() {
    this.selectedBanque = null;
    this.codeBanque = "";
    this.selectedFournisseur = null;
    this.codeFour = "";
    this.datefin = new Date();
    this.datedebut = new Date(2017, 0, 1);
  }

  changeRecu() {
    console.log("change recu", this.recu);

    if (this.recu[0] === true) {
      this.initRecu = "O";
      console.log("init recu o", this.initRecu);
      this.readonlyy = false;
    } else {
      this.initRecu = "N";
      console.log("init recu n", this.initRecu);
      // this.recu = [];
    }
  }
  async onRowEditSave(car: Achat0, e) {
    this.wasInside = true;
    this.op.hide();
    this.disable = false;
    console.log("car", car);
    let fact: any;

    fact = {
      id: car.id,
      numero: car.numero,
      date: car.date,
      net: car.net,
      operateur: this.codeFour,
      typef: null,
      sens: null,
      echeance: car.echeance,
      montant: car.montant,
      devise: car.devise,
      banque: this.codeBanque,
      regle: car.regle,
      op1: null,
      recu: car.recu,
      dat_regl: car.dat_regl,
    };

    console.log("reeeeeeecu", this.initRecu);
    if (fact.date !== null && fact.date !== undefined) {
      fact.date = fact.date.toLocaleDateString("en-GB");
    }
    if (fact.echeance !== null && fact.echeance !== undefined) {
      fact.echeance = fact.echeance.toLocaleDateString("en-GB");
    }
    if (fact.dat_regl !== null && fact.dat_regl !== undefined) {
      fact.dat_regl = fact.dat_regl.toLocaleDateString("en-GB");
    }
    if (this.initRecu === null || this.initRecu === undefined) {
      fact.recu = "N";
    } else {
      if (this.initRecu === "N") {
        car.recu = "N";
        fact.recu = "N";
      } else {
        car.recu = "O";
        fact.recu = "O";
      }
    }

    console.log("faaaact avant modif", fact);

    if (fact.recu === "O") {
      this.blocked = true;
      await this.achat0Service.update(fact).subscribe((data) => {
        console.log("modif ", data);
        this.disable = false;
      });
      this.blocked = false;
      this.appercu = true;
      this.btnNouvelleSaise = true;
      const param = "Modif " + fact.numero + " Recu " + fact.recu;
      console.log("lenght ", param.length);

      this.loginService
        .procedureStockeModule(
          localStorage.getItem("login"),
          globals.selectedMenu,
          param
        )
        .subscribe((data) => {
          console.log("procedure stock", data);
        });
    }
  }

  @HostListener("document:click")
  clickout() {
    if (!this.wasInside) {
      if (this.op !== undefined && this.op !== null) {
        this.op.hide();
      }
    }
    this.wasInside = false;
  }

  async onRowEditInit(fact: any) {
    this.disable = true;
    this.btnajut = false;
    this.appercu = false;

    this.btnNouvelleSaise = false;
    if (fact.regle === "O") {
      this.regle = ["O"];
      fact.regle = "O";
    } else {
      this.regle = [];
      fact.regle = "N";
    }
    if (fact.recu === "O") {
      this.recu = ["O"];
      fact.recu = "O";
      this.readonly = true;
      this.readonlyy = true;
    } else {
      this.readonly = true;
      this.readonlyy = false;
      this.recu = [];
      fact.recu = "N";
    }

    this.clonedfact[fact.id] = { ...fact };
    console.log("edit fact", fact);
  }
  async afficher(e) {
    this.wasInside = true;
    this.op.hide();

    if (
      this.selectedFournisseur === null ||
      this.selectedFournisseur === undefined
    ) {
      this.msgerror = "veuillez choisir un fournisseur ";
      this.op.show(e, document.getElementById("frns"));
    } else {
      this.SelectedFact = null;
      this.traitement = false;
      const datef = this.datefin.toLocaleDateString("en-GB");
      const dated = this.datedebut.toLocaleDateString("en-GB");

      this.btnajut = true;
      this.liste = new Array();
      this.lstavantadd = new Array();

      await this.achat0Service
        .getFactureFournisseurPeriod(this.codeFour, datef, dated)
        .toPromise()
        .then((data) => {
          this.liste = data["_embedded"].reglementFours;
          this.lst = data["_embedded"].reglementFours;
          this.longliste = data["_embedded"].reglementFours.length;
          this.lstavantadd = data["_embedded"].reglementFours;

          if (this.longliste === 0 || this.longliste === undefined) {
            this.appercu = false;
            this.btnafficher = false;
            this.btnNouvelleSaise = false;
            this.visibleBtnAfficher = true;
            this.msgerror = "aucune facture trouvée  ";
            this.op.show(e, document.getElementById("affich"));
          } else {
            this.readonly = true;
            this.readonl = true;
            this.appercu = true;

            this.btnafficher = true;
            this.btnNouvelleSaise = true;
            this.visibleBtnAfficher = false;

            for (const ob of this.liste) {
              if (ob.net !== null) {
                ob.net = Number(ob.net).toFixed(3);
              }
              if (ob.montant !== null) {
                ob.montant = Number(ob.montant).toFixed(3);
              }
              if (ob.date !== null) {
                ob.date = this.ConvertStringToDate(ob.date);
              }

              if (ob.echeance !== null) {
                ob.echeance = this.ConvertStringToDate(ob.echeance);
              }
              if (ob.dat_regl !== null) {
                ob.dat_regl = this.ConvertStringToDate(ob.dat_regl);
              }
            }
          }

          // }
        });
    }
  }

  onRowEditCancel(car: any, index: number) {
    this.disable = false;
    this.btnajut = true;
    this.appercu = true;
    this.btnNouvelleSaise = true;
    this.liste[index] = this.clonedfact[car.id];
    delete this.clonedfact[car.id];
    if (index > -1 && car.id === "#" + this.idAjout.toString()) {
      this.liste.splice(index, 1);
      this.rang = this.liste.length;
      for (let i = index; i < this.liste.length; i++) {
        this.liste[i].rang = i + 1;
      }
    }
  }

  async apercu() {
    let listeapercu = new Array();
    this.btnNouvelleSaise = true;
    const datef = this.datefin.toLocaleDateString("en-GB");
    const dated = this.datedebut.toLocaleDateString("en-GB");
    await this.achat0Service
      .getFactureFournisseurPeriod(this.codeFour, datef, dated)
      .toPromise()
      .then(async (data) => {
        listeapercu = data["_embedded"].reglementFours;
        console.log(this.liste);

        // si la liste est vide afficher un message
        if (this.liste.length === 0) {
          this.messageService.add({
            key: "k",
            severity: "error",
            summary: "Erreur",
            detail: "Aucune facture pour cette période !!",
            sticky: true,
          });
        } else {
          // gerer le document pdf pour visualiser les donnees avant l'impresssion
          // creer le document pdf
          const doc1 = new jspdf();

          doc1.setFontSize(14);
          doc1.setFontStyle("Arial");
          // recupérer les données de la sociéte
          await this.steService
            .getSte()
            .toPromise()
            .then((data) => {
              this.ste = data["_embedded"].ste;
              this.societe = this.ste[0];
              // console.log(this.societe);
            });
          doc1.text("Société  : " + this.societe.societe, 9, 20);

          doc1.setFontSize(22);
          doc1.setFontStyle("Arial");
          doc1.setFontStyle("bold");
          doc1.setTextColor(0, 51, 153);
          doc1.text("Règlements des Fournisseurs", 50, 32);

          const datef = this.datefin.toLocaleDateString("en-GB");
          const dated = this.datedebut.toLocaleDateString("en-GB");
          doc1.setFontSize(12);
          doc1.setFontStyle("Arial");
          doc1.setTextColor(48, 48, 48);
          doc1.text("Date de Début :  " + dated, 9, 40);
          doc1.text("Date de Fin :       " + datef, 80, 40);
          doc1.text("Code Fournisseur :  " + this.codeFour, 9, 47);
          doc1.text(
            "Raison Sociale :  " + this.selectedFournisseur.deno,
            80,
            47
          );

          // entete du  tableau
          doc1.setFontSize(12);
          doc1.setFontStyle("bold");
          doc1.setLineWidth(0.25);
          doc1.line(9, 54, 205, 54);
          doc1.setFontSize(13);
          doc1.setFontStyle("bold");
          doc1.text("Date", 10, 61);
          doc1.text("Numéro", 40, 61);
          doc1.text("Mnt en Devise", 70, 61);
          doc1.text("Devise", 105, 61);
          doc1.text("Montant en DT", 135, 61);
          doc1.text("R", 182, 61);
          // creer la ligne
          doc1.setLineWidth(0.25);
          doc1.setFontStyle("bold");
          doc1.line(9, 65, 205, 66);

          let y = 73;
          let numPage = 1;
          doc1.setFontSize(10);
          doc1.setFontStyle("Arial");
          if (listeapercu.length > 0) {
            for (const bs of listeapercu) {
              // console.log('fact ', bs);
              if (bs.net !== null) {
                bs.net = Number(bs.net).toFixed(3);
              }
              if (bs.montant !== null) {
                bs.montant = Number(bs.montant).toFixed(3);
              }
              doc1.setFontSize(9);
              doc1.setFontStyle("Arial");
              doc1.text(bs.date, 10, y);
              doc1.text(bs.numero, 45, y);
              // console.log('montant');

              if (bs.montant === null) {
                bs.montant = "";
              }
              doc1.text(bs.montant, 71, y);

              if (bs.devise === null) {
                bs.devise = "";
              }
              doc1.text(bs.devise, 105, y);

              if (bs.net === null) {
                bs.net = "";
                doc1.text(bs.net, 136, y);
              } else {
                doc1.text(bs.net, 135, y);
              }
              if (bs.regle === null) {
                doc1.text("N", 182, y);
              } else {
                doc1.text(bs.regle, 182, y);
              }

              y = y + 7;
              // passer a une nouvelle page
              if (y > 277) {
                doc1.line(10, y - 3, 200, y - 3, "FD");
                doc1.text("Page " + numPage.toFixed(0), 100, 287 + 2);
                numPage++;
                doc1.addPage();
                // entete tableau
                doc1.setFontStyle("bold");
                doc1.line(9, 10, 205, 10);
                doc1.setFontSize(13);
                doc1.setFontStyle("bold");

                doc1.text("Date", 10, 17);
                doc1.text("Numéro", 40, 17);
                doc1.text("Mnt en Devise", 70, 17);
                doc1.text("Devise", 105, 17);
                doc1.text("Montant en Dt", 135, 17);
                doc1.text("R", 182, 17);
                // creer la ligne
                doc1.setFontStyle("bold");
                doc1.line(9, 24, 205, 24);
                y = 32;
              }
            }
          }
          doc1.line(10, 280, 200, 280, "FD");
          doc1.text("Page " + numPage.toFixed(0), 100, 287 + 2);
          window.open(doc1.output("bloburl"), "_blank");
          // this.ngOnInit();
        }
      });
  }

  ConvertStringToDate(dateString) {
    const formdate: string = dateString.replace("/", "-");
    const formdat: string = formdate.replace("/", "-");
    let dateR = "";
    dateR =
      String(formdat).substring(3, 5) +
      "-" +
      String(formdat).substring(0, 2) +
      "-" +
      String(formdat).substring(6, 10);
    const convertDate = new Date(dateR);
    return convertDate;
  }

  nouvelleSaisie() {
    this.readonl = false;
    this.btnafficher = false;

    this.selectedBanque = null;

    this.visibleBtnAfficher = true;

    this.liste = null;
  }

  changeFournisseur() {
    if (
      this.selectedFournisseur !== null &&
      this.selectedFournisseur !== undefined
    ) {
      this.codeFour = this.selectedFournisseur.code;
    } else {
      this.codeFour = "";

      this.op.hide();
      // this.wasInside = false;
    }
  }

  ngOnInit() {
    this.btnajut = false;
    this.lstavantadd = new Array();
    this.clickaddnew = false;

    this.disable = false;

    this.btnafficher = false;
    this.visibleBtnAfficher = true;
    this.datedebut.setDate(1);
    this.datedebut.setMonth(0);
    this.datedebut.setFullYear(2017);
    this.selectedBanque = null;
    this.selectedFournisseur = null;
    this.fournisseurService
      .getFourListByDeno("")
      .toPromise()
      .then((data) => {
        this.fournisseurs = data["_embedded"].fournisseurs;
      });

    this.tn = {
      firstDayOfWeek: 1,
      dayNames: [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ],
      dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
      monthNames: [
        "Janvier",
        "Fevrier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre",
      ],
      monthNamesShort: [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aou",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      today: "Ajourd'hui",
      clear: "Annuler",
      dateFormat: "dd/mm/yyyy",
    };
    this.customAttributes = { class: "customcss" };
  }
}
