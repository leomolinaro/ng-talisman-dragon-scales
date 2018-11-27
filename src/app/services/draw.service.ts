import { MessageService } from './message.service';
import { IAppState, IDragon, Action } from './../store';
import { MatDialogRef } from '@angular/material/dialog';
import { NgRedux } from 'ng2-redux';
import { Injectable } from '@angular/core';

abstract class TokenResolver {
  constructor (protected ngRedux: NgRedux<IAppState>, protected messager: MessageService) {};
  abstract drawSlumber (player: string): void;
  abstract drawRage (player: string): void;
  abstract drawStrike (player: string): void;
  abstract drawScale (dragonId: string, player: string): void;
  get state () { return this.ngRedux.getState (); }
  get king (): IDragon {
    if (this.state.varthrax.crowned) {
      return this.state.varthrax;
    } else if (this.state.cadorus.crowned) {
      return this.state.cadorus;
    } else if (this.state.grilipus.crowned) {
      return this.state.grilipus;
    } else {
      return null;
    } // if - else
  } // king
  drawToken (player: string) {
    let pool = this.state.pool;
    let poolSize = pool.scales.varthrax + pool.scales.cadorus + pool.scales.grilipus + pool.rages + pool.slumbers + pool.strikes;
    let x = Math.floor (Math.random() * poolSize);
    let limit = pool.scales.varthrax;
    if (x < limit) {
      this.drawScale ("varthrax", player);
    } else {
      limit += pool.scales.cadorus;
      if (x < limit) {
        this.drawScale ("cadorus", player);
      } else {
        limit += pool.scales.grilipus;
        if (x < limit) {
          this.drawScale ("grilipus", player);
        } else {
          limit += pool.rages;
          if (x < limit) {
            this.drawRage (player);
          } else {
            limit += pool.slumbers;
            if (x < limit) {
              this.drawSlumber (player);
            } else {
              limit += pool.strikes;
              if (x < limit) {
                this.drawStrike (player);
              } // if
            } // if - else
          } // if - else
        } // if - else
      } // if - else
    } // if - else
  } // drawsToken
} // TokenResolver

class CompleteTokenResolver extends TokenResolver {
  drawSlumber (player: string): void {
    this.ngRedux.dispatch (Action.drawSlumber ());
    this.ngRedux.dispatch (Action.addLog (player + " draws a slumber token.", "../assets/slumber-token.png"));
    this.messager.alert (player + " draws a slumber token.", "../assets/slumber-token.png");
  } // drawSlumber
  drawRage (player: string): void {
    this.ngRedux.dispatch (Action.drawRage ());
    this.ngRedux.dispatch (Action.addLog (player + " draws a rage token.", "../assets/rage-token.png"));
    let king = this.king;
    if (king) { this.messager.alert (player + " undergoes " + this.king.name + "'s rage.", "../assets/rage-token.png"); }
  } // drawRage
  drawStrike (player: string): void {
    this.ngRedux.dispatch (Action.drawStrike ());
    this.ngRedux.dispatch (Action.addLog (player + " draws a strike token.", "../assets/strike-token.png"))
    this.drawToken (player);
    this.drawToken (player);
  } // drawStrike
  drawScale (dragonId: string, player: string): void {
    let dragon: IDragon = this.state[dragonId];
    this.ngRedux.dispatch (Action.drawScale (dragonId, true));
    this.ngRedux.dispatch (Action.addLog (player + " draws a " + dragon.name + " scale.", dragon.tokenSource));
    if (this.state[dragonId].nScales >= this.state.settings.scalesPerCrown) {
      this.ngRedux.dispatch (Action.resetScale (dragonId));
      let oldKing = this.king;
      if (oldKing) { this.ngRedux.dispatch (Action.crown (oldKing.id, false)); }
      this.ngRedux.dispatch (Action.crown (dragonId, true));
      this.messager.alert (player + " generates a " + dragon.name + "'s scale.", dragon.tokenSource);
    } // if
  } // drawScale
} // CompleteTokenResolver

class AskTokenResolver extends TokenResolver {
  drawSlumber (player: string): void {
    this.ngRedux.dispatch (Action.drawSlumber ());
    this.messager.alert (player + " draws a slumber token.", "../assets/slumber-token.png");
  } // drawSlumber
  drawRage (player: string): void {
    this.ngRedux.dispatch (Action.drawRage ());
    let king = this.king;
    if (king) {
      this.messager.confirm (player + " draws a rage token.", "../assets/rage-token.png", "Resolve the token?")
      .subscribe (confirm => {
        if (confirm) {
          this.messager.alert (player + " undergoes " + this.king.name + "'s rage.", "../assets/rage-token.png");
        } // if
      }); // subscribe
    } else {
      this.messager.alert (player + " draws a rage token.", "../assets/rage-token.png");
    } // if - else
  } // drawRage
  drawStrike (player: string): void {
    this.ngRedux.dispatch (Action.drawStrike ());
    this.messager.confirm (player + " draws a strike token.", "../assets/strike-token.png", "Resolve the token?")
    .subscribe (confirm => {
      if (confirm) {
        this.drawToken (player);
        this.drawToken (player);
      } // if
    }); // subscribe
  } // drawStrike
  drawScale (dragonId: string, player: string): void {
    let dragon: IDragon = this.state[dragonId];
    this.messager.confirm (player + " draws a " + dragon.name + " token.", dragon.tokenSource, "Resolve the token?")
    .subscribe (confirm => {
      this.ngRedux.dispatch (Action.drawScale (dragonId, confirm));
      if (confirm) {
        if (this.state[dragonId].nScales >= this.state.settings.scalesPerCrown) {
          this.ngRedux.dispatch (Action.resetScale (dragonId));
          let oldKing = this.king;
          if (oldKing) { this.ngRedux.dispatch (Action.crown (oldKing.id, false)); }
          this.ngRedux.dispatch (Action.crown (dragonId, true));
          this.messager.alert (player + " generates a " + dragon.name + "'s scale.", dragon.tokenSource);
        } // if
      } // if
    }); // subscribe
  } // drawScale
} // CompleteTokenResolver

@Injectable()
export class DrawService {
  
  private completeTokenResolver: TokenResolver;
  private askTokenResolver: TokenResolver;

  constructor (private ngRedux: NgRedux<IAppState>, public messager: MessageService) {
    this.completeTokenResolver = new CompleteTokenResolver (ngRedux, messager);
    this.askTokenResolver = new AskTokenResolver (ngRedux, messager);
  } // constructor

  newRound () {
    this.ngRedux.dispatch (Action.clearLog ());
    for (let player of this.state.players) {
      this.completeTokenResolver.drawToken (player);
    } // for
  } // newRound

  draw () {
    this.askTokenResolver.drawToken ("Player");
  } // draw

  get state () { return this.ngRedux.getState (); }

} // DrawService
