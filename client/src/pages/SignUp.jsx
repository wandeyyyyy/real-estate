import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {

const [formData, setFormData] = useState({});
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
     [e.target.id]: e.target.value,
    })
  }
 // submit to the backend
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
      const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        console.log(data);
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
  
  } catch (error) {
    setLoading(false);
    setError(null);
    navigate('/sign-in');
  }

 }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-bold my-7'>
        Sign Up
      </h1>
      <form className='flex flex-col gap-4'>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button onClick={handleSubmit} disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 font-semibold cursor-pointer'>
          { loading ? 'Loading... ':'Sign Up'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700 font-semibold'>
            Sign In
          </span>
        </Link>

      </div>
         {error &&  <p className='text-red-500 mt-5'>{error}</p>} 
    </div>
  )
}

export default SignUp