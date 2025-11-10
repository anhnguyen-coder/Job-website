import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import type {
  RatingDistributionInterface,
  RatingSentimentInterface,
} from "@/pkg/interfaces/rating";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Props {
  rating: RatingDistributionInterface;
  sentiment: RatingSentimentInterface;
}

const Chart: React.FC<Props> = ({ rating, sentiment }) => {
  const ratingData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Number of Ratings",
        data: [rating[1], rating[2], rating[3], rating[4], rating[5]],
        backgroundColor: "#3B82F6", // blue
        borderRadius: 6,
      },
    ],
  };

  const ratingOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const sentimentData = {
    labels: ["Positive", "Neutral", "Negative"],
    maintainAspectRatio: false, // <--- quan trọng
    datasets: [
      {
        label: "Sentiment",
        data: [sentiment.positive, sentiment.neutral, sentiment.negative],
        backgroundColor: ["#22C55E", "#FACC15", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const sentimentOptions = {
    responsive: true,
    maintainAspectRatio: false, // <--- quan trọng
    plugins: { legend: { position: "bottom" as const } },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow ">
        <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
        <div className="h-[300px] md:h-[400px] p-8">
          <Bar data={ratingData} options={ratingOptions} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow ">
        <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
        <div className="h-[300px] md:h-[400px] p-8">
          <Pie data={sentimentData} options={sentimentOptions} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
