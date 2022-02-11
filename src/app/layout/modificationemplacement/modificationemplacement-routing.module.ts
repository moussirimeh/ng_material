import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModificationemplacementComponent } from './modificationemplacement.component';

const routes: Routes = [
  {
    path: '',
    component : ModificationemplacementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModificationemplacementRoutingModule { }
