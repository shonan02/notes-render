const Note = ({ note, toggle }) => {
  const label = note.important ? 'make important' : 'not important';
    return (
      
      <li className="note">{note.content}<button onClick={toggle}>{label}</button></li>
    )
  }


export default Note;