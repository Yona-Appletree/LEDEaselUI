import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StripPreviewComponent } from "./strip-preview/strip-preview.component";
import { MatSliderModule } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";
import { LdColorFunc2PreviewComponent } from "./ld-colorfunc2-preview/ld-colorfunc2-preview.component";
import { TimelineEditorComponent } from "./timeline-editor/timeline-editor.component";

@NgModule({
  declarations: [
    AppComponent,
    LdColorFunc2PreviewComponent,
    StripPreviewComponent,
    TimelineEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
