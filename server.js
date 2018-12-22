"use strict";

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


// Connect to MongoDB database in the cloud
mongoose.connect('mongodb://admin:password1@ds141674.mlab.com:41674/ticdb');
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Database schemas
let boardSchema = new mongoose.Schema({
    row1: [],
    row2: [],
    row3: []
})
let Board = mongoose.model('Board', boardSchema);

let passBoard = [[0,0,0],[0,0,0],[0,0,0]];

function getLatest() {
    Board.find(function (err, boards) {
        if (err) return console.error(err);
        if (boards.length === 0) {
            console.log("No ongoing games found")
            let startboard = new Board({
                row1: [0,0,0],
                row2: [0,0,0],
                row3: [0,0,0]
            })
            startboard.save(function (err, board) {
                if (err) return console.error(err);
            });
        } else {
            console.log("Loading the last game");
            let lastUnit = boards[boards.length - 1];
            passBoard = [lastUnit.row1, lastUnit.row2, lastUnit.row3];
        }
    })
}

db.once('open', function() {
    getLatest();
});

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json());

app.get('/', function (req, res) {
    console.log("Page loaded.")
  getLatest();
  res.render('index', { passBoard: passBoard })
})

app.post('/', (req, res) => {  
    let br = req.body.board;
    let savedboard = new Board({
        row1: br[0],
        row2: br[1],
        row3: br[2]
    })
    savedboard.save(function (err, result) {
      if (err) return console.log(err);

      console.log('Saved to database.');
      res.sendStatus(201);
    });
  });

app.listen(3000, function () {
  console.log('Listening on port 3000')
})