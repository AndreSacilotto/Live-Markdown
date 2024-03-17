import type { Component } from 'solid-js';

import styles from './App.module.css';
import { loadMarkdownFile, readFileContent, saveMarkdownFile } from '../util/markdown';

const App: Component = () =>
{

	async function load() {
		const fh = await loadMarkdownFile()
		console.log(fh); 
		console.log(await readFileContent(fh.file));
	}
	
	async function save() {
		const str = "banana";
		await saveMarkdownFile(str);
	}

	function gotChanged(ev: Event) {
		console.log(ev);
	}

	return (
		<div class={styles.App}>
			<button onClick={load} class="border">LOAD</button>
			<button onClick={save} class="border">SAVE</button>

			<input onChange={gotChanged} class="border flex justify-center items-center" />
		</div>
	);
};

export default App;
