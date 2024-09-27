const js = require("@eslint/js");
const babelParser = require("@babel/eslint-parser");
const reactPlugin = require("eslint-plugin-react");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const importPlugin = require("eslint-plugin-import");

module.exports = [
  {
    // Define environments
    files: ["**/*.{js,jsx}"],
    ignores: [
      "dist/*",
      "build/*",
      "coverage/*",
      "public/*",
      ".github/*",
      "node_modules/*",
      ".vscode/*"
    ],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module",
        requireConfigFile: false
      },
      globals: {
        browser: true,
        es2021: true,
        node: true
      }
    },
    // Use js config base
    ...js.configs.recommended,
    plugins: {
      react: reactPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      // React-specific rules
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],

      // Accessibility rules
      "jsx-a11y/anchor-is-valid": "warn",

      // Best practices
      eqeqeq: "warn",
      "no-console": "warn",
      "no-unused-vars": ["error", { vars: "local", argsIgnorePattern: "^_" }],
      "no-await-in-loop": "error",

      // Import management
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],
          "newlines-between": "always"
        }
      ],
      "import/no-unresolved": "error",

      // Code formatting
      semi: ["error", "always"],
      indent: ["error", 2],
      "comma-dangle": ["error", "never"],
      "no-multiple-empty-lines": ["error", { max: 2 }],
      "camelcase": "warn",
      "func-style": "error", // This enforces making functions like `const func = () => { function definition }`
      "sort-imports": "error"

    }
  }
];
