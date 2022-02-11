import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { EnregActRecouvMultRoutingModule } from './enreg-act-recouv-mult-routing.module';
import { EnregActRecouvMultComponent } from './enreg-act-recouv-mult.component';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { GridModule } from '@angular/flex-layout';
import { ToastModule } from 'primeng/toast';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { InputTextModule } from 'primeng/inputtext';


import {   MatInputModule, MatFormFieldModule } from '@angular/material';

import { GridAllModule, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
@NgModule({
  declarations: [EnregActRecouvMultComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    CalendarModule,
    MatInputModule,
    MatFormFieldModule,
    GridModule,
    ToastModule,
    MessageModule,
    InputTextModule,
    MessagesModule,
    FormModule,
    GridAllModule,
    ReactiveFormsModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    EnregActRecouvMultRoutingModule
  ],
  providers: [
    SearchService,
    ToolbarService,
]
})
export class EnregActRecouvMultModule { }
