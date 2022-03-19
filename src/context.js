import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'



const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [error, setError] = useState(false)
  const [quiz, setQuiz] = useState({

    amount: 10,
    category: 'politics',
    difficulty: 'easy'
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchQuestions = async (url) => {
    setLoading(true)
    setWaiting(false)
    const response = await axios(url).catch((err) => console.log(err))
    if (response) {
      const data = response.data.results;
      console.log('data in context: ', data.length)
      if (data.length > 0) {
        setQuestions(data)
        setLoading(false)
        setWaiting(false)
        setError(false)
      } else {
        setWaiting(true)
        setError(true)
      }
    } else {
      setWaiting(true)
    }
  }

  
  
  const nextQuestion = () =>{

    console.log('in nextquestion index: ', index)
    if(index === 9)
    {
      setIsModalOpen(true);
    }
    else{
      setIndex(prevState=>prevState+1)
       setIsModalOpen(false)

    }
  }

  const checkAnswer = (answer, correct_answer)=>{

    //console.log('answer in checkanswer: ', answer)
    if(answer===correct_answer)
    {
      if(correct<10){
      setCorrect(prevState=>prevState+1)}
    }
    nextQuestion();
  }


  const handleChange = (e)=>{
    
    setQuiz({...quiz, [e.target.name] : e.target.value})
  }

  const handleSubmit = (e) =>{

    e.preventDefault();
    const {amount, category, difficulty} = quiz
    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;
    fetchQuestions(url);
  }

  const closeModal = ()=>{
    setIsModalOpen(false)
    setWaiting(true)
    setIndex(0)
    setCorrect(0)
  }
  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        nextQuestion,
       checkAnswer,
       quiz,
       handleChange,
       handleSubmit,
       isModalOpen,
       closeModal
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
