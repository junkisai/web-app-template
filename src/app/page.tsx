"use client";

import { NextPage } from "next";
import Image from "next/image";
import { AspectRatio } from "~/components/ui/aspect-ratio";

const IndexPage: NextPage = () => {
  return (
    <>
      <div className="w-[450px]">
        <AspectRatio ratio={16 / 9}>
          <Image
            src="/img/sample.webp"
            alt=""
            width={2560}
            height={1440}
            className="rounded-md object-cover w-full"
          />
        </AspectRatio>
      </div>
    </>
  );
};

export default IndexPage;
