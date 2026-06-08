// Root path "/" is rewritten to "/tr" by the middleware in proxy.ts.
// This file is only reached if the rewrite doesn't match — keep it empty.
export default function RootPage() {
  return null;
}
