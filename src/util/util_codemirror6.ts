import { EditorView, crosshairCursor, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, highlightTrailingWhitespace, highlightWhitespace, keymap, lineNumbers, placeholder, rectangularSelection, scrollPastEnd } from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab, standardKeymap, } from '@codemirror/commands';
import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { highlightSelectionMatches, search, searchKeymap } from "@codemirror/search";
import { lintKeymap } from "@codemirror/lint"
import { languages } from "@codemirror/language-data";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { css } from "@codemirror/lang-css";
import { StyleSpec } from "style-mod";

export type CmTheme = { [selector: string]: StyleSpec }

export function createCmTheme(themeCss: CmTheme, dark = false): Extension
{
	return EditorView.theme(themeCss, { dark });
}

export function createIndentation(indentation: string): Extension
{
	return indentUnit.of(indentation);
}

export const cmBaseExtensions: readonly Extension[] = [
	// cm:view
	drawSelection(),
	dropCursor(),
	crosshairCursor(),
	// highlightActiveLineGutter(),
	highlightActiveLine(),
	highlightSpecialChars(),
	rectangularSelection(),
	// scrollPastEnd(),
	// cm:language
	bracketMatching(),
	// foldGutter(),
	indentOnInput(),
	syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
	// cm:autocomplete
	autocompletion(),
	closeBrackets(),
	// cm:commands
	history(),
	// cm:search
	highlightSelectionMatches(),
	search(),
	// cm: state
	EditorState.allowMultipleSelections.of(true),
	EditorState.tabSize.of(4),
	keymap.of([
		...standardKeymap,
		...defaultKeymap,
		...closeBracketsKeymap,
		...searchKeymap,
		...historyKeymap,
		...foldKeymap,
		...completionKeymap,
		...lintKeymap,
		indentWithTab
	]),
];


//https://github.com/codemirror/language-data/blob/main/src/language-data.ts
export const cmOtherExtensions: readonly Extension[] =
	[
		EditorView.lineWrapping,
		lineNumbers(),
		highlightWhitespace(),
		highlightTrailingWhitespace(),
		highlightActiveLineGutter(),
		foldGutter(),
		scrollPastEnd(),
		placeholder("Text goes here..."),
	]

export const cmLanguages = {
	markdown: markdown({base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
	css: css()
}