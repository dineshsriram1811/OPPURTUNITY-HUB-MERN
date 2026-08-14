const Opportunity = require("../models/Opportunity");
const fetchMuseInternships = require("../services/internships/muse.service");

exports.syncMuseInternships = async (req, res) => {
  try {
    const internships = await fetchMuseInternships();

    // Fetch existing The Muse titles and companies for instant duplicate checking
    const existingOpps = await Opportunity.find({ source: "The Muse" }, "title companyName").lean();
    const existingSet = new Set(existingOpps.map((o) => `${o.title}||${o.companyName}`));

    let added = 0;
    let skipped = 0;
    let failed = 0;

    for (const internship of internships) {
      const key = `${internship.title}||${internship.companyName}`;
      if (existingSet.has(key)) {
        skipped++;
        continue;
      }

      try {
        await Opportunity.create(internship);
        existingSet.add(key);
        added++;
      } catch (itemErr) {
        console.error(`⚠️ [The Muse] Failed to insert item "${internship.title}":`, itemErr.message);
        failed++;
      }
    }

    res.json({
      success: true,
      provider: "The Muse",
      fetched: internships.length,
      added,
      skipped,
      failed
    });

  } catch (err) {
    console.error("❌ [The Muse Sync Error]:", err.message);

    res.status(500).json({
      success: false,
      provider: "The Muse",
      fetched: 0,
      added: 0,
      skipped: 0,
      failed: 0,
      message: `Muse API request failed: ${err.message}`
    });
  }
};
