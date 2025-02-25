import { LinkComponent } from '@jellypack/runtime/lib/model/components';

export const app_id = 2;
export const app_anchor = ''; // cspell:disable-line
export const name = 'Example 3: All components';
export const icon = 'https://file.easydapp.ai/image/5DSXiqXM0183c8e944.png';
export const combined: {
    version: string;
    components: LinkComponent[];
} = {
    version: '0.0.1',
    components: [
        {
            interaction: {
                id: 1,
                metadata: {
                    metadata: {
                        choose: {
                            values: [
                                {
                                    name: 'Option 1',
                                    value: {
                                        const: {
                                            text: 'option1',
                                        },
                                    },
                                },
                                {
                                    name: 'Option 2',
                                    value: {
                                        const: {
                                            text: 'option2',
                                        },
                                    },
                                },
                                {
                                    name: 'Option 3',
                                    value: {
                                        const: {
                                            text: 'option3',
                                        },
                                    },
                                },
                                {
                                    name: 'Option 4',
                                    value: {
                                        const: {
                                            text: 'option4',
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
        {
            interaction: {
                id: 2,
                metadata: {
                    metadata: {
                        choose_form: {
                            values: [
                                {
                                    name: 'Option 1',
                                    value: {
                                        const: {
                                            text: 'option1',
                                        },
                                    },
                                },
                                {
                                    name: 'Option 2',
                                    value: {
                                        const: {
                                            text: 'option2',
                                        },
                                    },
                                },
                                {
                                    name: 'Option 3',
                                    value: {
                                        const: {
                                            text: 'option3',
                                        },
                                    },
                                },
                                {
                                    name: 'Option 4',
                                    value: {
                                        const: {
                                            text: 'option4',
                                        },
                                    },
                                },
                            ],
                            confirm: 'Confirm',
                        },
                    },
                },
            },
        },
        {
            interaction: {
                id: 3,
                metadata: {
                    metadata: {
                        choose_tip: {
                            values: {
                                const: {
                                    array: {
                                        ty: 'text',
                                        values: [
                                            {
                                                text: 'Option 1',
                                            },
                                            {
                                                text: 'Option 2',
                                            },
                                            {
                                                text: 'Option 3',
                                            },
                                            {
                                                text: 'Option 4',
                                            },
                                        ],
                                    },
                                },
                            },
                            tips: {
                                const: {
                                    array: {
                                        ty: 'text',
                                        values: [
                                            {
                                                text: 'tips 1',
                                            },
                                            {
                                                text: 'tips 2',
                                            },
                                            {
                                                text: 'tips 3',
                                            },
                                            {
                                                text: 'tips 4',
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            interaction: {
                id: 4,
                metadata: {
                    metadata: {
                        choose_full: {
                            values: {
                                const: {
                                    array: {
                                        ty: {
                                            object: [
                                                {
                                                    key: 'option',
                                                    ty: 'text',
                                                },
                                                {
                                                    key: 'value',
                                                    ty: 'text',
                                                },
                                            ],
                                        },
                                        values: [
                                            {
                                                object: [
                                                    {
                                                        key: 'option',
                                                        value: {
                                                            text: 'Option 1',
                                                        },
                                                    },
                                                    {
                                                        key: 'value',
                                                        value: {
                                                            text: 'Value 1',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                object: [
                                                    {
                                                        key: 'option',
                                                        value: {
                                                            text: 'Option 2',
                                                        },
                                                    },
                                                    {
                                                        key: 'value',
                                                        value: {
                                                            text: 'Value 2',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                object: [
                                                    {
                                                        key: 'option',
                                                        value: {
                                                            text: 'Option 3',
                                                        },
                                                    },
                                                    {
                                                        key: 'value',
                                                        value: {
                                                            text: 'Value 3',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                object: [
                                                    {
                                                        key: 'option',
                                                        value: {
                                                            text: 'Option 4',
                                                        },
                                                    },
                                                    {
                                                        key: 'value',
                                                        value: {
                                                            text: 'Value 4',
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            form: {
                id: 5,
                output: 'text',
            },
        },
        {
            form: {
                id: 7,
                output: {
                    array: 'text',
                },
            },
        },
        {
            form: {
                id: 8,
                output: {
                    object: [],
                },
            },
        },
        {
            form: {
                id: 9,
                output: 'number',
            },
        },
        {
            form: {
                id: 10,
                output: 'bool',
            },
        },
        {
            form: {
                id: 11,
                output: 'integer',
            },
        },
        {
            view: {
                id: 6,
                metadata: {
                    table: {
                        value: {
                            const: {
                                object: [
                                    {
                                        key: 'headers',
                                        value: {
                                            array: {
                                                ty: 'text',
                                                values: [
                                                    {
                                                        text: 'header1',
                                                    },
                                                    {
                                                        text: 'header2',
                                                    },
                                                    {
                                                        text: 'header3',
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        key: 'rows',
                                        value: {
                                            array: {
                                                ty: {
                                                    array: 'text',
                                                },
                                                values: [
                                                    {
                                                        array: {
                                                            ty: 'text',
                                                            values: [
                                                                {
                                                                    text: 'row1.1',
                                                                },
                                                                {
                                                                    text: 'row1.2',
                                                                },
                                                                {
                                                                    text: 'row1.3',
                                                                },
                                                            ],
                                                        },
                                                    },
                                                    {
                                                        array: {
                                                            ty: 'text',
                                                            values: [
                                                                {
                                                                    text: 'row2.1',
                                                                },
                                                                {
                                                                    text: 'row2.2',
                                                                },
                                                                {
                                                                    text: 'row2.3',
                                                                },
                                                            ],
                                                        },
                                                    },
                                                    {
                                                        array: {
                                                            ty: 'text',
                                                            values: [
                                                                {
                                                                    text: 'row3.1',
                                                                },
                                                                {
                                                                    text: 'row3.2',
                                                                },
                                                                {
                                                                    text: 'row3.3',
                                                                },
                                                            ],
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        },
        {
            view: {
                id: 12,
                metadata: {
                    text: {
                        value: {
                            const: {
                                text: 'view text',
                            },
                        },
                    },
                },
            },
        },
        {
            view: {
                id: 13,
                metadata: {
                    bool: {
                        value: {
                            const: {
                                bool: true,
                            },
                        },
                    },
                },
            },
        },
        {
            view: {
                id: 14,
                metadata: {
                    image: {
                        value: {
                            const: {
                                text: 'https://gips2.baidu.com/it/u=1651586290,17201034&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f600_800',
                            },
                        },
                        href: {
                            const: {
                                text: 'https://easydapp.ai',
                            },
                        },
                    },
                },
            },
        },
        {
            call: {
                id: 15,
                metadata: {
                    ic: {
                        trigger: {
                            click: {
                                text: {
                                    const: {
                                        text: 'Call ic',
                                    },
                                },
                            },
                        },
                        action: {
                            call: {
                                canister_id: {
                                    const: {
                                        text: 'mhfds-gyaaa-aaaah-aq7yq-cai',
                                    },
                                },
                                api: {
                                    api: {
                                        origin: {
                                            candid: 'type Attribute = record { key : text; value : text };\ntype CanisterArgs = variant {\n  Upgrade : StateUpgradeArgs;\n  Init : StateInitArgs;\n};\ntype Environment = variant { Production; Test };\ntype NFT = record {\n  token_index : text;\n  canister_id : principal;\n  standard : text;\n};\ntype Result = variant { Ok : text; Err : text };\ntype Result_1 = variant { Ok : bool; Err : text };\ntype Result_2 = variant { Ok : UserInfo; Err : text };\ntype Result_3 = variant { Ok : principal; Err : text };\ntype Result_4 = variant { Ok; Err : text };\ntype StateInitArgs = record {\n  env : Environment;\n  owner : principal;\n  name : text;\n};\ntype StateUpgradeArgs = record {\n  env : opt Environment;\n  owner : opt principal;\n  name : opt text;\n};\ntype StatusRequest = record {\n  memory_size : bool;\n  cycles : bool;\n  heap_memory_size : bool;\n};\ntype StatusResponse = record {\n  memory_size : opt nat64;\n  cycles : opt nat64;\n  heap_memory_size : opt nat64;\n};\ntype UpdateUserInfo = record {\n  bio : opt text;\n  born : opt nat64;\n  handler : opt text;\n  website : opt text;\n  genre : opt text;\n  location : opt text;\n  avatar : opt text;\n};\ntype UserInfo = record {\n  bio : text;\n  nft : opt NFT;\n  pid : principal;\n  updated_at : nat64;\n  created : nat64;\n  vault : vec UserVaultInfo;\n  born : opt nat64;\n  handler : text;\n  email : text;\n  website : text;\n  genre : text;\n  location : text;\n  avatar : text;\n};\ntype UserVaultInfo = record { canister_id : principal; created_at : nat64 };\ntype WalletCanisterArgs = variant {\n  Upgrade : WalletUpgradeArgs;\n  Init : WalletInitArgs;\n};\ntype WalletInitArgs = record {\n  env : Environment;\n  ecdsa_key_name : text;\n  owner : principal;\n  name : text;\n  token_expiration : nat64;\n  init_default_tokens : bool;\n  schnorr_key_name : text;\n};\ntype WalletReceiveResult = record { accepted : nat64 };\ntype WalletUpgradeArgs = record {\n  env : opt Environment;\n  ecdsa_key_name : opt text;\n  owner : opt principal;\n  token_expiration : opt nat64;\n  schnorr_key_name : opt text;\n};\nservice : (opt CanisterArgs) -> {\n  __get_candid_interface_tmp_hack : () -> (text) query;\n  add_invite_code : (text) -> (Result);\n  add_user_attribute : (Attribute) -> (Result_1);\n  admin_login : (principal) -> (Result_2);\n  canister_get_status : (StatusRequest) -> (StatusResponse) query;\n  create_user_wallet : () -> (Result_3);\n  create_wallet_canister : (opt WalletCanisterArgs) -> (Result_3);\n  get_avatar : (opt principal) -> (text) query;\n  get_email : (opt principal) -> (text) query;\n  get_invite_codes : () -> (vec text) query;\n  get_user_count : () -> (nat64) query;\n  get_user_info : (principal) -> (opt UserInfo) query;\n  get_user_infos : (vec principal) -> (vec UserInfo) query;\n  get_user_infos_by_vault_ids : (vec principal) -> (vec UserInfo) query;\n  get_user_pids : () -> (vec principal) query;\n  get_user_vaults : (opt principal) -> (vec UserVaultInfo) query;\n  profile : () -> (opt UserInfo) query;\n  set_avatar : (text) -> (Result_1);\n  set_email : (text) -> (Result_1);\n  set_user_info : (UpdateUserInfo) -> (Result_1);\n  upgrade_wallet_canister : (principal, opt WalletCanisterArgs) -> (Result_4);\n  user_login : () -> (Result_2);\n  wallet_balance : () -> (nat) query;\n  wallet_receive : () -> (WalletReceiveResult);\n}',
                                            method: 'add_invite_code',
                                        },
                                    },
                                },
                                info: {
                                    module_hash: 'd2a229746536d9f460a17ccca1dbea55d1beb8a612b3048a40e3073a3553ea48',
                                    updated: 1740470974010,
                                },
                                arg: {
                                    code: {
                                        data: [],
                                        code: {
                                            code: {
                                                code: {
                                                    code: 'result = `Hello World!`;',
                                                },
                                                js: '',
                                            },
                                        },
                                    },
                                },
                                ret: {
                                    code: {
                                        code: {
                                            code: {
                                                code: 'result = `Hello World!`;',
                                            },
                                            js: '',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                output: 'text',
            },
        },
        {
            call: {
                id: 20,
                metadata: {
                    http: {
                        trigger: {
                            click: {
                                text: {
                                    const: {
                                        text: 'Call http',
                                    },
                                },
                            },
                        },
                        url: {
                            const: {
                                text: 'https://www.baidu.com',
                            },
                        },
                        method: 'GET',
                        parsed: 'json',
                        headers: [
                            {
                                name: 'test',
                                value: {
                                    const: {
                                        text: '',
                                    },
                                },
                            },
                        ],
                        post: {
                            code: {
                                code: {
                                    code: 'result = `Hello World!`;',
                                },
                                js: '',
                            },
                        },
                    },
                },
                output: 'text',
            },
        },
        {
            param: {
                id: 21,
                metadata: {
                    name: 'text',
                    default: 'global test data',
                },
            },
        },
        {
            const: {
                id: 22,
                metadata: {
                    value: {
                        text: '',
                    },
                },
                output: 'text',
            },
        },
        {
            const: {
                id: 23,
                metadata: {
                    value: {
                        integer: 0,
                    },
                },
                output: 'integer',
            },
        },
        {
            const: {
                id: 24,
                metadata: {
                    value: {
                        array: {
                            ty: 'text',
                            values: [],
                        },
                    },
                },
                output: {
                    array: 'text',
                },
            },
        },
        {
            const: {
                id: 25,
                metadata: {
                    value: {
                        object: [],
                    },
                },
                output: {
                    object: [],
                },
            },
        },
        {
            const: {
                id: 26,
                metadata: {
                    value: {
                        bool: false,
                    },
                },
                output: 'bool',
            },
        },
        {
            const: {
                id: 27,
                metadata: {
                    value: {
                        number: 0,
                    },
                },
                output: 'number',
            },
        },
    ],
};
