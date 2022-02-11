import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnregistrementBonCommandeComponent } from './enregistrement-bon-commande.component';

const routes: Routes = [
  {
    path: '',
    component: EnregistrementBonCommandeComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnregistrementBonCommandeRoutingModule { }
