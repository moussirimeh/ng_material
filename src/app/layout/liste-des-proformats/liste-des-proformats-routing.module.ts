import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListeDesProformatsComponent } from './liste-des-proformats.component';

const routes: Routes = [
  {
    path: '',
    component: ListeDesProformatsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListeDesProformatsRoutingModule { }
