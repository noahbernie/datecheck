import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import ImageUpload from './components/imageUpload/ImageUpload'
import store from './reducer/store'
import setAuthToken from '../utils/authToken'
import { getCurrentUserDetails } from '../actions/auth/authAction'

// Check for authToken in localStorage
if (localStorage.authToken) {
  const decoded = jwtDecode(localStorage.authToken) // Decode token
  console.log(decoded)

  const currentTime = Date.now() / 1000
  console.log(decoded.exp < currentTime)

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
          <Route path="/" element={<ImageUpload />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;