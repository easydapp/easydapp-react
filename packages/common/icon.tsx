import React from 'react';

import { cn } from './utils';

export interface IconProps {
    name: string;
    className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
    return (
        <svg className={cn('ez-icon', className)} aria-hidden="true">
            <use xlinkHref={`#${name}`} />
        </svg>
    );
};

export default Icon;
