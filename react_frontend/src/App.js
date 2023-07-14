import './App.css';
import React, { useState, useEffect } from 'react';
import PostList from './components/PostList';
import Form from './components/Form';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { TbLogout } from "react-icons/tb";

export function formatDate(dateString) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', options)
} 

function App() {
  const [posts, setPosts] = useState([])
  const [editPost, setEditPost] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [token, setToken, removeToken] = useCookies(['mytoken'])
  const [filter, setFilter] = useState("All")
  const navigate = useNavigate()
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/posts/', {
      'method':'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Token ${token['mytoken']}`
      }
    })
    .then(resp => resp.json())
    .then(resp => setPosts(resp))
    .catch(error => console.log(error))
  }, [token])
  useEffect(() => {
    if(!token['mytoken']) {
        navigate('/') // push users to the posts after login
    }
  }, [token, navigate])

  const editBtn = (PostId) => {
    const selectedPost = posts.find(post => post.id === PostId)
    setEditPost(selectedPost)
    setShowForm(true)
  }
  const updatedData = (post) => {
    const new_post = posts.map(myPost => {
      if (myPost.id === post.id) {
        return post;
      } 
      else {
        return myPost;
      }
    })
    setPosts(new_post)
    setShowForm(false)
  }
  const openForm = () => {
    setEditPost({ title:'', description:''})
    setShowForm(true)
  }
  const addedPost = (post) => {
    const new_posts = [...posts, post]
    setPosts(new_posts)
    setShowForm(false)
  }
  const deleteBtn = (post) => {
    const new_posts = posts.filter(myPost => {
      if(myPost.id === post.id) {
        return false;
      }
      else {
        return true;
      }
    })
    setPosts(new_posts)
  }
  const cancelForm = () => {
    setEditPost(null)
    setShowForm(false) 
  }
  const filterPosts = () => {
    if (filter === "All") {
      return posts;
    } 
    else if (filter === "Completed") {
      return posts.filter((post) => post.completed);
    }
    return []
  }
  const logoutBtn = () => {
    removeToken(['mytoken'])
    localStorage.removeItem('username');
  }
  return (
    <div className="App">
      <div className="row" style={{ marginLeft: '350px' }}>
        <div className="col">
         <h1>Todo List <button className="btn btn-success btn-select" onClick={openForm} style={{ marginLeft: '10px'}}><IoMdAdd size={17}/> New task</button>
          <select className="btn btn-secondary btn-select" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: '20px', backgroundColor: 'orange', color: 'white' }}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
          </select> <button className="btn btn-secondary btn-select" onClick={logoutBtn} style={{ marginLeft: '10px', backgroundColor: 'black', color: 'white' }}><TbLogout size={17}/> Log out</button></h1>
        </div>
      </div>
      <hr/>
      {showForm && editPost ? (<Form post = {editPost} addedPost={addedPost} updatedData = {updatedData} cancelForm={cancelForm}/>): null}
      <PostList posts={filterPosts()} editBtn = {editBtn} deleteBtn = {deleteBtn} updatedData={updatedData} addedPost={addedPost} cancelForm={cancelForm}/>
    </div>
  )
}

export default App;
