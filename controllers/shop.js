const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All products',
                path: '/products',
            }) }).catch(error => {
            console.log(error)
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId).then((product) =>{
        res.render('shop/product-detail', {
            product:product,
            pageTitle: 'Your product',
            path: '/products'});
    }).catch(err => console.log(err));

}

exports.getCartItems = (req, res, next) => {
    Product.fetchAll()
        .then(items => {
        res.render('shop/cart', {
            pageTitle: 'Your cart',
            path: '/cart',
            products: items
        }).catch((error) => console.log(error));
    });
}

exports.postCartItems = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        console.log(result)
        res.redirect('/cart');
    }).catch(err => {
        console.log(err)
    })
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch((error) => console.log(error));
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
            })})
        .catch(error => {
            console.log(error)
    });
}

exports.getCheckout = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/index', {
            pageTitle: 'Checkout',
            path: '/checkout',

        });
    }).catch((error) => console.log(error));
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(error => {
            console.log(error);
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        })

};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders')
        })
        .catch(error => {
            console.log(error);
        })
}