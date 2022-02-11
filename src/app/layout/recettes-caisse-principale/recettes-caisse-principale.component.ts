import { Component, ViewChild, OnInit, HostListener } from "@angular/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { Client } from "../services/client";
import { SelectItem, ConfirmationService } from "primeng/api";
import { RecettesCaissePrincipale } from "../services/RecettesCaissePrincipale";
import { SteService } from "../services/ste.service";
import { ClientService } from "../services/client.service";
import { SoldcsService } from "../services/soldcs.service";
import { RecettesCaissePrincipaleService } from "../services/recettesCaissePrincipale.service";
import { CaissePService } from "../services/caisseP.service";
import { LoginService } from "../../login/login.service";
import { LibrecService } from "../services/librec.service";
import { RowSelectEventArgs } from "@syncfusion/ej2-grids";
import { DatePipe } from "@angular/common";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { InputMask, OverlayPanel } from "primeng/primeng";
import { NgSelectComponent, NgSelectConfig } from "@ng-select/ng-select";
import { CaisseP } from "../services/caisseP";
import { globals } from "src/environments/environment";
setCulture("fr-FR");
L10n.load({
  "fr-FR": {
    grid: {
      EmptyRecord: " ",
      EmptyDataSourceError: " ",
    },
  },
});

@Component({
  selector: "app-recettes-caisse-principale",
  templateUrl: "./recettes-caisse-principale.component.html",
  styleUrls: ["./recettes-caisse-principale.component.scss"],
  providers: [ConfirmationService, DatePipe],
})
export class RecettesCaissePrincipaleComponent implements OnInit {
  text: string;
  submitted: boolean;

  @ViewChild("grid")
  public grid: GridComponent;
  dateCaisse;
  dateCaissePrincipale;
  from: any;
  to: any;
  maxDate: Date;
  minDate: Date;
  clients: Client[] = [];
  libelle: SelectItem[];
  libellees: SelectItem[];
  mode: SelectItem[];
  allowSelection = true;
  validershow = false;
  ajouterDisabled = true;
  supprimerDisabled = true;
  modifierDisabled = true;
  champDisabled = true;
  afficherClicked = false;
  afficherShow = true;
  ajouterClicked = false;
  modifierClicked = false;
  selected;
  selectedCode;
  deno;

