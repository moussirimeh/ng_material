import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlavoirBlNonRecuComponent } from './blavoir-bl-non-recu.component';

const routes: Routes = [
  {path: '',
  component : BlavoirBlNonRecuComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlavoirBlNonRecuRoutingModule { }
