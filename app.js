const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'view');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const db = require('./util/database');


app.get('/favicon.ico', (req, res) => res.sendStatus(204));
//added this because the browser searches a favicon. This resulted in double execution of the middleware functions below.


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);


/*
db.execute('SELECT * FROM products')
    .then((result) => {
        console.log(result[0], result[1]);
    })
    .catch(err => {
        console.log(err);
    });
*/


app.use(errorController.get404);

app.listen(3000);