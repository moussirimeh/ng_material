import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReleveClientComponent } from './releveClient.component';

const routes: Routes = [
    {
        path: '',
        component: ReleveClientComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReleveClientRoutingModule {}
