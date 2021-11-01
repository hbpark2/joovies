import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	RefreshControl,
	Text,
	View,
} from "react-native";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";
import HMedia from "../components/HMedia";

const Loader = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;
const ListTitle = styled.Text`
	color: ${(props) => props.theme.textColor};
	font-size: 18px;
	font-weight: 600;
	margin-left: 30px;
`;
const TrendingScroll = styled.FlatList`
	margin-top: 20px;
`;

const ListContainer = styled.View`
	margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
	margin-bottom: 20px;
`;

const VSeperator = styled.View`
	height: 20px;
`;

const HSeperator = styled.View`
	width: 20px;
`;

const API_KEY = "8e909557555f05dfea1f3f947e352741";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [nowPlaying, setNowPlaying] = useState([]);
	const [upcoming, setUpcoming] = useState([]);
	const [trending, setTrending] = useState([]);

	const getTrending = async () => {
		const { results } = await (
			await fetch(
				`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
			)
		).json();
		setTrending(results);
	};

	const getUpcoming = async () => {
		const { results } = await (
			await fetch(
				`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
			)
		).json();
		setUpcoming(results);
	};

	const getNowPlaying = async () => {
		const { results } = await (
			await fetch(
				`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`
			)
		).json();
		setNowPlaying(results);
	};

	const getData = async () => {
		await Promise.all([getTrending(), getUpcoming(), getNowPlaying()]);
		setLoading(false);
	};

	useEffect(() => {
		getData();
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		await getData();
		setRefreshing(false);
	};

	const renderVMedia = ({ item }) => (
		<VMedia
			posterPath={item.poster_path}
			originalTitle={item.original_title}
			voteAverage={item.vote_average}
		/>
	);
	const renderHMedia = ({ item }) => (
		<HMedia
			posterPath={item.poster_path}
			originalTitle={item.original_title}
			overview={item.overview}
			releaseDate={item.release_date}
		/>
	);

	const movieKeyExtractor = (item) => item.id + "";

	return loading ? (
		<Loader>
			<ActivityIndicator />
		</Loader>
	) : (
		<FlatList
			ListHeaderComponent={
				<>
					<Swiper
						horizontal
						loop
						autoplay
						autoplayTimeout={3.5}
						showsButtons={false}
						showsPagination={false}
						containerStyle={{
							width: "100%",
							height: SCREEN_HEIGHT / 4,
							marginBottom: 30,
						}}
					>
						{nowPlaying.map((movie) => (
							<Slide
								key={movie.id}
								backdropPath={movie.backdrop_path}
								posterPath={movie.poster_path}
								originalTitle={movie.original_title}
								overview={movie.overview}
								voteAverage={movie.vote_average}
							/>
						))}
					</Swiper>
					<ListContainer>
						<ListTitle>Trending Movies</ListTitle>
						<TrendingScroll
							data={trending}
							horizontal
							keyExtractor={movieKeyExtractor}
							showsHorizontalScrollIndicator={false}
							ItemSeparatorComponent={HSeperator}
							contentContainerStyle={{ paddingHorizontal: 30 }}
							renderItem={renderVMedia}
						/>
					</ListContainer>
					<ComingSoonTitle>Coming soon</ComingSoonTitle>
				</>
			}
			data={upcoming}
			keyExtractor={movieKeyExtractor}
			ItemSeparatorComponent={VSeperator}
			renderItem={renderHMedia}
		/>
	);
};

export default Movies;
