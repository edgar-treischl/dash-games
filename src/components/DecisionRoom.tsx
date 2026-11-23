import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import { cases } from "../data/cases";
import { useGameStore } from "../store/gameStore";

export function DecisionRoom() {
  const selectedCaseId = useGameStore((state) => state.selectedCaseId);
  const progress = useGameStore((state) =>
    selectedCaseId ? state.progressByCase[selectedCaseId] : undefined
  );
  const returnToHeadquarters = useGameStore((state) => state.returnToHeadquarters);
  const goHome = useGameStore((state) => state.goHome);
  const recordDecisionAnswer = useGameStore((state) => state.recordDecisionAnswer);
  const resetDecisionAnswers = useGameStore((state) => state.resetDecisionAnswers);
  const gameCase = cases.find((item) => item.id === selectedCaseId);
  const questions = gameCase?.decisionQuestions ?? [];
  const answers = progress?.decisionAnswers ?? {};
  const firstUnanswered = questions.findIndex((question) => !answers[question.id]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    firstUnanswered === -1 ? 0 : firstUnanswered
  );
  const [showResults, setShowResults] = useState(
    questions.length > 0 && firstUnanswered === -1
  );
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);

  if (!gameCase || !selectedCaseId || !progress || questions.length === 0) {
    return (
      <main className="headquarters">
        <button className="back-button" onClick={selectedCaseId ? returnToHeadquarters : goHome}>
          <ArrowLeft size={16} /> {selectedCaseId ? "BACK TO HEADQUARTERS" : "BACK TO CASE FILES"}
        </button>
        <p>No decision questions found for this case.</p>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = pendingAnswer ?? answers[currentQuestion.id]?.answer ?? "";
  const correctCount = questions.filter((question) => answers[question.id]?.isCorrect).length;

  const handleSubmit = () => {
    const option = currentQuestion.options.find((item) => item.value === selectedAnswer);
    if (!option) return;

    recordDecisionAnswer(currentQuestion.id, option.value, !!option.isCorrect);
    setPendingAnswer(null);
    const nextUnanswered = questions.findIndex(
      (question) => question.id !== currentQuestion.id && !answers[question.id]
    );
    if (nextUnanswered === -1) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(nextUnanswered);
    }
  };

  const retryQuiz = () => {
    resetDecisionAnswers();
    setCurrentQuestionIndex(0);
    setPendingAnswer(null);
    setShowResults(false);
  };

  return (
    <motion.main
      className="headquarters decision-room"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <button className="back-button" onClick={returnToHeadquarters}>
        <ArrowLeft size={16} /> BACK TO HEADQUARTERS
      </button>

      <header className="evidence-heading">
        <span className="eyebrow">CASE #{gameCase.number} / DECISION QUESTIONS</span>
        <h1>Investigation decisions</h1>
        <p>Answer critical questions about your investigation.</p>
      </header>

      <section className="decision-panel" aria-label="Decision questions">
        {showResults ? (
          <div className="decision-feedback-container">
            <h2>Quiz results</h2>
            <p className="decision-score" aria-live="polite">
              <span className="decision-score-label">Correct answers</span>
              <span className="decision-score-value">{correctCount} / {questions.length}</span>
            </p>
            {questions.map((question, index) => {
              const answer = answers[question.id];
              const selected = question.options.find((option) => option.value === answer?.answer);
              const correctOptions = question.options.filter((option) => option.isCorrect);
              return (
                <article key={question.id} className={`decision-result ${answer?.isCorrect ? "correct" : "incorrect"}`}>
                  <div className="decision-result-content">
                    <h3>{index + 1}. {question.question}</h3>
                    <p><strong>Your answer:</strong> {selected?.label ?? "No answer"}</p>
                    <p><strong>{answer?.isCorrect ? "Correct" : "Not quite"}</strong></p>
                    <p>{answer?.isCorrect ? question.correctMessage : question.incorrectMessage}</p>
                    {answer?.isCorrect && question.feedback && <p>{question.feedback}</p>}
                    {!answer?.isCorrect && question.hint && <p><strong>Hint:</strong> {question.hint}</p>}
                    {!answer?.isCorrect && (
                      <details className="decision-answer-reveal">
                        <summary>Show answer</summary>
                        <p>{correctOptions.map((option) => option.label).join(", ")}</p>
                        {question.feedback && <p>{question.feedback}</p>}
                      </details>
                    )}
                  </div>
                </article>
              );
            })}
            <div className="decision-actions">
              {correctCount < questions.length && (
                <button className="decision-button decision-button--secondary" onClick={retryQuiz}>
                  Retry quiz
                </button>
              )}
              <button className="decision-button decision-button--primary" onClick={returnToHeadquarters}>
                Back to Headquarters
              </button>
            </div>
          </div>
        ) : (
          <div className="decision-question-container">
            <p className="decision-progress-counter">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <fieldset className="decision-options">
              <legend className="decision-question">{currentQuestion.question}</legend>
              {currentQuestion.options.map((option) => (
                <label key={option.value} className={`decision-option ${selectedAnswer === option.value ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    checked={selectedAnswer === option.value}
                    onChange={() => setPendingAnswer(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
            <div className="decision-actions">
              <button className="decision-button decision-button--primary" onClick={handleSubmit} disabled={!selectedAnswer}>
                {currentQuestionIndex === questions.length - 1 ? "See results" : "Next question"}
              </button>
            </div>
          </div>
        )}
      </section>
    </motion.main>
  );
}
