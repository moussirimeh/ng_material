import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvoirSurAchatComponent } from './avoir-sur-achat.component';

const routes: Routes = [
  {
      path: '',
      component: AvoirSurAchatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvoirSurAchatRoutingModule { }
