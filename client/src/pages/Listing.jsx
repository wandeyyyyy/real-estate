import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle'

const Listing = () => {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
const params = useParams();
    useEffect(() => {

        const fetchList = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listId}`);
            
    
            const data = await res.json();
            if(data.success === false){
                setError(true)
                setLoading(false)
                return;
            }
            setListing(data);
          setLoading(false);
          setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
    };
    fetchList();
},[params.listId])
  return (
 <main>
    {loading && <p className='text-center my-7 text-2xl font-medium'>LOADING...</p>} 
    {error && <p className='text-center my-7 text-2xl font-medium'>Oops!, Something Went Wrong</p>} 
    {listing && !loading && !error  && (
<>
<Swiper navigation>
    {listing.images.map((url) => (
        <SwiperSlide key={url}>
<div className='h-[500px] 'style={{background: `url(${url}) center no-repeat`,backgroundSize: 'cover'}}></div>
        </SwiperSlide>
    ))}
    </Swiper>
    </>
    )}
 </main>
    )
  
}

export default Listing