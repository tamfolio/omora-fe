"use client";
import React, { useState, useEffect } from "react";
import riskProfileApiService, {
  RiskProfileQuestion,
} from "@/lib/risk-profile-api-service";

interface QuestionnaireProps {
  onClose?: () => void;
  onSubmit?: (selectedAnswerIds: Record<number, number>) => void; // questionId -> answerId
}

function Questionnaire({ onClose, onSubmit }: QuestionnaireProps) {
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<
    Record<number, number>
  >({});
  const [questions, setQuestions] = useState<RiskProfileQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await riskProfileApiService.getRiskProfileQuestions();

      if (response.data && Array.isArray(response.data)) {
        setQuestions(response.data);
      } else {
        throw new Error("Invalid questions format from API");
      }
    } catch (err: any) {
      console.error("❌ Failed to load questions:", err);
      setError(err.message || "Failed to load questions");
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswerIds((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedAnswerIds);
    }
  };

  const completedQuestions = Object.keys(selectedAnswerIds).length;
  const canSubmit =
    completedQuestions === questions.length && questions.length > 0;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(10, 13, 18, 0.7)" }}
          onClick={onClose}
        />

        <div className="relative bg-white rounded-2xl p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Failed to Load Questions
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchQuestions}
                className="w-full py-3 px-6 text-white font-semibold rounded-lg"
                style={{ backgroundColor: "#008B99" }}
              >
                Retry
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 px-6 text-gray-600 font-semibold rounded-lg border border-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(10, 13, 18, 0.7)" }}
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-8 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Risk Profile Questionnaire
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-8 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            You have finished{" "}
            <span className="text-cyan-600 font-medium">
              {completedQuestions}/{questions.length}
            </span>{" "}
            questions.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-8">
            {questions.map((question, qIndex) => (
              <div
                key={question.id}
                className="pb-6 border-b border-gray-100 last:border-b-0"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  {qIndex + 1}. {question.body}
                </h3>

                <div className="space-y-3">
                  {question.answers.map((answer) => (
                    <label
                      key={answer.id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={answer.id}
                          checked={selectedAnswerIds[question.id] === answer.id}
                          onChange={() =>
                            handleAnswerSelect(question.id, answer.id)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0
                          ${
                            selectedAnswerIds[question.id] === answer.id
                              ? "border-cyan-600 bg-cyan-600"
                              : "border-gray-300"
                          }
                        `}
                        >
                          {selectedAnswerIds[question.id] === answer.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-700">{answer.body}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 pt-4 border-t border-gray-100">
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`
                px-8 py-3 rounded-lg font-semibold transition-colors
                ${
                  canSubmit
                    ? "text-white hover:opacity-90"
                    : "text-gray-400 cursor-not-allowed"
                }
              `}
              style={{
                backgroundColor: canSubmit ? "#008B99" : "#e5e7eb",
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
