// TaskForm.js

import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const TaskForm = () => {
  const [time, setTime] = useState('');
  const [url, setUrl] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [headers, setHeaders] = useState('');
  const [token, setToken] = useState('');
  const [maxRetries, setMaxRetries] = useState('');

  const handleScheduleTask = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5002/api/tasks/schedule',
        {
          time,
          url,
          requestBody,
          headers,
          token:Cookies.get('token'),
          maxRetries,
        },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      );

    } catch (error) {
      console.error('Error scheduling task:', error);
    }
  };

  return (
    <div>
      <h2>Schedule Task</h2>
      <div>
        <label>
          Time:
          <input
            type='datetime-local'
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <br />
        <label>
          URL:
          <input
            type='text'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <br />
        <label>
          Request Body:
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
          />
        </label>
        <br />
        <label>
          Headers:
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
          />
        </label>
        <br />
        <label>
          Token:
          <input
            type='text'
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </label>
        <br />
        <label>
          Max Retries:
          <input
            type='number'
            value={maxRetries}
            onChange={(e) => setMaxRetries(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleScheduleTask}>Schedule Task</button>
      </div>
    </div>
  );
};

export default TaskForm;
