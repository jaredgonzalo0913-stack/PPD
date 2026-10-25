import { useState } from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onComplete?: (score: number) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswerSelect = (answer: string | number) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalScore = isCorrect ? score + 1 : score;
      setCompleted(true);
      onComplete?.(Math.round((finalScore / questions.length) * 100));
    }
  };

  if (completed) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-4">
        <div className="card text-center py-8">
          <div className="text-5xl font-bold glow-text mb-4">{finalScore}%</div>
          <p className="text-light-gray mb-6">Quiz Complete!</p>
          {finalScore >= 80 ? (
            <p className="text-cyan text-lg">Excellent work! You've mastered this content.</p>
          ) : finalScore >= 60 ? (
            <p className="text-cyan text-lg">Good effort! Review the content for areas to improve.</p>
          ) : (
            <p className="text-cyan text-lg">Keep learning! Try again after reviewing the material.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-light-gray">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: questions.length }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < currentQuestionIndex ? 'bg-cyan' : i === currentQuestionIndex ? 'bg-cyan/60' : 'bg-cyan/20'
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-cyan mb-4">{currentQuestion.question}</h3>

        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                disabled={showResult}
                className={`w-full p-3 rounded-lg text-left font-semibold transition-all ${
                  selectedAnswer === idx
                    ? showResult
                      ? isCorrect
                        ? 'bg-green-500/30 border-green-400 border-2'
                        : 'bg-red-500/30 border-red-400 border-2'
                      : 'bg-cyan/30 border-cyan border-2'
                    : showResult && idx === currentQuestion.correctAnswer
                    ? 'bg-green-500/30 border-green-400 border-2'
                    : 'bg-steel-gray hover:bg-steel-gray/80 border border-cyan/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0">
                    {showResult && idx === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {showResult && selectedAnswer === idx && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showResult && (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-400/50' : 'bg-red-500/20 border border-red-400/50'}`}>
          <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-light-gray">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`button-primary ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext} className="button-primary">
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
