const express = require('express');
const app = express();

app.use(express.static('build'));

const cors = require('cors');
app.use(cors());

app.use(express.json());

const morgan = require('morgan');
morgan.token('json-body', (request, response) =>  'request body: ' + JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :json-body'));

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/info', (request, response) => {
    const text = `<div>Phonebook has info for ${persons.length} people.</div><div>${new Date()}</div>`;
    response.send(text);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const toBeDeleted = persons.find(p => p.id === id);

    if (toBeDeleted) {
        persons = persons.filter(p => p.id !== id);
        response.status(204).end();
    } else {
        response.status(404).end();
    }
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'Name missing'
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'Number missing'
        });
    }

    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: `Entry for ${body.name} already exists`
        });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);
    response.json(person);
});

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT);