import './App.css';
import React, { useState, useEffect } from 'react';
import PostList from './components/PostList';
import Form from './components/Form';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
export function formatDate(dateString) {
  const date = new Date(dateString)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December']
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const amPm = hours >= 12 ? 'p.m.' : 'a.m.'
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  return `${month} ${day}, ${year}, ${formattedHours}:${formattedMinutes} ${amPm}`
}

function App() {
  const [posts, setPosts] = useState([])
  const [editPost, setEditPost] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [token, setToken, removeToken] = useCookies(['mytoken'])
  const [username, setUsername] = useState('')
  const [filter, setFilter] = useState("All")
  const [selectedMenu, setSelectedMenu] = useState('Profile')
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
        navigate('/') // push users to the login
    }
  }, [token, navigate])
  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    setUsername(storedUsername)
  }, [])

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
  const handleMenuBtn = (event) => {
    setSelectedMenu(event.target.value)
    if (event.target.value === 'Settings') {
        navigate('/settings');
    } 
    else if (event.target.value === 'Log out') {
        logoutBtn();
    }
  }
  const handleHomeBtn = () => {
    navigate('/posts')
  }
  const logoutBtn = () => {
    removeToken(['mytoken'])
    localStorage.removeItem('username');
  }
  return (
    <div className="App">
      <div className="row" style={{ marginLeft: '450px' }}>
        <div className="col">
         <h1>Todo List <button className="btn btn-success btn-select" onClick={openForm} style={{ marginLeft: '10px'}}><IoMdAdd size={17}/> New task</button>
          <select className="btn btn-secondary btn-select" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: '20px', backgroundColor: 'orange', color: 'white' }}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
          </select> <button className="btn btn-primary btn-select" style={{ marginLeft: '12px'}} onClick={handleHomeBtn}>HOME</button>
          <select className="btn btn-secondary btn-select" style={{ marginLeft: '18px', backgroundColor: 'black', color: 'white' }} value={selectedMenu} onChange={handleMenuBtn}>
              <option value="Profile" disabled hidden>Profile</option>
              <option value="Settings">Settings</option>
              <option value="Log out">Log out</option>
          </select></h1>
        </div>
      </div>
      <hr/>
      {showForm && editPost ? (<Form post = {editPost} addedPost={addedPost} updatedData = {updatedData} cancelForm={cancelForm}/>): null}
      <PostList posts={filterPosts()} editBtn = {editBtn} deleteBtn = {deleteBtn} updatedData={updatedData} addedPost={addedPost} cancelForm={cancelForm}/>
    </div>
  )
}

export default App;
