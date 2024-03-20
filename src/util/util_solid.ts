import { JSX, Component, splitProps } from "solid-js";

export type HtmlProps<T extends HTMLElement> = JSX.HTMLAttributes<T>;

export type DivProps = HtmlProps<HTMLDivElement>;

export interface ChildrenProps {
	children?: JSX.Element
}

export function splitChildren<T extends ChildrenProps>(props: T) {
	return splitProps(props, ["children"])
}

export interface Expose<T extends object>{
	expose?: (exposed: T) => void, 
}