import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

const Listing = () => {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                console.log(data);
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]); // Include params.listingId as a dependency
    return (
        <main>
                <div className="container text-center my-7">
                        {loading && <h1>Loading...</h1>}
                        {error && <h1>Error</h1>}
                        {listing && !loading && !error &&(
                        <>
                                <Swiper navigation>
                                        {listing.imageUrls.map((image, index) => (
                                                <SwiperSlide key={image}>
                                                        <div className="h-[550px]" style={{background:`url(${image}) center no-repeat`,backgroundSize:'cover'
                                                    }}>

                                                        </div>
                                                </SwiperSlide>
                                        ))}
                                </Swiper>
                        </>
                        )}
                </div>
        </main>

    )
};

export default Listing;
