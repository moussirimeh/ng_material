import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppurementReglementComponent } from './appurement-reglement.component';



const routes: Routes = [
    {
        path: '',
        component: AppurementReglementComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppurementReglementRoutingModule { }
