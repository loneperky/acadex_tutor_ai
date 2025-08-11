import {
  Library,
  Search,
  ExternalLink,
  Download,
  BookOpen,
  Video,
  FileText,
  Globe,
  Star,
  Users
} from "lucide-react";

export interface User {
  full_name: string,
  email: string,
  password: string,
  id: string,
  academic_level: string,
  study_field: string,
  institution: string,
  country: string,
  phone_number: string,
  language: string,
  linkedin: string,
  website: string,
  dob: string,
  gender: string,
  research_interest: string,
  bio: string,
  avatar_url: string,
  plan: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// 6181 8e52 f02b 57c5

export interface AuthContextType {
  user: (User & { profile?: any }) | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  UpdateProfile: (academic_level: string,
    study_field: string, institution: string, country: string, phone_number: string, language: string, linkedin: string, website: string, dob: string, gender: string,
    research_interest: string, short_bio: string, avatar_url: string) => Promise<boolean>;
  logout: () => void;
  deleteAcc: () => void;
  loading: boolean;
  fetchUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResponse>; // ✅ updated
  setUser: React.Dispatch<React.SetStateAction<(User & { profile?: any }) | null>>;
}

// Chat context

export interface Message {
  id?: number;
  content: string;
  role: "user" | "assistant"
  timestamp?: Date;
}

export interface Chat {
  id?: number;
  title: string,
  timestamp: Date
}

export interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (msg: string) => Promise<string>;
  loading: boolean;
  chatId: string | null;
  loadChatHistory: (chatId: string) => Promise<void>;
  startNewChat: () => void;
  chats: Chat[];
  setChat: React.Dispatch<React.SetStateAction<Chat[]>>;
}



