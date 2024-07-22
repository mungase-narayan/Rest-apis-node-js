const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {APP_URL} = require('../config/index')

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String, required: true},
        image: { type: String, required: true, get: (image) => {
            return `${APP_URL}/${image}`;
        }},
    },
    { timestamps: true, toJSON: {getters: true}, id: false }
);

module.exports = mongoose.model("product", productSchema, "products");
