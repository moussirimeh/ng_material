import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisiteAntConsultComponent } from './visite-ant-consult.component';

const routes: Routes = [
    {
        path: '',
        component: VisiteAntConsultComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisiteAntConsultRoutingModule {}
