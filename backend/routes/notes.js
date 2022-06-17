const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");

const fetchuser = require("../middleware/fetchuser");

const { body, validationResult } = require("express-validator");

//ROUTE 1 : to fetch the all the notes for a logged in user using GET :"/api/notes/fetchallnotes"

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.mesage);
    res.status(500).send("internal server error"); // if we have some error in program this wil help us
  }
});

//ROUTE 2 : to add a new note for a user  using POST :"/api/notes/addnote"

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "title should have min 4 char").isLength({ min: 4 }),
    body("description", "description should have min 8 char").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //if there are any  error return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //creating a note
      const note = new Notes({ title, description, tag, user: req.user.id });
      //created note is being savd to db
      const saveNote = await note.save();
      //send created note as response
      res.json({ saveNote });
    } catch (error) {
      console.error(error.mesage);
      res.status(500).send("internal server error"); // if we have some error in program this wil help us
    }
  }
);

//ROUTE 3 : to update a  note for a user  using PUT or PATCH  :"/api/notes/updatenote"

router.put(
  "/updatenote/:id",
  fetchuser,

  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //create a newNote object
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

      //check if the user logged in is correct or not

      let note = await Notes.findById(req.params.id); //params.id is the id in the api (/:id)
      if (!note) {
        return res.status(404).send("not found ");
      }

      if (note.user.toString() !== req.user.id) {
        //note.user.toString() gives id of user
        return res.status(401).send("action not allowed");
      }

      // Find the note to be updated and update it

      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.error(error.mesage);
      res.status(500).send("internal server error"); // if we have some error in program this wil help us
    }
  }
);
//ROUTE4 : to delete  note for a user  using DELETE :"/api/notes/deletenote"

router.delete(
  "/deletenote/:id",
  fetchuser,

  async (req, res) => {
    try {
      //check if the user logged in is correct or not

      let note = await Notes.findById(req.params.id); //params.id is the id in the api (/:id)
      if (!note) {
        return res.status(404).send("not found ");
      }

      //allow deletion if the looged in user is owner of it
      if (note.user.toString() !== req.user.id) {
        //note.user.toString() gives id of user
        return res.status(401).send("action not allowed");
      }

      // Find the note to be updated and update it

      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({ success: " notes has been deleted!!!", note: note });
    } catch (error) {
      console.error(error.mesage);
      res.status(500).send("internal server error"); // if we have some error in program this wil help us
    }
  }
);

module.exports = router;
