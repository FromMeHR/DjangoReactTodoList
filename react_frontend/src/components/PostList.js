import React, { useState, useEffect } from 'react'
import { formatDate } from '../App';
import APIService from './APIService';
import Form from './Form';
import {useCookies} from 'react-cookie';
import { BsCheck } from 'react-icons/bs';
import { LuEdit3 } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";

function PostList(props) {
    const[selectedPostId, setSelectedPostId] = useState(null)
    const [token] = useCookies(['mytoken'])
    const [username, setUsername] = useState('')
    const filteredPosts = props.posts.filter(post => post.username === username);
    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        setUsername(storedUsername)
    }, [])
    const editBtn = (PostId) => {
        setSelectedPostId(PostId) 
    //     props.editBtn(PostId)
    }
    const deleteBtn = (post) => {
        APIService.DeletePost(post.id, token['mytoken'])
            .then(() => props.deleteBtn(post))
            .catch(error => console.log(error))
    }
    const completePost = (post) => {
        APIService.UpdateCompleted(post.id, token['mytoken'])
            .then(resp => props.updatedData(resp))
            .catch(error => console.log(error))
    }
    const cancelForm = () => {
        setSelectedPostId(null)
    }

    return (
        <div>
            {filteredPosts.map(post => (
            <div key = {post.id}>
                <h2 className={`${post.completed ? 'completed' : ''}  post-text`}>{post.title}
                      <button
                          className={`btn btn-outline-success ${post.completed ? 'active' : ''} rounded-circle circle`}
                          onClick={() => completePost(post)}
                          style={{ marginLeft: '10px', backgroundColor: post.completed ? 'white' : 'transparent',
                          borderColor: 'white', color: post.completed ? 'black' : 'white', padding: 0 }}>
                          {post.completed ? (
                          <BsCheck size={20} className="text-black"/>
                          ) : (
                          <BsCheck size={20} className="text-white"/>
                          )}
                      </button>
                  </h2>
                <h6 className={post.completed ? 'completed' : ''}>{formatDate(post.date)}</h6>
                <h6 className={`${post.completed ? 'completed' : ''} post-text`}>{post.description}</h6><br/>
                <div className="row justify-content-center" >
                    <div className = "col-md-6 text-center">
                        <button className="btn btn-primary btn-select" onClick={() => editBtn(post.id)}><LuEdit3 size={16}/> Edit</button>
                        <button className="btn btn-danger btn-select" onClick={() => deleteBtn(post)} style={{ marginLeft: '40px' }}><MdDeleteForever size={17}/> Delete</button>
                    </div>
                </div><br/>
                <hr className="hor-line"/>
                {selectedPostId === post.id && (
                <Form post={post} updatedData={props.updatedData} addedPost={props.addedPost} cancelForm={cancelForm}/>
                )}
                <hr className="hor-line"/>
            </div>
        ))}
        </div>
    )
}

export default PostList