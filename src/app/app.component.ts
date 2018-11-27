import { DrawService } from './services/draw.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Observable } from 'rxjs/Observable';
import { IAppState, DISCARD_SCALE, DRAW_SCALE, DRAW_RAGE, DRAW_SLUMBER, DRAW_STRIKE, Action, IDragon } from './store';
import { NgRedux, select } from 'ng2-redux';
import { Component, Pipe, PipeTransform, ViewChild, Inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

class ISettings {
  nPlayers: number;
  players: string[];
  scalesPerCrown: number;
} // ISettings

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild ("sidenav") sidenav: MatSidenav;
  @select ((s: IAppState) => s.logs) logs$: Observable<any>;
  @select ((s: IAppState) => s.pool) pool$: Observable<any>;
  optForm: FormGroup;

  constructor (private ngRedux: NgRedux<IAppState>, private drawService: DrawService) {
    
  } // constructor

  addPlayer () {
    (<FormArray>this.optForm.get ("players")).push (new FormControl ("", Validators.required));
  } // addPlayer

  removePlayer (index: number) {
    (<FormArray>this.optForm.get ("players")).removeAt (index);
  } // removePlayer

  openSettings () {
    let settings = this.state.settings;
    let players = this.state.players;
    this.optForm = new FormGroup ({
      players: new FormArray (players.map (player => new FormControl (player, Validators.required))),
      scalesPerCrown: new FormControl (settings.scalesPerCrown, [Validators.required, Validators.min (1), Validators.max(100)])
    }); // FormGroup
    this.sidenav.open ();
  } // openSettings

  closeSettings () {
    if (this.optForm.valid) {
      let optModel = this.optForm.value;
      this.ngRedux.dispatch (Action.saveOpt ([...optModel.players], optModel.scalesPerCrown));
      this.sidenav.close ();
      this.optForm = null;
    } // if
  } // closeSettings

  newRound () { this.drawService.newRound (); }
  drawToken () { this.drawService.draw (); }

  get state () { return this.ngRedux.getState (); }

} // AppComponent

@Pipe({name: 'times'})
export class TimesPipe implements PipeTransform {
  transform (value: number): any {
    const iterable = {};
    iterable[Symbol.iterator] = function* () {
      let n = 0;
      while (n < value) { yield ++n; }
    };
    return iterable;
  } // transform
} // TimesPipe

