import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BlackPageRoutingModule } from './black-page-routing.module';
import { BlackPageComponent } from './black-page.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
    imports: [CommonModule, BlackPageRoutingModule,OverlayPanelModule],
    declarations: [BlackPageComponent]
})
export class BlackPageModule {}
