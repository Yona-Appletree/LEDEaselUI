import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LdAnimationPreviewComponent } from './ld-animation-preview/ld-animation-preview.component';
import { StripPreviewComponent } from './strip-preview/strip-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    LdAnimationPreviewComponent,
    StripPreviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
