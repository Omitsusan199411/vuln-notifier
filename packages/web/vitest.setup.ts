// vitestのグローバル設定

import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "@/tests/mocks/server";
// testing-libraryのマッチャー等をvitestで使えるようにするため
import "@testing-library/jest-dom/vitest";

// mswサーバーのライフサイクルをグローバルで管理
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
