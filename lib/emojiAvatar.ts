// детерминированный эмодзи + фон из e-mail/id
export function emojiAvatar(seed: string | undefined) {
  const emojis = ["🐞","🦊","🦉","🦄","🐼","🐨","🐯","🐸","🐙","🐳","🐹","🐰","🦋","🦜","🦔","🦥","🐝","🐧","🐤","🦚"];
  const colors = ["#FDE68A","#BBF7D0","#BFDBFE","#FBCFE8","#FCA5A5","#A5B4FC","#FDE68A","#C7D2FE","#86EFAC","#99F6E4"];

  const s = (seed ?? "guest").split("").reduce((a,c)=> (a*31 + c.charCodeAt(0)) >>> 0, 0);
  const e = emojis[s % emojis.length];
  const bg = colors[(s >> 5) % colors.length];
  const fg = "#111827";
  return { emoji: e, bg, fg };
}
