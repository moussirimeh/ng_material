import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentesSuspensionTvaComponent } from './ventes-suspension-tva.component';


const routes: Routes = [
{
  path: '',
  component: VentesSuspensionTvaComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentesSuspensionTvaRoutingModule { }
