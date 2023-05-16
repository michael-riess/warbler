/** @type {import("prettier").Config} */
const config = {
    plugins: [require.resolve('prettier-plugin-tailwindcss')],
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    useTabs: false,
};

module.exports = config;
