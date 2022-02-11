import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FamillesComponent } from './familles.component';

const routes: Routes = [
    {
        path: '',
        component: FamillesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FamillesRoutingModule {}
