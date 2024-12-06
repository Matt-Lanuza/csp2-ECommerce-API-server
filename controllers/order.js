//order controllers
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const {errorHandler} = require("../auth");


/*
    *** functions will be placed here ***
*/

// Create Order
module.exports.createOrder = async (req, res) => {
    const userId = req.user.id;

    try {   
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        } 

        if (cart.cartItems.length > 0) {
            const totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

            let order = new Order({
                userId,
                productsOrdered: cart.cartItems,
                totalPrice
            });

            await order.save();

            
            cart.cartItems = [];
            cart.totalPrice = 0;
            await cart.save();

            return res.status(201).send({ message: 'Ordered Successfully' }); 

        } else {
            return res.status(400).send({ error: 'No Items to Checkout' });
        }

    } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};





// Retrieve loggedin user's orders
module.exports.getMyOrders = async (req, res) => {
    const userId = req.user.id; 
 
    try {   
        const orders = await Order.find({ userId });
        if (orders.length === 0) {
            return res.status(404).send({ error: 'No orders found' });
        } else {
        	return res.status(200).send({orders});
        }
       
    } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};





// Retrieve all user's orders
module.exports.getAllOrders = async (req, res) => {

    try {
        const orders = await Order.find({});
        if (orders.length === 0) {
            return res.status(404).send({ error: 'No orders found' });
        } else {
        	return res.status(200).send({orders});
        }
       
    } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};