
const Listing = require('../model/list.model')



const createList = async (req,res,next) => {
try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);

} catch (error) {
    next(error)
}


}

module.exports = createList

