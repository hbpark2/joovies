import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		mainBgColor: string;
		mainTextColor: string;
		textColor: string;
		accentColor: string;
		weakTextColor: string;
	}
}
