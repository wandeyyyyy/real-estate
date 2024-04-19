
import { useSelector } from 'react-redux'
import { useRef, useState ,useEffect} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'

import { app } from '../firebase'
import { updateUserFailure, updateUserStart,updateUserSuccess , deleteUserStart,deleteUserSuccess,deleteUserFailure, signOutUserStart, signOutUserFailure, signOutUserSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';


const Profile = () => {
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector(state => state.user)
  const  [file, setFile] = useState(undefined)
const [filePerc, setfilePerc] = useState(0);
const [fileUploadError, setFileUploadError] = useState(false);
const [formData,setFormData ] = useState({});
const [showListError,setShowListError] = useState(false);
const [userListing,setUserListing] = useState([]);

const [updateSuccess,setUpdateSuccess ] = useState(false);
const dispatch = useDispatch();

// console.log(formData)
// console.log(file)
// console.log(filePerc)



useEffect(() =>{
  if(file) {
    handleFileUpload(file);
  }
}, [file])

const handleFileUpload = (file) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
setfilePerc(Math.round(progress))
  },
  (error)=> {
    setFileUploadError(true)
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then ((downloadURL) => 
      setFormData({...formData, avatar: downloadURL}));

  
  });
};

const handleChange = (e) => {
  setFormData({...formData, [e.target.id] : e.target.value})
}

const handleSubmit = async(e) => {
e.preventDefault();
try {
  dispatch(updateUserStart());
  const res = await fetch(`/api/user/update/${currentUser._id}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'

    },
    body: JSON.stringify(formData), 
  });
  const data = await res.json()
if(data.success === false){
  dispatch(updateUserFailure(data.message))
  return;
}
  dispatch(updateUserSuccess(data))
  setUpdateSuccess(true)
} catch (error) {
  dispatch(updateUserFailure(error.message))
  
}
}

const handleDeleteUser = async(e) => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`,
    {
      method: 'DELETE'
    });
    const data = await res.json();
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return;
    }
    dispatch(deleteUserSuccess(data))
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
  
  
}
const handleSignOut = async () => {
  try {
    dispatch(signOutUserStart());
    const res = await fetch('/api/auth/signout');
    const data = await res.json();
    if(data.success === false){
      dispatch(signOutUserFailure(data.message));
      return;
    }
    dispatch(signOutUserSuccess(data));
  } catch (error) {
    dispatch(signOutUserFailure(data.message));
  }
}


const handleShowList = async () => {
  try {
    setShowListError(false);
    const res = await fetch(`/api/user/listings/${currentUser._id}`)
    const data = await res.json();

    if(data.success === false){
   setShowListError(true);
      return;
    }
    setUserListing(data)
  } catch (error) {
    setShowListError(true)
  }
}

const deleteList = async (listId) => {
  try {
    const res = await fetch(`/api/listing/delete/${listId}`,{
      method: "DELETE"
    })
    const data = await res.json();

    if(data.success === false){
console.log(data.message)
      return;
    }

    setUserListing((prev) =>
     prev.filter((listing) => listing._id !== listId))
  } catch (error) {
    
  }
}

  return (
    <div className='p-3 max-w-lg m-auto'>
   <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
   <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
    <input 
    onChange={(e) => setFile(e.target.files[0])} type="file" 
    id="image" 
    ref={fileRef} hidden
     accept='image/*'/>
<img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='rounded-full h-24 w-24 object-cover hover:cursor-pointer self-center mt-2' alt="profile" />
<p className='text-sm self-center'>
  {fileUploadError ? (<span className='text-red-700 font-semibold'>Error Image Upload (image must be less than 2mb)</span>)
   :
   filePerc > 0 && filePerc <  100 ? (<span className='text-slate-700 font-semibold'>
    {`Uploading ${filePerc}%`}
  </span> ) :
  filePerc === 100 ? (<span className='text-green-700 font-semibold'>
Image Successfully Uploaded!
  </span>) : ( "" )}
</p>
<input type="text" className="border p-3 rounded-lg " placeholder='username' id="username" defaultValue={currentUser.username}
onChange={handleChange} />
<input type="email" className="border p-3 rounded-lg " placeholder='email' id="email"  defaultValue={currentUser.email} onChange={handleChange}/>
<input type="password" className="border p-3 rounded-lg " placeholder='password' id="password" onChange={handleChange}/>
<button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>
{loading ? "LOADING.." : "UPDATE" }
</button>
<Link  className="bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-95" to={"/create-listing"}>
CREATE LISTING
</Link>
   </form>
   <div className='flex justify-between mt-5'>
    <span className='text-red-700 cursor-pointer font-semibold' onClick={handleDeleteUser}>
      Delete Account
    </span>
    <span onClick={handleSignOut} className='text-red-700 cursor-pointer font-semibold'>
      Sign Out
    </span>
   </div>
 
   <p className='text-green-700 font-semibold mt-2'>
    {updateSuccess ? "User updated Successfully!" : ""}
   </p>
   <button onClick={handleShowList} className='text-green-700 w-full font-medium'>Show Listings</button>
   <p className='text-red-700 font-medium'>{showListError ? 'Error' : ''}</p>

{userListing && userListing.length > 0 && 

<div className='flex flex-col gap-4'>
  <h1  className='text-center my-7 text-2xl font-bold '>Your List</h1>
  
  {userListing.map((listing) => (
<div className='border rounded-lg p-3 flex justify-between items-center gap-4' key={listing._id}>
  <Link to={`/listings/${listing._id}`}>
  <img src={listing.images} alt="list cover" className='h-20 w-20 object-contain' />
  </Link>
  <Link  to={`/listings/${listing._id}`}>

    <p className='text-slate-700 font-bold flex-1 hover:underline  truncate'>{listing.name}</p>
  </Link>
  <div className='flex flex-col items-center font-medium'>
    <button onClick={() =>deleteList(listing._id)} className='text-red-700'>Delete</button>
    <button className='text-green-700'>Edit</button>
  </div>
</div>
  ))}
</div>}
   </div>
  )
}

export default Profile