import React from 'react'
import { Lightbulb, BookOpen, Bot, UserCheck } from 'lucide-react'

const steps = [
  {
    icon: <Lightbulb className="w-8 h-8 text-green-600" />,
    title: 'Ask a Question',
    description: 'Type in your topic or question in the dashboard input field.',
  },
  {
    icon: <Bot className="w-8 h-8 text-green-600" />,
    title: 'AI Explains',
    description: 'Our intelligent tutor gives a clear, in-depth explanation.',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-green-600" />,
    title: 'Interactive Learning',
    description: 'Receive related quizzes and examples for better understanding.',
  },
  {
    icon: <UserCheck className="w-8 h-8 text-green-600" />,
    title: 'Track Your Progress',
    description: 'Save questions, review answers, and monitor learning journey.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold  dark:text-white mb-4">How It Works</h2>
        <p className=" dark:text-gray-300 mb-12">Simple steps to help you learn smarter with AI</p>

        <div className="relative flex flex-col md:flex-row md:justify-between items-start max-lg:items-center md:items-stretch gap-12 md:gap-0">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center px-4 md:w-1/4">
              <div className="bg-green-100 dark:bg-green-800 p-4 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-green-500 dark:text-white mb-2">{step.title}</h3>
              <p className=" dark:text-gray-300">{step.description}</p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 right-[-50%] w-full h-1 bg-green-300 dark:bg-green-700 z-[-1]"></div>
              )}
              {/* Vertical line for mobile */}
              {index < steps.length - 1 && (
                <div className="md:hidden w-1 h-12 bg-green-300 dark:bg-green-700 my-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
