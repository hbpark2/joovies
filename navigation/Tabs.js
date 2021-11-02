import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movies from "../screens/Movie";
import Tv from "../screens/Tv";
import Search from "../screens/Search";
import { useColorScheme } from "react-native";
import { COLORS } from "../Colors";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Tabs = () => {
	const isDark = useColorScheme() === "dark";

	return (
		<Tab.Navigator
			sceneContainerStyle={{
				backgroundColor: isDark ? COLORS.BLACK : "#fff",
			}}
			screenOptions={{
				unmountOnBlur: true,
				tabBarStyle: {
					backgroundColor: isDark ? COLORS.BLACK : "#fff",
				},
				tabBarActiveTintColor: isDark ? COLORS.YELLOW : COLORS.BLACK,
				tabBarInActiveTintColor: isDark ? COLORS.LIGHT_GRAY : COLORS.DARK_GRAY,
				headerStyle: {
					backgroundColor: isDark ? COLORS.BLACK : "#fff",
				},
				headerTitleStyle: {
					color: isDark ? "#fff" : COLORS.BLACK,
				},
				tabBarLabelStyle: {
					marginTop: -5,
					fontSize: 12,
					fontWeight: "600",
				},
			}}
		>
			<Tab.Screen
				name="Movies"
				component={Movies}
				options={{
					tabBarIcon: ({ focused, color, size }) => {
						return (
							<Ionicons
								name={focused ? "film" : "film-outline"}
								color={color}
								size={size}
							/>
						);
					},
				}}
			/>
			<Tab.Screen
				name="TV"
				component={Tv}
				options={{
					tabBarIcon: ({ focused, color, size }) => {
						return (
							<Ionicons
								name={focused ? "tv" : "tv-outline"}
								color={color}
								size={size}
							/>
						);
					},
				}}
			/>
			<Tab.Screen
				name="Search"
				component={Search}
				options={{
					tabBarIcon: ({ focused, color, size }) => {
						return (
							<Ionicons
								name={focused ? "search" : "search-outline"}
								color={color}
								size={size}
							/>
						);
					},
				}}
			/>
		</Tab.Navigator>
	);
};

export default Tabs;
