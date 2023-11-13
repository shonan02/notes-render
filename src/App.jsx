import { useState, useEffect} from 'react'
import './App.css'
import noteService from './services/notes';
import Note from './components/Note';
import Notification from './components/Notification';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState(
    'a new note...'
  );
  const [showAll, setShowAll] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    noteService
    .getAll()
    .then(res => {
      setNotes(res);
    })
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    console.log('button clicked', event.target);
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }

    noteService
      .create(noteObject)
      .then(res =>{
        setNotes(notes.concat(res));
        setNewNote('');
      })

  }

  const handleNoteChange = (e) => {
    console.log(e.target.value);
    setNewNote(e.target.value);
  }

  const toggle = (id) => {
    console.log("importance of " + id + " needs to be changed");
    const note = notes.find(n => n.id === id);
    const changedNote = {...note, important: !note.important};

    noteService
      .update(id, changedNote)
      .then(res => {
        setNotes(notes.map(note => note.id !== id ? note : res));
      })
      .catch(error => {
        setError(
          `Note ${note.content} was already removed from server`
        );
        setTimeout(() => {
          setError(null);
        }, 5000);
        setNotes(notes.filter(n => n.id !== id));
      })
  }

  const notesToShow = showAll ? notes : notes.filter(
    note => note.important === true
  );

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={error} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
      { notesToShow.map(note => 
        <Note key={note.id} note={note} toggle={() => toggle(note.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App
