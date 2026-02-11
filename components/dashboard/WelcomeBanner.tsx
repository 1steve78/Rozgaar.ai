'use client';

type WelcomeBannerProps = {
  firstName: string;
  skillsCount: number;
};

export default function WelcomeBanner({
  firstName,
  skillsCount,
}: WelcomeBannerProps) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg lg:p-8">
      <h1 className="mb-2 text-2xl font-bold lg:text-3xl">
        Welcome back, {firstName}! 👋
      </h1>
      <p className="text-blue-100">
        Let's find your dream job today.{' '}
        {skillsCount > 0
          ? `We found ${skillsCount} skill${skillsCount > 1 ? 's' : ''} in your profile.`
          : 'Start by adding your skills below.'}
      </p>
    </div>
  );
}
