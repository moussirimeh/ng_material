import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangementreferenceComponent } from './changementreference.component';

const routes: Routes = [
    {
        path: '',
        component: ChangementreferenceComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChangementreferenceRoutingModule { }
