'use client';

interface CompatibilityScoreProps {
    score: number;
    matchingSkills: string[];
    missingSkills: string[];
    reason: string;
}

export default function CompatibilityScore({
    score,
    matchingSkills,
    missingSkills,
    reason,
}: CompatibilityScoreProps) {
    const getColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    const getTextColor = (score: number) => {
        if (score >= 80) return 'text-green-700';
        if (score >= 60) return 'text-blue-700';
        if (score >= 40) return 'text-yellow-700';
        return 'text-gray-700';
    };

    return (
        <div className="group relative">
            {/* Score Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getColor(score)} bg-opacity-10 border border-current ${getTextColor(score)}`}>
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold">{score}%</span>
                </div>
            </div>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 w-64">
                <div className="bg-gray-900 text-white text-sm rounded-lg shadow-xl p-4">
                    <p className="font-medium mb-2">{reason}</p>

                    {matchingSkills.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs text-gray-300 mb-1">Matching Skills:</p>
                            <div className="flex flex-wrap gap-1">
                                {matchingSkills.slice(0, 5).map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-green-500 bg-opacity-20 text-green-300 rounded-full text-xs"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {missingSkills.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-300 mb-1">Missing Skills:</p>
                            <div className="flex flex-wrap gap-1">
                                {missingSkills.slice(0, 5).map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-red-500 bg-opacity-20 text-red-300 rounded-full text-xs"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Arrow */}
                    <div className="absolute top-full left-4 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
