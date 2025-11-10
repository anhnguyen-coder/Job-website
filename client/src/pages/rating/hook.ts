import { REVIEW_GET_API } from "@/apis/customer/review";
import axiosInstance from "@/pkg/axios/axiosInstance";
import { useErrorHandler } from "@/pkg/helpers/errorHandler";
import { buildQueryParams } from "@/pkg/helpers/query";
import type { PagyInterface } from "@/pkg/types/interfaces/pagy";
import type {
  RatingDistributionInterface,
  RatingInterface,
  RatingSentimentInterface,
  RatingStatsInterface,
} from "@/pkg/types/interfaces/rating";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useHook = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<RatingStatsInterface>();
  const [ratingDistribution, setRatingDistribution] =
    useState<RatingDistributionInterface>();
  const [sentimentDistribution, setSentimentDistribution] =
    useState<RatingSentimentInterface>();
  const [ratings, setRatings] = useState<RatingInterface[]>();
  const [pagy, setPagy] = useState<PagyInterface>();
  const [page, setPage] = useState<number>(1);

  const handleError = useErrorHandler();
  const [err, setErr] = useState<string>("");

  const handleGetStats = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(REVIEW_GET_API.STATS);
      if (res.data.success) {
        setStats(res.data.data.stats);
        setRatingDistribution(res.data.data.ratingDistribution);
        setSentimentDistribution(res.data.data.sentimentDistribution);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSelfRatings = async () => {
    setLoading(true);
    try {
      const pagyInput = {
        page: page,
        limit: 10,
      };

      const queryStr = buildQueryParams({}, pagyInput);

      const res = await axiosInstance.get(
        `${REVIEW_GET_API.SELF_RATING}${queryStr}`
      );
      if (res.data.success) {
        setRatings(res.data.data);
        setPagy(res.data.pagy);
      }
    } catch (error) {
      handleError(error as AxiosError, setErr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stats) return;
    handleGetStats();
  }, []);

  useEffect(() => {
    handleGetSelfRatings();
  }, [page]);

  return {
    loading,
    err,
    stats,
    ratingDistribution,
    sentimentDistribution,
    ratings,
    pagy,
    setPage,
  };
};

export default useHook;
