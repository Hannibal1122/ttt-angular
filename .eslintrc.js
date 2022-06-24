module.exports = {
    root: true,
    overrides: [
        {
            files: ["*.ts"],
            parserOptions: {
                project: ["tsconfig.*?.json"],
                createDefaultProgram: true,
            },
            extends: [
                "plugin:@angular-eslint/recommended",
                "google",
                // Настройки для Prettier
                'plugin:prettier/recommended'
            ],
            rules: {
                "new-cap": ["error", { "capIsNewExceptions": ["Component", "Injectable", "NgModule"] }],
                "require-jsdoc": 0/* ["warn"] */,
                "@angular-eslint/no-empty-lifecycle-method": "off"
            },
        },
        {
            files: ["*.component.html"],
            extends: ["plugin:@angular-eslint/template/recommended"],
            rules: {
                "max-len": ["error", { code: 140 }],
            },
        },
        {
            files: ["*.component.ts"],
            extends: [
                "plugin:@angular-eslint/template/process-inline-templates",
            ],
        },
    ],
};
