import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportreservationComponent } from './rapportreservation.component';

const routes: Routes = [
  {
    path: '',
    component :RapportreservationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportreservationRoutingModule { }
