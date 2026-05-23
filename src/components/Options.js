export default function Options({question ,dispatch, answer}){
    //  console.log(question)
    const hasAnswered = answer !== null;
    return (
        <div className="options">
            {question?.options?.map((option,i)=>

            <button className={`btn btn-option 
                ${ i === answer ? 'answer' : ''}
                ${answer === question.correctOption ? 'correct' : 'wrong'}
                `} 
            key = {option}
            disabled = {hasAnswered}
            onClick = { () => dispatch({type: 'newAnswer', payload:i})}
            >{option}</button>)}
        </div>
    )

}