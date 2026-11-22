// bring-the-humans-03 entry program (Node 22, standard library only).
//
// The entry itself is a TikTok video: an original vertical ad for make.fun,
// made by an AI agent in a recorded session, posted publicly on TikTok from
// the public account @h.clip7 with the bounty's line and a play code in its
// caption. This repository hands the video in by naming its address in
// VIDEO.json at the root; the house reads the video's views from TikTok and
// ranks the entry on them. Nothing this program writes about the video is
// scored, so all it has to do is carry VIDEO.json into the output directory
// where the gate reads it.
//
// Local run (the grader's container provides /bot and /output instead):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// On success it prints nothing and out/VIDEO.json is byte for byte this
// repository's VIDEO.json.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'VIDEO.json');
const target = join(OUTPUT_DIR, 'VIDEO.json');

// Refuse to hand in a VIDEO.json that is not a JSON object naming a url:
// a malformed file would fail the gate, so fail loudly here instead.
const parsed = JSON.parse(readFileSync(source, 'utf8')) as unknown;
if (typeof parsed !== 'object' || parsed === null ||
    typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error('VIDEO.json must be a JSON object with a string "url" field');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, target);

// Confirm the copy landed byte for byte; the gate reads exactly these bytes.
if (!readFileSync(source).equals(readFileSync(target))) {
  console.error('VIDEO.json copy differs from the source');
  process.exit(1);
}
