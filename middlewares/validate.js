const {todoValidator} = require('../validators/todoValidator')
const validate = (schema) => (req,res,next) =>{
    const {error,value} = schema.validate(req.body)
    if(error){
        console.error(error.details[0].message)
        return res.status(400).json({ 
            isSuccess : false,
            message: error.details[0].message });
    }
    req.body = value
    next()
}

module.exports = validate;