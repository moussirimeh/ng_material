import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DemandeDevisComponent } from './demande-devis.component';

const routes: Routes = [
    {
        path: '',
        component: DemandeDevisComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DemandeDevisRoutingModule {}
