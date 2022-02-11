import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConsultationVisiteComponent } from './consultation-visite.component';

const routes: Routes = [
    {
        path: '',
        component: ConsultationVisiteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsultationVisiteRoutingModule {}
