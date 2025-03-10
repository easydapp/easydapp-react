import { ComponentId } from '@jellypack/runtime/lib/model/common/identity';
import { ComponentForm } from '@jellypack/runtime/lib/model/components/form';
import { CombinedRuntime } from '@jellypack/runtime/lib/runtime';
import { link_value_to_js_value } from '@jellypack/types/lib/values';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '../../common/utils';
import { InnerComponentFormView } from './components';

export function ComponentFormView({
    runtime,
    link,
    updated,
    form,
}: {
    runtime: CombinedRuntime;
    link: ComponentId;
    updated: number;
    form: ComponentForm;
}) {
    // const component = runtime.component(link);
    // console.debug(`🚀 ~ component:`, form, runtime.should_show(link));

    const [error, setError] = useState<string>();

    useEffect(() => {
        runtime.update_component(link, updated); // Directly update
    }, [runtime, link, updated]);

    const onValue = useCallback(
        (value: any | undefined) => {
            runtime.validate_form(link, value).then((error) => {
                if (error) {
                    setError(error);
                    runtime.refresh_form(link, undefined); // renew
                    return;
                }
                setError(undefined);
                runtime.refresh_form(link, value); // renew
            });
        },
        [runtime, link],
    );

    const [suffix, setSuffix] = useState<string>();
    useEffect(() => {
        if (!form.metadata?.suffix) return;
        if (!runtime.should_show(link)) return;
        const suffix = runtime.input_value<string>(form.metadata.suffix, ['text']);
        setSuffix(suffix);
        runtime.update_component(link, updated); // Directly update
    }, [runtime, link, updated, form]);

    // if (!runtime.should_show(link)) return <></>; // inner already checked
    return (
        <div
            className={cn(
                'ez-flex ez-w-full ez-flex-col ez-gap-y-[5px]',
                !runtime.should_show(link) && 'ez-hidden',
            )}
        >
            <InnerComponentFormView
                runtime={runtime}
                link={link}
                onValue={onValue}
                output={form.output}
                defaultValue={
                    form.metadata?.default !== undefined
                        ? link_value_to_js_value(form.metadata.default)
                        : undefined
                }
                suffix={suffix}
                customStyle={form.metadata?.style}
            />
            {error && (
                <div className="ez-flex ez-w-full ez-items-center ez-justify-center ez-text-left ez-font-['JetBrainsMono'] ez-text-base ez-text-[#ff5b5b]">
                    {error}
                </div>
            )}
        </div>
    );
}
