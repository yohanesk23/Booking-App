import React from "react";

import AboutUs from "./AboutUs";
import Join from "./Join";
import Loading from "./Header";
import Partners from "./Partners";
import Subscribe from "./Subscribe";

export const Home = () => {
  return (
    <>
      <Loading />
      <AboutUs />
      <Join />
      <Subscribe />
    </>
  );
};
