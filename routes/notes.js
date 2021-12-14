const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");

// const { response } = require('.');

// Get Route for retrieving notes
notes.get("/", (req, res) => {
  readFromFile("./db/db.json").then((notes_data) =>
    res.json(JSON.parse(notes_data))
  );
});

// GET Route for a specific tip
notes.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/notes.json')
    .then((notes) => JSON.parse(notes))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('🕳 No note with that ID 🕳');
    });
});

// Delete route for notes
notes.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((notes) => JSON.parse(notes))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile("./db/db.json", result);

      // Delete request response to user
      res.json(`♻ Item ${noteId} has been deleted ♻`);
    });
});

// Post route for notes
notes.post("/", (req, res) => {
  console.log(req.body);

  const { title, text, id } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");
    const response = {
      status: `Note added successfully 💌`,
      body: newNote,
    };
    res.json(response);
  } else {
    res.error("Error in adding note💥");
    console.log(error);
  }
});

module.exports = notes;
