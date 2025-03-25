import { ComponentId } from '@jellypack/runtime/lib/model/common/identity';
import { component_identity_get_connect, ComponentIdentity } from '@jellypack/runtime/lib/model/components/identity';
import { CombinedRuntime } from '@jellypack/runtime/lib/runtime';
import { useEffect, useState } from 'react';

import Button from '../common/button';

export function ComponentIdentityView({
    runtime,
    link,
    updated,
    identity,
    calling,
}: {
    runtime: CombinedRuntime;
    link: ComponentId;
    updated: number;
    identity: ComponentIdentity;
    calling: number;
}) {
    // const component = runtime.component(link);
    // console.debug(`🚀 ~ component:`, component);

    const [text, setText] = useState<string>();
    const [value, setValue] = useState(false);

    useEffect(() => {
        if (runtime.should_show(link)) {
            const connect = component_identity_get_connect(identity);
            if (connect) {
                const text = runtime.input_value<string>(connect, ['text']);
                setText(text);
            }
        } else {
            setText(undefined);
        }

        setValue(!!runtime.find_value(link, 0)?.value);

        runtime.update_component(link, updated); // Directly update
    }, [runtime, link, identity, updated]);

    const onTrigger = () => {
        runtime.refresh(false, link);
    };

    const [loading, setLoading] = useState(false);
    const [loaded] = useState(new Set<ComponentId>());
    useEffect(() => {
        if (runtime.get_connect(link)) return setLoading(true);
        const info = runtime.get_component_info(link);
        if (info.triggered_components !== undefined) {
            for (const id of info.triggered_components) {
                if (runtime.get_call(id)?.calling) {
                    loaded.add(id);
                    return setLoading(true);
                }
            }
            if (loaded.size && loaded.size < info.triggered_components.size) return setLoading(true);
        }
        return setLoading(false);
    }, [runtime, link, calling, loaded]);

    // if (!runtime.should_show(link)) return <></>; // No interface itself
    if (text) {
        if (!value || loading) return <Button loading={loading} onClick={onTrigger} buttonText={text}></Button>;
    }
    return <></>;
}
