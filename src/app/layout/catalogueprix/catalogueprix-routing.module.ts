import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueprixComponent } from './catalogueprix.component';


const routes: Routes = [
    {
        path: '',
        component: CatalogueprixComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogueprixRoutingModule { }
