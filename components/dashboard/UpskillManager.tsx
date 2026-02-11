type Recommendation = {
  skill: string;
  reason: string;
  impact: string;
};

type UpskillAssistantProps = {
  recommendations: Recommendation[];
};

export default function UpskillAssistant({
  recommendations,
}: UpskillAssistantProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        What to Learn Next
      </h3>

      <div className="mt-4 space-y-4">
        {recommendations.slice(0, 3).map(rec => (
          <div
            key={rec.skill}
            className="rounded-xl bg-gray-50 p-4"
          >
            <p className="font-medium text-gray-900">{rec.skill}</p>
            <p className="mt-1 text-sm text-gray-600">{rec.reason}</p>
            <p className="mt-2 text-xs text-gray-500">
              Impact: {rec.impact}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
