import { VoidComponent } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { loadFile, loadFilesDirectoryDeep, loadFilesDirectoryDeepPaths, loadFilesDirectoryShallow, readFileContent, saveFile } from '../util/file_system_access';
import { markdownLoadOptions, markdownSaveOptions } from '../util/markdown';
import Tooltip from "../components/Tooltip";

const App: VoidComponent = () =>
{
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

	return (
		<>
			<div class="flex w-[100vw] h-[100vh]">
				<div id="activity-bar" class="bg-slate-500 w-16 flex flex-col items-center justify-around text-4xl">
					<Tooltip tooltip="Save the moon">
						<Icon icon="lucide:folder-edit" onClick={() => loadFilesDirectoryDeepPaths()} class="hover:text-white" />
					</Tooltip>
					<Icon icon="lucide:scan-search" onClick={load} class="hover:text-white" />
					<Icon icon="lucide:save" onClick={load} class="hover:text-white" />
					<Icon icon="lucide:upload" onClick={load} class="hover:text-white" />
					<Icon icon="lucide:download" onClick={load} class="hover:text-white" />
					<Icon icon="ph:gear-light" onClick={load} class="hover:text-white" />
				</div>
				<div id="explorer-bar" class="bg-slate-600 flex-1 flex flex-col w-full">
					<div class="h-16 bg-red-800">Upperbar</div>
					<div class="flex-1">Content</div>
				</div>
			</div>
		</>
	);
};

export default App;
