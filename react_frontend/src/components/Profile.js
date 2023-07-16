import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [username, setUsername] = useState('')
    const [token, setToken, removeToken] = useCookies(['mytoken'])
    const [selectedMenu, setSelectedMenu] = useState('Profile')
    const [completedTasks, setCompletedTasks] = useState(0)
    const [totalTasks, setTotalTasks] = useState(0)
    const navigate = useNavigate()
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/posts/', {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token['mytoken']}`
            }
        })
        .then(resp => resp.json())
        .then(data => {
            const userCompletedTasks = data.filter(post => post.completed && post.username === username)
            const userTotalTasks = data.filter(post => post.username === username)
            setCompletedTasks(userCompletedTasks.length)
            setTotalTasks(userTotalTasks.length)
        })
        .catch(error => console.log(error))
    }, [token, username])
    useEffect(() => {
        const storedUsername = localStorage.getItem('username')
        setUsername(storedUsername)
    }, [])
    useEffect(() => {
        if(!token['mytoken']) {
            navigate('/')
        }
    }, [token, navigate])
    const handleMenuBtn = (event) => {
        setSelectedMenu(event.target.value)
        if (event.target.value === 'Settings') {
            navigate('/settings');
            setSelectedMenu('Profile')
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
        localStorage.removeItem('username')
        navigate('/')
    }
    return (
        <div className="App">
            <div className="row" style={{ marginLeft: '450px' }}>
                <div className="col">
                <h1>Todo List <span style={{ marginLeft: '255px' }}>
                <button className="btn btn-primary btn-select" style={{ marginLeft: '23px'}} onClick={handleHomeBtn}>HOME</button> 
                <select className="btn btn-secondary btn-select" style={{ marginLeft: '20px', backgroundColor: 'black', color: 'white' }} value={selectedMenu} onChange={handleMenuBtn}>
                    <option value="Profile" disabled hidden>Profile</option>
                    <option value="Settings">Settings</option>
                    <option value="Log out">Log out</option>
                </select></span></h1>
                </div>
            </div>
            <hr/>
            <h2>Profile settings</h2>
            {username && <h3>Username: <span className = "grey">{username}</span></h3>}
            <h3>Completed tasks: <span className = "grey">{completedTasks}</span></h3>
            <h3>Total tasks: <span className = "grey">{totalTasks}</span></h3>
        </div>
    )
}

export default Profile