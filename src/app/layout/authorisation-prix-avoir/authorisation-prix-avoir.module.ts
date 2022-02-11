import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {BlockUIModule} from 'primeng/blockui';
import { AuthorisationPrixAvoirRoutingModule } from './authorisation-prix-avoir-routing.module';
import { AuthorisationPrixAvoirComponent } from './authorisation-prix-avoir.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AuthorisationPrixAvoirComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    OverlayPanelModule,
    BlockUIModule,
    ButtonModule,
    AuthorisationPrixAvoirRoutingModule
  ]
})
export class AuthorisationPrixAvoirModule { }
