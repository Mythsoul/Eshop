import { serve } from "inngest/next";
import {
  createOrder as createUserOrder,
  inngest,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation
} from "@/config/inngest";

// Serve Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    createUserOrder
  ],
});
