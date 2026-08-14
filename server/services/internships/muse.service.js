const axios = require("axios");

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

const fetchMuseInternships = async () => {
  const startTime = Date.now();
  let internships = [];
  let page = 1;
  let hasNext = true;
  const maxPages = Number(process.env.MUSE_MAX_PAGES || 5); // 5 pages * 20 results = 100 internship listings
  const perPageTimeout = Number(process.env.SYNC_API_TIMEOUT || 10000) / 2; // e.g. 5000ms

  console.log(`[The Muse] Starting internship sync (max ${maxPages} pages)...`);

  while (hasNext && page <= maxPages) {
    const pageStartTime = Date.now();
    const url = `https://www.themuse.com/api/public/jobs?level=Internship&page=${page}`;
    try {
      const { data, status } = await axios.get(url, {
        timeout: perPageTimeout,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json"
        }
      });

      const rawJobs = Array.isArray(data?.results) ? data.results : [];
      const elapsed = Date.now() - pageStartTime;

      console.log(`✅ [The Muse] Provider: The Muse | Page: ${page} | Status: ${status} | Count: ${rawJobs.length} | Elapsed: ${elapsed}ms`);

      const formatted = rawJobs.map((job) => {
        const decodedContent = decodeEntities(job.contents);
        const rawDesc = decodedContent || `${job.name} at ${job.company?.name || "Unknown"}`;
        const description = String(rawDesc).substring(0, 6000);
        const locName = job.locations?.length ? job.locations[0].name : "Remote";
        const workMode = locName.toLowerCase().includes("remote") ? "Remote" : (locName.toLowerCase().includes("onsite") ? "Onsite" : "Hybrid");


        return {
          title: String(job.name || "Untitled Internship").trim().substring(0, 200),
          companyName: String(job.company?.name || "Unknown Company").trim(),
          companyLogo: "",
          description: description || "No description available",
          location: locName,
          workMode: workMode,
          locationType: workMode.toLowerCase(),
          applyLink: job.refs?.landing_page || "",
          applicationDeadline: null,
          type: "internship",
          category: "Internships",
          requiredSkills: [],
          skills: [],
          status: "Active",
          isActive: true,
          isFeatured: false,
          salary: "",
          source: "The Muse"
        };
      });

      internships.push(...formatted);
      hasNext = page < (data.page_count || 0);
      page++;

    } catch (err) {
      const elapsed = Date.now() - pageStartTime;
      console.error(`❌ [The Muse] Provider: The Muse | Page: ${page} | Error: ${err.message} | Elapsed: ${elapsed}ms`);
      break;
    }
  }

  const totalElapsed = Date.now() - startTime;
  console.log(`✅ [The Muse] Total internships fetched: ${internships.length} in ${totalElapsed}ms`);
  return internships;
};

module.exports = fetchMuseInternships;