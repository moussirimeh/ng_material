import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import {FormsModule} from '@angular/forms';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { StatModule } from '../../shared/modules/stat/stat.module';
import {CalendarModule} from 'primeng/calendar';
import {FieldsetModule} from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { FicheVendeurRoutingModule } from './fiche-vendeur-routing.module';
import { FicheVendeurComponent } from './fiche-vendeur.component';
import {ToolbarModule} from 'primeng/toolbar';
import {PanelModule} from 'primeng/panel';
import { SortService} from '@syncfusion/ej2-angular-grids';
import { AggregateService } from '@syncfusion/ej2-angular-grids';

@NgModule({
  declarations: [FicheVendeurComponent],
  imports: [
    CommonModule,
    PanelModule,
    RadioButtonModule,
    ButtonModule,
    FlexLayoutModule,
    ToolbarModule,
    OverlayPanelModule,
    GridModule,
    FormsModule,
    StatModule,
    FicheVendeurRoutingModule,
    CalendarModule,
    FieldsetModule
  ] ,
  providers: [SortService, AggregateService]
})
export class FicheVendeurModule { }
