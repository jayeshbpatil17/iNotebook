import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  //understaing the useContext
  //   const s1 = {
  //     name: "jayesh",
  //     class: "12th",
  //   };

  //   const [state, setState] = useState(s1);

  //   const update = () => {
  //     setTimeout(() => {
  //       setState({
  //         name: "Patil",
  //         class: "10th",
  //       });
  //     }, 1000);
  //   };

  const initialNotes = [
    {
      _id: "6489b928b59553ad9f82deeb",
      user: "648988acc4cf1ed9f8c48727",
      title: "Addign a New note",
      description: "Please access the playlist",
      tag: "Personal",
      date: "2023-06-14T12:57:12.082Z",
      __v: 0,
    },
    {
      _id: "6489b928b59553ad9f82deed",
      user: "648988acc4cf1ed9f8c48727",
      title: "Addign a New note",
      description: "Please access the playlist",
      tag: "Personal",
      date: "2023-06-14T12:57:12.273Z",
      __v: 0,
    },
    {
      _id: "6489b928b59553ad9f82deef",
      user: "648988acc4cf1ed9f8c48727",
      title: "Addign a New note",
      description: "Please access the playlist",
      tag: "Personal",
      date: "2023-06-14T12:57:12.440Z",
      __v: 0,
    },
    {
      _id: "6489bcbb608dfbcecac3f874",
      user: "648988acc4cf1ed9f8c48727",
      title: "Addign a New note",
      description: "Please access the playlist",
      tag: "Personal",
      date: "2023-06-14T13:12:27.581Z",
      __v: 0,
    },
    {
      _id: "6489bcf7fc93ef91b3e2d9f7",
      user: "648988acc4cf1ed9f8c48727",
      title: "Addign a New note",
      description: "Please access the playlist",
      tag: "Personal",
      date: "2023-06-14T13:13:27.558Z",
      __v: 0,
    },
  ];

  const [notes, setNotes] = useState(initialNotes);

  return (
    //<NoteContext.Provider value={{ state, update }}>
    <NoteContext.Provider value={{ notes, setNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
