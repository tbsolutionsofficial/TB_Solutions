import { collection, getDocs, addDoc, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const SAMPLE_PROJECTS = [
  {
    title: "AI-Based Defect Detection System",
    domain: "Artificial Intelligence",
    client: "Chennai Manufacturing Co.",
    description:
      "Developed a computer vision system using TensorFlow and OpenCV to detect manufacturing defects in real-time on a production line. The system processes camera feeds and flags defective items with 94% accuracy, significantly reducing manual inspection overhead.",
    outcome: "60% reduction in QC time",
    tags: ["Python", "OpenCV", "TensorFlow", "Raspberry Pi"],
    images: [],
    videoUrl: "",
    featured: true,
    status: "completed" as const,
  },
  {
    title: "Smart Agriculture IoT System",
    domain: "Internet of Things (IoT)",
    client: "Sri Eshwar College",
    description:
      "Built an end-to-end IoT solution for precision agriculture using ESP32 sensors, real-time soil moisture tracking, automated drip irrigation, and a Firebase-backed dashboard for remote monitoring and control.",
    outcome: "40% water saving in field trials",
    tags: ["Arduino", "ESP32", "Node.js", "Firebase"],
    images: [],
    videoUrl: "",
    featured: true,
    status: "completed" as const,
  },
  {
    title: "College ERP Web Application",
    domain: "Web Development",
    client: "PSG College of Technology",
    description:
      "Designed and built a comprehensive ERP system for academic resource management covering student records, attendance, exam results, and library tracking. Fully responsive, role-based access for students, faculty, and admin.",
    outcome: "Replaced 3 manual registers for 2000 students",
    tags: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    images: [],
    videoUrl: "",
    featured: false,
    status: "completed" as const,
  },
  {
    title: "Autonomous Line Following Robot",
    domain: "Robotics",
    client: "Kumaraguru College Student",
    description:
      "Engineered a high-speed autonomous line-following robot with PID control, IR sensor array, and custom PCB for optimised motor driving. Competed in inter-college robotics fest and achieved best-in-class lap times.",
    outcome: "Won 1st place at Techfest 2025",
    tags: ["Arduino", "C++", "IR Sensors", "Motor Driver"],
    images: [],
    videoUrl: "",
    featured: false,
    status: "completed" as const,
  },
];

const SAMPLE_REVIEWS = [
  {
    name: "Arjun R",
    role: "Student",
    college: "PSG College of Technology",
    domain: "Web Development",
    rating: 5,
    review:
      "TorchBearer built my final year project in 3 weeks. Professional team and impressive results. They understood exactly what I needed and delivered beyond expectations.",
    approved: true,
  },
  {
    name: "Prof. Kavitha S",
    role: "Professor",
    college: "Sri Eshwar College",
    domain: "Internet of Things (IoT)",
    rating: 5,
    review:
      "Excellent team for IoT lab projects. On time, within budget, students loved the results. Their technical depth and communication were outstanding throughout the project.",
    approved: true,
  },
  {
    name: "Ravi M",
    role: "Manager",
    college: "Chennai Manufacturing Co.",
    domain: "Artificial Intelligence",
    rating: 5,
    review:
      "Their AI system cut our QC time by 60%. Best investment in 2025. Highly recommend TorchBearer Solutions for any industrial automation or AI project.",
    approved: true,
  },
];

const DEFAULT_SITE_CONTENT = {
  heroHeadline: "We Light the Way to Tomorrow's Technology",
  heroSubtitle:
    "Project services across 12 technology domains for students, colleges, and industries across India.",
  phone: "+91 6303987443",
  email: "hello@torchbearersolutions.in",
  website: "tbsolutions.web.app",
  whatsapp: "916303987443",
  instagram: "@torchbearersolutions",
  linkedin: "https://linkedin.com/company/torchbearersolutions",
  projectsCount: "100+",
  domainsCount: "12",
  aboutText:
    "TorchBearer Solutions is India's trusted technology partner for students, colleges, and industries. We deliver high-quality projects across 12 domains with a team of expert engineers and educators.",
};

export async function seedDatabase() {
  const projectsSnap = await getDocs(collection(db, "projects"));
  if (!projectsSnap.empty) return;

  for (const project of SAMPLE_PROJECTS) {
    await addDoc(collection(db, "projects"), {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  for (const review of SAMPLE_REVIEWS) {
    await addDoc(collection(db, "reviews"), {
      ...review,
      createdAt: serverTimestamp(),
    });
  }

  await setDoc(doc(db, "siteContent", "main"), {
    ...DEFAULT_SITE_CONTENT,
    updatedAt: serverTimestamp(),
  });
}
