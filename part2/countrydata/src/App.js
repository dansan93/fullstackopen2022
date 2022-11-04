import {useEffect, useState} from "react";
import axios from "axios";

const Match = ({match}) => {
    const api_key = process.env.REACT_APP_API_KEY;
    const [weather, setWeather] = useState({});

    useEffect(() => {
        const [lat, lng] = match.capitalInfo.latlng;
        const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lng}&appid=${api_key}`;

        axios.get(url)
            .then(response => {
                setWeather(response.data);
            });
    }, []);

    return (
        <div>
            <h1>{match.name.common}</h1>
            <div>capital: {match.capital[0]}</div>
            <div>area: {match.area}</div>

            <h2>languages</h2>
            <ul>
                {Object.values(match.languages).map(language => {
                    return (
                        <li key={language}>
                            {language}
                        </li>
                    );
                })}
            </ul>
            <img src={match.flags.svg} alt="flag" height="150px"/>

            <h2>Weather in {match.capital[0]}</h2>
            <div>temperature: {weather.main.temp} celsius</div>
            <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                 alt="weather icon"/>
            <div>wind: {weather.wind.speed} m/s</div>
        </div>
    );
}

const Candidates = ({candidates, setCandidates}) => {

    const handleClick = (candidate) => {
        setCandidates([candidate]);
    };

    return (
        <div>
            {candidates.map(candidate =>
                <div key={candidate.cca2}>
                    {candidate.name.common}
                    <button onClick={() => handleClick(candidate)}>show</button>
                </div>
            )}
        </div>
    );
}

const Filtered = ({candidates, setCandidates}) => {
    if (candidates.length > 10) {
        return <div>Too many matches, please specify another filter</div>;
    }

    if (candidates.length === 1) {
        const match = candidates[0];
        return <Match match={match}/>
    }

    return <Candidates candidates={candidates} setCandidates={setCandidates}/>;
}

const App = () => {
    const [inputVal, setInputVal] = useState('');
    const [candidates, setCandidates] = useState([]);

    const handleInput = (event) => {
        const input = event.target.value;
        setInputVal(input);

        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                const filtered = response.data.filter(obj =>
                    obj.name.common.toLowerCase().includes(input.toLowerCase()));
                setCandidates(filtered);
            });
    };

    return (
        <div className="App">
            find countries <input value={inputVal} onChange={handleInput}/>

            <Filtered candidates={candidates} setCandidates={setCandidates}/>
        </div>

    );
}

export default App;
