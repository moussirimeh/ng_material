import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeuilleCaissePrincipaleComponent } from './feuille-caisse-principale.component';





const routes: Routes = [
    {
        path: '',
        component: FeuilleCaissePrincipaleComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeuilleCaissePrincipaleRoutingModule { }
