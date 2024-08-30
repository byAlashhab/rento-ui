import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  CompassIcon,
  DollarSignIcon,
  HouseIcon,
  ThumbsUpIcon,
} from "lucide-react";
import CategoryItem from "./CategoryItem";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function Home({
  isloggedin,
  user,
  refetchUserState,
}: {
  isloggedin: boolean;
  user: { firstname: string; lastname: string; role: string };
  refetchUserState: Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <Navbar
        isloggedin={isloggedin}
        user={user}
        refetchUserState={refetchUserState}
      />

      <main className="relative bg-[url('/images/main.png')] bg-cover bg-no-repeat bg-center  h-[600px]">
        <h1 className="w-fit h-fit font-bold text-5xl absolute inset-0 m-auto">
          Discover Your <span className="text-destructive">Perfect Rental</span>{" "}
          <p className="text-lg font-normal text-center mt-4">
            browse a lot of beatiful places in one place
          </p>
        </h1>
      </main>
      {isloggedin ? (
        <>
          <h2 className="text-center font-bold text-3xl mt-10">
            Browse From Different Categories
          </h2>
          <div className="flex w-24 mx-auto">
            <p className="w-20 h-1 bg-destructive mb-10 mt-1 mx-auto rounded"></p>
            <p className="w-2 h-1 bg-destructive mb-10 mt-1 mx-auto rounded"></p>
          </div>

          <div className="flex justify-evenly items-center mb-10">
            {[
              {
                category: "Holiday Rentals",
                icon: (
                  <div className="bg-red-100 rounded-full p-2">
                    <ThumbsUpIcon className="text-destructive" />
                  </div>
                ),
                hoverColor: "hover:bg-red-200",
              },
              {
                category: "Residential Spaces",
                icon: (
                  <div className="bg-green-100 rounded-full p-2">
                    <HouseIcon className="text-green-500" />
                  </div>
                ),
                hoverColor: "hover:bg-green-200",
              },
              {
                category: "Event Spaces",
                icon: (
                  <div className="bg-purple-100 rounded-full p-2">
                    <CompassIcon className="text-purple-500" />
                  </div>
                ),
                hoverColor: "hover:bg-purple-200",
              },
              {
                category: "Commercial Properties",
                icon: (
                  <div className="bg-sky-100   rounded-full p-2">
                    <DollarSignIcon className="text-sky-500" />
                  </div>
                ),
                hoverColor: "hover:bg-sky-200",
              },
            ].map((item) => (
              <CategoryItem
                category={item.category}
                icon={item.icon}
                hoverColor={item.hoverColor}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-2xl">
          <Button asChild>
            <Link to={"/login"}>Log in to continue</Link>
          </Button>
        </div>
      )}
    </>
  );
}

export default Home;
