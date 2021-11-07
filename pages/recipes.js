import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import Image from "next/image";

const getMissingProducts = async (ingredients) => {
  const res = await fetch(`/api/missingProducts?ingredients=${ingredients}`);
  return res.json();
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();

  useEffect(async () => {
    if (router.query.ingredients) {
      const recipes = await getMissingProducts(router.query.ingredients);
      setRecipes(recipes);
      setIsLoading(false);
    }
  }, [router.query.ingredients]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center bg-light-green p-4">
      <button
        className="w-full flex justify-start mb-4"
        onClick={() => {
          router.push("/");
        }}
      >
        <Image
          src="/assets/arrow-right.svg"
          height="30"
          width="30"
          className="rotate-180"
        />
      </button>
      <div className="flex flex-col space-y-4 overflow-scroll">
        {recipes.map((recipe) => {
          return (
            <div
              key={recipe.id}
              className="flex bg-white rounded-2xl justify-center items-center"
            >
              <img src={recipe.image} className="w-32 h-32 rounded-xl" />
              <div className="text-xl text-left mx-2">{recipe.title}</div>

              <button
                onClick={() => {
                  router.push({
                    pathname: "/result",
                    query: {
                      recipeId: recipe.id,
                      missedIngredients: recipe.missedIngredients
                        .map((ingredient) => ingredient.name.toLowerCase())
                        .join(",")
                    }
                  });
                }}
                className="text-light-green"
              >
                <div className="mr-4 underline">choose this recipe</div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
