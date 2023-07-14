import React, {useState, useEffect} from 'react'
import APIService from './APIService';
import {useCookies} from 'react-cookie';
import { BsCheck2All } from 'react-icons/bs';
import { MdCancel } from "react-icons/md";
function Form(props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [token] = useCookies(['mytoken'])
    const [formError, setFormError] = useState(false)
    useEffect(() => {
        setTitle(props.post.title)
        setDescription(props.post.description)
    },[props.post]) 

    const updatePost = () => {
        if (title.trim() === '' || description.trim() === '') {
            setFormError(true)
            return
        }
        APIService.UpdatePost(props.post.id, { title, description }, token['mytoken'])
        .then(resp => {
            props.updatedData(resp) 
            props.cancelForm()
        })
        .catch(error => console.log(error))
    }

    const addPost = () => {
        if (title.trim() === '' || description.trim() === '') {
            setFormError(true)
            return
        }
        APIService.AddPost({ title, description }, token['mytoken'])
        .then(resp => {
            props.addedPost(resp)
            props.cancelForm()
          })
        .catch(error => console.log(error))
    }
    const cancelAction = () => {
        setTitle('')
        setDescription('')
        setFormError(false);
        props.cancelForm()
    }
    return (
        <div>
            {props.post ? ( 
                <div className = "mb-3">
                    {formError && <p style={{ color: 'red' }}>Please fill in both fields</p>}
                    <label htmlFor = "title" className = "form-label">New title</label>
                    <input style={{ width: '50%', margin: 'auto' }} type="text" className = "form-control" id="title" placeholder = "Enter the new title" value = {title} onChange = {e => setTitle(e.target.value)}/>
                    <label htmlFor = "description" className = "form-label">New text</label>
                    <textarea style={{ width: '50%', margin: 'auto' }} className = "form-control" id="description" rows="2" placeholder = "Enter the new post" value = {description} onChange = {e => setDescription(e.target.value)}/>
                    {props.post.id ? (
                    <><button className="btn btn-success btn-select mt-3" onClick={updatePost}><BsCheck2All size={17}/> Save</button>
                    <button className="btn btn-secondary btn-select mt-3" onClick={cancelAction} style={{ marginLeft: '40px' }}><MdCancel size={17}/> Cancel</button></>
                    ) : (
                    <><button className="btn btn-success btn-select mt-3" onClick={addPost}><BsCheck2All size={17}/> Add</button>
                    <button className="btn btn-secondary btn-select mt-3" onClick={cancelAction} style={{ marginLeft: '40px' }}><MdCancel size={17}/> Cancel</button><br/><br/><hr className="hor-line"/></>
                    )}
                </div>
            ): null}
        </div>
    )
}

export default Form