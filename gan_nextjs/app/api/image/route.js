import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const OUTPUT_DIR = path.join(process.cwd(), "..", "course_gan", "outputs");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || name.includes("/") || name.includes("\\")) {
    return new Response("Invalid image name.", { status: 400 });
  }

  const imagePath = path.join(OUTPUT_DIR, name);
  if (!existsSync(imagePath)) {
    return new Response("Image not found.", { status: 404 });
  }

  const imageBuffer = readFileSync(imagePath);
  return new Response(imageBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
