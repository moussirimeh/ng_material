import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyseChiffAffComponent } from './analyse-chiff-aff.component';

const routes: Routes = [
  {
      path: '',
      component: AnalyseChiffAffComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyseChiffAffRoutingModule { }
