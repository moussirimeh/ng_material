import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { GridAllModule, SearchService, ToolbarService} from '@syncfusion/ej2-angular-grids';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {CalendarModule} from 'primeng/calendar';

import { OffreArticleRoutingModule } from './offre-article-routing.module';
import { OffreArticleComponent } from './offre-article.component';

@NgModule({
  declarations: [OffreArticleComponent],
  imports: [
    FormModule,
    ReactiveFormsModule,
    CommonModule,
    GridModule,
    DialogModule,
    ButtonModule,
    NgSelectModule,
    GridAllModule,
    OverlayPanelModule,
    CalendarModule,
    OffreArticleRoutingModule
  ],
  providers: [ ExcelExportService, SearchService, ToolbarService ],
})
export class OffreArticleModule { }
