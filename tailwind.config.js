/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			flex:{
				"11a": "1 1 auto", //grow
				"110": "1 1 0%", //fit-grow
				"10a": "1 0 auto", // grow but no shrink
				"01a": "0 1 auto", // fit-shrink
				"00a": "0 0 auto", // keep size
				"000": "0 0 0%", // no size
			}
		},
	},
	plugins: [],
}

