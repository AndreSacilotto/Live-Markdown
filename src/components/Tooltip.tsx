import { mergeProps, Show, createSignal, ParentComponent } from 'solid-js';

export interface TooltipProps
{
	timeout?: number,
	tooltip: string,
	tooltipMode?: "bottom" | "top" | "page" | "client" | "offset" | "screen",
}

const Tooltip: ParentComponent<TooltipProps> = (props) =>
{
	const [getShowTooltip, setShowTooltip] = createSignal(false);
	const [getTooltipPos, setTooltipPos] = createSignal({top: "0px", left: "0px"});

	const mergedProps = mergeProps({ timeout: 500, tooltipMode: "page" }, props); //default value

	let timeoutID: NodeJS.Timeout | null = null;

	function mouseEnter(ev: MouseEvent)
	{
		timeoutID = setTimeout(() =>
		{
			const rect = (ev.target as HTMLElement).getBoundingClientRect();
			// console.log(ev.clientX, ev.clientY, rect);
			
			let x = 0;
			let y = 0;
			switch (mergedProps.tooltipMode) {
				case "bottom":
					x = rect.x;
					y = rect.height + rect.y;
					break;
				case "top":
					x = rect.x;
					y = rect.height - rect.y;
				break;
				case "page":
					x = ev.pageX;
					y = ev.pageY;
				break;
				case "client":
					x = ev.clientX;
					y = ev.clientY;
				break;
				case "offset":
					x = ev.offsetX;
					y = ev.offsetY;
				break;
				case "screen":
					x = ev.screenX;
					y = ev.screenY;
				break;
			}

			setTooltipPos({top: y.toString() + "px", left: x.toString() + "px"});
			setShowTooltip(true)

			//https://www.answeroverflow.com/m/1064269124781473823
			// window.requestAnimationFrame(() => { return; });
		}, mergedProps.timeout)
	}
	function mouseLeave()
	{
		// console.log(getTooltipPos());
		
		setShowTooltip(false);
		if (timeoutID)
			clearTimeout(timeoutID)
		timeoutID = null;
	}

	return (
		<>
			<span onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
				{props.children}
				<Show when={getShowTooltip()}>
					<div style={getTooltipPos()} class="tooltip text-sm bg-slate-100 absolute border border-gray-600 p-0.5">{props.tooltip}</div>
				</Show>
			</span>
		</>
	);
}

export default Tooltip;