import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationRefRoutingModule } from './consultation-ref-routing.module';
import { ConsultationRefComponent } from './consultation-ref.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputTextModule} from 'primeng/inputtext';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [ConsultationRefComponent],
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
    MatButtonModule
  ]
})
export class ConsultationRefModule { }
