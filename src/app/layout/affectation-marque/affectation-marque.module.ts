import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationRefRoutingModule } from './affectation-marque-routing.module';
import { AffectationMarqueComponent } from './affectation-marque.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputTextModule} from 'primeng/inputtext';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
  declarations: [AffectationMarqueComponent],
  imports: [
    CommonModule,
    InputTextareaModule,
    InputTextModule,
    ConsultationRefRoutingModule,
    GridModule,
    FormModule,
    ButtonModule,
    TabViewModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    OverlayPanelModule
  ]
})
export class AffectationMarqueModule { }
