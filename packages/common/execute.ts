import { CodeExecutor } from '@jellypack/runtime/lib/wasm';
import { execute_code } from '@jellypack/wasm-api';
import * as Comlink from 'comlink';

export const execute_code_by_comlink: CodeExecutor = async (
    code: string,
    args: [string, any][],
    debug: boolean,
): Promise<any> => {
    const s = Date.now();

    const remoteFunction: any = Comlink.wrap(new Worker('/worker.js'));
    const result = await remoteFunction(Comlink.proxy(execute_code), code, args, debug);

    const e = Date.now();

    console.error('comlink spend', e - s, 'ms', result);

    return result;
};
