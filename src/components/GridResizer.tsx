// based on https://github.com/solidjs/solid-playground/blob/master/packages/solid-repl/src/components/gridResizer.tsx

import { createSignal, createEffect, onCleanup, VoidComponent, ParentComponent, splitProps } from 'solid-js';
import { throttle } from '@solid-primitives/scheduled';
import { twMerge } from 'tailwind-merge'
import { HtmlProps } from "../util/util_solid";

export const Dot: VoidComponent = () =>
{
	return (<span class="h-1 w-1 rounded-full bg-slate-300 dark:bg-white dark:group-hover:bg-slate-200"/>);
};

export interface GridResizerProps extends Omit<HtmlProps<HTMLDivElement>, "ref">
{
	onSetRef?: (el: HTMLDivElement) => void;
	onDragging?: (el: boolean) => void;
	onResize?: (clientX: number, clientY: number) => void;
	isHorizontal: boolean;
}

export const GridResizer: ParentComponent<GridResizerProps> = (props) =>
{
	const [getIsDragging, setIsDragging] = createSignal(false);

	const [, spreadDivProps] = splitProps(props, ["onSetRef", "onDragging", "onResize", "isHorizontal", "children", "class"])

	function onResizeStart() {
		setIsDragging(true);
	}
	function onResizeEnd() {
		setIsDragging(false);
	}

	const onMouseMove = throttle((ev: MouseEvent) => whenResize(ev), 10);
	const onTouchMove = throttle((ev: TouchEvent) => whenResize(ev.touches[0]), 10);
	function whenResize(ev: { clientX: number, clientY: number }) {
		props.onResize?.(ev.clientX, ev.clientY);
	}

	function setRef(el: HTMLDivElement)
	{
		props.onSetRef?.(el);
		el.addEventListener('mousedown', onResizeStart, { passive: true });
		el.addEventListener('touchstart', onResizeStart, { passive: true });

		onCleanup(() => {
			el.removeEventListener('mousedown', onResizeStart);
			el.removeEventListener('touchstart', onResizeStart);
		});
	}
	createEffect(() =>
	{
		const drag = getIsDragging();
		props.onDragging?.(drag)
		if (drag)
		{
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('touchmove', onTouchMove);
			window.addEventListener('mouseup', onResizeEnd);
			window.addEventListener('touchend', onResizeEnd);
		} 
		else
		{
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('mouseup', onResizeEnd);
			window.removeEventListener('touchend', onResizeEnd);
		}

	});

	return (
		<div
			ref={(r) => setRef(r)}
			class={twMerge("flex items-center justify-center", (props.isHorizontal ? "h-2.5 cursor-row-resize" : "w-2.5 cursor-col-resize"), props.class)}
			{...spreadDivProps}
		>
			{props.children}
		</div>
	);
};
