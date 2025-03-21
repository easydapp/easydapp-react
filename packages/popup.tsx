import { parse_param } from '@jellypack/runtime/lib/common/query';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { LinkDappView } from '.';

import './assets/css/popup.scss';

const SCRIPT_NAME = 'easydapp-popup.umd.js';
const CSS_NAME = 'react.css';
const LOGO_DATA =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swXzIwNzQ1XzIyMTg4IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPgo8cmVjdCB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIGZpbGw9IiNEOUQ5RDkiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzIwNzQ1XzIyMTg4KSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjYuMTk4MiA3LjczOTQ4QzI2LjA5MTkgNy41MzE5NiAyNS45Nzk5IDcuMzI2MDEgMjUuODYyIDcuMTIxODNDMjIuMDczMyAwLjU1OTY1NSAxMy42ODIzIC0xLjY4ODcxIDcuMTIwMTUgMi4wOTk5NkMwLjU1Nzk3NSA1Ljg4ODYzIC0xLjY5MDM5IDE0LjI3OTcgMi4wOTgyOCAyMC44NDE4QzUuODg2OTUgMjcuNDA0IDE0LjI3OCAyOS42NTI0IDIwLjg0MDEgMjUuODYzN0MyNS42Mjk3IDIzLjA5ODQgMjguMTIxMiAxNy44ODE0IDI3LjY0NDcgMTIuNzEzMkwyMy41NTY5IDE1LjA3MzRDMjMuMjIwNiAxOC4wMDI5IDIxLjU0OTEgMjAuNzQxIDE4Ljc5OTIgMjIuMzI4N0MxNC4xODk0IDI0Ljk5MDIgOC4yOTQ3OCAyMy40MTA3IDUuNjMzMjkgMTguODAwOUMyLjk3MTc5IDE0LjE5MSA0LjU1MTI0IDguMjk2NDYgOS4xNjEwOSA1LjYzNDk3QzEzLjc3MDkgMi45NzM0NyAxOS42NjU1IDQuNTUyOTIgMjIuMzI3IDkuMTYyNzdDMjIuNDQ1MiA5LjM2NzUxIDIyLjU1NTEgOS41NzQ3OCAyMi42NTY2IDkuNzg0MkwyNi4xOTgyIDcuNzM5NDhaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjA3NDVfMjIxODgpIi8+CjxwYXRoIGQ9Ik0xOS40NzQ0IDExLjIyODNDMTguNjczOSA5Ljg0MTc3IDE3LjM1NTQgOC44MzAwMiAxNS44MDg5IDguNDE1NjNDMTQuMjYyNCA4LjAwMTI1IDEyLjYxNDYgOC4yMTgxOCAxMS4yMjggOS4wMTg3MUM5Ljg0MTQ2IDkuODE5MjQgOC44Mjk3MSAxMS4xMzc4IDguNDE1MzIgMTIuNjg0M0M4LjAwMDk0IDE0LjIzMDggOC4yMTc4NyAxNS44Nzg2IDkuMDE4NCAxNy4yNjUxTDE0LjI0NjQgMTQuMjQ2N0wxOS40NzQ0IDExLjIyODNaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfMjA3NDVfMjIxODgpIi8+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yMDc0NV8yMjE4OCIgeDE9IjEuNTQ4MjIiIHkxPSI5LjI3NzU0IiB4Mj0iMjcuMjQ3NiIgeTI9IjE4LjgxNzUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzlCRkYyMSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxRUZEOUMiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzIwNzQ1XzIyMTg4IiB4MT0iMTEuOTYyNSIgeTE9IjguNTk0NjQiIHgyPSIxNC45ODA5IiB5Mj0iMTMuODIyNyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMUVGRDlDIi8+CjxzdG9wIG9mZnNldD0iMC44NiIgc3RvcC1jb2xvcj0iIzlCRkYyMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=';

const CLOSE_DATA =
    'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMTkiIHZpZXdCb3g9IjAgMCAxOSAxOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzIwNjEwXzExOTA4KSI+CjxwYXRoIGQ9Ik0xLjc5ODM4IDE4Ljk5NzNMMCAxNy4xOTcyTDE3LjE4MDQgMEwxOC45Nzg4IDEuODAwMTRMMS43OTgzOCAxOC45OTczWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTAuMDA1ODU5MzggMS44MDI1OEwxLjgwNDI0IDAuMDAyNDQxNDFMMTguOTg0NiAxNy4xOTk2TDE3LjE4NjMgMTguOTk5OEwwLjAwNTg1OTM4IDEuODAyNThaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzIwNjEwXzExOTA4Ij4KPHJlY3Qgd2lkdGg9IjE5IiBoZWlnaHQ9IjE5IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=';

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
                <img class="logo-data" src="${LOGO_DATA}" />
            </div>
        `;
        if (title) {
            LOGO_BTN_DOM += `<div class="title_text">${title}</div>`;
        }

        const CLOSE_BTN_DOM = `
            <div class='btn'>
                <img class="close_data" src="${CLOSE_DATA}" />
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
