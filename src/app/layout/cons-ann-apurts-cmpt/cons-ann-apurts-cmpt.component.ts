import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { SelectItem } from "primeng/api";
import { CaisseService } from "../services/caisse.service";
import { CaissePService } from "../services/caisseP.service";
import { ClientService } from "../services/client.service";
import { LoginService } from "../../login/login.service";
import { Client } from "../services/client";
import { Caisse } from "../services/caisse";
import { DatePipe } from "@angular/common";
import { CaisseP } from "../services/caisseP";
import { OverlayPanel } from "primeng/primeng";
import { NgSelectConfig } from "@ng-select/ng-select";
import { globals } from "src/environments/environment";

@Component({
  selector: "app-cons-ann-apurts-cmpt",
  templateUrl: "./cons-ann-apurts-cmpt.component.html",
  styleUrls: ["./cons-ann-apurts-cmpt.component.scss"],
  providers: [DatePipe],
})
export class ConsAnnApurtsCmptComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    private caisseService: CaisseService,
    private caissePService: CaissePService,
    private clientService: ClientService,
    private loginService: LoginService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = "";
    this.config.clearAllText = "Supprimer tous";

    this.piece = [
      { label: "", value: "" },
      { label: "FACTURE", value: "FACTURE" },
      { label: "AVOIR", value: "AVOIR" },
      { label: "TRAITE", value: "TRAITE" },
      { label: "CHEQUE", value: "CHEQUE" },
      { label: "IMP/TRT", value: "IMP/TRT" },
      { label: "IMP/CHK", value: "IMP/CHK" },
      { label: "ESPECE", value: "ESPECE" },
      { label: "VIR.BNQ", value: "VIR.BNQ" },
    ];
  }
  @ViewChild("grid")
  public grid: GridComponent;
  @ViewChild("gridCredit")
  public gridCredit: GridComponent;
  @ViewChild("gridDebit")
  public gridDebit: GridComponent;
  piece: SelectItem[];
  clients: Client[];
  caisse: Caisse[];
  caisseP: CaisseP[];
  caisseDebit: Caisse[] = [];
  caisseCredit: Caisse[] = [];
  caissePDebit: CaisseP[] = [];
  caissePCredit: CaisseP[] = [];
  blockDocument = false;
  from: any;
  to: any;
  selectedPiece: any = "";
  selectedClient = null;
  saisieCardShow = false;
  ngselectDisabled = false;
  selectedrowindex: any;
  selectedrecordsD: any;
  selectedrecordsC: any;
  afficherShow = false;
  debut: string;
  fin: string;
  saisieCardShow1 = false;
  apurement: string;
  sync;
  codeClient = "";
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
  async ngOnInit() {
    this.from = new Date("01/01/2014");
    this.to = new Date();
    await this.clientService
      .getClientsComptantListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data["_embedded"].clients;
      });
    // this.reloadDataClient();
  }
  /*
  reloadDataClient() {
    this.clientService.getClientsList().subscribe((data) => {
      this.clients = data["_embedded"].clients;
      console.log("DataClient");
    });
  }*/
  async afficher(e) {
    this.wasInside = true;
    this.ov.hide();
    this.blockDocument = true;
    this.apurement = null;
    this.debut = this.datePipe.transform(this.from, "dd/MM/yyyy");
    this.fin = this.datePipe.transform(this.to, "dd/MM/yyyy");
    await this.caisseService
      .reglement(
        this.selectedClient.code,
        this.selectedPiece,
        this.debut,
        this.fin
      )
      .toPromise()
      .then((data) => {
        this.caisse = data["_embedded"].caisses;
      });
    await this.caissePService
      .reglement(
        this.selectedClient.code,
        this.selectedPiece,
        this.debut,
        this.fin
      )
      .toPromise()
      .then((data) => {
        this.caisseP = data["_embedded"].caisseP;
        for (const c of this.caisse) {
          this.caisseP.push(c);
        }
      });

    if (this.caisse.length === 0 && this.caisseP.length === 0) {
      this.msgs = "Pas de reglements pour ces critères !";
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById("btAfficher"));
    } else {
      this.caisseP = this.caisseP.sort(function (a, b) {
        if (a.date != null && b.date != null) {
          if (
            new Date(
              +a.date.split("/")[2],
              +a.date.split("/")[1] - 1,
              +a.date.split("/")[0]
            ) <
            new Date(
              +b.date.split("/")[2],
              +b.date.split("/")[1] - 1,
              +b.date.split("/")[0]
            )
          ) {
            return -1;
          }
          if (
            new Date(
              +a.date.split("/")[2],
              +a.date.split("/")[1] - 1,
              +a.date.split("/")[0]
            ) >
            new Date(
              +b.date.split("/")[2],
              +b.date.split("/")[1] - 1,
              +b.date.split("/")[0]
            )
          ) {
            return 1;
          }
          if (a.mode > b.mode) {
            return 1;
          }
          if (a.mode < b.mode) {
            return -1;
          }
        }
        if (a.mode > b.mode) {
          return 1;
        }
        if (a.mode < b.mode) {
          return -1;
        }
      });
      this.saisieCardShow = true;
      this.ngselectDisabled = true;
      this.afficherShow = false;
    }
    this.blockDocument = false;
  }
  async getAppurement(args: any) {
    this.selectedrecordsD = this.grid.getRowInfo(args.target).rowData;
    this.apurement = this.selectedrecordsD.apurement;
    const memePiece = 0;
    await this.caisseService
      .resulat1(this.selectedClient.code, this.apurement)
      .toPromise()
      .then((data) => {
        this.caisseDebit = data["_embedded"].caisses;
      });
    await this.caissePService
      .resulat1(this.selectedClient.code, this.apurement)
      .toPromise()
      .then((data) => {
        this.caissePDebit = data["_embedded"].caisseP;
        /*for (const c of this.caisseDebit) {
          this.caissePDebit.push(c);
        }*/
        this.caissePDebit = this.caissePDebit.concat(this.caisseDebit);
      });

    await this.caisseService
      .resulat2(this.selectedClient.code, this.apurement)
      .toPromise()
      .then((data) => {
        this.caisseCredit = data["_embedded"].caisses;
      });
    await this.caissePService
      .resulat2(this.selectedClient.code, this.apurement)
      .toPromise()
      .then((data) => {
        this.caissePCredit = data["_embedded"].caisseP;
        for (const c of this.caisseCredit) {
          this.caissePCredit.push(c);
        }
      });
    let i = 1;
    for (const c of this.caissePDebit) {
      if (c.id === this.selectedrecordsD.id) {
        break;
      }
      i++;
    }
    if (i > this.caissePDebit.length) {
      i = 1;
      for (const c of this.caissePCredit) {
        if (c.id === this.selectedrecordsD.id) {
          break;
        }
        i++;
      }
      this.gridCredit.selectRows([i - 1]);
    } else {
      this.gridDebit.selectRows([i - 1]);
    }

    this.grid.selectRows([this.grid.getRowInfo(args.target).rowIndex]);
    this.saisieCardShow1 = true;
  }
  async annuler() {
    await this.caisseService
      .annulerApp(this.apurement)
      .toPromise()
      .then((data) => {});
    await this.caissePService
      .annulerApp(this.apurement)
      .toPromise()
      .then((data) => {});
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem("login"),
        globals.selectedMenu,
        this.apurement
      )
      .toPromise()
      .then((data) => {
        console.log(data);
      });
    this.saisieCardShow = false;
    this.saisieCardShow1 = false;
    this.selectedClient = null;
    this.selectedPiece = "";
    this.caisseDebit = [];
    this.caisseCredit = [];
    this.caissePDebit = [];
    this.caissePCredit = [];
    this.ngselectDisabled = false;
    this.clients = [];
    this.codeClient = "";
    this.afficherShow = false;
  }
  nouveau(): void {
    this.caisseDebit = [];
    this.caisseCredit = [];
    this.caissePDebit = [];
    this.caissePCredit = [];
    this.caisse = [];
    this.caisseP = [];
    this.selectedPiece = "";
    this.selectedClient = null;
    this.saisieCardShow = false;
    this.saisieCardShow1 = false;
    this.ngselectDisabled = false;
    this.codeClient = "";
    this.afficherShow = false;
  }
  async applyFilterClientParCode(e) {
    let filteredElements = [];
    await this.clientService
      .getClientByCode(e.target.value)
      .toPromise()
      .then((data) => {
        filteredElements = data["_embedded"].clients;
      });
    if (filteredElements.length > 0) {
      this.selectedClient = filteredElements[0];
      this.afficherShow = true;
    } else {
      this.afficherShow = false;
      this.msgs = "Code Client Inexistant !";
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById("codeClt").focus();
      this.ov.show(e, document.getElementById("codeClt"));
    }
  }
  intialiserSelectedClient() {
    // console.log('ok');
    this.selectedClient = {
      id: null,
      code: null,
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
      bcExige: null,
    };
  }
  async updateOnSelect() {
    if (this.selectedClient !== null) {
      if (this.selectedClient.id !== null) {
        if (!this.saisieCardShow) {
          this.codeClient = this.selectedClient.code;
          this.afficherShow = true;
        }
      } else {
        this.codeClient = "";
        this.afficherShow = false;
      }
    } else {
      this.codeClient = "";
      this.afficherShow = false;
    }
  }
  async applyFilterClientParDeno(filtredValue: string) {
    await this.clientService
      .getClientsTop100ByDenoStartsWith(filtredValue)
      .toPromise()
      .then((data) => {
        this.clients = data["_embedded"].clients;
      });
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
}
