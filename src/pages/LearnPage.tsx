import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Globe,
  HelpCircle,
  Languages,
  PieChart,
  Search,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import {
  GLOSSARY_TERMS,
  LEARN_LESSONS,
  LearnLesson,
  QUIZ_QUESTIONS,
} from '../services/learnData';
import { GlossaryTerm, QuizQuestion } from '../types/crypto';

interface LearnPageProps {
  onNavigate?: (route: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'tutorials' | 'glossary' | 'quiz'>('tutorials');
  const [showHindi, setShowHindi] = useState(false);

  // Lesson Reading Modal
  const [activeLesson, setActiveLesson] = useState<LearnLesson | null>(null);

  // Glossary State
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const [glossaryCategory, setGlossaryCategory] = useState<string>('all');

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const filteredGlossary = GLOSSARY_TERMS.filter((item) => {
    if (glossaryCategory !== 'all' && item.category !== glossaryCategory) return false;
    if (glossaryQuery.trim()) {
      const q = glossaryQuery.toLowerCase();
      return (
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        (item.hindiDefinition && item.hindiDefinition.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSelectQuizOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOption === null || hasSubmittedAnswer) return;
    setHasSubmittedAnswer(true);
    if (selectedOption === QUIZ_QUESTIONS[currentQuizIdx].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmittedAnswer(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Crypto Intelligence Academy</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Beginner to Advanced
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master cryptocurrency fundamentals, indicators, risk management, and financial discipline
          </p>
        </div>

        {/* Language & Tab Toggle Controls */}
        <div className="flex items-center gap-2 self-start">
          {/* Hindi toggle */}
          <button
            onClick={() => setShowHindi(!showHindi)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border cursor-pointer ${
              showHindi
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showHindi ? 'हिंदी सक्रिय (Hindi On)' : 'हिंदी व्याख्या (Show Hindi)'}</span>
          </button>

          {/* Tab selector */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('tutorials')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'tutorials' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('glossary')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'glossary' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Glossary
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'quiz' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Curriculum Lessons */}
      {activeTab === 'tutorials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LEARN_LESSONS.map((lesson) => (
              <Card
                key={lesson.id}
                className="p-5 flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono pb-3 border-b border-slate-800/80">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lesson.level === 'Beginner'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : lesson.level === 'Intermediate'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      }`}
                    >
                      {lesson.level}
                    </span>
                    <span className="text-slate-500">{lesson.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mt-3">
                    {lesson.title}
                  </h3>
                  {showHindi && (
                    <div className="text-xs font-medium text-amber-300/90 mt-1 font-sans">
                      {lesson.hindiTitle}
                    </div>
                  )}

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {showHindi ? lesson.hindiSummary : lesson.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {lesson.sections.length} Core Modules
                  </span>
                  <button
                    onClick={() => setActiveLesson(lesson)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    <span>Read Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Searchable Glossary */}
      {activeTab === 'glossary' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={glossaryQuery}
                onChange={(e) => setGlossaryQuery(e.target.value)}
                placeholder="Search glossary terms (e.g. RSI, Halving)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
              {(['all', 'Fundamentals', 'Trading', 'Technical Analysis', 'Blockchain', 'Security'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGlossaryCategory(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                    glossaryCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Terms' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item) => (
              <Card key={item.id} className="p-4 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-sm font-bold text-white font-mono">{item.term}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">{item.definition}</p>

                {showHindi && item.hindiDefinition && (
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/90 leading-relaxed font-sans">
                    <strong>हिंदी व्याख्या:</strong> {item.hindiDefinition}
                  </div>
                )}

                {item.example && (
                  <div className="text-[11px] text-slate-400 font-mono pt-1">
                    <span className="text-emerald-400">Example:</span> {item.example}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Quiz */}
      {activeTab === 'quiz' && (
        <Card className="max-w-2xl mx-auto p-6 space-y-6">
          {!isQuizCompleted ? (
            <div>
              {/* Question Progress Header */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
                <span>
                  Question {currentQuizIdx + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold text-[10px]">
                  {QUIZ_QUESTIONS[currentQuizIdx].difficulty}
                </span>
              </div>

              {/* Question Body */}
              <div className="my-5">
                <h3 className="text-base font-bold text-white leading-snug">
                  {QUIZ_QUESTIONS[currentQuizIdx].question}
                </h3>
                {showHindi && QUIZ_QUESTIONS[currentQuizIdx].hindiQuestion && (
                  <div className="text-sm font-medium text-amber-300/90 mt-1">
                    {QUIZ_QUESTIONS[currentQuizIdx].hindiQuestion}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {QUIZ_QUESTIONS[currentQuizIdx].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === QUIZ_QUESTIONS[currentQuizIdx].correctIndex;

                  let optionStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                  if (hasSubmittedAnswer) {
                    if (isCorrect) optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300';
                    else if (isSelected) optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-300';
                  } else if (isSelected) {
                    optionStyle = 'bg-emerald-500/10 border-emerald-500 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={hasSubmittedAnswer}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                    >
                      <div className="space-y-0.5">
                        <div>{opt}</div>
                        {showHindi && QUIZ_QUESTIONS[currentQuizIdx].hindiOptions?.[idx] && (
                          <div className="text-[11px] text-amber-300/80 font-normal">
                            {QUIZ_QUESTIONS[currentQuizIdx].hindiOptions![idx]}
                          </div>
                        )}
                      </div>

                      {hasSubmittedAnswer && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {hasSubmittedAnswer && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submitting */}
              {hasSubmittedAnswer && (
                <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs animate-slide-in">
                  <div className="font-bold text-emerald-400">Explanation:</div>
                  <p className="text-slate-300 leading-relaxed">
                    {showHindi && QUIZ_QUESTIONS[currentQuizIdx].hindiExplanation
                      ? QUIZ_QUESTIONS[currentQuizIdx].hindiExplanation
                      : QUIZ_QUESTIONS[currentQuizIdx].explanation}
                  </p>
                </div>
              )}

              {/* Submit or Next Button */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  Current Score: {score} / {currentQuizIdx + (hasSubmittedAnswer ? 1 : 0)}
                </span>

                {!hasSubmittedAnswer ? (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={selectedOption === null}
                    onClick={handleSubmitQuizAnswer}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={handleNextQuizQuestion}>
                    {currentQuizIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Quiz'}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  You scored <strong className="text-emerald-400 text-sm font-mono">{score}</strong> out of{' '}
                  <strong className="text-white text-sm font-mono">{QUIZ_QUESTIONS.length}</strong> questions correct (
                  {Math.round((score / QUIZ_QUESTIONS.length) * 100)}%).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto text-xs text-slate-300">
                {score >= 4
                  ? 'Outstanding knowledge! You demonstrate a strong grasp of cryptocurrency mechanics and disciplined risk principles.'
                  : 'Good foundation! Review the curriculum modules to deepen your understanding of technical indicators and volatility.'}
              </div>

              <Button variant="primary" onClick={handleRestartQuiz}>
                Retake Quiz
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Lesson Reader Modal */}
      <Modal
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        title={activeLesson ? activeLesson.title : ''}
        subtitle={activeLesson ? `${activeLesson.level} · ${activeLesson.duration}` : ''}
        maxWidth="3xl"
      >
        {activeLesson && (
          <div className="space-y-6 text-xs text-slate-300">
            {showHindi && activeLesson.hindiTitle && (
              <div className="text-sm font-bold text-amber-300 font-sans">
                {activeLesson.hindiTitle}
              </div>
            )}

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed">
              {showHindi ? activeLesson.hindiSummary : activeLesson.summary}
            </div>

            <div className="space-y-5">
              {activeLesson.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-sm font-bold text-white">
                    {showHindi && sec.hindiHeading ? sec.hindiHeading : sec.heading}
                  </h4>
                  <p className="leading-relaxed text-slate-300">
                    {showHindi && sec.hindiBody ? sec.hindiBody : sec.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setActiveLesson(null)}>
                Finished Reading
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
