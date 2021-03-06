// Added dependencies
const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");

// Get Route for retrieving notes
notes.get("/", (req, res) => {
  readFromFile("./db/db.json").then((notes_data) =>
    res.json(JSON.parse(notes_data))
  );
});

// Get route for specific note by id
notes.get("/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/notes.json")
    .then((notes_data) => JSON.parse(notes_data))
    .then((json) => {
      const result = json.filter((note_data) => note_data.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json("π³ No note with that ID π³");
    });
});

// Delete route for notes
notes.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((notes) => JSON.parse(notes))
    .then((json) => {
      // Creates an array of the notes excluding the one in the URL.
      // Said note id comes from the event handler in public/index.js
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile("./db/db.json", result);

      // Delete request response to user
      res.json(`β» Item ${noteId} has been deleted β»`);
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
      status: `Note added successfully π`,
      body: newNote,
    };
    res.json(response);
  } else {
    res.error("Error in adding noteπ₯");
    console.log(error);
  }
});

module.exports = notes;
