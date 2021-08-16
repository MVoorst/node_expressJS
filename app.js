const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();

app.set('view engine', 'pug');
app.set('views', 'view');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.get('/favicon.ico', (req, res) => res.sendStatus(204));
//added this because the browser searches a favicon. This resulted in double execution of the middleware functions below.


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'view', '404.html'))

});

app.listen(3000);