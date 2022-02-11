import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarquesComponent } from './marques.component';

const routes: Routes = [
    {
        path: '',
        component: MarquesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MarquesRoutingModule {}
