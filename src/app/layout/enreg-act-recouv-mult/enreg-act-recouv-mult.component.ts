import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import {
  GridComponent,
  ToolbarItems,
  RowSelectEventArgs,
  EditSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { Client } from "../services/client";
import { ClientService } from "../services/client.service";
import { async } from "q";
import { MessageService } from "primeng/api";
import { setCulture, L10n } from "@syncfusion/ej2-base";
// import { } from '@syncfusion/ej2-angular-treegrid';
import { ActionRecouvService } from "../services/actionRecouv.service";
import { AffectationRecouvrementService } from "../services/affectationRecouvrement.service";
import { AffectationRecouvrement } from "../services/affectationRecouvrement";
import { ActionRecouv } from "../services/actionRecouv";

import { OverlayPanel } from "primeng/primeng";
import { LoginService } from "src/app/login/login.service";
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
  selector: "app-enreg-act-recouv-mult",
  templateUrl: "./enreg-act-recouv-mult.component.html",
  styleUrls: ["./enreg-act-recouv-mult.component.scss"],
  providers: [MessageService],
})
export class EnregActRecouvMultComponent implements OnInit {
  @ViewChild("op")
  public op: OverlayPanel;
  msgerror: string;
  btnvalider: boolean;
  listeClientTemp: any;
  mindate = new Date();
  maxdate: Date;
  tabTempRech: Client[];
  tabtempRechgrid2 = new Array();

  constructor(
    private clientService: ClientService,
    private actionRecouvService: ActionRecouvService,
    private affectationRecouvrementService: AffectationRecouvrementService,
    private messageService: MessageService,
    private loginService: LoginService
  ) {
    this.mindate.setDate(this.date.getDate() - 7);
    this.maxdate = this.date;
  }

  actrecouv: ActionRecouv = {
    numAction: null,
    codeClt: "",
    effectueePar: "",
    date: "",
    action: "",
    numVisite: null,
    numMission: "",
  };
  wasInside: boolean;
  btnSelectClients: boolean;
  selectedValue = "Envoi du relevé";
  public clientsSelectionne = [];
  affct: AffectationRecouvrement = {
    numMission: "",
    codeClt: "",
    codeInitiateur: "",
    codeDestinataire: "",
    montant: "",
    details: "",
    dateDebut: "",
    dateFin: "",
    codeSituation: "",
    lue: "",
  };
  SelectedClient: Client = {
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
  // code1: string;
  code5: string;
  code2: string;
  deno1: string;
  deno2: string;
  date = new Date();

  @ViewChild("grid")
  public grid: GridComponent;
  @ViewChild("gridSelctionnee")
  public gridSelctionnee: GridComponent;

  public toolbar: ToolbarItems[];
  public toolbarOptions: ToolbarItems[];
  clients: Client[];
  valide = false;

  public sortOptions: object;
  public editSettings: EditSettingsModel;
  //  variable pour event double click
  tabtemp: Client[];
  tabclientsselectionnesgrid2: Client[];
  tabclientsselectionnesgrid1: Client[];
  datagrid2;
  // variable methode ajouterAction
  effectuePar;

  @HostListener("document:click")
  clickout() {
    if (!this.wasInside) {
      this.messageService.clear();
      if (this.op !== null && this.op !== undefined) {
        this.op.hide();
      }
    }
    this.wasInside = false;
  }

  ngOnInit() {
    this.btnSelectClients = true;
    this.btnvalider = false;
    this.valide = false;
  }

  initial() {
    this.wasInside = true;
    this.messageService.clear();
    this.tabclientsselectionnesgrid2 = new Array();
    this.tabclientsselectionnesgrid1 = new Array();
    this.code5 = "";
    this.code2 = "";
    this.deno1 = "";
    this.deno2 = "";
    this.ngOnInit();
    this.tabclientsselectionnesgrid2 = new Array();
    this.tabclientsselectionnesgrid1 = new Array();

    this.valide = true;
  }

  Afficher() {
    this.wasInside = true;
    this.messageService.clear();
    this.tabclientsselectionnesgrid2 = new Array();
    this.tabclientsselectionnesgrid1 = new Array();
    this.code5 = "";
    this.code2 = "";
    this.deno1 = "";
    this.deno2 = "";
    this.ngOnInit();
    this.tabclientsselectionnesgrid2 = new Array();
    this.tabclientsselectionnesgrid1 = new Array();

    this.clientService
      .listClientActRecMult()
      .toPromise()
      .then((data) => {
        this.clients = data["_embedded"].clients;
        this.valide = true;
        this.tabclientsselectionnesgrid1 = this.clients;
        this.tabTempRech = this.clients;
        if (this.tabclientsselectionnesgrid1.length > 0) {
          this.btnSelectClients = false;
        } else {
          this.btnSelectClients = true;
        }
        this.listeClientTemp = this.clients;
      });
  }

  rowSelected(args: RowSelectEventArgs) {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.SelectedClient = selected;
    }
  }

