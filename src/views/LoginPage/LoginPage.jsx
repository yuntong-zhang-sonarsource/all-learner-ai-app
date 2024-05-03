import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS file for styling
import axios from 'axios';
import config from "../../utils/urlConstants.json";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    localStorage.clear();
    e.preventDefault();
    // Add your login logic here
    console.log('Username:', username);
    console.log('Password:', password);
    const usernameDetails = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}&password=${password}`
        );
    // For demonstration purposes, let's assume the login is successful
    // and redirect to '/discover-start'

    if (usernameDetails?.data.virtualID){
        localStorage.setItem("profileName", username);
        localStorage.setItem(
            "virtualId",
            usernameDetails?.data?.virtualID
          );
        window.location.href = '/discover-start';
    }else{
        alert("Enter correct username and password")
    }
    
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
