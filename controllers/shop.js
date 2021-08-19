const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All products',
            path: '/products',
        });
    });

}

exports.getCartItems = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/cart', {
            pageTitle: 'Your cart',
            path: '/cart',
        });
    });
}

exports.getOrders = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/orders', {
            pageTitle: 'Your orders',
            path: '/orders',
        });
    });
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    });
}
exports.getCheckout = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            pageTitle: 'Checkout',
            path: '/checkout',

        });
    });
}