import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { ConsultationreferenceRoutingModule } from './consultationreference-routing.module';
import { ConsultationreferenceComponent } from './consultationreference.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/primeng';
@NgModule({
  declarations: [ConsultationreferenceComponent],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule ,
    TabViewModule,
    NgSelectModule,
    GridModule ,
    ConsultationreferenceRoutingModule,
    InputTextModule
  ]
})
export class ConsultationreferenceModule { }
