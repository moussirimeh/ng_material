import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { OverlayPanel } from 'primeng/primeng';
import { CaisseService } from '../services/caisse.service';
import { BanqueService } from '../services/banque.service';
import * as jspdf from 'jspdf';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-reimpression-bord',
  templateUrl: './reimpression-bord.component.html',
  styleUrls: ['./reimpression-bord.component.scss']
})
export class ReimpressionBordComponent implements OnInit {
  codeBord: string;
  ngselectDisabled: boolean;
  @ViewChild('op')
  public op: OverlayPanel;
  wasInside: any;
  msg;
  typeBord = '1';
  liste: any[];
  banques: any[];
  societe: string;
  compte: any;
  datver: any;
  constructor(private caisseService: CaisseService,
              private banqueService: BanqueService ) { }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }
 async ngOnInit() {
    this.codeBord = '';
    this.ngselectDisabled = false;
    await this.banqueService.getBanque()
    .toPromise()
    .then(data => {
       console.log(data);
       this.banques = data['_embedded'].banque;
       console.log(this.banques);
});
  }
  async gererPdf(e) {
    // 1=> cheque
    //
    this.wasInside = false;
    this.liste  = new Array();
         if (this.typeBord === '1' || this.typeBord === '4' || this.typeBord === '5') {
              await this.caisseService.reImpressionBord(this.codeBord, '0', '0')
                .toPromise()
                .then(data => {
                  console.log('re impression  1, 4 , 5 ', data);
                   this.liste = data['_embedded'].caisses;
                });
         } else {
          if (this.typeBord === '6') {
            await this.caisseService.reImpressionBord( '0', '0', this.codeBord)
            .toPromise()
            .then(data => {
              console.log('re impression 6 ', data);
              this.liste = data['_embedded'].caisses;
            });
          } else {
            await this.caisseService.reImpressionBord( '0', this.codeBord, '0' )
            .toPromise()
            .then(data => {
              console.log('re impression 2, 3 ', data);
              this.liste = data['_embedded'].caisses;
            });
          }
         }




        console.log('liste avec modif banque ', this.liste);
        if (this.liste.length > 0) {
          let mnt = 0;
          const nb = 0;

          for (const c of this.liste) {
           for (const obj of this.banques) {
           if (obj.code === c.banqEqm) {
             c.banqEqm = obj.deno;
             this.compte = obj.compte;
             break;
           }
         }
          mnt = mnt + Number(c.montant);

         }
          const doc1 = new jspdf();
          doc1.setFontSize(12);
          doc1.setFontStyle('Arial');
           this.societe = '';
           if (globals.societe !== null && globals.societe !== undefined) {
            this.societe = globals.societe;
           }

          doc1.text('SOCIETE...: ' + this.societe, 10, 15);
          doc1.setFontSize(12);
          doc1.setFontStyle('Arial');
         // doc1.setTextColor(48, 48, 48);

          let bnq = '';
          if (this.compte === undefined || this.compte === null) {
            this.compte  = '';
          }
          if (this.liste[0].banqEqm !== undefined) {
            bnq = this.liste[0].banqEqm;
            if (this.liste[0].datRec !== null && this.liste[0].datRec !== undefined ) {
              this.datver = this.liste[0].datRec;
            } else {
              this.datver = this.liste[0].datVer;
            }

          } else {
            bnq = '';
            this.datver = '';
          }


          doc1.text('BANQUE........:' + bnq , 10, 27);
          doc1.text('N° de compte..: ' + this.compte , 10, 33);

         // doc1.setFontSize(20);
        //  doc1.setFontStyle('bold');
        // doc1.setTextColor(0, 51, 153);
         doc1.setFontStyle('bold');
          let type = '';
         if (this.typeBord === '1') {
          type = 'Depot de ';

         }
         if (this.typeBord === '1'  && this.liste[0].mode === 'TRAITE') {
          type = 'Depot à L-Encaissement  ';

         }
         if (this.typeBord === '2' ) {
          type = 'Bordereau Encaissement ';

         }
         if (this.typeBord === '3' ) {
          type = 'Bordereau Retour Impayé  ' ;

         }

         if (this.typeBord === '4' ) {
          type = 'Bordereau Factoring  ' ;
         }

         if (this.typeBord === '5' ) {
          type = 'Depot à L-Escompte  '  ;
         }
         if (this.typeBord === '6' ) {
          type =  'Bordereau Retour Fact/Banque  ';

         }
         doc1.text('Tunis, le  ' +  String(this.datver).substring(0, 10) , 160, 20);
         doc1.text(type  , 50, 40);
         const L: number = this.codeBord.length;
         let code = '';
         switch (L) {
           case 1:
            code = '000000' +  this.codeBord;
             break;

           case 2:
            code = '00000' +  this.codeBord;

             break;
           case 3:
            code = '0000' +  this.codeBord;

             break;
           case 4:
            code = '000' +  this.codeBord;
             break;
           case 5:
            code = '00' +  this.codeBord;
             break;
             case 6:
              code = '0' +  this.codeBord;
               break;

           default:
            code = this.codeBord;
             break;
         }
         doc1.text('N° ' + code  , 160, 40);

    let indice = 'TRAITES';
    if (this.liste[0].mode === 'CHEQUE' ) {
      /* if query1.FieldByName('piece').asstring = 'CHEQUE' then
          begin
            rep_bor_vers.QRDBText4.width := 0;
            rep_bor_vers.QRLabel6.width := 0;
            rep_bor_vers.QRDBText4.AutoSize := false;
            rep_bor_vers.QRLabel6.autosize := false;
            rep_bor_vers.QRLabel8.Caption := 'CHEQUES'
          end;*/
      indice = 'CHEQUES';

    }
    doc1.text(indice, 120, 40);



  // entete du  tableau
  doc1.setFontStyle('Arial');
  doc1.setFontSize(12);
  doc1.line(9, 45, 205, 45);
  doc1.setFontSize(10);

  doc1.text('', 10, 50);
  doc1.text('Banque', 20, 50);
  doc1.text('Tiré', 40, 50);
  doc1.text('N° de Pièce', 100, 50);
  doc1.text('Code client', 130, 50);
  doc1.text('Echeance', 160, 50);
  doc1.text('Montant', 180, 50);
  // creer la ligne
  doc1.setFontStyle('Arial');
  doc1.setFontSize(10);
  doc1.line(9, 53, 205, 53);
let index = 0;
let y = 57;
let numPage = 1;
this.liste = this.liste.sort(function(a, b) {
  return a.cheque > b.cheque ? 1 : a.cheque < b.cheque ? -1 : 0;
});
console.log('liste triée ', this.liste  );

  for (const obj of this.liste) {
    index = index + 1;

      doc1.text(index.toFixed(0)  , 10, y);

    if (obj.banque !== null && obj.banque !== undefined ) {
      doc1.text(obj.banque  , 20, y);
    } else {
      doc1.text(''  , 20, y);
    }


    if (obj.tire !== null && obj.tire !== undefined ) {
      doc1.text(obj.tire  , 40, y);
    } else {
      doc1.text(''  , 40, y);
    }

    if (obj.cheque !== null && obj.cheque !== undefined ) {
      doc1.text(obj.cheque  , 100, y);
    } else {
      doc1.text(''  , 100, y);
    }

    if (obj.operateur !== null && obj.operateur !== undefined ) {
      doc1.text(obj.operateur  , 130, y);
    } else {
      doc1.text(''  , 130, y);
    }

    if (obj.ech !== null && obj.ech !== undefined ) {
      doc1.text(obj.ech  , 160, y);
    } else {
      doc1.text(''  , 160, y);
    }
    if (obj.montant !== null && obj.montant !== undefined ) {
      doc1.text(obj.montant  , 199, y, 'right');
    } else {
      doc1.text(''  , 199, y, 'right');
    }
       y = y + 7;

      // doc1.line(9, y - 4 , 205, y - 4 );
     //  doc1.line(9, y - 4 , 205, y - 4 );
          // premiere page
      if ((numPage === 1) && y < 277 ) {
       doc1.line(9, 45, 9, y );
       doc1.line(205, 45, 205, y );
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);


     }
     if (numPage > 1 && y < 277) {
       doc1.line(9, 12, 9, y + 4);
       doc1.line(205, 12, 205, y + 4);
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

     }
     if (numPage > 1 && y > 277) {
       doc1.line(9, 12, 9, y + 4);
       doc1.line(205, 12, 205, y + 4);
      // doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

     }

     if (y > 277) {
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

       numPage++;
       doc1.addPage();
       doc1.line(9, 12, 205, 12);
      doc1.setFontSize(10);

      doc1.text('', 10, 17);
      doc1.text('Banque', 20, 17);
      doc1.text('Tiré', 40, 17);
      doc1.text('N° de Pièce', 90, 17);
      doc1.text('Code client', 130, 17);
      doc1.text('Echeance', 160, 17);
      doc1.text('Montant', 180, 17);

      // creer la ligne
      doc1.setFontStyle('Arial');
      doc1.line(9, 20, 205, 20);

      y = 26;
        }

  }


  if (y < 240) {

    doc1.setFontSize(12);
    doc1.line(9, y, 205, y);
    doc1.setFontStyle('bold');
    doc1.setFontSize(10);
 //
   // doc1.text('Nombre des pièces :1 ' + y.toFixed(0), 9, y + 5 );
    doc1.text('Nombre des pièces : ' + index.toFixed(0), 9, y + 5);
    doc1.text('Toal : ' + mnt.toFixed(3), 180, y + 5);
    y = y + 15;
    doc1.setFontSize(16);
    doc1.text('Signatures ', 170, y);
  } else {
    if (y > 240) {
      doc1.setFontSize(12);
      doc1.line(9, y, 205, y);
      numPage++;
      doc1.addPage();
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

       y = 14 ;
       doc1.line(9, y - 2, 205, y - 2 , 'FD');
      doc1.setFontStyle('Arial');
      doc1.setFontStyle('bold');
      doc1.setFontSize(10);
      y = y + 5;

      doc1.text('Nombre des pièces :2 ' + y.toFixed(0), 9, y );

  //  doc1.text('Nombre des pièces : ' + index.toFixed(0), 9, y );
    doc1.text('Toal : ' + mnt.toFixed(3), 180, y );
    }
  }

                 //  const numPage = 1;
                  doc1.setLineWidth(0.2);
                  doc1.setFontSize(10);
                  doc1.setFontStyle('Arial');
                 doc1.line(10, 280, 205, 280, 'FD');
                 doc1.setFontStyle('Arial');
                 doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                 window.open(doc1.output('bloburl'), '_blank');

                } else {
                  this.wasInside = true;
                  this.msg = 'Aucun Bordereau trouvé  ! ';
                  this.op.show(e);
                }

      }


  }


