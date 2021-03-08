import React from "react";
import { Root, addPrefetchExcludes } from "react-static";

import Layout from "./components/Layout";

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(["dynamic"]);

function App() {
  return (
    <Root>
      <Layout />
    </Root>
  );
}

export default App;
