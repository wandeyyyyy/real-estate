
const Listing = require('../model/list.model');
const errorHandler = require('../utils/error');



const createList = async (req,res,next) => {
try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);

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
const getList = async (req,res,next) => {
   
try {
    const listing = await Listing.findById(req.params.id)
    
    if (!listing){
        return next(errorHandler(404, "List not found"))
    }
    res.status(200).json(listing)
  
} catch (error) {
    next(error)
}
}
const getListings = async (req,res,next) => {

    try {
        
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
          }
      
          let furnished = req.query.furnished;
          if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
          }
      
          let parking = req.query.parking;
      
          if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
          }
      
          let type = req.query.type;
      
          if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
          }
          const searchTerm = req.query.searchTerm || '';

          const sort = req.query.sort || 'createdAt';
      
          const order = req.query.order || 'desc';
      
          const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
          })
            .sort({ [sort]: order })
        
            .skip(startIndex)
            .select('+userRef');
      
          return res.status(200).json(listings);
    } catch (error) {
        next(error)
    }
}
module.exports = {createList, deleteList, updateList, getList, getListings}

