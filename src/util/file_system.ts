import JSZip from "jszip";
import { splitPaths } from "./util_string";

//#region Browser

export function isFirefox(){
	return navigator.userAgent.search("Firefox") > -1;
}

export function isSafari(){
	// @ts-ignore: browser dependent
	return !!window.safari;
}


export function isChromium(){
	// @ts-ignore: browser dependent
	return !!window.chrome;
}

//#endregion

//#region URI

// class URI{
// 	static readonly empty = "";
// 	fullpath: string;
// 	directory: string;
// 	file: string;
// 	extension: string;
// 	constructor(fullpath: string, isFile: boolean) {
// 		this.fullpath = fullpath;
// 		const lines = splitPaths(fullpath);
// 		if(lines[lines.length-1] )

// 		this.directory = lines.slice(0, -1).join()
// 	}

// }

// console.clear();
// console.log(splitPaths("D:\\Defaults\\Desktop\\md"));
// console.log(splitPaths("D:\\Defaults\\Desktop\\md\\"));
// console.log(splitPaths("D:\\Defaults\\Desktop\\md\\files.md"));


//#endregion

//#region FileSystemAPI

function isFunction(possibleFunction : unknown) {
	return typeof(possibleFunction) === typeof(Function);
}

export function fsaSupportCheck(){
	return isFunction(window.showOpenFilePicker) && isFunction(window.showDirectoryPicker) && isFunction(window.showOpenFilePicker);
}

// https://github.com/microsoft/vscode/blob/711ca555f624bfd5c86a1eabcf3b1a7b6fca9cbd/src/vs/workbench/services/dialogs/browser/fileDialogService.ts#L51
// https://github.com/microsoft/vscode/blob/711ca555f624bfd5c86a1eabcf3b1a7b6fca9cbd/src/vs/platform/files/browser/htmlFileSystemProvider.ts#L260
// https://developer.chrome.com/docs/capabilities/web-apis/file-system-access#:~:text=recursive%3A%20true%20%7D)%3B-,Deleting%20a%20file%20or%20folder%20directly,remove()%3B
export async function renameFile(fileHandle: FileSystemFileHandle, newName: URI) 
{
	//  @ts-ignore: there is no rename/move (yet) (yet, flag only)
	const move = fileHandle.move;
	if(isFunction(move)){
		await move("newName");
		return;
	}
}

export async function deleteFile(fileHandle: FileSystemFileHandle, dirHandle: FileSystemDirectoryHandle, newName: URI) 
{
	// @ts-ignore: there is no remove (yet, flag only)
	const remove = fileHandle.remove;
	if(isFunction(remove)){
		await remove("newName");
		return;
	}

	dirHandle.removeEntry(fileHandle.name);
}

export async function deleteDirectory(parentDirHandle: FileSystemDirectoryHandle, dirHandle: FileSystemDirectoryHandle, recursive: boolean)
{
	return await parentDirHandle.removeEntry(dirHandle.name, { recursive })
}

//#endregion

//#region FileSystemAPI File
export interface FileWithHandle
{
	file: File,
	handle: FileSystemFileHandle,
}

export async function loadFile(options: OpenFilePickerOptions = { multiple: false }): Promise<FileWithHandle>
{
	const [fileHandle] = await window.showOpenFilePicker(options);
	const file = await fileHandle.getFile();
	return { file: file, handle: fileHandle };
}

export async function loadFiles(options: OpenFilePickerOptions = { multiple: true }): Promise<FileWithHandle[]>
{
	const fileHandles = await window.showOpenFilePicker(options);
	const files = fileHandles.map(async (handle) =>
	{
		const file = await handle.getFile();
		return { file, handle };
	});
	return Promise.all(files);
}

export async function saveFile(data: FileSystemWriteChunkType, options?: SaveFilePickerOptions) 
{
	const newHandle = await window.showSaveFilePicker(options);
	await resaveFile(newHandle, data);
	return newHandle;
}

export async function resaveFile(handle: FileSystemFileHandle, data: FileSystemWriteChunkType, options: FileSystemCreateWritableOptions = { keepExistingData: false }) 
{
	const writableStream = await handle.createWritable(options);
	await writableStream.write(data);
	await writableStream.close();
}

