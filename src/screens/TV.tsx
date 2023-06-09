import { tvApi } from "@/api";
import HList from "@/components/HList";
import Loader from "@/components/Loader";
import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { useQuery, useQueryClient } from "react-query";

const TV = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const {
    isLoading: todayLoading,
    data: todayData,
    isRefetching: todayRefetching,
  } = useQuery(["tv", "today"], tvApi.airingToday);
  const {
    isLoading: topRatedLoading,
    data: topRatedData,
    isRefetching: topRatedRefetching,
  } = useQuery(["tv", "topRated"], tvApi.topRated);
  const {
    isLoading: trendingLoading,
    data: trendingData,
    isRefetching: trendingRefetching,
  } = useQuery(["tv", "trending"], tvApi.trending);

  const loading = todayLoading || topRatedLoading || trendingLoading;
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["tv"]);
    setRefreshing(false);
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />
      }
      contentContainerStyle={{ paddingVertical: 30 }}
    >
      <HList title="Trending TV" data={trendingData.results} />
      <HList title="Airing Today" data={todayData.results} />
      <HList title="Top Rated" data={topRatedData.results} />
    </ScrollView>
  );
};

export default TV;
