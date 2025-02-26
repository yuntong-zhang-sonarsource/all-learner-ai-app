import * as wasm from "./indicasr_wasm_bg.wasm";
export * from "./indicasr_wasm_bg.js";
import { __wbg_set_wasm } from "./indicasr_wasm_bg.js";
__wbg_set_wasm(wasm);