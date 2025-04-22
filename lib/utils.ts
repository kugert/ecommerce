import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// Format number with decimal places
export function formatNumberWithDecimalPlaces(
  value: number,
  decimalPlaces: number = 2
): string {
  const [int, decimal] = value.toString().split(".")
  return decimal ? `${int}.${decimal.padEnd(decimalPlaces, "0")}` : `${int}.00`
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    const fieldErrors = Object
        .keys(error.errors)
        .map((field) => error.errors[field].message);

    return fieldErrors.join(". ");
  } else if (error.name === "PrismaClientKnownRequestError" && error.code === "P2002") {
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  } else {
    return typeof error.message === "string" ? error.message : JSON.stringify(error);
  }
}

// Round number to two decimal places
export function round2(value: number | string): number {
  if (typeof value === "number" || typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error(`${value} is not a number`);
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

// Format currency using the CURRENCY_FORMATTER
export function formatCurrency(value: number | string | null){
    if (typeof value === "number"){
      return CURRENCY_FORMATTER.format(value);
    }

    if (typeof value === "string"){
        return CURRENCY_FORMATTER.format(Number(value));
    }

    return "NaN";
}

// Format number
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
export function formatNumber(value: number) {
  return NUMBER_FORMATTER.format(value);
}

// UUID shortening function
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Format date and time
export const formatDateTime = (dateString: Date) => {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        month: 'short', // abbreviated month name (e.g., 'Oct')
        year: 'numeric', // abbreviated month name (e.g., 'Oct')
        day: 'numeric', // numeric day of the month (e.g., '25')
        hour: 'numeric', // numeric hour (e.g., '8')
        minute: 'numeric', // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
        month: 'short', // abbreviated month name (e.g., 'Oct')
        year: 'numeric', // numeric year (e.g., '2023')
        day: 'numeric', // numeric day of the month (e.g., '25')
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric', // numeric hour (e.g., '8')
        minute: 'numeric', // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };
    const formattedDateTime: string = new Date(dateString).toLocaleString(
        'en-US',
        dateTimeOptions
    );
    const formattedDate: string = new Date(dateString).toLocaleString(
        'en-US',
        dateOptions
    );
    const formattedTime: string = new Date(dateString).toLocaleString(
        'en-US',
        timeOptions
    );
    return {
        dateTime: formattedDateTime,
        dateOnly: formattedDate,
        timeOnly: formattedTime,
    };
};

// Form the pagination links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string,
  key: string,
  value: string | null,
}) {
  const query = qs.parse(params);
  query[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query
  }, { skipNull: true });
}

export  function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function humanize(str: string){
    return str
        .replace("-", ' ')
        .toLowerCase()
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}
