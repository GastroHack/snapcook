import { useRouter } from "next/router";
import React, { useState } from "react";

const getNearbyPlaces = async (lat, lot) => {
  const res = await fetch(`/api/places?lat=${lat}&lot=${lot}`);

  return res.json();
};

const getRecipesByIdsDetails = async (arrayOfIds) => {
  const res = await fetch(`/api/recipeByIdsDetails?arrayOfIds=${arrayOfIds}`);

  return res.json();
};

export default function Result() {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const success = (pos) => {
    const crd = pos.coords;

    getNearbyPlaces(crd.latitude, crd.longitude)
      .then((res) => {
        setStores(res);
        setIsLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  React.useEffect(async () => {
    window.navigator.geolocation.getCurrentPosition(success);

    if (router.query.recipeId) {
      const recipesById = await getRecipesByIdsDetails([router.query.recipeId]);
      setRecipe(recipesById[0]);
    }
  }, []);

  return (
    <div>
      {recipe && recipe.analyzedInstructions ? (
        <>
          <p>{recipe.title}</p>
          <p>
            {recipe.analyzedInstructions
              .map(({ steps }) => {
                return steps
                  .map(({ step }) => {
                    return step;
                  })
                  .join(",");
              })
              .flat()}
          </p>
        </>
      ) : null}
      <div>you still need to buy: </div>
      <div>
        <ul>
          {isLoading
            ? "...loading"
            : stores.results.map((store, index) => {
                return (
                  <li key={index}>
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
