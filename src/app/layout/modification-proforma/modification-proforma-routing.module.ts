import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModificationProformaComponent } from './modification-proforma.component';


const routes: Routes = [
    {
        path: '',
        component: ModificationProformaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModificationProformaRoutingModule { }
