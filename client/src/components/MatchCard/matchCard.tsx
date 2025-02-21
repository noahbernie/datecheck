import React from 'react'

interface MatchCardProps {
    platform: string;
    username: string;
    matchPercentage: number;
    profileImage: string;
    icon: React.ElementType;
    children?: React.ReactNode;
}

const MatchCard = (props: MatchCardProps) => {
    const { platform, username, matchPercentage, profileImage, icon: Icon, children } = props

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:transform hover:scale-102 transition-all duration-300">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={profileImage}
                        alt={username}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <Icon className="absolute -bottom-1 -right-1 w-6 h-6 text-pink-300 bg-white/10 backdrop-blur-lg rounded-full p-1" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">{username}</h3>
                        <span className="text-pink-300 font-bold">{matchPercentage}% Match</span>
                    </div>
                    <p className="text-white/70">{platform}</p>
                </div>
            </div>
            <div className="mt-4">{children}</div>
        </div>
    )
}

export default MatchCard