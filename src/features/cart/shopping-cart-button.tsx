import { Loader2, ShoppingCartIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import IKImage from "@/components/common/ik-image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from "@/hooks/cart";
import { FREE_SHIPPING_THRESHOLD_ITEMS, SHIPPING_COST } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

import CheckoutButton from "./checkout-button";

interface ShoppingCartButtonProps {
  className?: string;
}

export default function ShoppingCartButton({
  className,
}: ShoppingCartButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const cartQuery = useCart(null);
  const totalQuantity =
    cartQuery.data?.items?.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    ) || 0;

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          className={cn("rounded-full", className)}
          size="icon"
          onClick={() => setSheetOpen(true)}
        >
          <ShoppingCartIcon />
          <span className="absolute top-0 right-0 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {totalQuantity < 10 ? totalQuantity : "9+"}
          </span>
        </Button>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex flex-col p-6 sm:max-w-lg">
          <SheetHeader className="p-1">
            <SheetTitle>
              Your cart{" "}
              <span className="text-base">
                ({totalQuantity}
                {totalQuantity === 1 ? "item" : "items"})
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex grow flex-col space-y-5 overflow-y-auto pt-1">
            {cartQuery.isLoading || cartQuery.isPending ? (
              <div className="flex grow items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : cartQuery.data?.items.length === 0 ? (
              <div className="flex grow items-center justify-center text-center">
                <div className="space-y-1.5">
                  <p className="text-lg font-semibold">Your cart is empty</p>
                  <Link
                    href="/#collections"
                    className="text-primary hover:underline"
                    onClick={() => setSheetOpen(false)}
                  >
                    Start shopping now
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="space-y-5">
                {cartQuery.data?.items.map((item) => (
                  <ShoppingCartItem
                    key={item.cartItemId}
                    item={item}
                    onProductLinkClicked={() => setSheetOpen(false)}
                  />
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal amount:</span>
                <span className="font-semibold">
                  {formatCurrency(cartQuery.data?.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Delivery Charge:</span>
                <span>
                  {totalQuantity >= FREE_SHIPPING_THRESHOLD_ITEMS
                    ? "Free"
                    : formatCurrency(SHIPPING_COST)}
                </span>
              </div>

              <div className="flex justify-between pt-2 text-lg font-bold">
                <span>Total:</span>
                <span>
                  {formatCurrency(
                    (cartQuery.data?.subtotal as number) +
                      (totalQuantity >= FREE_SHIPPING_THRESHOLD_ITEMS
                        ? 0
                        : SHIPPING_COST)
                  )}
                </span>
              </div>

              {totalQuantity < FREE_SHIPPING_THRESHOLD_ITEMS && (
                <p className="mt-1 text-center text-xs font-medium text-green-600">
                  Add {FREE_SHIPPING_THRESHOLD_ITEMS - totalQuantity} more{" "}
                  {FREE_SHIPPING_THRESHOLD_ITEMS - totalQuantity === 1
                    ? "item"
                    : "items"}{" "}
                  for FREE delivery!
                </p>
              )}
            </div>
            <CheckoutButton
              disabled={!totalQuantity}
              size="lg"
              className="w-full"
              onSuccess={() => setSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface ShoppingCartItemProps {
  item: CartItem;
  onProductLinkClicked: () => void;
}
function ShoppingCartItem({
  item,
  onProductLinkClicked,
}: ShoppingCartItemProps) {
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();

  const product = item.product;
  const cartItemId = item.cartItemId;
  const slug = product.slug;

  const quantityLimitReached =
    !!product.stockQuantity && item.quantity >= product.stockQuantity;

  const price = product.discountedPrice;
  return (
    <li className="flex items-center gap-3">
      <div className="relative size-fit flex-none">
        <Link href={`/products/${slug}`} onClick={onProductLinkClicked}>
          <IKImage
            src={product.imageUrl || ""}
            width={110}
            height={110}
            alt={product.name}
            className="flex-none bg-secondary"
          />
        </Link>
        <button
          className="absolute -top-1 -right-1 rounded-full border bg-background p-0.5"
          onClick={() => removeItemMutation.mutate(cartItemId)}
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="space-y-1.5 text-sm">
        <Link href={`/products/${slug}`} onClick={onProductLinkClicked}>
          <p className="font-bold">{product.name}</p>
        </Link>
        {item.selectedOptions &&
          Object.keys(item.selectedOptions).length > 0 && (
            <div className="text-xs text-muted-foreground">
              {Object.entries(item.selectedOptions).map(([key, value]) => (
                <span key={key} className="block">
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
        <div className="flex items-center gap-2">
          {item.quantity} x {formatCurrency(price)}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={item.quantity === 1}
            onClick={() =>
              updateQuantityMutation.mutate({
                itemId: cartItemId,
                newQuantity: !item.quantity ? 0 : item.quantity - 1,
              })
            }
          >
            -
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={quantityLimitReached}
            onClick={() =>
              updateQuantityMutation.mutate({
                itemId: cartItemId,
                newQuantity: !item.quantity ? 0 : item.quantity + 1,
              })
            }
          >
            +
          </Button>
          {quantityLimitReached && <span>Quantity limit reached</span>}
        </div>
      </div>
    </li>
  );
}
