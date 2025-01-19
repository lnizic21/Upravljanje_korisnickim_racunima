const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
import router from './router';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loginpage.html'));
});
app.use(express.static(path.join(__dirname, 'public')));

// creates and starts a server for our API on a defined port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;