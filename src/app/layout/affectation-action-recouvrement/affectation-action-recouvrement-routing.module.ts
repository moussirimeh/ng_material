import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AffectationActionRecouvrementComponent } from './affectation-action-recouvrement.component';

const routes: Routes = [
    {
        path: '',
        component: AffectationActionRecouvrementComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AffectationActionRecouvrementRoutingModule {}
