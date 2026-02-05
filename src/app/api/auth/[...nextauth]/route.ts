import NextAuth from "next-auth"
import { authOptions, tempAuthStore } from "@/lib/authConfig"

// Cleanup expired temp auth entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of tempAuthStore.entries()) {
    if (now - value.timestamp > 5 * 60 * 1000) {
      tempAuthStore.delete(key);
    }
  }
}, 60 * 1000);

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }