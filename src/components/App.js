import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error'
import StartScreen from '../StartScreen';
import Question from '../Question';
import NextButton from './NextButton';
import Progress from './Progress'
import { FinishScreen } from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';


const SECS_PER_QUESTION = 30;
const initialState = {
  questions : [],

  // quizStatus : loading, ready, active, finished, error
  status: 'loading',
  // index for showing i-th question 
  index: 0,
  // index for getting the answer
  answer: null,
  // points to update on a correct answer
  points: 0,
  // for storing highscore
  highScore: 0,
  // Timer state for sec remaining
  secondsRemaining : null
}

function reducer(state, action){
  switch(action.type){
    case 'dataReceived': 
      return {
        ...state, questions: action.payload, status: 'ready'
      }

    case 'dataFailed':
      return {...state, status: 'failed'}

    case 'startQuiz':
      return {...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION}

    case 'newAnswer':
      // getting current question for setting points
      const question = state.questions.at(state.index);

      return {...state, 
        answer: action.payload, 
        points: action.payload === question.correctOption
         ? state.points + question.points 
         : state.points}

    case 'nextQuestion':
      return {...state, index: state.index + 1, answer: null}

    case 'finish':
      return {...state, status: 'finished', highScore: 
        state.points > state.highScore ? state.points : state.highScore}

    case 'restart': 
        return {...state, status: 'active', index: 0, score: 0, answer: null, points: 0, secondsRemaining: 10}

    case 'tick':
        return {...state, secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining === 0 ? 'finished' : state.status
        }

    
    default: 
      throw new Error('Unknown action');
  }
}


export default function App(){

  // const [state, dispatch] = useReducer(reducer, initialState)

  // destructuring state
  const [{questions, status, index, answer, points, highScore,
    secondsRemaining
  }, dispatch] = useReducer(reducer, initialState)


  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev,curr)=>prev + curr.points,0)


  useEffect(function (){
    fetch('http://localhost:8000/questions').then(res=>res.json()).then(data=>{
      // console.log(data);
      dispatch({type:'dataReceived', payload: data})
    }).catch(err=>dispatch({type:'dataFailed'}))
  },[])

  return <div className='app'>
    <Header />

    <Main>
      {/* <p>1/15</p>
      <p>Quesiton?</p> */}

      {status === 'loading' && <Loader />}

      {status === 'error' && <Error />}

      {status === 'ready' && <StartScreen dispatch={dispatch} numQuestions={numQuestions}/>}

      {status === 'active' && 
      <>  
        <Progress index={index} 
        numQuestions={numQuestions}
        points={points}
        maxPossiblePoints={maxPossiblePoints}
        answer={answer}
        />

        <Question question={questions[index]}
        dispatch={dispatch}
        answer={answer} />

        <Footer>
          <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
          <NextButton dispatch={dispatch} 
            answer={answer}
            numQuestions={numQuestions}
            index={index} />
        </Footer>
      </>
      }

      {status === 'finished' && <FinishScreen points={points} 
      maxPossiblePoints={maxPossiblePoints} 
      highScore={highScore}
      dispatch={dispatch}
      />} 
    </Main>
  </div>

}