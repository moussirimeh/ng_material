import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReglementClientContComponent } from './reglement-client-cont.component';





const routes: Routes = [
    {
        path: '',
        component: ReglementClientContComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReglementClientContRoutingModule { }
