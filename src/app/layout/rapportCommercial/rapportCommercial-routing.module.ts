import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RapportCommercialComponent } from './rapportCommercial.component';

const routes: Routes = [
    {
        path: '',
        component: RapportCommercialComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RapportCommercialRoutingModule {}
