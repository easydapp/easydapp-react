/** @type {import('tailwindcss').Config} */
export default {
    content: [
        // react
        './packages/**/*.{js,ts,jsx,tsx}',
    ],
    prefix: 'ez-',
    // important: true,
    corePlugins: {
        preflight: false, // Cancel the basic style reset of TailWind
    },
    theme: {
        extend: {
            backgroundImage: {
                dark: 'linear-gradient(180deg, #204100 0%, #111 51.82%)',
                light: 'linear-gradient(180deg, #E8E8E8 100%, #E8E8E8 100%)',
                dark2: 'linear-gradient(180deg, #0E1D00 0%, #111 48%)',
                light2: 'linear-gradient(180deg, #fff 100%, #fff 100%)',
            },
            boxShadow: {
                dark: '0px 4px 25px 0px rgba(155, 255, 33, 0.30)',
            },
        },
    },
    darkMode: 'class',
    plugins: [],
};
