"use client";

import Image from "next/image";
import { emojiAvatar } from "@/lib/emojiAvatar";

export default function AvatarCircle({
  size = 32,
  image,
  name,
  email,
}: {
  size?: number;
  image?: string | null;
  name?: string | null;
  email?: string | null;
}) {
  if (image) {
    return (
      <span className="inline-block rounded-full overflow-hidden ring-1 ring-black/10" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name ?? "User"} width={size} height={size} />
      </span>
    );
  }
  const { emoji, bg, fg } = emojiAvatar(email ?? name ?? undefined);
  return (
    <span
      className="inline-flex items-center justify-center rounded-full ring-1 ring-black/10"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.round(size * 0.6) }}
      aria-label={name ?? email ?? "User"}
      title={name ?? email ?? "User"}
    >
      {emoji}
    </span>
  );
}
