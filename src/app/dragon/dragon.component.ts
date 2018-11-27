import { IAppState, IDragon, DISCARD_SCALE, Action } from './../store';
import { Component, OnInit, Input } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'dragon',
  templateUrl: './dragon.component.html',
  styleUrls: ['./dragon.component.css']
})
export class DragonComponent implements OnInit {

  @Input () dragonId: string;
  dragon$: Observable<IDragon>;

  constructor (private ngRedux: NgRedux<IAppState>) { }

  ngOnInit () {
    this.dragon$ = this.ngRedux.select ((s: IAppState) => {
      switch (this.dragonId) {
        case "varthrax": return s.varthrax;
        case "cadorus": return s.cadorus;
        case "grilipus": return s.grilipus;
      } // switch
    }); // select
  } // ngOnInit

  discardScale () {
    this.ngRedux.dispatch (Action.discardScale (this.dragonId));
  } // discardScale

} // DragonComponent
