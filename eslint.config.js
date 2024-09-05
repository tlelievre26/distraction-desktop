import eslintConfigESLint from "eslint-config-eslint";
import { electron } from "process";

export default [
    ...eslintConfigESLint,
    ...[
        {
            "rules": {
                "n/no-unpublished-import": ["allow", {
                    "allowModules": [electron],
                    "convertPath": null
                }]
            }
        }
    ]
];