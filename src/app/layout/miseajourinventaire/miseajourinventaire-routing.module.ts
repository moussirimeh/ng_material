import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiseajourinventaireComponent } from './miseajourinventaire.component';

const routes: Routes = [
  {
    path: '',
    component : MiseajourinventaireComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiseajourinventaireRoutingModule { }
