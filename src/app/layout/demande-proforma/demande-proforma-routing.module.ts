import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemandeProformaComponent } from './demande-proforma.component';


const routes: Routes = [
    {
        path: '',
        component: DemandeProformaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DemandeProformaRoutingModule { }
