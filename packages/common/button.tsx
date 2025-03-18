import React, { CSSProperties, MouseEventHandler, useEffect, useState } from 'react';
import Icon from './icon';
import { cn } from './utils';

interface ButtonProps {
    loading?: boolean;
    disabled?: boolean;
    className?: string | false;
    onClick?: MouseEventHandler<HTMLDivElement>;
    style?: CSSProperties;
    buttonText: string;
}

const Button: React.FC<ButtonProps> = ({
    loading = false,
    disabled = false,
    className,
    onClick,
    style,
    buttonText,
}) => {
    const [isHover, setIsHover] = useState<boolean>(false);

    const [styles, setStyles] = useState<CSSProperties>();

    useEffect(() => {
        if (style) {
            const newStyle = style;

            const theme = localStorage.getItem('__ez-dapp-theme');

            if (theme === 'dark' && style?.backgroundColor === '#000000') {
                newStyle.backgroundColor = '#9BFF21';

                if (styles?.color === '#9BFF21') {
                    newStyle.color = '#000000';
                }
            }

            if (theme === 'light' && style?.backgroundColor === '#ffffff') {
                newStyle.backgroundColor = '#000000';

                if (styles?.color === '#ffffff') {
                    newStyle.color = '#000000';
                }
            }

            setStyles(newStyle);
        }
    }, [style, styles]);

    return (
        <div
            className={cn(
                "ez-flex ez-h-11 ez-w-full ez-flex-shrink-0 ez-cursor-pointer ez-items-center ez-justify-center ez-overflow-hidden ez-bg-black ez-text-center ez-font-['JetBrainsMono'] ez-text-[14px] ez-font-normal ez-text-white ez-opacity-100 ez-duration-150 dark:ez-bg-[#9BFF21] dark:ez-text-black",
                className,
                loading && 'ez-cursor-wait',
                isHover && 'ez-opacity-80',
                disabled && 'ez-cursor-not-allowed ez-opacity-80',
            )}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={!disabled && !loading ? onClick : undefined} // Prevent click if disabled or loading
            style={
                styles || {
                    borderRadius: '0.5rem',
                    fontWeight: '400',
                }
            }
        >
            {loading && (
                <Icon
                    name="ez-loading"
                    className="ez-mr-2 !ez-h-[16px] !ez-w-[16px] ez-animate-spin ez-text-white dark:ez-text-[#9bff21]"
                />
            )}
            {buttonText}
        </div>
    );
};

export default Button;
