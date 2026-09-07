"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import AddToCartButton from "@/features/cart/add-to-cart-button";
import kyInstance from "@/lib/ky";
import type { Product } from "@/types/product";

import PriceView from "./price-view";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["products-search", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      return kyInstance
        .get(`/api/products/search?q=${encodeURIComponent(debouncedSearch)}`)
        .json<Product[]>();
    },
    enabled: !!debouncedSearch,
  });

  return (
    <Dialog open={showSearch} onOpenChange={setShowSearch}>
      <DialogTrigger
        onClick={() => setShowSearch(true)}
        className="flex items-center hover:cursor-pointer"
        asChild
      >
        <Button
          variant="ghost"
          size="icon"
          className="flex rounded-full p-0 text-foreground transition-transform hover:scale-110"
        >
          <Search className="h-5.5 w-5.5 stroke-[1.2]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-1/2! flex h-[90vh] -translate-y-1/2! flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mb-3">Product Searchbar</DialogTitle>
          <form className="relative" onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder="Search your product here..."
              className="flex-1 rounded-md py-5 font-semibold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <X
                onClick={() => setSearch("")}
                className="absolute top-3 right-11 h-4 w-4 cursor-pointer transition-colors duration-200 hover:text-red-600"
              />
            )}
            <button
              type="submit"
              className="absolute top-0 right-0 flex h-full w-10 items-center justify-center rounded-tr-md bg-primary/10 transition-all duration-200 hover:bg-primary hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </DialogHeader>
        <div className="w-full flex-1 overflow-y-auto rounded-md border border-primary/20 bg-transparent">
          <div className="">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.p
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center gap-1 px-6 py-10 text-center font-semibold text-primary"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching in progress...
                </motion.p>
              ) : products?.length ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {products.map((product: Product, index: number) => (
                    <motion.div
                      key={product?._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="overflow-hidden border-b border-primary/10 bg-transparent transition-colors duration-200 hover:bg-muted/50"
                    >
                      <div className="flex items-center p-1">
                        <Link
                          href={`/products/${product?.slug}`}
                          onClick={() => setShowSearch(false)}
                          className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-primary/20 md:h-24 md:w-24"
                        >
                          {product?.media?.items?.[0]?.image?.url && (
                            <Image
                              fill
                              src={product.media.items[0].image.url}
                              alt={product.name}
                              className="pointer-events-none h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onClick={(e) => e.preventDefault()}
                            />
                          )}
                        </Link>
                        <div className="grow px-4 py-2">
                          <div className="flex items-start justify-between">
                            <Link
                              href={`/products/${product?.slug}`}
                              onClick={() => setShowSearch(false)}
                            >
                              <h3 className="line-clamp-1 text-sm font-semibold text-gray-800 transition-colors duration-200 hover:text-primary md:text-lg">
                                {product.name}
                              </h3>
                              <p className="line-clamp-1 text-sm text-gray-600">
                                {product.description
                                  ?.replace(/<[^>]*>/g, "")
                                  .substring(0, 100)}
                                ...
                              </p>
                            </Link>
                            <PriceView
                              price={product.priceData?.price}
                              discountedPrice={
                                product.priceData?.discountedPrice
                              }
                              className="md:text-lg"
                            />
                          </div>

                          <div className="mt-1 w-full sm:w-60">
                            <AddToCartButton
                              product={product}
                              selectedOptions={{}}
                              quantity={1}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="py-10 text-center font-semibold tracking-wide"
                >
                  {search ? (
                    <p>
                      Nothing match with the keyword{" "}
                      <span className="text-destructive underline">
                        {search}
                      </span>
                      . Please try something else.
                    </p>
                  ) : (
                    <p className="flex items-center justify-center gap-1 text-primary-foreground">
                      <Search className="h-5 w-5" />
                      Search and explore your products.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
