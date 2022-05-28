const Product = require("../models/product")

const getAllProductsStatic = async (req, res) => {
    const {field} = req.query
    const selectList= field.replace(",", " ")
    const products = await Product.find()
    .sort("name")
    .select(selectList)
    .limit(10)
    .skip(5)
    res.status(200).json({products, nbHits : products.length})
}
const getAllProducts = async (req, res) => {
    const {featured, company, name, field, sort, numericFilters} = req.query
    const queryObject = {}

    if(featured){
        queryObject.featured = featured==="true" ? true : false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = {$regex: name, $options: "i"}
    }
    if(numericFilters){
        const operatorMap = {
            ">" : "$gt",
            "<" : "$lt",
            "=" : "$eq",
            ">=" : "$gte",
            "<=" : "$lte"
        }
        const regEx = /\b(<|>|=|<=|>=)\b/g
        let filters = numericFilters.replace(regEx, match=>`-${operatorMap[match]}-`)
        const options = ["price", "rating"]
        filters=filters.split(",").forEach((item) =>{
            const [field, operator, value] = item.split("-")

            if(options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }
    console.log(queryObject)
    let result = Product.find(queryObject)
    if(sort){
        const sortList= sort.replace(",", " ")
        console.log(sortList)
        result = result.sort(sortList)
    } else{
        result = result.sort("createdAt")
    }
    if(field){
        const selectList= field.replace(",", " ")
        console.log(selectList)
        result = result.select(selectList)
    } else{
        result = result.sort("createdAt")
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * 10

    result = result.limit(limit).skip(skip)
    const products = await result
    res.status(200).json({products, nbHits : products.length})
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}