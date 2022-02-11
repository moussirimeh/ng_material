import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcheanceChequeComponent } from './echeance-cheque.component';

const routes: Routes = [
  {
    path: '',
    component: EcheanceChequeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcheanceChequeRoutingModule { }
