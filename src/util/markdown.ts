import MarkdownIt from "markdown-it";
import deflist from "markdown-it-deflist";
import attrs from "markdown-it-attrs";
import { splitPaths } from "./util_string";
import { StyleSpec } from "style-mod";

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

export interface MdPath
{
	[key: string]: MdPath | string[]
}

// md break := "<!--- [path/to/file] -->"
export function markdownBreak(...path: string[])
{
	return `<!--- [${path.join(Separator)}] -->`;
}

export function parseMarkdownWithBreak(...mdLines: string[]): MdPath
{
	const mdPath: MdPath = {};
	let arr: string[] = [];
	for (const line of mdLines)
	{
		const match = line.match(/^<!---.*\[(.*)\].*-->/);
		if (match)
		{
			const paths = splitPaths(match[1]);
			const len1 = paths.length - 1;

			let current: MdPath = mdPath;
			for (let i = 0; i < len1; i++)
			{
				const p = paths[i];
				if (!(p in current))
					current[p] = {};
				current = current[p] as MdPath;
			}
			arr = []
			current[paths[len1]] = arr;
		}
		else
			arr.push(line);
	}
	return mdPath;
}

export function joinMarkdownPath(mdPath: MdPath): string
{
	let output = "";
	const path: string[] = [];
	Recursive(mdPath)

	return output.trim();

	function Recursive(mdPath: MdPath)
	{
		for (const [key, value] of Object.entries(mdPath))
		{
			if (Array.isArray(value))
			{
				output += markdownBreak(...path, key) + NewLine + value.join(NewLine) + NewLine;
			}
			else
			{
				path.push(key);
				Recursive(value);
				path.pop();
			}
		}
	}
}
//#endregion

// #region Markdown Style

// export type StyleDeclaration = Record<string, string>; //Partial<CSSStyleDeclaration>;

export interface MarkdownStyle
{
	[selector: string] : StyleSpec | undefined;
	/** headers 1*/
	h1?: StyleSpec;
	/** headers 2*/
	h2?: StyleSpec;
	/** headers 3*/
	h3?: StyleSpec;
	/** headers 4*/
	h4?: StyleSpec;
	/** headers 5*/
	h5?: StyleSpec;
	/** headers 6*/
	h6?: StyleSpec;
	/** paragraph */
	p?: StyleSpec;
	/** text style - bold */
	strong?: StyleSpec;
	/** text style - italic */
	em?: StyleSpec;
	/** link and/or anchor */
	a?: StyleSpec;
	/** images */
	img?: StyleSpec;
	/** list: unordered */
	ul?: StyleSpec;
	/** list: ordered */
	ol?: StyleSpec;
	/** list: item */
	li?: StyleSpec;
	/** blockquote */
	blockquote?: StyleSpec;
	/** code block ``` */
	code?: StyleSpec;
	/** code field ` */
	pre?: StyleSpec;
	/** horizontal rule */
	hr?: StyleSpec;
	/** table */
	table?: StyleSpec;
	/** table: head */
	thead?: StyleSpec;
	/** table: header */
	th?: StyleSpec;
	/** table: body */
	tbody?: StyleSpec;
	/** table: row */
	tr?: StyleSpec;
	/** table: data cell */
	td?: StyleSpec;

	/** strikethrough - extended markdown */
	del?: StyleSpec;
	/** superscript - extended markdown */
	sup?: StyleSpec;
	/** subscript - extended markdown */
	sub?: StyleSpec;
	/** description list - extended markdown */
	dl?: StyleSpec;
	/** description list: terms - extended markdown */
	dt?: StyleSpec;
	/** description list: details - extended markdown */
	dd?: StyleSpec;
	/** task list - extended markdown */
	"input[type=checkbox]"?: StyleSpec;
}

export function JsonToCss(jsonCSS: Record<string, StyleSpec>)
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