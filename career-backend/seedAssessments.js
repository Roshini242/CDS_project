const mongoose = require("mongoose");
const Assessment = require("./models/Assessment");
require("dotenv").config();

const assessments = [
  {
    topic: "HTML & CSS Basics",
    difficulty: "Beginner",
    duration: 10,
    questions: [
      { question: "What does HTML stand for?", options: ["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Language","None of the above"], correctAnswer: 0, explanation: "HTML stands for Hyper Text Markup Language — the standard language for creating web pages." },
      { question: "Which CSS property controls text size?", options: ["font-weight","text-size","font-size","text-style"], correctAnswer: 2, explanation: "font-size controls the size of text in CSS." },
      { question: "Which tag is used for the largest heading?", options: ["<h6>","<h1>","<heading>","<head>"], correctAnswer: 1, explanation: "<h1> is the largest heading tag in HTML." },
      { question: "What does CSS stand for?", options: ["Computer Style Sheets","Creative Style Sheets","Cascading Style Sheets","Colorful Style Sheets"], correctAnswer: 2, explanation: "CSS stands for Cascading Style Sheets." },
      { question: "Which property is used to change background color?", options: ["color","bgcolor","background-color","bg-color"], correctAnswer: 2, explanation: "background-color is the correct CSS property for setting background color." },
    ],
  },
  {
    topic: "JavaScript Fundamentals",
    difficulty: "Beginner",
    duration: 12,
    questions: [
      { question: "Which keyword declares a variable that cannot be reassigned?", options: ["var","let","const","static"], correctAnswer: 2, explanation: "const declares a block-scoped variable that cannot be reassigned." },
      { question: "What is the output of typeof null?", options: ["null","undefined","object","string"], correctAnswer: 2, explanation: "typeof null returns 'object' — a known JavaScript quirk." },
      { question: "Which method adds an element to the end of an array?", options: ["push()","pop()","shift()","unshift()"], correctAnswer: 0, explanation: "push() adds one or more elements to the end of an array." },
      { question: "What does === check in JavaScript?", options: ["Only value","Only type","Both value and type","Neither"], correctAnswer: 2, explanation: "=== is strict equality — checks both value and type without type coercion." },
      { question: "Which is NOT a JavaScript data type?", options: ["String","Boolean","Float","Undefined"], correctAnswer: 2, explanation: "Float is not a JavaScript data type. Numbers in JS are all type 'number'." },
    ],
  },
  {
    topic: "React.js",
    difficulty: "Intermediate",
    duration: 15,
    questions: [
      { question: "What hook is used to manage state in functional components?", options: ["useEffect","useContext","useState","useRef"], correctAnswer: 2, explanation: "useState is the hook used to add state to functional components." },
      { question: "What does useEffect do?", options: ["Manages state","Handles side effects","Creates context","Manages refs"], correctAnswer: 1, explanation: "useEffect handles side effects like API calls, subscriptions, and DOM manipulation." },
      { question: "What is JSX?", options: ["A JavaScript library","A syntax extension for JavaScript","A CSS framework","A database query language"], correctAnswer: 1, explanation: "JSX is a syntax extension that allows writing HTML-like code inside JavaScript." },
      { question: "How do you pass data from parent to child in React?", options: ["State","Refs","Props","Context"], correctAnswer: 2, explanation: "Props (properties) are used to pass data from parent to child components." },
      { question: "Which method re-renders a React component?", options: ["forceUpdate()","setState()","render()","update()"], correctAnswer: 1, explanation: "Calling setState() triggers a re-render of the component with the new state." },
    ],
  },
  {
    topic: "Node.js & Express",
    difficulty: "Intermediate",
    duration: 12,
    questions: [
      { question: "What is Node.js?", options: ["A browser","A JavaScript runtime built on Chrome's V8 engine","A CSS framework","A database"], correctAnswer: 1, explanation: "Node.js is a JavaScript runtime environment built on Chrome's V8 engine." },
      { question: "Which method handles a GET request in Express?", options: ["app.post()","app.get()","app.put()","app.request()"], correctAnswer: 1, explanation: "app.get() is used to define a route handler for GET HTTP requests." },
      { question: "What is middleware in Express?", options: ["A database layer","A function that has access to req and res objects","A frontend framework","A testing library"], correctAnswer: 1, explanation: "Middleware functions have access to the request, response, and next function in the request-response cycle." },
      { question: "Which module is used to create an HTTP server in Node.js?", options: ["fs","path","http","url"], correctAnswer: 2, explanation: "The http module is used to create HTTP servers in Node.js." },
      { question: "What does npm stand for?", options: ["Node Package Module","Node Project Manager","Node Package Manager","New Project Module"], correctAnswer: 2, explanation: "npm stands for Node Package Manager — used to manage JavaScript packages." },
    ],
  },
  {
    topic: "MongoDB & Databases",
    difficulty: "Intermediate",
    duration: 12,
    questions: [
      { question: "MongoDB stores data in what format?", options: ["Tables","XML","JSON-like documents","CSV"], correctAnswer: 2, explanation: "MongoDB stores data in BSON (Binary JSON) format, which looks like JSON documents." },
      { question: "Which command finds all documents in a collection?", options: ["db.collection.findAll()","db.collection.find({})","db.collection.getAll()","db.collection.select()"], correctAnswer: 1, explanation: "db.collection.find({}) returns all documents in a MongoDB collection." },
      { question: "What is Mongoose?", options: ["A MongoDB GUI","An ODM library for MongoDB and Node.js","A database itself","A REST API framework"], correctAnswer: 1, explanation: "Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js." },
      { question: "Which MongoDB operator is used to update a field?", options: ["$set","$update","$change","$modify"], correctAnswer: 0, explanation: "$set is the MongoDB operator used to update the value of a field." },
      { question: "What is a MongoDB collection?", options: ["A row in a table","A database connection","A group of documents","A schema definition"], correctAnswer: 2, explanation: "A collection in MongoDB is a group of documents, similar to a table in SQL." },
    ],
  },
  {
    topic: "Python Basics",
    difficulty: "Beginner",
    duration: 10,
    questions: [
      { question: "What is the correct way to create a function in Python?", options: ["function myFunc():","def myFunc():","create myFunc():","fun myFunc():"], correctAnswer: 1, explanation: "In Python, functions are defined using the 'def' keyword." },
      { question: "Which data type is mutable in Python?", options: ["String","Tuple","List","Integer"], correctAnswer: 2, explanation: "Lists are mutable in Python — you can add, remove, or change elements." },
      { question: "What does len() function do?", options: ["Returns last element","Returns length of an object","Deletes an element","Converts to string"], correctAnswer: 1, explanation: "len() returns the number of items in an object like a list, string, or tuple." },
      { question: "Which symbol is used for comments in Python?", options: ["//","/*","#","--"], correctAnswer: 2, explanation: "# is used for single-line comments in Python." },
      { question: "What is the output of print(2 ** 3)?", options: ["6","8","9","5"], correctAnswer: 1, explanation: "** is the exponentiation operator in Python. 2**3 = 2³ = 8." },
    ],
  },
  {
    topic: "Data Structures & Algorithms",
    difficulty: "Advanced",
    duration: 20,
    questions: [
      { question: "What is the time complexity of binary search?", options: ["O(n)","O(n²)","O(log n)","O(1)"], correctAnswer: 2, explanation: "Binary search has O(log n) time complexity as it halves the search space each step." },
      { question: "Which data structure uses LIFO order?", options: ["Queue","Stack","Tree","Graph"], correctAnswer: 1, explanation: "Stack uses Last In First Out (LIFO) — the last element added is the first to be removed." },
      { question: "What is a linked list?", options: ["An array with fixed size","A linear data structure where elements are linked using pointers","A type of binary tree","A hash table"], correctAnswer: 1, explanation: "A linked list is a linear data structure where each element (node) contains data and a pointer to the next node." },
      { question: "Which sorting algorithm has the best average case time complexity?", options: ["Bubble Sort","Selection Sort","Quick Sort","Insertion Sort"], correctAnswer: 2, explanation: "Quick Sort has an average case time complexity of O(n log n), making it one of the fastest sorting algorithms." },
      { question: "What is a hash table?", options: ["A sorted array","A data structure that maps keys to values using a hash function","A type of linked list","A binary search tree"], correctAnswer: 1, explanation: "A hash table maps keys to values using a hash function, allowing O(1) average case lookups." },
    ],
  },
  {
    topic: "Cybersecurity Basics",
    difficulty: "Beginner",
    duration: 10,
    questions: [
      { question: "What does HTTPS stand for?", options: ["Hyper Text Transfer Protocol Secure","High Transfer Protocol System","Hyper Transfer Procedure Secure","None of the above"], correctAnswer: 0, explanation: "HTTPS stands for Hyper Text Transfer Protocol Secure — it encrypts data between browser and server." },
      { question: "What is a firewall?", options: ["A type of virus","A network security system that monitors and controls incoming/outgoing traffic","A password manager","A type of encryption"], correctAnswer: 1, explanation: "A firewall is a network security system that monitors and controls network traffic based on security rules." },
      { question: "What is phishing?", options: ["A type of encryption","A network protocol","A cyberattack that tricks users into revealing sensitive information","A type of firewall"], correctAnswer: 2, explanation: "Phishing is a social engineering attack that tricks users into revealing passwords, credit card numbers, etc." },
      { question: "What does SQL injection do?", options: ["Speeds up database queries","Inserts malicious SQL code to manipulate a database","Encrypts database data","Creates database backups"], correctAnswer: 1, explanation: "SQL injection inserts malicious SQL statements into input fields to manipulate or access the database." },
      { question: "What is two-factor authentication (2FA)?", options: ["Using two passwords","A security process requiring two forms of verification","Encrypting data twice","A type of firewall"], correctAnswer: 1, explanation: "2FA adds an extra layer of security by requiring two forms of verification (e.g., password + OTP)." },
    ],
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/careerdev");
  await Assessment.deleteMany({});
  await Assessment.insertMany(assessments);
  console.log(`✅ ${assessments.length} assessments seeded!`);
  mongoose.disconnect();
  process.exit(0);
};

seed();