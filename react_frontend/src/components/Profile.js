import React, { useState, useEffect } from 'react'
import APIService from './APIService'; 
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { BsCheck2All } from 'react-icons/bs';

function Profile() {
    const [username, setUsername] = useState('')
    const [token, setToken, removeToken] = useCookies(['mytoken'])
    const [selectedMenu, setSelectedMenu] = useState('Profile')
    const [completedTasks, setCompletedTasks] = useState(0)
    const [totalTasks, setTotalTasks] = useState(0)
    const [newUsername, setNewUsername] = useState('')
    const [usernameError, setUsernameError] = useState(false)  
    const [updateUsernameSuccess, setUpdateUsernameSuccess] = useState(false)
    const [usernameTaken, setUsernameTaken] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false)
    const [oldPasswordCheck, setOldPasswordCheck] = useState(false)
    const [section, setSection] = useState('basic')
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
    useEffect(() => {
        setNewUsername(username);
    }, [username]);
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
    const updateUsername = () => {
        if (newUsername.trim() !== '') {
            setUsernameError(false)
            setUpdateUsernameSuccess(false)
            setUsernameTaken(false)
            APIService.UpdateUsername(username, newUsername, token['mytoken'])
            .then(data => {
            if (data.username) {
                setUsername(data.username);
                setNewUsername(data.username);
                localStorage.setItem('username', data.username)
                setUpdateUsernameSuccess(true);
            }
            else {
                setUsernameTaken(true);
            }
            })
            .catch(error => console.log(error))
        }
        else {
            setUsernameError(true); 
        }
    }
    const updatePassword = () => {
        if (oldPassword.trim() !== '' && newPassword.trim() !== '') {
            setPasswordError(false)
            setUpdatePasswordSuccess(false)
            setOldPasswordCheck(false)
            APIService.UpdatePassword(oldPassword, newPassword, token['mytoken'])
            .then((data) => {
            if (data.username) {
                setUpdatePasswordSuccess(true);
                setOldPassword('');
                setNewPassword('');
            }
            else {
                setOldPasswordCheck(true);
            }
            })
            .catch((error) => console.log(error))
        } 
        else {
          setPasswordError(true);
        }
    }
    const handleSectionChange = (value) => {
        setSection(value)
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
            <h1>Profile settings</h1>
            <div style={{ marginBottom: '20px' }}>
                <button className={`section-button ${section === 'basic' ? 'active' : ''}`} onClick={() => handleSectionChange('basic')}>Basic</button>
                <button className={`section-button ${section === 'security' ? 'active' : ''}`} onClick={() => handleSectionChange('security')}>Security</button>
            </div>
            {section === 'basic' && (
                <div>
                    <h3>Completed tasks: <span className = "grey">{completedTasks}</span></h3>
                    <h3>Total tasks: <span className = "grey">{totalTasks}</span></h3>
                    <h3>Update username</h3>
                    {usernameError && <h5 style={{ color: 'red' }}>Please enter at least one character</h5>} 
                    {updateUsernameSuccess && <h5 style={{ color: 'green' }}>Username updated successfully</h5>}
                    {usernameTaken && <h5 style={{ color: 'red' }}>This username is already taken</h5>}
                    <input type="text" style={{ width: '12%', margin: 'auto' }} className = "form-control" value={newUsername} onChange={(e) => {setNewUsername(e.target.value); setUsernameError(false); setUpdateUsernameSuccess(false);}}/><br/>
                    <button className="btn btn-select" style={{ backgroundColor: '#B8860B', color: 'white' }} onMouseEnter={(e) => (e.target.style.backgroundColor = '#9B7A00')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#B8860B')} onClick={updateUsername}><BsCheck2All size={17}/> Save</button>
                </div>
            )}
            {section === 'security' && (
                <div>
                    <h3>Update password</h3>
                    {passwordError && <h5 style={{ color: 'red' }}>Please enter both current and new passwords</h5>}
                    {updatePasswordSuccess && <h5 style={{ color: 'green' }}>Password updated successfully</h5>}
                    {oldPasswordCheck && <h5 style={{ color: 'red' }}>Incorrect current password entered</h5>}
                    <input type="password"  style={{ width: '12%', margin: 'auto' }} className = "form-control" placeholder="Current Password" value={oldPassword} onChange={(e) => {setOldPassword(e.target.value); setPasswordError(false); setUpdatePasswordSuccess(false);}}/><br/>
                    <input type="password"  style={{ width: '12%', margin: 'auto' }} className = "form-control" placeholder="New Password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value); setPasswordError(false); setUpdatePasswordSuccess(false);}}/><br/>
                    <button className="btn btn-select" style={{ backgroundColor: '#B8860B', color: 'white' }} onMouseEnter={(e) => (e.target.style.backgroundColor = '#9B7A00')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#B8860B')} onClick={updatePassword}><BsCheck2All size={17}/> Save</button>
                </div>
            )}
        </div>
    )
}

export default Profile