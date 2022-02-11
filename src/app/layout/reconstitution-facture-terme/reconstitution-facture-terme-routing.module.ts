import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReconstitutionFactureTermeComponent } from './reconstitution-facture-terme.component';

const routes: Routes = [
    {
        path: '',
        component: ReconstitutionFactureTermeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReconstitutionFactureTermeRoutingModule {}
