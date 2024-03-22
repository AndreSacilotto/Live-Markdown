import { ParentComponent, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { MouseAndTouch, RGB } from "../util/util_solid";

export interface PopupProps
{
	visible: boolean,
	onOutsideClick?: (ev: MouseAndTouch | null) => void,
	backgroundColor?: RGB<number>,
	backgroundOpacity?: number,
}

const Popup: ParentComponent<PopupProps> = (props) =>
{
	const [getOutsideColor, setOutsideColor] = createSignal("rgb(0 0 0 / 50%)")

	function outsideClick(ev: MouseAndTouch | null)
	{
		// console.log("click");
		props.onOutsideClick?.(ev);
	}
	function outsideKey(ev: KeyboardEvent)
	{
		if(ev.key === "Escape"){
			// console.log(ev.key);
			props.onOutsideClick?.(null);
		}
	}

	createEffect(() =>
	{
		let red = 0, green = 0, blue = 0;
		if (props.backgroundColor)
		{
			red = props.backgroundColor.red;
			green = props.backgroundColor.green;
			blue = props.backgroundColor.blue;
		}
		return setOutsideColor(`rgb(${red} ${green} ${blue} / ${props.backgroundOpacity ?? 50}%)`)
	});

	createEffect(() =>{
		if(props.visible){
			window.addEventListener("keydown", outsideKey, { passive: true });
		}
		else{
			window.removeEventListener("keydown", outsideKey);
		}
		onCleanup(() => window.removeEventListener("keydown", outsideKey));
	})

	return (
		<Show when={props.visible}>
			<div class="fixed top-0 left-0 w-screen h-screen z-50">
				<div
					style={{ "background-color": getOutsideColor() }}
					class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-55" 
					onClick={outsideClick} onTouchStart={(ev) => outsideClick(ev.touches[0])}
				/>
				<div 
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					// class="w-full h-full flex flex-col justify-center items-center"
				>
					{props.children}
				</div>
			</div>
		</Show>
	);
};

export default Popup;