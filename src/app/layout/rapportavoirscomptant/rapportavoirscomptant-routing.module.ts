import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportavoirscomptantComponent } from './rapportavoirscomptant.component';

const routes: Routes = [
  {
    path: '',
    component : RapportavoirscomptantComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportavoirscomptantRoutingModule { }
