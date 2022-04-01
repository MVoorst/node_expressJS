const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save (){
        const db = getDb();
        db
        .collection('users')
        .insertOne(this)
        .then(result => {
            console.log(result);
        }).catch(err => {
            console.log(err);
        })
    }


    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            console.log(cp);
            return cp.product.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items]

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({product: new ObjectId(product._id), quantity: newQuantity})
        }
        const updatedCart ={
            items:updatedCartItems
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}})
    }

    getCart() {
        //return this.cart;
        //returns cart without the full products, only the id;
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.product;
        })
        return db.collection('products').find({_id: {$in: productIds}}).toArray()
            .then(products => {
                return products.map(p => {
                    return {...products, quantity: this.cart.items.find(i=> {
                        return i.product.toString() === p._id.toString();
                    }).quantity}
                })
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.product.toString() !== productId.toString();
        });

        const db = getDb();
        return db
            .collection('users')
            .updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: updatedCartItems}}})
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name,
                        email: this.email
                    }
                }
                db.collection('orders').insertOne(order)
            })
            .then(result =>{
                this.cart = {items:[]};
                const db = getDb();
                return db
                    .collection('users')
                    .updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: []}}})

            })


    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
    }

    static findById(userName) {
        const db = getDb();
        return db.collection('users')
            .find({_id: new ObjectId(userName)})
            .next()
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            })}

}



module.exports = User;