export const resources = [
  {
    id: 1,
    title: "Khan Academy Mathematics",
    category: "Mathematics",
    type: "Online Course",
    description: "Comprehensive mathematics courses from basic arithmetic to advanced calculus.",
    url: "https://khanacademy.org/math",
    rating: 4.9,
    users: "10M+",
    icon: Video,
    free: true,
  },
  {
    id: 2,
    title: "CS50 – Introduction to Computer Science",
    category: "Computer Science",
    type: "University Course",
    description: "Harvard's legendary intro to computer science, available for free on YouTube.",
    url: "https://youtu.be/8mAITcNt710",
    rating: 4.9,
    users: "5M+",
    icon: Video,
    free: true,
  },
  {
    id: 3,
    title: "freeCodeCamp.org",
    category: "Programming",
    type: "Interactive Course",
    description: "Learn HTML, CSS, JavaScript, Python and more with hands-on coding challenges.",
    url: "https://www.freecodecamp.org",
    rating: 4.8,
    users: "20M+",
    icon: Globe,
    free: true,
  },
  {
    id: 4,
    title: "MIT OpenCourseWare",
    category: "Engineering",
    type: "University Lectures",
    description: "Access lecture videos and notes from real MIT courses — free for everyone.",
    url: "https://ocw.mit.edu",
    rating: 4.9,
    users: "2M+",
    icon: Globe,
    free: true,
  },
  {
    id: 5,
    title: "CrashCourse Economics",
    category: "Business",
    type: "Video Series",
    description: "Easy-to-understand economics series by CrashCourse on YouTube.",
    url: "https://youtube.com/playlist?list=PL8dPuuaLjXtOfse2ncvffeelTrqvhrz8H",
    rating: 4.7,
    users: "1M+",
    icon: Video,
    free: true,
  },
  {
    id: 6,
    title: "3Blue1Brown – Linear Algebra",
    category: "Mathematics",
    type: "Video Series",
    description: "Visual and intuitive explanations of linear algebra concepts.",
    url: "https://youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr",
    rating: 4.9,
    users: "3M+",
    icon: Video,
    free: true,
  },
  {
    id: 7,
    title: "Google Digital Garage",
    category: "Business",
    type: "Certificate Course",
    description: "Free certificate courses from Google on digital marketing and career skills.",
    url: "https://learndigital.withgoogle.com/digitalgarage",
    rating: 4.6,
    users: "1.5M+",
    icon: Globe,
    free: true,
  },
  {
    id: 8,
    title: "Paul's Online Math Notes",
    category: "Mathematics",
    type: "Notes",
    description: "Extensive math tutorials and notes covering algebra, calculus, and differential equations.",
    url: "https://tutorial.math.lamar.edu",
    rating: 4.7,
    users: "800K+",
    icon: BookOpen,
    free: true,
  },
  {
    id: 9,
    title: "OpenStax Textbooks",
    category: "Various",
    type: "Textbook",
    description: "Peer-reviewed, openly licensed college textbooks for many subjects.",
    url: "https://openstax.org",
    rating: 4.8,
    users: "2M+",
    icon: BookOpen,
    free: true,
  },
  {
    id: 10,
    title: "TED-Ed – Science & Learning",
    category: "Computer Science",
    type: "Animated Videos",
    description: "Short educational videos to spark curiosity on science and learning topics.",
    url: "https://youtube.com/user/TEDEducation",
    rating: 4.6,
    users: "3M+",
    icon: Video,
    free: true,
  },
  {
    id: 11,
    title: "The Odin Project",
    category: "Programming",
    type: "Project-Based Learning",
    description: "Full-stack web development curriculum with real-world projects.",
    url: "https://www.theodinproject.com",
    rating: 4.8,
    users: "1M+",
    icon: Globe,
    free: true,
  },
  {
    id: 12,
    title: "Coursera Python for Everybody (Audit)",
    category: "Computer Science",
    type: "University Course",
    description: "University of Michigan's Python course — free to audit without certificate.",
    url: "https://www.coursera.org/specializations/python",
    rating: 4.7,
    users: "2M+",
    icon: Globe,
    free: true,
  },
  {
    id: 13,
    title: "W3Schools",
    category: "Programming",
    type: "Documentation",
    description: "Interactive tutorials and documentation for web technologies like HTML, CSS, JS.",
    url: "https://www.w3schools.com",
    rating: 4.5,
    users: "10M+",
    icon: Globe,
    free: true,
  },
  {
    id: 14,
    title: "Geogebra",
    category: "Mathematics",
    type: "Tool",
    description: "Interactive geometry, algebra, and calculus tools for learners and educators.",
    url: "https://www.geogebra.org",
    rating: 4.8,
    users: "3M+",
    icon: Globe,
    free: true,
  },
  {
    id: 15,
    title: "Python Programming - freeCodeCamp",
    category: "Programming",
    type: "Video Course",
    description: "Full Python course on YouTube (4+ hours) with exercises.",
    url: "https://youtu.be/rfscVS0vtbw",
    rating: 4.9,
    users: "12M+",
    icon: Video,
    free: true,
  },
  {
    id: 16,
    title: "Codecademy Learn SQL (Free Tier)",
    category: "Computer Science",
    type: "Interactive Course",
    description: "Intro to SQL queries and databases — free modules available.",
    url: "https://www.codecademy.com/learn/learn-sql",
    rating: 4.4,
    users: "1M+",
    icon: Globe,
    free: true,
  },
  {
    id: 17,
    title: "PhET Interactive Simulations",
    category: "Physics",
    type: "Simulations",
    description: "Interactive science and math simulations from University of Colorado Boulder.",
    url: "https://phet.colorado.edu",
    rating: 4.9,
    users: "4M+",
    icon: Globe,
    free: true,
  },
  {
    id: 18,
    title: "Investopedia",
    category: "Business",
    type: "Encyclopedia",
    description: "Free financial education and investment tutorials.",
    url: "https://www.investopedia.com",
    rating: 4.6,
    users: "5M+",
    icon: Globe,
    free: true,
  },
  {
    id: 19,
    title: "ChemCollective Virtual Labs",
    category: "Chemistry",
    type: "Virtual Lab",
    description: "Simulated chemistry experiments for high school and college students.",
    url: "https://chemcollective.org/vlabs",
    rating: 4.5,
    users: "700K+",
    icon: Globe,
    free: true,
  },
  {
    id: 20,
    title: "CS50 Web Programming with Python and JavaScript",
    category: "Programming",
    type: "Advanced Course",
    description: "Harvard’s advanced full-stack course with Django, JS, and databases.",
    url: "https://cs50.harvard.edu/web/2020/",
    rating: 4.8,
    users: "1M+",
    icon: Globe,
    free: true,
  },
];