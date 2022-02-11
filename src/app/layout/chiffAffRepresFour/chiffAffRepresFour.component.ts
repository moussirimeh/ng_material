import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { RepresanService } from "../services/represan.service";
import { CaRepresFourService } from "../services/caRepresFour.service";
import { CaRepresFour } from "../services/caRepresFour";
import {
  GridComponent,
  ToolbarItems,
  ToolbarService,
  ExcelExportProperties,
  TextWrapSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import * as jspdf from "jspdf";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { Represan } from "../services/represan";
import { NgSelectConfig } from "@ng-select/ng-select";
import { OverlayPanel } from "primeng/primeng";
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
  selector: "app-black-page",
  templateUrl: "./chiffAffRepresFour.component.html",
  styleUrls: ["./chiffAffRepresFour.component.scss"],
  providers: [ToolbarService],
})
export class ChiffAffRepresFourComponent implements OnInit {
  @ViewChild("grid") public grid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  public customAttributes: object;
  represans;
  selectedRepresant = null;
  // enableSelectRepresant = false;
  public wrapSettings: TextWrapSettingsModel;
  caData: CaRepresFour[] = [
    /*{
      id: '',
      client: '',
      ca1: '',
      ca2: '',
      ca3: '',
      ca4: '',
      ca5: '',
      ca6: '',
      ca7: '',
      ca8: '',
      ca9: '',
      ca10: '',
      ca11: '',
      ca12: '',
      nbrVisite: '',
      representant: ''
    }*/
  ];
  fours = [];
  columns = [];
  showGrid = false;
  blockeDocument = false;
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
    private represanService: RepresanService,
    private caRepresFourService: CaRepresFourService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = "Aucun élément trouvé";
    this.config.clearAllText = "Supprimer tous ";
  }

  async ngOnInit() {
    this.wrapSettings = { wrapMode: "Both" };
    await this.represanService
      .getRepresansList()
      .toPromise()
      .then((data) => {
        this.represans = data["_embedded"].represans;
        this.represans.unshift({ id: "", code: null, deno: "" });
      });
    await this.caRepresFourService
      .getFournisseurs()
      .toPromise()
      .then((data) => {
        this.fours = data;
      });
    const longDenoFour = 5;
    for (const cols of this.grid.columns) {
      if ((cols as any).field === "client") {
        (cols as any).headerText = "Client";
      }
      if ((cols as any).field === "ca1") {
        if (String(this.fours[0][1]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][1];
        } else {
          (cols as any).headerText = String(this.fours[0][1]).substr(
            0,
            longDenoFour
          );
        }
      }
      if ((cols as any).field === "ca2") {
        if (String(this.fours[0][3]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][3];
        } else {
          (cols as any).headerText = String(this.fours[0][3]).substr(
            0,
            longDenoFour
          );
        }
      }
      if ((cols as any).field === "ca3") {
        if (String(this.fours[0][5]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][5];
        } else {
          (cols as any).headerText = String(this.fours[0][5]).substr(
            0,
            longDenoFour
          );
        }
      }
      if ((cols as any).field === "ca4") {
        if (String(this.fours[0][7]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][7];
        } else {
          (cols as any).headerText = String(this.fours[0][7]).substr(
            0,
            longDenoFour
          );
        }
      }
      if ((cols as any).field === "ca5") {
        if (String(this.fours[0][9]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][9];
        } else {
          (cols as any).headerText = String(this.fours[0][9]).substr(
            0,
            longDenoFour
          );
        }
      }
      if ((cols as any).field === "ca6") {
        if (String(this.fours[0][11]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][11];
        } else {
          (cols as any).headerText = String(this.fours[0][11]).substr(
            0,
            longDenoFour
          );
        }
      }
      if ((cols as any).field === "ca7") {
        if (String(this.fours[0][13]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][13];
        } else {
          (cols as any).headerText = String(this.fours[0][13]).substr(
            0,
            longDenoFour
          );
        }
      }
      if ((cols as any).field === "ca8") {
        if (String(this.fours[0][15]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][15];
        } else {
          (cols as any).headerText = String(this.fours[0][15]).substr(
            0,
            longDenoFour
          );
        }
      }
      if ((cols as any).field === "ca9") {
        if (String(this.fours[0][17]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][17];
        } else {
          (cols as any).headerText = String(this.fours[0][17]).substr(
            0,
            longDenoFour
          );
        }
      }
      if ((cols as any).field === "ca10") {
        if (String(this.fours[0][19]).length < longDenoFour) {
          (cols as any).headerText = this.fours[0][19];
        } else {
          (cols as any).headerText = String(this.fours[0][19]).substr(
            0,
            longDenoFour
          );
        }
      }
    }
    this.grid.refreshColumns();
    this.toolbarOptions = ["ExcelExport"];
    this.customAttributes = { class: "customcss" };
  }
  async afficher(index, e) {
    this.blockeDocument = true;
    this.caData = [];
    let codeRep = "";
    if (this.selectedRepresant != null && this.selectedRepresant.code != null) {
      codeRep = this.selectedRepresant.code;
    }
    await this.caRepresFourService
      .getCaRepresFour(this.fours[0], codeRep)
      .toPromise()
      .then((data) => {
        this.caData = data["_embedded"].caRepresFour;
      });
    this.blockeDocument = false;
    if (this.caData.length > 0) {
      if (index === 0) {
        this.showGrid = true;
      }
    } else {
      this.msgs = "Aucune resultat trouvée";
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e);
    }
  }
  async previsualiser(e) {
    let page = 1;
    const x = 3;
    let y = 10;
    const doc1 = new jspdf("landscape");
    // a4 : 297x210
    // Titre
    doc1.setFontSize(10);
    doc1.setFontStyle("arial");
    doc1.text(
      "REPARTITION DU CHIFFRE D'AFFAIRES REPRESENTANT/FOURNISSEUR EDITE LE " +
        new Date().toLocaleString(),
      60,
      y
    );
    y = y + 2;
    // ligne horizontal
    doc1.line(1, y, 296, y);
    // line(x1, y1, x2, y2, style);
    y = y + 5;
    // entetes colonnes
    doc1.setFontSize(7);
    doc1.setFontStyle("bold");
    doc1.text("CLIENT", x, y);
    doc1.text(this.fours[0][1], x + 35, y);
    doc1.text(String(this.fours[0][3]).substring(0, 5), x + 52, y);
    doc1.text(this.fours[0][5], x + 75, y);
    doc1.text(String(this.fours[0][7]).substring(0, 7), x + 91, y);
    doc1.text(this.fours[0][9], x + 109, y);
    doc1.text(this.fours[0][11], x + 127, y);
    doc1.text(this.fours[0][13], x + 145, y);
    doc1.text(this.fours[0][15], x + 163, y);
    doc1.text(this.fours[0][17], x + 181, y);
    // doc1.text(this.fours[0][19], x + 199, y);
    doc1.text(String(this.fours[0][19]).substring(0, 10), x + 199, y);
    doc1.text("AUTRE", x + 217, y);
    doc1.text("TOTAL", x + 235, y);
    doc1.text("NBR_VST", x + 246, y);
    doc1.text("REPRESENTANT", x + 258, y);
    y = y + 2;
    // ligne horizontal
    doc1.line(1, y, 296, y);
    y = y + 5;
    // contenu
    doc1.setFontStyle("normal");
    for (const ca of this.caData) {
      if (String(ca.client).length < 18) {
        doc1.text(ca.client, x, y);
      } else {
        doc1.text(String(ca.client).substring(0, 18), x, y);
      }
      doc1.text(Number(ca.ca1).toFixed(0), x + 39, y, "right");
      doc1.text(Number(ca.ca2).toFixed(0), x + 58, y, "right");
      doc1.text(Number(ca.ca3).toFixed(0), x + 79, y, "right");
      doc1.text(Number(ca.ca4).toFixed(0), x + 100, y, "right");
      doc1.text(Number(ca.ca5).toFixed(0), x + 122, y, "right");
      doc1.text(Number(ca.ca6).toFixed(0), x + 139, y, "right");
      doc1.text(Number(ca.ca7).toFixed(0), x + 152, y, "right");
      doc1.text(Number(ca.ca8).toFixed(0), x + 170, y, "right");
      doc1.text(Number(ca.ca9).toFixed(0), x + 189, y, "right");
      doc1.text(Number(ca.ca10).toFixed(0), x + 208, y, "right");
      doc1.text(Number(ca.ca11).toFixed(0), x + 224, y, "right");
      doc1.text(Number(ca.ca12).toFixed(0), x + 242, y, "right");
      doc1.text(Number(ca.nbrVisite).toFixed(0), x + 251, y, "right");
      doc1.text(ca.representant, x + 258, y);
      y = y + 2;
      // ligne horizontal
      doc1.line(1, y, 296, y);
      if (y < 200) {
        y = y + 6;
      } else {
        // lignes vertical
        if (page === 1) {
          doc1.line(1, 12, 1, y);
          doc1.line(296, 12, 296, y);
        } else {
          doc1.line(1, 2, 1, y);
          doc1.line(296, 2, 296, y);
        }

        doc1.addPage();
        page++;
        y = 2;
        // ligne horizontal
        doc1.line(1, y, 296, y);
        y = y + 5;
        // entetes colonnes
        doc1.setFontSize(7);
        doc1.setFontStyle("bold");
        doc1.text("CLIENT", x, y);
        doc1.text(this.fours[0][1], x + 35, y);
        doc1.text(String(this.fours[0][3]).substring(0, 5), x + 52, y);
        doc1.text(this.fours[0][5], x + 75, y);
        doc1.text(String(this.fours[0][7]).substring(0, 7), x + 91, y);
        doc1.text(this.fours[0][9], x + 109, y);
        doc1.text(this.fours[0][11], x + 127, y);
        doc1.text(this.fours[0][13], x + 145, y);
        doc1.text(this.fours[0][15], x + 163, y);
        doc1.text(this.fours[0][17], x + 181, y);
        // doc1.text(this.fours[0][19], x + 199, y);
        doc1.text(String(this.fours[0][19]).substring(0, 10), x + 199, y);
        doc1.text("AUTRE", x + 217, y);
        doc1.text("TOTAL", x + 235, y);
        doc1.text("NBR_VST", x + 246, y);
        doc1.text("REPRESENTANT", x + 258, y);
        y = y + 2;
        // ligne horizontal
        doc1.line(1, y, 296, y);
        y = y + 5;
        doc1.setFontStyle("normal");
      }
    }
    // lignes vertical
    if (page === 1) {
      doc1.line(1, 12, 1, y - 6);
      doc1.line(296, 12, 296, y - 6);
    } else {
      doc1.line(1, 2, 1, y - 6);
      doc1.line(296, 2, 296, y - 6);
    }
    window.open(doc1.output("bloburl"), "_blank");
  }
  async excelExport(e) {
    let repDeno = "";
    if (this.selectedRepresant !== null) {
      if (this.selectedRepresant.deno !== null) {
        repDeno = this.selectedRepresant.deno;
      }
    }
    const excelExportProperties: ExcelExportProperties = {
      fileName: "ChiffAffReprFour" + repDeno + ".xlsx",
    };
    console.log(
      "ChiffAffReprFour" +
        String(this.selectedRepresant.deno).replace(".", "-") +
        ".xlsx"
    );
    this.grid.excelExport(excelExportProperties);
  }
  public onSearchRepresan(word: string, item: Represan): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  nouvelleSaisie() {
    this.showGrid = false;
    this.selectedRepresant = null;
  }
  async toPdf(e) {
    if (this.showGrid) {
      this.previsualiser(e);
    } else {
      await this.afficher(1, e);
      if (this.caData.length > 0) {
        this.previsualiser(e);
      }
    }
  }
  async toExcel(e) {
    if (this.showGrid) {
      this.excelExport(e);
    } else {
      await this.afficher(1, e);
      if (this.caData.length > 0) {
        this.excelExport(e);
      }
    }
  }
}
