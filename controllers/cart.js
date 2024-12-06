//cart controllers
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const {errorHandler} = require("../auth");


/*
    *** functions will be placed here ***
*/
// Get User's Cart
module.exports.getUserCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId })
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }
        res.status(200).send({ cart });
    } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};



// Add to cart
module.exports.addToCart = async (req, res) => {
    const { productId, quantity, subtotal } = req.body;
    const userId = req.user.id;

    if (!productId || !quantity || !subtotal) {
        return res.status(400).send({
            message: "All fields are required"
        });
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).send({ error: 'Quantity must be a positive number.' });
    }

    try {
        let existingCart = await Cart.findOne({ userId });

        if (existingCart) {
            const cartItemIndex = existingCart.cartItems.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (cartItemIndex > -1) {
                existingCart.cartItems[cartItemIndex].quantity += quantity;
                existingCart.cartItems[cartItemIndex].subtotal += subtotal;
            } else {
                existingCart.cartItems.push({ productId, quantity, subtotal });
            }

            existingCart.totalPrice = existingCart.cartItems.reduce(
                (total, item) => total + item.subtotal, 0
            );

            await existingCart.save();
            return res.status(200).send({ message: "Item added to cart successfully", cart: existingCart });
        } else {
            const newCart = new Cart({
                userId,
                cartItems: [
                    {
                        productId,
                        quantity,
                        subtotal,
                    },
                ],
                totalPrice: subtotal,
            });

            await newCart.save();
            return res.status(201).send({ message: "New cart created and item added successfully", cart: newCart });
        }

        
    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
};



// Update product quantities in Cart
module.exports.updateCartQuantity = async (req, res) => {
    const userId = req.user.id;
    const { productId, newQuantity } = req.body;

    try {
        if (typeof newQuantity !== 'number' || newQuantity <= 0) {
            return res.status(400).send({ error: 'Quantity must be a positive number.' });
        }


        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ error: 'No cart found for this user.' });
        }

        const cartItem = cart.cartItems.find(item => item.productId.toString() === productId);

        if (cartItem) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).send({ error: 'Product not found.' });
            }
            
            cartItem.quantity = newQuantity;
            cartItem.subtotal = product.price * newQuantity;

            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

            await cart.save();
            return res.status(200).send({ message: 'Item quantity updated successfully.', updatedCart: cart });
        } else {
            return res.status(404).send({ error: 'Item not found in cart.' });
        }

        

    } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};


// Remove products from cart
module.exports.removeProductFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ error: 'No cart found for this user.' });
        }

        const productToRemove = cart.cartItems.find(item => item.productId.toString() === productId);

        if (productToRemove) {
            cart.cartItems = cart.cartItems.filter(item => item.productId.toString() !== productId);

            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

            await cart.save();
            return res.status(200).send({ message:'Item removed from cart successfully', updatedCart: cart });
        } else {
            return res.status(404).send({ error: 'Item not found in cart' });
        }

        } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};


// Clear cart items
module.exports.clearCartItems = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ error: 'No cart found for this user.' });
        } 
        
        if (cart.cartItems.length >= 1){
                cart.cartItems = [];
                cart.totalPrice = 0;
                await cart.save();
                return res.status(200).send({message: 'Cart cleared successfully', cart})

        } else {
            return res.status(200).send({error: 'Cart is already empty.'})
        }

    } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }

};