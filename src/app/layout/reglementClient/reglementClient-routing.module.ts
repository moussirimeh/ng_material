import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReglementClientComponent } from './reglementClient.component';




const routes: Routes = [
    {
        path: '',
        component: ReglementClientComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReglementClientRoutingModule { }
