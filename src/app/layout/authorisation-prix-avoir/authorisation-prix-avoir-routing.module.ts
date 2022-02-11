import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorisationPrixAvoirComponent } from './authorisation-prix-avoir.component';

const routes: Routes = [
  {
    path: '',
    component: AuthorisationPrixAvoirComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorisationPrixAvoirRoutingModule { }
