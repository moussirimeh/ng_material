import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifTypoCltsComponent } from './modif-typo-clts.component';

const routes: Routes = [
  {
  path: '',
  component: ModifTypoCltsComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifTypoCltsRoutingModule { }
