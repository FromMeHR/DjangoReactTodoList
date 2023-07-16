import React, {useState, useEffect} from 'react'
import APIService from './APIService';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken, removeToken] = useCookies(['mytoken'])
    const [isLogin, setLogin] = useState(true)
    const [userExists, setUserExists] = useState(false)
    const [formError, setFormError] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if(token['mytoken']) {
            navigate('/posts') // push users to the posts after login
        }
    }, [token, navigate])

    const loginBtn = () => {
        APIService.LoginUser({username, password})
        .then((resp) => {
            if (resp.token) {
              setToken('mytoken', resp.token);
              localStorage.setItem('username', username)
            } 
            else {
              removeToken(['mytoken']);
              setFormError(true)
              return
            }
          })
        .catch(error => console.log(error))
    }
    const registerBtn = () => {
        APIService.CheckUserExists(username)
        .then((exists) => {
        if (exists) {
          setUserExists(true);
        } 
        else {
          APIService.RegisterUser({username, password})
          .then(() => loginBtn())
          .catch(error => console.log(error))
          localStorage.setItem('username', username)
        }
      })
    }
    const resetFormError = () => {
        setFormError(false)
    }
    const resetUserExists = () => {
        setUserExists(false)
    }
    return (
        <div className = "App">
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/> 
            {isLogin ? <div><h1>Log In</h1><h6 style={{ color: 'grey' }}>In order to start using Todo list, you must be logged in.</h6></div>
            : <div><h1>Sign Up</h1><h6 style={{ color: 'grey' }}>After registration, you will be able to create tasks.</h6></div>}
            {formError && <h5 style={{ color: 'red' }}>Incorrect username or password entry</h5>}
            {userExists && !isLogin && <h5 style={{ color: 'red' }}>User with the same username already exists</h5>}
            <div className = "mb-3 form">
                <label htmlFor = "username" className = "for-label">Username</label>
                <input type = "text" value = {username} onChange ={e => setUsername(e.target.value)} className = "form-control" id = "username" placeholder = "Please enter username"/>
            </div>
            <div className = "mb-3 form">
                <label htmlFor = "password" className = "for-label">Password</label>
                <input type = "password" value = {password} onChange ={e => setPassword(e.target.value)} className = "form-control" id = "password" placeholder = "Please enter password"/>
            </div>
            {isLogin ? <button onClick = {loginBtn} className = "btn btn-primary">Log in</button>
            : <button onClick = {registerBtn} className = "btn btn-primary">Sign up</button> }
            <div className = "mb-3 form">
                <br/>
                {isLogin ? <h5>Don't have an account? <a className="py-1 text-blue" href="/#" style={{ textDecoration: 'none' }} onClick = {() => {setLogin(false); resetFormError(); resetUserExists();}}>Sign Up</a></h5>
                : <h5>Already have an account? <a className="py-1 text-blue" href="/#" style={{ textDecoration: 'none' }} onClick = {() => {setLogin(true); resetFormError(); resetUserExists();}}>Log In</a></h5>}
            </div>
        </div>
    )
}

export default Login
