const { text } = require('express');
const path = require('path');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');
const router = require('express').Router();

router.get('/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

router.delete('/notes/:id', (req, res) => {
    console.info(`${req.method} request received by note ID`)
    const requestedNote = req.params.id.toLowerCase();
    readFromFile('./db/db.json').then((data) => {
        const noteData = JSON.parse(data);

        if (requestedNote) {
            for (let i = 0; i < noteData.length; i++) {
                if (requestedNote === noteData[i].id.toLowerCase()) {
                    noteData.splice(noteData[i], 1);
                    writeToFile('./db/db.json', noteData);
                    res.json(noteData);
                }
            }
        }
    });
});

router.post('/notes', (req, res) => {
    console.info(`${req.method} request received to add note`);
    console.log(req.body);

    const { title, text } = req.body;

    if(req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Note successfully added');
    } else {
        res.error('Error in adding note');
    }
});

module.exports = router;