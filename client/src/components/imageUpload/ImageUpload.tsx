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
    Youtube
} from 'lucide-react'
import _ from 'lodash'

import { getBaseUrl } from '../../../actions/api'
const BASE_URL = getBaseUrl()

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
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
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

            const uploadResponse = await fetch(`${BASE_URL}/api/upload-image`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadResponse.json()
            if (uploadData.success === 0) {
                let errorMessage = uploadData.message
                throw new Error(errorMessage || 'Failed to upload image');
            }

            const filterResponse = await fetch(`${BASE_URL}/api/filter-results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: uploadData.data.results }),
            });

            const filterData = await filterResponse.json();
            if (filterData.success === 0) {
                let errorMessage = filterData.message
                throw new Error(errorMessage || 'Failed to filter results');
            }


            const prepareDisplayResponse = await fetch(
                `${BASE_URL}/api/prepare-display-data`,
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

            const preparedDisplayData = await prepareDisplayResponse.json();

            if (preparedDisplayData.success === 0) {
                let errorMessage = preparedDisplayData.message
                throw new Error(errorMessage || 'Failed to prepare display data');
            }


            setUploadResults(preparedDisplayData.data.display_data);
        } catch (error: any) {
            setUploadError('Service Unavailable. Please contact admin.');
            return { success: 0 }
        } finally {
            setUploading(false);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const data = await uploadImage(files[0]);
            if (data?.success === 0) {
                e.target.value = ''
            }
        }
    };

    // const handlePlanSelection = () => {
    //     // setShowPaywall(false);
    //     setShowInsights(true);
    // };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
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
                            disabled={uploading}
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
