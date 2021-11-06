import React from "react";

const getNearbyPlaces = async (lat, lot) => {

    const res = await fetch(`/api/places?lat=${lat}&lot=${lot}`)

    return res.json();

}


export default function Result() {

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    const success = (pos) => {
        const crd = pos.coords;


        getNearbyPlaces(crd.latitude, crd.longitude).then(res => {
            console.log(res)
        }).catch(console.warn)

    };


    const error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    };


    React.useEffect(() => {


        window.navigator.geolocation.getCurrentPosition(
            success,
            error,
            options
        );
    }, []);

    return <div>you still need to buy:</div>;
}