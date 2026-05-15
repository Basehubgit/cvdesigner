import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get("token") as string;
  const status = formData.get("status") as string;

  if (!token || status !== "success") {
    return NextResponse.redirect(new URL("/payment/callback?result=failure", req.url));
  }

  const apiKey    = process.env.IYZICO_API_KEY!;
  const secretKey = process.env.IYZICO_SECRET_KEY!;
  const baseUrl   = process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com";
  const credits   = req.nextUrl.searchParams.get("credits") ?? "1";
  const packageId = req.nextUrl.searchParams.get("package") ?? "1cv";

  // Verify payment with İyzico
  const rnd = crypto.randomBytes(6).toString("hex");
  const body = JSON.stringify({ locale: "tr", token });
  const hashStr = apiKey + rnd + secretKey + body;
  const hash = crypto.createHmac("sha256", secretKey).update(hashStr).digest("base64");
  const authStr = Buffer.from(`${apiKey}:${rnd}:${hash}`).toString("base64");

  try {
    const res = await fetch(`${baseUrl}/payment/iyzipos/checkoutform/auth/ecom/detail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `IYZWSv2 auth=${authStr}`,
        "x-iyzi-rnd": rnd,
      },
      body,
    });

    const data = await res.json();

    if (data.paymentStatus === "SUCCESS") {
      return NextResponse.redirect(
        new URL(`/payment/callback?result=success&credits=${credits}&package=${packageId}`, req.url)
      );
    }
  } catch {
    // fall through to failure
  }

  return NextResponse.redirect(new URL("/payment/callback?result=failure", req.url));
}
