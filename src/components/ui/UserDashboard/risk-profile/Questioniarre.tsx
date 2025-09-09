"use client"
import React, { useState } from 'react';

interface QuestionnaireProps {
  onClose?: () => void;
  onSubmit?: (answers: Record<number, string>) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is your primary goal of investing crypto?",
    options: [
      "Preserve capital",
      "Grow my portfolio steadily over time",
      "Maximize returns, even if it means taking big risks"
    ]
  },
  {
    id: 2,
    question: "What level of loss are you comfortable seeing in a single month?",
    options: [
      "Less than 5%",
      "5-15%",
      "More than 15%"
    ]
  },
  {
    id: 3,
    question: "How long do you plan to stay invested?",
    options: [
      "Less than 1 year",
      "1-3 years",
      "More than 3 years"
    ]
  },
  {
    id: 4,
    question: "How would you react if your crypto portfolio dropped by 20% in a week?",
    options: [
      "Sell immediately to prevent further losses",
      "Stay calm and wait it out",
      "Buy more while prices are low"
    ]
  },
  {
    id: 5,
    question: "How familiar are you with the crypto market?",
    options: [
      "I'm a beginner just getting started",
      "I understand the basics and follow trends",
      "I actively trade and analyze market data"
    ]
  },
  {
    id: 6,
    question: "What portion of your total wealth will be invested through Omora?",
    options: [
      "Less than 10%",
      "10-30%",
      "More than 30%"
    ]
  },
  {
    id: 7,
    question: "How often do you want to check or adjust your investments?",
    options: [
      "Rarely — I prefer 'set it and forget it'",
      "Occasionally when there's news",
      "Actively — I monitor the market closely"
    ]
  },
  {
    id: 8,
    question: "Which statement best describes your attitude toward volatility?",
    options: [
      "I want to avoid it",
      "I can handle some ups and downs",
      "I embrace it if it means higher potential returns"
    ]
  }
];

function Questionnaire({ onClose, onSubmit }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleOptionSelect = (questionId: number, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(answers);
    }
  };

  const completedQuestions = Object.keys(answers).length;
  const canSubmit = completedQuestions === questions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(10, 13, 18, 0.7)' }}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-8 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Risk Profile Questionnaire
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-8 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            You have finished <span className="text-cyan-600 font-medium">{completedQuestions}/8</span> questions.
          </p>
        </div>

        {/* Scrollable Questions */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-8">
            {questions.map((questionData) => (
              <div key={questionData.id} className="pb-6 border-b border-gray-100 last:border-b-0">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  {questionData.id}. {questionData.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {questionData.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${questionData.id}`}
                          value={option}
                          checked={answers[questionData.id] === option}
                          onChange={() => handleOptionSelect(questionData.id, option)}
                          className="sr-only"
                        />
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
                          ${answers[questionData.id] === option 
                            ? 'border-cyan-600 bg-cyan-600' 
                            : 'border-gray-300'
                          }
                        `}>
                          {answers[questionData.id] === option && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Submit Button */}
        <div className="p-8 pt-4 border-t border-gray-100">
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`
                px-8 py-3 rounded-lg font-semibold transition-colors
                ${canSubmit
                  ? 'text-white hover:opacity-90'
                  : 'text-gray-400 cursor-not-allowed'
                }
              `}
              style={{ 
                backgroundColor: canSubmit ? '#008B99' : '#e5e7eb'
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;