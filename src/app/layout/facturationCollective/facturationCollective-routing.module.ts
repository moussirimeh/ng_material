import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FacturationCollectiveComponent } from './facturationCollective.component';

const routes: Routes = [
    {
        path: '',
        component: FacturationCollectiveComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FacturationCollectiveRoutingModule {}
