import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentFermBsComponent } from './vent-ferm-bs.component';

const routes: Routes = [
  {
    path: '',
    component: VentFermBsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentFermBsRoutingModule { }
