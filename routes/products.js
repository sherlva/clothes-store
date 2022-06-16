const express = require('express')
const router = express.Router()
const Joi = require('joi')
const authMiddleware = require('../middleware/auth')
const Products = require('../model/Products')

// View all products
router.get('/', async (req, res) => {
    const products = await Products.getAll()


    res.render('products', {
        title: 'All products',
        products,
        isHome: true
    })
})

router.get('/add', (req, res) => {
    res.render('formProduct', {
        title: 'Add new product',
        isProducts: true
    })
})

// Get product by id
router.get('/product/:id', async (req, res) => {
    Products.findById(req.params.id)
        .then(product => {
            console.log(product);

            res.render('product', {
                product,
                title: product.name
            })
        })
        .catch(err => {
            res.status(400).redirect('/404')
        })
})

// POST request
router.post('/add', authMiddleware, async (req, res) => {
    // Baza chaqiramiz
    // let allproducts = products  // []

    // Validatsiya // hiyalaymiz
    let productSchema = Joi.object({
        name: Joi.string().min(3).required(),
        size: Joi.string().required(),
        img: Joi.string(),
        price: Joi.number().integer().required()
    })

    const result = productSchema.validate(req.body)
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }

    const product = new Products(
        req.body.name,
        req.body.size,
        req.body.img,
        req.body.price
    )

    await product.save()
    res.status(201).redirect('/')
})

router.get('/update/:id', authMiddleware, async (req, res) => {
    const oldproduct = await Products.findById(req.params.id)

    res.render('updateproduct', {
        oldproduct,
        title: oldproduct.name
    })
})

// Update product
router.post('/update/', authMiddleware, async (req, res) => {
    // Validatsiya // hiyalaymiz
    let productSchema = Joi.object({
        name: Joi.string().min(3).required(),
        size: Joi.string(),
        img: Joi.string(),
        id: Joi.string(),
        price: Joi.number().integer().required()
    })

    validateBody(req.body, productSchema, res)

    await Products.updateById(req.body.id, req.body)
    res.redirect('/product/' + req.body.id)
})

// Remove product
router.get('/remove/:id', authMiddleware, async (req, res) => {
    const id = req.params.id

    Products.removeById(id).then(() => {
        res.redirect('/')
    }).catch(err => {
        console.log(err)
        res.redirect('/404')
    })
})

function validateBody(body, productSchema, res) {
    const result = productSchema.validate(body)
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }
}

module.exports = router