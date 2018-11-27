import { IAppState, IAppAction } from './store';
import { tassign } from 'tassign';

export interface IAppState {
  varthrax: IDragon;
  cadorus: IDragon;
  grilipus: IDragon;
  pool: {
    scales: {
      varthrax: number;
      cadorus: number;
      grilipus: number;
    }; // dragonTokens
    strikes: number;
    rages: number;
    slumbers: number;
  }, // pool
  players: string[];
  settings: {
    scalesPerCrown: number,
    messagesLimit: number
  }, // settings
  logs: { 
    message: string,
    tokenSource: string,
  }[]
} // IAppState

export interface IDragon {
  id: string,
  name: string,
  crowned: boolean,
  nScales: number,
  imageSource: string,
  tokenSource: string
} // IDragon

export interface IAppAction {
  type: string;
  data?: any;
} // IAppAction

export const INITIAL_STATE: IAppState = {
  varthrax: {
    id: "varthrax",
    name: "Varthrax",
    crowned: false,
    nScales: 0,
    imageSource: "../assets/varthrax-image.jpg",
    tokenSource: "../assets/varthrax-token.png"
  }, // varthrax
  cadorus: {
    id: "cadorus",
    name: "Cadorus",
    crowned: false,
    nScales: 0,
    imageSource: "../assets/cadorus-image.jpg",
    tokenSource: "../assets/cadorus-token.png"
  }, // cadorus
  grilipus: {
    id: "grilipus",
    name: "Grilipus",
    crowned: false,
    nScales: 0,
    imageSource: "../assets/grilipus-image.jpg",
    tokenSource: "../assets/grilipus-token.png"
  }, // grilipus
  pool: {
    scales: {
      varthrax: 40,
      cadorus: 40,
      grilipus: 40,
    }, // dragonTokens
    strikes: 6,
    rages: 6,
    slumbers: 8,
  }, // pool
  players: ["Leo", "Nico", "Cesco", "Rob"],
  settings: {
    scalesPerCrown: 5,
    messagesLimit: 5
  }, // settings
  logs: [],
} // INITIAL_STATE

export const DISCARD_SCALE = "DISCARD_SCALE";
export const DRAW_SCALE = "DRAW_SCALE";
export const DRAW_STRIKE = "DRAW_STRIKE";
export const DRAW_RAGE = "DRAW_RAGE";
export const DRAW_SLUMBER = "DRAW_SLUMBER";
export const ADD_LOG = "ADD_LOG";
export const CLEAR_LOG = "CLEAR_LOG";
export const RESET_SCALE = "RESET_SCALE";
export const CROWN = "CROWN";
export const SAVE_OPT = "SAVE_OPT";

export function rootReducer (state: IAppState, action: IAppAction): IAppState {
  let executer = new Executer (state);
  switch (action.type) {
    case DISCARD_SCALE: return executer.discardScale (action.data.dragonId);
    case DRAW_SCALE: return executer.drawScale (action.data.dragonId, action.data.resolved);
    case DRAW_STRIKE: return executer.drawStrike ();
    case DRAW_RAGE: return executer.drawRage ();
    case DRAW_SLUMBER: return executer.drawSlumber ();
    case ADD_LOG: return executer.addLog (action.data.message, action.data.tokenSource);
    case CLEAR_LOG: return executer.clearLog ();
    case RESET_SCALE: return executer.resetScale (action.data.dragonId);
    case CROWN: return executer.crown (action.data.dragonId, action.data.crown);
    case SAVE_OPT: return executer.saveOpt (action.data.players, action.data.scalesPerCrown);
    default: return state;
  } // switch
} // rootReducer

export class Action {
  static discardScale (dragonId: string): IAppAction { return { type: DISCARD_SCALE, data: { dragonId: dragonId } } }
  static drawScale (dragonId: string, resolved: boolean): IAppAction { return { type: DRAW_SCALE, data: { dragonId: dragonId, resolved: resolved } } }
  static drawStrike (): IAppAction { return { type: DRAW_STRIKE } }
  static drawRage (): IAppAction { return { type: DRAW_RAGE } }
  static drawSlumber (): IAppAction { return { type: DRAW_SLUMBER } }
  static addLog (message: string, tokenSource: string): IAppAction { return { type: ADD_LOG, data: { message: message, tokenSource: tokenSource } } }
  static clearLog (): IAppAction { return { type: CLEAR_LOG } }
  static resetScale (dragonId: string): IAppAction { return { type: RESET_SCALE, data: { dragonId: dragonId } } }
  static crown (dragonId: string, crown: boolean): IAppAction { return { type: CROWN, data: { dragonId: dragonId, crown: crown } } }
  static saveOpt (players: string[], scalesPerCrown: number): IAppAction { return { type: SAVE_OPT, data: { players: players, scalesPerCrown: scalesPerCrown } } }
} // Action

