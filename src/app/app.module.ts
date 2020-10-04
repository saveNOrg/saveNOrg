import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTreeModule} from '@angular/material/tree';
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
    QuillModule.forRoot(),
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