  rowSelected2(args: RowSelectEventArgs) {
    if (this.gridSelctionnee.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.gridSelctionnee.getSelectedRecords()[0];
      this.SelectedClient = selected;
    }
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  DoubleclickK(e) {
    const clt: Client = this.SelectedClient;
    const lenght = this.tabclientsselectionnesgrid1.push(clt);
    this.tabclientsselectionnesgrid1 = this.tabclientsselectionnesgrid1.sort(
      function (a, b) {
        return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
      }
    );
    this.tabclientsselectionnesgrid2.splice(
      this.tabclientsselectionnesgrid2.indexOf(clt),
      1
    );
    this.grid.refresh();
    this.gridSelctionnee.refresh();
    if (this.tabclientsselectionnesgrid2.length > 0) {
      this.btnvalider = true;
    } else {
      this.btnvalider = false;
    }
    this.SelectedClient = null;
  }

  Doubleclick(e) {
    this.btnvalider = true;
    const clt: Client = this.SelectedClient;
    const lenght = this.tabclientsselectionnesgrid2.push(clt);
    this.tabclientsselectionnesgrid2 = this.tabclientsselectionnesgrid2.sort(
      function (a, b) {
        return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
      }
    );
    this.tabtempRechgrid2.push(clt);
    this.tabtempRechgrid2 = this.tabtempRechgrid2.sort(function (a, b) {
      return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
    });
    this.tabclientsselectionnesgrid1.splice(
      this.tabclientsselectionnesgrid1.indexOf(clt),
      1
    );
    this.gridSelctionnee.refresh();
    this.grid.refresh();
    this.SelectedClient = null;
  }
  // enregistrement des actions multiples
  async ajouterAction(e) {
    this.messageService.clear();
    this.wasInside = true;
    if (this.valide === false) {
      this.msgerror = "Veuillez afficher la liste des clients !";
      this.op.show(e, document.getElementById("aff"));
    } else {
      if (this.tabclientsselectionnesgrid2.length !== 0) {
        for (const clts of this.tabclientsselectionnesgrid2) {
          this.effectuePar = localStorage.getItem("login");
          const datee = this.date.toLocaleDateString("en-GB");
          this.actrecouv.action = this.selectedValue;
          this.actrecouv.codeClt = clts.code;
          this.actrecouv.date = datee;
          this.actrecouv.effectueePar = this.effectuePar;
          this.actrecouv.numVisite = null;
          // recuperer numero du mission , si valeur = undefined alors num_mission = null
          let affect: AffectationRecouvrement;
          await this.affectationRecouvrementService
            .getFirstAffectationRecouvrementByCodeCltAndCodeSituation(
              clts.code,
              "O"
            )
            .toPromise()
            .then((data) => {
              affect = data["_embedded"].affectationRecouvrement[0];
              if (affect === undefined) {
                this.actrecouv.numMission = null;
              } else {
                this.actrecouv.numMission = affect.numMission;
              }
            });
          this.actionRecouvService
            .createActionRecouv(this.actrecouv)
            .toPromise()
            .then((data) => {
              console.log("add success", data);
            });

          const codeUtil = localStorage.getItem("login");
          const moduteName = globals.selectedMenu;
          const paramMouchar =
            "CL " + this.actrecouv.codeClt + " ACT " + this.actrecouv.action;
          this.loginService
            .procedureStockeModule(codeUtil, moduteName, paramMouchar)
            .toPromise()
            .then((data) => {
              console.log(data);
            });
        }

        this.tabclientsselectionnesgrid2.splice(0);
        this.tabclientsselectionnesgrid1.splice(0);
        this.gridSelctionnee.refresh();
        this.grid.refresh();
        this.valide = false;
        this.code5 = null;
        this.code2 = null;
        this.deno1 = null;
        this.deno2 = null;
      } else {
        this.btnvalider = false;
        this.btnSelectClients = false;
      }
    }
    this.btnvalider = false;
    this.btnSelectClients = true;
  }

  focusCode1() {
    this.deno1 = null;
    this.grid.refresh();
    this.tabclientsselectionnesgrid1 = this.tabTempRech;
  }

  OnChercheCode1(e, code1: string) {
    let tabRechCode1 = new Array();
    this.tabclientsselectionnesgrid1 = this.tabTempRech;
    // this.sortSettings = { columns: [{ field: 'code', direction: 'Ascending' }]  };
    if (this.valide === true) {
      if (code1 !== null && code1 !== undefined) {
        for (const item of this.tabclientsselectionnesgrid1) {
          if (item.code.startsWith(code1)) {
            tabRechCode1.push(item);
            tabRechCode1 = tabRechCode1.sort(function (a, b) {
              return a.code > b.code ? 1 : a.code < b.code ? -1 : 0;
            });
          }
        }
        this.tabclientsselectionnesgrid1 = tabRechCode1;

        //  this.grid.
        this.grid.refresh();
      } else {
        this.tabclientsselectionnesgrid1 = this.tabTempRech;
        this.grid.refresh();
      }
    } else {
      this.msgerror = "Veuillez afficher la liste des clients !";
      this.op.show(e, document.getElementById("aff"));
    }
  }
  focusDeno1() {
    this.code5 = null;
    this.tabclientsselectionnesgrid1 = this.tabTempRech;
    this.grid.refresh();
  }

  OnChercherDeno1(e, d: string) {
    let tabRechdeno1 = new Array();
    this.tabclientsselectionnesgrid1 = this.tabTempRech;

    if (this.valide === true) {
      if (d !== null && d !== undefined) {
        for (const item of this.tabclientsselectionnesgrid1) {
          if (item.deno.toUpperCase().startsWith(d.toUpperCase())) {
            tabRechdeno1.push(item);
            tabRechdeno1 = tabRechdeno1.sort(function (a, b) {
              return a.deno > b.deno ? 1 : a.deno < b.deno ? -1 : 0;
            });
          }
        }
        this.tabclientsselectionnesgrid1 = tabRechdeno1;
        this.grid.refresh();
      } else {
        this.tabclientsselectionnesgrid1 = this.tabTempRech;
        this.grid.refresh();
      }
    } else {
      this.msgerror = "Veuillez afficher la liste des clients !";
      this.op.show(e, document.getElementById("aff"));
    }
  }

  focusCode2() {
    this.deno2 = null;
    this.tabclientsselectionnesgrid2 = this.tabtempRechgrid2;
    this.gridSelctionnee.refresh();
  }
  OnChercheCode2(e, c: string) {
    this.tabclientsselectionnesgrid2 = this.tabtempRechgrid2;
    let tabRechdeno1 = new Array();
    if (this.valide === true) {
      if (c !== null && c !== undefined) {
        for (const item of this.tabclientsselectionnesgrid2) {
          if (item.code.startsWith(c)) {
            tabRechdeno1.push(item);
            tabRechdeno1.sort();

            tabRechdeno1 = tabRechdeno1.sort(function (a, b) {
              return a.code > b.deno ? 1 : a.code < b.deno ? -1 : 0;
            });
          }
        }
        this.tabclientsselectionnesgrid2 = tabRechdeno1;
        this.gridSelctionnee.refresh();
      } else {
        this.tabclientsselectionnesgrid2 = this.tabtempRechgrid2;
        this.gridSelctionnee.refresh();
      }
    } else {
      this.msgerror = "Veuillez afficher la liste des clients !";
      this.op.show(e, document.getElementById("aff"));
    }
  }

  focusDeno2() {
    this.code2 = null;
    this.tabclientsselectionnesgrid2 = this.tabtempRechgrid2;
    this.gridSelctionnee.refresh();
  }

  OnChercheDeno2(e, d: string) {
    let tabRechdeno1 = new Array();
    this.tabclientsselectionnesgrid2 = this.tabtempRechgrid2;

    if (this.valide === true) {
      if (d !== null && d !== undefined) {
        for (const item of this.tabclientsselectionnesgrid2) {
          if (item.deno.toUpperCase().startsWith(d.toUpperCase())) {
            tabRechdeno1.push(item);
            tabRechdeno1 = tabRechdeno1.sort(function (a, b) {
              return a.deno > b.deno ? 1 : a.deno < b.deno ? -1 : 0;
            });
          }
        }
        this.tabclientsselectionnesgrid2 = tabRechdeno1;
        this.gridSelctionnee.refresh();
      } else {
        this.tabclientsselectionnesgrid2 = this.tabtempRechgrid2;
        this.gridSelctionnee.refresh();
      }
    } else {
      this.msgerror = "Veuillez afficher la liste des clients !";
      this.op.show(e, document.getElementById("aff"));
    }
  }
}
