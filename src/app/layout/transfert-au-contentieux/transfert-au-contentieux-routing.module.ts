import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransfertAuContentieuxComponent } from './transfert-au-contentieux.component';

const routes: Routes = [
    {
        path: '',
        component: TransfertAuContentieuxComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransfertAuContentieuxRoutingModule {}
