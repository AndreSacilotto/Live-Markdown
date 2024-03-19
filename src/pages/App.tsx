import { Show, type Component, createSignal } from 'solid-js';
import { loadMarkdownFile, readFileContent, resaveMarkdownFile, saveMarkdownFile } from '../util/markdown';
import { Icon } from '@iconify-icon/solid';

const App: Component = () =>
{
	const [explorerBar, setExplorerBar] = createSignal(true);

	function toggleExplorerBarToggle(){
		setExplorerBar((prev) => !prev);
	}

	async function load() {
		const fh = await loadMarkdownFile()
		console.log(fh); 
		console.log(await readFileContent(fh.file));
	}
	
	let handle : FileSystemFileHandle | undefined;
	async function save() {
		const str = "banana";
		handle = await saveMarkdownFile(str);
	}

	return (
		<div class="flex w-[100vw] h-[100vh]">
			<div id="activity-bar" class="bg-slate-500 w-16 flex flex-col items-center justify-around text-4xl">
				<Icon icon="lucide:folder-edit" onClick={toggleExplorerBarToggle} class="hover:text-white" />
				<Icon icon="lucide:scan-search" onClick={load} class="hover:text-white" />
				<Icon icon="lucide:save" onClick={load} class="hover:text-white" />
				<Icon icon="lucide:upload" onClick={load} class="hover:text-white" />
				<Icon icon="lucide:download" onClick={load} class="hover:text-white" />
				<Icon icon="ph:gear-light" onClick={load} class="hover:text-white" />
			</div>
			<Show when={explorerBar()}>
				<div id="explorer-bar" class="bg-slate-600 w-48 flex flex-col">
					<div id="structure" class="flex-1">structure</div>
					<div class="bg-gray-800 w-full h-2" />
					<div id="outline" class="flex-1">outline</div>
				</div>
			</Show>
			<div id="code-editor" class="bg-slate-200 flex-1 flex">
				{/* <textarea class="flex-1 mx-4 bg-cyan-300" /> */}
				
			</div>
		</div>
	);
};

export default App;
