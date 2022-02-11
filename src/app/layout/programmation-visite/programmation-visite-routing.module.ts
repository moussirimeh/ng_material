import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProgrammationVisiteComponent } from './programmation-visite.component';

const routes: Routes = [
    {
        path: '',
        component: ProgrammationVisiteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProgrammationVisiteRoutingModule {}
