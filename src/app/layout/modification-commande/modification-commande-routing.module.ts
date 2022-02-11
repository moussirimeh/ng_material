import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModificationCommandeComponent } from './modification-commande.component';


const routes: Routes = [
    {
        path: '',
        component: ModificationCommandeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModificationCommandeRoutingModule { }
