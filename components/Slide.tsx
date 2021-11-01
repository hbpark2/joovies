import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import styled from "styled-components/native";
import { makeImgPath } from "../utils";
import { BlurView } from "expo-blur";
import Poster from "./Poster";

const BgImg = styled.Image``;

const Wrapper = styled.View`
	flex-direction: row;
	height: 100%;
	justify-content: center;
	align-items: center;
`;

const Column = styled.View`
	width: 40%;
	margin-left: 15px;
`;

const Title = styled.Text<{ isDark: boolean }>`
	font-size: 16px;
	font-weight: 600;
	color: #fff;
	color: ${(props) => props.theme.textColor};
`;

const Overview = styled.Text`
	margin-top: 10px;
	color: ${(props) => props.theme.weakTextColor};
`;

const Votes = styled(Overview)<{ isDark: boolean }>`
	font-size: 12px;
`;

interface SLideProps {
	backdropPath: string;
	posterPath: string;
	originalTitle: string;
	overview: string;
	voteAverage: number;
}

const Slide: React.FC<SLideProps> = ({
	backdropPath,
	posterPath,
	originalTitle,
	overview,
	voteAverage,
}) => {
	const isDark = useColorScheme() === "dark";

	return (
		<View style={{ flex: 1 }}>
			<BgImg
				style={StyleSheet.absoluteFill}
				source={{ uri: makeImgPath(backdropPath) }}
			/>
			<BlurView
				tint={isDark ? "dark" : "light"}
				intensity={95}
				style={StyleSheet.absoluteFill}
			>
				<Wrapper>
					<Poster path={posterPath} />

					<Column>
						<Title isDark={isDark}>{originalTitle}</Title>
						<Overview>{overview.slice(0, 90)}...</Overview>
						{voteAverage > 0 ? (
							<Votes isDark={isDark}>✨{voteAverage}/10</Votes>
						) : null}
					</Column>
				</Wrapper>
			</BlurView>
		</View>
	);
};

export default Slide;