  recettes: RecettesCaissePrincipale[] = [];
  selectedClient: Client = {
    id: "",
    code: "",
    deno: "",
    adresse: "",
    ville: "",
    post: "",
    respon: "",
    tel: "",
    agence: "",
    banque: "",
    telex: "",
    fax: "",
    cadnat: "",
    compte: "",
    edition: "",
    exonor: "",
    duree: "",
    reg: "",
    terme: "",
    marque: "",
    plafond: "",
    zone: "",
    comm: "",
    assujet: "",
    codeTva: "",
    timbre: "",
    ech: "",
    bloc: "",
    datBlc: "",
    typeC: "",
    regle: "",
    lettre: "",
    codeC: "",
    autor: "",
    eMail: "",
    typeComm: "",
    rec: "",
    vend: "",
    represant: "",
    secteur: "",
    objectif: "",
    nature: "",
    datCreat: "",
    mag: "",
    respons2: "",
    adresseusine: "",
    adressesiege: "",
    gsm1: "",
    gsm2: "",
    nouvMag: "",
    ca123: "",
    respons3: "",
    fonction1: "",
    fonction2: "",
    fonction3: "",
    eMail1: "",
    eMail2: "",
    eMail3: "",
    tel2: "",
    tel3: "",
    gsm3: "",
    codGroupe: "",
    modeReg: "",
    plafondEncours: "",
    indic: "",
    bcExige: "",
  };
  selectedCaisse: any = {
    id: "",
    code: "",
    date: "",
    mode: "",
    cheque: "",
    banque: "",
    facture: "",
    sens: "",
    montant: "",
    ech: "",
    observat: "",
    datVer: "",
    datRec: "",
    etat: "",
    etat2: "",
    banqEqm: "",
    borVer: "",
    borEnc: "",
    tire: "",
    combine: "",
    operateur: "",
    regle: "",
    apurement: "",
    dateApur: "",
    borRtr: "",
    numPiece: "",
  };
  tn;
  @ViewChild("ngSelectLibelle") ngSelectLibelle: NgSelectComponent;
  @ViewChild("ngSelectClient") ngSelectClient: NgSelectComponent;
  @ViewChild("ngSelectMode") ngSelectMode: NgSelectComponent;
  @ViewChild("inputMaskDateEnreg") inputMaskDateEnreg: InputMask;
  @ViewChild("inputMaskEcheance") inputMaskEcheance: InputMask;
  @ViewChild("ov")
  public ov: OverlayPanel;
  msgs = "";
  wasInside: boolean;
  styleOvPanelError = {
    "text-align": "center",
    "font-size": "14px",
    "background-color": " #f8b7bd",
  };
  styleOvPanelSuccess = {
    "text-align": "center",
    "font-size": "12px",
    "background-color": " #b7d8b7",
  };
  styleOvPanel = {};
  @HostListener("document:click")
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }

  constructor(
    private datePipe: DatePipe,
    private steService: SteService,
    private clientService: ClientService,
    private soldcsService: SoldcsService,
    private RecettecaissePrincipaleService: RecettesCaissePrincipaleService,
    private caissePService: CaissePService,
    private loginService: LoginService,
    private librecService: LibrecService,
    private confirmationService: ConfirmationService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = "";
    this.config.clearAllText = "Supprimer tous";
    /*this.libelle = [
      { label: '', value: '' },
      { label: 'ACOMPTE CLIENT', value: '06' },
      { label: 'AVANCE/VENTE COMPTANT', value: '04' },
      { label: 'AVOIR/ACHAT AU COMPTANT', value: '07' },
      { label: 'COMPENSATION', value: '60' },
      { label: 'DIVERS', value: '08' },
      { label: 'INTERET DE RETARD', value: '93' },
      { label: 'RECTIFICATION SOLDE', value: '09' },
      { label: 'REGLEMENT A TERME', value: '05' },
      { label: 'REGLEMENT IMPAYE', value: '03' },
      { label: 'REGLEMENT INSTANCE', value: '02' },
      { label: 'RETENU A LA SOURCE', value: '50' },
      { label: 'TITRE DE REMPLACEMENT', value: 'AA' },
      { label: 'VENTES AU COMPTANT', value: '01' },
    ];*/

    this.mode = [
      { label: "", value: null },
      { label: "CHEQUE", value: "CHEQUE" },
      { label: "ESPECE", value: "ESPECE" },
      { label: "RS", value: "RS" },
      { label: "VIR.BNQ", value: "VIR.BNQ" },
      { label: "TRAITE", value: "TRAITE" },
      { label: "CARTEB", value: "CARTEB" },
    ];
  }

  async ngOnInit() {
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
    this.to = new Date();
    this.maxDate = new Date();
    await this.getDate();
    await this.clientService
      .getClientsComptantListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data["_embedded"].clients;
      });
    let librecs = [];
    await this.librecService
      .getLibrecListOrderByLibelle()
      .toPromise()
      .then((data) => {
        librecs = data["_embedded"].librec;
      });
    this.libelle = librecs.map((obj) => {
      return {
        value: obj.code,
        label: obj.libelle,
      };
    });
    this.libelle.unshift({ label: "", value: "" });
  }
  /*
  async reloadDataClient() {
    await this.clientService
      .getClientsList()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
  }
*/
  async getDeno() {
    await this.clientService
      .getDeno(this.selected.client)
      .toPromise()
      .then((value) => {
        this.deno = value;
      });
  }

  async getDate() {
    await this.steService
      .getDateCaissePlus()
      .toPromise()
      .then((value) => {
        this.dateCaisse = value;
      });
    this.from = new Date(this.dateCaisse);
    this.minDate = this.from;
    this.from = this.from.toLocaleDateString("en-GB");
    this.to = this.to.toLocaleDateString("en-GB");
  }

  async RecetteCaisse() {
    await this.RecettecaissePrincipaleService.recettesCaissePrincipale(
      this.from,
      this.to
    )
      .toPromise()
      .then((data) => {
        this.recettes = data["_embedded"].recettesCaissePrincipale;
      });
  }

  async reloadCaissesPrincipale() {
    await this.RecettecaissePrincipaleService.recettesCaissePrincipale(
      this.from,
      this.to
    )
      .toPromise()
      .then((data) => {
        this.recettes = data["_embedded"].recettesCaissePrincipale;
      });
  }
  async afficher() {
    await this.RecetteCaisse();
    this.afficherClicked = true;
    this.ajouterDisabled = false;
    this.afficherShow = false;
  }

  async ajouter() {
    this.text = "Saisie de la nouvelle recette";
    this.allowSelection = false;
    this.selectedCaisse = {
      id: null,
      code: null,
      date: new Date(),
      mode: null,
      cheque: null,
      banque: null,
      facture: null,
      sens: "E",
      montant: null,
      ech: new Date(),
      observat: null,
      datVer: null,
      datRec: null,
      etat: null,
      etat2: null,
      banqEqm: null,
      borVer: null,
      borEnc: null,
      tire: null,
      combine: null,
      operateur: null,
      regle: null,
      apurement: null,
      dateApur: null,
      borRtr: null,
      numPiece: null,
    };
    // await this.reloadDataClient();
    this.afficherShow = false;
    this.ajouterClicked = true;
    this.modifierClicked = false;
    this.ajouterDisabled = true;
    this.modifierDisabled = true;
    this.supprimerDisabled = true;
    this.selectedClient = null;
    this.champDisabled = false;
    this.validershow = true;
    this.selectedCaisse.ech = this.datePipe.transform(
      this.selectedCaisse.ech,
      "dd/MM/yyyy"
    );
    this.selectedCaisse.date = this.datePipe.transform(
      this.selectedCaisse.date,
      "dd/MM/yyyy"
    );
    this.grid.selectRows([]);
    setTimeout(() => this.ngSelectLibelle.focus(), 1);
  }

  setCode() {
    if (this.selectedClient != null) {
      this.selectedCode = this.selectedClient.code;
      this.selectedCaisse.operateur = this.selectedClient.code;
      this.selectedCaisse.tire = String(this.selectedClient.deno).substr(0, 25);
      if (
        this.selectedCaisse.mode === "CHEQUE" ||
        this.selectedCaisse.mode === "TRAITE"
      ) {
        document.getElementById("tire").focus();
      } else {
        document.getElementById("btValider").focus();
      }
    }
  }

  setTire() {
    if (
      this.modifierClicked &&
      (this.selectedCaisse.mode === "CHEQUE" ||
        this.selectedCaisse.mode === "TRAITE")
    ) {
      this.selectedCaisse.tire = this.selectedClient;
    }
    if (this.selectedCaisse.mode !== "" && this.selectedCaisse.mode !== null) {
      setTimeout(() => document.getElementById("facture").focus(), 1);
    }
  }

  async createRecette() {
    await this.caissePService
      .createCaisse(this.selectedCaisse)
      .toPromise()
      .then((data) => {
        this.reloadCaissesPrincipale();
      });
  }

  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.ajouterClicked === true) {
      /*if (this.selectedCaisse.mode === null) {
        this.msgs = 'Veuillez selectionner un mode !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('mode').focus();
        this.ov.show(e, document.getElementById('mode'));
      } else if (
        this.selectedCaisse.mode === 'TRAITE' ||
        this.selectedCaisse.mode === 'CHEQUE'
      ) {
        if (
          this.selectedCaisse.code !== null &&
          this.selectedCaisse.montant !== null &&
          this.selectedCaisse.cheque !== null &&
          this.selectedCaisse.cheque !== '' &&
          this.selectedCaisse.banque !== null &&
          this.selectedCaisse.banque !== '' &&
          this.selectedCaisse.operateur !== null &&
          this.selectedCaisse.tire !== '' &&
          this.selectedCaisse.tire.length <= '25'
        ) {
          await this.createRecette();
          this.allowSelection = true;
          this.ajouterClicked = false;
          this.ajouterDisabled = false;
          this.champDisabled = true;
          this.afficherShow = true;
        } else if (
          this.selectedCaisse.code !== null &&
          this.selectedCaisse.montant !== null &&
          this.selectedCaisse.cheque !== null &&
          this.selectedCaisse.cheque !== '' &&
          this.selectedCaisse.banque !== null &&
          this.selectedCaisse.banque !== '' &&
          this.selectedCaisse.operateur !== null &&
          this.selectedCaisse.tire.length > '25'
        ) {
          this.msgs = 'Le nombre de caractères maximal est 25 !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('tire').focus();
          this.ov.show(e, document.getElementById('tire'));
        } else {
          this.msgs = 'Remplir tout les champs !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btValider'));
        }
      } else if (
        this.selectedCaisse.mode !== null &&
        this.selectedCaisse.code !== null &&
        this.selectedCaisse.montant !== null &&
        this.selectedCaisse.operateur !== null
      ) {
        this.selectedCaisse.tire = null;

        await this.createRecette();
        this.allowSelection = true;
        this.champDisabled = true;
        this.afficherShow = true;
      } else {
        this.msgs = 'Remplir tout les champs !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btValider'));
      }*/
      if (this.selectedCaisse.code === null) {
        this.msgs = "Veuillez selectionner un libelle !";
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById("libelle").focus();
        this.ov.show(e, document.getElementById("libelle"));
      } else {
        if (this.selectedCaisse.mode === null) {
          this.msgs = "Veuillez selectionner un mode !";
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById("mode").focus();
          this.ov.show(e, document.getElementById("mode"));
        } else {
          if (
            this.selectedCaisse.mode === "TRAITE" ||
            this.selectedCaisse.mode === "CHEQUE"
          ) {
            if (this.selectedCaisse.cheque === null) {
              this.msgs = "Veuillez saisir le titre !";
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById("titre").focus();
              this.ov.show(e, document.getElementById("titre"));
            } else {
              if (this.selectedCaisse.banque === null) {
                this.msgs = "Veuillez saisir la banque !";
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById("banque").focus();
                this.ov.show(e, document.getElementById("banque"));
              } else {
                if (this.selectedCaisse.operateur === null) {
                  this.msgs = "Veuillez selectionner le client !";
                  this.styleOvPanel = this.styleOvPanelError;
                  document.getElementById("client").focus();
                  this.ov.show(e, document.getElementById("client"));
                } else {
                  if (
                    this.selectedCaisse.tire === null ||
                    this.selectedCaisse.tire === ""
                  ) {
                    this.msgs = "Veuillez saisir le tire !";
                    this.styleOvPanel = this.styleOvPanelError;
                    document.getElementById("tire").focus();
                    this.ov.show(e, document.getElementById("tire"));
                  } else {
                    if (
                      this.selectedCaisse.montant === null ||
                      this.selectedCaisse.montant === "" ||
                      this.selectedCaisse.montant === "0.000"
                    ) {
                      this.msgs = "Veuillez saisir le montant !";
                      this.styleOvPanel = this.styleOvPanelError;
                      document.getElementById("montant").focus();
                      this.ov.show(e, document.getElementById("montant"));
                    } else {
                      const libelle = this.libelle.find(
                        (lib) => lib.value === this.selectedCaisse.code
                      );
                      if (
                        ((libelle.label === "RETENU A LA SOURCE" ||
                          libelle.label === "RETENUE A LA SOURCE") &&
                          this.selectedCaisse.mode !== "RS") ||
                        (libelle.label === "COMPENSATION" &&
                          this.selectedCaisse.mode !== "CHEQUE")
                      ) {
                        this.msgs = "Mode Incorrect !";
                        this.styleOvPanel = this.styleOvPanelError;
                        document.getElementById("mode").focus();
                        this.ov.show(e, document.getElementById("mode"));
                      } else {
                        await this.createRecette();
                        if (libelle.label === "COMPENSATION") {
                          const cpCompensation: CaisseP = {
                            id: null,
                            code: this.selectedCaisse.code,
                            date: this.selectedCaisse.date,
                            mode: "ESPECE",
                            cheque: "",
                            banque: "",
                            facture: "",
                            sens: "S",
                            montant: this.selectedCaisse.montant,
                            ech: null,
                            observat: "",
                            datVer: null,
                            datRec: null,
                            etat: null,
                            etat2: null,
                            banqEqm: null,
                            borVer: null,
                            borEnc: null,
                            tire: "",
                            combine: null,
                            operateur: "",
                            regle: null,
                            apurement: null,
                            dateApur: null,
                            borRtr: null,
                            numPiece: null,
                          };
                          await this.caissePService
                            .createCaisse(cpCompensation)
                            .toPromise()
                            .then();
                        }
                        await this.loginService
                          .procedureStockeModule(
                            localStorage.getItem("login"),
                            globals.selectedMenu,
                            "AJ " +
                              Number(this.selectedCaisse.montant).toFixed(3) +
                              " " +
                              libelle.label +
                              " " +
                              this.selectedCaisse.date
                          )
                          .toPromise()
                          .then();
                        this.fermer();
                      }
                    }
                  }
                }
              }
            }
          } else {
            if (this.selectedCaisse.client === null) {
              this.msgs = "Veuillez selectionner le client !";
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById("client").focus();
              this.ov.show(e, document.getElementById("client"));
            } else {
              if (
                this.selectedCaisse.montant === null ||
                this.selectedCaisse.montant === "" ||
                this.selectedCaisse.montant === "0.000"
              ) {
                this.msgs = "Veuillez saisir le montant !";
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById("montant").focus();
                this.ov.show(e, document.getElementById("montant"));
              } else {
                const libelle = this.libelle.find(
                  (lib) => lib.value === this.selectedCaisse.code
                );
                if (
                  ((libelle.label === "RETENU A LA SOURCE" ||
                    libelle.label === "RETENUE A LA SOURCE") &&
                    this.selectedCaisse.mode !== "RS") ||
                  (libelle.label === "COMPENSATION" &&
                    this.selectedCaisse.mode !== "CHEQUE")
                ) {
                  this.msgs = "Mode Incorrect !";
                  this.styleOvPanel = this.styleOvPanelError;
                  document.getElementById("mode").focus();
                  this.ov.show(e, document.getElementById("mode"));
                } else {
                  await this.createRecette();
                  if (libelle.label === "COMPENSATION") {
                    const cpCompensation: CaisseP = {
                      id: null,
                      code: this.selectedCaisse.code,
                      date: this.selectedCaisse.date,
                      mode: "ESPECE",
                      cheque: "",
                      banque: "",
                      facture: "",
                      sens: "S",
                      montant: this.selectedCaisse.montant,
                      ech: null,
                      observat: "",
                      datVer: null,
                      datRec: null,
                      etat: null,
                      etat2: null,
                      banqEqm: null,
                      borVer: null,
                      borEnc: null,
                      tire: "",
                      combine: null,
                      operateur: "",
                      regle: null,
                      apurement: null,
                      dateApur: null,
                      borRtr: null,
                      numPiece: null,
                    };
                    await this.caissePService
                      .createCaisse(cpCompensation)
                      .toPromise()
                      .then();
                  }
                  await this.loginService
                    .procedureStockeModule(
                      localStorage.getItem("login"),
                      globals.selectedMenu,
                      "AJ " +
                        Number(this.selectedCaisse.montant).toFixed(3) +
                        " " +
                        libelle.label +
                        " " +
                        this.selectedCaisse.date
                    )
                    .toPromise()
                    .then();
                  this.fermer();
                }
              }
            }
          }
        }
      }
    }
    if (this.modifierClicked === true) {
      if (this.selectedCaisse.code === null) {
        this.msgs = "Veuillez selectionner un libelle !";
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById("libelle").focus();
        this.ov.show(e, document.getElementById("libelle"));
      } else {
        if (this.selectedCaisse.mode === null) {
          this.msgs = "Veuillez selectionner un mode !";
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById("mode").focus();
          this.ov.show(e, document.getElementById("mode"));
        } else {
          if (
            this.selectedCaisse.mode === "TRAITE" ||
            this.selectedCaisse.mode === "CHEQUE"
          ) {
            if (this.selectedCaisse.cheque === null) {
              this.msgs = "Veuillez saisir le titre !";
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById("titre").focus();
              this.ov.show(e, document.getElementById("titre"));
            } else {
              if (this.selectedCaisse.banque === null) {
                this.msgs = "Veuillez saisir la banque !";
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById("banque").focus();
                this.ov.show(e, document.getElementById("banque"));
              } else {
                if (this.selectedCaisse.operateur === null) {
                  this.msgs = "Veuillez selectionner le client !";
                  this.styleOvPanel = this.styleOvPanelError;
                  document.getElementById("client").focus();
                  this.ov.show(e, document.getElementById("client"));
                } else {
                  if (
                    this.selectedCaisse.tire === null ||
                    this.selectedCaisse.tire === ""
                  ) {
                    this.msgs = "Veuillez saisir le tire !";
                    this.styleOvPanel = this.styleOvPanelError;
                    document.getElementById("tire").focus();
                    this.ov.show(e, document.getElementById("tire"));
                  } else {
                    if (
                      this.selectedCaisse.montant === null ||
                      this.selectedCaisse.montant === "" ||
                      this.selectedCaisse.montant === "0.000"
                    ) {
                      this.msgs = "Veuillez saisir le montant !";
                      this.styleOvPanel = this.styleOvPanelError;
                      document.getElementById("montant").focus();
                      this.ov.show(e, document.getElementById("montant"));
                    } else {
                      const libelle = this.libelle.find(
                        (lib) => lib.value === this.selectedCaisse.code
                      );
                      if (
                        ((libelle.label === "RETENU A LA SOURCE" ||
                          libelle.label === "RETENUE A LA SOURCE") &&
                          this.selectedCaisse.mode !== "RS") ||
                        (libelle.label === "COMPENSATION" &&
                          this.selectedCaisse.mode !== "CHEQUE")
                      ) {
                        this.msgs = "Mode Incorrect !";
                        this.styleOvPanel = this.styleOvPanelError;
                        document.getElementById("mode").focus();
                        this.ov.show(e, document.getElementById("mode"));
                      } else {
                        this.confirmationService.confirm({
                          message: "Voulez Vous Valider la modification  ?",
                          header: "Confirmation",
                          icon: "pi pi-exclamation-triangle",
                          acceptLabel: "Oui",
                          rejectLabel: "Non",
                          accept: async () => {
                            await this.modifierRecette();
                            await this.loginService
                              .procedureStockeModule(
                                localStorage.getItem("login"),
                                globals.selectedMenu,
                                "MD " +
                                  Number(this.selectedCaisse.montant).toFixed(
                                    3
                                  ) +
                                  " " +
                                  libelle.label +
                                  " " +
                                  this.selectedCaisse.date
                              )
                              .toPromise()
                              .then();
                            this.fermer();
                          },
                          reject: () => {},
                        });
                      }
                    }
                  }
                }
              }
            }
          } else {
            if (this.selectedCaisse.client === null) {
              this.msgs = "Veuillez selectionner le client !";
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById("client").focus();
              this.ov.show(e, document.getElementById("client"));
            } else {
              if (
                this.selectedCaisse.montant === null ||
                this.selectedCaisse.montant === "" ||
                this.selectedCaisse.montant === "0.000"
              ) {
                this.msgs = "Veuillez saisir le montant !";
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById("montant").focus();
                this.ov.show(e, document.getElementById("montant"));
              } else {
                const libelle = this.libelle.find(
                  (lib) => lib.value === this.selectedCaisse.code
                );
                if (
                  ((libelle.label === "RETENU A LA SOURCE" ||
                    libelle.label === "RETENUE A LA SOURCE") &&
                    this.selectedCaisse.mode !== "RS") ||
                  (libelle.label === "COMPENSATION" &&
                    this.selectedCaisse.mode !== "CHEQUE")
                ) {
                  this.msgs = "Mode Incorrect !";
                  this.styleOvPanel = this.styleOvPanelError;
                  document.getElementById("mode").focus();
                  this.ov.show(e, document.getElementById("mode"));
                } else {
                  this.confirmationService.confirm({
                    message: "Voulez Vous Valider la modification  ?",
                    header: "Confirmation",
                    icon: "pi pi-exclamation-triangle",
                    acceptLabel: "Oui",
                    rejectLabel: "Non",
                    accept: async () => {
                      await this.modifierRecette();
                      await this.loginService
                        .procedureStockeModule(
                          localStorage.getItem("login"),
                          globals.selectedMenu,
                          "MD " +
                            Number(this.selectedCaisse.montant).toFixed(3) +
                            " " +
                            libelle.label +
                            " " +
                            this.selectedCaisse.date
                        )
                        .toPromise()
                        .then();
                      this.fermer();
                    },
                    reject: () => {},
                  });
                }
              }
            }
          }
        }
      }
      /*
      if (this.selectedCaisse.mode === null) {
        this.msgs = 'Veuillez selectionner un mode !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('mode').focus();
        this.ov.show(e, document.getElementById('mode'));
      } else if (
        this.selectedCaisse.mode === 'CHEQUE' ||
        this.selectedCaisse.mode === 'TRAITE'
      ) {
        if (
          this.selectedCaisse.code !== null &&
          this.selectedCaisse.montant !== null &&
          this.selectedCaisse.cheque !== null &&
          this.selectedCaisse.cheque !== '' &&
          this.selectedCaisse.banque !== null &&
          this.selectedCaisse.banque !== '' &&
          this.selectedCaisse.operateur !== null &&
          this.selectedCaisse.ech !== null &&
          this.selectedCaisse.tire !== '' &&
          this.selectedCaisse.tire.length <= '25'
        ) {
          this.confirmationService.confirm({
            message: 'Voulez Vous Valider la modification  ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: async () => {
              await this.modifierRecette();
              this.allowSelection = true;
              this.champDisabled = true;
              this.validershow = false;
              this.afficherShow = true;
              this.modifierClicked = false;
              this.ajouterDisabled = false;
            },
            reject: () => {},
          });
        } else if (
          this.selectedCaisse.code !== null &&
          this.selectedCaisse.montant !== null &&
          this.selectedCaisse.cheque !== null &&
          this.selectedCaisse.cheque !== '' &&
          this.selectedCaisse.banque !== null &&
          this.selectedCaisse.banque !== '' &&
          this.selectedCaisse.operateur !== null &&
          this.selectedCaisse.ech !== null &&
          this.selectedCaisse.tire.length > '25'
        ) {
          this.msgs = 'Le nombre de caractères maximal est 25 !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('tire').focus();
          this.ov.show(e, document.getElementById('tire'));
        } else {
          this.msgs = 'Remplir tout les champs !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btValider'));
        }
      } else if (
        this.selectedCaisse.mode !== null &&
        this.selectedCaisse.code !== null &&
        this.selectedCaisse.montant !== null &&
        this.selectedCaisse.operateur !== null
      ) {
        this.selectedCaisse.tire = null;
        this.selectedCaisse.cheque = null;
        this.selectedCaisse.banque = null;
        this.selectedCaisse.tire = null;
        this.selectedCaisse.ech = null;
        this.confirmationService.confirm({
          message: 'Voulez Vous Valider la modification  ?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Oui',
          rejectLabel: 'Non',
          accept: async () => {
            await this.modifierRecette();
            this.allowSelection = true;
            this.champDisabled = true;
            this.validershow = false;
            this.afficherShow = true;
            this.modifierClicked = false;
            this.ajouterDisabled = false;
          },
          reject: () => {},
        });
      } else {
        this.msgs = 'Remplir tout les champs !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btValider'));
      }*/
    }
  }

  async modifierRecette() {
    console.log(this.selectedCaisse);
    await this.caissePService
      .updateput(this.selectedCaisse)
      .toPromise()
      .then(
        async (data) => {
          await this.reloadCaissesPrincipale();
        },
        (error) => console.log("There was an error: ", error)
      );
  }

  async modifier(e) {
    this.wasInside = true;
    this.ov.hide();
    if (
      this.selected.apurement != null ||
      this.selected.libelle === "COMPENSATION"
    ) {
      this.msgs = "Mouvement Appuré - Modification pas Possible !";
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById("btModifier"));
      this.allowSelection = true;
    } else {
      this.text = "Modification de la recette";
      if (
        String(this.selected.client) !== "" &&
        String(this.selected.client) !== "null"
      ) {
        await this.clientService
          .getDeno(this.selected.client)
          .toPromise()
          .then((value) => {
            this.deno = value;
            this.selectedClient = this.deno;
          });
      } else {
        this.selectedClient = null;
      }
      // await this.reloadDataClient();
      this.selectedCode = this.selected.client;
      this.selectedCaisse.code = this.selected.code;
      /*if (this.selected.libelle === 'VENTES AU COMPTANT') {
        this.selectedCaisse.code = '01';
      } else if (this.selected.libelle === 'REGLEMENT INSTANCE') {
        this.selectedCaisse.code = '02';
      } else if (this.selected.libelle === 'REGLEMENT IMPAYE') {
        this.selectedCaisse.code = '03';
      } else if (this.selected.libelle === 'AVANCE/VENTE COMPTANT') {
        this.selectedCaisse.code = '04';
      } else if (this.selected.libelle === 'REGLEMENT A TERME') {
        this.selectedCaisse.code = '05';
      } else if (this.selected.libelle === 'ACOMPTE CLIENT') {
        this.selectedCaisse.code = '06';
      } else if (this.selected.libelle === 'AVOIR/ACHAT AU COMPTANT') {
        this.selectedCaisse.code = '07';
      } else if (this.selected.libelle === 'DIVERS') {
        this.selectedCaisse.code = '08';
      } else if (this.selected.libelle === 'RECTICATION SOLDE') {
        this.selectedCaisse.code = '09';
      } else if (this.selected.libelle === 'RETENU A LA SOURCE') {
        this.selectedCaisse.code = '50';
      } else if (this.selected.libelle === 'COMPENSATION') {
        this.selectedCaisse.code = '60';
      } else if (this.selected.libelle === 'INTERET DE RETARD') {
        this.selectedCaisse.code = '93';
      } else if (this.selected.libelle === 'TITRE DE REMPLACEMENT') {
        this.selectedCaisse.code = 'AA';
      }*/

      this.afficherShow = false;
      this.allowSelection = false;
      this.champDisabled = false;
      this.ajouterClicked = false;
      this.modifierClicked = true;
      this.modifierDisabled = true;
      this.supprimerDisabled = true;
      this.ajouterDisabled = true;
      this.validershow = true;
      setTimeout(() => this.ngSelectLibelle.focus(), 1);
    }
  }

  supprimer(e) {
    this.wasInside = true;
    this.ov.hide();
    if (
      this.selected.apurement != null ||
      this.selected.libelle === "COMPENSATION"
    ) {
      this.msgs = "Mouvement Appuré - Suppression pas Possible !";
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById("btSupprimer"));
      this.allowSelection = true;
    } else {
      this.confirmationService.confirm({
        message: "Etes vous sur de vouloir supprimer ce Réglement  ?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Oui",
        rejectLabel: "Non",
        accept: async () => {
          await this.supprimerRecette();
          await this.loginService
            .procedureStockeModule(
              localStorage.getItem("login"),
              globals.selectedMenu,
              "SP " +
                Number(this.selectedCaisse.montant).toFixed(3) +
                " " +
                this.selected.libelle +
                " " +
                this.selectedCaisse.date
            )
            .toPromise()
            .then();
          this.modifierDisabled = true;
          this.supprimerDisabled = true;
        },
        reject: () => {},
      });
    }
  }

  async supprimerRecette() {
    await this.caissePService
      .deleteCaisse(this.selectedCaisse.id)
      .toPromise()
      .then(
        async (data) => {
          await this.reloadCaissesPrincipale();
        },
        (error) => console.log("There was an error: ", error)
      );
  }

  fermer() {
    /*this.allowSelection = true;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.ajouterDisabled = false;
    this.modifierDisabled = true;
    this.supprimerDisabled = true;
    this.selectedClient = null;
    this.selectedCode = null;*/
    if (this.ajouterClicked) {
      this.modifierDisabled = true;
      this.supprimerDisabled = true;
    } else {
      this.modifierDisabled = false;
      this.supprimerDisabled = false;
    }
    this.allowSelection = true;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.ajouterDisabled = false;
    this.selectedCode = null;
  }

  rowSelected(args: RowSelectEventArgs) {
    if (this.grid.getSelectedRecords().length > 0) {
      this.modifierDisabled = false;
      this.supprimerDisabled = false;
      this.selected = this.grid.getSelectedRecords()[0];
      this.selectedCaisse.id = this.selected.id;
      this.selectedCaisse.code = this.selected.libelle;
      this.selectedCaisse.date = this.selected.date;
      this.selectedCaisse.montant = this.selected.montant;
      this.selectedCaisse.mode = this.selected.mode;
      this.selectedClient = this.deno;
      this.selectedCaisse.operateur = this.selected.client;
      this.selectedCaisse.ech = this.selected.echeance;
      this.selectedCaisse.tire = this.selected.tire;
      this.selectedCaisse.banque = this.selected.banque;
      this.selectedCaisse.cheque = this.selected.cheque;
      this.selectedCaisse.facture = this.selected.facture;
      this.selectedCaisse.sens = this.selected.sens;
      this.selectedCaisse.regle = this.selected.regle;
      this.selectedCaisse.observat = this.selected.observation;
      this.selectedCaisse.apurement = this.selected.apurement;
      this.selectedCaisse.dateApur = this.selected.dateApur;
      this.selectedCaisse.datVer = this.selected.datVer;
      this.selectedCaisse.datRec = this.selected.datRec;
      this.selectedCaisse.etat = this.selected.etat;
      this.selectedCaisse.etat2 = this.selected.etat2;
      this.selectedCaisse.banqEqm = this.selected.banqEqm;
      this.selectedCaisse.combine = this.selected.combine;
      this.selectedCaisse.borVer = this.selected.borVer;
      this.selectedCaisse.borEnc = this.selected.borEnc;
      this.selectedCaisse.borRtr = this.selected.borRtr;
      this.selectedCaisse.numPiece = this.selected.numPiece;
      //  let selectedRowElement: Element[] = this.grid.selectionModule.selectedRecords;  Get the Selected record row element collection.
    }
  }

  onselect(event) {
    this.selectedCaisse.date = this.datePipe.transform(
      this.selectedCaisse.date,
      "dd/MM/yyyy"
    );
  }

  onselectEch(event: string) {
    this.selectedCaisse.ech = this.datePipe.transform(
      this.selectedCaisse.ech,
      "dd/MM/yyyy"
    );
  }

  onselectTo(event: string) {
    this.to = this.datePipe.transform(this.to, "dd/MM/yyyy");
  }

  annulerSelection(): void {
    if (!this.ajouterClicked) {
      if (this.grid.getSelectedRowIndexes()[0] >= 0) {
        this.modifierDisabled = true;
        this.supprimerDisabled = true;
        this.grid.selectRows([]);
      }
    }
  }
  async applyFilterCltParDeno(filterValue: string) {
    await this.clientService
      .getClientsTop100ByDenoStartsWith(filterValue)
      .toPromise()
      .then((data) => {
        this.clients = data["_embedded"].clients;
      });
  }
  nouvelleSaisie() {
    this.modifierDisabled = true;
    this.supprimerDisabled = true;
    this.allowSelection = true;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.ajouterDisabled = false;
    this.selectedCode = null;
    this.afficherClicked = false;
    this.afficherShow = true;
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  formatMontant() {
    if (String(Number(this.selectedCaisse.montant)) !== "NaN") {
      this.selectedCaisse.montant = Number(this.selectedCaisse.montant).toFixed(
        3
      );
    } else {
      this.selectedCaisse.montant = "";
    }
  }
  public onSearchLibelle(word: string, item: any): boolean {
    return item.label.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchMode(word: string, item: any): boolean {
    return item.label.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  moveToNextInput(e, index: number) {
    if (index === 0) {
      if (
        this.selectedCaisse.code !== "" &&
        this.selectedCaisse.code !== null
      ) {
        setTimeout(() => this.inputMaskDateEnreg.focus(), 1);
      }
    }
    if (index === 1) {
      let date = 0;
      const parts = this.selectedCaisse.date.split("/");
      date = Date.parse(parts[1] + "/" + parts[0] + "/" + parts[2]);
      if (isNaN(date)) {
        this.msgs = "Date Incorrecte !";
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById("dateEnreg").focus();
        this.ov.show(e, document.getElementById("dateEnreg"));
        this.selectedCaisse.date = "";
      } else {
        if (new Date(date) < this.minDate || new Date(date) > this.maxDate) {
          this.msgs = "Date Incorrecte !";
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById("dateEnreg").focus();
          this.ov.show(e, document.getElementById("dateEnreg"));
          this.selectedCaisse.date = "";
        } else {
          document.getElementById("montant").focus();
        }
      }
    }
    if (index === 2) {
      if (
        this.selectedCaisse.montant !== "" &&
        this.selectedCaisse.montant !== null
      ) {
        this.formatMontant();
        if (this.selectedCaisse.montant !== "0.000") {
          setTimeout(() => this.ngSelectMode.focus(), 1);
        }
      }
    }
    if (index === 3) {
      document.getElementById("observation").focus();
    }
    if (index === 4) {
      if (
        this.selectedCaisse.mode === "CHEQUE" ||
        this.selectedCaisse.mode === "TRAITE"
      ) {
        document.getElementById("titre").focus();
      } else {
        setTimeout(() => this.ngSelectClient.focus(), 1);
      }
    }
    if (index === 5) {
      if (
        this.selectedCaisse.cheque !== "" &&
        this.selectedCaisse.cheque !== null
      ) {
        document.getElementById("banque").focus();
      }
    }
    if (index === 6) {
      if (
        this.selectedCaisse.banque !== "" &&
        this.selectedCaisse.banque !== null
      ) {
        setTimeout(() => this.inputMaskEcheance.focus(), 1);
      }
    }
    if (index === 7) {
      let echeance = 0;
      const parts = this.selectedCaisse.ech.split("/");
      echeance = Date.parse(parts[1] + "/" + parts[0] + "/" + parts[2]);
      if (isNaN(echeance)) {
        this.msgs = "Date Incorrecte !";
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById("echeance").focus();
        this.ov.show(e, document.getElementById("echeance"));
        this.selectedCaisse.ech = "";
      } else {
        if (new Date(echeance) < this.minDate) {
          this.msgs = "Date Incorrecte !";
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById("echeance").focus();
          this.ov.show(e, document.getElementById("echeance"));
          this.selectedCaisse.ech = "";
        } else {
          setTimeout(() => this.ngSelectClient.focus(), 1);
        }
      }
    }
    if (index === 8) {
      if (
        this.selectedCaisse.tire !== "" &&
        this.selectedCaisse.tire !== null
      ) {
        setTimeout(() => document.getElementById("btValider").focus(), 1);
      }
    }
  }
}
