/**
 * Demo Data Generator for Opportunity Hub
 * ─────────────────────────────────────────
 * Idempotently seeds demo opportunities with future deadlines across
 * supported categories (Jobs, Internships, Freelancing, Hackathons, Scholarships).
 */

const demoOpportunities = [
  // ─── DEMO OPPORTUNITIES WITH FUTURE DEADLINES ──────────────────────
  {
    title: 'Frontend Developer Intern',
    companyName: 'TechNova',
    companyLogo: 'https://ui-avatars.com/api/?name=TechNova&background=2563eb&color=fff&size=200',
    category: 'Internships',
    type: 'internship',
    description: 'Join TechNova as a Frontend Developer Intern. You will work with React, TypeScript, and modern CSS frameworks to build responsive, accessible web interfaces.',
    requiredSkills: ['React', 'TypeScript', 'HTML/CSS', 'Tailwind CSS'],
    eligibility: 'Pursuing B.Tech/B.E in CS/IT or related technical field.',
    location: 'Remote',
    workMode: 'Remote',
    salary: '₹35,000/month',
    salaryMin: 35000,
    salaryMax: 35000,
    applicationDeadline: new Date('2026-09-05T23:59:59.000Z'),
    applyLink: 'https://technova.example.com/careers',
    contactEmail: 'careers@technova.example.com',
    status: 'Active',
    isFeatured: true,
    isDemo: true,
  },
  {
    title: 'Full Stack Developer',
    companyName: 'CloudSphere',
    companyLogo: 'https://ui-avatars.com/api/?name=CloudSphere&background=0284c7&color=fff&size=200',
    category: 'Jobs',
    type: 'job',
    description: 'Build scalable full-stack applications with React, Node.js, and cloud services at CloudSphere. Architect distributed services and optimize API response times.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    eligibility: 'B.Tech/M.Tech with 1-3 years software engineering experience.',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    salary: '₹18,00,000 – ₹24,00,000/year',
    salaryMin: 1800000,
    salaryMax: 2400000,
    applicationDeadline: new Date('2026-09-12T23:59:59.000Z'),
    applyLink: 'https://cloudsphere.example.com/jobs',
    contactEmail: 'jobs@cloudsphere.example.com',
    status: 'Active',
    isFeatured: true,
    isDemo: true,
  },
  {
    title: 'React Developer Freelancer',
    companyName: 'DevWorks',
    companyLogo: 'https://ui-avatars.com/api/?name=DevWorks&background=7c3aed&color=fff&size=200',
    category: 'Freelancing',
    type: 'freelancing',
    description: 'Freelance opportunity to build custom React dashboards and web components for enterprise clients. Flexible working hours and weekly milestone deliverables.',
    requiredSkills: ['React', 'Redux', 'Tailwind CSS', 'REST APIs'],
    eligibility: 'Proven React project portfolio with past client work.',
    location: 'Remote',
    workMode: 'Remote',
    salary: '₹50,000 – ₹80,000/project',
    salaryMin: 50000,
    salaryMax: 80000,
    applicationDeadline: new Date('2026-09-18T23:59:59.000Z'),
    applyLink: 'https://devworks.example.com/freelance',
    contactEmail: 'projects@devworks.example.com',
    status: 'Active',
    isFeatured: false,
    isDemo: true,
  },
  {
    title: 'AI Innovation Hackathon',
    companyName: 'InnovateX',
    companyLogo: 'https://ui-avatars.com/api/?name=InnovateX&background=db2777&color=fff&size=200',
    category: 'Hackathons',
    type: 'hackathon',
    description: '48-hour national AI hackathon focusing on generative AI and ML applications for real-world social impact. Cloud credits and 1-on-1 mentorship provided.',
    requiredSkills: ['Python', 'Machine Learning', 'GenAI', 'API Integration'],
    eligibility: 'Open to all students, freshers, and developer teams of 2-4 members.',
    location: 'Hybrid',
    workMode: 'Hybrid',
    salary: '₹3,00,000 Prize Pool',
    salaryMin: 300000,
    salaryMax: 300000,
    applicationDeadline: new Date('2026-09-25T23:59:59.000Z'),
    applyLink: 'https://innovatex.example.com/hackathon',
    contactEmail: 'hackathon@innovatex.example.com',
    status: 'Active',
    isFeatured: true,
    isDemo: true,
  },
  {
    title: 'Future Leaders Scholarship',
    companyName: 'EduFoundation',
    companyLogo: 'https://ui-avatars.com/api/?name=EduFoundation&background=059669&color=fff&size=200',
    category: 'Scholarships',
    type: 'scholarship',
    description: 'Merit-based scholarship for outstanding undergraduate students pursuing tech and engineering degrees. Provides full tuition support and leadership workshops.',
    requiredSkills: ['Academic Excellence', 'Leadership', 'Community Impact'],
    eligibility: 'Undergraduate students with CGPA ≥ 8.5 in STEM programs.',
    location: 'Remote',
    workMode: 'Remote',
    salary: '₹1,50,000/year',
    salaryMin: 150000,
    salaryMax: 150000,
    applicationDeadline: new Date('2026-10-01T23:59:59.000Z'),
    applyLink: 'https://edufoundation.example.com/scholarship',
    contactEmail: 'scholarships@edufoundation.example.com',
    status: 'Active',
    isFeatured: true,
    isDemo: true,
  },
  {
    title: 'Software Engineering Intern',
    companyName: 'CodeLabs',
    companyLogo: 'https://ui-avatars.com/api/?name=CodeLabs&background=ea580c&color=fff&size=200',
    category: 'Internships',
    type: 'internship',
    description: 'Internship opportunity working on core software products, database design, and high-throughput API endpoints under the guidance of senior architects.',
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Git'],
    eligibility: 'Pre-final or final year CS/IT students.',
    location: 'Hyderabad',
    workMode: 'Onsite',
    salary: '₹40,000/month',
    salaryMin: 40000,
    salaryMax: 40000,
    applicationDeadline: new Date('2026-10-08T23:59:59.000Z'),
    applyLink: 'https://codelabs.example.com/internships',
    contactEmail: 'careers@codelabs.example.com',
    status: 'Active',
    isFeatured: false,
    isDemo: true,
  },
  {
    title: 'Machine Learning Developer',
    companyName: 'DataSphere',
    companyLogo: 'https://ui-avatars.com/api/?name=DataSphere&background=4f46e5&color=fff&size=200',
    category: 'Jobs',
    type: 'job',
    description: 'Develop and deploy ML models for predictive analytics, computer vision, and NLP applications in high-performance production systems.',
    requiredSkills: ['Python', 'PyTorch', 'Scikit-learn', 'Docker', 'MLOps'],
    eligibility: 'B.Tech/M.Tech in CS/DS or quantitative field.',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    salary: '₹22,00,000 – ₹32,00,000/year',
    salaryMin: 2200000,
    salaryMax: 3200000,
    applicationDeadline: new Date('2026-10-15T23:59:59.000Z'),
    applyLink: 'https://datasphere.example.com/careers',
    contactEmail: 'hr@datasphere.example.com',
    status: 'Active',
    isFeatured: false,
    isDemo: true,
  },
  {
    title: 'Web Development Freelance Project',
    companyName: 'ProjectHub',
    companyLogo: 'https://ui-avatars.com/api/?name=ProjectHub&background=0891b2&color=fff&size=200',
    category: 'Freelancing',
    type: 'freelancing',
    description: 'Freelance web development project to redesign a high-converting e-commerce web application with modern UX and payment gateway integrations.',
    requiredSkills: ['React', 'Next.js', 'Node.js', 'Stripe'],
    eligibility: 'Full stack web development portfolio.',
    location: 'Remote',
    workMode: 'Remote',
    salary: '₹75,000 – ₹1,20,000/project',
    salaryMin: 75000,
    salaryMax: 120000,
    applicationDeadline: new Date('2026-10-20T23:59:59.000Z'),
    applyLink: 'https://projecthub.example.com/projects',
    contactEmail: 'info@projecthub.example.com',
    status: 'Active',
    isFeatured: false,
    isDemo: true,
  },

  // ─── ADDITIONAL DEMO OPPORTUNITIES ─────────────────────────────────────────
  {
    title: 'Senior Software Engineer – Full Stack',
    companyName: 'Razorpay',
    companyLogo: 'https://logo.clearbit.com/razorpay.com',
    category: 'Jobs', type: 'job',
    description: 'Join Razorpay\'s core engineering team to build scalable payment infrastructure used by millions of Indian businesses.',
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'System Design'],
    eligibility: 'B.Tech/M.Tech in CS/IT or equivalent. 3+ years full-stack experience.',
    location: 'Bengaluru', workMode: 'Hybrid',
    salary: '₹30,00,000 – ₹45,00,000/year', salaryMin: 3000000, salaryMax: 4500000,
    applicationDeadline: new Date('2026-09-15T23:59:59.000Z'),
    applyLink: 'https://razorpay.com/jobs/',
    contactEmail: 'careers@razorpay.com',
    status: 'Active', isFeatured: true, isDemo: true,
  },
  {
    title: 'Product Manager – Growth',
    companyName: 'Swiggy',
    companyLogo: 'https://logo.clearbit.com/swiggy.com',
    category: 'Jobs', type: 'job',
    description: 'Drive Swiggy\'s customer acquisition and retention strategy as a Growth PM.',
    requiredSkills: ['Product Strategy', 'A/B Testing', 'SQL', 'Analytics', 'User Research'],
    eligibility: 'MBA or equivalent with 2+ years as PM in a consumer tech company.',
    location: 'Bengaluru', workMode: 'Onsite',
    salary: '₹28,00,000 – ₹38,00,000/year', salaryMin: 2800000, salaryMax: 3800000,
    applicationDeadline: new Date('2026-09-20T23:59:59.000Z'),
    applyLink: 'https://careers.swiggy.com/',
    contactEmail: 'talent@swiggy.com',
    status: 'Active', isFeatured: true, isDemo: true,
  },
  {
    title: 'Machine Learning Engineer',
    companyName: 'Google India',
    companyLogo: 'https://logo.clearbit.com/google.com',
    category: 'Jobs', type: 'job',
    description: 'Work on large-scale ML systems that power Google Search, Ads, and Assistant.',
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Distributed Systems'],
    eligibility: 'M.Tech/PhD in CS, Statistics, or related field.',
    location: 'Hyderabad', workMode: 'Hybrid',
    salary: '₹50,00,000 – ₹80,00,000/year', salaryMin: 5000000, salaryMax: 8000000,
    applicationDeadline: new Date('2026-10-01T23:59:59.000Z'),
    applyLink: 'https://careers.google.com/',
    contactEmail: 'university-recruiting@google.com',
    status: 'Active', isFeatured: true, isDemo: true,
  },
  {
    title: 'Smart India Hackathon 2026 – Software Edition',
    companyName: 'Ministry of Education, Govt. of India',
    companyLogo: 'https://logo.clearbit.com/sih.gov.in',
    category: 'Hackathons', type: 'hackathon',
    description: 'India\'s biggest hackathon invites student teams to solve problem statements from government ministries and PSUs.',
    requiredSkills: ['Any Tech Stack', 'Problem Solving', 'Teamwork', 'Presentation Skills'],
    eligibility: 'Teams of 2–6 students from any recognised college.',
    location: 'Pan India (Multiple Venues)', workMode: 'Onsite',
    salary: '₹1,00,000 prize per winner', salaryMin: 100000, salaryMax: 100000,
    applicationDeadline: new Date('2026-10-25T23:59:59.000Z'),
    applyLink: 'https://www.sih.gov.in/',
    contactEmail: 'support@sih.gov.in',
    status: 'Active', isFeatured: true, isDemo: true,
  },
  {
    title: 'National Scholarship for Engineering Excellence',
    companyName: 'Tata Trusts',
    companyLogo: 'https://logo.clearbit.com/tatatrusts.org',
    category: 'Scholarships', type: 'scholarship',
    description: 'Tata Trusts\' flagship scholarship programme supports meritorious engineering students nationwide.',
    requiredSkills: ['Academic Excellence', 'Leadership', 'Community Service'],
    eligibility: 'First-year B.Tech students from EWS/OBC.',
    location: 'Pan India', workMode: 'Remote',
    salary: '₹2,50,000/year', salaryMin: 250000, salaryMax: 250000,
    applicationDeadline: new Date('2026-10-30T23:59:59.000Z'),
    applyLink: 'https://www.tatatrusts.org/',
    contactEmail: 'scholarships@tatatrusts.org',
    status: 'Active', isFeatured: true, isDemo: true,
  },
];

