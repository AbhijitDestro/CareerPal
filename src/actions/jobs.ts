"use server";

export interface Job {
  id: string;
  title: string;
  location: string;
  snippet: string;
  salary: string;
  source: string;
  type: string;
  link: string;
  company: string;
  updated: string;
}

interface JoobleResponse {
  totalCount: number;
  jobs: Job[];
}

export async function searchJobs(keywords: string, location: string): Promise<Job[]> {
  const apiKey = process.env.JOOBLE_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const url = `https://jooble.org/api/${apiKey}`;
  const params = {
    keywords: keywords,
    location: location,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
        throw new Error(`Jooble API error: ${response.statusText}`);
    }

    const data: JoobleResponse = await response.json();
    // Jooble might return null or different structure if no jobs found, but usually 'jobs' array
    return data.jobs || [];
  } catch (error) {
    console.error("Error searching jobs:", error);
    return [];
  }
}
