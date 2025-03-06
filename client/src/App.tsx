import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import ImageUpload from './components/imageUpload/ImageUpload'
import Register from "./components/Auth/Register"
import Login from "./components/Auth/Login";
import store from './reducer/store'
import setAuthToken from '../utils/authToken'
import { getCurrentUserDetails } from '../actions/auth/authAction'
import InsightsPage from "./components/InsightsPage/insightPage"
import Subscription from "./components/Pricing/Subscriptio"
import PageNotFound from "./components/PageNotFound/PageNotFound";

// Check for authToken in localStorage
if (localStorage.authToken) {
  const decoded = jwtDecode(localStorage.authToken) // Decode token
  console.log(decoded)

  const currentTime = Date.now() / 1000

  if (decoded.exp < currentTime) {
    console.log('Token expired. Logging out user...')
    // Logout user logic
    // store.dispatch(logoutUser())
  } else {
    console.log('here', localStorage.authToken)
    setAuthToken(localStorage.authToken) // Set auth token in headers
    console.log('here to set data to localstorage')

    // Set user and isAuthenticated
    // store.dispatch(setCurrentUser(decoded))

    // Fetch user details
    store.dispatch(getCurrentUserDetails())
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/find-match" replace />} />
          <Route path="/find-match" element={<ImageUpload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/insight" element={<InsightsPage />} />
          <Route path="/subscribe" element={<Subscription />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;