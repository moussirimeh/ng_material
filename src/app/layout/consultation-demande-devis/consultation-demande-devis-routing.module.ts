import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationDemandeDevisComponent } from './consultation-demande-devis.component';




const routes: Routes = [
    {
        path: '',
        component: ConsultationDemandeDevisComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsultationDemandeDevisRoutingModule { }
