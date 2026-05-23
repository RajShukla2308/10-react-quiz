import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error'
import StartScreen from './StartScreen';



const initialState = {
  questions : [],

  // quizStatus : loading, ready, active, finished, error
  status: 'loading'
}

function reducer(state, action){
  switch(action.type){
    case 'dataReceived': 
      return {
        ...state, questions: action.payload, status: 'ready'
      }

    case 'dataFailed':
      return {...state, status: 'failed'}
    
    default: 
      throw new Error('Unknown action');
  }
}


export default function App(){

  // const [state, dispatch] = useReducer(reducer, initialState)

  // destructuring state
  const [{questions, status}, dispatch] = useReducer(reducer, initialState)


  const numQuestions = questions.length;


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

      {status === 'ready' && <StartScreen numQuestions={numQuestions}/>}
    </Main>
  </div>

}