/**
 * Idempotently seeds demo opportunities in MongoDB.
 * Safe to run multiple times — updates existing records without creating duplicates.
 */
const generateDemoOpportunities = async () => {
  const Opportunity = require('../models/Opportunity');
  const User = require('../models/User');
  const Bookmark = require('../models/Bookmark');
  const Application = require('../models/Application');

  const seededOpps = [];

  for (const opp of demoOpportunities) {
    const oppData = {
      ...opp,
      locationType: (opp.workMode || 'Remote').toLowerCase(),
      skills: opp.requiredSkills || opp.skills || [],
      requiredSkills: opp.requiredSkills || opp.skills || [],
      status: 'Active',
      isActive: true,
      isDemo: true,
    };

    const doc = await Opportunity.findOneAndUpdate(
      { title: opp.title, companyName: opp.companyName },
      { $set: oppData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    seededOpps.push(doc);
  }

  // Ensure any existing student users have some demo opportunities saved/applied
  // so the calendar isn't empty when they view it initially
  try {
    const students = await User.find({ role: 'student' });
    for (const student of students) {
      const existingBookmarks = await Bookmark.countDocuments({ user: student._id });
      if (existingBookmarks === 0 && seededOpps.length >= 3) {
        await Bookmark.create([
          { user: student._id, opportunity: seededOpps[0]._id },
          { user: student._id, opportunity: seededOpps[2]._id },
          { user: student._id, opportunity: seededOpps[4]._id },
        ]).catch(() => {});
      }

      const existingApps = await Application.countDocuments({ student: student._id });
      if (existingApps === 0 && seededOpps.length >= 4) {
        await Application.create([
          { student: student._id, opportunity: seededOpps[1]._id, status: 'applied', statusHistory: [{ status: 'applied', note: 'Application submitted' }] },
          { student: student._id, opportunity: seededOpps[3]._id, status: 'applied', statusHistory: [{ status: 'applied', note: 'Application submitted' }] },
        ]).catch(() => {});
      }
    }
  } catch (userErr) {
    console.error('Bookmark/application seed error:', userErr.message);
  }

  return { alreadyGenerated: false, count: seededOpps.length };
};

// ── CLI Entry Point ───────────────────────────────────────────────────────────
if (require.main === module) {
  const mongoose = require('mongoose');
  const connectDB = require('../config/db');
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

  (async () => {
    try {
      await connectDB();
      const res = await generateDemoOpportunities();
      console.log(`🎉 Demo opportunities seeded successfully! (${res.count} items)`);
    } catch (err) {
      console.error('❌ Error seeding demo opportunities:', err.message);
      process.exit(1);
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  })();
}

module.exports = { generateDemoOpportunities };