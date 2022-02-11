import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlEnCoursRoutingModule } from './bl-en-cours-routing.module';
import { BlEnCoursComponent } from './bl-en-cours.component';
import { CheckboxModule } from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import { GridModule, SortService } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ButtonModule} from 'primeng/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule as FormModule} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DuplicataModule } from '../duplicata/duplicata.module';

@NgModule({
  declarations: [BlEnCoursComponent],
  imports: [
    CommonModule,
    CheckboxModule,
    NgSelectModule ,
    ButtonModule,
    InputTextModule,
    OverlayPanelModule,
    GridModule,
    CalendarModule,
    FormModule,
    DialogModule,
    BlEnCoursRoutingModule,
    DuplicataModule,

  ],
  providers: [SortService]
})
export class BlEnCoursModule { }
