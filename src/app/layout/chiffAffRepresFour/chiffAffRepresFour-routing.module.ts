import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChiffAffRepresFourComponent } from './chiffAffRepresFour.component';

const routes: Routes = [
    {
        path: '',
        component: ChiffAffRepresFourComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChiffAffRepresFourRoutingModule {}
