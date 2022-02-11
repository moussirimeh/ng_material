import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommandeFourService } from '../services/commandeFour.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { CommandeFour } from '../services/commandeFour';
import { DetailCommandeFourService } from '../services/detailCommandeFour.service';
import { DetailCommandeFour } from '../services/detailCommandeFour';
import { CommandeService } from '../services/commande.service';
import { CommandService } from '../services/command.service';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';
setCulture('de-DE');
L10n.load({
  'de-DE': {
    grid: {
      EmptyRecord: [],
    },
  },
});
@Component({
  selector: 'app-annulation-commande',
  templateUrl: './annulation-commande.component.html',
  styleUrls: ['./annulation-commande.component.scss'],
})
export class AnnulationCommandeComponent implements OnInit {
  @ViewChild('gridCommande')
  public gridCommande: GridComponent;
  commandeFour: CommandeFour[] = [];
  commande: DetailCommandeFour[] = [];
  numero = '';
  devise;
  deno = '';
  adresse = '';
  ville = '';
  date: string;
  date_liv: string;
  codeFour = '';
  codeTransp: string;
  codeModeP: string;
  codeModeL: string;
  denoTransp: string;
  denoModeP: string;
  denoModeL: string;
  codeBNQ: string;
  denoBNQ: string;
  tot_cmd: string;
  md_cmd: string;
  cardShow = false;
  situation: string;
  blockedDocument = false;
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
    private commandeFourService: CommandeFourService,
    private commandeService: CommandeService,
    private commandService: CommandService,
    private detailCommandeFourService: DetailCommandeFourService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    document.getElementById('num').focus();
  }
  async valid_prof_num(e) {
    this.blockedDocument = true;
    if (this.numero.length > 0) {
      if (this.numero !== '0') {
        let tmp = '';
        for (let i = 0; i < 5 - this.numero.length; i++) {
          tmp = tmp + '0';
        }
        this.numero = tmp + this.numero;
      }
      await this.detailCommandeFourService
        .commandeFour(this.numero)
        .toPromise()
        .then((data) => {
          this.commande = data['_embedded'].detailCommandeFour;
          console.log('datail', data);
        });
      await this.commandeFourService
        .detailCommandeFour(this.numero)
        .toPromise()
        .then((data) => {
          this.commandeFour = data['_embedded'].commandeFour;
          console.log('d', data);
        });
      if (this.commande.length === 0) {
        this.msgs = 'COMMANDE FOURNISSEUR inéxistant !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('num').focus();
        this.ov.show(e, document.getElementById('num'));
      } else {
        if (this.commandeFour[0].purcmd === 'O') {
          this.situation =
            'TOTALEMENT LIVREE le ' +
            new Date(this.commandeFour[0].livcmd).toLocaleDateString('en-GB');
        } else if (this.commandeFour[0].purcmd === 'P') {
          this.situation =
            'PARTIELLEMENT LIVREE le ' +
            new Date(this.commandeFour[0].livcmd).toLocaleDateString('en-GB');
        } else {
          this.situation = 'NON LIVREE ';
        }
        this.deno = this.commandeFour[0].deno;
        this.ville = this.commandeFour[0].post;
        if (this.commandeFour[0].ville !== null) {
          this.ville = this.ville + ' ' + this.commandeFour[0].ville;
        }
        if (this.commandeFour[0].pays !== null) {
          this.ville = this.ville + ' ' + this.commandeFour[0].pays;
        }

        this.adresse = this.commandeFour[0].adresse;
        this.codeBNQ = this.commandeFour[0].bnqcmd;
        this.denoBNQ = this.commandeFour[0].bankdeno;
        this.codeFour = this.commandeFour[0].frscmd;
        this.codeModeL = this.commandeFour[0].lcmd;
        this.codeModeP = this.commandeFour[0].pcmd;
        this.codeTransp = this.commandeFour[0].tcmd;
        this.devise = this.commandeFour[0].devcmd;
        this.date = new Date(this.commandeFour[0].datcmd).toLocaleDateString('en-GB');
        this.denoModeL = this.commandeFour[0].modeldeno;
        this.denoModeP = this.commandeFour[0].modepdeno;
        this.denoTransp = this.commandeFour[0].transpdeno;
        this.date_liv = new Date(
          this.commandeFour[0].livcmd
        ).toLocaleDateString('en-GB');
        this.tot_cmd = this.commandeFour[0].totcmd;
        this.md_cmd = this.commandeFour[0].mdcmd;

        this.cardShow = true;
      }
    } else {
      this.msgs = 'Veillez saisir le numéro !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('num').focus();
      this.ov.show(e, document.getElementById('num'));
    }
    this.blockedDocument = false;
  }
  public alivre = (
    field: string,
    data: { qtecmd: number; livcmd: number },
    column: Object
  ) => {
    return data.qtecmd - data.livcmd;
  }
  async confirmer() {
    this.blockedDocument = true;
    await this.commandeService.removeByNumCmd(this.numero).toPromise().then();
    await this.commandService.removeByNumCmd(this.numero).toPromise().then();
    this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        this.numero
      )
      .subscribe((data) => {});
    this.numero = null;
    this.date = null;
    this.codeFour = null;
    this.deno = null;
    this.ville = null;
    this.adresse = null;
    this.codeBNQ = null;
    this.denoBNQ = null;
    this.codeModeL = null;
    this.codeModeP = null;
    this.codeTransp = null;
    this.devise = null;
    this.denoModeL = null;
    this.denoModeP = null;
    this.denoTransp = null;
    this.situation = null;
    this.date_liv = null;
    this.commandeFour = [];
    this.commande = [];
    this.cardShow = false;
    this.blockedDocument = false;
  }
  onBackspaceKeydown() {
    this.date = null;
    this.codeFour = null;
    this.deno = null;
    this.ville = null;
    this.adresse = null;
    this.codeBNQ = null;
    this.denoBNQ = null;
    this.codeModeL = null;
    this.codeModeP = null;
    this.codeTransp = null;
    this.devise = null;
    this.denoModeL = null;
    this.denoModeP = null;
    this.denoTransp = null;
    this.situation = null;
    this.date_liv = null;

    this.commandeFour = [];
    this.commande = [];
    this.cardShow = false;
  }
  annuler() {
    this.numero = null;
    this.date = null;
    this.codeFour = null;
    this.deno = null;
    this.ville = null;
    this.adresse = null;
    this.codeBNQ = null;
    this.denoBNQ = null;
    this.codeModeL = null;
    this.codeModeP = null;
    this.codeTransp = null;
    this.devise = null;
    this.denoModeL = null;
    this.denoModeP = null;
    this.denoTransp = null;
    this.situation = null;
    this.date_liv = null;
    this.commandeFour = [];
    this.commande = [];
    this.cardShow = false;
  }
}
