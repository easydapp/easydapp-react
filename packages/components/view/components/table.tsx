import { parse_custom_style } from '@jellypack/runtime/lib/model/common/custom';
import { InnerViewTableMetadataStyle } from '@jellypack/runtime/lib/model/components/view/inner/table';
import { useEffect, useRef } from 'react';
import { parseStyleWithImportant } from '../../../common/utils';

export function InnerTableView({
    value,
    customStyle,
}: {
    value: {
        headers: string[];
        rows: string[][];
    };
    customStyle?: string;
}) {
    // * custom style
    const custom = parse_custom_style<InnerViewTableMetadataStyle>(customStyle);
    const tableElementRef = useRef<HTMLTableElement | null>(null);

    useEffect(() => {
        if (custom?.style && tableElementRef.current) {
            const styleWithImportant = parseStyleWithImportant(custom.style);

            Object.entries(styleWithImportant).forEach(([key, value]) => {
                if (tableElementRef.current) {
                    if (key === 'color' && (value === '#ffffff' || value === '#000000')) {
                        const theme = localStorage.getItem('__ez-dapp-theme');
                        if (theme === 'dark') {
                            tableElementRef.current.style.setProperty(key, '#ffffff', 'important');
                        } else {
                            tableElementRef.current.style.setProperty(key, '#000000', 'important');
                        }
                    } else {
                        tableElementRef.current.style.setProperty(key, value, 'important');
                    }
                }
            });
        }
    }, [custom?.style]);

    return (
        <div ref={tableElementRef} className="no-scrollbar ez-w-full ez-overflow-x-scroll">
            <table className="ez-table-view ez-table-scroll ez-table-hover ez-w-full ez-whitespace-nowrap">
                <thead>
                    <tr className="ez-h-10 ez-w-full ez-bg-[#f8f8f8] dark:ez-bg-[#333]">
                        {value.headers.map((header, index) => (
                            <th
                                className="!ez-border-b-[1px] ez-border-solid ez-border-[#e8e8e8] ez-pl-[10px] ez-text-left ez-font-['JetBrainsMono'] ez-font-medium ez-text-black dark:ez-border-[#333] dark:ez-text-white"
                                key={index}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {value.rows.map((row, rowIndex) => (
                        <tr
                            className="ez-h-10 ez-w-full !ez-border-b-[1px] ez-border-solid ez-border-[#e8e8e8] last:!ez-border-b-0 even:ez-bg-[#f8f8f8] dark:ez-border-[#333] dark:ez-bg-[#1E1E1E] dark:even:ez-bg-[#333]"
                            key={rowIndex}
                        >
                            {row.map((cell, cellIndex) => (
                                <td
                                    className="ez-pl-[10px] ez-text-left ez-font-['JetBrainsMono'] ez-text-black dark:ez-text-white"
                                    key={cellIndex}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
