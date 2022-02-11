import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FicheClientComponent } from './fiche-client.component';

const routes: Routes = [
  {
    path: '',
    component: FicheClientComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FicheClientRoutingModule { }
