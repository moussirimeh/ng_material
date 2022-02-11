import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApurementRegtsCmptComponent } from './apurement-regts-cmpt.component';




const routes: Routes = [
    {
        path: '',
        component: ApurementRegtsCmptComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApurementRegtsCmptRoutingModule { }
