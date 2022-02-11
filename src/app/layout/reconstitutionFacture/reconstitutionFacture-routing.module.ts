import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReconstitutionFactureComponent } from './reconstitutionFacture.component';

const routes: Routes = [
    {
        path: '',
        component: ReconstitutionFactureComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReconstitutionFactureRoutingModule {}
