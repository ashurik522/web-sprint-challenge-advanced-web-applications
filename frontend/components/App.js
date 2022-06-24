import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App(props) {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {navigate("/")}
  const redirectToArticles = () => {navigate("/articles") }

  const logout = () => {
    if (localStorage.getItem('token')){
      localStorage.removeItem('token')
      setMessage("Goodbye!")
      redirectToLogin()
    } else {
      redirectToLogin()
    }
  }
 
  const login = ({ username, password }) => {
    
    axios.post(loginUrl, {username, password})
      .then(res => {
        localStorage.setItem('token', res.data.token)
        setMessage(res.data.message)
        setSpinnerOn(true)
        redirectToArticles()
      })
      .catch(err => {
        setMessage(err.response.data.message)    
      })
  }

 
  const getArticles = () => {

    axiosWithAuth()
      .get('/articles')
      .then(res =>{
        setMessage(res.data.message)
        setSpinnerOn(false)
        setArticles(res.data.articles)
      })
      .catch(err => {
        if(err){
          redirectToLogin()
          setMessage(err.response.data.message)
        }
      })
  }

  const postArticle = article => {
    axiosWithAuth()
      .post('/articles', article)
      .then(res => {
        setMessage(res.data.message)
      })
      .catch(err=> {
        setMessage(err.response.data.message)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement
  }



  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle} 
                updateArticle={updateArticle} 
                setCurrentArticleId={setCurrentArticleId} 
              />
              <Articles 
                getArticles={getArticles} 
                articles={articles} 
                setCurrentArticleId={setCurrentArticleId} 
                deleteArticle={deleteArticle} 
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
