import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModifTypoCltsComponent} from './modif-typo-clts.component';
import { ModifTypoCltsRoutingModule } from './modif-typo-clts-routing.module';
import {ButtonModule} from 'primeng/button';
import {GridModule} from '@syncfusion/ej2-angular-grids';
import {FormsModule as FormModule } from '@angular/forms';
import {NgSelectModule } from '@ng-select/ng-select';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
  declarations: [ModifTypoCltsComponent],
  imports: [
    CommonModule,
    ButtonModule,
    GridModule,
    FormModule,
    NgSelectModule,
    ModifTypoCltsRoutingModule,
    OverlayPanelModule
  ]
})
export class ModifTypoCltsModule { }
