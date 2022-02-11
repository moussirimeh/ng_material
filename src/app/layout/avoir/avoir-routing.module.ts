import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvoirComponent } from './avoir.component';


const routes: Routes = [
    {
        path: '',
        component: AvoirComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AvoirRoutingModule { }
