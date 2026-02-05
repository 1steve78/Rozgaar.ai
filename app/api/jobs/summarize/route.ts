import { NextResponse } from 'next/server';
import { summarizeJob } from '@/lib/ai/jobSummarizer';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SummarizeAPI');

export async function POST(req: Request) {
    try {
        const { jobId, title, description, company } = await req.json();

        if (!jobId || !title) {
            return NextResponse.json(
                { error: 'jobId and title are required' },
                { status: 400 }
            );
        }

        logger.info(`Generating summary for job ${jobId}`);

        const summary = await summarizeJob(jobId, title, description, company);

        return NextResponse.json(summary);
    } catch (error) {
        logger.error('Failed to summarize job', error);
        return NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 }
        );
    }
}
