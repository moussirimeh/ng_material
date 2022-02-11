import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListeBlEncoursComponent } from './liste-bl-encours.component';

const routes: Routes = [
    {
        path: '',
        component: ListeBlEncoursComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListeBlEncoursRoutingModule {}
