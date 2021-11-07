import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image";

const getNearbyPlaces = async (lat, lot) => {
  const res = await fetch(`/api/places?lat=${lat}&lot=${lot}`);

  return res.json();
};

const getRecipesByIdsDetails = async (recipeId) => {
  const res = await fetch(`/api/recipeByIdsDetails?arrayOfIds=${recipeId}`);

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
      const recipeById = await getRecipesByIdsDetails([router.query.recipeId]);
      setRecipe(recipeById[0]);
    }
  }, []);

  return (
    <div className="container mx-auto bg-light-green">
      <button
        className="w-full flex justify-start p-4"
        onClick={() => {
          router.back();
        }}
      >
        <Image
          src="/assets/arrow-right.svg"
          height="30"
          width="30"
          className="rotate-180"
        />
      </button>
      <div className="flex flex-col align-baseline">
        {recipe && recipe.analyzedInstructions ? (
          <>
            <h1 className="text-4xl p-10 pt-2 text-center">{recipe.title}</h1>
            <div className="flex flex-col">
              <div className="flex justify-center">
                <img src={recipe.image} width="250px" className="rounded-2xl" />
              </div>
              <p className="p-10 text-justify">
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
              <div className="px-10">
                <span>{recipe.glutenFree && "🌾 - glutenfree"} </span>
                <span>{recipe.dairyFree && "🐄 - dairyfree"} </span>
              </div>
            </div>
          </>
        ) : null}

        <br />
        <div className="px-10 ">
          <h2 className="text-xl">You still need to buy: </h2>
          <ul className="mt-5">
            {router.query.missedIngredients &&
              router.query.missedIngredients
                .split(",")
                .map((ingredient) => <li className="">✔️ {ingredient}</li>)}
          </ul>
        </div>
        <div className="px-10 mt-10">
          <h2 className="text-xl">Shops nearby: </h2>
          <ul className="mt-5 mb-8">
            {isLoading
              ? "...loading"
              : stores.results
                  .filter((store) => !store.types.includes("supermarket"))
                  .slice(0, 5)
                  .map((store, index) => {
                    return (
                      <li className="text-white inline-block" key={index}>
                        <a
                          target="_blank"
                          href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${store.place_id}`}
                        >
                          🛒 {store.name}
                          <Image
                            src="/assets/arrow-right.svg"
                            height="10"
                            width="10"
                          />
                        </a>
                      </li>
                    );
                  })}
          </ul>
        </div>
      </div>
    </div>
  );
}
