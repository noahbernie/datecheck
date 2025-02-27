import React, { useState } from 'react';
import {
    Mail,
    Lock,
    User
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import { ToastContainer, toast } from 'react-toastify'
import { authUser, setShowPaywall, setShowAuth } from '../../reducer/authSlice'
import { getBaseUrl } from '../../../actions/api'
const BASE_URL = getBaseUrl()

interface Data {
    email: string
    password: string
}

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [data, setData] = useState<Data>({ email: "", password: "" })
    const [authError, setAuthError] = useState('')
    const dispatch = useDispatch()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const { name, value } = e.target
        console.log(name, value)
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

            toast.success('Register successfully', {
                position: "top-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            })
            localStorage.setItem('authToken', response.data.token)
            setTimeout(() => {
                dispatch(setShowAuth(false))
                dispatch(setShowPaywall(true))
            }, 1500)
        } catch (error: any) {
            setAuthError(error.message || 'Something went wrong');
        }
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthError('')
        try {
            const res = await fetch(`${BASE_URL}/api/user/login`, {
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
                throw new Error(errorMessage || 'Failed to login');
            }

            toast.success('Login successfully.', {
                position: "top-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            })
            localStorage.setItem('authToken', response.data.token)
            setTimeout(() => {
                dispatch(setShowAuth(false))
                dispatch(setShowPaywall(true))
            }, 1500)
        } catch (error: any) {
            setAuthError(error.message || 'Something went wrong');
        }
    }

    const handleSetAuth = () => {
        setIsLogin(!isLogin)
        setAuthError('')
    }

    return (
        <>
            <div className="container mx-auto px-4 py-20 animate-fade-in">
                <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-xl">
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 rounded-full bg-pink-500/20 backdrop-blur-lg mb-4">
                            <User className="w-8 h-8 text-pink-300" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </h2>
                        <p className="text-white/70">
                            {isLogin ? 'Sign in to continue your journey' : 'Join us to find your perfect match'}
                        </p>
                    </div>

                    <form onSubmit={isLogin ? handleLoginSubmit : handleAuthSubmit} className="space-y-4">
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
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleSetAuth}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
                {authError && (
                    <div className="text-center mt-4 text-red-500">{authError}</div>
                )}
            <ToastContainer />
            </div>
        </>
    )
}

export default AuthForm
