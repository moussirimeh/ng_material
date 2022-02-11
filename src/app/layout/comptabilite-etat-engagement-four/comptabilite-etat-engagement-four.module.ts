import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import {  GridAllModule} from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {FieldsetModule} from 'primeng/fieldset';



import { ComptabiliteEtatEngagementFourRoutingModule } from './comptabilite-etat-engagement-four-routing.module';
import { ComptabiliteEtatEngagementFourComponent } from './comptabilite-etat-engagement-four.component';

@NgModule({
  declarations: [ComptabiliteEtatEngagementFourComponent],
  imports: [
    CommonModule,
    FieldsetModule,
    MessageModule,
    MessagesModule,
    InputTextModule,
    GridModule,
    GridAllModule,
    CalendarModule,
    CommonModule,
    OverlayPanelModule,
    StatModule,
    ToastModule ,
    FormsModule,
    NgSelectModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    ComptabiliteEtatEngagementFourRoutingModule
  ]
})
export class ComptabiliteEtatEngagementFourModule { }
