import MarkdownIt from "markdown-it";
import deflist from "markdown-it-deflist";
import attrs from "markdown-it-attrs";
import { splitPaths } from "./util_string";

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

export type StyleDeclarationCss = Record<string, string>;

export interface MarkdownStyle
{
	/** others */
	[tag: string]: StyleDeclarationCss | undefined,
	/** headers 1*/
	h1?: StyleDeclarationCss;
	/** headers 2*/
	h2?: StyleDeclarationCss;
	/** headers 3*/
	h3?: StyleDeclarationCss;
	/** headers 4*/
	h4?: StyleDeclarationCss;
	/** headers 5*/
	h5?: StyleDeclarationCss;
	/** headers 6*/
	h6?: StyleDeclarationCss;
	/** paragraph */
	p?: StyleDeclarationCss;
	/** text style - bold */
	strong?: StyleDeclarationCss;
	/** text style - italic */
	em?: StyleDeclarationCss;
	/** link and/or anchor */
	a?: StyleDeclarationCss;
	/** images */
	img?: StyleDeclarationCss;
	/** list: unordered */
	ul?: StyleDeclarationCss;
	/** list: ordered */
	ol?: StyleDeclarationCss;
	/** list: item */
	li?: StyleDeclarationCss;
	/** blockquote */
	blockquote?: StyleDeclarationCss;
	/** code block ``` */
	code?: StyleDeclarationCss;
	/** code field ` */
	pre?: StyleDeclarationCss;
	/** horizontal rule */
	hr?: StyleDeclarationCss;
	/** table */
	table?: StyleDeclarationCss;
	/** table: head */
	thead?: StyleDeclarationCss;
	/** table: header */
	th?: StyleDeclarationCss;
	/** table: body */
	tbody?: StyleDeclarationCss;
	/** table: row */
	tr?: StyleDeclarationCss;
	/** table: data cell */
	td?: StyleDeclarationCss;

	/** strikethrough - extended markdown */
	del?: StyleDeclarationCss;
	/** superscript - extended markdown */
	sup?: StyleDeclarationCss;
	/** subscript - extended markdown */
	sub?: StyleDeclarationCss;
	/** description list - extended markdown */
	dl?: StyleDeclarationCss;
	/** description list: terms - extended markdown */
	dt?: StyleDeclarationCss;
	/** description list: details - extended markdown */
	dd?: StyleDeclarationCss;
	/** task list - extended markdown */
	"input[type=checkbox]"?: StyleDeclarationCss;
}

export function JsonToCss(jsonCSS: Record<string, StyleDeclarationCss>)
{
	const arr: string[] = [];
	for (const [selector, declaration] of Object.entries(jsonCSS))
	{
		// if(!declaration)
		// 	continue;
		const entries = Object.entries(declaration).map(([property, value]) => `${property}: ${value};`).join(" ");
		arr.push(`${selector} { ${entries} }`)
	}
	return arr.join("\n")
}

//#endregion