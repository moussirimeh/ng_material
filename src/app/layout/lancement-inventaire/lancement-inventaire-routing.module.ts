import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LancementInventaireComponent } from './lancement-inventaire.component';

const routes: Routes = [
    {
        path: '',
        component: LancementInventaireComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LancementInventaireRoutingModule {}
