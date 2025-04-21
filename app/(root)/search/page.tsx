import { getAllProducts } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/product.actions";
import ProductCard from "@/components/shared/product/product-card";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const prices = [
  { name: "All", value: "all" },
  { name: "$1 to $50", value: "1-50" },
  { name: "$51 to $100", value: "51-100" },
  { name: "$101 to $200", value: "101-200" },
  { name: "$201 to $500", value: "201-500" },
  { name: "$501 and above", value: "501-1000000" },
];

const ratings = [
  { name: "All", value: "all" },
  { name: "1 Star & Up", value: "1" },
  { name: "2 Stars & Up", value: "2" },
  { name: "3 Stars & Up", value: "3" },
  { name: "4 Stars & Up", value: "4" },
];

const sortOptions = ["latest", "lowest", "highest", "top-rated", "lowest-rated"];

type SearchParams = {
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
  page?: string;
}

const isSearchParam = (value: string) => {
  return value !== "all" && value !== "" && value.trim() !== "";
}

export async function generateMetadata(props: {
  searchParams: Promise<SearchParams & {q?: string}>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const querySet = isSearchParam(q) ? q : '';
  const categorySet = isSearchParam(category) ? `: Category ${category}` : '';
  const priceSet = isSearchParam(price) ? `: Price ${price}` : '';
  const ratingSet = isSearchParam(rating) ? `: Rating ${rating}↑` : '';

  if (querySet || categorySet || priceSet || ratingSet ) {
    return {
      title: `Search ${querySet} ${categorySet} ${priceSet} ${ratingSet}`,
    }
  }

  return {
    title: "Search Products",
  };
}

const SearchPage = async (props: {
  searchParams: Promise<SearchParams & {q?: string}>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "latest",
    page = "1",
  } = await props.searchParams;

  const products = await getAllProducts({
    query: q,
    category: category ?? "all",
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  const getFilterUrl = ({
    category: filter_category,
    sort: filter_sort,
    price: filter_price,
    rating: filter_rating,
    page: filter_page,
  }: SearchParams) => {
    const params = {q, category, price, rating, sort, page};

    if (filter_category) params.category = filter_category;
    if (filter_sort) params.sort = filter_sort;
    if (filter_price) params.price = filter_price;
    if (filter_rating) params.rating = filter_rating;
    if (filter_page) params.page = filter_page;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <div className="text-xl mb-2 mt-3">Category</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ category: "all" })}
                className={`${(category === "all" || category === "") && "font-bold"}`}
              >All</Link>
            </li>
            {categories.map((ctg) => (
              <li key={ctg.category}>
                <Link
                  href={getFilterUrl({ category: ctg.category })}
                  className={`${(category === ctg.category) && "font-bold"}`}
                >{ctg.category}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xl mb-2 mt-3">Price</div>
        <div>
          <ul className="space-y-1">
            {prices.map((prc) => (
              <li key={prc.value}>
                <Link
                  href={getFilterUrl({ price: prc.value })}
                  className={`${(price === prc.value) && "font-bold"}`}
                >{prc.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xl mb-2 mt-3">Rating</div>
        <div>
          <ul className="space-y-1">
            {ratings.map((rtn) => (
              <li key={rtn.value}>
                <Link
                  href={getFilterUrl({ rating: rtn.value })}
                  className={`${(rating === rtn.value) && "font-bold"}`}
                >{rtn.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col my-4 md:flex-row">
          <div className="flex items-center">
            { q !== "all" && q !== "" && "Query: " + q }
            { category !== "all" && category !== "" && " Category: " + category }
            { price !== "all" && price !== "" && " Price: " + price }
            { rating !== "all" && rating !== "" && " Rating: " + rating + " stars & up"}
            &nbsp;
            {isSearchParam(q) || isSearchParam(category) || isSearchParam(price) || isSearchParam(rating) ? (
              <Button variant="link" asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by: {" "}
            {sortOptions.map((srt) => (
              <Link
                key={srt}
                href={getFilterUrl({ sort: srt })}
                className={`mx-2 ${(sort == srt) && "font-bold"}`}
              >{srt}</Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && (
            <div>No products found.</div>
          )}
          {products.data.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
