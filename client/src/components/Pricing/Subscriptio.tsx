import {
    Heart,
    Crown,
    Zap
} from 'lucide-react'
import PricingTier from './PricingTier'

const Subscription = () => {

    const handlePlanSelection = () => {
        // setShowPaywall(false)
    }

    return (
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
    )
}

export default Subscription