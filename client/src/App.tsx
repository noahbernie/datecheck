import { useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import ImageUpload from './components/imageUpload/ImageUpload'
import Register from "./components/Auth/Register"
import Login from "./components/Auth/Login";
import store from './reducer/store'
import setAuthToken from '../utils/authToken'
import { getCurrentUserDetails } from '../actions/auth/authAction'
import InsightsPage from "./components/InsightsPage/insightPage"
import Subscription from "./components/Pricing/Subscriptio"
import PageNotFound from "./components/PageNotFound/PageNotFound"
import { setNavigate } from '../utils/navigateHelper'
import Navbar from './components/Navbar/Navbar'

// Check for authToken in localStorage
if (localStorage.authToken) {
  const decoded = jwtDecode(localStorage.authToken) // Decode token

  const currentTime = Date.now() / 1000

  if (decoded.exp < currentTime) {
    // Logout user logic
    // store.dispatch(logoutUser())
  } else {
    setAuthToken(localStorage.authToken) // Set auth token in headers

    // Set user and isAuthenticated
    // store.dispatch(setCurrentUser(decoded))

    // Fetch user details
    store.dispatch(getCurrentUserDetails())
  }
}

function App() {

  const navigate = useNavigate()

  useEffect(() => {
    setNavigate(navigate) // Store navigate globally
  }, [navigate])

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/find-match" replace />} />
          <Route path="/find-match" element={<ImageUpload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/insight" element={<InsightsPage />} />
          <Route path="/subscribe" element={<Subscription />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Provider>
  )
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
)

export default AppWithRouter
