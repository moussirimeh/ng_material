import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatCommandeClientComponent } from './etat-commande-client.component';



const routes: Routes = [
    {
        path: '',
        component: EtatCommandeClientComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EtatCommandeClientRoutingModule { }