export function readFileContent(file: File)
{
	// resolve : string | ArrayBuffer | null
	// reject : ProgressEvent<FileReader>
	return new Promise<string | ArrayBuffer | null>((resolve, reject) =>
	{
		const reader = new FileReader();
		reader.onloadend = (ev) => { resolve(ev.target ? ev.target.result : null); };
		reader.onerror = () => { reject(new Error("unable to read file: ")); };
		reader.readAsText(file);
	});
}
//#endregion

//#region FileSystemAPI Directory
export async function loadDirectory(options: DirectoryPickerOptions = { mode: "read" }): Promise<FileSystemDirectoryHandle>
{
	return await window.showDirectoryPicker(options);
}

export interface DirectoryWithEntries
{
	root: FileSystemDirectoryHandle;
	directory: FileSystemDirectoryHandle[];
	files: FileWithHandle[];
}

export async function loadFilesDirectoryShallow(options: DirectoryPickerOptions = { mode: "read" })
{
	const dirHandle = await loadDirectory(options);

	const entries: DirectoryWithEntries = { root: dirHandle, directory: [], files: [] };
	for await (const [, handle] of dirHandle.entries())
	{
		if (handle.kind === "file")
		{
			const file = await handle.getFile();
			entries.files.push({ handle, file })
		}
		else
			entries.directory.push(handle)
	}
	// console.log(entries);
	return entries;
}
export async function loadFilesDirectoryDeep(options: DirectoryPickerOptions = { mode: "read" }, maxRecursion = 1000)
{
	let recursionCount = 0;
	const rootDirHandle = await loadDirectory(options);
	const entries: DirectoryWithEntries = { root: rootDirHandle, directory: [], files: [] };
	await Recursive(rootDirHandle);
	// console.log(entries);
	return { handle: rootDirHandle, entries };

	async function Recursive(dirHandle: FileSystemDirectoryHandle) 
	{
		if(++recursionCount > maxRecursion)
			return;

		for await (const [, handle] of dirHandle.entries())
		{
			if (handle.kind === "file")
			{
				const file = await handle.getFile();
				entries.files.push({ handle, file })
			}
			else{
				entries.directory.push(handle)
				await Recursive(handle);
			}
		}
	}
}
export interface DirectoryWithEntriesWithPath
{
	root: FileSystemDirectoryHandle;
	directory: { path: string[], handle: FileSystemDirectoryHandle}[];
	files: ({ path: string[] } & FileWithHandle)[];
}
export async function loadFilesDirectoryDeepPaths(options: DirectoryPickerOptions = { mode: "read" }, maxRecursion = 1000)
{
	let recursionCount = 0;
	const rootDirHandle = await loadDirectory(options);

	const path: string[] = [];
	const entries: DirectoryWithEntriesWithPath = { root: rootDirHandle, directory: [], files: [] };

	await Recursive(rootDirHandle);
	// console.log(entries);
	return { handle: rootDirHandle, entries };

	function getPath() {
		return path.slice();
	}

	async function Recursive(dirHandle: FileSystemDirectoryHandle) 
	{
		if(++recursionCount > maxRecursion)
			return;

		for await (const [name, handle] of dirHandle.entries())
		{
			if (handle.kind === "file")
			{
				const file = await handle.getFile();
				entries.files.push({ path: getPath(), handle, file })
			}
			else{
				entries.directory.push({path: getPath(), handle})
				path.push(name);
				await Recursive(handle);
				path.pop();
			}
		}
	}

}
//#endregion

//#region Zip

// export function createZip() {
// 	return new JSZip();
// }

export async function zipToBuffer(zip: JSZip) {
	const content = await zip.generateAsync({ type: "blob"});
	const buffer = await content.arrayBuffer();
	return buffer;
}

export async function saveZip(zip: JSZip, options?: SaveFilePickerOptions) {
	const buffer = await zipToBuffer(zip);
	saveFile(buffer, options);
}

//#endregion Zip