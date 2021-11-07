import React from "react";
import Image from "next/image";

export default function Loader() {
  return (
    <div className="absolute h-full w-full flex justify-center items-center">
      <Image src="/assets/brocoli-loader.gif" width="300" height="200" />
    </div>
  );
}
