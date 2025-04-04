import { parse_custom_style } from '@jellypack/runtime/lib/model/common/custom';
import { InnerViewBoolMetadataStyle } from '@jellypack/runtime/lib/model/components/view/inner/bool';
import { useEffect, useRef } from 'react';

import Icon from '../../../common/icon';
import { cn } from '../../../common/utils';

export function InnerBoolView({ value, customStyle }: { value: boolean; customStyle?: string }) {
    // * custom style
    const custom = parse_custom_style<InnerViewBoolMetadataStyle>(customStyle);

    const boolElementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        /* do nothing */
    }, [custom]);

    return (
        <div className="ez-flex ez-w-full ez-flex-col ez-items-center ez-justify-center">
            <div className={cn('ez-h-[44px] ez-w-[44px]')} ref={boolElementRef}>
                <Icon name={value ? 'ez-icon-ui-true' : 'ez-icon-ui-wrong'} className="!ez-h-[44px] !ez-w-[44px]"></Icon>
            </div>

            <div className="ez-pt-[10px] ez-font-['JetBrainsMono'] ez-text-sm ez-font-medium ez-text-black dark:ez-text-white">
                {value ? 'You are right' : 'You are wrong'}
            </div>
        </div>
    );
}
