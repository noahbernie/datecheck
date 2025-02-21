import { Check } from 'lucide-react'
import React from 'react'

const PricingTier = (props: any) => {
    const { title, price, features, icon: Icon, highlighted = false } = props
    return (
        <div
            className={`relative p-8 rounded-2xl backdrop-blur-lg transition-all duration-500 ${highlighted
                ? 'bg-gradient-to-b from-pink-500/90 to-purple-600/90 transform hover:scale-105 hover:shadow-xl'
                : 'bg-white/10 hover:bg-white/20 transform hover:scale-102'
                }`}
        >
            {highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-300 text-pink-800 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                </div>
            )}
            <Icon className={`w-12 h-12 mb-6 ${highlighted ? 'text-pink-200' : 'text-white/70'}`} />
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <div className="mb-6">
                <span className="text-4xl font-bold text-white">{price}</span>
                <span className="text-white/70">/month</span>
            </div>
            <ul className="space-y-4">
                {features.map((feature: any, index: number) => (
                    <li key={index} className="flex items-center text-white/90">
                        <Check className="w-5 h-5 mr-3 text-pink-300" />
                        {feature}
                    </li>
                ))}
            </ul>
            <button
                className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${highlighted
                    ? 'bg-pink-300 text-pink-900 hover:bg-pink-200'
                    : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
            >
                Get Started
            </button>
        </div>
    )
}

export default PricingTier