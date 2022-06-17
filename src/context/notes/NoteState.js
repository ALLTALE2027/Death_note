import React from "react";
import { useState } from "react";

import NoteContext from "./NoteContext";

const NoteState = (props) => {
  // const user = { name: "DD" };

  // const [state, setState] = useState(user);

  //update is a fn which is changing state after 1 min

  // const update = () => {
  //   setTimeout(() => {
  //     setState({ name: "DD@11" });
  //   }, 1000);
  // };

  const host = "http://localhost:5000";

  const note = [];

  const [notes, setNotes] = useState(note);

  //Fetch  notes
  const getNote = async () => {
    // api call to backend
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    //frontend
    const json = await response.json();
    setNotes(json);
  };

  //Add a note
  const addNote = async (title, description, tag) => {
    //for api call to backend
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const note_new = await response.json();

    //frontend

    setNotes(notes.concat(note_new));
  };

  //Delete a note
  const deleteNote = async (id) => {
    //api for delete
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    console.log(json);

    console.log(id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //api to update note
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const json = await response.json();

    //frontend edit note

    let eNote = JSON.parse(JSON.stringify(notes));

    for (let i = 0; i < eNote.length; i++) {
      const element = eNote[i];
      if (element._id === id) {
        eNote[i].title = title;
        eNote[i].description = description;
        eNote[i].tag = tag;

        break;
      }
    }
    setNotes(eNote);
  };

  return (
    // <NoteContext.Provider value={{ state, update }}>
    //   {props.children}
    // </NoteContext.Provider>

    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
