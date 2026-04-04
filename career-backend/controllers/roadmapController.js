const User = require("../models/User");

const roadmaps = {

  // ── 1. Web Developer ──────────────────────────────────────────────────────
  webdev: {
    label: "Web Developer",
    icon: "🌐",
    description: "Build modern websites and web applications",
    steps: [
      {
        id: "html_css",
        title: "HTML & CSS Basics",
        description: "Learn structure and styling of web pages.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive Design"],
        resources: [
          { title: "MDN Web Docs - HTML",      url: "https://developer.mozilla.org/en-US/docs/Learn/HTML", type: "docs"    },
          { title: "FreeCodeCamp HTML & CSS",  url: "https://www.freecodecamp.org/learn/responsive-web-design", type: "course" },
          { title: "W3Schools HTML Tutorial",  url: "https://www.w3schools.com/html", type: "tutorial" },
          { title: "CSS Tricks",               url: "https://css-tricks.com", type: "blog" },
        ],
        projects: ["Personal Portfolio Website", "Responsive Landing Page"],
      },
      {
        id: "javascript",
        title: "JavaScript Fundamentals",
        description: "Core programming concepts, DOM, ES6+.",
        duration: "3 weeks",
        difficulty: "Beginner",
        skills: ["ES6+", "DOM Manipulation", "Fetch API", "Async/Await"],
        resources: [
          { title: "JavaScript.info",          url: "https://javascript.info", type: "docs"   },
          { title: "FreeCodeCamp JavaScript",  url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures", type: "course" },
          { title: "Eloquent JavaScript",      url: "https://eloquentjavascript.net", type: "book" },
        ],
        projects: ["To-Do App", "Weather App using API"],
      },
      {
        id: "react",
        title: "React Framework",
        description: "Component-based UI development.",
        duration: "3 weeks",
        difficulty: "Intermediate",
        skills: ["Components", "Hooks", "State Management", "React Router"],
        resources: [
          { title: "Official React Docs",      url: "https://react.dev", type: "docs"   },
          { title: "Scrimba React Course",     url: "https://scrimba.com/learn/learnreact", type: "course" },
          { title: "React Tutorial - W3Schools", url: "https://www.w3schools.com/react", type: "tutorial" },
        ],
        projects: ["Movie Search App", "E-Commerce Frontend"],
      },
      {
        id: "nodejs",
        title: "Node.js & Express",
        description: "Backend development with JavaScript.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["REST APIs", "Middleware", "Authentication", "File Upload"],
        resources: [
          { title: "Node.js Official Docs",    url: "https://nodejs.org/en/docs", type: "docs"   },
          { title: "Express.js Guide",         url: "https://expressjs.com/en/guide/routing.html", type: "docs" },
          { title: "The Odin Project - Node",  url: "https://www.theodinproject.com/paths/full-stack-javascript", type: "course" },
        ],
        projects: ["REST API for Todo App", "User Auth System"],
      },
      {
        id: "mongodb",
        title: "MongoDB & Databases",
        description: "NoSQL database for modern apps.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["CRUD Operations", "Mongoose ODM", "Aggregation", "Indexes"],
        resources: [
          { title: "MongoDB University",       url: "https://university.mongodb.com", type: "course" },
          { title: "Mongoose Docs",            url: "https://mongoosejs.com/docs", type: "docs" },
          { title: "MongoDB Manual",           url: "https://www.mongodb.com/docs/manual", type: "docs" },
        ],
        projects: ["Blog with Database", "Student Management System"],
      },
      {
        id: "deployment",
        title: "Deployment & DevOps",
        description: "Deploy apps using Vercel or Netlify.",
        duration: "1 week",
        difficulty: "Intermediate",
        skills: ["Git", "CI/CD", "Environment Variables", "Domain Setup"],
        resources: [
          { title: "Vercel Docs",              url: "https://vercel.com/docs", type: "docs" },
          { title: "Render Deployment Guide",  url: "https://render.com/docs", type: "docs" },
          { title: "GitHub Actions Guide",     url: "https://docs.github.com/en/actions", type: "docs" },
        ],
        projects: ["Deploy Your Portfolio", "Deploy Full Stack App"],
      },
    ],
  },

  // ── 2. Data Scientist ─────────────────────────────────────────────────────
  datascience: {
    label: "Data Scientist",
    icon: "📊",
    description: "Analyze data and build machine learning models",
    steps: [
      {
        id: "python",
        title: "Python Basics",
        description: "Learn Python programming for data analysis.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["Variables", "Loops", "Functions", "File Handling", "OOP"],
        resources: [
          { title: "Python Official Tutorial",  url: "https://docs.python.org/3/tutorial", type: "docs"    },
          { title: "FreeCodeCamp Python",       url: "https://www.freecodecamp.org/learn/scientific-computing-with-python", type: "course" },
          { title: "W3Schools Python",          url: "https://www.w3schools.com/python", type: "tutorial" },
          { title: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com", type: "book" },
        ],
        projects: ["Calculator App", "Student Grade Tracker"],
      },
      {
        id: "statistics",
        title: "Statistics & Mathematics",
        description: "Probability, linear algebra, and calculus.",
        duration: "3 weeks",
        difficulty: "Beginner",
        skills: ["Probability", "Descriptive Stats", "Linear Algebra", "Calculus Basics"],
        resources: [
          { title: "Khan Academy Statistics",  url: "https://www.khanacademy.org/math/statistics-probability", type: "course" },
          { title: "StatQuest YouTube",        url: "https://www.youtube.com/@statquest", type: "video" },
          { title: "Think Stats - Free Book",  url: "https://greenteapress.com/thinkstats", type: "book" },
        ],
        projects: ["Statistical Analysis Report", "Probability Calculator"],
      },
      {
        id: "pandas",
        title: "Pandas & NumPy",
        description: "Data manipulation and numerical computing.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["DataFrames", "Data Cleaning", "Merging", "NumPy Arrays", "Broadcasting"],
        resources: [
          { title: "Pandas Official Docs",     url: "https://pandas.pydata.org/docs", type: "docs"    },
          { title: "NumPy Official Docs",      url: "https://numpy.org/doc/stable", type: "docs"    },
          { title: "Kaggle Pandas Course",     url: "https://www.kaggle.com/learn/pandas", type: "course" },
        ],
        projects: ["Sales Data Analysis", "COVID Data Dashboard"],
      },
      {
        id: "ml",
        title: "Machine Learning",
        description: "Supervised and unsupervised learning algorithms.",
        duration: "4 weeks",
        difficulty: "Intermediate",
        skills: ["Linear Regression", "Decision Trees", "KNN", "SVM", "Scikit-learn"],
        resources: [
          { title: "Scikit-learn Docs",        url: "https://scikit-learn.org/stable", type: "docs"    },
          { title: "Kaggle ML Course",         url: "https://www.kaggle.com/learn/intro-to-machine-learning", type: "course" },
          { title: "Andrew Ng ML Course",      url: "https://www.coursera.org/learn/machine-learning", type: "course" },
        ],
        projects: ["House Price Prediction", "Email Spam Classifier"],
      },
      {
        id: "deeplearning",
        title: "Deep Learning",
        description: "Neural networks with TensorFlow and PyTorch.",
        duration: "4 weeks",
        difficulty: "Advanced",
        skills: ["Neural Networks", "CNN", "RNN", "LSTM", "TensorFlow", "PyTorch"],
        resources: [
          { title: "TensorFlow Official Docs", url: "https://www.tensorflow.org/learn", type: "docs"    },
          { title: "PyTorch Tutorials",        url: "https://pytorch.org/tutorials", type: "docs"    },
          { title: "Deep Learning Specialization", url: "https://www.coursera.org/specializations/deep-learning", type: "course" },
        ],
        projects: ["Image Classifier", "Sentiment Analysis Model"],
      },
      {
        id: "visualization",
        title: "Data Visualization",
        description: "Create charts, graphs and dashboards.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["Matplotlib", "Seaborn", "Plotly", "Tableau Basics", "Power BI"],
        resources: [
          { title: "Matplotlib Docs",          url: "https://matplotlib.org/stable/tutorials", type: "docs"    },
          { title: "Seaborn Tutorial",         url: "https://seaborn.pydata.org/tutorial.html", type: "docs"   },
          { title: "Plotly Python Docs",       url: "https://plotly.com/python", type: "docs"    },
        ],
        projects: ["Sales Dashboard", "COVID Visualization Report"],
      },
    ],
  },

  // ── 3. UI/UX Designer ─────────────────────────────────────────────────────
  uiux: {
    label: "UI/UX Designer",
    icon: "🎨",
    description: "Design beautiful and user-friendly interfaces",
    steps: [
      {
        id: "design_principles",
        title: "Design Principles",
        description: "Color theory, typography, layout and visual hierarchy.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["Color Theory", "Typography", "Visual Hierarchy", "Grid System", "White Space"],
        resources: [
          { title: "Google UX Design Certificate", url: "https://www.coursera.org/professional-certificates/google-ux-design", type: "course" },
          { title: "Canva Design School",          url: "https://www.canva.com/learn/design", type: "tutorial" },
          { title: "Laws of UX",                   url: "https://lawsofux.com", type: "docs" },
        ],
        projects: ["Brand Style Guide", "Color Palette Collection"],
      },
      {
        id: "figma",
        title: "Figma Mastery",
        description: "Learn the industry-standard design tool.",
        duration: "3 weeks",
        difficulty: "Beginner",
        skills: ["Frames & Layers", "Components", "Auto Layout", "Variables", "Prototyping"],
        resources: [
          { title: "Figma Official Tutorials",  url: "https://help.figma.com/hc/en-us/categories/360002051613", type: "docs"    },
          { title: "Figma YouTube Channel",     url: "https://www.youtube.com/@Figma", type: "video"  },
          { title: "FigJam Community",          url: "https://www.figma.com/community", type: "tutorial" },
        ],
        projects: ["Mobile App Mockup", "Dashboard UI Design"],
      },
      {
        id: "user_research",
        title: "User Research",
        description: "Understand your users through research methods.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["User Interviews", "Surveys", "Personas", "Empathy Maps", "Usability Testing"],
        resources: [
          { title: "Nielsen Norman Group",      url: "https://www.nngroup.com/articles", type: "blog"    },
          { title: "UX Research Methods",       url: "https://www.usertesting.com/blog/ux-research-methods", type: "blog" },
          { title: "Interaction Design Foundation", url: "https://www.interaction-design.org", type: "course" },
        ],
        projects: ["User Persona Document", "Usability Test Report"],
      },
      {
        id: "prototyping",
        title: "Prototyping & Wireframing",
        description: "Create interactive prototypes and wireframes.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Low-fi Wireframes", "High-fi Prototypes", "User Flows", "Click Prototypes"],
        resources: [
          { title: "Figma Prototyping Guide",   url: "https://help.figma.com/hc/en-us/articles/360040314193", type: "docs"    },
          { title: "InVision Learn",            url: "https://www.invisionapp.com/inside-design", type: "blog"   },
          { title: "Balsamiq Wireframing",      url: "https://balsamiq.com/learn/courses/wireframing", type: "tutorial" },
        ],
        projects: ["App Wireframe Set", "Interactive Prototype for E-Commerce"],
      },
      {
        id: "design_systems",
        title: "Design Systems",
        description: "Build consistent component libraries.",
        duration: "2 weeks",
        difficulty: "Advanced",
        skills: ["Component Libraries", "Style Guides", "Tokens", "Documentation", "Storybook"],
        resources: [
          { title: "Material Design System",    url: "https://m3.material.io", type: "docs"    },
          { title: "Atlassian Design System",   url: "https://atlassian.design", type: "docs"    },
          { title: "Design Systems Repo",       url: "https://designsystemsrepo.com", type: "blog" },
        ],
        projects: ["UI Component Library", "Design System Documentation"],
      },
      {
        id: "portfolio",
        title: "Portfolio Building",
        description: "Showcase your best design work online.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Case Studies", "Behance", "Dribbble", "Portfolio Site", "Presentation Skills"],
        resources: [
          { title: "How to Build UX Portfolio", url: "https://www.nngroup.com/articles/ux-design-portfolios", type: "blog"    },
          { title: "Behance",                   url: "https://www.behance.net", type: "tutorial" },
          { title: "Dribbble",                  url: "https://dribbble.com", type: "tutorial" },
        ],
        projects: ["3 Full Case Studies", "Personal Portfolio Website"],
      },
    ],
  },

  // ── 4. Mobile App Developer ───────────────────────────────────────────────
  mobile: {
    label: "Mobile App Developer",
    icon: "📱",
    description: "Build Android and iOS mobile applications",
    steps: [
      {
        id: "mobile_basics",
        title: "Mobile Development Basics",
        description: "Understand mobile platforms, concepts and ecosystem.",
        duration: "1 week",
        difficulty: "Beginner",
        skills: ["Android vs iOS", "Mobile UX", "App Lifecycle", "Permissions", "Push Notifications"],
        resources: [
          { title: "Android Developer Guide",   url: "https://developer.android.com/guide", type: "docs"    },
          { title: "Apple Developer Docs",      url: "https://developer.apple.com/documentation", type: "docs" },
          { title: "Mobile UX Design Guide",    url: "https://www.nngroup.com/topic/mobile-devices", type: "blog" },
        ],
        projects: ["Research: iOS vs Android differences"],
      },
      {
        id: "react_native",
        title: "React Native",
        description: "Build cross-platform apps with JavaScript.",
        duration: "4 weeks",
        difficulty: "Intermediate",
        skills: ["Components", "Navigation", "Styling", "State", "Native Modules"],
        resources: [
          { title: "React Native Docs",         url: "https://reactnative.dev/docs/getting-started", type: "docs"    },
          { title: "Expo Docs",                 url: "https://docs.expo.dev", type: "docs"    },
          { title: "React Native School",       url: "https://www.reactnativeschool.com", type: "course" },
        ],
        projects: ["Weather Mobile App", "Notes App"],
      },
      {
        id: "mobile_ui",
        title: "Mobile UI Design",
        description: "Design for small screens and touch interactions.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["Touch Targets", "Gestures", "Navigation Patterns", "Screen Sizes", "Dark Mode"],
        resources: [
          { title: "Material Design for Mobile", url: "https://m3.material.io/foundations/adaptive-design/overview", type: "docs" },
          { title: "Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines", type: "docs" },
        ],
        projects: ["Mobile App UI Design in Figma"],
      },
      {
        id: "mobile_api",
        title: "REST API Integration",
        description: "Connect mobile apps to backend APIs.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Axios", "Fetch API", "JWT Auth", "Error Handling", "Caching"],
        resources: [
          { title: "Axios Docs",                url: "https://axios-http.com/docs/intro", type: "docs"    },
          { title: "React Query Docs",          url: "https://tanstack.com/query/latest", type: "docs"    },
        ],
        projects: ["Movie App with TMDB API", "News Reader App"],
      },
      {
        id: "firebase",
        title: "Firebase Backend",
        description: "Real-time database and authentication.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Firestore", "Authentication", "Storage", "Cloud Functions", "Analytics"],
        resources: [
          { title: "Firebase Docs",             url: "https://firebase.google.com/docs", type: "docs"    },
          { title: "Firebase React Native",     url: "https://rnfirebase.io", type: "docs"    },
        ],
        projects: ["Real-time Chat App", "Social Media Feed App"],
      },
      {
        id: "app_publish",
        title: "App Publishing",
        description: "Publish your app to Play Store and App Store.",
        duration: "1 week",
        difficulty: "Intermediate",
        skills: ["App Signing", "Store Listing", "Screenshots", "ASO", "Version Management"],
        resources: [
          { title: "Google Play Console Help", url: "https://support.google.com/googleplay/android-developer", type: "docs" },
          { title: "App Store Connect Help",   url: "https://developer.apple.com/help/app-store-connect", type: "docs" },
          { title: "Expo EAS Build",           url: "https://docs.expo.dev/build/introduction", type: "docs" },
        ],
        projects: ["Publish App to Play Store"],
      },
    ],
  },

  // ── 5. Cybersecurity Analyst ──────────────────────────────────────────────
  cybersecurity: {
    label: "Cybersecurity Analyst",
    icon: "🔐",
    description: "Protect systems and networks from cyber threats",
    steps: [
      {
        id: "networking",
        title: "Networking Basics",
        description: "TCP/IP, DNS, HTTP, firewalls and protocols.",
        duration: "3 weeks",
        difficulty: "Beginner",
        skills: ["TCP/IP", "DNS", "HTTP/HTTPS", "Firewalls", "VPN", "OSI Model"],
        resources: [
          { title: "Cisco Networking Basics",   url: "https://www.netacad.com/courses/networking", type: "course" },
          { title: "Professor Messer Network+", url: "https://www.professormesser.com/network-plus/n10-008/n10-008-video/n10-008-training-course", type: "video" },
          { title: "CompTIA Network+ Guide",    url: "https://www.comptia.org/certifications/network", type: "docs" },
        ],
        projects: ["Network Diagram Design", "Packet Analysis with Wireshark"],
      },
      {
        id: "linux",
        title: "Linux Fundamentals",
        description: "Command line, file system and system administration.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["Bash", "File Permissions", "Processes", "SSH", "Cron Jobs", "User Management"],
        resources: [
          { title: "Linux Journey",             url: "https://linuxjourney.com", type: "tutorial" },
          { title: "OverTheWire Bandit",        url: "https://overthewire.org/wargames/bandit", type: "tutorial" },
          { title: "The Linux Command Line",    url: "https://linuxcommand.org/tlcl.php", type: "book" },
        ],
        projects: ["Set Up Linux Server", "Write Bash Automation Scripts"],
      },
      {
        id: "ethical_hacking",
        title: "Ethical Hacking",
        description: "Penetration testing and vulnerability assessment.",
        duration: "4 weeks",
        difficulty: "Intermediate",
        skills: ["Reconnaissance", "Scanning", "Exploitation", "Post-Exploitation", "Reporting"],
        resources: [
          { title: "TryHackMe",                 url: "https://tryhackme.com", type: "course" },
          { title: "HackTheBox",                url: "https://www.hackthebox.com", type: "course" },
          { title: "OWASP Top 10",              url: "https://owasp.org/www-project-top-ten", type: "docs" },
        ],
        projects: ["CTF Challenge", "Vulnerable VM Penetration Test"],
      },
      {
        id: "cryptography",
        title: "Cryptography",
        description: "Encryption, hashing and secure communication.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Symmetric Encryption", "Asymmetric Encryption", "Hashing", "SSL/TLS", "PKI"],
        resources: [
          { title: "Cryptography I - Coursera", url: "https://www.coursera.org/learn/crypto", type: "course" },
          { title: "Khan Academy Cryptography", url: "https://www.khanacademy.org/computing/computer-science/cryptography", type: "course" },
        ],
        projects: ["Implement Caesar Cipher", "Build Password Hasher Tool"],
      },
      {
        id: "soc",
        title: "SOC & SIEM Tools",
        description: "Security operations center and monitoring tools.",
        duration: "3 weeks",
        difficulty: "Advanced",
        skills: ["SIEM", "Log Analysis", "Incident Response", "Threat Hunting", "Splunk"],
        resources: [
          { title: "Splunk Free Training",      url: "https://www.splunk.com/en_us/training/free-courses.html", type: "course" },
          { title: "Microsoft Sentinel Docs",   url: "https://learn.microsoft.com/en-us/azure/sentinel", type: "docs" },
          { title: "SANS SOC Resources",        url: "https://www.sans.org/security-resources", type: "blog" },
        ],
        projects: ["Set Up SIEM Lab", "Incident Response Report"],
      },
      {
        id: "security_cert",
        title: "Certifications",
        description: "Prepare for industry recognized certifications.",
        duration: "4 weeks",
        difficulty: "Advanced",
        skills: ["CompTIA Security+", "CEH", "CISSP Basics", "eJPT", "OSCP Basics"],
        resources: [
          { title: "CompTIA Security+ Guide",   url: "https://www.comptia.org/certifications/security", type: "docs" },
          { title: "Professor Messer Security+", url: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course", type: "video" },
          { title: "CEH Official Site",         url: "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh", type: "docs" },
        ],
        projects: ["Pass CompTIA Security+ Practice Exam", "Build Security Home Lab"],
      },
    ],
  },

  // ── 6. Cloud Engineer ─────────────────────────────────────────────────────
  cloud: {
    label: "Cloud Engineer",
    icon: "☁️",
    description: "Build and manage cloud infrastructure on AWS, Azure and GCP",
    steps: [
      {
        id: "cloud_basics",
        title: "Cloud Fundamentals",
        description: "Understand cloud concepts, models and providers.",
        duration: "1 week",
        difficulty: "Beginner",
        skills: ["IaaS", "PaaS", "SaaS", "Public Cloud", "Private Cloud", "Cloud Economics"],
        resources: [
          { title: "AWS Cloud Practitioner",    url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials", type: "course" },
          { title: "Google Cloud Fundamentals", url: "https://cloud.google.com/training/courses/cloud-digital-leader", type: "course" },
          { title: "Microsoft Azure Fundamentals", url: "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts", type: "course" },
        ],
        projects: ["Cloud Provider Comparison Report"],
      },
      {
        id: "aws",
        title: "AWS Core Services",
        description: "Learn key AWS services used in production.",
        duration: "4 weeks",
        difficulty: "Intermediate",
        skills: ["EC2", "S3", "RDS", "Lambda", "VPC", "IAM", "CloudWatch"],
        resources: [
          { title: "AWS Official Docs",         url: "https://docs.aws.amazon.com", type: "docs"    },
          { title: "AWS Free Tier",             url: "https://aws.amazon.com/free", type: "tutorial" },
          { title: "A Cloud Guru AWS",          url: "https://acloudguru.com/course/aws-certified-solutions-architect-associate-saa-c03", type: "course" },
        ],
        projects: ["Host Static Website on S3", "Deploy Node App on EC2"],
      },
      {
        id: "docker",
        title: "Docker & Containers",
        description: "Containerize applications for consistency.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Dockerfile", "Images", "Containers", "Docker Compose", "Volumes", "Networks"],
        resources: [
          { title: "Docker Official Docs",      url: "https://docs.docker.com", type: "docs"    },
          { title: "Play with Docker",          url: "https://labs.play-with-docker.com", type: "tutorial" },
          { title: "Docker Tutorial for Beginners", url: "https://docker-curriculum.com", type: "tutorial" },
        ],
        projects: ["Containerize a Node.js App", "Multi-container App with Docker Compose"],
      },
      {
        id: "kubernetes",
        title: "Kubernetes",
        description: "Orchestrate containers at scale.",
        duration: "3 weeks",
        difficulty: "Advanced",
        skills: ["Pods", "Deployments", "Services", "Ingress", "ConfigMaps", "Helm"],
        resources: [
          { title: "Kubernetes Official Docs",  url: "https://kubernetes.io/docs/home", type: "docs"    },
          { title: "Kubernetes by Example",     url: "https://kubernetesbyexample.com", type: "tutorial" },
          { title: "Play with Kubernetes",      url: "https://labs.play-with-k8s.com", type: "tutorial" },
        ],
        projects: ["Deploy App on Kubernetes Cluster", "Set Up Kubernetes with Minikube"],
      },
      {
        id: "ci_cd",
        title: "CI/CD Pipelines",
        description: "Automate testing and deployment workflows.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["GitHub Actions", "Jenkins", "Pipeline as Code", "Automated Testing", "Deployment Strategies"],
        resources: [
          { title: "GitHub Actions Docs",       url: "https://docs.github.com/en/actions", type: "docs"    },
          { title: "Jenkins Official Docs",     url: "https://www.jenkins.io/doc", type: "docs"    },
          { title: "CI/CD with GitHub Actions", url: "https://www.youtube.com/results?search_query=github+actions+tutorial", type: "video" },
        ],
        projects: ["Auto Deploy React App via GitHub Actions"],
      },
      {
        id: "cloud_cert",
        title: "AWS Certification",
        description: "Prepare for AWS Solutions Architect Associate exam.",
        duration: "4 weeks",
        difficulty: "Advanced",
        skills: ["Solutions Architecture", "High Availability", "Cost Optimization", "Security", "Well-Architected Framework"],
        resources: [
          { title: "AWS Exam Guide",            url: "https://aws.amazon.com/certification/certified-solutions-architect-associate", type: "docs" },
          { title: "Tutorials Dojo Practice",   url: "https://tutorialsdojo.com/aws-certified-solutions-architect-associate", type: "course" },
          { title: "AWS Whitepapers",           url: "https://aws.amazon.com/whitepapers", type: "docs" },
        ],
        projects: ["Pass AWS Practice Exam with 80%+", "Design a 3-Tier Architecture on AWS"],
      },
    ],
  },

  // ── 7. AI Engineer ────────────────────────────────────────────────────────
  ai: {
    label: "AI Engineer",
    icon: "🤖",
    description: "Build intelligent AI applications and systems",
    steps: [
      {
        id: "ai_python",
        title: "Python for AI",
        description: "Python libraries and tools used in AI development.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["Python OOP", "NumPy", "Pandas", "Jupyter Notebooks", "Virtual Environments"],
        resources: [
          { title: "Python for Data Science Handbook", url: "https://jakevdp.github.io/PythonDataScienceHandbook", type: "book" },
          { title: "Fast.ai Practical AI",             url: "https://course.fast.ai", type: "course" },
          { title: "Kaggle Python Course",             url: "https://www.kaggle.com/learn/python", type: "course" },
        ],
        projects: ["Data Analysis Notebook", "Automated Report Generator"],
      },
      {
        id: "ml_fundamentals",
        title: "ML Fundamentals",
        description: "Core machine learning concepts and algorithms.",
        duration: "3 weeks",
        difficulty: "Intermediate",
        skills: ["Regression", "Classification", "Clustering", "Feature Engineering", "Model Evaluation"],
        resources: [
          { title: "Andrew Ng ML Course",       url: "https://www.coursera.org/learn/machine-learning", type: "course" },
          { title: "Scikit-learn User Guide",   url: "https://scikit-learn.org/stable/user_guide.html", type: "docs"    },
          { title: "Kaggle ML Course",          url: "https://www.kaggle.com/learn/intro-to-machine-learning", type: "course" },
        ],
        projects: ["Titanic Survival Prediction", "Iris Flower Classifier"],
      },
      {
        id: "nlp",
        title: "Natural Language Processing",
        description: "Process and understand human language using AI.",
        duration: "3 weeks",
        difficulty: "Intermediate",
        skills: ["Tokenization", "Embeddings", "Transformers", "BERT", "Text Classification"],
        resources: [
          { title: "HuggingFace Course",        url: "https://huggingface.co/learn/nlp-course", type: "course" },
          { title: "NLTK Documentation",        url: "https://www.nltk.org", type: "docs"    },
          { title: "spaCy Tutorial",            url: "https://spacy.io/usage/spacy-101", type: "tutorial" },
        ],
        projects: ["Chatbot with NLTK", "News Article Classifier"],
      },
      {
        id: "computer_vision",
        title: "Computer Vision",
        description: "Teach machines to understand images and video.",
        duration: "3 weeks",
        difficulty: "Advanced",
        skills: ["OpenCV", "CNNs", "Object Detection", "Image Segmentation", "YOLO"],
        resources: [
          { title: "OpenCV Python Tutorials",   url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html", type: "docs" },
          { title: "CS231n Stanford CV",        url: "https://cs231n.stanford.edu", type: "course" },
          { title: "Roboflow Computer Vision",  url: "https://blog.roboflow.com/computer-vision-getting-started", type: "blog" },
        ],
        projects: ["Face Detection App", "Object Detection with YOLO"],
      },
      {
        id: "llm",
        title: "Large Language Models",
        description: "Work with GPT, LLaMA and build AI applications.",
        duration: "3 weeks",
        difficulty: "Advanced",
        skills: ["Prompt Engineering", "LangChain", "RAG", "Fine-tuning", "OpenAI API"],
        resources: [
          { title: "OpenAI API Docs",           url: "https://platform.openai.com/docs", type: "docs"    },
          { title: "LangChain Docs",            url: "https://python.langchain.com/docs/get_started", type: "docs"    },
          { title: "Prompt Engineering Guide",  url: "https://www.promptingguide.ai", type: "tutorial" },
        ],
        projects: ["AI Document Q&A App", "Resume Analyzer with GPT"],
      },
      {
        id: "ai_deployment",
        title: "AI Model Deployment",
        description: "Deploy AI models to production as APIs.",
        duration: "2 weeks",
        difficulty: "Advanced",
        skills: ["FastAPI", "Flask ML API", "Docker", "MLflow", "Hugging Face Spaces"],
        resources: [
          { title: "FastAPI Docs",              url: "https://fastapi.tiangolo.com", type: "docs"    },
          { title: "HuggingFace Spaces",        url: "https://huggingface.co/spaces", type: "tutorial" },
          { title: "MLflow Docs",               url: "https://mlflow.org/docs/latest/index.html", type: "docs" },
        ],
        projects: ["Deploy ML Model as REST API", "Build AI Web App with Streamlit"],
      },
    ],
  },

  // ── 8. DevOps Engineer ────────────────────────────────────────────────────
  devops: {
    label: "DevOps Engineer",
    icon: "⚙️",
    description: "Automate and streamline software development and delivery",
    steps: [
      {
        id: "linux_devops",
        title: "Linux & Bash Scripting",
        description: "Master Linux and write automation scripts.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["Bash", "Shell Scripts", "Cron Jobs", "File System", "Process Management"],
        resources: [
          { title: "Linux Command Line Book",   url: "https://linuxcommand.org/tlcl.php", type: "book"    },
          { title: "Bash Scripting Tutorial",   url: "https://linuxconfig.org/bash-scripting-tutorial-for-beginners", type: "tutorial" },
          { title: "OverTheWire Bandit",        url: "https://overthewire.org/wargames/bandit", type: "tutorial" },
        ],
        projects: ["System Backup Script", "Server Health Monitor Script"],
      },
      {
        id: "git",
        title: "Git & Version Control",
        description: "Master branching, merging and collaborative workflows.",
        duration: "1 week",
        difficulty: "Beginner",
        skills: ["Branching", "Merging", "Rebasing", "Pull Requests", "Git Flow"],
        resources: [
          { title: "Pro Git Book",              url: "https://git-scm.com/book/en/v2", type: "book"    },
          { title: "GitHub Skills",             url: "https://skills.github.com", type: "tutorial" },
          { title: "Learn Git Branching",       url: "https://learngitbranching.js.org", type: "tutorial" },
        ],
        projects: ["Collaborative Project with Git Flow", "Open Source Contribution"],
      },
      {
        id: "docker_devops",
        title: "Docker & Containers",
        description: "Build, ship and run applications in containers.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Dockerfile", "Docker Compose", "Image Optimization", "Multi-stage Builds", "Registry"],
        resources: [
          { title: "Docker Official Docs",      url: "https://docs.docker.com", type: "docs"    },
          { title: "Docker Deep Dive Book",     url: "https://nigelpoulton.com/books", type: "book"    },
          { title: "Play with Docker",          url: "https://labs.play-with-docker.com", type: "tutorial" },
        ],
        projects: ["Dockerize Full Stack App", "Private Docker Registry Setup"],
      },
      {
        id: "kubernetes_devops",
        title: "Kubernetes",
        description: "Orchestrate and scale containerized applications.",
        duration: "3 weeks",
        difficulty: "Advanced",
        skills: ["Deployments", "Services", "Ingress", "Helm Charts", "Auto Scaling", "Monitoring"],
        resources: [
          { title: "Kubernetes Official Docs",  url: "https://kubernetes.io/docs/home", type: "docs"    },
          { title: "Kubernetes The Hard Way",   url: "https://github.com/kelseyhightower/kubernetes-the-hard-way", type: "tutorial" },
          { title: "Helm Docs",                 url: "https://helm.sh/docs", type: "docs" },
        ],
        projects: ["Deploy Microservices on K8s", "Set Up Auto-scaling Cluster"],
      },
      {
        id: "terraform",
        title: "Terraform & IaC",
        description: "Manage infrastructure using code.",
        duration: "2 weeks",
        difficulty: "Advanced",
        skills: ["HCL", "Providers", "Modules", "State Management", "Workspaces", "AWS with Terraform"],
        resources: [
          { title: "Terraform Official Docs",   url: "https://developer.hashicorp.com/terraform/docs", type: "docs"    },
          { title: "Terraform: Up and Running", url: "https://www.terraformupandrunning.com", type: "book"    },
          { title: "HashiCorp Learn Terraform", url: "https://developer.hashicorp.com/terraform/tutorials", type: "tutorial" },
        ],
        projects: ["Provision AWS Infrastructure with Terraform", "Create Reusable Terraform Modules"],
      },
      {
        id: "monitoring",
        title: "Monitoring & Logging",
        description: "Monitor systems and analyse logs in production.",
        duration: "2 weeks",
        difficulty: "Advanced",
        skills: ["Prometheus", "Grafana", "ELK Stack", "Alerting", "Distributed Tracing"],
        resources: [
          { title: "Prometheus Docs",           url: "https://prometheus.io/docs/introduction/overview", type: "docs"    },
          { title: "Grafana Docs",              url: "https://grafana.com/docs/grafana/latest", type: "docs"    },
          { title: "Elastic Stack Guide",       url: "https://www.elastic.co/guide/index.html", type: "docs"    },
        ],
        projects: ["Set Up Prometheus + Grafana Dashboard", "Centralized Logging with ELK"],
      },
    ],
  },

  // ── 9. Blockchain Developer ───────────────────────────────────────────────
  blockchain: {
    label: "Blockchain Developer",
    icon: "⛓️",
    description: "Build decentralized applications and smart contracts",
    steps: [
      {
        id: "blockchain_basics",
        title: "Blockchain Fundamentals",
        description: "How blockchain works, consensus mechanisms and cryptography.",
        duration: "2 weeks",
        difficulty: "Beginner",
        skills: ["Distributed Ledger", "Consensus", "Hashing", "Wallets", "Transactions", "Mining"],
        resources: [
          { title: "Bitcoin Whitepaper",        url: "https://bitcoin.org/bitcoin.pdf", type: "docs"    },
          { title: "Blockchain Basics - Coursera", url: "https://www.coursera.org/learn/blockchain-basics", type: "course" },
          { title: "MIT Blockchain Course",     url: "https://ocw.mit.edu/courses/15-s12-blockchain-and-money-fall-2018", type: "course" },
        ],
        projects: ["Build Simple Blockchain in Python", "Blockchain Research Report"],
      },
      {
        id: "solidity",
        title: "Solidity Programming",
        description: "Write smart contracts for the Ethereum blockchain.",
        duration: "4 weeks",
        difficulty: "Intermediate",
        skills: ["Data Types", "Functions", "Modifiers", "Events", "Inheritance", "Gas Optimization"],
        resources: [
          { title: "Solidity Official Docs",    url: "https://docs.soliditylang.org", type: "docs"    },
          { title: "CryptoZombies",             url: "https://cryptozombies.io", type: "tutorial" },
          { title: "Solidity by Example",       url: "https://solidity-by-example.org", type: "tutorial" },
        ],
        projects: ["ERC-20 Token Contract", "Simple Voting Smart Contract"],
      },
      {
        id: "ethereum",
        title: "Ethereum & Web3.js",
        description: "Interact with Ethereum blockchain from JavaScript.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Web3.js", "Ethers.js", "MetaMask", "ABI", "Events", "Wallet Connection"],
        resources: [
          { title: "Ethereum Developer Docs",   url: "https://ethereum.org/en/developers", type: "docs"    },
          { title: "Ethers.js Docs",            url: "https://docs.ethers.org", type: "docs"    },
          { title: "Web3.js Docs",              url: "https://web3js.readthedocs.io", type: "docs"    },
        ],
        projects: ["Connect MetaMask to Website", "Read Blockchain Data with Ethers.js"],
      },
      {
        id: "nft",
        title: "NFT & DeFi Development",
        description: "Build NFT collections and DeFi protocols.",
        duration: "3 weeks",
        difficulty: "Advanced",
        skills: ["ERC-721", "ERC-1155", "IPFS", "OpenSea", "Liquidity Pools", "AMM"],
        resources: [
          { title: "OpenZeppelin Docs",         url: "https://docs.openzeppelin.com", type: "docs"    },
          { title: "IPFS Docs",                 url: "https://docs.ipfs.tech", type: "docs"    },
          { title: "Buildspace NFT Course",     url: "https://buildspace.so", type: "course" },
        ],
        projects: ["Deploy NFT Collection", "Create Token Swap Interface"],
      },
      {
        id: "hardhat",
        title: "Hardhat & Testing",
        description: "Professional development environment for smart contracts.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Hardhat", "Chai Testing", "Coverage", "Deployment Scripts", "Forking Mainnet"],
        resources: [
          { title: "Hardhat Official Docs",     url: "https://hardhat.org/docs", type: "docs"    },
          { title: "Foundry Book",              url: "https://book.getfoundry.sh", type: "docs"    },
          { title: "Smart Contract Auditing",   url: "https://github.com/transmissions11/solcurity", type: "docs" },
        ],
        projects: ["Full Test Suite for ERC-20 Token", "Automated Deployment Pipeline"],
      },
      {
        id: "dapp",
        title: "Build a Full DApp",
        description: "Complete decentralized application with React frontend.",
        duration: "3 weeks",
        difficulty: "Advanced",
        skills: ["React + Web3", "Wallet Auth", "Smart Contract Integration", "IPFS Storage", "Gas UX"],
        resources: [
          { title: "Alchemy DApp Tutorials",    url: "https://docs.alchemy.com/docs/dapp-development", type: "tutorial" },
          { title: "Moralis Docs",              url: "https://docs.moralis.io", type: "docs"    },
          { title: "Buildspace Projects",       url: "https://buildspace.so/projects", type: "tutorial" },
        ],
        projects: ["Decentralized Voting DApp", "NFT Marketplace"],
      },
    ],
  },

  // ── 10. Game Developer ────────────────────────────────────────────────────
  gamedev: {
    label: "Game Developer",
    icon: "🎮",
    description: "Create 2D and 3D video games from scratch",
    steps: [
      {
        id: "game_basics",
        title: "Game Design Basics",
        description: "Game mechanics, loops, level design and player psychology.",
        duration: "1 week",
        difficulty: "Beginner",
        skills: ["Game Loops", "Game Mechanics", "Level Design", "Player Experience", "Game Genres"],
        resources: [
          { title: "Game Design Concepts",      url: "https://gamedesignconcepts.wordpress.com", type: "blog"    },
          { title: "GDC Talks YouTube",         url: "https://www.youtube.com/@gdconf", type: "video"  },
          { title: "The Art of Game Design",    url: "https://www.schellgames.com/art-of-game-design", type: "book" },
        ],
        projects: ["Game Design Document", "Paper Prototype of a Simple Game"],
      },
      {
        id: "unity",
        title: "Unity Engine",
        description: "Learn the world's most popular game engine.",
        duration: "4 weeks",
        difficulty: "Beginner",
        skills: ["Unity Editor", "GameObjects", "Prefabs", "Scenes", "Inspector", "Asset Store"],
        resources: [
          { title: "Unity Learn Official",      url: "https://learn.unity.com", type: "course" },
          { title: "Unity Manual",              url: "https://docs.unity3d.com/Manual/index.html", type: "docs"    },
          { title: "Brackeys YouTube Channel",  url: "https://www.youtube.com/@Brackeys", type: "video"  },
        ],
        projects: ["2D Platformer Game", "Simple 3D Runner Game"],
      },
      {
        id: "csharp",
        title: "C# Programming for Games",
        description: "Write game logic and mechanics using C#.",
        duration: "3 weeks",
        difficulty: "Intermediate",
        skills: ["C# Basics", "Classes", "Interfaces", "Coroutines", "Events", "LINQ"],
        resources: [
          { title: "Microsoft C# Docs",         url: "https://learn.microsoft.com/en-us/dotnet/csharp", type: "docs"    },
          { title: "C# for Unity - Udemy",      url: "https://www.udemy.com/topic/unity", type: "course" },
          { title: "Unity C# Scripting Manual", url: "https://docs.unity3d.com/Manual/ScriptingSection.html", type: "docs" },
        ],
        projects: ["Enemy AI System", "Inventory System"],
      },
      {
        id: "game_physics",
        title: "Physics & Animation",
        description: "Rigidbodies, colliders and character animations.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Rigidbody", "Colliders", "Triggers", "Animator", "Blend Trees", "IK"],
        resources: [
          { title: "Unity Physics Docs",        url: "https://docs.unity3d.com/Manual/PhysicsSection.html", type: "docs" },
          { title: "Unity Animation Docs",      url: "https://docs.unity3d.com/Manual/AnimationSection.html", type: "docs" },
          { title: "Mixamo Free Animations",    url: "https://www.mixamo.com", type: "tutorial" },
        ],
        projects: ["Character Controller with Physics", "Animated Character Game"],
      },
      {
        id: "game_ui",
        title: "Game UI & Sound",
        description: "Menus, HUD, audio and visual effects.",
        duration: "2 weeks",
        difficulty: "Intermediate",
        skills: ["Unity UI", "Canvas", "Audio System", "Particle Effects", "Post Processing"],
        resources: [
          { title: "Unity UI Toolkit Docs",     url: "https://docs.unity3d.com/Manual/UIElements.html", type: "docs"    },
          { title: "Freesound.org",             url: "https://freesound.org", type: "tutorial" },
          { title: "Unity VFX Graph Docs",      url: "https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@latest", type: "docs" },
        ],
        projects: ["Complete Game with Menu and HUD", "Add Sound Effects and Music"],
      },
      {
        id: "game_publish",
        title: "Publish Your Game",
        description: "Build and release your game to players worldwide.",
        duration: "1 week",
        difficulty: "Intermediate",
        skills: ["Build Settings", "Platform Export", "Itch.io", "Steam Basics", "Play Store Games"],
        resources: [
          { title: "Unity Build & Publish",     url: "https://docs.unity3d.com/Manual/PublishingBuilds.html", type: "docs" },
          { title: "Itch.io Developer Guide",   url: "https://itch.io/docs/creators/getting-started", type: "docs" },
          { title: "Steam Direct Guide",        url: "https://partner.steamgames.com/doc/distribution/steampipe", type: "docs" },
        ],
        projects: ["Publish Game on Itch.io", "Create Game Trailer Video"],
      },
    ],
  },

};

