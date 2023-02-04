import { Scider } from "../lib/index";

const waait = (ms: number) => new Promise((res) => setTimeout(res, ms));

test("basic setting", async () => {
  const map = new Scider<string, number>();
  map.set("key", 123);
  expect(map.get("key")).toBe(123);
});

test("setting with timeout", async () => {
  const map = new Scider<string, number>();
  map.set("key", 456, { deleteInSeconds: 0.5 });

  await waait(750);
  expect(map.get("key")).toBe(undefined);
});

test("deleting key with timeout", async () => {
  const map = new Scider<string, number>();
  map.set("key", 456, { deleteInSeconds: 0.5 });
  map.remove("key");

  await waait(250);
  expect(map.get("key")).toBe(undefined);
});

test("reassigning", async () => {
  const map = new Scider<string, number>();
  map.set("key", 123, { deleteInSeconds: 1 });
  map.set("key", 456, { deleteInSeconds: 2 });

  expect(map.get("key")).toBe(456);
  map.remove("key");
});
