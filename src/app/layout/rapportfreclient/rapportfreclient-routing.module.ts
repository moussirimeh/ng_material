import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportfreclientComponent } from './rapportfreclient.component';

const routes: Routes = [
  {
  path: '',
  component : RapportfreclientComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportfreclientRoutingModule { }
