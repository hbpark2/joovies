import React, { useState } from "react";
import AppLoading from "expo-app-loading";
import { Image, useColorScheme } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import Root from "./navigation/Root";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "./Styled";

const queryClient = new QueryClient();

const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

const loadImages = (images) =>
	images.map((image) => {
		if (typeof image === "string") {
			return Image.prefetch(image);
		} else {
			return Asset.loadAsync(image);
		}
	});

export default function App() {
	const [ready, setReady] = useState(false);
	const onFinish = () => setReady(true);
	const startLoading = async () => {
		const fonts = loadFonts([Ionicons.font]);
		const images = loadImages([
			require("./assets/test.jpeg"),
			"https://reactnative.dev/img/oss_logo.png",
		]);
		await Promise.all([...fonts, ...images]);
	};
	const isDark = useColorScheme() === "dark";

	if (!ready) {
		return (
			<AppLoading
				startAsync={startLoading}
				onFinish={onFinish}
				onError={console.error}
			/>
		);
	}
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={isDark ? darkTheme : lightTheme}>
				<NavigationContainer>
					<Root />
				</NavigationContainer>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
