import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
          onLoad={console.log}
          onChange={(e) => {
            const file = e.target.files?.[0];

            console.log(e);
            // async function quickstart() {
            //   // Imports the Google Cloud client library
            //   const vision = require("@google-cloud/vision");

            //   // Creates a client
            //   const client = new vision.ImageAnnotatorClient();

            //   // Performs label detection on the image file
            //   const [result] = await client.labelDetection(e.target.value);
            //   const labels = result.labelAnnotations;
            //   console.log("Labels:", labels);
            // }
            // quickstart();
            if (file) {
              const reader = new FileReader();
              reader.onload = function () {
                console.log(reader.result);
                setIsLoading(true);
              };

              reader.readAsBinaryString(file);
            }
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
