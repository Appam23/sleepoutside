import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders"; // Not available with legacy API

// we can also create collections that load from markdown files in a directory...this is an example of how to do that.
// const posts = defineCollection({
//   loader: glob({ pattern: "**/*.md", base: "./src/content/blog" })
// });

// load our product info from the tents.json file
const products = defineCollection({
  loader: async () => {
    const response = await fetch(
      import.meta.env.PUBLIC_SERVER_URL + "products?limit=200"
    );
    const data = await response.json();
    // Must return an array of entries with an id property, or an object with IDs as keys and entries as values
    return data.results
  },
});

export const collections = { products };