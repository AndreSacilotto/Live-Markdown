import { JSX, splitProps, Accessor } from "solid-js";

export type HtmlProps<T extends HTMLElement> = JSX.HTMLAttributes<T>;

export type DivProps = HtmlProps<HTMLDivElement>;

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

export interface RGB<T> {
	red: T,
	green: T,
	blue: T,
}
export interface RGBA<T> extends RGB<T> {
	opacity: T,
}

// https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type MouseAndTouch = XOR<MouseEvent, Touch>