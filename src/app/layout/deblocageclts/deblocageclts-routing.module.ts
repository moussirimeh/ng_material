import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeblocagecltsComponent } from './deblocageclts.component';
// wiwi tafker win t3mel module jdid  tzid routes w path///
const routes: Routes = [
  {
    path: '',
    component : DeblocagecltsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeblocagecltsRoutingModule { }
