import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsAnnApurtsCmptComponent } from './cons-ann-apurts-cmpt.component';





const routes: Routes = [
    {
        path: '',
        component: ConsAnnApurtsCmptComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsAnnApurtsCmptRoutingModule { }
