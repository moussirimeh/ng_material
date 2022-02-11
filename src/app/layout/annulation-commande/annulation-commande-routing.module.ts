import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnulationCommandeComponent } from './annulation-commande.component';



const routes: Routes = [
    {
        path: '',
        component: AnnulationCommandeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnnulationCommandeRoutingModule { }
