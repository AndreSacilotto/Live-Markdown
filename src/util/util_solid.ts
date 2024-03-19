import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export type HtmlProps<T extends HTMLElement> = JSX.HTMLAttributes<T>;

export type DivProps = HtmlProps<HTMLDivElement>;

export interface ChildrenProps {
	children?: JSX.Element
}

export function splitChildren<T extends ChildrenProps>(props: T) {
	return splitProps(props, ["children"])
}