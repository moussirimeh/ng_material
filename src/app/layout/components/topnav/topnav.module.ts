import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatMenuModule,
  MatListModule,
} from '@angular/material';

// Imported Syncfusion menu module from navigations package.
import { MenuModule } from '@syncfusion/ej2-angular-navigations';
import { TopnavComponent } from './topnav.component';
import { TranslateModule } from '@ngx-translate/core';

import {DialogModule} from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    TranslateModule,
    MenuModule,
    DialogModule,
    FormsModule,
    OverlayPanelModule,
    InputTextModule,
    ButtonModule
  ], // Registering EJ2 Menu Module.
  declarations: [TopnavComponent],
  bootstrap: [TopnavComponent],
  exports: [TopnavComponent],
})
export class TopnavModule {}
