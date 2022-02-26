const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
            res.render('shop/product-list', {
                prods: rows,
                pageTitle: 'All products',
                path: '/products',
            });
        }).catch((error) => console.log(error));

}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(([product]) =>{

        res.render('shop/product-detail', {
            product:product[0],
            pageTitle: 'Your product',
            path: '/products'});

    }).catch(err => console.log(err));

}

exports.getCartItems = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/cart', {
            pageTitle: 'Your cart',
            path: '/cart',
            products: rows
        }).catch((error) => console.log(error));
    });
}

exports.postCartItems = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/orders', {
            pageTitle: 'Your orders',
            path: '/orders',
        });
    }).catch((error) => console.log(error));
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/index', {
            prods: rows,
            pageTitle: 'Shop',
            path: '/',
        }).catch((error) => console.log(error));
    })

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
    Cart.getCart(cart => {
        Product.fetchAll().then(([rows, fieldData]) => {
            const cartProducts = [];
            for (product of rows) {
                const cartProductData = cart.rows.find(
                    prod => prod.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
}

exports.postCartDeleteProduct = (req, res, next) => {
    console.log("hi");
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        console.log(prodId);
        res.redirect('/cart');
    });
};