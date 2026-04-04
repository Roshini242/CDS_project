import { useState, useEffect, useCallback } from "react";
import { Roadmap } from "../services/api";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";

const COLORS = {
  webdev:        "#00d4ff",
  datascience:   "#10b981",
  uiux:          "#7c3aed",
  mobile:        "#f59e0b",
  cybersecurity: "#ef4444",
  cloud:         "#06b6d4",
  ai:            "#8b5cf6",
  devops:        "#f97316",
  blockchain:    "#eab308",
  gamedev:       "#ec4899",
};

const DIFFICULTY_COLOR = {
  Beginner:     "#10b981",
  Intermediate: "#f59e0b",
  Advanced:     "#ef4444",
};

const RESOURCE_ICONS = {
  docs:     "📄",
  course:   "🎓",
  tutorial: "💻",
  book:     "📚",
  blog:     "✍️",
  video:    "🎬",
};

const FALLBACK = {
  webdev: {
    label:"Web Developer", icon:"🌐", description:"Build modern websites and web applications",
    steps:[
      { id:"html_css",   title:"HTML & CSS Basics",       description:"Learn structure and styling of web pages.", duration:"2 weeks", difficulty:"Beginner",     skills:["HTML5","CSS3","Flexbox","Grid"],           resources:[{title:"MDN Web Docs",    url:"https://developer.mozilla.org",              type:"docs"   },{title:"FreeCodeCamp",  url:"https://www.freecodecamp.org",               type:"course" }], projects:["Portfolio Website","Landing Page"]       },
      { id:"javascript", title:"JavaScript Fundamentals", description:"Core programming concepts, DOM, ES6+.",    duration:"3 weeks", difficulty:"Beginner",     skills:["ES6+","DOM","Async/Await","Fetch API"],    resources:[{title:"JavaScript.info", url:"https://javascript.info",                   type:"docs"   },{title:"Eloquent JS",   url:"https://eloquentjavascript.net",             type:"book"   }], projects:["To-Do App","Weather App"]                },
      { id:"react",      title:"React Framework",         description:"Component-based UI development.",          duration:"3 weeks", difficulty:"Intermediate", skills:["Components","Hooks","State","Router"],     resources:[{title:"React Docs",      url:"https://react.dev",                         type:"docs"   },{title:"Scrimba React", url:"https://scrimba.com/learn/learnreact",       type:"course" }], projects:["Movie Search App","E-Commerce Frontend"] },
      { id:"nodejs",     title:"Node.js & Express",       description:"Backend development with JavaScript.",    duration:"2 weeks", difficulty:"Intermediate", skills:["REST APIs","Middleware","JWT","bcrypt"],    resources:[{title:"Node.js Docs",    url:"https://nodejs.org/en/docs",                 type:"docs"   },{title:"Express Guide", url:"https://expressjs.com",                      type:"docs"   }], projects:["REST API","Auth System"]                 },
      { id:"mongodb",    title:"MongoDB & Databases",     description:"NoSQL database for modern apps.",         duration:"2 weeks", difficulty:"Intermediate", skills:["CRUD","Mongoose","Aggregation","Indexes"], resources:[{title:"MongoDB Uni",     url:"https://university.mongodb.com",             type:"course" },{title:"Mongoose Docs", url:"https://mongoosejs.com/docs",                type:"docs"   }], projects:["Blog App","Student System"]              },
      { id:"deployment", title:"Deployment & DevOps",     description:"Deploy apps using Vercel or Netlify.",   duration:"1 week",  difficulty:"Intermediate", skills:["Git","CI/CD","Vercel","Env Variables"],    resources:[{title:"Vercel Docs",     url:"https://vercel.com/docs",                   type:"docs"   },{title:"GitHub Actions",url:"https://docs.github.com/en/actions",         type:"docs"   }], projects:["Deploy Portfolio","Full Stack Deploy"]   },
    ],
  },
  datascience: {
    label:"Data Scientist", icon:"📊", description:"Analyze data and build machine learning models",
    steps:[
      { id:"python",        title:"Python Basics",          description:"Learn Python programming for data analysis.",         duration:"2 weeks", difficulty:"Beginner",     skills:["Variables","Loops","Functions","OOP"],              resources:[{title:"Python Docs",     url:"https://docs.python.org/3/tutorial",                 type:"docs"   },{title:"FreeCodeCamp",  url:"https://www.freecodecamp.org/learn/scientific-computing-with-python", type:"course"}], projects:["Calculator App","Grade Tracker"]           },
      { id:"statistics",    title:"Statistics & Math",      description:"Probability, linear algebra, and calculus.",         duration:"3 weeks", difficulty:"Beginner",     skills:["Probability","Descriptive Stats","Linear Algebra"], resources:[{title:"Khan Academy",    url:"https://www.khanacademy.org/math/statistics-probability",type:"course" },{title:"StatQuest",      url:"https://www.youtube.com/@statquest",                 type:"video"  }], projects:["Statistical Report","Probability Calc"]   },
      { id:"pandas",        title:"Pandas & NumPy",         description:"Data manipulation and numerical computing.",         duration:"2 weeks", difficulty:"Beginner",     skills:["DataFrames","Data Cleaning","NumPy Arrays"],        resources:[{title:"Pandas Docs",     url:"https://pandas.pydata.org/docs",                    type:"docs"   },{title:"Kaggle Pandas",  url:"https://www.kaggle.com/learn/pandas",                type:"course" }], projects:["Sales Analysis","COVID Dashboard"]         },
      { id:"ml",            title:"Machine Learning",       description:"Supervised and unsupervised learning algorithms.",   duration:"4 weeks", difficulty:"Intermediate", skills:["Regression","Decision Trees","KNN","Scikit-learn"], resources:[{title:"Scikit-learn",    url:"https://scikit-learn.org/stable",                   type:"docs"   },{title:"Andrew Ng ML",  url:"https://www.coursera.org/learn/machine-learning",    type:"course" }], projects:["House Price Prediction","Spam Classifier"] },
      { id:"deeplearning",  title:"Deep Learning",          description:"Neural networks with TensorFlow and PyTorch.",       duration:"4 weeks", difficulty:"Advanced",     skills:["Neural Networks","CNN","RNN","TensorFlow"],         resources:[{title:"TensorFlow Docs", url:"https://www.tensorflow.org/learn",                  type:"docs"   },{title:"PyTorch",        url:"https://pytorch.org/tutorials",                     type:"docs"   }], projects:["Image Classifier","Sentiment Analysis"]   },
      { id:"visualization", title:"Data Visualization",     description:"Create charts, graphs and dashboards.",             duration:"2 weeks", difficulty:"Beginner",     skills:["Matplotlib","Seaborn","Plotly","Tableau"],          resources:[{title:"Matplotlib Docs", url:"https://matplotlib.org/stable/tutorials",           type:"docs"   },{title:"Plotly Docs",    url:"https://plotly.com/python",                          type:"docs"   }], projects:["Sales Dashboard","COVID Report"]           },
    ],
  },
  uiux: {
    label:"UI/UX Designer", icon:"🎨", description:"Design beautiful and user-friendly interfaces",
    steps:[
      { id:"design_principles", title:"Design Principles",      description:"Color theory, typography and visual hierarchy.", duration:"2 weeks", difficulty:"Beginner",     skills:["Color Theory","Typography","Grid System"],        resources:[{title:"Google UX Cert",  url:"https://www.coursera.org/professional-certificates/google-ux-design",type:"course"},{title:"Laws of UX",     url:"https://lawsofux.com",                               type:"docs"   }], projects:["Brand Style Guide","Color Palette"]        },
      { id:"figma",             title:"Figma Mastery",          description:"Learn the industry-standard design tool.",       duration:"3 weeks", difficulty:"Beginner",     skills:["Frames","Components","Auto Layout","Prototype"],  resources:[{title:"Figma Docs",      url:"https://help.figma.com/hc/en-us/categories/360002051613",type:"docs"  },{title:"Figma YouTube",  url:"https://www.youtube.com/@Figma",                    type:"video"  }], projects:["Mobile App Mockup","Dashboard UI"]         },
      { id:"user_research",     title:"User Research",          description:"Understand users through research methods.",     duration:"2 weeks", difficulty:"Intermediate", skills:["Interviews","Surveys","Personas","Empathy Maps"],  resources:[{title:"Nielsen Norman",  url:"https://www.nngroup.com/articles",                  type:"blog"   },{title:"IDF Course",     url:"https://www.interaction-design.org",                 type:"course" }], projects:["User Persona Doc","Usability Report"]     },
      { id:"prototyping",       title:"Prototyping",            description:"Create interactive prototypes and wireframes.",  duration:"2 weeks", difficulty:"Intermediate", skills:["Wireframes","Prototypes","User Flows"],            resources:[{title:"Figma Prototype", url:"https://help.figma.com/hc/en-us/articles/360040314193",type:"docs"  },{title:"Balsamiq",       url:"https://balsamiq.com/learn/courses/wireframing",    type:"tutorial"}], projects:["App Wireframe","E-Commerce Prototype"]    },
      { id:"design_systems",    title:"Design Systems",         description:"Build consistent component libraries.",          duration:"2 weeks", difficulty:"Advanced",     skills:["Component Libraries","Style Guides","Tokens"],    resources:[{title:"Material Design", url:"https://m3.material.io",                            type:"docs"   },{title:"Design Systems",  url:"https://designsystemsrepo.com",                     type:"blog"   }], projects:["UI Component Library","Style Guide Doc"]  },
      { id:"portfolio",         title:"Portfolio Building",     description:"Showcase your best design work online.",        duration:"2 weeks", difficulty:"Intermediate", skills:["Case Studies","Behance","Dribbble","Portfolio"],   resources:[{title:"UX Portfolio",    url:"https://www.nngroup.com/articles/ux-design-portfolios",type:"blog"  },{title:"Behance",        url:"https://www.behance.net",                           type:"tutorial"}], projects:["3 Case Studies","Portfolio Website"]      },
    ],
  },
  mobile: {
    label:"Mobile Developer", icon:"📱", description:"Build Android and iOS mobile applications",
    steps:[
      { id:"mobile_basics",  title:"Mobile Dev Basics",    description:"Understand mobile platforms and concepts.",       duration:"1 week",  difficulty:"Beginner",     skills:["Android vs iOS","App Lifecycle","Mobile UX"],      resources:[{title:"Android Guide",   url:"https://developer.android.com/guide",               type:"docs"   },{title:"Apple Dev Docs", url:"https://developer.apple.com/documentation",          type:"docs"   }], projects:["iOS vs Android Report"]                    },
      { id:"react_native",   title:"React Native",         description:"Build cross-platform apps with JavaScript.",     duration:"4 weeks", difficulty:"Intermediate", skills:["Components","Navigation","State","Native Modules"], resources:[{title:"React Native",    url:"https://reactnative.dev/docs/getting-started",      type:"docs"   },{title:"Expo Docs",      url:"https://docs.expo.dev",                             type:"docs"   }], projects:["Weather Mobile App","Notes App"]           },
      { id:"mobile_ui",      title:"Mobile UI Design",     description:"Design for small screens and touch.",            duration:"2 weeks", difficulty:"Beginner",     skills:["Touch Targets","Gestures","Navigation Patterns"],  resources:[{title:"Material Mobile", url:"https://m3.material.io/foundations/adaptive-design/overview",type:"docs"},{title:"Apple HIG",      url:"https://developer.apple.com/design/human-interface-guidelines",type:"docs"}], projects:["Mobile UI in Figma"]                       },
      { id:"mobile_api",     title:"REST API Integration", description:"Connect mobile apps to backend APIs.",          duration:"2 weeks", difficulty:"Intermediate", skills:["Axios","Fetch API","JWT Auth","Caching"],           resources:[{title:"Axios Docs",      url:"https://axios-http.com/docs/intro",                 type:"docs"   },{title:"React Query",    url:"https://tanstack.com/query/latest",                 type:"docs"   }], projects:["Movie App with API","News Reader"]         },
      { id:"firebase",       title:"Firebase Backend",     description:"Real-time database and authentication.",        duration:"2 weeks", difficulty:"Intermediate", skills:["Firestore","Auth","Storage","Cloud Functions"],     resources:[{title:"Firebase Docs",   url:"https://firebase.google.com/docs",                  type:"docs"   },{title:"RN Firebase",    url:"https://rnfirebase.io",                             type:"docs"   }], projects:["Real-time Chat App","Social Feed"]         },
      { id:"app_publish",    title:"App Publishing",       description:"Publish to Play Store and App Store.",          duration:"1 week",  difficulty:"Intermediate", skills:["App Signing","Store Listing","ASO","Versioning"],   resources:[{title:"Play Console",    url:"https://support.google.com/googleplay/android-developer",type:"docs"},{title:"Expo EAS",        url:"https://docs.expo.dev/build/introduction",          type:"docs"   }], projects:["Publish App to Play Store"]                },
    ],
  },
  cybersecurity: {
    label:"Cybersecurity", icon:"🔐", description:"Protect systems and networks from cyber threats",
    steps:[
      { id:"networking",      title:"Networking Basics",   description:"TCP/IP, DNS, HTTP, firewalls and protocols.",   duration:"3 weeks", difficulty:"Beginner",     skills:["TCP/IP","DNS","HTTP/HTTPS","Firewalls","OSI"],      resources:[{title:"Cisco Networking",url:"https://www.netacad.com/courses/networking",         type:"course" },{title:"CompTIA Net+",   url:"https://www.comptia.org/certifications/network",     type:"docs"   }], projects:["Network Diagram","Wireshark Analysis"]    },
      { id:"linux",           title:"Linux Fundamentals",  description:"Command line and system administration.",       duration:"2 weeks", difficulty:"Beginner",     skills:["Bash","File Permissions","SSH","Cron Jobs"],        resources:[{title:"Linux Journey",   url:"https://linuxjourney.com",                          type:"tutorial"},{title:"OverTheWire",    url:"https://overthewire.org/wargames/bandit",           type:"tutorial"}], projects:["Linux Server Setup","Bash Scripts"]        },
      { id:"ethical_hacking", title:"Ethical Hacking",     description:"Penetration testing and vulnerability assessment.",duration:"4 weeks",difficulty:"Intermediate",skills:["Reconnaissance","Scanning","Exploitation"],        resources:[{title:"TryHackMe",       url:"https://tryhackme.com",                             type:"course" },{title:"HackTheBox",     url:"https://www.hackthebox.com",                        type:"course" }], projects:["CTF Challenge","VM Pentest"]               },
      { id:"cryptography",    title:"Cryptography",        description:"Encryption, hashing and secure communication.", duration:"2 weeks", difficulty:"Intermediate", skills:["Encryption","Hashing","SSL/TLS","PKI"],             resources:[{title:"Crypto Coursera", url:"https://www.coursera.org/learn/crypto",              type:"course" },{title:"Khan Crypto",    url:"https://www.khanacademy.org/computing/computer-science/cryptography",type:"course"}], projects:["Caesar Cipher","Password Hasher"]          },
      { id:"soc",             title:"SOC & SIEM Tools",    description:"Security operations and monitoring tools.",     duration:"3 weeks", difficulty:"Advanced",     skills:["SIEM","Log Analysis","Incident Response","Splunk"], resources:[{title:"Splunk Training", url:"https://www.splunk.com/en_us/training/free-courses.html",type:"course"},{title:"MS Sentinel",     url:"https://learn.microsoft.com/en-us/azure/sentinel",  type:"docs"   }], projects:["SIEM Lab","Incident Report"]               },
      { id:"security_cert",   title:"Certifications",      description:"Prepare for industry certifications.",          duration:"4 weeks", difficulty:"Advanced",     skills:["CompTIA Sec+","CEH","CISSP","eJPT"],                resources:[{title:"CompTIA Sec+",    url:"https://www.comptia.org/certifications/security",   type:"docs"   },{title:"Prof Messer",    url:"https://www.professormesser.com",                   type:"video"  }], projects:["Practice Exam 80%+","Security Home Lab"]  },
    ],
  },
  cloud: {
    label:"Cloud Engineer", icon:"☁️", description:"Build and manage cloud infrastructure",
    steps:[
      { id:"cloud_basics",   title:"Cloud Fundamentals",  description:"Cloud concepts, models and providers.",          duration:"1 week",  difficulty:"Beginner",     skills:["IaaS","PaaS","SaaS","Public/Private Cloud"],        resources:[{title:"AWS Practitioner",url:"https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials",type:"course"},{title:"Azure Fundamentals",url:"https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts",type:"course"}], projects:["Cloud Comparison Report"]                  },
      { id:"aws",            title:"AWS Core Services",   description:"Learn key AWS services used in production.",     duration:"4 weeks", difficulty:"Intermediate", skills:["EC2","S3","RDS","Lambda","VPC","IAM"],               resources:[{title:"AWS Docs",        url:"https://docs.aws.amazon.com",                       type:"docs"   },{title:"AWS Free Tier",  url:"https://aws.amazon.com/free",                       type:"tutorial"}], projects:["Host on S3","Deploy on EC2"]               },
      { id:"docker",         title:"Docker & Containers", description:"Containerize applications for consistency.",     duration:"2 weeks", difficulty:"Intermediate", skills:["Dockerfile","Images","Docker Compose","Volumes"],   resources:[{title:"Docker Docs",     url:"https://docs.docker.com",                           type:"docs"   },{title:"Play w/ Docker", url:"https://labs.play-with-docker.com",                 type:"tutorial"}], projects:["Containerize Node App","Docker Compose App"]},
      { id:"kubernetes",     title:"Kubernetes",          description:"Orchestrate containers at scale.",               duration:"3 weeks", difficulty:"Advanced",     skills:["Pods","Deployments","Services","Helm"],             resources:[{title:"K8s Docs",        url:"https://kubernetes.io/docs/home",                   type:"docs"   },{title:"K8s by Example", url:"https://kubernetesbyexample.com",                   type:"tutorial"}], projects:["Deploy on K8s","Minikube Setup"]            },
      { id:"ci_cd",          title:"CI/CD Pipelines",     description:"Automate testing and deployment.",               duration:"2 weeks", difficulty:"Intermediate", skills:["GitHub Actions","Jenkins","Pipeline as Code"],      resources:[{title:"GitHub Actions",  url:"https://docs.github.com/en/actions",                type:"docs"   },{title:"Jenkins Docs",   url:"https://www.jenkins.io/doc",                        type:"docs"   }], projects:["Auto Deploy React App"]                    },
      { id:"cloud_cert",     title:"AWS Certification",   description:"Prepare for AWS Solutions Architect exam.",      duration:"4 weeks", difficulty:"Advanced",     skills:["Architecture","High Availability","Cost Optim"],    resources:[{title:"AWS Exam Guide",  url:"https://aws.amazon.com/certification/certified-solutions-architect-associate",type:"docs"},{title:"Tutorials Dojo", url:"https://tutorialsdojo.com",                         type:"course" }], projects:["Practice Exam 80%+","3-Tier AWS Architecture"]},
    ],
  },
  ai: {
    label:"AI Engineer", icon:"🤖", description:"Build intelligent AI applications and systems",
    steps:[
      { id:"ai_python",        title:"Python for AI",          description:"Python libraries for AI development.",             duration:"2 weeks", difficulty:"Beginner",     skills:["Python OOP","NumPy","Pandas","Jupyter"],            resources:[{title:"Python DS Book",  url:"https://jakevdp.github.io/PythonDataScienceHandbook",type:"book"  },{title:"Kaggle Python",  url:"https://www.kaggle.com/learn/python",               type:"course" }], projects:["Data Notebook","Report Generator"]         },
      { id:"ml_fundamentals",  title:"ML Fundamentals",        description:"Core machine learning algorithms.",               duration:"3 weeks", difficulty:"Intermediate", skills:["Regression","Classification","Clustering"],         resources:[{title:"Andrew Ng ML",    url:"https://www.coursera.org/learn/machine-learning",   type:"course" },{title:"Scikit-learn",    url:"https://scikit-learn.org/stable/user_guide.html",   type:"docs"   }], projects:["Titanic Prediction","Iris Classifier"]    },
      { id:"nlp",              title:"Natural Language Proc.", description:"Process human language using AI.",               duration:"3 weeks", difficulty:"Intermediate", skills:["Tokenization","Embeddings","BERT","Transformers"],  resources:[{title:"HuggingFace",     url:"https://huggingface.co/learn/nlp-course",           type:"course" },{title:"spaCy Tutorial",  url:"https://spacy.io/usage/spacy-101",                  type:"tutorial"}], projects:["Chatbot","Article Classifier"]             },
      { id:"computer_vision",  title:"Computer Vision",        description:"Teach machines to understand images.",            duration:"3 weeks", difficulty:"Advanced",     skills:["OpenCV","CNNs","Object Detection","YOLO"],          resources:[{title:"OpenCV Docs",     url:"https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",type:"docs"},{title:"CS231n Stanford", url:"https://cs231n.stanford.edu",                       type:"course" }], projects:["Face Detection","YOLO Object Detection"]  },
      { id:"llm",              title:"Large Language Models",  description:"Work with GPT and build AI apps.",                duration:"3 weeks", difficulty:"Advanced",     skills:["Prompt Engineering","LangChain","RAG","OpenAI"],    resources:[{title:"OpenAI Docs",     url:"https://platform.openai.com/docs",                  type:"docs"   },{title:"LangChain Docs",  url:"https://python.langchain.com/docs/get_started",     type:"docs"   }], projects:["AI Q&A App","Resume Analyzer GPT"]         },
      { id:"ai_deployment",    title:"AI Model Deployment",    description:"Deploy AI models to production as APIs.",         duration:"2 weeks", difficulty:"Advanced",     skills:["FastAPI","Flask ML","Docker","MLflow"],              resources:[{title:"FastAPI Docs",    url:"https://fastapi.tiangolo.com",                      type:"docs"   },{title:"HF Spaces",      url:"https://huggingface.co/spaces",                     type:"tutorial"}], projects:["Deploy ML API","Streamlit AI App"]         },
    ],
  },
  devops: {
    label:"DevOps Engineer", icon:"⚙️", description:"Automate and streamline software delivery",
    steps:[
      { id:"linux_devops",      title:"Linux & Bash",        description:"Master Linux and write automation scripts.",      duration:"2 weeks", difficulty:"Beginner",     skills:["Bash","Shell Scripts","Cron Jobs","SSH"],           resources:[{title:"Linux CLI Book",  url:"https://linuxcommand.org/tlcl.php",                 type:"book"   },{title:"OverTheWire",    url:"https://overthewire.org/wargames/bandit",           type:"tutorial"}], projects:["Backup Script","Health Monitor"]           },
      { id:"git",               title:"Git & Version Control",description:"Master branching and collaborative workflows.",  duration:"1 week",  difficulty:"Beginner",     skills:["Branching","Merging","Rebasing","Git Flow"],        resources:[{title:"Pro Git Book",    url:"https://git-scm.com/book/en/v2",                    type:"book"   },{title:"Learn Git Branch", url:"https://learngitbranching.js.org",                  type:"tutorial"}], projects:["Git Flow Project","Open Source Contribution"]},
      { id:"docker_devops",     title:"Docker & Containers",  description:"Build and ship apps in containers.",             duration:"2 weeks", difficulty:"Intermediate", skills:["Dockerfile","Docker Compose","Multi-stage"],        resources:[{title:"Docker Docs",     url:"https://docs.docker.com",                           type:"docs"   },{title:"Docker Deep Dive",url:"https://nigelpoulton.com/books",                   type:"book"   }], projects:["Dockerize Full Stack","Private Registry"]  },
      { id:"kubernetes_devops", title:"Kubernetes",           description:"Orchestrate and scale containerized apps.",      duration:"3 weeks", difficulty:"Advanced",     skills:["Deployments","Services","Ingress","Helm","HPA"],    resources:[{title:"K8s Docs",        url:"https://kubernetes.io/docs/home",                   type:"docs"   },{title:"K8s The Hard Way",url:"https://github.com/kelseyhightower/kubernetes-the-hard-way",type:"tutorial"}], projects:["Microservices on K8s","Auto-scaling Cluster"]},
      { id:"terraform",         title:"Terraform & IaC",      description:"Manage infrastructure using code.",              duration:"2 weeks", difficulty:"Advanced",     skills:["HCL","Providers","Modules","State Management"],     resources:[{title:"Terraform Docs",  url:"https://developer.hashicorp.com/terraform/docs",    type:"docs"   },{title:"HCL Learn",      url:"https://developer.hashicorp.com/terraform/tutorials",type:"tutorial"}], projects:["AWS with Terraform","Reusable Modules"]    },
      { id:"monitoring",        title:"Monitoring & Logging",  description:"Monitor systems and analyse logs.",              duration:"2 weeks", difficulty:"Advanced",     skills:["Prometheus","Grafana","ELK Stack","Alerting"],      resources:[{title:"Prometheus Docs", url:"https://prometheus.io/docs/introduction/overview",  type:"docs"   },{title:"Grafana Docs",    url:"https://grafana.com/docs/grafana/latest",           type:"docs"   }], projects:["Grafana Dashboard","ELK Logging Setup"]   },
    ],
  },
  blockchain: {
    label:"Blockchain Dev", icon:"⛓️", description:"Build decentralized applications and smart contracts",
    steps:[
      { id:"blockchain_basics", title:"Blockchain Fundamentals",description:"How blockchain works and consensus.",           duration:"2 weeks", difficulty:"Beginner",     skills:["Distributed Ledger","Consensus","Hashing","Wallets"],resources:[{title:"Bitcoin Whitepaper",url:"https://bitcoin.org/bitcoin.pdf",               type:"docs"   },{title:"Blockchain Coursera",url:"https://www.coursera.org/learn/blockchain-basics",type:"course" }], projects:["Blockchain in Python","Research Report"]  },
      { id:"solidity",          title:"Solidity Programming",  description:"Write smart contracts for Ethereum.",            duration:"4 weeks", difficulty:"Intermediate", skills:["Data Types","Functions","Events","Gas Optim"],       resources:[{title:"Solidity Docs",   url:"https://docs.soliditylang.org",                     type:"docs"   },{title:"CryptoZombies",   url:"https://cryptozombies.io",                          type:"tutorial"}], projects:["ERC-20 Token","Voting Contract"]           },
      { id:"ethereum",          title:"Ethereum & Web3.js",    description:"Interact with Ethereum from JavaScript.",        duration:"2 weeks", difficulty:"Intermediate", skills:["Web3.js","Ethers.js","MetaMask","ABI"],              resources:[{title:"Ethereum Docs",   url:"https://ethereum.org/en/developers",                type:"docs"   },{title:"Ethers.js Docs",  url:"https://docs.ethers.org",                           type:"docs"   }], projects:["MetaMask Connect","Read Blockchain Data"]  },
      { id:"nft",               title:"NFT & DeFi Dev",        description:"Build NFT collections and DeFi protocols.",     duration:"3 weeks", difficulty:"Advanced",     skills:["ERC-721","ERC-1155","IPFS","OpenSea","AMM"],         resources:[{title:"OpenZeppelin",    url:"https://docs.openzeppelin.com",                     type:"docs"   },{title:"IPFS Docs",       url:"https://docs.ipfs.tech",                            type:"docs"   }], projects:["NFT Collection","Token Swap UI"]           },
      { id:"hardhat",           title:"Hardhat & Testing",     description:"Professional smart contract dev environment.",  duration:"2 weeks", difficulty:"Intermediate", skills:["Hardhat","Chai Testing","Coverage","Deploy Scripts"],resources:[{title:"Hardhat Docs",    url:"https://hardhat.org/docs",                          type:"docs"   },{title:"Foundry Book",    url:"https://book.getfoundry.sh",                        type:"docs"   }], projects:["ERC-20 Test Suite","Deploy Pipeline"]     },
      { id:"dapp",              title:"Build a Full DApp",     description:"Complete decentralized app with React.",        duration:"3 weeks", difficulty:"Advanced",     skills:["React + Web3","Wallet Auth","IPFS Storage"],         resources:[{title:"Alchemy Tutorials",url:"https://docs.alchemy.com/docs/dapp-development", type:"tutorial"},{title:"Buildspace",      url:"https://buildspace.so/projects",                    type:"tutorial"}], projects:["Voting DApp","NFT Marketplace"]            },
    ],
  },
  gamedev: {
    label:"Game Developer", icon:"🎮", description:"Create 2D and 3D video games from scratch",
    steps:[
      { id:"game_basics",   title:"Game Design Basics",     description:"Game mechanics, loops and level design.",         duration:"1 week",  difficulty:"Beginner",     skills:["Game Loops","Mechanics","Level Design","UX"],       resources:[{title:"Game Design Blog", url:"https://gamedesignconcepts.wordpress.com",          type:"blog"   },{title:"GDC Talks",      url:"https://www.youtube.com/@gdconf",                   type:"video"  }], projects:["Game Design Doc","Paper Prototype"]        },
      { id:"unity",         title:"Unity Engine",           description:"Learn the world's most popular game engine.",    duration:"4 weeks", difficulty:"Beginner",     skills:["Unity Editor","GameObjects","Prefabs","Scenes"],    resources:[{title:"Unity Learn",     url:"https://learn.unity.com",                           type:"course" },{title:"Brackeys",        url:"https://www.youtube.com/@Brackeys",                 type:"video"  }], projects:["2D Platformer","3D Runner Game"]           },
      { id:"csharp",        title:"C# for Games",           description:"Write game logic and mechanics using C#.",       duration:"3 weeks", difficulty:"Intermediate", skills:["C# Basics","Classes","Coroutines","Events"],        resources:[{title:"Microsoft C#",    url:"https://learn.microsoft.com/en-us/dotnet/csharp",   type:"docs"   },{title:"Unity Scripting", url:"https://docs.unity3d.com/Manual/ScriptingSection.html",type:"docs" }], projects:["Enemy AI System","Inventory System"]       },
      { id:"game_physics",  title:"Physics & Animation",    description:"Rigidbodies, colliders and animations.",         duration:"2 weeks", difficulty:"Intermediate", skills:["Rigidbody","Colliders","Animator","Blend Trees"],    resources:[{title:"Unity Physics",   url:"https://docs.unity3d.com/Manual/PhysicsSection.html",type:"docs" },{title:"Mixamo",          url:"https://www.mixamo.com",                            type:"tutorial"}], projects:["Physics Controller","Animated Character"]  },
      { id:"game_ui",       title:"Game UI & Sound",        description:"Menus, HUD, audio and visual effects.",          duration:"2 weeks", difficulty:"Intermediate", skills:["Unity UI","Canvas","Audio","Particle Effects"],      resources:[{title:"Unity UI Docs",   url:"https://docs.unity3d.com/Manual/UIElements.html",   type:"docs"   },{title:"Freesound.org",   url:"https://freesound.org",                             type:"tutorial"}], projects:["Complete Game + HUD","Sound Effects"]      },
      { id:"game_publish",  title:"Publish Your Game",      description:"Release your game to players worldwide.",        duration:"1 week",  difficulty:"Intermediate", skills:["Build Settings","Itch.io","Steam","Play Store"],     resources:[{title:"Unity Publish",   url:"https://docs.unity3d.com/Manual/PublishingBuilds.html",type:"docs"},{title:"Itch.io Guide",    url:"https://itch.io/docs/creators/getting-started",     type:"docs"   }], projects:["Publish on Itch.io","Game Trailer Video"]  },
    ],
  },
};

