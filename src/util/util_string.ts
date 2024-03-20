export function splitLines(content: string) : string[] {
	return content.split(/\r\n|\n/);
}

export function splitPaths(content: string) : string[] {
	return content.split(/[\\/]/);
}

export function substringLength(str: string, start: number, lenght: number) {
	return str.substring(start, start+lenght);
}

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isString(value: unknown) : boolean {
	return typeof value === 'string' || value instanceof String;
}

export function stringIsOnlyWhitespace(str: string): boolean {
	return stringIsNullOrEmpty(str) || (/^\s+$/g).test(str);
}

export function stringIsNullOrEmpty(str: string | null): boolean {
	return str === null || str === "" || str.length === 0;
}

export function stringIsWhitespaceOrEmpty(str: string): boolean {
	return stringIsOnlyWhitespace(str) || stringIsNullOrEmpty(str);
}

export function charIsDigitOrLetter(str: string) {
	return charIsDigit(str) || charIsLetter(str);
}

export function charIsLetter(str: string) {
	return str.length === 1 && RegExp(/^\p{L}/,'u').test(str);
}

export function charIsDigit(str: string) {
	return str >= '0' && str <= '9';
}

export function kbabify(str: string) {
	return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($1, offset) => (offset ? "-" : "") + $1.toLowerCase())
} 
