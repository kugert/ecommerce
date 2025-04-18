"use client";

import { useState, useEffect } from "react";

import {usePathname, useSearchParams} from "next/navigation";
import {Input} from "@/components/ui/input";

const AdminSearch = () => {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  let formActionUrl;
  if (pathName.includes("/admin/orders")) {
    formActionUrl = "/admin/orders";
  } else if (pathName.includes("/admin/users")) {
    formActionUrl = "/admin/users";
  } else {
    formActionUrl = "/admin/products";
  }

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
}

export default AdminSearch;
