import { db } from "@/lib/db";
import { jobs, userActivity, chatMessageLogs } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getDau() {
  const [row] = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${userActivity.userId})::int`,
    })
    .from(userActivity)
    .where(sql`${userActivity.createdAt} > NOW() - INTERVAL '1 day'`);
  return row?.count ?? 0;
}

async function getWau() {
  const [row] = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${userActivity.userId})::int`,
    })
    .from(userActivity)
    .where(sql`${userActivity.createdAt} > NOW() - INTERVAL '7 days'`);
  return row?.count ?? 0;
}

async function getTopActions() {
  return db
    .select({
      action: userActivity.action,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(userActivity)
    .where(sql`${userActivity.createdAt} > NOW() - INTERVAL '7 days'`)
    .groupBy(userActivity.action)
    .orderBy(desc(sql`count`))
    .limit(10);
}

async function getChatUsage() {
  const result = await db.execute(sql`
    SELECT 
      COUNT(*)::int as total_messages,
      COUNT(DISTINCT user_id)::int as unique_users,
      AVG(daily_count)::numeric as avg_per_user
    FROM (
      SELECT user_id, COUNT(*)::int as daily_count
      FROM ${chatMessageLogs}
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY user_id, DATE(created_at)
    ) daily_stats
  `);

  const row = (result as Array<Record<string, unknown>>)[0] || {};
  return {
    totalMessages: Number(row.total_messages || 0),
    uniqueUsers: Number(row.unique_users || 0),
    avgPerUser: row.avg_per_user ? Number(row.avg_per_user) : 0,
  };
}

async function getJobCount() {
  const [row] = await db.select({ count: sql<number>`COUNT(*)::int` }).from(jobs);
  return row?.count ?? 0;
}

export default async function AdminDashboard() {
  const [dau, wau, topActions, chatUsage, totalJobs] = await Promise.all([
    getDau(),
    getWau(),
    getTopActions(),
    getChatUsage(),
    getJobCount(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/70">
            <p className="text-xs font-semibold uppercase text-slate-500">DAU</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{dau}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/70">
            <p className="text-xs font-semibold uppercase text-slate-500">WAU</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{wau}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/70">
            <p className="text-xs font-semibold uppercase text-slate-500">Total Jobs</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalJobs}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/70">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Top Actions (Last 7 Days)
            </h2>
            <div className="divide-y divide-slate-100">
              {topActions.map((row) => (
                <div key={row.action} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-slate-700">{row.action}</span>
                  <span className="font-semibold text-slate-900">{row.count}</span>
                </div>
              ))}
              {topActions.length === 0 && (
                <p className="text-sm text-slate-500 py-4">No recent activity.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/70">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Chat Usage (7 Days)</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Total messages</span>
                <span className="font-semibold text-slate-900">{chatUsage.totalMessages}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Unique users</span>
                <span className="font-semibold text-slate-900">{chatUsage.uniqueUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg per user/day</span>
                <span className="font-semibold text-slate-900">
                  {chatUsage.avgPerUser.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
