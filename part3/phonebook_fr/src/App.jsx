import { useState, useEffect } from 'react';
import axios from 'axios';
import personService from './services/persons';

const Person = ({ person, onDelete }) => (
  <li>
    {person.name} {person.number} 
    <button onClick={() => onDelete(person.id)}>delete</button>
  </li>
);

const PersonForm = ({ onSubmit, newName, setNewName, newNumber, setNewNumber }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      <br/>
      number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Filter = ({ searchTerm, setSearchTerm }) => (
  <div>
    filter shown with: <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
  </div>
);

const Notification = ({ message, type }) => {
  if (!message) return null;

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    border: `3px solid ${type === 'error' ? 'red' : 'green'}`,
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  return <div style={notificationStyle}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName);
        const updatedPerson = { ...person, number: newNumber };
        
        personService
          .update(person.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== person.id ? p : response.data));
            setNewName('');
            setNewNumber('');
            setNotification({ message: `Updated ${newName}'s number`, type: 'success' });
            setTimeout(() => {
              setNotification({ message: '', type: '' });
            }, 5000);
          })
          .catch(error => {
            alert(`Information of ${newName} has already been removed from server`);
            setPersons(persons.filter(p => p.id !== person.id));
          });
          }
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    personService
      .create(newPerson)
      .then(response => {
      setPersons([...persons, response.data]);
      setNewName('');
      setNewNumber('');
      setNotification({ message: `Added ${newName}`, type: 'success' });
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotification({ message: `Deleted person`, type: 'success' });
          setTimeout(() => {
            setNotification({ message: '', type: '' });
          }, 5000);
        })
        .catch(error => {
          alert("This person was already removed from the server");
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  };

  useEffect(() => {
      const eventHandler = response => {
        setPersons(response.data)
      }

      personService.getAll().then(eventHandler)
    }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <PersonForm
        onSubmit={handleSubmit}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Filter</h2>
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h2>Numbers</h2>
      <Notification message={notification.message} type={notification.type} />
      <ul>
        {filteredPersons.map(person => (
          <Person key={person.id} person={person} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  )
}

export default App