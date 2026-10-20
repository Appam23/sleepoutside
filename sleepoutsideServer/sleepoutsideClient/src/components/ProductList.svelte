<script lang="ts">
  import { onMount } from "svelte";
  import { getProducts } from "../js/productData.mts";
  import type { Product } from "../js/types.mts";
  import { getParam } from "../js/utils.mts";
  import ProductSummary from "./ProductSummary.svelte";

  let category = $state("");
  let products: Product[] = $state([]);

  async function init() {
    category = getParam("category") || "";

    const data = await getProducts("", category);
    products = data.results;
  }

  onMount(init);
</script>

<h2>Top products: {category}</h2>

<ul class="product-list">
  {#each products as product}
    <ProductSummary product={product} />
  {/each}
</ul>