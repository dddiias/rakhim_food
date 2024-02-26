const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://boypurple60:diasiksal2003@cluster0.5tae3te.mongodb.net/fastfood_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(session({
    secret: 'yep',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://boypurple60:diasiksal2003@cluster0.5tae3te.mongodb.net/fastfood_db' })
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', adminRoutes);
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
