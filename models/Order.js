const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    productsOrdered: [
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
    },

    status: {
        type: String,
        default: 'Pending'
    }
    
});

module.exports = mongoose.model('Order', orderSchema);
