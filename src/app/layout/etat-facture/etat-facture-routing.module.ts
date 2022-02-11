import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EtatFactureComponent } from './etat-facture.component';

const routes: Routes = [
    {
        path: '',
        component: EtatFactureComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EtatFactureRoutingModule {}
