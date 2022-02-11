import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EnregistrementVisiteComponent } from './enregistrement-visite.component';

const routes: Routes = [
    {
        path: '',
        component: EnregistrementVisiteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnregistrementVisiteRoutingModule {}
