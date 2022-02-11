import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeuilleCaisseSecondaireComponent } from './feuille-caisse-secondaire.component';





const routes: Routes = [
    {
        path: '',
        component: FeuilleCaisseSecondaireComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeuilleCaisseSecondaireRoutingModule { }
