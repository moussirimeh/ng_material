import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepensesCaisseSecondaireComponent } from './depenses-caisse-secondaire.component';






const routes: Routes = [
    {
        path: '',
        component: DepensesCaisseSecondaireComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepensesCaisseSecondaireRoutingModule { }
