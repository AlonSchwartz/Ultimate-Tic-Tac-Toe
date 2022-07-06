import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { UltimateBoardComponent } from './ultimate-board/ultimate-board.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    UltimateBoardComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
