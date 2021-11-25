import React, { useState } from "react";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import Image from "next/image";
import DeleteButton from "../components/DeleteButton";

const GUESS = "guess";
const TYPED = "typed";
const DISMISSIBLE = "dismissible";

export default function Home() {
  const [currentProduct, setCurrentProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const router = useRouter();

  console.log("trigger build test");

  const searchRecipes = async () => {
    router.push({
      pathname: "/recipes",
      query: {
        ingredients: products.map((product) => product.title).join(",")
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
      <div className="text-white p-4">
        <div className="font-extrabold text-6xl flex">
          <div>SnapCook</div>
          <Image
            src="/assets/chefs-hat.svg"
            height="60"
            width="60"
            className="-rotate-45"
          />
        </div>
        <div>Cook from leftovers</div>
      </div>
      <div className="flex space-x-2 p-4">
        <input
          value={currentProduct}
          onChange={(e) => {
            setCurrentProduct(e.target.value);
          }}
          className="rounded-2xl border-white border-4 p-2 items-center flex-grow"
          placeholder="Add an ingredient..."
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
          <label
            htmlFor="file-input"
            className="flex justify-center items-center"
          >
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
                if (product.type === GUESS) {
                  setGuesses([...guesses, product.title]);
                }
                setProducts(products.filter((_, i) => i !== index));
              }}
              key={index}
              className="flex bg-white rounded-2xl py-1 px-4 justify-center items-center"
            >
              <div className="font-light text-xl text-light-green mr-2">
                {product.title}
              </div>
              <DeleteButton className="text-light-green" />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col border-solid rounded-2xl border-white px-4 py-2 space-y-2">
        {guesses.length > 0 && (
          <div className="flex w-full justify-end items-center">
            <p className="text-white flex-grow ">Pick from suggestions:</p>
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
            >
              <DeleteButton className="text-white" width="30" height="30" />
            </button>
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
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
                className="border-solid border-2 rounded-2xl border-white text-white"
              >
                {guess.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>
      {products.length > 0 && (
        <button
          onClick={searchRecipes}
          className="m-6 border-solid font-bold text-xl text-white p-2 px-4 rounded-2xl absolute bottom-0 right-0 border-white border-4 flex items-center"
        >
          <div className="mr-4">search recipes</div>
          <Image src="/assets/arrow-right.svg" height="20" width="20" />
        </button>
      )}
    </div>
  );
}
