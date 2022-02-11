import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteDupBsComponent } from './vente-dup-bs.component';

const routes: Routes = [
  {
    path: '',
    component: VenteDupBsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteDupBsRoutingModule { }
