/* tslint:disable */
/* eslint-disable */
/**
 * @param {Uint8Array} audio_file
 * @returns {Array<any>}
 */
export function run_preprocessor(audio_file: Uint8Array): Array<any>;
/**
 * @param {Array<any>} logprobs
 * @param {Uint32Array} shape
 * @param {Array<any>} vocab_arr
 * @param {number} offset
 * @param {number} actual_vocab_size
 * @returns {Array<any>}
 */
export function decode_logprobs(logprobs: Array<any>, shape: Uint32Array, vocab_arr: Array<any>, offset: number, actual_vocab_size: number): Array<any>;
/**
 * @param {Array<any>} logits
 * @param {Uint32Array} shape
 * @param {Array<any>} vocab_arr
 * @param {number} offset
 * @param {number} actual_vocab_size
 * @param {number} topk
 * @returns {Array<any>}
 */
export function decode_logprobs_topk(logits: Array<any>, shape: Uint32Array, vocab_arr: Array<any>, offset: number, actual_vocab_size: number, topk: number): Array<any>;
