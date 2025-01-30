const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.port||5000;
app.use(cors());
const path=require('path');

const mongoose = require("mongoose");
const uri = 'mongodb://localhost:27017/Chirplt';
require("./models/model.js")
async function connectToDB() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}


connectToDB();
app.use(express.json());
app.use(require('./routes/auth.js'));
app.use(require('./routes/createPost.js'));
app.use(require('./routes/user.js'));
// app.get('/', (req,res) => {
//     res.json({
//         'amol':"kaer",
//     })
// })
app.use(express.static(path.join(__dirname, './frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/dist/index.html')),
  function(err) {
    res.send(err);
  }
});
app.listen(port, () => {
    console.log('app is running on port' + port);
})