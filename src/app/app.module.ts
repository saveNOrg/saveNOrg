import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTreeModule} from '@angular/material/tree';
import {MatTabsModule} from '@angular/material/tabs';
import { QuillModule } from 'ngx-quill'
import { FormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { NotesTreeComponent } from './component/navigation/navigation.component';
import { NotesDataComponent } from './component/data/data.component';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { FileEffects } from './effects/file.effects';

const  toolbar= [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
 
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
 
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
 
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
 
    ['clean'],                                         // remove formatting button
 
    ['link']                         // link and image, video
  ];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    NotesTreeComponent,
    NotesDataComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    MatTreeModule,
    MatTabsModule,
    QuillModule.forRoot({
      modules: {
        toolbar: toolbar
      },
      bounds: '#data_container'
    }),
    FormsModule,
    ResizableModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([FileEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
