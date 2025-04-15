const BASE_URL = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {
    createOrder: async function createOrder(price: number){
        const accessToken = await generatePayPalAccessToken();
        const url = `${BASE_URL}/v2/checkout/orders`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: price,
                        },
                    },
                ],
            }),
        });

        return handleResponse(response);
    },
    capturePayment: async function capturePayment(orderId: string){
        const accessToken = await generatePayPalAccessToken();
        const url = `${BASE_URL}/v2/checkout/orders/${orderId}/capture`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return handleResponse(response);
    },
};

// Generate a PayPal token
async function generatePayPalAccessToken() {
    const { PAYPAL_APP_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
    const auth = Buffer.from(`${PAYPAL_APP_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString("base64");

    const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })

    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}

async function handleResponse(response: Response) {
    if (response.ok) {
        return await response.json();
    } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

export { generatePayPalAccessToken };
