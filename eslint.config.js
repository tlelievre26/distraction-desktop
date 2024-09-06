import eslintConfigESLint from "eslint-config-eslint";

export default [
    ...eslintConfigESLint,
    ...[
        {
            "rules": {
                "n/no-unpublished-import": ["allow", {
                    "allowModules": [],
                    "convertPath": null
                }]
            }
        }
    ]
];