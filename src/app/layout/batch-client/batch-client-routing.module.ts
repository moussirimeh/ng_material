import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatchClientComponent } from './batch-client.component';

const routes: Routes = [
  {
      path: '',
      component: BatchClientComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchClientRoutingModule { }
