import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceptionBlAvFactComponent } from './reception-bl-av-fact.component';

const routes: Routes = [
  {
    path: '',
    component : ReceptionBlAvFactComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceptionBlAvFactRoutingModule { }
