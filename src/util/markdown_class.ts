import { arrayRemoveOnce } from "./util_collection";
import { splitPaths } from "./util_string";

export class MdBase
{
	public name: string;
	protected path!: string[];
	protected parent!: MdFolder | null;

	constructor(name: string, parent: MdFolder | null)
	{
		this.name = name;
		this.setParent(parent)
	}

	public isRoot() { return this.parent === null }

	public static readonly Separator = "/";
	public getPath() { return this.path }
	public getParent() { return this.parent }
	public setParent(parent: MdFolder | null)
	{
		// remove from old parent
		if (this.parent)
			arrayRemoveOnce<MdBase>(this.parent.children, this)

		// set new parent
		this.parent = parent;
		if (!this.parent)
		{
			this.path = [""];
			return
		}
		this.parent.children.push(this);

		// set path
		const path: string[] = [this.name]
		let current: MdFolder | null = this.parent;
		while (current.parent)
		{
			path.push(current.name);
			current = current.parent;
		}
		this.path = path.reverse();
	}
}
export class MdFolder extends MdBase
{
	public children: MdBase[] = []
}
export class MdItem extends MdBase
{
	public content: string[] = [];
}
export function parseMdWithBreak(...mdLines: string[]): MdBase
{
	const root = new MdFolder("root", null);
	let mdItem: MdItem | undefined;
	for (const line of mdLines)
	{
		const match = line.match(/^<!---.*\[(.*)\].*-->/);
		if (match)
		{
			const paths = splitPaths(match[1]);
			const len1 = paths.length - 1;

			let parent = root;
			for (let i = 0; i < len1; i++)
			{
				const path = paths[i];
				const p = parent.children.find(x => x.name === path && x instanceof MdFolder) as MdFolder | undefined;
				parent = p ? p : new MdFolder(path, parent);
			}
			mdItem = new MdItem(paths[len1], parent)
		}
		else
		{
			mdItem?.content.push(line);
		}
	}
	return root;
}


// const pm = [markdownBreak("banana/come/maca"), "### h1", markdownBreak("banana.md"), "### h2"]
// console.log(parseMarkdownWithBreak(...pm));
// console.log(parseMdWithBreak(...pm));