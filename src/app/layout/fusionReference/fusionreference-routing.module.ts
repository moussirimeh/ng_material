import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FusionreferenceComponent } from './fusionreference.component';

const routes: Routes = [
    {
        path: '',
        component: FusionreferenceComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FusionreferenceRoutingModule { }
