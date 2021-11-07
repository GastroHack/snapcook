import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "../components/Loader";

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
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="grid grid-cols-3">
        {recipes.map((recipe) => {
          return (
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
              key={recipe.id}
            >
              {recipe.title}
              <img src={recipe.image} className="w-24 h-24 rounded-xl" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
