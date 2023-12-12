import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function QuizForm(props) {
    const [quizForm, setQuizForm] = useState({});
    const [fetchQuestions, setFetchQuestions] = useState(false);
    const [questions, setQuestions] = useState([]);
    

    const categoryData = useQuery({
        queryKey: ['categories'],
        queryFn: () => {
            return axios.get('https://opentdb.com/api_category.php')
                .then(res => res.data)
        }
    })

    const { isFetching, isError, data, error } = useQuery({
        queryKey: ['questions'],
        queryFn: () => {
            return axios.get(`https://opentdb.com/api.php?amount=${quizForm.numberOfQuestions}&category=${quizForm.category}&difficulty=${quizForm.difficulty}`)
                .then(res => res.data)
        },
        enabled: fetchQuestions
    })

    const categoryElements = categoryData.data?.trivia_categories.map((category) => {
        return (
            <option key={category.id} value={category.id}>{category.name}</option>
        )
    })

    useEffect(() => {
        if(data?.results.length>0 && fetchQuestions) {
            const questions = data.results.map((question, index) => {
            let shuffledAnswers = question.incorrect_answers.concat(question.correct_answer)
            for(let i = 0; i < shuffledAnswers.length; i++) {
                const randomIndex = Math.floor(Math.random() * shuffledAnswers.length);
                [shuffledAnswers[i], shuffledAnswers[randomIndex]] = [shuffledAnswers[randomIndex], shuffledAnswers[i]];
            }
            const answers = shuffledAnswers.map((answer) => {
                const correct = answer === question.correct_answer;
                return { answer: answer, selected: false, correct: correct }
            })
            return {
                id: index,
                question: question.question,
                answers: answers
            }})
            setQuestions(questions);
        }
    }, [data]);

    useEffect(() => {
        questions.length>0 && props.startQuizHandler(questions);
    }, [questions])

    if (categoryData.isLoading || isFetching) {
        return <span className="message">Loading...</span>
    }
    
    if (categoryData.isError || isError) {
        return <span className="message">Error: {categoryData.isError ? categoryData.error.message : error.message}</span>
    }

    return (
            <Formik
                initialValues={{
                    numberOfQuestions: '5',
                    category: '9',
                    difficulty: 'easy',
                }}
                onSubmit={values => {
                    setFetchQuestions(true);
                    setQuizForm(values);
                }}
            >
                <Form className="quiz-form">
                    <div>
                        <label htmlFor="numberOfQuestions">Number of questions -</label>
                        <Field name="numberOfQuestions" as="select" className="my-select">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                        </Field>
                    </div>
                    <div>
                        <label htmlFor="difficulty">Difficulty -</label>
                        <Field name="difficulty" as="select" className="my-select">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </Field>
                    </div>
                    <div>
                        <label htmlFor="category">Category -</label>
                        <Field name="category" as="select" className="my-select">
                            {categoryElements}
                        </Field>
                    </div>
                    <button type='submit' className='start-btn' alt='Start quiz button'>Start quiz</button>
                </Form>
            </Formik>
            )
}

export default QuizForm
