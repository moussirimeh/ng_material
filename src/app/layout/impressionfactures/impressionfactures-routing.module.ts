import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ImpressionFacturesComponent } from './impressionfactures.component';

const routes: Routes = [
    {
        path: '',
        component: ImpressionFacturesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImpressionFacturesRoutingModule {}
