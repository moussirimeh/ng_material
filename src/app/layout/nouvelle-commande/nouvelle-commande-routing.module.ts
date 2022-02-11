import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NouvelleCommandeComponent } from './nouvelle-commande.component';


const routes: Routes = [
    {
        path: '',
        component: NouvelleCommandeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NouvelleCommandeRoutingModule { }
