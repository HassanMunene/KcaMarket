const cloudinary = require('cloudinary');
const router = require('express').Router();
require('dotenv').config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET_KEY
})

router.delete('/:image_public_id', async(req, res) => {
	const {public_id} = req.params;
	try {
		await cloudinary.uploader.destroy(public_id);
		res.status(200).send();
	} catch (error) {
		res.status(400).send(error.message);
	}
})

module.exports = router;
