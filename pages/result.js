import { useRouter } from "next/router";
import React, { useState } from "react";

const getNearbyPlaces = async (lat, lot) => {
  const res = await fetch(`/api/places?lat=${lat}&lot=${lot}`);

  return res.json();
};

const getRecipeDetails = async (id) => {
  const res = await fetch(`/api/recipeDetails?id=${id}`);

  return res.json();
};

export default function Result() {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const success = (pos) => {
    const crd = pos.coords;

    getNearbyPlaces(crd.latitude, crd.longitude)
      .then((res) => {
        console.log(res);
        setStores(res);
        setIsLoading(false);
      })
      .catch(console.warn);
  };

  React.useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(success);
    console.log(router);
    getRecipeDetails(router.query.recipeId);
  }, []);

  return (
    <div>
      <div>you still need to buy: </div>
      <div>
        <ul>
          {isLoading
            ? "...loading"
            : stores.results.map((store) => {
                return (
                  <li>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${store.geometry.location.lat},${store.geometry.location.lng}`}
                    >
                      {store.name}
                    </a>
                  </li>
                );
              })}
        </ul>
      </div>
    </div>
  );
}
