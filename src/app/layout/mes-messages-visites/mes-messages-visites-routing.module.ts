import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MesMessagesVisitesComponent } from './mes-messages-visites.component';

const routes: Routes = [
    {
        path: '',
        component: MesMessagesVisitesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MesMessagesVisitesRoutingModule {}
