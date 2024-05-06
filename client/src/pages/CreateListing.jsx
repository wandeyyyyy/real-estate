import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'



const CreateListing = () => {
    const {currentUser} = useSelector((state) => state.user)
const [files, setFiles] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError ] = useState(false)
const [loads, setLoads ] = useState(false)
const navigate = useNavigate()
const [formData, setFormData] = useState({
    images: [],
    name: "",
    description: "",
   address: "",
   type: "rent",
   bedrooms: 1,
   bathrooms: 1,
   regularPrice: 50,
   discountPrice: 0,
   offer: false,
   parking: false,
   furnished: false
})
const [imageUploadError, setImageUploadError] = useState(false)


const handleFileSubmit = (e) => {

    e.preventDefault();
if(files.length > 0 && files.length  + formData.images.length < 7){
    setLoading(true);
    setImageUploadError(false)
const promises = []
for (let i = 0; i < files.length; i++) {
   promises.push(storeImage(files[i]))
    
}
Promise.all(promises).then((urls) => {
    setFormData({...formData, images: formData.images.concat(urls),
    })
    setImageUploadError(false);
    setLoading(false);

}).catch((err) => {
    setImageUploadError('Image Upload Failed(2mb max)')
    setLoading(false);
  
})
}else{
    setImageUploadError('You can only Upload 6 images')
    setLoading(false);
}
} 

const storeImage = async (file) => {
    return new Promise((resolve,reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed", 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log( `Upload is ${progress} done`)
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                })
            }
        )
    })
}
const handleDelImage = (index) => {
setFormData({
    ...formData,
    images: formData.images.filter((_, i) => i !== index),

})
}

const handleChanges =(e) => {
if(e.target.id === "sell" || e.target.id === "rent"){
    setFormData({
        ...formData,
        type: e.target.id
    })
}

if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer" ){
    setFormData({
        ...formData,
     [e.target.id]: e.target.checked
    })
}
if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
    setFormData({
        ...formData,
     [e.target.id]: e.target.value
    })
}
}

const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {

        if(formData.images.length < 1) return setError("Upload atleast 1 image")
        if(+formData.regularPrice < +formData.discountPrice) return setError("Discount Price must be lower than regular price")
        setLoads(true)
        setError(false);

        const res = await fetch('/api/listing/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                userRef: currentUser._id
            })
        })
        const data = await res.json()
        setLoads(false);
        if(data.success === false){
            setError(data.message)
        }
        navigate(`/listing/${data._id}`)
    } catch (error) {
        setError(error.message);
        setLoads(false)
        
    }
}
  return (
    <main className='max-w-4xl p-3 mx-auto'>
        <h1 className='text-3xl font-bold text-center my-7'>
             Create a Listing
        </h1>
        <form onSubmit={handleSubmitForm} className='flex flex-col sm:flex-row  gap-4'> 
<div className='flex flex-col gap-4 flex-1'>
<input type="text" id="name" placeholder='Name' className='border p-3 rounded-lg  outline-none' maxLength="62" minLength="10" required onChange={handleChanges} value={formData.name} />
<textarea type="text"  id="description" placeholder='Description' className='border p-3 rounded-lg  outline-none' required onChange={handleChanges} value={formData.description}/>
<input type="text"  id="address" placeholder='Address' className='border p-3 rounded-lg  outline-none' required onChange={handleChanges} value={formData.address}/>
<div className='flex gap-6 flex-wrap font-semibold'>
    <div className='flex gap-2'>
        <input type="checkbox" id="sell" className='w-4'onChange={handleChanges} checked={formData.type === "sell"} />
        <span>Sell</span>
    </div>
    <div className='flex gap-2'>
        <input type="checkbox" id="rent" className='w-4'onChange={handleChanges} checked={formData.type === "rent"}  />
        <span>rent</span>
    </div>
    <div className='flex gap-2'>
        <input type="checkbox" id="parking" className='w-4'onChange={handleChanges} checked={formData.parking}  />
        <span>Parking spot</span>
    </div>
    <div className='flex gap-2'>
        <input type="checkbox" id="furnished" className='w-4' onChange={handleChanges} checked={formData.furnished}  />
        <span>Furnished</span>
    </div>
    <div className='flex gap-2'>
        <input type="checkbox" id="offer" className='w-4' onChange={handleChanges} checked={formData.offer} />
        <span>Offer</span>
    </div>

</div>
<div className='flex flex-wrap gap-6 font-semibold'>
    <div className='flex items-center gap-2'>
        <input type="number" name="" id="bedrooms" min="1" max="10" className='border border-gray-300 rounded-lg p-3 outline-none' onChange={handleChanges} value={formData.bedrooms}  required/>
        <span>Beds</span>
    </div>
    <div className='flex items-center gap-2'>
        <input type="number" name="" id="bathrooms" min="1" max="10" className='border border-gray-300 rounded-lg p-3 outline-none ' onChange={handleChanges} value={formData.bathrooms}  required/>
        <span>Baths</span>
    </div>
  
    <div className='flex items-center gap-2'>
        <input type="number"  id="regularPrice" min="50" max="1000000" className='border border-gray-300 rounded-lg p-3 outline-none'onChange={handleChanges} value={formData.regularPrice} required/>
        <div className='flex flex-col items-center'>
        <span>Regular Price</span>
<span className='text-xs'>($/ Month)</span>
        </div>
    </div>
    {formData.offer &&
    <div className='flex items-center gap-2'>
        <input type="number"  id="discountPrice" min="0" max="1000000" className='border border-gray-300 rounded-lg p-3 outline-none'onChange={handleChanges} value={formData.discountPrice} required/>
        <div className='flex flex-col items-center'>
        <span>Discount Price</span>
<span className='text-xs'>($/ Month)</span>
        </div>
    </div>
   }
</div>
<div className='flex flex-col flex-1 gap-4'>
    <p className='font-bold'>Images:
    <span className='font-normal text-gray-600 ml-2'>The first Image will be the cover (max 6)</span>
    </p>
    <div className='flex gap-4'>
        <input type="file"  onChange={(e) => setFiles(e.target.files)} id="file" accept='image/*' className='border border-gray-300 rounded w-full' multiple />
        <button onClick={handleFileSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 hover:bg-green-700 hover:text-white'>
            {loading ? 'Uploading...' : 'UPLOAD '}
        </button>
    </div>
<p className='text-red-700 font-medium'>{imageUploadError && imageUploadError}</p>

{
  formData.images.length > 0 && formData.images.map((url, index) => (
    <div key={index} className='flex justify-between p-3 border items-center'>
      <img src={url} alt="list image" className='w-20 h-20 object-contain rounded-lg' />
      <button disabled={loading}
      onClick={() => handleDelImage(index)} className='p-3 text-red-700 rounded-lg hover:opacity-95'>DELETE</button>
    </div>
  ))
}
</div>


<button type='submit' disabled={ loads || loading } className='p-3 bg-slate-700 rounded-lg hover:opacity-95 disabled:opacity-80 text-white font-semibold'>{loads ? "CREATING..." : "CREATE LISTING"}</button>
{error && <p className='text-red-700 text-xs font-medium'>{error}</p>}
</div>

        </form>
    </main>
  )
}

export default CreateListing