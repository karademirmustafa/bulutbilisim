import React, { useState } from 'react'
import './login.css'
import { Link } from 'react-router-dom'
import axios from "axios"
const Login = () => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    const socketUrl = 'http://localhost:5000'
    const createRoom =(room,name)=> {axios.post(`${socketUrl}/chat?name=${name}&room=${room}`)} 

    return (
        <div className="container w-25 mt-4">
           
           
            <h1 className="login-h1">Odaya Katıl</h1>
            <form method="post">
                <div className="form-group">
                    <input
                        onChange={(e) => setName(e.target.value)}
                        type="text" placeholder="Kullanıcı adınız" required className="form-control form-input" />
                </div>
                <div className="form-group">
                    <input
                        onChange={(e) => setRoom(e.target.value)}
                        type="text" placeholder="Oda" required className="form-control form-input" />
                </div>
                <Link onClick={e => (!name || !room) ? e.preventDefault() : null}
                    to={`/chat?name=${name}&room=${room}`}>
                    <input type="submit" onClick={()=> {createRoom(room,name)}} className="form-submit" value="Giriş Yap" />
                </Link>
            </form>
        </div>
    )
}

export default Login;