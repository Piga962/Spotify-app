import React, { useState } from "react";
//ximport { Link } from 'react-router-dom';
import { fetchSpotifyApi } from "../api/spotifyAPI";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { authFLow, getDataAuth } from "../setup";
import "../setup"


const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const newValues = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(newValues);
  };

  // const handleLogIn = async () => {

  //   const client_id = 'your_client_id';
  //   const client_secret = 'your_client_secret';
  //   const url = 'https://accounts.spotify.com/api/token';
  //   const body = 'grant_type=client_credentials';
  //   const token = 'Basic ' + btoa(client_id + ':' + client_secret);
    
  //   const response = await fetchSpotifyApi(
  //     url,
  //     'POST',
  //     body,
  //     'application/x-www-form-urlencoded',
  //     token
  //   );
    
  //   navigate('/dashboard');
  //   localStorage.setItem('token', response.access_token);
  //   console.log(response);
    
  // };

  const handleLogIn = async (e) => {
    e.preventDefault();

    const codeChallengeProm = await getDataAuth();
    authFLow(codeChallengeProm);
    
    // console.log("handleLogIn");
    // const clientId = "ad8dcf6615b64d11acd02379b00cc50a";
    // const clientSecret = "c78be57b56214d7082a39ba143787bf6";

    // const url = "https://accounts.spotify.com/api/token";
    // const body = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
    // const token = "Basic " + btoa(clientId + ":" + clientSecret);

    // try {
    //     const response = await fetchSpotifyApi(
    //       url,
    //       "POST",
    //       body,
    //       "application/x-www-form-urlencoded",
    //       token
    //     );
        
    //     navigate('/');
    //     localStorage.setItem("token", response.access_token);
    //     console.log(response);
    //   } catch (error) {
    //     console.error("Error fetching Spotify API:", error.message);
    //     // Handle error appropriately, such as displaying an error message to the user
    //   }  
    };

  return (
    <div className="register-container">
      <form className="register-form">
        <h2>Penify</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleOnChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleOnChange}
          autoComplete="current-password"
        />
        <button type="submit" onClick={handleLogIn}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
