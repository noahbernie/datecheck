import { useSelector } from 'react-redux'
import { navigateTo } from '../../../utils/navigateHelper'
import { authUser } from '../../reducer/authSlice'
import { useDispatch } from 'react-redux'
import _ from 'lodash'

const Navbar = () => {
    const user = useSelector((state: any) => state.auth.user)
    const isAuthenticated = _.isEmpty(user) === false ? true : false

    const dispatch = useDispatch()

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        dispatch(authUser({}))
        navigateTo('/find-match')
    }

    return (
        <>
            {isAuthenticated &&
                <div className="flex justify-end p-4 space-x-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Logout
                    </button>
                </div>
            }
        </>
    )
}

export default Navbar