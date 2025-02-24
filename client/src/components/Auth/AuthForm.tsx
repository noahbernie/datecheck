import React, { useState } from 'react';
import {
    Mail,
    Lock,
    User
} from 'lucide-react';

interface Data {
    email: string
    password: string
}

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [data, setData] = useState<Data>({ email: "", password: "" })
    const [authError, setAuthError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const { name, value } = e.target
        console.log(name, value)
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                console.log(error.message)

                throw new Error(error.message || 'Failed to filter results');
            }
        } catch (error: any) {
            setAuthError(error.message || 'Something went wrong');
        }
        // console.log(res)
        // setShowAuth(false);
        // setShowPaywall(true);
    };

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
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
                {authError && (
                    <div className="text-center mt-4 text-red-500">{authError}</div>
                )}
            </div>
        </>
    )
}

export default AuthForm
