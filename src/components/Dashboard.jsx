import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import React from 'react';
import './Dashboard.css';
import { fetchSpotifyApi } from "../api/spotifyAPI";

const Dashboard = () => {

    const clientId = "ad8dcf6615b64d11acd02379b00cc50a";
    const clientSecret = "c78be57b56214d7082a39ba143787bf6";
    const redirectUri = "http://localhost:5173/dashboard";
    const scopes = [
        'user-read-private', 
        'user-read-email', 
        'user-read-recently-played', 
        'user-modify-playback-state'
    ].join(' ');

    useEffect(() => {
        // Replace these with your actual client ID, redirect URI, and scopes
        
        const clientId = "ad8dcf6615b64d11acd02379b00cc50a";
        const redirectUri = "http://localhost:5173/dashboard";
        const scopes = [
            'user-read-private', 
            'user-read-email', 
            'user-read-recently-played', 
            'user-modify-playback-state'
        ].join(' ');
        
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token&show_dialog=true`;
        
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

        let token = localStorage.getItem("token");

        if (!token && hash.access_token) {
            localStorage.setItem('token', hash.access_token);
            token = hash.access_token;
        }

        // If there's no access token, redirect to the Spotify authorization page
        if(!token) {
            if (!hash.access_token) {
                window.location.href = authUrl;
            } else {
                fetchData(token);
                localStorage.setItem('token', hash.access_token);
                token = hash.access_token;
            }
        }
            // If there's an access token, use it to fetch the recently played tracks
            fetchSpotifyApi(
                "https://api.spotify.com/v1/me/player/recently-played   ",
                "GET",
                null,
                "application/json",
                `Bearer ${token}`
            )
            .then(data => setRecentTracks(data.items))
            .catch(error => console.error(error));
    }, []);



    const [recentTracks, setRecentTracks] = useState([]);
    const [userData, setUserData] = useState(null);
        
    const [type, setType] = useState('');
    const [results, setResults] = useState([]);
    const [option, setOption] = useState('');

    const types = ["album", "artist", "playlist", "track", "show", "episode", "audiobook"];

    const [form, setForm] = useState({
        search: '',
        artist: '',
    })

    const handleChange = (e) => {
        console.log(e.target.value);
        const newValues = {
            ...form,
            [e.target.name]: e.target.value,
        }
        console.log(newValues);
        setForm(newValues);
    };

    const handleSelectChange = (e) => {
        console.log(e.target.value);
        setOption(e.target.value);
    }

    const handleSearch = async () => {

        const params = new URLSearchParams();

        params.append('q', encodeURIComponent(`remaster track:${form.search} artist:${form.artist}`));
        params.append('type', option);

        const queryString = params.toString();
        const url = "https://api.spotify.com/v1/search"
        const token = `Bearer ${localStorage.getItem('token')}`;

        const updateUrl = `${url}?${queryString}`;

        const response = await fetchSpotifyApi(
            updateUrl,
            'GET',
            null,
            'application/json',
            token
            );
            console.log(response);
            setResults(response.tracks.items);
    };

    const handleGetToken = async () => {
        // stored in the previous step
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');
        let codeVerifier = localStorage.getItem('code_verifier');
        console.log({ codeVerifier });
        const url = 'https://accounts.spotify.com/api/token';
        const clientId = 'ad8dcf6615b64d11acd02379b00cc50a';
        const redirectUri = 'http://localhost:5173/dashboard';
        const payload = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
              }),
            };
        
        const body = await fetch(url, payload);
        const response = await body.json();
        
        localStorage.setItem('token', response.access_token);
    };

    const getDeviceId = async () => {

        const token = `Bearer ${localStorage.getItem('token')}`;
        const response = await fetchSpotifyApi(
            'https://api.spotify.com/v1/me/player/devices',
            'GET',
            null,
            'application/json',
            token
        );
        console.log(response);
        return response.devices.id;
    }

    const handlePlayMusic = async (song) => {
        const token = `Bearer ${localStorage.getItem('token')}`;
        const data = {
          uris: [song.uri],
        };
        

        const id_device = "cfabedbea9cdf7e137e13e7e535ac5ef34dc45cc";
        //const id_device = getDeviceId();
        //console.log(id_device);
        const playSong = await fetchSpotifyApi(
          `https://api.spotify.com/v1/me/player/play?device_id=${id_device}`,
            'PUT',
            JSON.stringify(data),
              'application/json',
              token
            );
            console.log(playSong);
    };

    return (

        <div className="container">
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

            <div>
                <button onClick={handleGetToken}>GetToken</button>
                <button onClick={getDeviceId}>GetDeviceId</button>
            </div>

            <input className="input" placeholder='Search for music' type='text' name='search' value ={form.search} onChange={handleChange}/>

            <div>
                <p>Types</p>
                <select name="types" onChange={handleSelectChange}>
                    <option value="valor1">Valor 1</option>
                    {types.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <input className="input" placeholder='Artist' type='text' name='artist' value={form.artist} onChange={handleChange}/>
            </div>

            <div>
                <button className="button" onClick={handleSearch}>Search</button>
            </div>

            <div>
                {results.length > 0 && (
                    <div>
                        {results.map((item, idx) => (
                            <div className="result-item" key = {item.id}>
                                <img src={item.album.images[0].url}/>
                                {idx +1+' ' + item.name}
                                <button className="button" onClick={() => handlePlayMusic(item)}>
                                    Play
                                </button>
                            </div>
                        ))}
                    </div>
                )

                }
            </div>
            
        </div>
    )

}

export default Dashboard;