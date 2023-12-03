// Login.js

import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5002/api/auth/login',
        {
          email,
          password,
        }
      );

      const { token } = response.data;

      // Store the token in cookies
      Cookies.set('token', token, { path: '/' });

      // Redirect to the task scheduling page
      window.location.href = '/task';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>
          Username:
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
