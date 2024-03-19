import MarkdownIt from "markdown-it";
import deflist from "markdown-it-deflist";
import attrs from "markdown-it-attrs";
import { splitPaths } from "./util_string";

//#region MarkdownIt

export const DefaultMd = (() =>
{
	const mdit = new MarkdownIt("default", {
		html: true,
		linkify: true,
		typographer: true,
		breaks: true,
	});
	mdit.use(deflist as MarkdownIt.PluginSimple);
	mdit.use(attrs);
	return mdit;
})();

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

export interface FileWithHandle
{
	file: File,
	handle: FileSystemHandle,
}

export async function loadMarkdownFile(): Promise<FileWithHandle>
{
	const [fileHandle] = await window.showOpenFilePicker(markdownLoadOptions);
	const file = await fileHandle.getFile();
	return { file: file, handle: fileHandle };
}

export async function saveMarkdownFile(data: FileSystemWriteChunkType, suggestedName?: string) 
{
	const newHandle = await window.showSaveFilePicker({ ...markdownSaveOptions, suggestedName });
	await resaveMarkdownFile(newHandle, data);
	return newHandle;
}

export async function resaveMarkdownFile(handle: FileSystemFileHandle, data: FileSystemWriteChunkType) 
{
	const writableStream = await handle.createWritable({ keepExistingData: false });
	await writableStream.write(data);
	await writableStream.close();
}

export function readFileContent(file: File)
{
	// string | ArrayBuffer | null
	// ProgressEvent<FileReader>
	return new Promise<string | ArrayBuffer | null>((resolve, reject) =>
	{
		const reader = new FileReader();
		reader.onloadend = (ev) => { resolve(ev.target ? ev.target.result : null); };
		reader.onerror = () => { reject(new Error("unable to read file: ")); };
		reader.readAsText(file);
	});
}

// #region Parser
const Separator = "/";
const NewLine = "\n";

// md break := "<!--- [path/to/file] -->"
export function markdownBreak(...path: string[])
{
	return `<!--- [${path.join(Separator)}] -->`;
}

export interface MdPath
{
	[key: string]: MdPath | string[]
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

export function joinMarkdownPath(mdPath: MdPath) : string
{
	let output = "";
	const path: string[] = [];
	Recursive(mdPath)
	
	return output.trim();

	function Recursive(mdPath: MdPath)
	{
		for (const [key, value] of Object.entries(mdPath))
		{
			if(Array.isArray(value)){
				output += markdownBreak(...path, key) + NewLine + value.join(NewLine) + NewLine;
			}
			else{
				path.push(key);
				Recursive(value);
				path.pop();
			}
		}
	}
}

// ------ TESTING

// const dt : MdPath = { 
// 	banana:{
// 		coelho: {
// 			vidro: ["111111111"],
// 			lasanha: ["3333333333"]
// 		},
// 		ilha: {

// 		}
// 	},
// 	"banana.md": ["222222222", "333"]
//  }

//  console.clear()
//  console.log(dt);

//  const join = joinMarkdownPath(dt); 
//  console.log(parseMarkdownWithBreak(...splitLines(join)));