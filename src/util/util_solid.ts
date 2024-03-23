import { JSX, splitProps } from "solid-js";

export type HtmlProps<T extends HTMLElement> = JSX.HTMLAttributes<T>;

export interface ChildrenProps {
	children?: JSX.Element
}

export function invertBool(prev: boolean){
	return !prev;
}

export function splitChildren<T extends ChildrenProps>(props: T) {
	return splitProps(props, ["children"])
}

export interface Expose<T extends object>{
	expose?: (exposed: T) => void, 
}
