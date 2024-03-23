import MarkdownIt from "markdown-it";
import deflist from "markdown-it-deflist";
import attrs from "markdown-it-attrs";
import { splitPaths, isString, splitLines } from "./util_string";
import { JSX } from "solid-js/jsx-runtime";
import { RecursiveObj } from "./util_types";

export type MarkdownText = string;

//#region MarkdownIt
export const DefaultMd = (() =>
{
	return (new MarkdownIt("default", {
		html: true,
		xhtmlOut: false,
		breaks: true,
		linkify: true,
		typographer: true,
	})
		.use(deflist as MarkdownIt.PluginSimple)
		.use(attrs)
	);
})();
//#endregion

//#region System Access API
export const markdownLoadOptions: OpenFilePickerOptions = {
	types: [
		{
			description: "Markdown",
			accept: {
				"mardown/*": [".md"],
			},
		},
	],
	excludeAcceptAllOption: false,
	multiple: false,
}

export const markdownSaveOptions: SaveFilePickerOptions = {
	types: [
		{
			description: "Markdown",
			accept: {
				"mardown/*": [".md"],
			},
		},
	],
	excludeAcceptAllOption: false,
}
//#endregion

// #region Parse MD with Break
const Separator = "/";
const NewLine = "\n";

export type RecursivePath = RecursiveObj<string>;

// md break := "<!--- [path/to/file] -->"
export function markdownBreak(...path: string[])
{
	return `<!--- [${path.join(Separator)}] -->`;
}

export function parseMarkdownWithBreak(...mdLines: string[]): RecursivePath
{
	const mdPath: RecursivePath = {};
	
	let current : RecursivePath | null = null;
	let value: string[] = [];
	let key = "";
	for (const line of mdLines) {
		const match = line.match(/^<!---.*\[(.*)\].*-->/);
		if (match)
		{
			const paths = splitPaths(match[1]);
			const len1 = paths.length - 1;

			// save last match
			if(current){
				current[key] = value.length > 0 ? value.join(NewLine) : "";
				//reset
				value = [];
			}
			
			key = paths[len1];
			current = mdPath;
			for (let i = 0; i < len1; i++)
			{
				const p = paths[i];
				if (!(p in current))
					current[p] = {};
				current = current[p] as RecursivePath;
			}
		}
		else
			value.push(line);
	}
	
	if(current)
		current[key] = value.join(NewLine);

	return mdPath;
}

export function joinMarkdownPath(mdPath: RecursivePath): string
{
	let output = "";
	const path: string[] = [];
	Recursive(mdPath)

	return output.trim();

	function Recursive(mdPath: RecursivePath)
	{
		for (const [key, value] of Object.entries(mdPath))
		{
			if (isString(value) /*Array.isArray(value)*/)
			{
				output += markdownBreak(...path, key) + NewLine + value + NewLine;
			}
			else
			{
				path.push(key);
				Recursive(value as RecursivePath);
				path.pop();
			}
		}
	}
}

// const mdPath : RecursivePath = { 
// 	banana:{
// 		coelho: {
// 			vidro: "111111111",
// 			"lasanha.md": "3333333333"
// 		},
// 	},
// 	"banana.md": "222222222\n333",
// }

// console.clear();
// const join = joinMarkdownPath(mdPath);
// const split = [...splitLines(join)];
// const parse = parseMarkdownWithBreak(...split);

// console.log(mdPath);
// console.log(join);
// console.log(split);
// console.log(parse);

//#endregion

// #region Markdown Style

export type StyleDeclaration = JSX.CSSProperties; //Record<string, string>; //Partial<CSSStyleDeclaration>;

export interface MarkdownStyle
{
	[selector: string] : StyleDeclaration | undefined;
	/** headers 1*/
	h1?: StyleDeclaration;
	/** headers 2*/
	h2?: StyleDeclaration;
	/** headers 3*/
	h3?: StyleDeclaration;
	/** headers 4*/
	h4?: StyleDeclaration;
	/** headers 5*/
	h5?: StyleDeclaration;
	/** headers 6*/
	h6?: StyleDeclaration;
	/** paragraph */
	p?: StyleDeclaration;
	/** text style - bold */
	strong?: StyleDeclaration;
	/** text style - italic */
	em?: StyleDeclaration;
	/** link and/or anchor */
	a?: StyleDeclaration;
	/** images */
	img?: StyleDeclaration;
	/** list: unordered */
	ul?: StyleDeclaration;
	/** list: ordered */
	ol?: StyleDeclaration;
	/** list: item */
	li?: StyleDeclaration;
	/** blockquote */
	blockquote?: StyleDeclaration;
	/** code block ``` */
	code?: StyleDeclaration;
	/** code field ` */
	pre?: StyleDeclaration;
	/** horizontal rule */
	hr?: StyleDeclaration;
	/** table */
	table?: StyleDeclaration;
	/** table: head */
	thead?: StyleDeclaration;
	/** table: header */
	th?: StyleDeclaration;
	/** table: body */
	tbody?: StyleDeclaration;
	/** table: row */
	tr?: StyleDeclaration;
	/** table: data cell */
	td?: StyleDeclaration;

	/** strikethrough - extended markdown */
	del?: StyleDeclaration;
	/** superscript - extended markdown */
	sup?: StyleDeclaration;
	/** subscript - extended markdown */
	sub?: StyleDeclaration;
	/** description list - extended markdown */
	dl?: StyleDeclaration;
	/** description list: terms - extended markdown */
	dt?: StyleDeclaration;
	/** description list: details - extended markdown */
	dd?: StyleDeclaration;
	/** task list - extended markdown */
	"input[type=checkbox]"?: StyleDeclaration;
}

export function JsonToCss(jsonCSS: Record<string, StyleDeclaration>)
{
	const arr: string[] = [];
	for (const [selector, declaration] of Object.entries(jsonCSS))
	{
		// if(!declaration)
		// 	continue;
		const entries = Object.entries(declaration).map(([property, value]) => `${property}: "${value}";`);
		arr.push(`${selector} { ${entries.join(" ")} }`)
	}
	return arr.join("\n")
}

//#endregion