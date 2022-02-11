import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationReglementClientComponent } from './consultation-reglement-client.component';




const routes: Routes = [
    {
        path: '',
        component: ConsultationReglementClientComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsultationReglementClientRoutingModule { }
