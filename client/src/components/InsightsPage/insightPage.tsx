import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../reducer/store' // Adjust the path to your store file
import { Sparkles, Instagram, Linkedin, Facebook, Youtube, ArrowRight } from 'lucide-react'
import _ from 'lodash'
import MatchCard from '../MatchCard/matchCard'
import {
    getImageResult,
    filterResults,
    preparedDisplayData,
    storeUserFaceMatches,
    getUserFaceImageMatches
} from '../../../actions/auth/userFaceMatchesAction'
import { setUserFaceMatches, setUserImageFilePath } from '../../reducer/userImageFaceMatches'
import { navigateTo } from '../../../utils/navigateHelper'

const InsightsPage = () => {
    const [loading, setLoading] = useState(false)
    const [uploadImageError, setImageError] = useState('')
    const dispatch: AppDispatch = useDispatch()
    const userImageResult = useSelector((state: any) => state.userFaceMatches)
    const userFaceImagePath = userImageResult.imageFilePath
    const uploadResults = userImageResult.userFaceMatches
    const authUser = useSelector((state: any) => state.auth.user)
    const isFirstRender = useRef(true)


    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        const fetchData = async () => {
            try {
                setLoading(true)
                const imageResult = await dispatch(getImageResult(userFaceImagePath))

                if (imageResult.data.success === 0) {
                    let errorMessage = imageResult.message
                    throw new Error(errorMessage || 'Failed to get image result');
                }

                const filterData = await dispatch(filterResults(imageResult.data.results))

                if (filterData.data.success === 0) {
                    let errorMessage = filterData.message
                    throw new Error(errorMessage || 'Failed to filter results')
                }

                const preparedData = await dispatch(preparedDisplayData(filterData))

                if (preparedData.success === 0) {
                    let errorMessage = preparedData.message
                    throw new Error(errorMessage || 'Failed to prepare display data');
                }
                await dispatch(storeUserFaceMatches(preparedData.data.display_data, authUser.userId))
                dispatch(setUserFaceMatches(preparedData.data.display_data))
                dispatch(setUserImageFilePath(''))
                setLoading(false)
            } catch (error) {
                setImageError(
                    error instanceof Error ? error.message : 'Service Unavailable. Please contact admin.'
                )
            } finally {
                setLoading(false)
            }
        }
        if (_.isEmpty(userFaceImagePath) === false) {
            fetchData()
        }
    }, [])

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const res = await dispatch(getUserFaceImageMatches())
                dispatch(setUserFaceMatches(res.data))
                if (res.data.length === 0) {
                    navigateTo('/find-match')
                }
            } catch (error) {
                setImageError(error instanceof Error ? error.message : 'Error while find image data')
            } finally {
            }
        }
        if (_.isEmpty(authUser) === false) {
            fetchImageData()
        } else {
            navigateTo('/find-match')
        }
    }, [authUser])

    return (
        <div className="container mx-auto px-4 py-20 animate-fade-in">
            <div className="text-center mb-16">
                <div className="inline-block p-3 rounded-full bg-pink-500/20 backdrop-blur-lg mb-6">
                    <Sparkles className="w-10 h-10 text-pink-300" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-title">
                    Your Style Matches
                </h2>
                <p className="text-xl text-white/90 animate-fade-in-up max-w-2xl mx-auto">
                    Based on your style preferences, we've found these profiles that match your aesthetic.
                    Connect with like-minded individuals across different platforms.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {uploadResults && uploadResults.length > 0 ? (
                    uploadResults.map((result: any, index: number) => (
                        <MatchCard
                            key={index}
                            platform={result.platform}
                            username={result.username}
                            matchPercentage={result.score}
                            profileImage={result.profilePhoto}
                            icon={
                                result.platform.toLowerCase() === 'instagram'
                                    ? Instagram
                                    : result.platform.toLowerCase() === 'linkedin'
                                        ? Linkedin
                                        : result.platform.toLowerCase() === 'facebook'
                                            ? Facebook
                                            : result.platform.toLowerCase() === 'twitter'
                                                ? Youtube // Replace with Twitter/X icon
                                                : Sparkles // Default icon
                            }
                        >
                            <button
                                onClick={() => window.open(result.profileUrl, '_blank', 'noopener,noreferrer')}
                                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors mt-4"
                            >
                                <span>View Profile</span>
                            </button>
                        </MatchCard>
                    ))
                ) : (
                    <p className="text-center text-white/70">
                        No style matches found yet. Upload a screenshot to see matches.
                    </p>
                )}
            </div>

            {uploadResults && uploadResults.length > 0 && (
                <div className="mt-12 text-center">
                    <p className="text-white/70 mb-6">Want to see more matches?</p>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center group">
                        Explore More Matches
                        <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default InsightsPage
