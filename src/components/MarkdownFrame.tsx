import { Component, createEffect, createSignal, splitProps } from "solid-js";
import { DefaultMd, JsonToCss, MarkdownStyle, MarkdownText, StyleDeclarationCss } from "../util/markdown";
import { Expose, HtmlProps } from "../util/util_solid";
import { isString } from "../util/util_string";

type IFrameProps = Omit<HtmlProps<HTMLIFrameElement>, "ref">;

export interface MarkdownPreviewFrameExpose { 
	printFrame: () => void,
}

type MarkdownPreviewFrameProps = { 
	mdStyle?: MarkdownStyle | string,
} 
& ({ htmlContent?: string, mdContent?: never } | { htmlContent?: never, mdContent?: MarkdownText })
& Expose<MarkdownPreviewFrameExpose> 

const printOnFrameLoad = "<script>window.print();</script>"
// const cssHead = `<link type="text/css" rel="stylesheet" href=${props.cssAsset} />`;
// const scriptHead = `<script src=${props.jsAsset}></script>`;

export const MarkdownFrame: Component<IFrameProps & MarkdownPreviewFrameProps> = (props) =>
{
	const [getMdStyle, setMdStyle] = createSignal("<style></style>");

	const [customProps, frameProps] = splitProps(props, ["mdStyle", "htmlContent", "mdContent", "expose"]);

	createEffect(() =>
	{
		if (customProps.mdStyle)
		{
			let st : string;
			if(isString(customProps.mdStyle))
				st = customProps.mdStyle as string;
			else
				st = JsonToCss(customProps.mdStyle as Record<string, StyleDeclarationCss>);
			setMdStyle("<style>" + st + "</style>");
			setContent();
		}
	});
	createEffect(() =>
	{
		if (customProps.mdContent || customProps.htmlContent)
			setContent();
	});
	createEffect(() =>{
		if(customProps.expose)
			customProps.expose({ printFrame });
	});

	let frameRef: HTMLIFrameElement | undefined;
	// let isLoaded = false;
	// function whenFrameLoad()
	// {
	// 	isLoaded = true;
	// }
	// function updateFrame()
	// {
	// 	if (!frameRef)
	// 		return;
	// 	setContent();
	// }

	function setContent(extra = "")
	{
		if (!frameRef)
			return;
		const html = customProps.mdContent ? DefaultMd.render(customProps.mdContent) : customProps.htmlContent;
		frameRef.srcdoc = getMdStyle() + html + extra;
	}
	function printFrame()
	{
		console.log("frame", frameRef);
		if (frameRef?.contentWindow)
			frameRef.contentWindow.print();
		else
			setContent(printOnFrameLoad);
	}

	return (
		<>
			<button onClick={() => printFrame()}>CLICK</button>
			<iframe ref={frameRef} {...frameProps} />
		</>
	);
}
