import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecettesCaissePrincipaleComponent } from './recettes-caisse-principale.component';





const routes: Routes = [
    {
        path: '',
        component: RecettesCaissePrincipaleComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecettesCaissePrincipaleRoutingModule { }
