import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate, useParams } from 'react-router-dom'
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

    setSpinnerOn(true)
    axios.post(loginUrl, {username, password})
      .then(res => {
        localStorage.setItem('token', res.data.token)
        setMessage(res.data.message)
        setSpinnerOn(false)
        redirectToArticles()
      })
      .catch(err => {
        setMessage(err.response.data.message)    
      })
  }

 
  const getArticles = () => {
    setSpinnerOn(true)
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
    setSpinnerOn(true)
    axiosWithAuth()
      .post('/articles', article)
      .then(res => {
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err=> {
        setMessage(err.response.data.message)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    setSpinnerOn(true)
    axiosWithAuth()
      .put(`/articles/${article_id}`, article)
      .then(res => {
        setArticles(articles.map(art=>{
          if(art.article_id === currentArticleId){
            return res.data.article
          } else {
            return art
          }
        }))
        setSpinnerOn(false)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true)
    axiosWithAuth()
      .delete(`/articles/${article_id}`)
        .then(res => {
          setSpinnerOn(false)
          setMessage(res.data.message)
        })
        .catch(err => {
          console.log(err)
        })
  }




  return (
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
                currentArticle={articles.find(elem=> elem.article_id === currentArticleId)}
              />
              <Articles 
                getArticles={getArticles} 
                setCurrentArticleId={setCurrentArticleId} 
                deleteArticle={deleteArticle} 
                currentArticleId={currentArticleId}
                updateArticle={updateArticle}
                articles={articles}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
