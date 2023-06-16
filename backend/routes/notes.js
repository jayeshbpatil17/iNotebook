const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE 1 :  Get All the N  :GET "localhost:5000/api/notes/fetchallnotes"...Login require
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//ROUTE 2 :  Add a new  notes  :POST  "localhost:5000/api/notes/addnote"...Login require
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter the valid title ").isLength({ min: 3 }),
    body("description", "Description must be 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are errors , return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savenote = await note.save();
      res.json(savenote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//ROUTE 3 :  Add a new  notes  :PUT  "localhost:5000/api/notes/updatenote"...Login require
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //create a newnote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not Found");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.send({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//ROUTE 4 :  Deleting  notes  :PUT  "localhost:5000/api/notes/deletenote"...Login require
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const newNote = {};
    //find the note to be updated and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //allow deletion only qa user is valid
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ Success: "Note Has been deleted ", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

module.exports = router;
