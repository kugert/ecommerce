import {Card, CardContent} from "@/components/ui/card";
import {DollarSign, Headset, ShoppingBag, WalletCards} from "lucide-react";

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-small font-bold">Free Shipping</div>
            <div className="text-sm text-muted-foreground">
              Free shipping on orders above $100
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign />
            <div className="text-small font-bold">Money Back Guarantee</div>
            <div className="text-sm text-muted-foreground">
              Within 30 days of purchase
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-small font-bold">Flexible Payment</div>
            <div className="text-sm text-muted-foreground">
              Pay with Credit Card, PayPal, or Cash
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-small font-bold">24/7 Support</div>
            <div className="text-sm text-muted-foreground">
              Get support anytime, anywhere
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default IconBoxes;
