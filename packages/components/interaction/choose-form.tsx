import { parse_custom_style } from '@jellypack/runtime/lib/model/common/custom';
import { ComponentId } from '@jellypack/runtime/lib/model/common/identity';
import { ComponentInteraction } from '@jellypack/runtime/lib/model/components/interaction';
import {
    InteractionChooseFormMetadata,
    InteractionChooseFormMetadataStyle,
} from '@jellypack/runtime/lib/model/components/interaction/choose_form';
import { CombinedRuntime } from '@jellypack/runtime/lib/runtime';
import React, { useCallback, useEffect, useState } from 'react';

import Button from '../../common/button';
import Icon from '../../common/icon';

interface ChooseItem {
    name: string;
    value: string;
}

export function ComponentInteractionChooseFormView({
    runtime,
    link,
    updated,
    metadata,
}: {
    className?: string;
    runtime: CombinedRuntime;
    link: ComponentId;
    updated: number;
    interaction: ComponentInteraction;
    metadata: InteractionChooseFormMetadata;
}) {
    const [error, setError] = useState<string>();

    const [value, setValue] = useState<string>();
    const [values, setValues] = useState<ChooseItem[]>();
    const [inputValue, setInputValue] = useState<string | undefined>(metadata.default);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (runtime.should_show(link)) {
            // Read the output value
            const value = runtime.find_value<string>(link, 0);
            setValue(value?.value);

            // Calculate input value
            let values: ChooseItem[] | undefined = [];
            for (const v of metadata.values) {
                const { name, value: input_value } = v;
                const value = runtime.input_value<string>(input_value, ['text']);
                if (value === undefined) {
                    values = undefined;
                    break;
                }
                values.push({ name, value });
            }
            setValues(values);
        }

        runtime.update_component(link, updated); // Directly update
    }, [runtime, link, metadata, updated]);

    const onChoose = (value: string) => {
        // console.debug(`🚀 ~ onChange ~ value:`, value);
        runtime.refresh_interaction(link, value); // renew
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // console.debug(`🚀 ~ onChange ~ value:`, value);
        runtime.validate_form(link, value).then((error) => {
            if (error) {
                setError(error);
                setInputValue(undefined); // renew
                return;
            }
            setError(undefined);
            setInputValue(value); // renew
        });
    };

    const onConfirm = useCallback(() => {
        setLoading(true);
        setTimeout(() => setLoading(false), inputValue !== undefined ? 333 : 100);
        runtime.refresh_interaction(link, inputValue);
        setValue(inputValue);
    }, [runtime, link, inputValue]);

    const onClean = useCallback(() => {
        runtime.refresh_interaction(link, undefined);
        setValue(undefined);
    }, [runtime, link]);

    // * custom style
    const custom = parse_custom_style<InteractionChooseFormMetadataStyle>(metadata.style);

    return (
        <div
            className="w-full ez-gap-y-2"
            style={{
                paddingTop: custom?.style?.paddingTop || '5px',
                paddingBottom: custom?.style?.paddingBottom || '5px',
            }}
        >
            {
                // Already determined parameters
                values !== undefined && value !== undefined && (
                    <div className={`ez-flex ez-w-full ez-items-center`}>
                        <div className="ez-mb-1 ez-flex ez-w-full ez-font-['JetBrainsMono'] ez-text-sm ez-font-medium ez-text-black dark:ez-text-white">
                            {custom?.outputLabel ? `${custom.outputLabel}: ` : ''} {value}
                        </div>
                        <div
                            onClick={() => onClean()}
                            className="ez-flex ez-h-[24px] ez-cursor-pointer ez-items-center ez-justify-center ez-rounded-md !ez-border-[1px] ez-border-[#dddddd] ez-px-[6px] ez-py-[3px] ez-text-xs ez-text-[#999999] ez-duration-75 hover:!ez-border-[#000] hover:ez-text-[#000] dark:!ez-border-[#333333] dark:!ez-text-[#999] dark:hover:!ez-border-[#9bff21] dark:hover:!ez-text-[#9bff21]"
                        >
                            <Icon className="ez-mr-[5px] ez-h-3 ez-w-3" name="ez-refresh"></Icon>
                            Reset
                        </div>

                        {/* <Button
                            loading={loading}
                            onClick={() => onClean()}
                            buttonText="Clean"
                            style={{
                                color: custom?.style?.color,
                                backgroundColor: custom?.style?.backgroundColor,
                                borderRadius: custom?.style?.borderRadius || '0.5rem',
                                fontWeight: custom?.style?.fontWeight || '400',
                            }}
                        ></Button> */}
                    </div>
                )
            }

            {
                // Input parameter OK
                values !== undefined && value === undefined && (
                    <div className="ez-flex ez-w-full ez-flex-col ez-gap-y-2">
                        <div
                            className="ez-grid ez-grid-cols-2 ez-items-center ez-gap-2"
                            style={{
                                gridTemplateColumns: custom?.style?.gridTemplateColumns || 'repeat(2, minmax(0, 1fr))',
                            }}
                        >
                            {values.map((item, index) => (
                                <Button
                                    key={index}
                                    loading={loading}
                                    onClick={() => onChoose(item.value)}
                                    buttonText={item.name || ''}
                                    style={{
                                        color: custom?.style?.color,
                                        backgroundColor: custom?.style?.backgroundColor,
                                        borderRadius: custom?.style?.borderRadius || '0.5rem',
                                        fontWeight: custom?.style?.fontWeight || '400',
                                    }}
                                    className={
                                        (custom?.style?.gridTemplateColumns === 'repeat(2, minmax(0, 1fr))' &&
                                            values?.length % 2 === 1 &&
                                            values?.length - 1 === index &&
                                            'ez-col-span-full',
                                        custom?.style?.gridTemplateColumns === 'repeat(3, minmax(0, 1fr))' &&
                                            values?.length % 3 === 2 &&
                                            values?.length - 1 === index &&
                                            'ez-col-span-full',
                                        custom?.style?.gridTemplateColumns === 'repeat(3, minmax(0, 1fr))' &&
                                            values?.length % 3 === 2 &&
                                            values?.length - 2 === index &&
                                            'ez-col-span-full',
                                        custom?.style?.gridTemplateColumns === 'repeat(3, minmax(0, 1fr))' &&
                                            values?.length % 3 === 1 &&
                                            values?.length - 1 === index &&
                                            'ez-col-span-full')
                                    }
                                ></Button>
                            ))}
                        </div>

                        <div className="ez-flex ez-w-full ez-flex-col ez-gap-y-2">
                            <div className="ez-flex ez-h-[44px] ez-w-full ez-items-center ez-rounded-lg !ez-border ez-border-[#DDD] ez-px-[12px] ez-font-['JetBrainsMono'] dark:ez-border-[#333]">
                                <input
                                    className="ez-flex ez-h-full ez-flex-1 ez-bg-transparent ez-text-black ez-outline-none dark:ez-text-white"
                                    defaultValue={inputValue}
                                    onChange={onChange}
                                    placeholder={custom?.formPlaceholder}
                                ></input>
                            </div>

                            {error && (
                                <div className="ez-flex ez-w-full ez-items-center ez-justify-center ez-text-left ez-font-['JetBrainsMono'] ez-text-base ez-text-[#ff5b5b]">
                                    {error}
                                </div>
                            )}

                            {!error && inputValue && (
                                <Button
                                    loading={loading}
                                    onClick={onConfirm}
                                    buttonText={metadata.confirm ?? 'Confirm'}
                                    style={{
                                        color: custom?.style?.color,
                                        backgroundColor: custom?.style?.backgroundColor,
                                        borderRadius: custom?.style?.borderRadius || '0.5rem',
                                        fontWeight: custom?.style?.fontWeight || '400',
                                    }}
                                ></Button>
                            )}
                        </div>
                    </div>
                )
            }
        </div>
    );
}
