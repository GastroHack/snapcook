import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const GUESS  = 'guess';
const TYPED = 'typed';
const DISMISSIBLE = 'dismissible';

const getMissingProducts = async (products) => {
  const res = await fetch(
    `/api/missingProducts?ingredients=${products.join(",")}`
  );
  return res.json();
};


export default function Home() {
  const [currentProduct, setCurrentProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const router = useRouter();

  const searchRecipes = async () => {
    const recipes = await getMissingProducts(products.map((product) => {
        return product.title
    }));
    setRecipes(recipes);
    setIsLoading(false);
  };

    function uploadImage(file) {
        const formData = new FormData();
        formData.append("files", file[0]);
        setIsLoading(true);

        return fetch("/api/guesser", {
            method: "POST",
            body: formData
        })
            .then((response) => {
                setIsLoading(false);
                return response.json();
            })
            .catch((err) => {
                console.log("response", err);
                setIsLoading(false);
                throw err;
            });
    }

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
            setProducts([...products, {title:currentProduct.toLowerCase(), type:TYPED}]);
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
            <div>{product.title}</div>
            <button
              className="border-solid border-2 p-2"
              onClick={() => {
                  if(product.type === GUESS) {
                     setGuesses([...guesses, product.title])
                  }
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
                setProducts([...products, {title:guess.toLowerCase(), type:GUESS}]);
                  setGuesses(guesses.filter((guessToRemove) => guessToRemove.toLowerCase() !== guess.toLowerCase()));
              }}
            >
              {guess.toLowerCase()}
            </button>
          );
        })}
      </div>
        {guesses.length > 0 && (
            <button onClick={() => {
                setProducts(products.map((product) => {
                    if(product.type === GUESS) {
                        product.type=DISMISSIBLE;
                    }
                    return product;
                }))
                setGuesses([])
            }} className="border-solid border-2 p-2">
                Close
            </button>
        )}
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
            <img src={recipe.image} className="w-12 h-12 rounded" alt={recipe.title}/>
          </button>
        );
      })}
    </div>
  );
}
