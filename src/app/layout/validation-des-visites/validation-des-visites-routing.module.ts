import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidationDesVisitesComponent } from './validation-des-visites.component';

const routes: Routes = [
  {
    path: '',
    component: ValidationDesVisitesComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidationDesVisitesRoutingModule { }
