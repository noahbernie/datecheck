import React, { useState } from 'react';
import {
    Mail,
    Lock,
    User
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { authUser } from '../../reducer/authSlice'
import { storeUserFaceMatches } from '../../../actions/auth/userFaceMatchesAction'
import { getBaseUrl } from '../../../actions/api'
import setAuthToken from '../../../utils/authToken'
import type { RootState } from '../../reducer/store'
const BASE_URL = getBaseUrl()

interface Data {
    email: string
    password: string
}

const Register = () => {
    const [data, setData] = useState<Data>({ email: "", password: "" })
    const [authError, setAuthError] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userFaceImageResult = useSelector((state: RootState) => state.userFaceMatches.userFaceMatches)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('')
        try {
            const res = await fetch(`${BASE_URL}/api/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const response = await res.json()
            if (response.success === 0) {
                let errorMessage = response.message
                if (_.isEmpty(response.errors) === false) {
                    errorMessage = response.errors[0].message
                }
                throw new Error(errorMessage || 'Failed to register');
            }
            dispatch(authUser(response.data))

            localStorage.setItem('authToken', response.data.token)
            setAuthToken(response.data.token)
            storeUserFaceMatches(userFaceImageResult, response.data._id)
            navigate('/subscribe')
        } catch (error: any) {
            setAuthError(error.message || 'Something went wrong');
        }
    }

    const handleSetAuth = () => {
        navigate('/login')
        setAuthError('')
    }

    return (
        <div className="container mx-auto px-4 py-20 animate-fade-in">
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-xl">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-pink-500/20 backdrop-blur-lg mb-4">
                        <User className="w-8 h-8 text-pink-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Create Account
                    </h2>
                    <p className="text-white/70">
                        Join us to find your perfect match
                    </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white/90 mb-2" htmlFor="email">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-300" />
                            <input
                                type="email"
                                id="email"
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-pink-300"
                                placeholder="your@email.com"
                                onChange={handleChange}
                                value={data.email}
                                name='email'
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-white/90 mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-300" />
                            <input
                                type="password"
                                id="password"
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-pink-300"
                                placeholder="••••••••"
                                onChange={handleChange}
                                value={data.password}
                                name='password'
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleSetAuth}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </div>
            {authError && (
                <div className="text-center mt-4 text-red-500">{authError}</div>
            )}
        </div>
    )
}

export default Register
