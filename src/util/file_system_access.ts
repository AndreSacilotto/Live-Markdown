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