import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesMessagesEnvRoutingModule } from './mes-messages-env-routing.module';
import { MesMessagesEnvComponent } from './mes-messages-env.component';

@NgModule({
  declarations: [MesMessagesEnvComponent],
  imports: [
    CommonModule,
    MesMessagesEnvRoutingModule
  ]
})
export class MesMessagesEnvModule { }
