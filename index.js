const express = require('express')
const app = express() // object // {}
// const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const { create } = require('express-handlebars')

// Importing routes
const homeRouter = require('./routes/home')
const aboutRouter = require('./routes/about')
const booksRouter = require('./routes/products')
const cardRouter = require('./routes/card')

const exhbs = create({
    extname: 'hbs',
    defaultLayout: 'layout',
})

// View engine
app.engine('hbs', exhbs.engine)
app.set('view engine', 'hbs');
app.set('views', './views');

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routing
app.use('/404', (req, res) => {
    res.render('404', {
        title: 404
    })
})

app.use('/', booksRouter)
app.use('/card', cardRouter)

try {
    const port = process.env.PORT || 5000
    app.listen(port, () => {
        console.log('Server working on port', port);
    })
} catch (error) {
    console.error(error);
}