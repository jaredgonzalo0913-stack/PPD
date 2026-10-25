# ELCO 1 — ME-C Engine Control System LMS

A comprehensive, professional Learning Management System specifically designed for maritime engineering students to master the MAN B&W ME-C electronically controlled marine engine through interactive lessons, 3D visualization, and system analysis.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
cd elco-lms
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📋 Features

### 1. **Interactive Learning Modules** 📚
- 8 comprehensive modules covering:
  - Introduction to ME-C Engines
  - ME-C Engine Control System
  - Fuel Injection Control
  - Exhaust Valve Control
  - Hydraulic Control Systems
  - Sensors and Feedback Systems
  - Engine Safety and Monitoring
  - Interactive Assessments
- Each lesson includes content, component references, and quizzes

### 2. **3D Engine Visualization Lab** ⚙️
- Interactive 3D ME-C engine viewer (expandable with Three.js)
- Multiple view modes: Normal, Exploded, Cutaway, Component
- 360° rotation and camera controls
- Auto-rotation feature
- Guided tour capability
- Component selection and highlighting

### 3. **ME-C Component Library** 📋
- 14 major ME-C engine components with detailed information:
  - Sensors (Crank angle, Pressure, Temperature)
  - Actuators (FIVA, Exhaust valve actuator)
  - Electronic systems (ECU, Control units)
  - Hydraulic systems (Power supply, Cylinders, Oil system)
  - Mechanical components (Fuel injectors, Exhaust valves)
- Categorized by function
- Component information panels with:
  - Description and purpose
  - Operating principles
  - Role in ME-C system
  - Related components
  - Key learning points

### 4. **System Explorer** 🔗
- Animated system flow diagrams
- Electronic control flow visualization
- Fuel injection control sequence
- Exhaust valve control sequence
- ME-C control system architecture overview

### 5. **Assessment System** ✅
- Multiple quiz types:
  - Multiple choice questions
  - Component identification
  - System flow understanding
  - Scenario-based questions
- Real-time feedback with explanations
- Progress tracking
- Score management

### 6. **Progress Dashboard** 📊
- Learning progress visualization
- Module performance tracking
- Component exploration statistics
- Quiz completion tracking
- Achievement and badge system
- XP (Experience Points) accumulation

### 7. **Gamification** 🎮
- Achievement badges for milestones
- XP system for completed activities
- Completion percentages
- Progress streaks
- Achievements include:
  - First Engine Explorer
  - Component Master
  - Control System Specialist
  - Hydraulics Expert
  - And more...

## 🏗️ Project Structure

```
elco-lms/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.tsx
│   │   ├── ComponentCard.tsx
│   │   ├── ComponentPanel.tsx
│   │   ├── Quiz.tsx
│   │   ├── ModuleCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── AchievementBadge.tsx
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── ModulesPage.tsx
│   │   ├── EngineLabPage.tsx
│   │   ├── ComponentsPage.tsx
│   │   ├── SystemExplorerPage.tsx
│   │   ├── AssessmentsPage.tsx
│   │   └── ProgressPage.tsx
│   ├── data/               # Content and data files
│   │   ├── components.ts
│   │   ├── modules.ts
│   │   └── achievements.ts
│   ├── store/              # State management (Zustand)
│   │   └── index.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design

### Color Scheme
- **Navy** (#0a1628) - Primary background
- **Deep Blue** (#1a2f4f) - Secondary background
- **Steel Gray** (#2a3d5f) - Cards and panels
- **Light Gray** (#c0c8d4) - Text
- **Cyan** (#00d4ff) - Highlights and accents
- **Cyan Dark** (#0099cc) - Interactive elements

### Design Philosophy
Maritime engineering aesthetic with:
- Glass-morphism panels
- Smooth animations
- Professional technical interface
- Technical blueprint elements
- Subtle cyan glow effects

## 🔧 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom CSS
- **State Management**: Zustand
- **Animations**: Framer Motion (ready for integration)
- **3D Graphics**: Three.js (framework included, model implementation pending)
- **Icons**: Lucide React
- **UI Components**: Custom components

## 📝 Usage Guide

### For Students

1. **Start on Home Page**
   - Review the platform overview
   - Choose your learning path

2. **Learn Through Modules**
   - Go to "Learning Modules"
   - Read lesson content
   - Complete quizzes
   - Track your progress

3. **Explore 3D Engine**
   - Navigate to "3D Engine Lab"
   - Rotate and examine engine
   - Select components to learn
   - Use guided tour for structured learning

4. **Study Components**
   - Use "Component Library"
   - Filter by category
   - Read detailed information
   - Track exploration progress

5. **Understand Systems**
   - Visit "System Explorer"
   - Study control flow diagrams
   - Learn component interactions

6. **Take Assessments**
   - Go to "Assessments"
   - Complete quizzes
   - Review explanations
   - Improve your scores

7. **Track Progress**
   - Check "Progress" page
   - View module scores
   - Earn achievements
   - Accumulate XP

## 🚀 Future Enhancements

### Phase 2 - 3D Engine Implementation
- Integrate Three.js 3D engine model
- Add interactive component selection
- Implement exploded view animations
- Create component detachment/inspection
- Add cutaway view mode
- Implement guided tour animations

### Phase 3 - Advanced Features
- Save student progress to backend
- Implement user authentication
- Add real-time multiplayer features
- Create discussion forums
- Add downloadable certificates
- Implement instructor dashboard

### Phase 4 - Performance
- Optimize 3D model loading
- Add progressive web app (PWA) support
- Implement service workers
- Add offline capability
- Optimize bundle size

## 📚 Learning Outcomes

After completing this course, students will be able to:
- Understand ME-C engine architecture and control principles
- Explain electronic fuel injection control systems
- Describe exhaust valve actuation and timing
- Identify and locate ME-C components
- Explain sensor feedback mechanisms
- Understand safety and monitoring systems
- Apply knowledge to real-world scenarios

## 🎯 Assessment Criteria

- **Modules**: 8 lessons with embedded quizzes
- **Components**: Identification and understanding of 14 key components
- **System Understanding**: Demonstration of control flow knowledge
- **Final Assessment**: Comprehensive capstone quiz

## 📞 Support

For issues or questions:
1. Review the component library
2. Check the system explorer diagrams
3. Go back to relevant module lessons
4. Use the guided tour for visual guidance

## 📄 License

This project is designed for educational purposes in maritime engineering curricula.

## ✨ Credits

Developed as an ELCO 1 (Emerging Technologies in the Maritime Industry) capstone project for learning the MAN B&W ME-C electronically controlled marine engine control system.

---

**Ready to explore the future of maritime propulsion? Start your journey now!** ⚓🚢