// ── GET all roadmaps ──────────────────────────────────────────────────────────
const getAllRoadmaps = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, roadmaps });
  } catch (error) { next(error); }
};

// ── GET user's roadmap with progress ─────────────────────────────────────────
const getRoadmap = async (req, res, next) => {
  try {
    const user     = await require("../models/User").findById(req.user.id);
    const path     = user.careerPath || "webdev";
    const roadmap  = roadmaps[path];

    if (!roadmap) {
      return res.status(404).json({ success: false, message: "Roadmap not found." });
    }

    const steps = roadmap.steps.map(step => ({
      ...step,
      completed: user.roadmapProgress?.get(step.id) || false,
    }));

    const done = steps.filter(s => s.completed).length;

    res.status(200).json({
      success: true,
      careerPath: path,
      label:      roadmap.label,
      icon:       roadmap.icon,
      description:roadmap.description,
      progress:   steps.length ? Math.round((done / steps.length) * 100) : 0,
      steps,
    });
  } catch (error) { next(error); }
};

// ── UPDATE step progress ──────────────────────────────────────────────────────
const updateProgress = async (req, res, next) => {
  try {
    const { stepId, completed } = req.body;
    const user = await require("../models/User").findById(req.user.id);

    if (!user.roadmapProgress) user.roadmapProgress = new Map();
    user.roadmapProgress.set(stepId, completed);
    user.markModified("roadmapProgress");
    await user.save();

    res.status(200).json({ success: true, message: "Progress updated." });
  } catch (error) { next(error); }
};

module.exports = { getAllRoadmaps, getRoadmap, updateProgress };