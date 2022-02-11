import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjustementReferenceComponent } from './ajustementReference.component';

const routes: Routes = [
    {
        path: '',
        component: AjustementReferenceComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AjustementReferenceRoutingModule {}
