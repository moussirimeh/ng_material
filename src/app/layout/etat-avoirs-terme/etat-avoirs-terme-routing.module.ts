import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatAvoirsTermeComponent } from './etat-avoirs-terme.component';

const routes: Routes = [
  {
    path: '',
    component: EtatAvoirsTermeComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatAvoirsTermeRoutingModule { }
