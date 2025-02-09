import React, { useEffect, useState } from 'react'
import PT from 'prop-types'
import { axiosWithAuth } from '../axios'


const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {

  const [values, setValues] = useState(initialFormValues)
  const { postArticle, setCurrentArticleId, updateArticle, currentArticle  } = props
  
    
  useEffect(() => {

    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.

    if(currentArticle) {
      setValues(currentArticle)
    } else {
      setValues(initialFormValues)
    }
  },[currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }
  
  
  const onSubmit = evt => {
    evt.preventDefault()
    if(!currentArticle){
      postArticle(values)
      setValues(initialFormValues)
    } else {
      const article_id = values.article_id
      const article = {...values}
      updateArticle({article_id, article})
      setCurrentArticleId(null)
    }
    
  }

  const isDisabled = () => {
    if(values.title.trim(" ").length < 1 || values.text.trim(" ").length < 1){
      return true
    } 
  }


  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{!currentArticle ? 'Create Article' : ' Edit Article'}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={() => setCurrentArticleId(null)}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
