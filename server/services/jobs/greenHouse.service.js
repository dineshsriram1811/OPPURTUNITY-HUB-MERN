const axios = require("axios");

// Active public Greenhouse company boards
const COMPANY_BOARDS = [
  "stripe",
  "discord",
  "dropbox",
  "figma",
  "coinbase",
  "datadog",
  "airbnb",
  "gitlab"
];

function decodeEntities(str) {
  if (!str) return '';
  return String(str)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
}

const fetchGreenhouseJobs = async () => {
  const startTime = Date.now();
  const perBoardTimeout = Number(process.env.SYNC_API_TIMEOUT || 10000) / 2; // e.g., 5000ms per board
  console.log(`[Greenhouse] Starting sync across ${COMPANY_BOARDS.length} company boards...`);

  const fetchPromises = COMPANY_BOARDS.map(async (company) => {
    const boardStartTime = Date.now();
    const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`;
    try {
      const { data, status } = await axios.get(url, {
        timeout: perBoardTimeout,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json"
        }
      });

      const rawJobs = Array.isArray(data?.jobs) ? data.jobs : [];
      const companyDisplayName = company.charAt(0).toUpperCase() + company.slice(1);
      const elapsed = Date.now() - boardStartTime;

      console.log(`✅ [Greenhouse] Provider: Greenhouse | Board: ${company} | Status: ${status} | Count: ${rawJobs.length} | Elapsed: ${elapsed}ms`);

      return rawJobs.map((job) => {
        const decodedContent = decodeEntities(job.content);
        const rawDesc = decodedContent || `${job.title} position at ${companyDisplayName}. Apply directly on Greenhouse.`;
        const description = String(rawDesc).substring(0, 6000);
        const locName = job.location?.name || "Remote";
        const workMode = locName.toLowerCase().includes("remote") ? "Remote" : (locName.toLowerCase().includes("hybrid") ? "Hybrid" : "Onsite");

        return {
          title: String(job.title || "Untitled Job").trim().substring(0, 200),
          companyName: companyDisplayName,
          companyLogo: "",
          description: description || "No description available",
          location: locName,
          workMode: workMode,
          locationType: workMode.toLowerCase(),
          applyLink: job.absolute_url || `https://boards.greenhouse.io/${company}/jobs/${job.id}`,
          applicationDeadline: job.application_deadline ? new Date(job.application_deadline) : null,
          education: job.education ? String(job.education) : undefined,
          type: "job",
          category: "Jobs",
          requiredSkills: [],
          skills: [],
          status: "Active",
          isActive: true,
          isFeatured: false,
          salary: "",
          source: "Greenhouse"
        };
      });

    } catch (err) {
      const elapsed = Date.now() - boardStartTime;
      console.error(`❌ [Greenhouse] Provider: Greenhouse | Board: ${company} | Error: ${err.message} | Elapsed: ${elapsed}ms`);
      return [];
    }
  });

  const results = await Promise.allSettled(fetchPromises);
  let allJobs = [];

  for (const result of results) {
    if (result.status === "fulfilled" && Array.isArray(result.value)) {
      allJobs.push(...result.value);
    }
  }

  const totalElapsed = Date.now() - startTime;
  console.log(`✅ [Greenhouse] Total jobs fetched: ${allJobs.length} in ${totalElapsed}ms`);
  return allJobs;
};

module.exports = fetchGreenhouseJobs;