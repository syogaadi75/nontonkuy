import React, { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const apiUrl = useSelector((state) => state.apiUrl.apiUrl)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post(apiUrl + '/auth/login', { email, password })
            localStorage.setItem('authToken', response.data.token)
            navigate('/main');
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className='w-full flex justify-center items-center min-h-screen'>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className='flex gap-4  flex-col'>
                    <label htmlFor="email">Email</label>
                    <input
                        className='n-input'
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className='flex gap-4  flex-col'>
                    <label htmlFor="password">Password</label>
                    <input
                        className='n-input'
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    {error && <p>{error}</p>}

                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}


export default Login
