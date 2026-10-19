
import { getProducts } from "./productData.mts";

const searchForm = document.querySelector<HTMLFormElement>(
  "#product-search-form"
);
const searchInput = document.querySelector<HTMLInputElement>(
  "#product-search"
);
const categorySelect = document.querySelector<HTMLSelectElement>(
  "#product-category"
);
const productList = document.querySelector<HTMLUListElement>(
  "#product-list"
);
const previousButton = document.querySelector<HTMLButtonElement>(
  "#previous-page"
);
const nextButton = document.querySelector<HTMLButtonElement>(
  "#next-page"
);
const pageInfo = document.querySelector<HTMLElement>("#page-info");

const limit = 5;
let offset = 0;
let totalProducts = 0;

async function displayProducts() {
  if (!productList) return;

  productList.textContent = "Loading products...";

  try {
    const data = await getProducts(
      searchInput?.value.trim() ?? "",
      categorySelect?.value ?? "",
      limit,
      offset
    );

    totalProducts = data.count;
    productList.innerHTML = "";

    for (const product of data.results) {
      const item = document.createElement("li");
      item.className = "product-card";

      const link = document.createElement("a");
      link.href = `/products/${encodeURIComponent(product.id)}/`;

      const image = document.createElement("img");
      const imageUrl = product.images?.primaryMedium;

      if (imageUrl) {
        image.src = imageUrl.startsWith("//")
          ? `https:${imageUrl}`
          : imageUrl;
      }
      image.alt = product.name;

      const name = document.createElement("h2");
      name.className = "card__name";
      name.textContent = product.name;

      const price = document.createElement("p");
      price.className = "product-card__price";
      price.textContent = `$${Number(product.finalPrice).toFixed(2)}`;

      link.append(image, name, price);
      item.append(link);
      productList.append(item);
    }

    if (data.results.length === 0) {
      productList.textContent = "No products found.";
    }

    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.max(1, Math.ceil(totalProducts / limit));

    if (pageInfo) {
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    if (previousButton) {
      previousButton.disabled = offset === 0;
    }

    if (nextButton) {
      nextButton.disabled = offset + limit >= totalProducts;
    }
  } catch (error) {
    console.error("Error loading products:", error);
    productList.textContent = "Unable to load products.";

    if (previousButton) previousButton.disabled = true;
    if (nextButton) nextButton.disabled = true;
  }
}

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  offset = 0;
  displayProducts();
});

categorySelect?.addEventListener("change", () => {
  offset = 0;
  displayProducts();
});

previousButton?.addEventListener("click", () => {
  offset = Math.max(0, offset - limit);
  displayProducts();
});

nextButton?.addEventListener("click", () => {
  if (offset + limit < totalProducts) {
    offset += limit;
    displayProducts();
  }
});

displayProducts();
