import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnulationBLComponent } from './annulation-bl.component';

const routes: Routes = [
  {
    path: '',
    component: AnnulationBLComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnulationBLRoutingModule { }
