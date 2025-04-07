import { cn } from "@/lib/utils";

interface ProductPriceProps {
    value: string;
    className?: string;
};

const ProductPrice = ({
    value,
    className,
}: ProductPriceProps) => {
    const stringValue = parseFloat(value).toFixed(2);
    const [intValue, floatValue] = stringValue.split(".")

    return (
        <p className={ cn("text-2xl", className) }>
            <span className="text-xs align-super">$</span>
            {intValue}
            <span className="text-xs align-super">.{floatValue}</span>
        </p>
    );
}

export default ProductPrice;