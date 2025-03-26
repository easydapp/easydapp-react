import { match_component_call_trigger } from '@jellypack/runtime/lib/model/common/call_trigger';
import { ComponentId } from '@jellypack/runtime/lib/model/common/identity';
import { component_call_get_trigger, ComponentCall } from '@jellypack/runtime/lib/model/components/call';
import { CombinedRuntime } from '@jellypack/runtime/lib/runtime';
import { useEffect, useState } from 'react';

import Button from '../common/button';

export function ComponentCallView({
    runtime,
    link,
    updated,
    call,
    calling,
}: {
    runtime: CombinedRuntime;
    link: ComponentId;
    updated: number;
    call: ComponentCall;
    calling: number;
}) {
    const [text, setText] = useState<string>();

    const trigger = component_call_get_trigger(call);
    const [loading, setLoading] = useState(false);

    const onTrigger = () => {
        runtime.refresh(false, link);
    };

    useEffect(() => {
        const trigger = component_call_get_trigger(call);

        if (runtime.should_show(link) && 'click' in trigger && trigger.click.text) {
            // ? The required data is ready
            const text = runtime.input_value<string>(trigger.click.text, ['text']);
            setText(text);
        } else {
            setText(undefined);
        }

        runtime.update_component(link, updated); // Directly update
    }, [runtime, link, updated, call]);

    const [loaded] = useState(new Set<ComponentId>());
    useEffect(() => {
        const call = runtime.get_call(link);
        if (!call) return setLoading(false);
        if (call.is_pending()) return setLoading(true);

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

    if (!runtime.should_show(link)) return <></>; // Condition satisfaction is displayed

    return match_component_call_trigger(trigger, {
        loading: () => <></>,
        clock: () => <></>,
        click: (click) => {
            if (click.text && text === undefined) return <></>;
            if (runtime.find_value(link, 0)?.value !== undefined && !loading) return <></>; // If already have a value, you do not display the button
            // TODO When calling, should change the interface loading
            return <Button loading={loading} onClick={onTrigger} buttonText={text ?? 'Call'}></Button>;
        },
    });
}
