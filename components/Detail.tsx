import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
	Dimensions,
	Linking,
	Platform,
	Share,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { Movie, moviesApi, TV, tvApi } from "../api";
import { makeImgPath } from "../utils";
import Poster from "./Poster";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../Colors";
import { useQuery } from "react-query";
import { Ionicons } from "@expo/vector-icons";
import Loader from "./Loader";
import * as WebBrowser from "expo-web-browser";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Container = styled.ScrollView`
	background-color: ${(props) => props.theme.mainBgColor};
`;
const Header = styled.View`
	justify-content: flex-end;
	height: ${SCREEN_HEIGHT / 4}px;
	padding: 0px 20px;
`;

const Background = styled.Image``;

const Column = styled.View`
	flex-direction: row;
	width: 80%;
`;

const Title = styled.Text`
	color: ${(props) => props.theme.mainTextColor};
	font-size: 36px;
	align-self: flex-end;
	width: 80%;
	margin-left: 15px;
	font-weight: 500;
`;
const Data = styled.View`
	padding: 0 20px;
`;

const Overview = styled.Text`
	color: ${(props) => props.theme.textColor};
	margin: 20px 0;
`;

const VideoBtn = styled.TouchableOpacity`
	flex-direction: row;
`;
const BtnText = styled.Text`
	width: 70%;
	color: ${(props) => props.theme.mainTextColor};
	font-weight: 600;
	margin-bottom: 10px;
	line-height: 24px;
	margin-left: 10px;
`;

type RootStackParamsList = {
	Detail: Movie | TV;
};

type DetailScreenProps = NativeStackScreenProps<RootStackParamsList, "Detail">;

const Detail: React.FC<DetailScreenProps> = ({
	navigation: { setOptions },
	route: { params },
}) => {
	const isMovie = "original_title" in params;
	const { isLoading, data } = useQuery(
		[isMovie ? "movies" : "tv", params.id],
		isMovie ? moviesApi.detail : tvApi.detail
	);

	const shareMedia = async () => {
		const isAndoid = Platform.OS === "android";
		const homepage = isMovie
			? `https://www.imdb.com/title/${data.imdb_id}/`
			: data.homepage;

		if (isAndoid) {
			await Share.share({
				message: `${params.overview}\nCheck it out : ${homepage}`,
				title:
					"original_title" in params
						? params.original_title
						: params.original_name,
			});
		} else {
			await Share.share({
				url: homepage,
				title:
					"original_title" in params
						? params.original_title
						: params.original_name,
			});
		}
	};

	const ShareButton = () => (
		<TouchableOpacity onPress={shareMedia}>
			<Ionicons name="share-outline" color="white" size={24} />
		</TouchableOpacity>
	);

	useEffect(() => {
		setOptions({
			title: "original_title" in params ? "Movie" : "TV Show",
		});
	}, []);

	useEffect(() => {
		if (data) {
			setOptions({
				headerRight: () => <ShareButton />,
			});
		}
	}, [data]);

	const openYTLink = async (videoId: string) => {
		const baseUrl = `http://m.youtube.com/watch?v=${videoId}`;
		// await Linking.openURL(baseUrl);
		await WebBrowser.openBrowserAsync(baseUrl);
	};

	return (
		<Container>
			<Header>
				<Background
					style={StyleSheet.absoluteFill}
					source={{ uri: makeImgPath(params.backdrop_path || "") }}
				/>
				<LinearGradient
					colors={["transparent", COLORS.BLACK]}
					style={StyleSheet.absoluteFill}
				/>
				<Column>
					<Poster path={params.poster_path || ""} />
					<Title>
						{"original_title" in params
							? params.original_title
							: params.original_name}
					</Title>
				</Column>
			</Header>
			<Data>
				<Overview>{params.overview}</Overview>
				{isLoading ? <Loader /> : null}
				{data?.videos?.results?.map((video: any) => (
					<VideoBtn key={video.key} onPress={() => openYTLink(video.key)}>
						<Ionicons name="logo-youtube" color="white" size={24} />
						<BtnText>{video.name}</BtnText>
					</VideoBtn>
				))}
			</Data>
		</Container>
	);
};
export default Detail;
