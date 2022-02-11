import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnulationOffreComponent } from './annulation-offre.component';



const routes: Routes = [
    {
        path: '',
        component: AnnulationOffreComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnnulationOffreRoutingModule { }
