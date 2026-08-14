const Opportunity = require("../models/Opportunity");
const fetchGreenhouseJobs = require("../services/jobs/greenHouse.service");

exports.syncGreenhouseJobs = async (req, res) => {
  try {
    const jobs = await fetchGreenhouseJobs();

    // Fetch existing Greenhouse titles and companies for instant duplicate checking
    const existingOpps = await Opportunity.find({ source: "Greenhouse" }, "title companyName").lean();
    const existingSet = new Set(existingOpps.map((o) => `${o.title}||${o.companyName}`));

    let added = 0;
    let skipped = 0;
    let failed = 0;

    for (const job of jobs) {
      const key = `${job.title}||${job.companyName}`;
      if (existingSet.has(key)) {
        skipped++;
        continue;
      }

      try {
        await Opportunity.create(job);
        existingSet.add(key);
        added++;
      } catch (itemErr) {
        console.error(`⚠️ [Greenhouse] Failed to insert item "${job.title}":`, itemErr.message);
        failed++;
      }
    }

    res.json({
      success: true,
      provider: "Greenhouse",
      fetched: jobs.length,
      added,
      skipped,
      failed
    });

  } catch (err) {
    console.error("❌ [Greenhouse Sync Error]:", err.message);

    res.status(500).json({
      success: false,
      provider: "Greenhouse",
      fetched: 0,
      added: 0,
      skipped: 0,
      failed: 0,
      message: `Greenhouse API request failed: ${err.message}`
    });
  }
};
