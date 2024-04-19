
const Listing = require('../model/list.model');
const errorHandler = require('../utils/error');



const createList = async (req,res,next) => {
try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);

} catch (error) {
    next(error)
}


}

const deleteList = async (req,res,next) => {
const listing = await Listing.findById(req.params.id)
if (!listing){
    return next(errorHandler(404, "List not found"))
}
if (req.user.id !== listing.userRef){
    return next(errorHandler(401, "You can only delete Your List"))
}
try {
    await Listing.findByIdAndDelete(req.params.id)
    res.status(200).json("Deleted Successfully")
} catch (error) {
    next(error)
}
}
const updateList = async (req,res,next) => {
    const listing = await Listing.findById(req.params.id)
    if (!listing){
        return next(errorHandler(404, "List not found"))
    }
    if (req.user.id !== listing.userRef){
        return next(errorHandler(401, "You can only update Your List"))


    }
try {
    const updateListing = await Listing.findByIdAndUpdate(req.params.id, req.body,{new: true});

   res.status(200).json(updateListing)
} catch (error) {
    next(error)
}

}

module.exports = {createList, deleteList, updateList}

