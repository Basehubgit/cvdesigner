import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PACKAGES: Record<string, { credits: number; price: number }> = {
  "1cv":  { credits: 1,  price: 1.49 },
  "5cv":  { credits: 5,  price: 5.99 },
  "15cv": { credits: 15, price: 14.99 },
};

function generateRandomString(length = 12): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

export async function POST(req: NextRequest) {
  const { packageId, price, user } = await req.json() as {
    packageId: string;
    price: number;
    credits: number;
    user?: { id: string; name: string; email: string } | null;
  };

  const pkg = PACKAGES[packageId];
  if (!pkg) {
    return NextResponse.json({ status: "failure", errorMessage: "Geçersiz paket" }, { status: 400 });
  }

  const apiKey    = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const baseUrl   = process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com";

  if (!apiKey || !secretKey) {
    return NextResponse.json(
      { status: "failure", errorMessage: "İyzico API anahtarları yapılandırılmamış. .env.local dosyasına IYZICO_API_KEY ve IYZICO_SECRET_KEY ekleyin." },
      { status: 500 }
    );
  }

  const conversationId = generateRandomString(8);
  const priceStr = pkg.price.toFixed(2);
  const host = req.headers.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const callbackUrl = `${protocol}://${host}/payment/callback?package=${packageId}&credits=${pkg.credits}`;

  const body = {
    locale: "tr",
    conversationId,
    price: priceStr,
    paidPrice: priceStr,
    currency: "USD",
    basketId: `basket_${conversationId}`,
    paymentGroup: "PRODUCT",
    callbackUrl,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: user?.id ?? "guest",
      name: user?.name?.split(" ")[0] ?? "Guest",
      surname: user?.name?.split(" ").slice(1).join(" ") || "User",
      gsmNumber: "+905350000000",
      email: user?.email ?? "guest@cvdesigner.pro",
      identityNumber: "74300864791",
      lastLoginDate: new Date().toISOString().replace("T", " ").slice(0, 19),
      registrationDate: "2024-01-01 00:00:00",
      registrationAddress: "Istanbul, Turkey",
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34000",
    },
    shippingAddress: {
      contactName: user?.name ?? "Guest User",
      city: "Istanbul",
      country: "Turkey",
      address: "Digital Product",
      zipCode: "34000",
    },
    billingAddress: {
      contactName: user?.name ?? "Guest User",
      city: "Istanbul",
      country: "Turkey",
      address: "Digital Product",
      zipCode: "34000",
    },
    basketItems: [
      {
        id: packageId,
        name: `${pkg.credits} CV Kredisi`,
        category1: "Dijital Ürün",
        itemType: "VIRTUAL",
        price: priceStr,
      },
    ],
  };

  // Generate İyzico auth header
  const rnd = generateRandomString(8);
  const bodyStr = JSON.stringify(body);
  const uri = "/payment/iyzipos/checkoutform/initialize/auth/ecom";
  const hashStr = apiKey + rnd + secretKey + bodyStr;
  const hash = crypto.createHmac("sha256", secretKey).update(hashStr).digest("base64");
  const authStr = Buffer.from(`${apiKey}:${rnd}:${hash}`).toString("base64");

  try {
    const res = await fetch(`${baseUrl}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `IYZWSv2 auth=${authStr}`,
        "x-iyzi-rnd": rnd,
        "x-iyzi-client-version": "iyzipay-node-2.0.48",
      },
      body: bodyStr,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { status: "failure", errorMessage: "İyzico bağlantı hatası: " + (err as Error).message },
      { status: 500 }
    );
  }
}
