import {useState} from 'react'

const StatisticLine = ({text, value}) => <tr>
    <td>{text}</td>
    <td>{value}</td>
</tr>;

const Statistics = ({good, neutral, bad}) => {
    const all = good + bad + neutral;

    if (all === 0) {
        return <div>no feedback given</div>
    }

    const average = (good - bad) / all;
    const positive = good / all;

    return (
        <table>
            <tbody>
            <StatisticLine text="good" value={good}/>
            <StatisticLine text="neutral" value={neutral}/>
            <StatisticLine text="bad" value={bad}/>
            <StatisticLine text="all" value={all}/>
            <StatisticLine text="average" value={average}/>
            <StatisticLine text="positive" value={positive}/>
            </tbody>
        </table>
    );
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const handleGoodClick = () => setGood(good + 1);
    const handleNeutralClick = () => setNeutral(neutral + 1);
    const handleBadClick = () => setBad(bad + 1);


    return (
        <div>
            <h1>give feedback</h1>
            <button onClick={handleGoodClick}>good</button>
            <button onClick={handleNeutralClick}>neutral</button>
            <button onClick={handleBadClick}>bad</button>

            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad}/>
        </div>
    );
}

export default App;