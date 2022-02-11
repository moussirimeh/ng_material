import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EtatTvaComponent } from './etat-tva.component';

const routes: Routes = [
    {
        path: '',
        component: EtatTvaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EtatTvaRoutingModule {}
