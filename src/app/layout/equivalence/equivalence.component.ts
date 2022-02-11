import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { Equivalence } from "../services/equivalence";
import { EquivalenceService } from "../services/equivalence.service";
import { Stock } from "../services/stock";
import { StockService } from "../services/stock.service";
import { Ste } from "../services/ste";
import { SteService } from "../services/ste.service";
import {
  GridComponent,
  ToolbarItems,
  SearchSettingsModel,
  ToolbarService,
  PdfExportService,
} from "@syncfusion/ej2-angular-grids";
import * as jspdf from "jspdf";
import "jspdf-autotable";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { OverlayPanel } from "primeng/primeng";
import { ConfirmationService } from "primeng/api";
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
  selector: "app-equivalence",
  templateUrl: "./equivalence.component.html",
  styleUrls: ["./equivalence.component.scss"],
  providers: [ToolbarService, PdfExportService, ConfirmationService],
})
export class EquivalenceComponent implements OnInit {
  @ViewChild("grid")
  public grid: GridComponent;
  @ViewChild("gridEquiv")
  public gridEquiv: GridComponent;
  public toolbarOptions: ToolbarItems[];
  public searchOptions: SearchSettingsModel;
  ajouterClicked = false;
  equivalences: Equivalence[];
  stocks: Stock[];
  ste: Ste;
  blockedDocument = false;
  saisieCardShow = false;
  ajouterDisable = false;
  modifierDisable = false;
  imprimerDisable = false;
  societe: string;
  selectedEquiv;
  selectedIndexEquiv = 0;
  selectedIndexStock = 0;
  ancEquiv;
  showModif = false;
  rechCodeEquiv = "";
  rechArticleEquiv = "";
  rechEquivStock = "";
  rechArticleStock = "";
  // finalMessages = [];
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
    // this.finalMessages = [];
  }
  constructor(
    private equivalenceService: EquivalenceService,
    private stockService: StockService,
    private steService: SteService,
    private loginService: LoginService,
    private confirmationService: ConfirmationService
  ) {
    // this.reloadDataEquiv();
    this.reloadDataArts();
  }

  async ngOnInit() {
    this.ancEquiv = this.gridEquiv.getSelectedRecords()[0];
  }
  annulerSelectionEquiv(): void {
    if (this.gridEquiv.getSelectedRowIndexes()[0] >= 0) {
      this.gridEquiv.selectRows([]);
      this.showModif = false;
    }
  }
  annulerSelectionStock(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  pdfHeaderQueryCellInfo(args: any): void {
    args.cell.row.pdfGrid.repeatHeader = true;
  }
  beforeExport(args: any) {
    args.allowRepeatHeader = false;
  }
  /*async reloadDataEquiv() {
    await this.equivalenceService
      .getEquivalencesList()
      .toPromise()
      .then((data) => {
        this.equivalences = data['_embedded'].equivalences;
      })
      .catch((data) => {
        console.log('erreurRldEquiv');
      });
  }*/
  async reloadDataArts() {
    await this.stockService
      .getStockList("")
      .toPromise()
      .then((data) => {
        this.stocks = data["_embedded"].stocks;
      })
      .catch((data) => {
        console.log("erreurRldArts");
      });
  }

  async applyFilterEquivParNum(e) {
    this.ov.hide();
    this.wasInside = true;
    this.equivalences = [];
    if (
      String(this.rechCodeEquiv) !== "" &&
      String(this.rechCodeEquiv) !== "null"
    ) {
      await this.equivalenceService
        .getEquivalence(this.rechCodeEquiv)
        .toPromise()
        .then((data) => {
          this.equivalences = data["_embedded"].equivalences;
        })
        .catch((data) => {
          console.log("erreurFilterEquivParCode");
        });
      if (this.equivalences.length < 1) {
        this.msgs = "Aucune ligne équivalence trouvé pour ce numero ";
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById("inputRech2").focus();
        this.ov.show(e, document.getElementById("inputRech2"));
      }
    } else {
      this.msgs = "Veuillez saisir un numero ";
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById("inputRech2").focus();
      this.ov.show(e, document.getElementById("inputRech2"));
    }
  }

  async applyFilterEquivParArt(e) {
    this.ov.hide();
    this.wasInside = true;
    this.equivalences = [];
    if (
      String(this.rechArticleEquiv) !== "" &&
      String(this.rechArticleEquiv) !== "null"
    ) {
      let exist = false;
      await this.stockService
        .exists(this.rechArticleEquiv)
        .toPromise()
        .then((data) => {
          if (data) {
            exist = true;
          }
        });
      if (exist) {
        await this.equivalenceService
          .getEquivParCodeArticle(this.rechArticleEquiv)
          .toPromise()
          .then((data) => {
            this.equivalences = data["_embedded"].equivalences;
          })
          .catch((data) => {
            console.log("erreurFilterEquivParArticle");
          });
        if (this.equivalences.length < 1) {
          this.msgs = "Aucune ligne équivalence trouvé pour ce code";
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById("inputRech1").focus();
          this.ov.show(e, document.getElementById("inputRech1"));
        }
      } else {
        this.msgs = "Code article saisie non existant ";
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById("inputRech1").focus();
        this.ov.show(e, document.getElementById("inputRech1"));
      }
    } else {
      this.msgs = "Veuillez saisir un code article ";
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById("inputRech1").focus();
      this.ov.show(e, document.getElementById("inputRech1"));
    }
  }
  async applyFilterArtParCode() {
    await this.stockService
      .getStockList(this.rechArticleStock)
      .toPromise()
      .then((data) => {
        this.stocks = data["_embedded"].stocks;
      })
      .catch((data) => {
        console.log("erreurFilterArtParCode");
      });
  }
  async applyFilterArtParNum(e) {
    this.ov.hide();
    this.wasInside = true;
    if (
      String(this.rechEquivStock) !== "" &&
      String(this.rechEquivStock) !== "null"
    ) {
      await this.stockService
        .getStockByEquiv(this.rechEquivStock)
        .toPromise()
        .then((data) => {
          this.stocks = data["_embedded"].stocks;
        })
        .catch((data) => {
          console.log("erreurFilterArtParNum");
        });
      if (this.stocks.length < 1) {
        this.msgs = "Aucun article trouvé pour ce numero ";
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById("inputRech4").focus();
        this.ov.show(e, document.getElementById("inputRech4"));
      }
    } else {
      this.msgs = "Veuillez saisir un numero ";
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById("inputRech4").focus();
      this.ov.show(e, document.getElementById("inputRech4"));
    }
  }

  async ajouter() {
    let maxCodeEquiv = "0";
    await this.equivalenceService
      .getMaxCodeEquiv()
      .toPromise()
      .then((data) => {
        maxCodeEquiv = String(Number(data) + 1);
      });
    this.selectedEquiv = {
      id: null,
      code: maxCodeEquiv,
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
    };
    this.ajouterClicked = true;
    this.saisieCardShow = true;
    this.ajouterDisable = true;
    this.modifierDisable = true;
    this.imprimerDisable = true;
    this.gridEquiv.clearSelection();
  }
  modifier() {
    if (this.gridEquiv.getSelectedRowIndexes()[0] >= 0) {
      const temp: any = this.gridEquiv.getSelectedRecords()[0];
      this.ancEquiv = temp;
      this.selectedEquiv = {
        id: temp.id,
        code: temp.code,
        code1: temp.code1,
        code2: temp.code2,
        code3: temp.code3,
        code4: temp.code4,
        code5: temp.code5,
      };
      this.ajouterClicked = false;
      this.saisieCardShow = true;
      this.ajouterDisable = true;
      this.modifierDisable = true;
      this.imprimerDisable = true;
    }
  }
  async imprimer() {
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data["_embedded"].ste;
      });
    const displayDate = new Date().toLocaleDateString('en-GB');
    const displayTime = new Date().toLocaleTimeString();

    const cols = [
      {
        code: "Code",
        code1: "Article1",
        code2: "Article2",
        code3: "Article3",
        code4: "Article4",
        code5: "Article5",
      },
    ];
    const equivs = [];
    let equivsTmp = [];
    await this.equivalenceService
      .getEquivalencesList()
      .toPromise()
      .then((data) => {
        equivsTmp = data["_embedded"].equivalences;
      });
    for (const equiv of equivsTmp) {
      equivs.push({
        code: equiv.code,
        code1: equiv.code1,
        code2: equiv.code2,
        code3: equiv.code3,
        code4: equiv.code4,
        code5: equiv.code5,
      });
    }
    const doc1 = new jspdf("a4");
    doc1.setFontSize(9);
    doc1.setFontStyle("arial");
    doc1.text(this.ste[0].societe, 14, 10);
    doc1.text("Edité le : " + displayDate + " " + displayTime, 157, 10);

    doc1.setFontSize(18);
    doc1.setFontStyle("arial");
    doc1.text("Liste des Classe d'Equivalences", 60, 30);

    doc1.autoTable({
      head: cols,
      body: equivs,
      startY: 50,
      theme: "grid",
      columnStyles: {
        code: { cellWidth: 15 },
        code1: { cellWidth: 33 },
        code2: { cellWidth: 33 },
        code3: { cellWidth: 33 },
        code4: { cellWidth: 33 },
        code5: { cellWidth: 33 },
      },
    });
    window.open(doc1.output("bloburl"), "_blank");
  }
  annuler(): void {
    this.ajouterClicked = false;
    this.saisieCardShow = false;
    this.ajouterDisable = false;
    this.modifierDisable = false;
    this.imprimerDisable = false;
    this.gridEquiv.clearSelection();
    this.showModif = false;
    this.selectedEquiv = {
      code: "",
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
    };
  }
  async checkArtExistence(codeArt: string) {
    let equivalences = [];
    await this.equivalenceService
      .getEquivParCodeArticle(codeArt)
      .toPromise()
      .then((data) => {
        equivalences = data["_embedded"].equivalences;
      });
    if (equivalences.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  async valider(e) {
    this.ov.hide();
    this.wasInside = true;
    // this.finalMessages = [];

    if (
      this.selectedEquiv.code1 !== "" &&
      String(this.selectedEquiv.code1) !== "null"
    ) {
      if (
        this.selectedEquiv.code2 !== "" &&
        String(this.selectedEquiv.code2) !== "null"
      ) {
        if (this.ajouterClicked) {
          let equivalences = [];
          await this.equivalenceService
            .getEquivParCodeArticle(this.selectedEquiv.code1)
            .toPromise()
            .then((data) => {
              equivalences = data["_embedded"].equivalences;
            });
          if (equivalences.length < 1) {
            equivalences = [];
            await this.equivalenceService
              .getEquivParCodeArticle(this.selectedEquiv.code2)
              .toPromise()
              .then((data) => {
                equivalences = data["_embedded"].equivalences;
              });
            if (equivalences.length < 1) {
              if (
                String(this.selectedEquiv.code3) !== "" &&
                String(this.selectedEquiv.code3) !== "null"
              ) {
                equivalences = [];
                await this.equivalenceService
                  .getEquivParCodeArticle(this.selectedEquiv.code3)
                  .toPromise()
                  .then((data) => {
                    equivalences = data["_embedded"].equivalences;
                  });
              }
              if (equivalences.length < 1) {
                if (
                  String(this.selectedEquiv.code4) !== "" &&
                  String(this.selectedEquiv.code4) !== "null"
                ) {
                  equivalences = [];
                  await this.equivalenceService
                    .getEquivParCodeArticle(this.selectedEquiv.code4)
                    .toPromise()
                    .then((data) => {
                      equivalences = data["_embedded"].equivalences;
                    });
                }
                if (equivalences.length < 1) {
                  if (
                    String(this.selectedEquiv.code5) !== "" &&
                    String(this.selectedEquiv.code5) !== "null"
                  ) {
                    equivalences = [];
                    await this.equivalenceService
                      .getEquivParCodeArticle(this.selectedEquiv.code5)
                      .toPromise()
                      .then((data) => {
                        equivalences = data["_embedded"].equivalences;
                      });
                  }
                  if (equivalences.length < 1) {
                    this.blockedDocument = true;
                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code1,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => console.log("errorUpdateStockCode1")
                      );
                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code2,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => console.log("errorUpdateStockCode2")
                      );
                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code3,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => console.log("errorUpdateStockCode3")
                      );
                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code4,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => console.log("errorUpdateStockCode4")
                      );
                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code5,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => console.log("errorUpdateStockCode5")
                      );
                    const equivTmp: any = {
                      id: null,
                      code: this.selectedEquiv.code,
                      code1: this.selectedEquiv.code1,
                      code2: this.selectedEquiv.code2,
                      code3: this.selectedEquiv.code3,
                      code4: this.selectedEquiv.code4,
                      code5: this.selectedEquiv.code5,
                    };
                    await this.equivalenceService
                      .createEquivalence(equivTmp)
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => console.log("errorAddEquiv")
                      );

                    this.loginService
                      .procedureStockeModule(
                        localStorage.getItem("login"),
                        globals.selectedMenu,
                        "AJOUT LIGNE EQUIV " + this.selectedEquiv.code
                      )
                      .subscribe((data) => {
                        console.log(data);
                      });
                    await this.equivalenceService
                      .getEquivalence(this.selectedEquiv.code)
                      .toPromise()
                      .then((data) => {
                        this.equivalences = data["_embedded"].equivalences;
                      })
                      .catch((data) => {
                        console.log("erreurFilterEquivParCode");
                      });
                    await this.reloadDataArts();
                    this.saisieCardShow = false;
                    this.ajouterDisable = false;
                    this.modifierDisable = false;
                    this.imprimerDisable = false;
                    this.selectedEquiv = {
                      code: "",
                      code1: "",
                      code2: "",
                      code3: "",
                      code4: "",
                      code5: "",
                    };
                    this.showModif = false;
                    this.blockedDocument = false;
                    /*this.finalMessages = [];
                  this.finalMessages.push({
                    severity: "success",
                    summary: "",
                    detail: "Equivalence ajouté avec succès",
                  });*/
                  } else {
                    this.msgs =
                      "Ce code existe dans un autre ligne d équivalence";
                    this.styleOvPanel = this.styleOvPanelError;
                    this.ov.show(e, document.getElementById("code5"));
                  }
                } else {
                  this.msgs =
                    "Ce code existe dans un autre ligne d équivalence";
                  this.styleOvPanel = this.styleOvPanelError;
                  this.ov.show(e, document.getElementById("code4"));
                }
              } else {
                this.msgs = "Ce code existe dans un autre ligne d équivalence";
                this.styleOvPanel = this.styleOvPanelError;
                this.ov.show(e, document.getElementById("code3"));
              }
            } else {
              this.msgs = "Ce code existe dans un autre ligne d équivalence";
              this.styleOvPanel = this.styleOvPanelError;
              this.ov.show(e, document.getElementById("code2"));
            }
          } else {
            this.msgs = "Ce code existe dans un autre ligne d équivalence";
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById("code1"));
          }
        } else {
          // modifier button
          let erreur = "";
          // verif art 1
          let equivalences = [];
          await this.equivalenceService
            .getEquivParCodeArticle(this.selectedEquiv.code1)
            .toPromise()
            .then((data) => {
              equivalences = data["_embedded"].equivalences;
            });
          if (
            equivalences.length < 1 ||
            (equivalences.length > 0 &&
              equivalences[0].code === this.selectedEquiv.code)
          ) {
            // verif art 2
            equivalences = [];
            await this.equivalenceService
              .getEquivParCodeArticle(this.selectedEquiv.code2)
              .toPromise()
              .then((data) => {
                equivalences = data["_embedded"].equivalences;
              });
            if (
              equivalences.length < 1 ||
              (equivalences.length > 0 &&
                equivalences[0].code === this.selectedEquiv.code)
            ) {
              // verif art 2
              if (
                String(this.selectedEquiv.code3) !== "" &&
                String(this.selectedEquiv.code3) !== "null"
              ) {
                equivalences = [];
                await this.equivalenceService
                  .getEquivParCodeArticle(this.selectedEquiv.code3)
                  .toPromise()
                  .then((data) => {
                    equivalences = data["_embedded"].equivalences;
                  });
              }
              if (
                equivalences.length < 1 ||
                (equivalences.length > 0 &&
                  equivalences[0].code === this.selectedEquiv.code)
              ) {
                if (
                  String(this.selectedEquiv.code4) !== "" &&
                  String(this.selectedEquiv.code4) !== "null"
                ) {
                  equivalences = [];
                  await this.equivalenceService
                    .getEquivParCodeArticle(this.selectedEquiv.code4)
                    .toPromise()
                    .then((data) => {
                      equivalences = data["_embedded"].equivalences;
                    });
                }
                if (
                  equivalences.length < 1 ||
                  (equivalences.length > 0 &&
                    equivalences[0].code === this.selectedEquiv.code)
                ) {
                  if (
                    String(this.selectedEquiv.code5) !== "" &&
                    String(this.selectedEquiv.code5) !== "null"
                  ) {
                    equivalences = [];
                    await this.equivalenceService
                      .getEquivParCodeArticle(this.selectedEquiv.code5)
                      .toPromise()
                      .then((data) => {
                        equivalences = data["_embedded"].equivalences;
                      });
                  }
                  if (
                    equivalences.length < 1 ||
                    (equivalences.length > 0 &&
                      equivalences[0].code === this.selectedEquiv.code)
                  ) {
                    this.blockedDocument = true;
                    await this.equivalenceService
                      .updateStock(this.ancEquiv.code1, "")
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => {
                          erreur = erreur + "1";
                        }
                      );

                    await this.equivalenceService
                      .updateStock(this.ancEquiv.code2, "")
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "2")
                      );

                    await this.equivalenceService
                      .updateStock(this.ancEquiv.code3, "")
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "3")
                      );

                    await this.equivalenceService
                      .updateStock(this.ancEquiv.code4, "")
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "4")
                      );

                    await this.equivalenceService
                      .updateStock(this.ancEquiv.code5, "")
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "5")
                      );

                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code1,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "6")
                      );
                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code2,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "7")
                      );
                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code3,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "8")
                      );
                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code4,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "9")
                      );
                    await this.equivalenceService
                      .updateStock(
                        this.selectedEquiv.code5,
                        this.selectedEquiv.code
                      )
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "10")
                      );

                    const equivTmp: any = {
                      id: this.selectedEquiv.id,
                      code: this.selectedEquiv.code,
                      code1: this.selectedEquiv.code1,
                      code2: this.selectedEquiv.code2,
                      code3: this.selectedEquiv.code3,
                      code4: this.selectedEquiv.code4,
                      code5: this.selectedEquiv.code5,
                    };

                    await this.equivalenceService
                      .updateEquivalence(equivTmp)
                      .toPromise()
                      .then(
                        (data) => {},
                        (error) => (erreur = erreur + "11")
                      );

                    if (erreur.length === 0) {
                      /*this.finalMessages = [];
                    this.finalMessages.push({
                      severity: "success",
                      summary: "",
                      detail: "Equivalence modifié avec succès",
                    });*/
                      // await this.applyFilterEquivParNum();
                      this.loginService
                        .procedureStockeModule(
                          localStorage.getItem("login"),
                          globals.selectedMenu,
                          "MODIF LIGNE EQUIV " + this.selectedEquiv.code
                        )
                        .subscribe((data) => {
                          console.log(data);
                        });
                      await this.equivalenceService
                        .getEquivalence(this.selectedEquiv.code)
                        .toPromise()
                        .then((data) => {
                          this.equivalences = data["_embedded"].equivalences;
                        })
                        .catch((data) => {
                          console.log("erreurFilterEquivParCode");
                        });
                      await this.reloadDataArts();
                      this.saisieCardShow = false;
                      this.ajouterDisable = false;
                      this.modifierDisable = false;
                      this.imprimerDisable = false;
                      this.showModif = false;
                      this.selectedEquiv = {
                        code: "",
                        code1: "",
                        code2: "",
                        code3: "",
                        code4: "",
                        code5: "",
                      };
                      // await this.applyFilterEquivParNum();
                    } else {
                      /* this.finalMessages = [];
                    this.finalMessages.push({
                      severity: "error",
                      summary: "",
                      detail:
                        "Equivalence non modifié ! Essayez ulterieurement si le problème persiste
                        veuillez contacter votre service technique",
                    });*/
                    }
                    this.blockedDocument = false;
                  } else {
                    this.msgs =
                      "Ce code existe dans un autre ligne d équivalence";
                    this.styleOvPanel = this.styleOvPanelError;
                    this.ov.show(e, document.getElementById("code5"));
                  }
                } else {
                  this.msgs =
                    "Ce code existe dans un autre ligne d équivalence";
                  this.styleOvPanel = this.styleOvPanelError;
                  this.ov.show(e, document.getElementById("code4"));
                }
              } else {
                this.msgs = "Ce code existe dans un autre ligne d équivalence";
                this.styleOvPanel = this.styleOvPanelError;
                this.ov.show(e, document.getElementById("code3"));
              }
            } else {
              this.msgs = "Ce code existe dans un autre ligne d équivalence";
              this.styleOvPanel = this.styleOvPanelError;
              this.ov.show(e, document.getElementById("code2"));
            }
          } else {
            this.msgs = "Ce code existe dans un autre ligne d équivalence";
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById("code1"));
          }
        }
      } else {
        this.msgs = "Il faut ajouter au minimum deux articles";
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById("btValider"));
      }
    } else {
      if (!this.ajouterClicked) {
        this.confirmationService.confirm({
          message: "Voulez vous supprimer cette ligne d'equivalence ?",
          header: "Confirmation de suppression",
          icon: "pi pi-info-circle",
          acceptLabel: "Oui",
          rejectLabel: "Non",
          accept: () => {
            console.log("yes delete");
            this.supprimer();
          },
          reject: () => {
            this.ov.hide();
            this.wasInside = true;
            this.msgs = "Il faut ajouter au minimum deux articles";
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById("btValider"));
          },
        });
      } else {
        this.msgs = "Il faut ajouter au minimum deux articles";
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById("btValider"));
      }
    }
  }
  isPresent(itemList: Equivalence, searchedItem: string): boolean {
    if (
      itemList.code1 === searchedItem ||
      itemList.code2 === searchedItem ||
      itemList.code3 === searchedItem ||
      itemList.code4 === searchedItem ||
      itemList.code5 === searchedItem
    ) {
      return true;
    } else {
      return false;
    }
  }
  ajouterArt(): void {
    const selectedRecord: any = this.grid.getSelectedRecords()[0];
    if (!this.isPresent(this.selectedEquiv, selectedRecord.code)) {
      if (
        this.selectedEquiv.code1 === "" ||
        this.selectedEquiv.code1 === null
      ) {
        this.selectedEquiv.code1 = selectedRecord.code;
        return;
      }
      if (
        this.selectedEquiv.code2 === "" ||
        this.selectedEquiv.code2 === null
      ) {
        this.selectedEquiv.code2 = selectedRecord.code;
        return;
      }
      if (
        this.selectedEquiv.code3 === "" ||
        this.selectedEquiv.code3 === null
      ) {
        this.selectedEquiv.code3 = selectedRecord.code;
        return;
      }
      if (
        this.selectedEquiv.code4 === "" ||
        this.selectedEquiv.code4 === null
      ) {
        this.selectedEquiv.code4 = selectedRecord.code;
        return;
      }
      if (
        this.selectedEquiv.code5 === "" ||
        this.selectedEquiv.code5 === null
      ) {
        this.selectedEquiv.code5 = selectedRecord.code;
        return;
      }
    }
  }
  reintialiser(index: number) {
    if (index === 0) {
      this.rechCodeEquiv = "";
    } else {
      if (index === 1) {
        this.rechArticleEquiv = "";
      } else {
        if (index === 2) {
          this.rechEquivStock = "";
        } else {
          this.rechArticleStock = "";
        }
      }
    }
  }
  async supprimer() {
    await this.equivalenceService
      .updateStock(this.ancEquiv.code1, "")
      .toPromise()
      .then((data) => {});

    await this.equivalenceService
      .updateStock(this.ancEquiv.code2, "")
      .toPromise()
      .then((data) => {});

    await this.equivalenceService
      .updateStock(this.ancEquiv.code3, "")
      .toPromise()
      .then((data) => {});

    await this.equivalenceService
      .updateStock(this.ancEquiv.code4, "")
      .toPromise()
      .then((data) => {});

    await this.equivalenceService
      .updateStock(this.ancEquiv.code5, "")
      .toPromise()
      .then((data) => {});
    await this.equivalenceService
      .deleteEquivalence(this.ancEquiv.id)
      .toPromise()
      .then((data) => {});
    this.loginService
      .procedureStockeModule(
        localStorage.getItem("login"),
        globals.selectedMenu,
        "SUPP LIGNE EQUIV " + this.selectedEquiv.code
      )
      .subscribe((data) => {
        console.log(data);
      });
    this.equivalences = [];
    await this.reloadDataArts();
    this.saisieCardShow = false;
    this.ajouterDisable = false;
    this.modifierDisable = false;
    this.imprimerDisable = false;
    this.selectedEquiv = {
      code: "",
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
    };
    this.equivalences = [];
    this.showModif = false;
    // await this.applyFilterEquivParNum();
  }
}
