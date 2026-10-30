import { NextRequest, NextResponse } from "next/server";
import { registerCraLead } from "@/lib/b2cApi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, mobile, email, pincode } = body || {};

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide your full name." },
        { status: 400 }
      );
    }

    const cleanMobile = typeof mobile === "string" ? mobile.replace(/\D/g, "") : "";
    if (!cleanMobile || cleanMobile.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (email && typeof email === "string" && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { success: false, message: "Please enter a valid email address." },
          { status: 400 }
        );
      }
    }

    const cleanPincode = typeof pincode === "string" ? pincode.replace(/\D/g, "") : "";
    if (!cleanPincode || cleanPincode.length !== 6) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid 6-digit pincode." },
        { status: 400 }
      );
    }

    const result = await registerCraLead({
      fullName: fullName.trim(),
      mobile: cleanMobile,
      email: typeof email === "string" && email.trim() ? email.trim() : null,
      pincode: cleanPincode,
    });

    if (!result.success) {
      console.error("[CRA Lead Failed to Register with B2C API]", {
        payload: { fullName: fullName.trim(), mobile: cleanMobile, email, pincode: cleanPincode },
        response: result,
      });
      return NextResponse.json(result, { status: result.statusCode || 400 });
    }

    console.log("[CRA Lead Successfully Pushed to AVMLabs B2C API]", {
      fullName: fullName.trim(),
      mobile: cleanMobile,
      email: email || null,
      pincode: cleanPincode,
      traceId: result.traceId,
      timestamp: result.timestamp,
      apiMessage: result.message,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("CRA Lead registration error:", error);
    const message = error instanceof Error ? error.message : "Internal server error occurred.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

