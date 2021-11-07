import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const getMissingProducts = async (products) => {
  const res = await fetch(
    `/api/missingProducts?ingredients=${products.join(",")}`
  );
  return res.json();
};

function uploadImage(file) {
  const formData = new FormData();
  formData.append("files", file[0]);

  return fetch("/api/guesser", {
    method: "POST",
    body: formData
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("response", err);
      throw err;
    });
}

export default function Home() {
  const [currentProduct, setCurrentProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const router = useRouter();

  const searchRecipes = async () => {
    const recipes = await getMissingProducts(products);
    setRecipes(recipes);
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="flex space-x-2">
        <input
          value={currentProduct}
          onChange={(e) => {
            setCurrentProduct(e.target.value);
          }}
          className="border-solid border-2 p-2"
        />
        <button
          disabled={!currentProduct}
          onClick={() => {
            setProducts([...products, currentProduct]);
            setCurrentProduct("");
          }}
          className="border-solid border-2 p-2"
        >
          Add product
        </button>
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            if (e.target.files.length === 0) {
              return;
            }
            const response = await uploadImage(e.target.files);
            setGuesses(response.guesses);
          }}
        />

        {isLoading && <div>loading data...</div>}
      </div>

      {products.map((product, index) => {
        return (
          <div key={index} className="flex space-x-2">
            <div>{product}</div>
            <button
              className="border-solid border-2 p-2"
              onClick={() => {
                setProducts(products.filter((_, i) => i !== index));
              }}
            >
              -
            </button>
          </div>
        );
      })}

      {products.length > 0 && (
        <button onClick={searchRecipes} className="border-solid border-2 p-2">
          search recipes
        </button>
      )}

      <div className="grid grid-cols-3">
        {guesses.map((guess, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setProducts([...products, guess.toLowerCase()]);
              }}
            >
              {guess}
            </button>
          );
        })}
      </div>

      {recipes.map((recipe) => {
        return (
          <button
            onClick={() => {
              router.push({
                pathname: "/result",
                query: { recipeId: recipe.id }
              });
            }}
            key={recipe.id}
          >
            {recipe.title}
            <img src={recipe.image} className="w-12 h-12 rounded" />
          </button>
        );
      })}
    </div>
  );
}
