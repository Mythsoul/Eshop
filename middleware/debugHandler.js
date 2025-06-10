import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { isProduction } from "./isProduction";

// Only log in development
const debugLog = (...args) => {
    if (!isProduction) {
        console.log(...args);
    }
};

export function withDebugProtection(handler) {
    return async (request) => {
        if (isProduction) {
            return new NextResponse(
                JSON.stringify({ error: "Debug routes not available in production" }), 
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const { userId } = getAuth(request);
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ error: "Authentication required" }), 
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        try {
            return await handler(request);
        } catch (error) {
            debugLog("[Debug Route Error]", error);
            return new NextResponse(
                JSON.stringify({ error: "Internal server error" }), 
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    };
}
