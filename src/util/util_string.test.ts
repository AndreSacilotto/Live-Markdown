import { test, expect} from '@jest/globals';
import { kbabify } from "./util_string";

test('camelCase to kebab-case', () => {
	expect(kbabify("camelCase")).toBe("camel-case")
	expect(kbabify("camel")).toBe("camel")
	expect(kbabify("CamelToBanana")).toBe("camel-to-banana")
});