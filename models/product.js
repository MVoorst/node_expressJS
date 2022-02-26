const products = [];
const db = require('../util/database');
const fs = require('fs');
const path = require('path');
const Cart = require("./cart");

const p =
    path.join(
        path.dirname(require.main.filename),
        'data',
        'products.json'
);


const getProductsFromFile = (callBack) => {
    fs.readFile (p, (err, fileContent) => {
        if (err) {
            callBack([]);
        }
        callBack(JSON.parse(fileContent));
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;

    }

    save() {
        db.execute('INSERT INTO products (title, price, description, imageUrl) VALUE (?, ?, ?, ?)'
            , [this.title, this.price, this.description]); //vanwege sql injection
       /* getProductsFromFile((products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });

            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }

        }));*/
    }

    static deleteById (id) {
        this.fetchAll().then((products) => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            db.execute('DELETE FROM products WHERE id = ')
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            })
        })
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
       /* this.fetchAll().then((products) => {
            const product = products.find(p => p.id === id);
            return (product);
        }).catch((error) => {
            console.log(error);
        })
*/

    }



}