import React, { useState } from 'react'

import {
    Upload,
    Heart,
    Sparkles,
    Camera,
    Users,
    Shield,
    Instagram,
    Facebook,
    Linkedin,
    Youtube,
    Crown,
    Zap,
} from 'lucide-react';
import AuthForm from '../Auth/AuthForm';
import PricingTier from '../Pricing/PricingTier';
import InsightsPage from '../InsightsPage/insightPage';

interface UploadResult {
    username: string;
    score: number;
    platforms: string[];
}

interface UploadResult {
    platform: string;
    username: string;
    profile_url: string;
    profile_photo: string;
}

const ImageUpload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [showAuth, setShowAuth] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadResults, setUploadResults] = useState<UploadResult[] | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            await uploadImage(files[0]);
        }
    };

    const uploadImage = async (file: File) => {
        setUploading(true);
        setUploadError('');
        setUploadResults(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const uploadResponse = await fetch('http://127.0.0.1:5000/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                const error = await uploadResponse.json();
                throw new Error(error.error || 'Failed to upload image');
            }

            const uploadData = await uploadResponse.json();

            const filterResponse = await fetch('http://127.0.0.1:5000/api/filter-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: uploadData.data.results }),
            });

            if (!filterResponse.ok) {
                const error = await filterResponse.json();
                throw new Error(error.error || 'Failed to filter results');
            }

            const filterData = await filterResponse.json();

            const prepareDisplayResponse = await fetch(
                'http://127.0.0.1:5000/api/prepare-display-data',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        instagram: filterData.data.instagram || [],
                        linkedin: filterData.data.linkedin || [],
                        twitter: filterData.data.twitter || [],
                        facebook: filterData.data.facebook || [],
                        others: filterData.data.others || [],
                    }),
                }
            );

            if (!prepareDisplayResponse.ok) {
                const error = await prepareDisplayResponse.json();
                throw new Error(error.error || 'Failed to prepare display data');
            }

            const preparedDisplayData = await prepareDisplayResponse.json();

            setUploadResults(preparedDisplayData.data.display_data);
            setShowAuth(true);
        } catch (error: any) {
            setUploadError(error.message || 'Something went wrong');
        } finally {
            setUploading(false);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            await uploadImage(files[0]);
        }
    };

    const handlePlanSelection = () => {
        setShowPaywall(false);
        setShowInsights(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
            {!showAuth && !showPaywall && !showInsights ? (
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="flex justify-center mb-6">
                            <Heart className="w-16 h-16 text-white animate-pulse" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-title">
                            Find Love Through
                            <span className="block text-pink-200">Your Style</span>
                        </h1>
                        <p className="text-xl text-white/90 mb-8 animate-fade-in-up">
                            Upload a screenshot of your style and let our AI match you with like-minded people.
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <div
                            className={`relative rounded-xl p-8 bg-white/10 backdrop-blur-lg border-2 border-dashed ${dragActive ? 'border-pink-300 bg-white/20' : 'border-white/50'
                                } transition-all duration-300 cursor-pointer hover:border-pink-300 hover:bg-white/20`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={handleFileInput}
                            />
                            <div className="text-center">
                                <Upload className="w-12 h-12 text-white mx-auto mb-4 animate-bounce" />
                                <p className="text-white text-lg mb-2">Drop your screenshot here</p>
                                <p className="text-white/70 text-sm">or click to upload</p>
                            </div>
                        </div>
                    </div>

                    {uploading && (
                        <div className="text-center mt-4 text-white">Uploading image...</div>
                    )}

                    {uploadError && (
                        <div className="text-center mt-4 text-red-500">{uploadError}</div>
                    )}

                    {uploadResults && (
                        <div className="text-center mt-4 text-white">
                            <h3 className="text-2xl font-bold mb-2">Upload Results Saved</h3>
                            <p className="text-white/70">
                                Your upload results have been saved. Continue to sign in or sign up to proceed.
                            </p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-8 mt-20">
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
                            <Camera className="w-8 h-8 text-pink-200 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Style Analysis</h3>
                            <p className="text-white/70">Our AI analyzes your style preferences from screenshots.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
                            <Users className="w-8 h-8 text-pink-200 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
                            <p className="text-white/70">Connect with people who share your aesthetic.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
                            <Shield className="w-8 h-8 text-pink-200 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Safe & Secure</h3>
                            <p className="text-white/70">Your privacy and security are our top priority.</p>
                        </div>
                    </div>
                </div>
            ) : showAuth && !showPaywall && !showInsights ? (
                <>
                    {console.log('inside near')}
                    <AuthForm />
                </>
            ) : showPaywall && !showInsights ? (
                <div className="container mx-auto px-4 py-20 animate-fade-in">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-title">
                            Choose Your Perfect Match Plan
                        </h2>
                        <p className="text-xl text-white/90 animate-fade-in-up">
                            Unlock premium features and find your perfect match.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div onClick={handlePlanSelection}>
                            <PricingTier
                                title="Basic"
                                price="$9.99"
                                icon={Heart}
                                features={[
                                    'Style Analysis',
                                    '5 Matches per Day',
                                    'Basic Chat Features',
                                    'Profile Customization',
                                ]}
                            />
                        </div>
                        <div onClick={handlePlanSelection}>
                            <PricingTier
                                title="Premium"
                                price="$19.99"
                                icon={Crown}
                                highlighted
                                features={[
                                    'Advanced Style Analysis',
                                    'Unlimited Matches',
                                    'Priority Chat Features',
                                    'Profile Highlights',
                                    'See Who Likes You',
                                ]}
                            />
                        </div>
                        <div onClick={handlePlanSelection}>
                            <PricingTier
                                title="Elite"
                                price="$29.99"
                                icon={Zap}
                                features={[
                                    'AI Style Recommendations',
                                    'Unlimited Everything',
                                    'Video Chat',
                                    'Profile Boost',
                                    'Personal Style Consultant',
                                    'Early Access Features',
                                ]}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <InsightsPage uploadResults={uploadResults} />
            )}

            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <Sparkles
                    className="absolute text-pink-200/30 w-8 h-8 animate-float"
                    style={{ top: '20%', left: '10%' }}
                />
                <Sparkles
                    className="absolute text-pink-200/30 w-6 h-6 animate-float-delayed"
                    style={{ top: '60%', left: '80%' }}
                />
                <Sparkles
                    className="absolute text-pink-200/30 w-10 h-10 animate-float-slow"
                    style={{ top: '40%', left: '60%' }}
                />
                <Instagram
                    className="absolute text-white/20 w-12 h-12 animate-float-diagonal-1"
                    style={{ top: '15%', left: '25%' }}
                />
                <Facebook
                    className="absolute text-white/20 w-10 h-10 animate-float-diagonal-2"
                    style={{ top: '75%', left: '15%' }}
                />
                <Linkedin
                    className="absolute text-white/20 w-14 h-14 animate-float-diagonal-3"
                    style={{ top: '30%', left: '85%' }}
                />
                <Youtube
                    className="absolute text-white/20 w-16 h-16 animate-float-diagonal-4"
                    style={{ top: '65%', left: '70%' }}
                />
            </div>
        </div>
    )
}

export default ImageUpload