export default function RoadmapPage({ user }) {
  const [roadmap,   setRoadmap]   = useState(null);
  const [allPaths,  setAllPaths]  = useState(FALLBACK);
  const [selected,  setSelected]  = useState(user?.careerPath || "webdev");
  const [loading,   setLoading]   = useState(true);
  const [expanded,  setExpanded]  = useState(null);
  const [toast,     setToast]     = useState({ msg:"", type:"" });

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"" }), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rm, all] = await Promise.all([Roadmap.getMine(), Roadmap.getAll()]);
      setRoadmap(rm);
      setAllPaths(all.roadmaps || FALLBACK);
      setSelected(rm.careerPath || "webdev");
    } catch { /* use fallback */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (stepId, current) => {
    try {
      await Roadmap.updateProgress(stepId, !current);
      showToast(!current ? "Step completed! 🎉" : "Marked incomplete");
      load();
    } catch (err) { showToast(err.message, "error"); }
  };

  const pathData  = allPaths[selected] || {};
  const color     = COLORS[selected] || "#00d4ff";
  const steps     = roadmap?.careerPath === selected
    ? roadmap.steps
    : (pathData.steps || []).map(s => ({ ...s, completed: false }));
  const done      = steps.filter(s => s.completed).length;
  const totalDays = steps.reduce((acc, s) => {
    const weeks = parseInt(s.duration) || 0;
    return acc + (weeks * 7);
  }, 0);

  return (
    <div style={{ paddingTop:80, minHeight:"100vh", padding:"80px 2rem 3rem", maxWidth:900, margin:"0 auto" }}>
      <Toast {...toast} />

      {/* Header */}
      <div style={{ marginBottom:"2rem" }}>
        <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#fff" }}>
          🗺️ Career Roadmap
        </h1>
        <p style={{ color:"#64748b", marginTop:4 }}>
          Follow your path step by step — with resources and projects for each topic
        </p>
      </div>

      {/* Path Tabs */}
      <div style={{ display:"flex", gap:"0.8rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {Object.entries(allPaths).map(([key, val]) => (
          <button key={key} onClick={() => setSelected(key)} style={{
            padding:"8px 16px", borderRadius:10, cursor:"pointer",
            border:`1px solid ${selected===key ? COLORS[key]||color : "#1e2d45"}`,
            background: selected===key ? (COLORS[key]||color)+"22" : "transparent",
            color: selected===key ? COLORS[key]||color : "#94a3b8",
            fontFamily:"DM Sans, sans-serif", fontWeight:500, fontSize:"0.85rem",
          }}>{val.icon} {val.label}</button>
        ))}
      </div>

      {/* Stats Bar */}
      {steps.length > 0 && (
        <div style={{
          background:"#111827", border:"1px solid #1e2d45",
          borderRadius:16, padding:"1.2rem 1.5rem",
          display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",
          gap:"1rem", marginBottom:"2rem",
        }}>
          {[
            { label:"Progress",       value:`${done}/${steps.length} steps`,                            color },
            { label:"Completion",     value:`${steps.length ? Math.round((done/steps.length)*100) : 0}%`, color },
            { label:"Total Duration", value:`~${Math.round(totalDays/7)} weeks`, color:"#f59e0b" },
            { label:"Status",         value: done===steps.length ? "Completed 🏆" : done===0 ? "Not Started" : "In Progress", color: done===steps.length?"#10b981":"#f59e0b" },
          ].map((s,i) => (
            <div key={i}>
              <div style={{ color:"#64748b", fontSize:"0.75rem", marginBottom:4 }}>{s.label}</div>
              <div style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color:s.color, fontSize:"1rem" }}>{s.value}</div>
            </div>
          ))}

          {/* Progress bar */}
          <div style={{ gridColumn:"1/-1" }}>
            <div style={{ height:8, background:"#1e2d45", borderRadius:4 }}>
              <div style={{
                width:`${steps.length ? (done/steps.length)*100 : 0}%`,
                height:"100%",
                background:`linear-gradient(90deg,${color},${color}88)`,
                borderRadius:4, transition:"width .5s ease",
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"3rem" }}><Spinner /></div>
      ) : steps.map((step, i) => (
        <div key={i} style={{ display:"flex", gap:"1.5rem", marginBottom:"1rem" }}>

          {/* Step number + line */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div onClick={() => toggle(step.id, step.completed)} style={{
              width:44, height:44, borderRadius:"50%", flexShrink:0, cursor:"pointer",
              background: step.completed ? color : "#1e2d45",
              border:`2px solid ${step.completed ? color : "#374151"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color: step.completed ? "#000" : "#64748b",
              fontWeight:700, fontSize:"0.9rem", transition:"all .2s",
            }}>{step.completed ? "✓" : i+1}</div>
            {i < steps.length-1 && (
              <div style={{ width:2, flex:1, minHeight:20, marginTop:4, background: step.completed ? color+"55" : "#1e2d45" }} />
            )}
          </div>

          {/* Step Card */}
          <div style={{
            flex:1, background:"#111827",
            border:`1px solid ${step.completed ? color+"44" : expanded===i ? color+"33" : "#1e2d45"}`,
            borderRadius:14, marginBottom:4, overflow:"hidden", transition:"all .2s",
          }}>

            {/* Card Header */}
            <div style={{ padding:"1.2rem 1.5rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                    <h3 style={{ fontFamily:"Syne, sans-serif", fontWeight:700, color: step.completed ? color : "#fff", fontSize:"1rem" }}>
                      {step.title}
                    </h3>
                    {step.difficulty && (
                      <span style={{
                        padding:"2px 10px", borderRadius:20, fontSize:"0.72rem",
                        background:(DIFFICULTY_COLOR[step.difficulty]||"#94a3b8")+"22",
                        color: DIFFICULTY_COLOR[step.difficulty]||"#94a3b8",
                      }}>{step.difficulty}</span>
                    )}
                    {step.duration && (
                      <span style={{ color:"#64748b", fontSize:"0.78rem" }}>⏱ {step.duration}</span>
                    )}
                    {step.completed && (
                      <span style={{ padding:"2px 10px", borderRadius:20, fontSize:"0.72rem", background:color+"22", color }}>✓ Done</span>
                    )}
                  </div>
                  <p style={{ color:"#64748b", fontSize:"0.85rem" }}>{step.description}</p>
                </div>

                <div style={{ display:"flex", gap:8 }}>
                  {/* Expand button */}
                  <button onClick={() => setExpanded(expanded===i ? null : i)} style={{
                    padding:"6px 14px", borderRadius:8,
                    border:`1px solid ${color}44`, background:color+"11", color,
                    cursor:"pointer", fontSize:"0.8rem", fontFamily:"DM Sans, sans-serif",
                  }}>{expanded===i ? "Hide ↑" : "Details ↓"}</button>

                  {/* Complete button */}
                  {!step.completed && (
                    <button onClick={() => toggle(step.id, step.completed)} style={{
                      padding:"6px 14px", borderRadius:8, border:"none",
                      background:`linear-gradient(135deg,${color},${color}aa)`,
                      color:"#000", cursor:"pointer", fontSize:"0.8rem",
                      fontFamily:"DM Sans, sans-serif", fontWeight:600,
                    }}>Mark Done ✓</button>
                  )}
                </div>
              </div>

              {/* Skills tags */}
              {(step.skills||[]).length > 0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:"0.8rem" }}>
                  {step.skills.map((sk,j) => (
                    <span key={j} style={{
                      padding:"3px 10px", borderRadius:6, fontSize:"0.75rem",
                      background:"#1e2d45", color:"#94a3b8",
                    }}>{sk}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Expanded Details */}
            {expanded===i && (
              <div style={{ borderTop:`1px solid #1e2d45`, padding:"1.2rem 1.5rem" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>

                  {/* Resources */}
                  {(step.resources||[]).length > 0 && (
                    <div>
                      <h4 style={{ color:"#94a3b8", fontSize:"0.8rem", fontWeight:600, marginBottom:"0.8rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                        📚 Learning Resources
                      </h4>
                      {step.resources.map((r,j) => (
                        <a key={j} href={r.url} target="_blank" rel="noreferrer" style={{
                          display:"flex", alignItems:"center", gap:8,
                          padding:"8px 10px", borderRadius:8, marginBottom:6,
                          background:"#0a0f1e", border:"1px solid #1e2d45",
                          textDecoration:"none", transition:"all .2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.borderColor=color+"44"}
                          onMouseLeave={e => e.currentTarget.style.borderColor="#1e2d45"}
                        >
                          <span style={{ fontSize:"1rem" }}>{RESOURCE_ICONS[r.type]||"🔗"}</span>
                          <span style={{ color:"#e2e8f0", fontSize:"0.85rem", flex:1 }}>{r.title}</span>
                          <span style={{ color:color, fontSize:"0.75rem" }}>Open →</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {(step.projects||[]).length > 0 && (
                    <div>
                      <h4 style={{ color:"#94a3b8", fontSize:"0.8rem", fontWeight:600, marginBottom:"0.8rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                        🛠️ Practice Projects
                      </h4>
                      {step.projects.map((p,j) => (
                        <div key={j} style={{
                          display:"flex", alignItems:"center", gap:8,
                          padding:"8px 10px", borderRadius:8, marginBottom:6,
                          background:"#0a0f1e", border:"1px solid #1e2d45",
                        }}>
                          <span style={{ color:color }}>▸</span>
                          <span style={{ color:"#e2e8f0", fontSize:"0.85rem" }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Completion Banner */}
      {done === steps.length && steps.length > 0 && (
        <div style={{
          marginTop:"2rem", padding:"2rem", borderRadius:16, textAlign:"center",
          background:`linear-gradient(135deg,${color}22,${color}11)`,
          border:`1px solid ${color}44`,
        }}>
          <div style={{ fontSize:"3rem", marginBottom:"0.5rem" }}>🏆</div>
          <h2 style={{ fontFamily:"Syne, sans-serif", fontWeight:800, color:"#fff", marginBottom:"0.5rem" }}>
            Roadmap Complete!
          </h2>
          <p style={{ color:"#94a3b8" }}>
            Congratulations! You have completed all steps for {pathData.label}. You are ready for the job market!
          </p>
        </div>
      )}
    </div>
  );
}