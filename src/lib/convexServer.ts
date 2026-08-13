import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { mintServerToken } from "@/lib/authSession";

export function getConvexClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (!url) return null;
  return new ConvexHttpClient(url);
}

export async function withServerToken<T>(
  fn: (convex: ConvexHttpClient, serverToken: string) => Promise<T>,
): Promise<T> {
  const convex = getConvexClient();
  const minted = await mintServerToken();
  if (!convex || !minted) {
    throw new Error("Auth backend is not configured");
  }
  return fn(convex, minted.token);
}

export { api };
