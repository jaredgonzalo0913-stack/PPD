import { LearningModule } from '../types';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'module-01',
    title: 'Introduction to ME-C Engines',
    description: 'Fundamentals of electronically controlled marine diesel engines',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'lesson-01-01',
        title: 'What is an ME-C Engine?',
        content: 'The MAN B&W ME-C engine represents a revolutionary approach to marine propulsion through electronic control. Unlike traditional mechanically controlled engines, the ME-C uses sophisticated electronic control systems to optimize every aspect of engine operation.',
        components: ['ecs', 'ecu'],
        quiz: {
          id: 'quiz-01-01',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What does "ME-C" stand for?',
              options: [
                'Marine Engine - Controlled',
                'MAN Electronically Controlled',
                'Mechanical Engine - Conventional',
              ],
              correctAnswer: 1,
              explanation: 'ME-C stands for MAN Electronically Controlled engine, manufactured by MAN B&W Diesel.',
            },
          ],
        },
      },
      {
        id: 'lesson-01-02',
        title: 'Conventional vs Electronic Control',
        content: 'Traditional marine engines relied on mechanical systems with fuel injection pumps driven by cams. ME-C engines replace this with electronic control, enabling real-time optimization of fuel injection and valve timing.',
        components: ['ecu', 'fuel-injection-valve', 'exhaust-valve-actuator'],
        quiz: {
          id: 'quiz-01-02',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What is a key advantage of electronic control over mechanical control?',
              options: [
                'Lower manufacturing costs',
                'Real-time optimization based on engine conditions',
                'Simpler system architecture',
              ],
              correctAnswer: 1,
              explanation: 'Electronic control systems can continuously adjust engine parameters based on real-time sensor feedback for optimal performance.',
            },
          ],
        },
      },
      {
        id: 'lesson-01-03',
        title: 'Benefits of ME-C Technology',
        content: 'ME-C engines provide significant advantages: improved fuel efficiency through precise injection control, reduced emissions, better power output, and built-in monitoring and protection systems.',
        components: ['ecs', 'crank-angle-sensor', 'pressure-sensor'],
        quiz: {
          id: 'quiz-01-03',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'Which of these is NOT a benefit of ME-C engines?',
              options: [
                'Improved fuel efficiency',
                'Reduced emissions',
                'Eliminates need for engine monitoring',
              ],
              correctAnswer: 2,
              explanation: 'ME-C engines actually REQUIRE more sophisticated monitoring. Electronic control enables enhanced monitoring for safety and performance.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'module-02',
    title: 'ME-C Engine Control System',
    description: 'Deep dive into the electronic control architecture and components',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'lesson-02-01',
        title: 'Engine Control System Architecture',
        content: 'The ME-C control system follows a distributed architecture with a main ECU coordinating multiple control units. This design ensures redundancy, reliability, and specialized control of different engine systems.',
        components: ['ecs', 'ecu', 'cu'],
        quiz: {
          id: 'quiz-02-01',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'Why does ME-C use multiple control units instead of a single controller?',
              options: [
                'To reduce costs',
                'To provide redundancy and specialized system management',
                'To make the system easier to operate',
              ],
              correctAnswer: 1,
              explanation: 'Distributed control architecture provides fault tolerance and allows specialized optimization of different engine systems.',
            },
          ],
        },
      },
      {
        id: 'lesson-02-02',
        title: 'Electronic Control Unit Functions',
        content: 'The ECU is the brain of the ME-C system. It continuously receives sensor data, executes sophisticated control algorithms, monitors safety limits, and sends commands to actuators. The ECU can perform thousands of calculations per second.',
        components: ['ecu', 'crank-angle-sensor', 'pressure-sensor', 'temperature-sensor'],
        quiz: {
          id: 'quiz-02-02',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What is the primary function of the ECU?',
              options: [
                'To physically move engine components',
                'To measure engine parameters',
                'To process sensor data and generate control signals',
              ],
              correctAnswer: 2,
              explanation: 'The ECU processes sensor inputs through control algorithms and generates output signals to actuators.',
            },
          ],
        },
      },
      {
        id: 'lesson-02-03',
        title: 'Sensor Integration',
        content: 'Multiple sensors provide real-time feedback: crank angle sensors for timing reference, pressure sensors for system monitoring, temperature sensors for thermal management. The ECU integrates all this data for coordinated control.',
        components: ['crank-angle-sensor', 'pressure-sensor', 'temperature-sensor', 'ecu'],
        quiz: {
          id: 'quiz-02-03',
          questions: [
            {
              id: 'q1',
              type: 'identification',
              question: 'Which sensor provides the primary timing reference for engine control?',
              options: ['Crank angle sensor', 'Pressure sensor', 'Temperature sensor'],
              correctAnswer: 0,
              explanation: 'The crank angle sensor provides essential timing information for all time-based control decisions.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'module-03',
    title: 'Fuel Injection Control',
    description: 'Understanding electronic fuel injection system and FIVA operation',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'lesson-03-01',
        title: 'Fuel Injection Fundamentals',
        content: 'Modern fuel injection requires precise timing and quantity control. The ME-C electronic fuel injection system enables injection optimization for each engine condition, delivering fuel at exactly the right moment for optimal combustion.',
        components: ['fuel-injection-system', 'fuel-injection-valve', 'fiva'],
        quiz: {
          id: 'quiz-03-01',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'Why is precise fuel injection timing critical in ME-C engines?',
              options: [
                'To reduce engine weight',
                'To optimize combustion efficiency and emissions',
                'To simplify engine operation',
              ],
              correctAnswer: 1,
              explanation: 'Precise injection timing maximizes combustion efficiency and minimizes harmful emissions.',
            },
          ],
        },
      },
      {
        id: 'lesson-03-02',
        title: 'FIVA - Fuel Injection Valve Actuator',
        content: 'FIVA is the key innovation in ME-C fuel injection. It converts electronic control signals into hydraulic pressure that opens fuel injection valves. A solenoid valve receives signals from the ECU and modulates pilot pressure that opens the main fuel injection valve.',
        components: ['fiva', 'fuel-injection-valve', 'hydraulic-power-supply', 'ecu'],
        quiz: {
          id: 'quiz-03-02',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'How does FIVA convert electronic signals into fuel injection?',
              options: [
                'Direct mechanical linkage to fuel pump',
                'Electronic solenoid controls hydraulic pilot pressure',
                'Direct electrical control of fuel valve',
              ],
              correctAnswer: 1,
              explanation: 'FIVA uses a solenoid to modulate hydraulic pressure, which opens the fuel injection valve.',
            },
          ],
        },
      },
      {
        id: 'lesson-03-03',
        title: 'Injection Process and Timing',
        content: 'The ECU calculates optimal injection timing based on crank angle, engine speed, load, and other parameters. It sends a timed pulse to FIVA solenoid, which triggers hydraulic valve opening and fuel injection. The entire process occurs in milliseconds.',
        components: ['crank-angle-sensor', 'ecu', 'fiva', 'fuel-injection-valve'],
        quiz: {
          id: 'quiz-03-03',
          questions: [
            {
              id: 'q1',
              type: 'scenario',
              question: 'Engine speed increases. How should injection timing adjust?',
              options: [
                'Timing remains constant',
                'Timing advances for higher engine speed',
                'Timing retards for higher engine speed',
              ],
              correctAnswer: 1,
              explanation: 'Injection timing must advance with engine speed to maintain optimal combustion during higher RPM operation.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'module-04',
    title: 'Exhaust Valve Control',
    description: 'Electronic exhaust valve actuation and scavenging control',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'lesson-04-01',
        title: 'Exhaust Valve System Overview',
        content: 'Unlike traditional mechanically-driven exhaust valves, ME-C uses electronic control for exhaust valve timing. This eliminates mechanical limitations and enables optimization for different operating conditions.',
        components: ['exhaust-valve-actuation-system', 'exhaust-valve-actuator'],
        quiz: {
          id: 'quiz-04-01',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What is the main advantage of electronic exhaust valve control?',
              options: [
                'Reduced component count',
                'Independent timing optimization regardless of engine speed',
                'Lower system pressure',
              ],
              correctAnswer: 1,
              explanation: 'Electronic control enables flexible exhaust valve timing independent of mechanical constraints.',
            },
          ],
        },
      },
      {
        id: 'lesson-04-02',
        title: 'Hydraulic Exhaust Valve Actuation',
        content: 'The exhaust valve actuator uses hydraulic pressure controlled by electronic solenoid valves. When the ECU determines optimal exhaust valve opening, it signals the solenoid, which directs control oil pressure to the exhaust valve cylinder.',
        components: ['exhaust-valve-actuator', 'hydraulic-cylinder-unit', 'control-oil-system', 'ecu'],
        quiz: {
          id: 'quiz-04-02',
          questions: [
            {
              id: 'q1',
              type: 'identification',
              question: 'Which component directly opens the exhaust valve?',
              options: ['ECU', 'Solenoid valve', 'Hydraulic cylinder'],
              correctAnswer: 2,
              explanation: 'The hydraulic cylinder provides the actual mechanical force to open the exhaust valve.',
            },
          ],
        },
      },
      {
        id: 'lesson-04-03',
        title: 'Scavenging Optimization',
        content: 'Proper exhaust valve timing ensures efficient scavenging of combustion gases. Electronic control optimizes timing for different loads and speeds, improving engine efficiency and reducing emissions.',
        components: ['exhaust-valve-actuator', 'ecu', 'pressure-sensor'],
        quiz: {
          id: 'quiz-04-03',
          questions: [
            {
              id: 'q1',
              type: 'scenario',
              question: 'What happens if exhaust valve timing is too late?',
              options: [
                'Combustion gases are expelled before compression starts',
                'Combustion gases remain in cylinder, reducing power',
                'Engine operates more efficiently',
              ],
              correctAnswer: 1,
              explanation: 'Late exhaust valve timing means combustion gases occupy space needed for intake air and fuel, reducing power and efficiency.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'module-05',
    title: 'Hydraulic Control System',
    description: 'Hydraulic power supply and actuation systems in ME-C engines',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'lesson-05-01',
        title: 'Hydraulic Power Supply',
        content: 'The hydraulic system provides pressurized oil for all actuators. A dedicated pump maintains specific pressure levels, with pressure regulation ensuring consistent operation. Oil is filtered and cooled to maintain quality.',
        components: ['hydraulic-power-supply', 'hydraulic-oil-system', 'pressure-sensor'],
        quiz: {
          id: 'quiz-05-01',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'Why is oil cooling important in the hydraulic system?',
              options: [
                'To reduce pump power consumption',
                'To maintain oil viscosity and prevent component damage',
                'To reduce engine noise',
              ],
              correctAnswer: 1,
              explanation: 'Cooled oil maintains proper viscosity and prevents thermal degradation of seals and components.',
            },
          ],
        },
      },
      {
        id: 'lesson-05-02',
        title: 'Hydraulic Cylinders',
        content: 'Hydraulic cylinders convert pressure into linear motion. In ME-C engines, cylinders actuate fuel injectors and exhaust valves. The cylinder size and pressure determine the force available for actuation.',
        components: ['hydraulic-cylinder-unit', 'fiva', 'exhaust-valve-actuator'],
        quiz: {
          id: 'quiz-05-02',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What determines the force output of a hydraulic cylinder?',
              options: [
                'Oil viscosity',
                'Piston area and pressure difference',
                'Pump rotation speed',
              ],
              correctAnswer: 1,
              explanation: 'Force = Pressure × Piston Area. Higher pressure and larger piston area produce more force.',
            },
          ],
        },
      },
      {
        id: 'lesson-05-03',
        title: 'Pressure Regulation and Control',
        content: 'The control oil system maintains separate pressure circuits for different functions. Solenoid valves modulate pressure based on ECU commands. Pressure sensors monitor system health and provide feedback for control algorithms.',
        components: ['control-oil-system', 'pressure-sensor', 'ecu'],
        quiz: {
          id: 'quiz-05-03',
          questions: [
            {
              id: 'q1',
              type: 'scenario',
              question: 'If oil pressure suddenly drops, what should the ECU do?',
              options: [
                'Increase fuel injection',
                'Trigger alarm and reduce engine power',
                'Ignore and continue normal operation',
              ],
              correctAnswer: 1,
              explanation: 'Low hydraulic pressure prevents proper actuation, so the system must alert operators and protect the engine.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'module-06',
    title: 'Sensors and Feedback Systems',
    description: 'Engine monitoring through crank angle, pressure, and temperature sensors',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'lesson-06-01',
        title: 'Crank Angle Sensing',
        content: 'The crank angle sensor is fundamental to engine control. It detects crankshaft position and speed, providing the timing reference for all engine control functions. Precise crank angle data enables accurate fuel injection and valve timing.',
        components: ['crank-angle-sensor', 'ecu'],
        quiz: {
          id: 'quiz-06-01',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What information does the crank angle sensor provide?',
              options: [
                'Only engine speed',
                'Only crankshaft position',
                'Both position and speed information',
              ],
              correctAnswer: 2,
              explanation: 'The crank angle sensor pulse rate indicates speed, while pulse timing indicates crankshaft position.',
            },
          ],
        },
      },
      {
        id: 'lesson-06-02',
        title: 'Pressure Monitoring',
        content: 'Multiple pressure sensors monitor hydraulic pressure, fuel pressure, lube oil pressure, and scavenge air pressure. This data enables performance optimization, system diagnostics, and protection against overpressure conditions.',
        components: ['pressure-sensor', 'ecu', 'hydraulic-power-supply'],
        quiz: {
          id: 'quiz-06-02',
          questions: [
            {
              id: 'q1',
              type: 'identification',
              question: 'Which pressure is critical for fuel injection control?',
              options: ['Lube oil pressure', 'Hydraulic control oil pressure', 'Scavenge air pressure'],
              correctAnswer: 1,
              explanation: 'Hydraulic control oil pressure directly actuates fuel injectors and exhaust valves.',
            },
          ],
        },
      },
      {
        id: 'lesson-06-03',
        title: 'Temperature Monitoring and Control',
        content: 'Temperature sensors monitor coolant, oil, and exhaust temperatures. The ECU uses temperature data to optimize cooling, protect against overheating, and adjust engine parameters for thermal efficiency.',
        components: ['temperature-sensor', 'ecu', 'pressure-sensor'],
        quiz: {
          id: 'quiz-06-03',
          questions: [
            {
              id: 'q1',
              type: 'scenario',
              question: 'Engine oil temperature exceeds safe limit. What should the ECU do?',
              options: [
                'Increase engine speed',
                'Activate alarm, increase cooling, reduce load',
                'Continue normal operation',
              ],
              correctAnswer: 1,
              explanation: 'Overheating threatens engine reliability, so the system must cool down and reduce stress immediately.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'module-07',
    title: 'Engine Safety and Monitoring',
    description: 'Protective systems, alarms, and fail-safe concepts in ME-C engines',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'lesson-07-01',
        title: 'Safety System Architecture',
        content: 'ME-C engines integrate comprehensive safety functions in the ECU. The system continuously monitors all sensors against safety limits and automatically initiates protective measures: alarms, power reduction, or shutdown.',
        components: ['engine-safety-monitoring', 'ecu', 'pressure-sensor', 'temperature-sensor'],
        quiz: {
          id: 'quiz-07-01',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What is the highest level of protection in case of critical failure?',
              options: [
                'Alarm only',
                'Power reduction',
                'Automatic engine shutdown',
              ],
              correctAnswer: 2,
              explanation: 'Critical failures like loss of oil pressure trigger automatic shutdown to prevent catastrophic engine damage.',
            },
          ],
        },
      },
      {
        id: 'lesson-07-02',
        title: 'Alarm and Shutdown Logic',
        content: 'Different system faults trigger different protection levels. Minor issues produce alarms for operator awareness. Serious problems reduce engine power. Critical failures trigger automatic shutdown. This tiered approach protects equipment while maintaining operational flexibility.',
        components: ['engine-safety-monitoring', 'ecu', 'pressure-sensor'],
        quiz: {
          id: 'quiz-07-02',
          questions: [
            {
              id: 'q1',
              type: 'scenario',
              question: 'Fuel pressure drops slightly below optimal. What protection triggers?',
              options: [
                'Alarm only',
                'Immediate shutdown',
                'Reduced power',
              ],
              correctAnswer: 0,
              explanation: 'Minor pressure variations trigger alarms so operators can respond, not automatic shutdown.',
            },
          ],
        },
      },
      {
        id: 'lesson-07-03',
        title: 'Redundancy and Fail-Safe Design',
        content: 'Critical systems include redundant sensors and control paths. Sensor failures are detected and the system switches to alternate sensors or safe operating mode. Hydraulic systems have multiple pressure circuits so one failure does not disable all functions.',
        components: ['engine-safety-monitoring', 'pressure-sensor', 'ecu'],
        quiz: {
          id: 'quiz-07-03',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'Why does ME-C have multiple pressure sensors?',
              options: [
                'Redundancy and fault detection capability',
                'To measure different types of pressure',
                'To reduce individual sensor cost',
              ],
              correctAnswer: 0,
              explanation: 'Redundancy ensures engine continues operating even if one sensor fails.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'module-08',
    title: 'Interactive Assessment',
    description: 'Comprehensive knowledge check and understanding verification',
    completed: false,
    progress: 0,
    lessons: [
      {
        id: 'lesson-08-01',
        title: 'Component Identification Challenge',
        content: 'Test your ability to identify ME-C components in the 3D engine viewer. Use the component library and your knowledge from previous modules to correctly identify each highlighted component.',
        components: ['ecs', 'ecu', 'cu', 'fiva', 'exhaust-valve-actuator', 'hydraulic-cylinder-unit'],
        quiz: {
          id: 'quiz-08-01',
          questions: [
            {
              id: 'q1',
              type: 'identification',
              question: 'In the 3D engine lab, what component controls fuel injection timing?',
              options: ['ECU', 'FIVA', 'Fuel pump'],
              correctAnswer: 1,
              explanation: 'FIVA (Fuel Injection Valve Actuator) is the component that receives ECU signals and actuates fuel injectors.',
            },
          ],
        },
      },
      {
        id: 'lesson-08-02',
        title: 'System Flow Understanding',
        content: 'Verify your understanding of how ME-C systems work together. Consider scenarios and explain how each component responds and coordinates with others for optimal engine operation.',
        components: ['ecs', 'ecu', 'crank-angle-sensor', 'fiva', 'exhaust-valve-actuator'],
        quiz: {
          id: 'quiz-08-02',
          questions: [
            {
              id: 'q1',
              type: 'scenario',
              question: 'When engine speed increases from 50 to 100 RPM, how do fuel injection and exhaust valve timing adjust?',
              options: [
                'Both remain constant',
                'Fuel advances, exhaust retards',
                'Both advance to match higher speed timing requirements',
              ],
              correctAnswer: 2,
              explanation: 'Higher engine speed requires both fuel injection and exhaust valve timing to advance to maintain combustion efficiency.',
            },
          ],
        },
      },
      {
        id: 'lesson-08-03',
        title: 'Final Capstone Challenge',
        content: 'Demonstrate comprehensive understanding by explaining how electronic control enables ME-C engines to optimize performance across different operating conditions while maintaining safety and environmental compliance.',
        components: ['ecs', 'ecu', 'cu', 'crank-angle-sensor', 'pressure-sensor', 'temperature-sensor', 'engine-safety-monitoring'],
        quiz: {
          id: 'quiz-08-03',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What is the key innovation that enables ME-C engines to meet environmental regulations?',
              options: [
                'Larger fuel filters',
                'Electronic control enabling real-time optimization of emissions',
                'Modified engine block design',
              ],
              correctAnswer: 1,
              explanation: 'Electronic control systems can continuously adjust parameters to minimize emissions under all operating conditions.',
            },
          ],
        },
      },
    ],
  },
];
