const product = require('../../models/product')
const Joi = require("joi");
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const CustomErrorHandler = require('../../services/customErrorHandler');
const productSchema = require('../../validators/productValidator');
 
const storage = multer.diskStorage({
    destination: ( req, file, cb )=> cb(null, 'uploads/'),
    filename: ( req, file, cb )=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({ storage , limits: {fileSize: 1000000 * 5}}).single('image');

const productsController = {
    async store(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            console.log(req.file);
            const filepath = req.file.path;
            //Validation

            const { error } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filepath}`, (err) => {
                    if (err) {
                        return next(
                            CustomErrorHandler.serverError(err.message)
                        );
                    }
                });

                return next(error);
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await product.create({
                    name: name,
                    price: price,
                    size: size,
                    image: filepath,
                });
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },

    async update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }

            let filepath;
            if (req.file) {
                filepath = req.file.path;
            }

            //Validation
            const { error } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${appRoot}/${filepath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }
                return next(error);
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await product.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        name: name,
                        price: price,
                        size: size,
                        ...(req.file && { image: filepath }),
                    },
                    { new: true }
                );
                console.log(document);
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },

    async destroy(req, res, next) {
        const document = await product.findOneAndDelete({ _id: req.params.id });
        if (!document) {
            return next(new Error("Nothing to delete"));
        }
        //Delete the image
        const imagePath = document._doc.image;
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(new Error("Failed to delete image"));
            }
            return res.json(document);
        });
    },
    async index(req, res, next) {
        let query = {};
        if (req.query.name) {
            query.name = new RegExp(req.query.name, 'i');
        }

        let documents;
        try {
            documents = await product.find(query).select("-updatedAt -__v").sort({_id: -1});
        } catch (err) {
            return next(err);
        }
        res.json(documents);
    },
    async show(req, res, next) {
        let document;
        try{
            document = await product.findById(req.params.id).select("-updatedAt -__v");
        }catch(err){
            return next(err);
        }
        return res.json(document);
    }
};

module.exports = productsController;