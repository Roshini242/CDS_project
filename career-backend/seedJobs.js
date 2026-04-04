const mongoose = require("mongoose");
const Job      = require("./models/Job");
const User     = require("./models/User");
require("dotenv").config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/careerdev");

  const admin = await User.findOne({ role: "admin" });
  if (!admin) { console.log("❌ No admin found. Run node createAdmin.js first!"); process.exit(1); }

  await Job.deleteMany({});

  const jobs = [
    {
      title: "Backend Developer", company: "TCS", type: "Full-time",
      location: "Chennai", salary: "₹25,000/month",
      description: "Build scalable backend services using Node.js and Python.",
      tags: ["Java","Node.js","Python","MySQL","MongoDB","RESTful APIs","Database Management","Server-side Development","Problem Solving","Debugging"],
      rounds: [
        { step:1, name:"Online Aptitude Test",  description:"Quantitative aptitude, logical reasoning and verbal ability" },
        { step:2, name:"Technical Round (TR)",  description:"Core CS concepts, data structures, algorithms and coding questions" },
        { step:3, name:"Managerial Round (MR)", description:"Project discussion, problem solving and situational questions" },
        { step:4, name:"HR Round",              description:"Salary negotiation, company policies and cultural fit" },
      ],
      postedBy: admin._id,
    },
    {
      title: "Frontend Developer", company: "Zoho", type: "Full-time",
      location: "Chennai", salary: "₹30,000/month",
      description: "Build responsive web UIs using React and modern CSS.",
      tags: ["HTML","CSS","JavaScript","React","TypeScript"],
      rounds: [
        { step:1, name:"Written Test",        description:"General aptitude and basic programming logic" },
        { step:2, name:"Programming Test",    description:"Hands-on coding in C/C++/Java/Python — problem solving" },
        { step:3, name:"Technical Interview", description:"Deep dive into your code, projects and CS fundamentals" },
        { step:4, name:"HR Interview",        description:"Background check, cultural fit and offer discussion" },
      ],
      postedBy: admin._id,
    },
    {
      title: "Data Analyst Intern", company: "Infosys", type: "Internship",
      location: "Bangalore", salary: "₹15,000/month",
      description: "Analyse large datasets and build business intelligence reports.",
      tags: ["Python","SQL","Excel","Power BI","Statistics"],
      rounds: [
        { step:1, name:"Online Test (HackerRank)", description:"Aptitude, reasoning and basic coding questions" },
        { step:2, name:"Technical Interview",      description:"Python, SQL queries, data analysis concepts" },
        { step:3, name:"HR Interview",             description:"Communication skills, internship expectations and offer" },
      ],
      postedBy: admin._id,
    },
    {
      title: "UI/UX Designer", company: "Wipro", type: "Full-time",
      location: "Hybrid", salary: "₹5 LPA",
      description: "Design user-centric interfaces and experiences for enterprise apps.",
      tags: ["Figma","Adobe XD","Wireframing","Prototyping","User Research"],
      rounds: [
        { step:1, name:"Aptitude Test",       description:"Quantitative, verbal and logical reasoning" },
        { step:2, name:"Technical Interview", description:"Portfolio review, design process and tools discussion" },
        { step:3, name:"HR Interview",        description:"Culture fit, salary discussion and onboarding" },
      ],
      postedBy: admin._id,
    },
    {
      title: "Full Stack Developer", company: "Cognizant", type: "Full-time",
      location: "Mumbai", salary: "₹7 LPA",
      description: "Work on end-to-end web development projects for global clients.",
      tags: ["React","Node.js","MongoDB","Express","REST APIs","Git"],
      rounds: [
        { step:1, name:"Aptitude Test",       description:"Verbal, quantitative and logical reasoning test" },
        { step:2, name:"Technical Interview", description:"Full stack concepts, coding problems and system design" },
        { step:3, name:"HR Interview",        description:"Background verification and final offer" },
      ],
      postedBy: admin._id,
    },
    {
      title: "ML Engineer Intern", company: "Accenture", type: "Internship",
      location: "Remote", salary: "₹12,000/month",
      description: "Build and deploy machine learning models for AI solutions.",
      tags: ["Python","TensorFlow","Scikit-learn","Machine Learning","Data Preprocessing"],
      rounds: [
        { step:1, name:"Communication Assessment", description:"English proficiency and communication skills test" },
        { step:2, name:"Technical Interview",      description:"ML concepts, Python, project-based questions" },
        { step:3, name:"HR Interview",             description:"Internship terms, expectations and final selection" },
      ],
      postedBy: admin._id,
    },
    {
      title: "Mobile App Developer", company: "HCL Technologies", type: "Full-time",
      location: "Noida", salary: "₹6.5 LPA",
      description: "Develop cross-platform mobile applications using React Native.",
      tags: ["React Native","JavaScript","Android","iOS","Firebase","REST APIs"],
      rounds: [
        { step:1, name:"Aptitude Test",       description:"Quantitative aptitude and logical reasoning" },
        { step:2, name:"Group Discussion",    description:"Topic-based discussion to evaluate communication and teamwork" },
        { step:3, name:"Technical Interview", description:"Mobile dev concepts, project discussion and live coding" },
        { step:4, name:"HR Interview",        description:"Salary, bond and joining formalities" },
      ],
      postedBy: admin._id,
    },
    {
      title: "DevOps Engineer", company: "Capgemini", type: "Full-time",
      location: "Pune", salary: "₹8 LPA",
      description: "Manage CI/CD pipelines, cloud infrastructure and deployments.",
      tags: ["Docker","Kubernetes","AWS","CI/CD","Linux","Terraform","Jenkins"],
      rounds: [
        { step:1, name:"Pseudo Code Test",    description:"Logic building and pseudo code writing assessment" },
        { step:2, name:"Technical Interview", description:"DevOps tools, cloud concepts and scenario-based questions" },
        { step:3, name:"HR Interview",        description:"Background check, offer letter and joining date" },
      ],
      postedBy: admin._id,
    },
  ];

  await Job.insertMany(jobs);
  console.log(`✅ ${jobs.length} jobs seeded with interview rounds!`);
  mongoose.disconnect();
  process.exit(0);
};

seed();