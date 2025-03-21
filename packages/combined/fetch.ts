import {
    proxy_query_api,
    proxy_query_code,
    proxy_query_combined,
    proxy_query_publisher,
} from '@jellypack/runtime/lib/canisters/storage';
import { ApiData, ApiDataAnchor } from '@jellypack/runtime/lib/store/api';
import { CodeData, CodeDataAnchor } from '@jellypack/runtime/lib/store/code';
import { Combined, CombinedAnchor } from '@jellypack/runtime/lib/store/combined';
import { DappView } from '@jellypack/runtime/lib/store/dapp';
import { Publisher, PublisherAnchor } from '@jellypack/runtime/lib/store/publisher';

export const fetch_data = async (
    dapp: DappView,
    upper_query_publisher?: (anchor: PublisherAnchor) => Promise<Publisher | undefined>,
    upper_query_code?: (anchor: CodeDataAnchor) => Promise<CodeData | undefined>,
    upper_query_api?: (anchor: ApiDataAnchor) => Promise<ApiData | undefined>,
    upper_query_combined?: (anchor: CombinedAnchor) => Promise<Combined | undefined>,
): Promise<
    [Combined, Publisher, [CodeDataAnchor, CodeData][], [ApiDataAnchor, ApiData][], [CombinedAnchor, Combined][]]
> => {
    const combined_promise = (upper_query_combined ?? proxy_query_combined)(dapp.combined).then((combined) => {
        if (!combined) throw new Error(`combined not found: ${dapp.combined}`);
        return combined;
    });
    const publisher_promise = (upper_query_publisher ?? proxy_query_publisher)(dapp.publisher).then((user) => {
        if (!user) throw new Error(`user not found: ${dapp.publisher}`);
        return user;
    });
    const code_promises = (dapp.metadata?.code_anchors ?? []).map(async (code_anchor) => {
        return (upper_query_code ?? proxy_query_code)(code_anchor).then((code) => {
            if (!code) throw new Error(`code not found: ${code_anchor}`);
            const result: [CodeDataAnchor, CodeData] = [code_anchor, code];
            return result;
        });
    });
    const apis_promises = (dapp.metadata?.apis_anchors ?? []).map(async (apis_anchor) => {
        return (upper_query_api ?? proxy_query_api)(apis_anchor).then((api) => {
            if (!api) throw new Error(`api not found: ${apis_anchor}`);
            const result: [ApiDataAnchor, ApiData] = [apis_anchor, api];
            return result;
        });
    });
    const dapp_promises = (dapp.metadata?.combined_anchors ?? []).map(async (combined_anchor) => {
        return (upper_query_combined ?? proxy_query_combined)(combined_anchor).then((combined) => {
            if (!combined) throw new Error(`combined not found: ${combined_anchor}`);
            const result: [CombinedAnchor, Combined] = [combined_anchor, combined];
            return result;
        });
    });

    return [
        await combined_promise,
        await publisher_promise,
        await Promise.all(code_promises),
        await Promise.all(apis_promises),
        await Promise.all(dapp_promises),
    ];
};
