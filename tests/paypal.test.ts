import { paypal, generatePayPalAccessToken } from "../lib/paypal";

test("Generates a PayPal access token", async () => {
    const tokenResponse: string = await generatePayPalAccessToken();

    expect(typeof tokenResponse).toBe("string");
    expect(tokenResponse.length).toBeGreaterThan(0);
});

test("Create PayPal order", async () => {
    await generatePayPalAccessToken();

    const price = 10.0;

    const orderResponse = await paypal.createOrder(price);

    expect(orderResponse).toHaveProperty("id");
    expect(orderResponse).toHaveProperty("status");
    expect(orderResponse.status).toBe("CREATED");
});

test("Simulate capturing payment", async () => {
    await generatePayPalAccessToken();
    const orderId = "100";

    const mockCapturePayment = jest
        .spyOn(paypal, "capturePayment")
        .mockResolvedValue({
            status: "COMPLETED",
        });

    const captureResponse = await paypal.capturePayment(orderId);

    expect(captureResponse).toHaveProperty("status");
    expect(captureResponse.status).toBe("COMPLETED");

    mockCapturePayment.mockRestore();
});
