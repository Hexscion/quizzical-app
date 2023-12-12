import { decode } from "html-entities";

function Question(props) {
    const answerElements = props.question.answers.map((answer, index) => {
        const quizStyles = {
            backgroundColor: answer.selected ? '#D6DBF5' : '#F5F7FB',
            border: answer.selected ? '1px solid #F5F7FB' : '1px solid #4D5B9E',
        }
        const scoreStyles = {
            backgroundColor: answer.correct ? '#94D7A2' : answer.selected ? '#F8BCBC' : '#F5F7FB',
            border: answer.correct ? '1px solid #94D7A2' : answer.selected ? '1px solid #F8BCBC' : '1px solid #4D5B9E',
            opacity: answer.correct ? 1 : 0.5
        }
        const styles = props.checkScore ? scoreStyles : quizStyles
        return (
            <p key={index} className="answer" style={styles} onClick={() => !props.checkScore && props.selectAnswer(props.question.id, answer.answer)}>
                {decode(answer.answer)}
            </p>
        )
    })
    
    return (
        <div className="question-container">
            <p className="question">{decode(props.question.question)}</p>
            <div className="answers">{answerElements}</div>
        </div>
    )
}

export default Question