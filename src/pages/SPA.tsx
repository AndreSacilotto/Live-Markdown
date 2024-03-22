import { Show, VoidComponent, createSignal } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { loadFile, loadFilesDirectoryDeep, loadFilesDirectoryDeepPaths, loadFilesDirectoryShallow, readFileContent, saveFile } from '../util/file_system_access';
import { markdownLoadOptions, markdownSaveOptions } from '../util/markdown';
import Tooltip from "../components/Tooltip";
import { MarkdownFrame, MarkdownPreviewFrameExpose } from "../components/MarkdownFrame";
import CodeEditor from "../components/CodeMirror/CodeEditor";
import { Dot, GridResizer } from "../components/GridResizer";
import { createCmTheme } from "../util/util_codemirror6";
import { twMerge } from "tailwind-merge";
import { classList } from "solid-js/web";
import Popup from "../components/Popup";
import { invertBool } from "../util/util_solid";

const editorTheme = createCmTheme({
	"&": {
		width: "100%",
		height: "100%",
	}
})

const SPA: VoidComponent = () =>
{
	const [getShowStructure, setShowStructure] = createSignal(true);
	const [getPaneWidth, setPaneWidth] = createSignal("12.5vw");

	const [getShowMdEditor, setShowMdEditor] = createSignal(true);
	const [getShowCssEditor, setShowCssEditor] = createSignal(true);
	const [getShowPreview, setShowPreview] = createSignal(true);

	const [getPopupExport, setPopupExport] = createSignal(false);
	const [getPopupImport, setPopupImport] = createSignal(false);

	const [getCodeMd, setCodeMd] = createSignal("### h1");
	const [getCodeCss, setCodeCss] = createSignal("h1 { color: red; }");

	let structurePanelRef: HTMLDivElement | undefined;
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

	function explorerSplitterPos(x: number, _y: number)
	{
		if (!structurePanelRef)
			return;
		const rect = structurePanelRef.getBoundingClientRect();
		setPaneWidth((x - rect.left) + "px")
	}

	const resizerStyle = "flex-shrink-0 bg-yellow-50 hover:bg-black";

	return (
		<>
			<Popup visible={getPopupExport()} onOutsideClick={() => { console.log("outside"); setPopupExport(false); }}>
				<div class="bg-white flex flex-col text-center">
					<div class="bg-black text-white">Save as...</div>
					<div class="flex flex-col text-center [&>*]:border">
						<button onClick={() => console.log("TODO")}>
							<span>.MMD (Multifile MarkDown)</span>
							<Icon icon="ant-design:copy-outlined" />
						</button>
						<button onClick={() => console.log("TODO")}>
							<span>.MDs (Zip)</span>
							<Icon icon="ant-design:file-zip-outlined" />
						</button>
						<button onClick={() => frameExpose?.printFrame()}>
							<span>.PDF</span>
							<Icon icon="dashicons:pdf" />
						</button>
					</div>
				</div>
			</Popup>
			<Popup visible={getPopupImport()} onOutsideClick={() => { console.log("outside"); setPopupImport(false); }}>
				<div class="bg-white flex flex-col text-center">
					<div class="bg-black text-white">Import Options:</div>
					<div class="flex flex-col text-center [&>*]:border">
						<button onClick={() => console.log("TODO")}>
							<span>Import File - Single</span>
						</button>
						<button onClick={() => console.log("TODO")}>
							<span>Import File - Multiple</span>
						</button>
						<button onClick={() => console.log("TODO")}>
							<span>Import Folder - Single</span>
						</button>
						<button onClick={() => console.log("TODO")}>
							<span>Import Folder - Recursive</span>
						</button>
					</div>
				</div>
			</Popup>
			<div class="flex flex-row w-screen h-screen">
				<div id="activity-bar" class="flex-shrink-0 bg-slate-500  flex flex-col items-center justify-around text-4xl p-2">
					<Tooltip tooltip="Show/Hide Structure">
						<Icon icon="lucide:folder-edit" onClick={() => setShowStructure(invertBool)} class="hover:text-white" />
					</Tooltip>

					<Tooltip tooltip="Search in MD files (TODO)" >
						<Icon icon="lucide:search-code" onClick={() => console.log("TODO")} class="hover:text-white" />
					</Tooltip>

					<Tooltip tooltip="Open Save Menu" >
						<Icon icon="lucide:save" onClick={() => setPopupExport(true)} class="hover:text-white" />
					</Tooltip>

					<Tooltip tooltip="Open Import Menu" >
						<Icon icon="gg:import" onClick={() => setPopupImport(true)} class="hover:text-white" />
					</Tooltip>

					<Tooltip tooltip="Open Config Page (TODO)" >
						<Icon icon="uil:cog" onClick={() => console.log("TODO")} class="hover:text-white" />
					</Tooltip>

					<Tooltip tooltip="Source Code" >
						<a href="https://github.com/AndreSacilotto/Markdown-Bundler" target="_blank" rel="noopener noreferrer">
							<Icon icon="akar-icons:github-outline-fill" class="hover:text-white" />
						</a>
					</Tooltip>
				</div>
				<Show when={getShowStructure()} >
					<div ref={structurePanelRef} style={{ width: getPaneWidth() }} id="structure-bar" class="bg-slate-400 w-full min-w-24">
						<span>Structure</span>
					</div>
					<GridResizer isHorizontal={false} onResize={explorerSplitterPos} class={resizerStyle} />
				</Show>
				<div id="explorer-bar" class="bg-slate-600 flex-1 flex flex-col overflow-auto">
					<div class="h-8 bg-red-800 flex justify-around items-center text-center overflow-hidden 
								[&_button]:rounded-full [&_button]:w-32 [&_button]:p-0.5 [&_button]:flex-shrink-0">
						<button class="select-none bg-slate-50 hover:bg-slate-300" onClick={() => setShowMdEditor(invertBool)} classList={{ "bg-black": !getShowMdEditor(), }} >Markdown</button>
						<button class="select-none bg-slate-50 hover:bg-slate-300" onClick={() => setShowCssEditor(invertBool)} classList={{ "bg-black": !getShowCssEditor(), }} >CSS</button>
						<button class="select-none bg-slate-50 hover:bg-slate-300" onClick={() => setShowPreview(invertBool)} classList={{ "bg-black": !getShowPreview(), }}>Preview</button>
					</div>
					<div class="flex-1 flex flex-row max-w-full [&>.editor]:overflow-auto [&>.editor]:min-w-[20%] [&>.editor]:w-1/3 [&>.editor]:flex-1 p-4">
						<Show when={getShowMdEditor()}>
							<CodeEditor code="markdown" indentation={`\t`} gutter={true} showWhiteSpace={true} lineNumbers={true} extensions={editorTheme} placeholder="Markdown code..."
								initialText={getCodeMd()}
								onValueChange={setCodeMd}
								class="editor" />
							{/* <GridResizer isHorizontal={false} class={resizerStyle} /> */}
						</Show>
						<Show when={getShowCssEditor()}>
							<CodeEditor code="css" indentation={`\t`} gutter={true} showWhiteSpace={true} lineNumbers={true} extensions={editorTheme} placeholder="CSS code..."
								initialText={getCodeCss()}
								onValueChange={setCodeCss}
								class="editor"
							/>
							{/* <GridResizer isHorizontal={false} class={resizerStyle} /> */}
						</Show>
						<Show when={getShowPreview()}>
							<MarkdownFrame expose={(e) => frameExpose = e}
								mdContent={getCodeMd()} mdStyle={getCodeCss()}
								class="editor bg-slate-300"
							/>
						</Show>
					</div>
				</div>
			</div>
		</>
	);
};

export default SPA;
