import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepensesCaissePrincipaleComponent } from './depenses-caisse-principale.component';






const routes: Routes = [
    {
        path: '',
        component: DepensesCaissePrincipaleComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepensesCaissePrincipaleRoutingModule { }
