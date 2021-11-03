import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import { Dimensions, FlatList } from "react-native";
import Slide from "../components/Slide";

import HMedia from "../components/HMedia";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { MovieResponse, moviesApi } from "../api";
import Loader from "../components/Loader";
import HList from "../components/HList";

const TrendingScroll = styled.FlatList`
	margin-top: 20px;
` as unknown as typeof FlatList;

const ComingSoonTitle = styled.Text`
	color: ${(props) => props.theme.mainTextColor};
	font-size: 18px;
	font-weight: 600;
	margin-left: 30px;
	margin-bottom: 20px;
`;

const HSeperator = styled.View`
	height: 20px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
	const queryClient = useQueryClient();
	const [refreshing, setRefreshing] = useState(false);

	const { isLoading: nowPlayingLoading, data: nowPlayingData } =
		useQuery<MovieResponse>(["movies", "nowPlaying"], moviesApi.nowPlaying);
	const {
		isLoading: upcomingLoading,
		data: upcomingData,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery<MovieResponse>(
		["movies", "upcoming"],
		moviesApi.upcoming,
		{
			getNextPageParam: (currentPage) => {
				const nextPage = currentPage.page + 1;
				return nextPage > currentPage.total_pages ? null : nextPage;
			},
		}
	);
	const { isLoading: trendingLoading, data: trendingData } =
		useQuery<MovieResponse>(["movies", "trending"], moviesApi.trending);

	const onRefresh = async () => {
		setRefreshing(true);
		await queryClient.refetchQueries(["movies"]);
		setRefreshing(false);
	};

	const loading = nowPlayingLoading || upcomingLoading || trendingLoading;
	const loadMore = () => {
		if (hasNextPage) {
			fetchNextPage();
		}
	};

	return loading ? (
		<Loader />
	) : upcomingData ? (
		<FlatList
			onEndReached={loadMore}
			// onEndReachedThreshold={0.4}
			onRefresh={onRefresh}
			refreshing={refreshing}
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
						{nowPlayingData?.results.map((movie) => (
							<Slide
								key={movie.id}
								backdropPath={movie.backdrop_path || ""}
								posterPath={movie.poster_path || ""}
								originalTitle={movie.original_title}
								overview={movie.overview}
								voteAverage={movie.vote_average}
								fullData={movie}
							/>
						))}
					</Swiper>
					{trendingData ? (
						<HList title="Trending Movies" data={trendingData.results} />
					) : null}

					<ComingSoonTitle>Coming soon</ComingSoonTitle>
				</>
			}
			data={upcomingData.pages.map((page) => page.results).flat()}
			keyExtractor={(item) => item.id + ""}
			ItemSeparatorComponent={HSeperator}
			renderItem={({ item }) => (
				<HMedia
					posterPath={item.poster_path || ""}
					originalTitle={item.original_title}
					overview={item.overview}
					releaseDate={item.release_date}
					fullData={item}
				/>
			)}
		/>
	) : null;
};

export default Movies;
