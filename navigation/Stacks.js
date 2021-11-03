import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Detail from "../components/Detail";
import { useColorScheme } from "react-native";
import { COLORS } from "../Colors";

const NativeStack = createNativeStackNavigator();

const Stack = () => {
	const isDark = useColorScheme() === "dark";
	return (
		<NativeStack.Navigator
			screenOptions={{
				headerBackTitleVisible: false,
				headerStyle: {
					backgroundColor: isDark ? COLORS.BLACK : "#fff",
				},
				headerTitleStyle: {
					color: isDark ? "#fff" : COLORS.BLACK,
				},
			}}
		>
			<NativeStack.Screen name="Detail" component={Detail} />
		</NativeStack.Navigator>
	);
};
export default Stack;
