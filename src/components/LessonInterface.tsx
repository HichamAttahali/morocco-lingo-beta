import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Volume2, RefreshCw } from 'lucide-react';
import { Language, UserData, Question } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { playSound } from '../utils/storage';

interface LessonInterfaceProps {
  language: Language;
  level: number;
  userData: UserData;
  onComplete: (xpGained: number, isCorrect: boolean) => void;
  onBack: () => void;
}

const LessonInterface: React.FC<LessonInterfaceProps> = ({
  language,
  level,
  userData,
  onComplete,
  onBack
}) => {
  const { darkMode } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(userData.hearts);
  const [xpGained, setXpGained] = useState(0);

  // Questions par niveau et langue
  const getQuestions = (): Question[] => {
    const questionSets: Record<string, Record<number, Question[]>> = {
      'en': {
        0: [
          {
            id: '1',
            question: 'Comment dit-on "Bonjour" en anglais ?',
            options: ['Hello', 'Goodbye', 'Thanks', 'Sorry'],
            correctAnswer: 'Hello',
            type: 'multiple-choice'
          },
          {
            id: '2',
            question: 'Que signifie "Thank you" ?',
            options: ['Au revoir', 'Merci', 'Excusez-moi', 'Bonjour'],
            correctAnswer: 'Merci',
            type: 'multiple-choice'
          },
          {
            id: '3',
            question: 'Comment dit-on "Au revoir" en anglais ?',
            options: ['Hello', 'Please', 'Goodbye', 'Welcome'],
            correctAnswer: 'Goodbye',
            type: 'multiple-choice'
          }
        ],
        1: [
          {
            id: '4',
            question: 'Comment dit-on "Famille" en anglais ?',
            options: ['Family', 'Friends', 'House', 'School'],
            correctAnswer: 'Family',
            type: 'multiple-choice'
          },
          {
            id: '5',
            question: 'Que signifie "Mother" ?',
            options: ['Père', 'Mère', 'Frère', 'Sœur'],
            correctAnswer: 'Mère',
            type: 'multiple-choice'
          }
        ]
      },
      'es': {
        0: [
          {
            id: '1',
            question: 'Comment dit-on "Bonjour" en espagnol ?',
            options: ['Hola', 'Adiós', 'Gracias', 'Perdón'],
            correctAnswer: 'Hola',
            type: 'multiple-choice'
          },
          {
            id: '2',
            question: 'Que signifie "Gracias" ?',
            options: ['Au revoir', 'Merci', 'Bonjour', 'Pardon'],
            correctAnswer: 'Merci',
            type: 'multiple-choice'
          }
        ]
      },
      'fr': {
        0: [
          {
            id: '1',
            question: 'Comment dit-on "Hello" en français ?',
            options: ['Bonjour', 'Au revoir', 'Merci', 'Pardon'],
            correctAnswer: 'Bonjour',
            type: 'multiple-choice'
          }
        ]
      }
    };

    return questionSets[language.code]?.[level] || [];
  };

  const questions = getQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      playSound('correct');
      setXpGained(prev => prev + 10);
    } else {
      playSound('incorrect');
      setHearts(prev => Math.max(0, prev - 1));
    }

    onComplete(correct ? 10 : 0, correct);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Leçon terminée
      onBack();
    }
  };

  const handlePlayAudio = () => {
    // Simulation audio pour la démo
    playSound('click');
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Niveau en cours de développement</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Ce niveau sera bientôt disponible !
        </p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Retour aux niveaux
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 text-gray-600'
          } transition-colors`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-semibold">{hearts}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold">{xpGained} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </span>
          <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className={`rounded-2xl p-8 mb-8 shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
          <button
            onClick={handlePlayAudio}
            className={`p-3 rounded-full ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = `w-full p-4 text-left rounded-xl border-2 transition-all duration-200 font-medium ${
              darkMode 
                ? 'border-gray-600 hover:border-gray-500' 
                : 'border-gray-200 hover:border-gray-300'
            }`;

            if (showFeedback) {
              if (option === currentQuestion.correctAnswer) {
                buttonClass += ' border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
              } else if (option === selectedAnswer && !isCorrect) {
                buttonClass += ' border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
              }
            } else if (selectedAnswer === option) {
              buttonClass += ' border-blue-500 bg-blue-50 dark:bg-blue-900/20';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showFeedback && option === currentQuestion.correctAnswer && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                  {showFeedback && option === selectedAnswer && !isCorrect && (
                    <span className="text-red-500 text-xl">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg ${
            isCorrect 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-semibold ${
                  isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {isCorrect ? '🎉 Correct !' : '❌ Incorrect'}
                </p>
                {!isCorrect && (
                  <p className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    La bonne réponse était : <strong>{currentQuestion.correctAnswer}</strong>
                  </p>
                )}
              </div>
              
              <button
                onClick={handleNext}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  isCorrect
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Suivant' : 'Terminer'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hearts Warning */}
      {hearts <= 2 && hearts > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
          <p className="text-red-700 dark:text-red-300 font-semibold">
            ⚠️ Attention ! Il vous reste {hearts} vie{hearts > 1 ? 's' : ''}
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            Répondez correctement pour continuer !
          </p>
        </div>
      )}

      {/* Game Over */}
      {hearts === 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full mx-4 text-center ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold mb-4">Plus de vies !</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Vos vies se régénèrent avec le temps ou vous pouvez continuer demain.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setHearts(5);
                  setCurrentQuestionIndex(0);
                  setShowFeedback(false);
                  setSelectedAnswer(null);
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5 inline mr-2" />
                Recommencer la leçon
              </button>
              <button
                onClick={onBack}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Retour aux niveaux
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonInterface;