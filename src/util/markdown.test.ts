import { test, expect} from '@jest/globals';
import * as MD from "./markdown";
import { splitLines } from "./util_string";

// ------ TESTING

test('MdPath to MdBreak to MdPath', () => { 
	const mdPath : MD.MdPath = { 
		banana:{
			coelho: {
				vidro: ["111111111"],
				lasanha: ["3333333333"]
			},
		},
		"banana.md": ["222222222", "333"]
	}
	const join = MD.joinMarkdownPath(mdPath);
	const parse = MD.parseMarkdownWithBreak(...splitLines(join));
	expect(mdPath).toEqual(parse)
})