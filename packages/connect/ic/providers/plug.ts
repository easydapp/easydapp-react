// import { Agent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
// import { getActorCreatorByAgent } from '@jellypack/runtime/lib/model/components/identity/ic/identity';
import { PlugInterface } from '@jellypack/runtime/lib/model/components/identity/ic/plug';
//import { ActorCreator } from '@jellypack/runtime/lib/model/components/identity/ic/types';
import { principal2account_id } from '@jellypack/types/lib/open/open-ic';
import { err, ok } from 'neverthrow';

import plugLogoDark from './svg/plug-dark.min.svg';
import plugLogoLight from './svg/plug-light.min.svg';
import { ConnectError, CreateActorError, DisconnectError, InitError } from './types';

// const getActorCreatorByPlug = (plug: PlugInterface): ActorCreator => {
//     return async (idlFactory: IDL.InterfaceFactory, canisterId: string) => {
//         return await plug.createActor({
//             canisterId,
//             interfaceFactory: idlFactory,
//         });
//     };
// };

export class CustomPlugWallet {
    public meta = {
        features: ['wallet'],
        icon: {
            light: plugLogoLight,
            dark: plugLogoDark,
        },
        id: 'plug',
        name: 'Plug Wallet',
    };

    #config: {
        whitelist: string[];
        host: string;
        dev: boolean;
    };
    #identity?: any;
    #principal?: string;
    #client?: any;
    #ic?: PlugInterface;
    #wallet?: {
        principal: string;
        accountId: string;
    };
    // #agent?: Agent;

    get identity() {
        return this.#identity;
    }

    get wallets() {
        return this.#wallet ? [this.#wallet] : [];
    }

    get principal() {
        return this.#principal;
    }

    get client() {
        return this.#client;
    }

    get ic() {
        return this.#ic;
    }

    constructor(userConfig: { whitelist?: string[]; host?: string } = {}) {
        this.#config = {
            whitelist: [],
            host: window.location.origin,
            dev: false,
            ...userConfig,
        };
        this.#ic = (window as any).ic?.plug;
        console.error('plug', this.#ic);
    }

    set config(config: { whitelist?: string[]; host?: string }) {
        this.#config = { ...this.#config, ...config };
    }

    get config() {
        return this.#config;
    }

    // initialization
    async init() {
        // console.error('plug init');
        // TO DO: handle account switching
        try {
            if (!this.#ic) {
                return err({ kind: InitError.NotInstalled });
            }
            const status = await this.status(); // Obtain state

            console.warn('plug provider init status', status, this.#ic);

            if (status !== 'disconnected' && status !== 'locked') {
                // console.warn('plug createAgent');
                // await this.#ic.createAgent({
                //     host: this.#config.host,
                //     whitelist: this.#config.whitelist,
                // });
                // await this.#ic!.disconnect();
                // await this.#ic!.requestConnect({
                //     whitelist: [],
                //     timeout: 60000,
                // });
            }
            if (status === 'connected') {
                // Never finishes if locked
                // this.#principal = (await this.#ic.getPrincipal()).toString(); // ! This method is always wrong
                // this.#wallet = {
                //     principal: this.#principal,
                //     accountId: this.#ic.accountId,
                // };

                if (!this.#ic.agent) {
                    return err({ kind: InitError.InitFailed });
                }

                this.#principal = (await this.#ic.agent.getPrincipal()).toText();
                this.#wallet = {
                    principal: this.#principal,
                    accountId: principal2account_id(this.#principal),
                };

                console.warn('plug status connected', this.#wallet);
                return ok({ isConnected: true });
            }
            return ok({ isConnected: false });
        } catch (e) {
            console.error(e);
            return err({ kind: InitError.InitFailed });
        }
    }

    // Obtain state
    async status(): Promise<'connected' | 'disconnected' | 'locked'> {
        // console.error('plug status');
        if (!this.#ic) {
            return 'disconnected';
        }
        try {
            // let returned = false;
            const start = Date.now();
            const isConnected = await this.#ic.isConnected();
            console.error('plug isConnected', isConnected);
            return await Promise.race<'connected' | 'disconnected' | 'locked'>([
                this.#ic.isConnected().then((connected) => {
                    const end = Date.now();
                    console.warn('plug status spend', end - start, 'ms', connected);
                    // if (returned && connected) location.reload();
                    return connected ? 'connected' : 'disconnected';
                }),
                new Promise((resolve) =>
                    setTimeout(() => {
                        // returned = true;
                        resolve('locked'); // Return directly in 2 seconds
                    }, 2000),
                ),
            ]);
        } catch (e: any) {
            console.error('get plug status failed', e);
            this.#ic.disconnect();
            return 'disconnected';
        }
    }

    // Whether to connect
    async isConnected() {
        // console.error('plug isConnected');
        try {
            if (!this.#ic) return false;
            if (this.#ic.isWalletLocked) return false; // ! Calling IsConnect will cause pop -up windows to hover when Locked
            return await this.#ic.isConnected();
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // Create ACTOR
    async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory) {
        // console.error('plug createActor');
        if (!this.#ic || !this.#ic.createActor) {
            return err({ kind: CreateActorError.NotInitialized });
        }
        try {
            // Fetch root key for certificate validation during development
            // if (this.#config.dev) {
            //     const res = await this.#ic.agent
            //         .fetchRootKey()
            //         .then(() => ok(true))
            //         .catch(() => err({ kind: CreateActorError.FetchRootKeyFailed }));
            //     if (res.isErr()) {
            //         return res;
            //     }
            // }

            // use plug default creator
            const actor = await this.#ic.createActor<Service>({
                canisterId,
                interfaceFactory: idlFactory,
            });

            // const creator = getActorCreatorByAgent(this.#agent ?? (this.#ic.agent as any));
            // // const creator = getActorCreatorByPlug(this.#ic);
            // const actor = await creator<Service>(idlFactory as unknown as any, canisterId);
            return ok(actor);
        } catch (e) {
            console.error(e);
            return err({ kind: CreateActorError.CreateActorFailed });
        }
    }

    // connect
    async connect() {
        // console.error('plug connect');
        try {
            if (!this.#ic) {
                window.open('https://plugwallet.ooo/', '_blank');
                return err({ kind: ConnectError.NotInstalled });
            }

            return new Promise((resolve, reject) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.#ic!.requestConnect({
                    whitelist: [],
                    timeout: 60000,
                })
                    .then((publicKey) => {
                        console.debug('got plug public key', publicKey);
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const agent = this.#ic!.agent;
                        if (!agent) throw new Error('agent must be valid.');
                        // this.#agent = agent;
                        return agent.getPrincipal();
                    })
                    .then((owner) => {
                        console.debug(`🚀 ~ CustomPlugWallet ~ .then ~ owner:`, owner);
                        this.#principal = owner.toText();
                        this.#wallet = {
                            principal: this.#principal,
                            accountId: principal2account_id(this.#principal),
                        };
                        return ok(true);
                    })
                    .then(resolve)
                    .catch((error: any) => {
                        // Error: The agent creation was rejected. // Click directly to return this
                        console.error('Connect plug Failed:', `${error}`);
                        reject(error);
                    });
            });
        } catch (e) {
            console.error(e);
            // message.error(`connection failed`);
            return err({ kind: ConnectError.ConnectFailed });
        }
    }

    // disconnect
    async disconnect() {
        // console.error('plug disconnect');
        try {
            if (!this.#ic) {
                return err({ kind: DisconnectError.NotInitialized });
            }
            // TO DO: should be awaited but never finishes, tell Plug to fix
            this.#ic.disconnect(); // ! Always report an error
            return ok(true);
        } catch (e) {
            console.error(e);
            return err({ kind: DisconnectError.DisconnectFailed });
        }
    }
}
