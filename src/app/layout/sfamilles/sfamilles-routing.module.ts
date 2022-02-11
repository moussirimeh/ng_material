import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SfamillesComponent } from './sfamilles.component';

const routes: Routes = [
    {
        path: '',
        component: SfamillesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SfamillesRoutingModule {}
