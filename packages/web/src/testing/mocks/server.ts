import { setupServer } from "msw/node";
import { appHandlers } from "@/testing/mocks/handlers/app";

// MSWのサーバーインスタンスを作成
export const server = setupServer(...appHandlers);
