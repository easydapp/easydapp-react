import { parse_param } from '@jellypack/runtime/lib/common/query';
import { createRoot } from 'react-dom/client';

import { LinkDappView } from '.';

import './assets/css/popup.scss';

import close_url from './assets/popup/close.min.svg';
import logo_url from './assets/popup/logo.min.svg';

const SCRIPT_NAME = 'easydapp-popup.umd.js';
const CSS_NAME = 'react.css';

const load_popup = () => {
    // 1. find script src
    const script_src = (() => {
        const scripts = document.getElementsByTagName('script');
        for (const script of scripts) {
            const src = script.src;
            if (0 <= src.indexOf(SCRIPT_NAME)) return src;
        }
        return '';
    })();
    const [host, query] = script_src.split(SCRIPT_NAME);
    const { id, title } = parse_param(query);

    if (!script_src || !host || !id) {
        console.debug('can not find host and id from script src: ', script_src);
        return;
    }

    // 2. load css
    const css_link = document.createElement('link');
    css_link.rel = 'stylesheet';
    css_link.href = `${host}${CSS_NAME}`;
    document.head.appendChild(css_link);

    css_link.onload = () => {
        // btn dom
        let LOGO_BTN_DOM = `
            <div class='btn'>
                <img class="logo-data" src="${logo_url}" />
            </div>
        `;
        if (title) {
            LOGO_BTN_DOM += `<div class="title-text">${title}</div>`;
        }

        const CLOSE_BTN_DOM = `
            <div class='btn'>
                <img class="close-data" src="${close_url}" />
            </div>
        `;

        // 3. insert popup
        const button = document.createElement('button');
        button.id = 'easydapp-popup-button';
        button.innerHTML = LOGO_BTN_DOM;
        document.body.appendChild(button);

        const popup = document.createElement('div');
        popup.id = 'easydapp-popup';
        document.body.appendChild(popup);

        button.addEventListener('click', () => {
            const display = popup.style.display;

            if (display === 'block') {
                popup.style.display = 'none';
                button.innerHTML = LOGO_BTN_DOM;
                return;
            }

            if (display === 'none') {
                popup.style.display = 'block';
                button.innerHTML = CLOSE_BTN_DOM;
                return;
            }

            // init
            popup.style.display = 'block';
            button.innerHTML = CLOSE_BTN_DOM;
            const root = createRoot(popup);
            root.render(<LinkDappView id={id} />);
        });
    };
};

window.addEventListener('load', load_popup);
