const Products = require("../models/product");

const getAllProductsStatic = async(req, res) => {
    const products = await Products.find({ name: "wooden table" });
    res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async(req, res) => {
    const queryObject = {};
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    if (featured) {
        queryObject.featured = featured === "true" ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }
    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            "<": "$lt",
            "=": "$eqt",
            ">=": "$gte",
            "<=": "$lte",
        };
        const regEx = /\b(<|>|=|>=|<=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = {
                    [operator]: Number(value)
                }
            }
        })
    }
    let result = Products.find(queryObject);
    if (sort) {
        const sortList = sort.split(",").join("");
        result = result.sort(sortList);
    }
    if (fields) {
        const fieldsList = fields.split(",").join("");
        result = result.select(fieldsList);
    }
    console.log(queryObject);
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };