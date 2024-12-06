const mongoose = require('mongoose'); 
const { ObjectId } = mongoose.Schema.Types; 

const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId, 
        ref: 'User',
        required: true
    },
    cartItems: [
        {
            productId: {
                type: ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            subtotal: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    orderedOn: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Cart', cartSchema);