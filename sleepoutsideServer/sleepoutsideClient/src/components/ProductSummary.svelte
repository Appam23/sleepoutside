<script lang="ts">
  import type { Product } from "../js/types.mts";

  let { product }: { product: Product } = $props();
</script>

<li class="product-card">
  <a href={`/products/${product.id}/`}>
    <img
      src={product.images.primaryMedium}
      srcset={`${product.images.primarySmall} 80w, ${product.images.primaryMedium} 160w, ${product.images.primaryLarge} 320w`}
      sizes="(min-width: 900px) 250px, (min-width: 600px) 30vw, 90vw"
      alt={product.name}
    />

    <h3 class="card__brand">{product.brand.name}</h3>

    <h2 class="card__name">{product.name}</h2>

    <p class="product-card__price">${product.finalPrice.toFixed(2)}</p>
  </a>
</li>