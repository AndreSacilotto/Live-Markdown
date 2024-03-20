import { Show, VoidComponent, createSignal } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { loadFile, loadFilesDirectoryDeep, loadFilesDirectoryDeepPaths, loadFilesDirectoryShallow, readFileContent, saveFile } from '../util/file_system_access';
import { markdownLoadOptions, markdownSaveOptions } from '../util/markdown';
import Tooltip from "../components/Tooltip";
import { MarkdownFrame, MarkdownPreviewFrameExpose } from "../components/MarkdownFrame";
import CodeEditor from "../components/CodeEditor";
import { GridResizer } from "../components/GridResizer";

const App: VoidComponent = () =>
{
	const [getShowStructure, setShowStructure] = createSignal(true);
	const [getPaneWidth, setPaneWidth] = createSignal("200px");

	let paneSplitRef: HTMLDivElement | undefined;
	let paneRef: HTMLDivElement | undefined;
	let frameExpose: MarkdownPreviewFrameExpose | undefined;

	async function load()
	{
		const fh = await loadFile(markdownLoadOptions)
		console.log(fh);
		console.log(await readFileContent(fh.file));
	}

	async function save()
	{
		const str = "banana";
		await saveFile(str, markdownSaveOptions);
	}

	function changeSplitterPos(x: number, _y: number) {
		if(!paneRef || !paneSplitRef)
			return;
		const rect = paneRef.getBoundingClientRect();
		setPaneWidth((x - rect.left) + "px")
	}

	return (
		<>
			<div class="flex w-[100vw] h-[100vh]">
				<div id="activity-bar" class="bg-slate-500 w-16 flex flex-col items-center justify-around text-4xl">

					<Tooltip tooltip="Show/Hide Structure">
						<Icon icon="lucide:folder-edit" onClick={() => setShowStructure((prev) => !prev)} class="hover:text-white" />
					</Tooltip>

					<Tooltip tooltip="Import File - Single" />
					<Tooltip tooltip="Import File - Multiple" />
					<Tooltip tooltip="Import Folder - Single" />
					<Tooltip tooltip="Import Folder - Recursive" />

					<Tooltip tooltip="Export .MFMD (Multi File MarkDown)" />
					<Tooltip tooltip="Export .PDF">
						<Icon icon="dashicons:pdf" onClick={() => frameExpose?.printFrame()} class="hover:text-white" />
					</Tooltip>

					<Tooltip tooltip="Export .Zip" />

					<Icon icon="lucide:save" onClick={load} class="hover:text-white" />
					<Icon icon="lucide:upload" onClick={load} class="hover:text-white" />
					<Icon icon="lucide:download" onClick={load} class="hover:text-white" />

					<Tooltip tooltip="source code" >
						<a href="https://github.com/AndreSacilotto/Markdown-Bundler" target="_blank" rel="noopener noreferrer">
							<Icon icon="akar-icons:github-outline-fill" class="hover:text-white" />
						</a>
					</Tooltip>
				</div>
				<Show when={getShowStructure()}>
					<div ref={paneRef} style={{ width: getPaneWidth()}} id="structure-bar" class="bg-slate-400 w-full min-w-[100px]">
						<div class="bg-slate-200 hover:bg-red-500 text-center">CSS</div>
						<span>
							Structure
						</span>
					</div>
					{/* <VerticalSplit resizeElement={document.getElementById("structure-bar")} id="split-handler" class="w-3 select-none cursor-col-resize bg-black hover:bg-blue-800" /> */}
					<GridResizer isHorizontal={false} onResize={changeSplitterPos} onSetRef={(r) => paneSplitRef = r} class="bg-yellow-50" />
				</Show>
				<div id="explorer-bar" class="bg-slate-600 flex-1 flex flex-col w-full">
					<div class="h-8 bg-red-800 flex justify-around items-center text-center">
						<div class="">Markdown</div>
						<div class="">CSS</div>
						<div class="">Preview</div>
					</div>
					{/* <MarkdownFrame expose={(e) => frameExpose = e} mdStyle={{ h1: { color: "red" } }} htmlContent={`### 1\n<h2>BBB</h2>`} class="bg-slate-50 flex-1" /> */}
					{/* <CodeEditor /> */}
				</div>
			</div>
		</>
	);
};

export default App;
