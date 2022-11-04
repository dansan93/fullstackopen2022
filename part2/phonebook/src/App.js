import {useEffect, useState} from 'react'
import personService from './services/persons';

const Notification = ({message, setMessage}) => {
    useEffect(() => {
        setTimeout(() => {
            if (message.type !== 'None') {
                setMessage({type: 'None', text: ''});
            }
        }, 4000);
    }, [message, setMessage]);

    if (message.type === 'None') {
        return null;
    }

    let notificationStyle = {
        border: '2px solid',
        borderRadius: 5,
        padding: 10,
        margin: 25,
        fontSize: 20
    }

    if (message.type === 'Error') {
        notificationStyle = {
            ...notificationStyle,
            borderColor: 'red',
            color: 'red'
        }
    }

    if (message.type === 'Success') {
        notificationStyle = {
            ...notificationStyle,
            borderColor: 'green',
            color: 'green'
        }
    }

    return (
        <div style={notificationStyle}>
            {message.text}
        </div>
    );
}

const Persons = ({persons, setPersons}) => {
    const deletePerson = (id) => {
        if (window.confirm('Do you really want to delete this entry?')) {
            personService.deletePerson(id)
                .then(response => {
                    setPersons(persons.filter(p => p.id !== id));
                });
        }
    }

    return persons.map(person => <Person key={person.id} person={person} deletePerson={deletePerson}/>);
}

const Person = ({person, deletePerson}) => {
    return (
        <div>
            {person.name} - {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
        </div>
    );
}

const PersonForm = (props) => {
    const persons = props.persons;
    const newName = props.newName;
    const newNumber = props.newNumber;
    const setNewName = props.setNewName;
    const setNewNumber = props.setNewNumber;
    const setPersons = props.setPersons;
    const setMessage = props.setMessage;

    const addPerson = (event) => {
        event.preventDefault();
        const newPerson = {name: newName, number: newNumber};
        const existingPerson = persons.find(p => p.name === newPerson.name);

        if (existingPerson) {
            if (window.confirm(`${existingPerson.name} already exists. Update phone number?`)) {
                personService.update({...existingPerson, number: newNumber})
                    .then(returnedPerson => {
                        setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson));
                        setNewName('');
                        setNewNumber('');
                        setMessage({type: 'Success', text: `Updated ${returnedPerson.name}`});
                    })
                    .catch(error => {
                        setMessage({type: 'Error', text: `Error: Entry ${existingPerson.name} has already been removed.`});
                        setPersons(persons.filter(p => p.id !== existingPerson.id));
                        setNewName('');
                        setNewNumber('');
                    });
            }
        } else {
            personService.create(newPerson)
                .then(response => {
                    setPersons([...persons, response]);
                    setNewName('');
                    setNewNumber('');
                    setMessage({type: 'Success', text: `Added ${response.name}`});
                });
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    }
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    }

    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input value={newName} onChange={handleNameChange}/>
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumberChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
}

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [message, setMessage] = useState({type: 'None', text: ''});

    useEffect(() => {
        personService.getAll()
            .then(response => setPersons(response));
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message} setMessage={setMessage}/>

            <div>filter shown with <input value={filter} onChange={handleFilterChange}/></div>

            <h2>Add a new number</h2>
            <PersonForm persons={persons} newName={newName} newNumber={newNumber}
                        setPersons={setPersons} setNewName={setNewName} setNewNumber={setNewNumber}
                        setMessage={setMessage}/>

            <h2>Numbers</h2>
            <Persons persons={persons.filter(person =>
                person.name.toLowerCase().includes(filter.toLowerCase()))}
                     setPersons={setPersons} setMessage={setMessage}/>
        </div>
    );
}

export default App;