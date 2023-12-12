import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import QuizForm from './QuizForm';
import Question from './Question'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
        </QueryClientProvider>
    )
}

function AppContent() {
    const [startQuiz, setStartQuiz] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [score, setScore] = useState(0);
    const [checkScore, setCheckScore] = useState(false);

    const quizElements = questions.map(question => {
        return (
            <Question key={question.id} question={question} checkScore={checkScore} selectAnswer={selectAnswer} />
        )
    });

    useEffect(() => {
        questions.length > 0 && setAnsweredCount(questions.reduce((acc, question) => {
            question.answers.forEach(answer => {
                if(answer.selected) {
                    acc++;
                }
            })
            return acc
        }, 0))
    }, [questions])

    function selectAnswer(id, answer) {
        setQuestions(prevQuestions => {
            const newQuestions = prevQuestions.map(question => {
                if(question.id === id) {
                    return {
                        ...question,
                        answers: question.answers.map(ans => {
                            if(ans.answer === answer) {
                                return {
                                    ...ans,
                                    selected: true
                                }
                            } else {
                                return {
                                    ...ans,
                                    selected: false
                                }
                            }
                        })
                    }
                } else {
                    return question
                }
            })
            return newQuestions
        })
    }

    function startQuizHandler(questions) {
        setStartQuiz(true);
        setQuestions(questions);
    }

    function findScore() {
        setCheckScore(true);
        setScore(questions.reduce((acc, question) => {
            question.answers.forEach(answer => {
                if(answer.selected && answer.correct) {
                    acc++;
                }
            })
            return acc
        }, 0)) 
    }

    function playAgain() {
        setStartQuiz(false);
        setCheckScore(false);
    }

    return (
        <main>
            { !startQuiz 
                ?
                <div className='landing-page'>
                    <div className='landing-container'>
                        <h1 className='title'>Quizzical</h1>
                        <QuizForm startQuizHandler={startQuizHandler} />
                    </div>
                </div>
                :
                <div className='quiz-page'>
                    <div className='quiz-content'>
                        {quizElements}
                    </div>
                    <div className='quiz-buttons'>
                        {
                            !checkScore && <div className='score-container'>
                                <p className='score-text'>You have answered {answeredCount} out of {questions.length} questions</p>
                                <button type='button' className='check-btn' alt='Check answers button' onClick={() => findScore()}>Check answers</button>
                            </div>
                        }
                        {
                            checkScore && <div className='score-container'>
                                <p className='score-text'> You scored {score} out of {questions.length} in the quiz</p>
                                <button type='button' className='play-again-btn' alt='Play again button' onClick={() => playAgain()}>Play again</button>
                            </div>
                        }
                    </div>
                </div>
            }
        </main>
    )
}

export default App
