import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecettesCaisseSecondaireComponent } from './recettes-caisse-secondaire.component';





const routes: Routes = [
    {
        path: '',
        component: RecettesCaisseSecondaireComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecettesCaisseSecondaireRoutingModule { }
