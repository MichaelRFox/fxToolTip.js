import {create, remove} from './fxTip.js';
import {getTipByElementId} from './tip.js';
import {tipOptions} from './options.js';
import {suspend} from './mouse.js';

let globalOptions = new tipOptions(true);

export default {create, remove, getTipByElementId, globalOptions, suspend};