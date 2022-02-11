import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquivalenceComponent } from './equivalence.component';

const routes: Routes = [
    {
        path: '',
        component: EquivalenceComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EquivalenceRoutingModule {}
