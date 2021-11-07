import React, { useState } from "react";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import Image from "next/image";

const GUESS = "guess";
const TYPED = "typed";
const DISMISSIBLE = "dismissible";

export default function Home() {
  const [currentProduct, setCurrentProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const router = useRouter();

  const searchRecipes = async () => {
    router.push({
      pathname: "/recipes",
      query: {
        ingredients: products.join(",")
      }
    });
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-light-green">
      <div className="text-white">
        <div className="font-extrabold text-6xl flex">
          <div>SnapCook</div>
          <Image
            src="/assets/chefs-hat.svg"
            height="60"
            width="60"
            className="-rotate-45"
          />
        </div>
        <div>Add ingredients manually or scan them</div>
      </div>
      <div className="flex space-x-2 p-4">
        <input
          value={currentProduct}
          onChange={(e) => {
            setCurrentProduct(e.target.value);
          }}
          className="rounded-2xl border-white border-4 p-2 items-center flex-grow"
        />
        <button
          disabled={!currentProduct}
          onClick={() => {
            setProducts([
              ...products,
              { title: currentProduct.toLowerCase(), type: TYPED }
            ]);
            setCurrentProduct("");
          }}
          className="rounded-2xl border-white border-4 px-2 flex justify-center items-center"
        >
          <Image src="/assets/enter.svg" height="40" width="40" />
        </button>
        <div className="rounded-2xl border-white border-4 px-2 flex justify-center items-center">
          <label for="file-input" className="flex justify-center items-center">
            <Image src="/assets/camera.svg" height="40" width="40" />
          </label>
          <input
            className="hidden"
            id="file-input"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              setIsLoading(true);
              if (e.target.files.length === 0) {
                return;
              }
              const response = await uploadImage(e.target.files);
              setGuesses(response.guesses);
              setIsLoading(false);
            }}
          />
        </div>
      </div>
      <div className="flex p-4 space-x-4 flex-wrap space-y-4">
        {products.map((product, index) => {
          return (
            <button
              onClick={() => {
                setProducts(products.filter((_, i) => i !== index));
              }}
              key={index}
              className="flex bg-white rounded-2xl py-1 px-4 justify-center items-center"
            >
              <div className="font-light text-xl text-light-green mr-2">
                {product}
              </div>
              <Image src="/assets/delete.svg" height="20" width="20" />
            </button>
          );
        })}

        {products.map((product, index) => {
          return (
            <div key={index} className="flex space-x-2">
              <div>{product.title}</div>
              <button
                className="border-solid border-2 p-2"
                onClick={() => {
                  if (product.type === GUESS) {
                    setGuesses([...guesses, product.title]);
                  }
                  setProducts(products.filter((_, i) => i !== index));
                }}
              >
                -
              </button>
            </div>
          );
        })}
      </div>
      {products.length > 0 && (
        <button
          onClick={searchRecipes}
          className="m-6 border-solid font-bold text-xl text-white p-2 px-4 absolute bottom-0 rounded-2xl border-white border-4"
        >
          search recipes
        </button>
      )}

      <div className="grid grid-cols-3">
        {guesses.map((guess, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setProducts([
                  ...products,
                  { title: guess.toLowerCase(), type: GUESS }
                ]);
                setGuesses(
                  guesses.filter(
                    (guessToRemove) =>
                      guessToRemove.toLowerCase() !== guess.toLowerCase()
                  )
                );
              }}
            >
              {guess.toLowerCase()}
            </button>
          );
        })}
      </div>
      {guesses.length > 0 && (
        <button
          onClick={() => {
            setProducts(
              products.map((product) => {
                if (product.type === GUESS) {
                  product.type = DISMISSIBLE;
                }
                return product;
              })
            );
            setGuesses([]);
          }}
          className="border-solid border-2 p-2"
        >
          Close
        </button>
      )}
    </div>
  );
}
