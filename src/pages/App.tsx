import { VoidComponent } from 'solid-js';
import SPA from "./SPA";

const App: VoidComponent = () =>
{
	return (
		<>
			{/* <div class="flex w-screen h-screen">
				<div class="flex overflow-auto max-w-full [&>*]:overflow-auto">
					<div class="bg-green-400">{"A".repeat(100)}</div>
					<div class="bg-green-500">B</div>
					<div class="bg-green-600">{"C".repeat(50)}</div>
				</div>
			</div> */}
			<SPA />
		</>
	);
};

export default App;
