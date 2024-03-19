module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:solid/typescript",
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['solid'],
	rules: {
		"solid/reactivity": "warn",
		"solid/no-destructure": "warn",
		"solid/jsx-no-undef": "error",
		"@typescript-eslint/no-unused-vars": "warn",
		"@typescript-eslint/no-misused-promises": [
			"error", { "checksVoidReturn": false  }
		],
		"@typescript-eslint/no-confusing-void-expression": "off",
		"@typescript-eslint/no-floating-promises": "off",
		"no-empty": "off",
		"prefer-const": "warn",
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json'],
		tsconfigRootDir: __dirname,
		ecmaFeatures: {
			"jsx": true
		},
	},
}
