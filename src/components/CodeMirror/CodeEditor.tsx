
//#region Solid Imports
import { VoidComponent, createEffect, splitProps } from "solid-js";
import { CreateCodeMirrorProps, createCodeMirror, createEditorReadonly } from "solid-codemirror";
//#region Other Imports
import { twMerge } from "tailwind-merge";
//#region CodeMirror Imports
import { EditorView, highlightActiveLineGutter, highlightTrailingWhitespace, highlightWhitespace, lineNumbers, placeholder } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { foldGutter } from "@codemirror/language";
//#region My Imports
import { cmBaseExtensions, cmLanguages, createIndentation } from "../../util/util_codemirror6";
import { basicLight } from "./editor_themes";
import { HtmlProps } from "../../util/util_solid";

type DivProps = Omit<HtmlProps<HTMLDivElement>, "ref">;

export interface CodeEditorProps extends Omit<CreateCodeMirrorProps, "value">
{
	code?: "text" | "css" | "markdown",
	initialText?: string,
	indentation?: "  " | "    " | `\t` | string,
	placeholder?: string,
	readOnly?: boolean,
	gutter?: boolean,
	lineNumbers?: boolean,
	lineWrapping?: boolean,
	showWhiteSpace?: boolean,
	showTrailingWhitespace?: boolean,
	extensions?: Extension | Extension[],
}

const CodeEditor: VoidComponent<CodeEditorProps & DivProps> = (props) =>
{
	const [, divProps] = splitProps(props, [
		"code", "indentation", "placeholder", "readOnly", "gutter", "lineNumbers", "lineWrapping", "showWhiteSpace", "showTrailingWhitespace", "extensions", // props
		"initialText", "onValueChange", "onModelViewUpdate", "onTransactionDispatched", //code mirror props
		"class", //used div props
	])

	const { editorView, ref: editorRef, createExtension } = createCodeMirror({
		value: props.initialText,
		onValueChange: props.onValueChange,
		onModelViewUpdate: props.onModelViewUpdate,
		onTransactionDispatched: props.onTransactionDispatched,
	});

	createEditorReadonly(editorView, () => !!props.readOnly);

	// ---- Theme
	createExtension([basicLight]);

	// Features
	const reExtensions = createExtension([]);
	createEffect(() =>
	{
		const arr: Extension[] = [];

		if (props.readOnly)
			arr.push(cmBaseExtensions);

		switch (props.code)
		{
			case "markdown":
				arr.push(cmLanguages.markdown);
				break;
			case "css":
				arr.push(cmLanguages.css);
				break;
		}

		if (props.lineWrapping)
			arr.push(EditorView.lineWrapping);
		if (props.lineNumbers)
			arr.push(lineNumbers());
		if (props.placeholder)
			arr.push(placeholder(props.placeholder));
		if (props.showWhiteSpace)
			arr.push(highlightWhitespace());
		if (props.showTrailingWhitespace)
			arr.push(highlightTrailingWhitespace());
		if (props.indentation)
			arr.push(createIndentation(props.indentation));
		if (props.gutter)
			arr.push([highlightActiveLineGutter(), foldGutter()]);
		if (props.extensions)
			arr.push(props.extensions);

		reExtensions(arr)
	});

	return (
		<div ref={editorRef} {...divProps} class={twMerge("cm-root", props.class)} />
	);
};

export default CodeEditor;