import ModeToggle from "@/components/shared/header/mode-toggle";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {EllipsisVertical, ShoppingCart} from "lucide-react";
import {Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import UserButton from "@/components/shared/header/user-button";
import {getMyCart} from "@/lib/actions/cart.actions";

const Menu = async () => {
    const cart = await getMyCart();

    const itemCount = cart?.items.reduce(
      (a, c) => a + c.qty,
      0,
    ) || 0;

    return (
        <div className="flex justify-end gap-3">
            <nav className="hidden md:flex w-full max-w-xs gap-1">
                <ModeToggle />
                <Button asChild variant="ghost">
                  <Link href="/cart" className="flex items-center gap-2 relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <div
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-[10px] text-white"
                      >
                        {itemCount}
                      </div>
                    )}
                    Cart
                  </Link>
                </Button>
                <UserButton />
            </nav>
            <nav className="md:hidden">
                <Sheet>
                    <SheetTrigger className="align-middle">
                        <EllipsisVertical />
                    </SheetTrigger>
                    <SheetContent className="flex flex-col items-start">
                        <SheetTitle>Menu</SheetTitle>
                        <SheetDescription></SheetDescription>
                        <ModeToggle />
                        <Button asChild variant="ghost">
                            <Link href="/cart">
                                <ShoppingCart /> Cart
                            </Link>
                        </Button>
                        <UserButton />
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    );
};

export default Menu;
