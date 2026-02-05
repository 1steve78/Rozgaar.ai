export type JobSource = {
  id: string;
  name: string;
  baseUrl: string;
  buildUrl: (query: string, location?: string) => string;
};

export const jobSources: JobSource[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    baseUrl: 'https://www.linkedin.com/jobs/search',
    buildUrl: (query, location) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(location || '')}`,
  },
  {
    id: 'naukri',
    name: 'Naukri',
    baseUrl: 'https://www.naukri.com',
    buildUrl: (query, location) =>
      `https://www.naukri.com/${query.replaceAll(
        ' ',
        '-'
      )}-jobs${location ? `-in-${location}` : ''}`,
  },
  {
    id: 'company',
    name: 'Company Career Pages',
    baseUrl: '',
    buildUrl: (query) =>
      `https://www.google.com/search?q=${encodeURIComponent(
        `${query} careers`
      )}`,
  },
];
