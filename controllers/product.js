//product controllers
const Product = require("../models/Product");

const {errorHandler} = require("../auth");


/*
	*** functions will be placed here ***
*/

// Create Product
module.exports.createProduct = async (req, res) => {

	const { name, description, price, imageUrl } = req.body;
	if (!name || !description || !price) {
		return res.status(400).send({ error: 'All fields are required' });
	}


	try {
		const existingProduct = await Product.findOne({ name });
		if (existingProduct) {
			return res.status(409).send({ error: 'Product already exists' });
		}

		const newProduct = new Product({
			name: name,
			description: description,
			price: price,
            imageUrl: imageUrl,
		});

		await newProduct.save();
		return res.status(201).send(newProduct);
	} catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};


// Retrieve all products
module.exports.getAllProducts = async (req, res) => {

	try {
		const products = await Product.find({});

		if(products.length > 0){
			return res.status(200).send(products)
		} else {
			return res.status(404).send({error: 'Product not found'})
		}

	} catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};


// Retrieve all active products
module.exports.getAllActiveProducts = async (req, res) => {

	try {
		const activeProducts = await Product.find({isActive: true});

		if(activeProducts.length > 0){
			return res.status(200).send(activeProducts)
		} else {
			return res.status(404).send({error: 'Product not found'})
		}

	} catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }

};


// Retrieve single product
module.exports.getSingleProduct = async (req, res) => {
	const { productId } = req.params;

	try {	
		const product = await Product.findById(productId);
		if(product) {
			return res.status(200).send(product)
		} else {
			return res.status(404).send({error: 'Product not found'})
		}

	} catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }

};


// Update product information
module.exports.updateProductInformation = async (req, res) => {
	const {name, description, price, imageUrl} = req.body;
	const {productId} = req.params;

    let updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (imageUrl) updateData.imageUrl = imageUrl;

	try {
		const product = await Product.findByIdAndUpdate(productId, updateData, {new: true});
		if(product){
			return res.status(200).send({success: true, message: 'Product updated successfully'})
		} else {
			return res.status(404).send({error: 'Product not found'})
		}
	}  catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }

};



// Archive product
module.exports.archiveProduct = async (req, res) => {
    const updateActiveField = { isActive: false };
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);

        if (product) {
            if (product.isActive === false) {
                return res.status(200).send({ 
                    message: 'Product already archived',
                    archivedProduct: product
                });
            }

            await Product.findByIdAndUpdate(productId, updateActiveField, { new: true });

            return res.status(200).send({ 
                success: true, 
                message: 'Product archived successfully'
            });

        } else {
            return res.status(404).send({ error: 'Product not found' });
        }
    } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};


// Activate product
module.exports.activateProduct = async (req, res) => {
    const updateActiveField = { isActive: true };
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);

        if (product) {
            if (product.isActive === true) {
                return res.status(200).send({ 
                    message: 'Product already active',
                    activateProduct: product
                });
            }

            await Product.findByIdAndUpdate(productId, updateActiveField, { new: true });

            return res.status(200).send({ 
                success: true, 
                message: 'Product activated successfully'
            });

        } else {
            return res.status(404).send({ error: 'Product not found' });
        }
    } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error });
    }
};


// Search products by name
module.exports.searchProductsByName = async (req, res) => {
    const { name } = req.body; 

    try {
        const products = await Product.find({ name: { $regex: name, $options: 'i' } });

        if (products.length === 0) {
            return res.status(404).send({ error: 'No products found with this name.' });
        } else {
            return res.status(200).send(products);
        }

    } catch (error) {
       return res.status(500).send({ error: 'Server error', details: error.message });
    }
};



// Search products by price range
module.exports.searchProductsByPriceRange = async (req, res) => {
    let { minPrice, maxPrice } = req.body; 

    try {

        minPrice = Number(minPrice);
        maxPrice = Number(maxPrice);

        if (isNaN(minPrice) || isNaN(maxPrice)) {
            return res.status(400).send({ error: 'Please enter valid numbers for both minimum and maximum price.' });
        }

        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        if (products.length === 0) {
            return res.status(404).send({ error: 'No products found within this price range.' });
        }

        return res.status(200).send(products);

    } catch (error) {
        return res.status(500).send({ error: 'Server error', details: error.message });
    }
};