class Executer {

  constructor (private state: IAppState) {}

  saveOpt (players: string[], scalesPerCrown: number): IAppState {
    return { ...this.state,
      players: players,
      settings: { ...this.state.settings, scalesPerCrown: scalesPerCrown}
    } // return
  } // saveOpt

  resetScale (dragonId: string): IAppState {
    switch (dragonId) {
      case "varthrax": return { ...this.state, varthrax: { ...this.state.varthrax, nScales: 0 } };
      case "cadorus": return { ...this.state, cadorus: { ...this.state.cadorus, nScales: 0 } };
      case "grilipus": return { ...this.state, grilipus: { ...this.state.grilipus, nScales: 0 } };
      default: return this.state;
    } // switch
  } // resetScale

  crown (dragonId: string, crown: boolean): IAppState {
    switch (dragonId) {
      case "varthrax": return { ...this.state, varthrax: { ...this.state.varthrax, crowned: crown } };
      case "cadorus": return { ...this.state, cadorus: { ...this.state.cadorus, crowned: crown } };
      case "grilipus": return { ...this.state, grilipus: { ...this.state.grilipus, crowned: crown } };
      default: return this.state;
    } // switch
  } // crown

  addLog (message: string, tokenSource: string): IAppState {
    return { ...this.state,
      logs: [...this.state.logs, { message: message, tokenSource: tokenSource } ]
    } // return
  } // addLog

  clearLog (): IAppState {
    return { ...this.state,
      logs: []
    } // return
  } // clearLog

  discardScale (dragonId: string): IAppState {
    switch (dragonId) {
      case "varthrax": return { ...this.state, varthrax: { ...this.state.varthrax, nScales: this.state.varthrax.nScales - 1 } };
      case "cadorus": return { ...this.state, cadorus: { ...this.state.cadorus, nScales: this.state.cadorus.nScales - 1 } };
      case "grilipus": return { ...this.state, grilipus: { ...this.state.grilipus, nScales: this.state.grilipus.nScales - 1 } };
      default: return this.state;
    } // switch
  } // discardScale

  drawStrike (): IAppState {
    return { ...this.state,
      pool: { ...this.state.pool, strikes: this.state.pool.strikes - 1 }
    } // return
  } // drawStrike

  drawRage (): IAppState {
    return { ...this.state,
      pool: { ...this.state.pool, rages: this.state.pool.rages - 1 }
    }; // return
  } // drawRage

  drawSlumber (): IAppState {
    return { ...this.state,
      pool: { ...this.state.pool, slumbers: this.state.pool.slumbers - 1 }
    }; // return
  } // drawSlumber

  drawScale (dragonId: string, resolved: string): IAppState {
    switch (dragonId) {
      case "varthrax":
        return { ...this.state,
          varthrax: { ...this.state.varthrax, nScales: (this.state.varthrax.nScales + (resolved ? 1 : 0)) },
          pool: { ...this.state.pool,
            scales: { ...this.state.pool.scales, varthrax: this.state.pool.scales.varthrax - 1 }
          } // pool
        }; // return
      case "cadorus": 
        return { ...this.state,
          cadorus: { ...this.state.cadorus, nScales: (this.state.cadorus.nScales + (resolved ? 1 : 0)) },
          pool: { ...this.state.pool,
            scales: { ...this.state.pool.scales, cadorus: this.state.pool.scales.cadorus - 1 }
          } // pool
        }; // return
      case "grilipus":
        return { ...this.state,
          grilipus: { ...this.state.grilipus, nScales: (this.state.grilipus.nScales + (resolved ? 1 : 0)) },
          pool: { ...this.state.pool,
            scales: { ...this.state.pool.scales, grilipus: this.state.pool.scales.grilipus - 1 }
          } // pool
        }; // return
    } // switch
    return this.state;
  } // drawScale

} // Executer