import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ImageUpload from './components/imageUpload/ImageUpload';

function App() {
  // const [dragActive, setDragActive] = useState(false);
  // const [showAuth, setShowAuth] = useState(true);
  // const [showPaywall, setShowPaywall] = useState(false);
  // const [showInsights, setShowInsights] = useState(false);
  // const [uploading, setUploading] = useState(false);
  // const [uploadError, setUploadError] = useState('');

  // interface UploadResult {
  //   username: string;
  //   score: number;
  //   platforms: string[];
  // }

  // interface UploadResult {
  //   platform: string;
  //   username: string;
  //   profile_url: string;
  //   profile_photo: string;
  // }

  // const [uploadResults, setUploadResults] = useState<UploadResult[] | null>(null);

  // const handleDrag = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (e.type === 'dragenter' || e.type === 'dragover') {
  //     setDragActive(true);
  //   } else if (e.type === 'dragleave') {
  //     setDragActive(false);
  //   }
  // };

  // const handleDrop = async (e: React.DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragActive(false);
  //   const files = e.dataTransfer.files;
  //   if (files && files[0]) {
  //     await uploadImage(files[0]);
  //   }
  // };

  // const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files && files[0]) {
  //     await uploadImage(files[0]);
  //   }
  // };

  // console.log({ showAuth })
  // console.log({ showPaywall, showInsights })

  // const handlePlanSelection = () => {
  //   setShowPaywall(false);
  //   setShowInsights(true);
  // };

  // const AuthForm = () => (
  //   <div className="container mx-auto px-4 py-20 animate-fade-in">
  //     <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-xl">
  //       <div className="text-center mb-8">
  //         <div className="inline-block p-3 rounded-full bg-pink-500/20 backdrop-blur-lg mb-4">
  //           <User className="w-8 h-8 text-pink-300" />
  //         </div>
  //         <h2 className="text-3xl font-bold text-white mb-2">
  //           {isLogin ? 'Welcome Back!' : 'Create Account'}
  //         </h2>
  //         <p className="text-white/70">
  //           {isLogin ? 'Sign in to continue your journey' : 'Join us to find your perfect match'}
  //         </p>
  //       </div>

  //       <form onSubmit={handleAuthSubmit} className="space-y-4">
  //         <div>
  //           <label className="block text-white/90 mb-2" htmlFor="email">
  //             Email
  //           </label>
  //           <div className="relative">
  //             <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-300" />
  //             <input
  //               type="email"
  //               id="email"
  //               className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-pink-300"
  //               placeholder="your@email.com"
  //               onChange={handleChange}
  //               value={data.email}
  //               name='email'
  //             />
  //           </div>
  //         </div>
  //         <div>
  //           <label className="block text-white/90 mb-2" htmlFor="password">
  //             Password
  //           </label>
  //           <div className="relative">
  //             <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-300" />
  //             <input
  //               type="password"
  //               id="password"
  //               className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-pink-300"
  //               placeholder="••••••••"
  //               onChange={handleChange}
  //               value={data.password}
  //               name='password'
  //             />
  //           </div>
  //         </div>
  //         <button
  //           type="submit"
  //           className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
  //         >
  //           {isLogin ? 'Sign In' : 'Create Account'}
  //         </button>
  //       </form>

  //       <div className="mt-6 text-center">
  //         <button
  //           onClick={() => setIsLogin(!isLogin)}
  //           className="text-white/70 hover:text-white transition-colors"
  //         >
  //           {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  // const PricingTier = ({
  //   title,
  //   price,
  //   features,
  //   icon: Icon,
  //   highlighted = false,
  // }: {
  //   title: string;
  //   price: string;
  //   features: string[];
  //   icon: React.ElementType;
  //   highlighted?: boolean;
  // }) => (
  //   <div
  //     className={`relative p-8 rounded-2xl backdrop-blur-lg transition-all duration-500 ${highlighted
  //       ? 'bg-gradient-to-b from-pink-500/90 to-purple-600/90 transform hover:scale-105 hover:shadow-xl'
  //       : 'bg-white/10 hover:bg-white/20 transform hover:scale-102'
  //       }`}
  //   >
  //     {highlighted && (
  //       <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-300 text-pink-800 px-4 py-1 rounded-full text-sm font-semibold">
  //         Most Popular
  //       </div>
  //     )}
  //     <Icon className={`w-12 h-12 mb-6 ${highlighted ? 'text-pink-200' : 'text-white/70'}`} />
  //     <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
  //     <div className="mb-6">
  //       <span className="text-4xl font-bold text-white">{price}</span>
  //       <span className="text-white/70">/month</span>
  //     </div>
  //     <ul className="space-y-4">
  //       {features.map((feature, index) => (
  //         <li key={index} className="flex items-center text-white/90">
  //           <Check className="w-5 h-5 mr-3 text-pink-300" />
  //           {feature}
  //         </li>
  //       ))}
  //     </ul>
  //     <button
  //       className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${highlighted
  //         ? 'bg-pink-300 text-pink-900 hover:bg-pink-200'
  //         : 'bg-white/20 text-white hover:bg-white/30'
  //         }`}
  //     >
  //       Get Started
  //     </button>
  //   </div>
  // );

  // interface MatchCardProps {
  //   platform: string;
  //   username: string;
  //   matchPercentage: number;
  //   profileImage: string;
  //   icon: React.ElementType;
  //   children?: React.ReactNode;
  // }

  // const MatchCard = ({
  //   platform,
  //   username,
  //   matchPercentage,
  //   profileImage,
  //   icon: Icon,
  //   children,
  // }: MatchCardProps): JSX.Element => (
  //   <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:transform hover:scale-102 transition-all duration-300">
  //     <div className="flex items-center space-x-4">
  //       <div className="relative">
  //         <img
  //           src={profileImage}
  //           alt={username}
  //           className="w-16 h-16 rounded-full object-cover"
  //         />
  //         <Icon className="absolute -bottom-1 -right-1 w-6 h-6 text-pink-300 bg-white/10 backdrop-blur-lg rounded-full p-1" />
  //       </div>
  //       <div className="flex-1">
  //         <div className="flex items-center justify-between">
  //           <h3 className="text-xl font-semibold text-white">{username}</h3>
  //           <span className="text-pink-300 font-bold">{matchPercentage}% Match</span>
  //         </div>
  //         <p className="text-white/70">{platform}</p>
  //       </div>
  //     </div>
  //     <div className="mt-4">{children}</div>
  //   </div>
  // );

  // const uploadImage = async (file: File) => {
  //   setUploading(true);
  //   setUploadError('');
  //   setUploadResults(null);

  //   try {
  //     const formData = new FormData();
  //     formData.append('image', file);

  //     const uploadResponse = await fetch('http://127.0.0.1:5000/api/upload-image', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!uploadResponse.ok) {
  //       const error = await uploadResponse.json();
  //       throw new Error(error.error || 'Failed to upload image');
  //     }

  //     const uploadData = await uploadResponse.json();

  //     const filterResponse = await fetch('http://127.0.0.1:5000/api/filter-results', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ results: uploadData.data.results }),
  //     });

  //     if (!filterResponse.ok) {
  //       const error = await filterResponse.json();
  //       throw new Error(error.error || 'Failed to filter results');
  //     }

  //     const filterData = await filterResponse.json();

  //     const prepareDisplayResponse = await fetch(
  //       'http://127.0.0.1:5000/api/prepare-display-data',
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           instagram: filterData.data.instagram || [],
  //           linkedin: filterData.data.linkedin || [],
  //           twitter: filterData.data.twitter || [],
  //           facebook: filterData.data.facebook || [],
  //           others: filterData.data.others || [],
  //         }),
  //       }
  //     );

  //     if (!prepareDisplayResponse.ok) {
  //       const error = await prepareDisplayResponse.json();
  //       throw new Error(error.error || 'Failed to prepare display data');
  //     }

  //     const preparedDisplayData = await prepareDisplayResponse.json();

  //     setUploadResults(preparedDisplayData.data.display_data);
  //     setShowAuth(true);
  //   } catch (error: any) {
  //     setUploadError(error.message || 'Something went wrong');
  //   } finally {
  //     setUploading(false);
  //   }
  // };




  // const ResultsDisplay = () => {
  //   if (!uploadResults || uploadResults.length === 0) {
  //     return <p className="text-center text-white">No results to display.</p>;
  //   }

  //   return (
  //     <div className="text-center mt-4 text-white">
  //       <h3 className="text-2xl font-bold mb-2">Most Likely Usernames</h3>
  //       <ul className="bg-white/10 rounded-lg p-4 text-left">
  //         {uploadResults.map((result, index) => (
  //           <li key={index} className="mb-2">
  //             <strong>Username:</strong> {result.username} <br />
  //             <strong>Score:</strong> {result.score} <br />
  //             <strong>Platforms:</strong> {result.platforms.join(', ')}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // };

  // const InsightsPage = ({ uploadResults }: { uploadResults: UploadResult[] | null }) => (
  //   <div className="container mx-auto px-4 py-20 animate-fade-in">
  //     <div className="text-center mb-16">
  //       <div className="inline-block p-3 rounded-full bg-pink-500/20 backdrop-blur-lg mb-6">
  //         <Sparkles className="w-10 h-10 text-pink-300" />
  //       </div>
  //       <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-title">
  //         Your Style Matches
  //       </h2>
  //       <p className="text-xl text-white/90 animate-fade-in-up max-w-2xl mx-auto">
  //         Based on your style preferences, we've found these profiles that match your aesthetic.
  //         Connect with like-minded individuals across different platforms.
  //       </p>
  //     </div>

  //     <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
  //       {uploadResults && uploadResults.length > 0 ? (
  //         uploadResults.map((result, index) => (
  //           <MatchCard
  //             key={index}
  //             platform={result.platform}
  //             username={result.username}
  //             matchPercentage={result.score} // Use the score from the backend
  //             profileImage={result.profile_photo}
  //             icon={
  //               result.platform.toLowerCase() === 'instagram'
  //                 ? Instagram
  //                 : result.platform.toLowerCase() === 'linkedin'
  //                   ? Linkedin
  //                   : result.platform.toLowerCase() === 'facebook'
  //                     ? Facebook
  //                     : result.platform.toLowerCase() === 'twitter'
  //                       ? Youtube // Replace with Twitter/X icon
  //                       : Sparkles // Default icon
  //             }
  //           >
  //             <a
  //               href={result.profile_url}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors mt-4"
  //             >
  //               <span>View Profile</span>
  //             </a>
  //           </MatchCard>

  //         ))
  //       ) : (
  //         <p className="text-center text-white/70">
  //           No style matches found yet. Upload a screenshot to see matches.
  //         </p>
  //       )}
  //     </div>

  //     {uploadResults && uploadResults.length > 0 && (
  //       <div className="mt-12 text-center">
  //         <p className="text-white/70 mb-6">Want to see more matches?</p>
  //         <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center group">
  //           Explore More Matches
  //           <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );

  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
  //     {!showAuth && !showPaywall && !showInsights ? (
  //       <div className="container mx-auto px-4 py-20">
  //         <div className="text-center mb-16 animate-fade-in">
  //           <div className="flex justify-center mb-6">
  //             <Heart className="w-16 h-16 text-white animate-pulse" />
  //           </div>
  //           <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-title">
  //             Find Love Through
  //             <span className="block text-pink-200">Your Style</span>
  //           </h1>
  //           <p className="text-xl text-white/90 mb-8 animate-fade-in-up">
  //             Upload a screenshot of your style and let our AI match you with like-minded people.
  //           </p>
  //         </div>

  //         <div className="max-w-2xl mx-auto">
  //           <div
  //             className={`relative rounded-xl p-8 bg-white/10 backdrop-blur-lg border-2 border-dashed ${dragActive ? 'border-pink-300 bg-white/20' : 'border-white/50'
  //               } transition-all duration-300 cursor-pointer hover:border-pink-300 hover:bg-white/20`}
  //             onDragEnter={handleDrag}
  //             onDragLeave={handleDrag}
  //             onDragOver={handleDrag}
  //             onDrop={handleDrop}
  //           >
  //             <input
  //               type="file"
  //               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  //               accept="image/*"
  //               onChange={handleFileInput}
  //             />
  //             <div className="text-center">
  //               <Upload className="w-12 h-12 text-white mx-auto mb-4 animate-bounce" />
  //               <p className="text-white text-lg mb-2">Drop your screenshot here</p>
  //               <p className="text-white/70 text-sm">or click to upload</p>
  //             </div>
  //           </div>
  //         </div>

  //         {uploading && (
  //           <div className="text-center mt-4 text-white">Uploading image...</div>
  //         )}

  //         {uploadError && (
  //           <div className="text-center mt-4 text-red-500">{uploadError}</div>
  //         )}

  //         {uploadResults && (
  //           <div className="text-center mt-4 text-white">
  //             <h3 className="text-2xl font-bold mb-2">Upload Results Saved</h3>
  //             <p className="text-white/70">
  //               Your upload results have been saved. Continue to sign in or sign up to proceed.
  //             </p>
  //           </div>
  //         )}

  //         <div className="grid md:grid-cols-3 gap-8 mt-20">
  //           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
  //             <Camera className="w-8 h-8 text-pink-200 mb-4" />
  //             <h3 className="text-xl font-semibold text-white mb-2">Style Analysis</h3>
  //             <p className="text-white/70">Our AI analyzes your style preferences from screenshots.</p>
  //           </div>
  //           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
  //             <Users className="w-8 h-8 text-pink-200 mb-4" />
  //             <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
  //             <p className="text-white/70">Connect with people who share your aesthetic.</p>
  //           </div>
  //           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300">
  //             <Shield className="w-8 h-8 text-pink-200 mb-4" />
  //             <h3 className="text-xl font-semibold text-white mb-2">Safe & Secure</h3>
  //             <p className="text-white/70">Your privacy and security are our top priority.</p>
  //           </div>
  //         </div>
  //       </div>
  //     ) : showAuth && !showPaywall && !showInsights ? (
  //       <>
  //         {console.log('inside near')}
  //         <AuthForm />
  //       </>
  //     ) : showPaywall && !showInsights ? (
  //       <div className="container mx-auto px-4 py-20 animate-fade-in">
  //         <div className="text-center mb-16">
  //           <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-title">
  //             Choose Your Perfect Match Plan
  //           </h2>
  //           <p className="text-xl text-white/90 animate-fade-in-up">
  //             Unlock premium features and find your perfect match.
  //           </p>
  //         </div>

  //         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
  //           <div onClick={handlePlanSelection}>
  //             <PricingTier
  //               title="Basic"
  //               price="$9.99"
  //               icon={Heart}
  //               features={[
  //                 'Style Analysis',
  //                 '5 Matches per Day',
  //                 'Basic Chat Features',
  //                 'Profile Customization',
  //               ]}
  //             />
  //           </div>
  //           <div onClick={handlePlanSelection}>
  //             <PricingTier
  //               title="Premium"
  //               price="$19.99"
  //               icon={Crown}
  //               highlighted
  //               features={[
  //                 'Advanced Style Analysis',
  //                 'Unlimited Matches',
  //                 'Priority Chat Features',
  //                 'Profile Highlights',
  //                 'See Who Likes You',
  //               ]}
  //             />
  //           </div>
  //           <div onClick={handlePlanSelection}>
  //             <PricingTier
  //               title="Elite"
  //               price="$29.99"
  //               icon={Zap}
  //               features={[
  //                 'AI Style Recommendations',
  //                 'Unlimited Everything',
  //                 'Video Chat',
  //                 'Profile Boost',
  //                 'Personal Style Consultant',
  //                 'Early Access Features',
  //               ]}
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     ) : (
  //       <InsightsPage uploadResults={uploadResults} />
  //     )}

  //     <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
  //       <Sparkles
  //         className="absolute text-pink-200/30 w-8 h-8 animate-float"
  //         style={{ top: '20%', left: '10%' }}
  //       />
  //       <Sparkles
  //         className="absolute text-pink-200/30 w-6 h-6 animate-float-delayed"
  //         style={{ top: '60%', left: '80%' }}
  //       />
  //       <Sparkles
  //         className="absolute text-pink-200/30 w-10 h-10 animate-float-slow"
  //         style={{ top: '40%', left: '60%' }}
  //       />
  //       <Instagram
  //         className="absolute text-white/20 w-12 h-12 animate-float-diagonal-1"
  //         style={{ top: '15%', left: '25%' }}
  //       />
  //       <Facebook
  //         className="absolute text-white/20 w-10 h-10 animate-float-diagonal-2"
  //         style={{ top: '75%', left: '15%' }}
  //       />
  //       <Linkedin
  //         className="absolute text-white/20 w-14 h-14 animate-float-diagonal-3"
  //         style={{ top: '30%', left: '85%' }}
  //       />
  //       <Youtube
  //         className="absolute text-white/20 w-16 h-16 animate-float-diagonal-4"
  //         style={{ top: '65%', left: '70%' }}
  //       />
  //     </div>
  //   </div>
  // );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUpload />} />
      </Routes>
    </Router>
  )
}

export default App;