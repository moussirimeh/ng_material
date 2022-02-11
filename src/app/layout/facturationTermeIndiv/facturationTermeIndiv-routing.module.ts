import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FacturationTermeIndivComponent } from './facturationTermeIndiv.component';

const routes: Routes = [
    {
        path: '',
        component: FacturationTermeIndivComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FacturationTermeIndivRoutingModule {}
