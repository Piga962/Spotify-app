import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import React from 'react';
import './Dashboard.css';
import { fetchSpotifyApi } from "../api/spotifyAPI";

const Dashboard = () => {

    const clientId = "ad8dcf6615b64d11acd02379b00cc50a";
    const clientSecret = "c78be57b56214d7082a39ba143787bf6";
    const token = "Basic " + btoa(clientId + ":" + clientSecret);

    const [recentTracks, setRecentTracks] = useState([]);
    
    //useEffect(() => {
      //  fetchSpotifyApi("https://api.spotify.com/v1/me/player/recently-played?limit=5", "GET", null, "application/json", token)
        //.then(data => setRecentTracks(data.items));
    //}, []);

    useEffect(() => {
        // Replace these with your actual client ID, redirect URI, and scopes
        const clientId = "ad8dcf6615b64d11acd02379b00cc50a";
        const redirectUri = "http://localhost:5173/dashboard";
        const scopes = "user-read-recently-played user-modify-playback-state";

        // Check if there's an access token in the URL
        const hash = window.location.hash
            .substring(1)
            .split('&')
            .reduce((initial, item) => {
                let parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
                return initial;
            }, {});
        window.location.hash = "";

        let token = localStorage.getItem("spotifyToken");

        // If there's no access token, redirect to the Spotify authorization page
        if(!token) {
            if (!hash.access_token) {
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;
            } else {
                localStorage.setItem('spotifyToken', hash.access_token);
            token = hash.access_token;
            }
        }
            // If there's an access token, use it to fetch the recently played tracks
            fetchSpotifyApi(
                "https://api.spotify.com/v1/me/player/recently-played?limit=5",
                "GET",
                null,
                "application/json",
                `Bearer ${token}`
            )
            .then(data => setRecentTracks(data.items))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Recently Played Tracks</h1>

            <section id="profile">
                <h2>Logged in as <span id="displayName"></span></h2>
                <span id="avatar"></span>
                <ul>
                    <li>User ID: <span id="id"></span></li>
                    <li>Email: <span id="email"></span></li>
                    <li>Spotify URI: <a id="uri" href="#"></a></li>
                    <li>Link: <a id="url" href="#"></a></li>
                    <li>Profile Image: <span id="imgUrl"></span></li>
                </ul>
            </section>

            {recentTracks.map((track,index) => (
                <p key={index}>{track.track.name} by {track.track.artists[0].name}</p>
            ))}
        </div>
    )

}

export default Dashboard;