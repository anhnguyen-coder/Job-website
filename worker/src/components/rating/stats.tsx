import type { RatingStatsInterface } from "@/pkg/interfaces/rating";
import { BaseStatItem } from "../base/statItemBase";


interface StatsProps {
  stats: RatingStatsInterface;
}

function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* avg ratings */}
      <BaseStatItem
        title="Averange Ratings"
        value={stats.avgRating ?? 0}
        icon={
          <>
            <i className="mdi mdi-star-outline text-2xl w-6 h-6 flex items-center justify-center"></i>
          </>
        }
        variant="success"
      />
      <BaseStatItem
        title="Total Reviews"
        value={stats.totalRatings ?? 0}
        icon={
          <>
            <i className="mdi mdi-message-outline text-2xl w-6 h-6 flex items-center justify-center"></i>
          </>
        }
        variant="info"
      />
      <BaseStatItem
        title="Total Five Stars"
        value={stats.fiveStars ?? 0}
        icon={
          <>
            <i className="mdi mdi-trophy-outline text-2xl w-6 h-6 flex items-center justify-center"></i>
          </>
        }
        variant="danger"
      />
      <BaseStatItem
        title="Postive Sentiment"
        value={stats.positiveSentiment ?? 0}
        icon={
          <>
            <i className="mdi mdi-emoticon-happy-outline text-2xl w-6 h-6 flex items-center justify-center"></i>
          </>
        }
        variant="warning"
      />
    </div>
  );
}

export default Stats;
