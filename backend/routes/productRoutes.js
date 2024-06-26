const router = require('express').Router();
const Product = require("../models/Product");
const User = require("../models/User");

// route to get products
router.get('/', async(req, res) => {
	try {

		//sorting is based on the product id and is DESC. the newest product first.
		const sort = {"_id": -1};
		const products = await Product.find().sort(sort);
		res.status(200).json(products);
	} catch(error) {
		console.log(error.message);
		res.status(400).send(error.message);
	}
})

// route to create a product
router.post("/", async(req, res) => {
	try {
		//images as pictures
		const {name, description, price, category, images: pictures} = req.body;
		const product = await Product.create({name, description, price, category, pictures});
		const products = await Product.find();
		res.status(201).json(products);
	} catch(error) {
		console.log(error.message);
		res.status(400).send(error.message);
	}
})

//route to update a product
router.patch("/:id", async(req, res) => {
	const {id} = req.params;
	try {
		const {name, description, price, category, images: pictures} = req.body;
		const product = await Product.findByIdAndUpdate(id, {name, description, price, category, pictures});
		const products = await Product.find();
		res.status(200).json(products);
	} catch(error) {
		console.log(error.message);
		res.status(400).send(error.message);
	}
})

// route to delete a product.
router.delete("/:id", async(req, res) => {
	const{id} = req.params;
	const{user_id} = req.body;
    console.log(user_id);
	try {
		const user = await User.findById(user_id);
        console.log(user);
		if (!user.isAdmin) return res.status(401).json("you dont have permission");
		await Product.findByIdAndDelete(id);
		const products = await Product.find();
		res.status(200).json(products);
	} catch(error) {
        console.log("Error deleting the product:", error)
		res.status(400).send(error.message);
	}
})


//route to get a single product
router.get('/:id', async(req, res) => {
	const {id} = req.params;
	console.log("requested has arrived");
	try {
		const product = await Product.findById(id);
		//when we get get one product we want to show similar products as well
		const similar = await Product.find({category: product.category}).limit(5);
		res.status(200).json({product, similar});
	} catch(error) {
		console.log(error.message);
		res.status(400).send(error.message);
	}
})

//retrieve products by the type of category passed
router.get('/category/:category', async(req, res) => {
    const {category} = req.params;
	try {
		let products;
		const sort = {"_id": -1};

		if (category == "all") {
			products = await Product.find().sort(sort);
		} else {
			products = await Product.find({category}).sort(sort);
		}
		res.status(200).json(products);
	} catch(error) {
		console.log(error.message);
		res.status(400).send(error.message);
	}
})

// this route will handle the logic to add product to cart
router.post('/add-to-cart', async(req, res) => {
	const {userId, productId, price} = req.body;
	try {
		const user = await User.findById(userId);
		const userCart = user.cart;

		if(user.cart[productId]) {
			userCart[productId] += 1;
		} else {
			userCart[productId] = 1;
		}
		userCart.count += 1;
		userCart.total = Number(userCart.total) + Number(price);
		user.cart = userCart;

		// make Mongoose recognizes the change and persists it properly.
		user.markModified('cart');
		await user.save();
		res.status(200).json(user);
	} catch(error) {
		console.log('Error adding to cart route:', error.message);
		res.status(400).send(error.message);
	}
})

// this route will handle the logic to increase a product from cart
router.post('/increase-cart', async(req, res)=> {
  const {userId, productId, price} = req.body;

  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total += Number(price);
    userCart.count += 1;
    userCart[productId] += 1;
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});


// this route will handle the logic to decrease a product from cart
router.post('/decrease-cart', async(req, res) => {
	const {userId, productId, price} = req.body;
	try {
		const user = await User.findById(userId);
		const userCart = user.cart;
		userCart.total -= Number(price);
		userCart.count -= 1;
		userCart[productId] -= 1;
		user.cart = userCart;
		user.markModified('cart');
		await user.save();
		res.status(200).json(user);

	} catch(error) {
		console.log("error decreasing item from cart:", error.message);
		res.status(400).send(error.message);
	}
})

router.post('/remove-from-cart', async(req, res)=> {
  const {userId, productId, price} = req.body;

  console.log("req to remove from cart");
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total -= Number(userCart[productId]) * Number(price);
    userCart.count -= userCart[productId];
    delete userCart[productId];
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


module.exports = router;
