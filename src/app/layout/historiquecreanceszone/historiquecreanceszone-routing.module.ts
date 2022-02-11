import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoriquecreanceszoneComponent } from './historiquecreanceszone.component';

const routes: Routes = [
  {
    path: '',
    component: HistoriquecreanceszoneComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoriquecreanceszoneRoutingModule { }
