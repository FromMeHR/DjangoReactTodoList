export default class APIService {
    static UpdatePost(post_id, body, token) {
        return fetch(`http://127.0.0.1:8000/api/posts/${post_id}/`, {
            'method':'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}`
            },
            body: JSON.stringify(body)
        })
        .then(resp => resp.json())
    }
    static AddPost(body, token) {
        return fetch('http://127.0.0.1:8000/api/posts/', {
            'method':'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}`
            },
            body: JSON.stringify(body)
        })
        .then(resp => resp.json())
    }
    static DeletePost(post_id, token) {
        return fetch(`http://127.0.0.1:8000/api/posts/${post_id}/`, {
            'method': 'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}`
            },
        })
    }
    static UpdateCompleted(post_id, token) {
        return fetch(`http://127.0.0.1:8000/api/complete/${post_id}/update_completed/`, {
            'method': 'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}`
            },
        })
        .then(resp => resp.json())
    }
    static LoginUser(body) {
        return fetch('http://127.0.0.1:8000/auth/', {
            'method':'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(resp => resp.json())
    }
    static RegisterUser(body) {
        return fetch('http://127.0.0.1:8000/api/users/', {
            'method':'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(resp => resp.json())
    }
    static CheckUserExists(username) {
        return fetch(`http://127.0.0.1:8000/api/users/?username=${username}`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            const user = data.find((user) => user.username === username)
            return user // if exists return true
        })
    }
}