import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnulationProformaComponent } from './annulation-proforma.component';



const routes: Routes = [
    {
        path: '',
        component: AnnulationProformaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnnulationProformaRoutingModule { }
