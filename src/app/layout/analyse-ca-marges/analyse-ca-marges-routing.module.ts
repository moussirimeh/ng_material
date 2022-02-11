import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnalyseCaMargesComponent } from './analyse-ca-marges.component';

const routes: Routes = [
    {
        path: '',
        component: AnalyseCaMargesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalyseCaMargesRoutingModule {}
