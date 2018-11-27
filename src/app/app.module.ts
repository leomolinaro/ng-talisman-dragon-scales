import { DrawService } from './services/draw.service';
import { MessageDialog, MessageService } from './services/message.service';
import { IAppState, rootReducer, INITIAL_STATE } from './store';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { NgRedux, NgReduxModule, DevToolsExtension } from 'ng2-redux';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';


import { AppComponent, TimesPipe } from './app.component';
import { DragonComponent } from './dragon/dragon.component';

@NgModule({
  declarations: [
    AppComponent,
    TimesPipe,
    DragonComponent,
    MessageDialog,
  ],
  imports: [
    BrowserModule,
    NgReduxModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatGridListModule
  ],
  providers: [
    DrawService,
    MessageService
  ],
  entryComponents: [
    MessageDialog,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor (
    ngRedux: NgRedux<IAppState>,
    devTools: DevToolsExtension
  ) {
    let enhancers = isDevMode () ? [devTools.enhancer ()] : [];
    ngRedux.configureStore (rootReducer, INITIAL_STATE, [], enhancers);
  }
}
