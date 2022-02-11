import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModificationBlComponent } from './modification-bl.component';


const routes: Routes = [
    {
        path: '',
        component: ModificationBlComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModificationBlRoutingModule { }
