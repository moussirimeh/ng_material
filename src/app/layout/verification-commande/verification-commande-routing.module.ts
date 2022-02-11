import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificationCommandeComponent } from './verification-commande.component';

const routes: Routes = [
  {
    path: '',
    component: VerificationCommandeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationCommandeRoutingModule { }
