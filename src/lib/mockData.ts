// Mock data for the offline-first AI tutor
// In production, this would be downloaded and cached locally

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  unitsCount: number;
}

export interface Unit {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  order: number;
  lessonsCount: number;
  icon: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  duration: string;
  content: LessonContent[];
}

export interface LessonContent {
  type: 'text' | 'image' | 'example' | 'formula' | 'tip';
  content: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Available languages
export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
];

// Available subjects
export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    color: 'primary',
    description: 'Algebra, Geometry, Calculus & more',
    unitsCount: 8,
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: '⚡',
    color: 'accent',
    description: 'Mechanics, Thermodynamics, Waves',
    unitsCount: 6,
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '🧪',
    color: 'secondary',
    description: 'Organic, Inorganic, Physical',
    unitsCount: 7,
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: '🧬',
    color: 'success',
    description: 'Cell Biology, Genetics, Ecology',
    unitsCount: 6,
  },
];

// Units for Mathematics
export const mathUnits: Unit[] = [
  {
    id: 'math-algebra-1',
    subjectId: 'math',
    name: 'Introduction to Algebra',
    description: 'Learn the basics of algebraic expressions and equations',
    order: 1,
    lessonsCount: 5,
    icon: '🔤',
  },
  {
    id: 'math-geometry-1',
    subjectId: 'math',
    name: 'Basic Geometry',
    description: 'Shapes, angles, and spatial reasoning',
    order: 2,
    lessonsCount: 6,
    icon: '📐',
  },
  {
    id: 'math-fractions',
    subjectId: 'math',
    name: 'Fractions & Decimals',
    description: 'Master operations with fractions and decimals',
    order: 3,
    lessonsCount: 5,
    icon: '🔢',
  },
  {
    id: 'math-equations',
    subjectId: 'math',
    name: 'Linear Equations',
    description: 'Solve single and multi-variable equations',
    order: 4,
    lessonsCount: 6,
    icon: '⚖️',
  },
];

// Lessons for Algebra unit
export const algebraLessons: Lesson[] = [
  {
    id: 'algebra-1-1',
    unitId: 'math-algebra-1',
    title: 'What is Algebra?',
    description: 'Understanding variables and expressions',
    order: 1,
    xpReward: 15,
    duration: '5 min',
    content: [
      {
        type: 'text',
        content: 'Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations.',
      },
      {
        type: 'example',
        content: 'If x = 5, then x + 3 = 8',
      },
      {
        type: 'tip',
        content: 'Think of variables like mystery boxes that hold numbers!',
      },
      {
        type: 'text',
        content: 'Variables are letters that stand for unknown values. The most common variable is "x", but you can use any letter.',
      },
      {
        type: 'formula',
        content: 'Expression: 2x + 5 (where x is a variable)',
      },
    ],
  },
  {
    id: 'algebra-1-2',
    unitId: 'math-algebra-1',
    title: 'Variables & Constants',
    description: 'Learn the difference between variables and constants',
    order: 2,
    xpReward: 15,
    duration: '6 min',
    content: [
      {
        type: 'text',
        content: 'A constant is a fixed value that does not change. A variable can take different values.',
      },
      {
        type: 'example',
        content: 'In 3x + 7, the number 3 is a coefficient, x is a variable, and 7 is a constant.',
      },
      {
        type: 'tip',
        content: 'Constants are like rocks - they stay the same. Variables are like containers - they can hold different things!',
      },
    ],
  },
  {
    id: 'algebra-1-3',
    unitId: 'math-algebra-1',
    title: 'Simple Expressions',
    description: 'Creating and simplifying algebraic expressions',
    order: 3,
    xpReward: 20,
    duration: '7 min',
    content: [
      {
        type: 'text',
        content: 'An algebraic expression combines variables, numbers, and operations (+, -, ×, ÷).',
      },
      {
        type: 'formula',
        content: '2x + 3y - 5 is an expression with two variables',
      },
      {
        type: 'example',
        content: 'If x = 4 and y = 2, then 2x + 3y - 5 = 2(4) + 3(2) - 5 = 8 + 6 - 5 = 9',
      },
    ],
  },
  {
    id: 'algebra-1-4',
    unitId: 'math-algebra-1',
    title: 'Adding Like Terms',
    description: 'Combine similar terms to simplify expressions',
    order: 4,
    xpReward: 20,
    duration: '8 min',
    content: [
      {
        type: 'text',
        content: 'Like terms have the same variable raised to the same power. You can add or subtract like terms.',
      },
      {
        type: 'example',
        content: '3x + 5x = 8x (both terms have x, so we can add them)',
      },
      {
        type: 'example',
        content: '2x + 3y cannot be simplified (different variables)',
      },
      {
        type: 'tip',
        content: 'Think of it like adding apples: 3 apples + 5 apples = 8 apples!',
      },
    ],
  },
  {
    id: 'algebra-1-5',
    unitId: 'math-algebra-1',
    title: 'Solving for x',
    description: 'Find the value of unknown variables',
    order: 5,
    xpReward: 25,
    duration: '10 min',
    content: [
      {
        type: 'text',
        content: 'To solve for x, isolate the variable on one side of the equation by performing the same operation on both sides.',
      },
      {
        type: 'formula',
        content: 'If x + 5 = 12, subtract 5 from both sides: x = 7',
      },
      {
        type: 'example',
        content: '2x = 14 → Divide both sides by 2 → x = 7',
      },
      {
        type: 'tip',
        content: 'Whatever you do to one side, do to the other. Balance is key!',
      },
    ],
  },
];

// Quiz for Algebra lessons
export const algebraQuizzes: Quiz[] = [
  {
    id: 'quiz-algebra-1-1',
    lessonId: 'algebra-1-1',
    questions: [
      {
        id: 'q1',
        question: 'What is a variable in algebra?',
        options: [
          'A fixed number',
          'A letter representing an unknown value',
          'An operation like + or -',
          'A type of equation',
        ],
        correctIndex: 1,
        explanation: 'Variables are letters (like x, y, z) that represent unknown or changing values.',
      },
      {
        id: 'q2',
        question: 'If x = 3, what is 2x + 4?',
        options: ['7', '9', '10', '12'],
        correctIndex: 2,
        explanation: '2x + 4 = 2(3) + 4 = 6 + 4 = 10',
      },
      {
        id: 'q3',
        question: 'Which of these is an algebraic expression?',
        options: ['5 + 3', '2x + 7', '8 = 8', 'Hello'],
        correctIndex: 1,
        explanation: '2x + 7 contains a variable (x), making it an algebraic expression.',
      },
    ],
  },
  {
    id: 'quiz-algebra-1-4',
    lessonId: 'algebra-1-4',
    questions: [
      {
        id: 'q1',
        question: 'What is 5x + 3x?',
        options: ['8x²', '8x', '15x', '53x'],
        correctIndex: 1,
        explanation: '5x + 3x = 8x (add the coefficients, keep the variable)',
      },
      {
        id: 'q2',
        question: 'Which terms are "like terms"?',
        options: ['2x and 3y', '4x and 7x', 'x and x²', '2 and 2x'],
        correctIndex: 1,
        explanation: '4x and 7x both have the same variable (x) to the same power.',
      },
    ],
  },
];

// Get units by subject
export function getUnitsBySubject(subjectId: string): Unit[] {
  switch (subjectId) {
    case 'math':
      return mathUnits;
    default:
      return [];
  }
}

// Get lessons by unit
export function getLessonsByUnit(unitId: string): Lesson[] {
  switch (unitId) {
    case 'math-algebra-1':
      return algebraLessons;
    default:
      return [];
  }
}

// Get quiz by lesson
export function getQuizByLesson(lessonId: string): Quiz | undefined {
  return algebraQuizzes.find(q => q.lessonId === lessonId);
}

// Get lesson by ID
export function getLessonById(lessonId: string): Lesson | undefined {
  return algebraLessons.find(l => l.id === lessonId);
}

// Get unit by ID
export function getUnitById(unitId: string): Unit | undefined {
  return mathUnits.find(u => u.id === unitId);
}

// Get subject by ID
export function getSubjectById(subjectId: string): Subject | undefined {
  return subjects.find(s => s.id === subjectId);
}
