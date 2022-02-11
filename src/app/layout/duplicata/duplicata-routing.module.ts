import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DuplicataComponent } from './duplicata.component';

const routes: Routes = [
    {
        path: '',
        component: DuplicataComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DuplicataRoutingModule {}
