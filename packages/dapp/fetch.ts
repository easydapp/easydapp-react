import { proxy_query_dapp_access_by_id, proxy_query_dapp_by_token } from '@jellypack/runtime/lib/canisters/storage';
import { DappView } from '@jellypack/runtime/lib/store/dapp';
import { DappAccessView, DappVerified } from '@jellypack/runtime/lib/store/dapp/access';

export const fetch_dapp_access = async (
    share_id: string,
    query_dapp_access?: (id: string) => Promise<DappAccessView | undefined>,
    query_dapp?: (id: string, verified?: DappVerified) => Promise<DappView | undefined>,
): Promise<DappAccessView> => {
    if (!dapp_caching[share_id])
        fetch_dapp(share_id, undefined, query_dapp).catch(() => {
            /* do nothing */
        }); // caching

    const access = await (query_dapp_access ?? proxy_query_dapp_access_by_id)(share_id);
    if (access === undefined) throw new Error(`can not find dapp access by ${share_id}`);
    return access;
};

const dapp_caching: Record<string, { dapp?: DappView }> = {};

export const fetch_dapp = async (
    share_id: string,
    verified?: DappVerified,
    query_dapp?: (id: string, verified?: DappVerified) => Promise<DappView | undefined>,
): Promise<DappView> => {
    let cached = dapp_caching[share_id];
    while (cached && !cached.dapp) {
        await new Promise((resolve) => setTimeout(resolve, 33));
        cached = dapp_caching[share_id];
    }

    if (cached?.dapp) return cached.dapp;

    dapp_caching[share_id] = {};

    const dapp = await (query_dapp ?? proxy_query_dapp_by_token)(share_id, verified);

    if (dapp === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete dapp_caching[share_id];
        throw new Error(`can not find dapp by ${share_id}`);
    }
    if (dapp.frozen !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete dapp_caching[share_id];
        throw new Error(`dapp is frozen: ${share_id}`);
    }

    dapp_caching[share_id] = { dapp };

    return dapp;
};
