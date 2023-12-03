// Import the necessary components
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import Cookies from 'js-cookie';
import Signup from './components/SignupForm';

// ...

const App = () => {
  // Check if the user is authenticated based on the presence of the token
  const isAuthenticated = !!Cookies.get('token');

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path='/login'
            element={isAuthenticated ? <Navigate to='/task' /> : <Login />}
          />
          <Route
            path='/task'
            element={isAuthenticated ? <TaskForm /> : <Navigate to='/login' />}
          />
          {/* Add additional routes as needed */}
          <Route path='*' element={<Navigate to='/login' />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
