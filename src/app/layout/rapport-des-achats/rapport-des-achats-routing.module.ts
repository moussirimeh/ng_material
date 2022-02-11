import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportDesAchatsComponent } from './rapport-des-achats.component';

const routes: Routes = [
  {
    path: '',
    component: RapportDesAchatsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportDesAchatsRoutingModule { }
