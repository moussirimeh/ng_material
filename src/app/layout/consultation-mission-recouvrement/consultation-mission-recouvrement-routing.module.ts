import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationMissionRecouvrementComponent } from './consultation-mission-recouvrement.component';

const routes: Routes = [
    {
        path: '',
        component: ConsultationMissionRecouvrementComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsultationMissionRecouvrementRoutingModule {}
