const { Router } = require('express')
const router = Router()
const Card = require('../model/Card')
const Products = require('../model/Products')

// View card
router.get('/', async (req, res) => {
    const card = await Card.getCard()

    res.render('card', {
        card: card,
        title: 'Shopping card',
        isCard: true
    })
})

// Add book to card
router.post('/add', async (req, res) => {
    const book = await Products.findById(req.body.id)
    await Card.add(book)
    res.redirect('/')
})

router.get('/delete/:id', async (req, res) => {
    const card = await Card.removeById(req.params.id)
    res.redirect('/card')
})

module.exports = router