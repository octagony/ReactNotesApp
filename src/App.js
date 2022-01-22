import { db } from "./firebase.config";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    subdesc: [],
    label: [],
  });
  const [popupActive, setPopupActive] = useState(false);
  const notesCollectionRef = collection(db, "notes");

  useEffect(() => {
    onSnapshot(notesCollectionRef, (snapshot) => {
      setNotes(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            viewing: false,
            ...doc.data(),
          };
        })
      );
    });
  }, []);

  const handleView = (id) => {
    const notesClone = [...notes];

    notesClone.forEach((note) => {
      if (note.id === id) {
        note.viewing = !note.viewing;
      } else {
        note.viewing = false;
      }
    });
    setNotes(notesClone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.desc || !form.subdesc || !form.label) {
      alert("Please fill out all fields");
      return;
    }
    addDoc(notesCollectionRef, form);

    setForm({
      title: "",
      desc: "",
      subdesc: [],
      label: [],
    });

    setPopupActive(false);
  };

  const handleNote = (e, i) => {
    const notesClone = [...form.subdesc];

    notesClone[i] = e.target.value;

    setForm({
      ...form,
      subdesc: notesClone,
    });
  };

  const handleLabel = (e, i) => {
    const labelClone = [...form.label];

    labelClone[i] = e.target.value;

    setForm({
      ...form,
      label: labelClone,
    });
  };

  const handleExtraCount = () => {
    setForm({
      ...form,
      subdesc: [...form.subdesc, ""],
    });
  };

  const handleLabelCount = () => {
    setForm({
      ...form,
      label: [...form.label, ""],
    });
  };

  const removeNote = (id) => {
    deleteDoc(doc(db, "notes", id));
  };

  return (
    <div className="App">
      <h1>My Notes</h1>

      <button onClick={() => setPopupActive(!popupActive)}>Add New Note</button>

      <div className="recipes">
        {notes.map((note, i) => (
          <div className="recipe" key={note.id}>
            <h3> {note.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: note.desc }}></p>

            {note.viewing && (
              <div>
                <h4>Other info</h4>
                <ul>
                  {note.subdesc.map((submes, i) => (
                    <li key={i}>{submes}</li>
                  ))}
                </ul>

                <h4>Labels</h4>
                <ol>
                  {note.label.map((lab, i) => (
                    <li key={i}>{lab}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="buttons">
              <button onClick={() => handleView(note.id)}>
                View {note.viewing ? "less" : "more"}
              </button>
              <button className="remove" onClick={() => removeNote(note.id)}>
                Delete Note
              </button>
            </div>
          </div>
        ))}
      </div>

      {popupActive && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add a new note</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  type="text"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Extra Information</label>
                {form.subdesc.map((submes, i) => (
                  <input
                    type="text"
                    key={i}
                    value={submes}
                    onChange={(e) => handleNote(e, i)}
                  />
                ))}
                <button type="button" onClick={handleExtraCount}>
                  Add some important
                </button>
              </div>

              <div className="form-group">
                <label>Add label to note</label>
                {form.label.map((label, i) => (
                  <input
                    type="text"
                    key={i}
                    value={label}
                    onChange={(e) => handleLabel(e, i)}
                  />
                ))}
                <button type="button" onClick={handleLabelCount}>
                  Add new label
                </button>
              </div>
              <div className="buttons">
                <button type="submit">Add to my list</button>
                <button
                  type="button"
                  className="remove"
                  onClick={() => setPopupActive(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
