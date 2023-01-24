// Random 4-letter string
export function S4(): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// Button building
const buttonStyles = ["ps", "limitless"] as const;
export type ButtonStyle = typeof buttonStyles[number];
export const createRoomButtonId = "falinks-new-room-btn";

const showdownBtnStyle = {
  outline: "none",
  cursor: "pointer",
  textAlign: "center",
  textDecoration: "none",
  boxShadow: "0 1px 2px rgba(0,0,0,.2),inset 0 -1px 2px #fff",
  borderRadius: "5px",
  fontFamily: "Verdana,Helvetica,Arial,sans-serif",
  display: "inline-block",
  color: "#222",
  textShadow: "0 1px 0 #fff",
  border: "1px solid #aaa",
  background: "linear-gradient(to bottom,#f6f6f6,#e3e3e3)",
  fontSize: "9pt",
  padding: "3px 8px",
  marginLeft: "6px",
  marginBottom: "3px",
};

export const buildPSButton = (eid: string, text: string, onclick: () => void, style: ButtonStyle = "ps") => {
  const submitBtn = document.createElement("button");
  submitBtn.id = eid;
  submitBtn.textContent = text;
  submitBtn.type = "button";
  submitBtn.onclick = onclick;
  // pokepast.es potentially erased all css, including button. So add it back
  if (style === "ps") {
    Object.assign(submitBtn.style, showdownBtnStyle);
  } else if (style === "limitless") {
    submitBtn.classList.add("export"); // reuse the "export" button style
    submitBtn.style.marginLeft = "6px"; // add some margin to the left
  }
  return submitBtn;
};

// URL stuff
export const pokepasteURL = "pokepast.es";
export const falinksTeambuilderURL = "falinks-teambuilder.com";
export const showdownURL = "play.pokemonshowdown.com";
export const limitlesstcgURL = "play.limitlesstcg.com";
const safeReferrers = [pokepasteURL, falinksTeambuilderURL, limitlesstcgURL];
export function isSafeReferrer(s: string): boolean {
  return safeReferrers.some((r) => s.includes(r));
}

export function isLimitlessTeamlistURL(url: string): boolean {
  const { hostname, pathname } = new URL(url);
  return hostname === limitlesstcgURL && (pathname.endsWith("teamlist") || pathname.endsWith("teamlist/"));
}

export function falinksRoomEndpoint(packed: string): string {
  // packed team will be passed as a query param
  return `//www.${falinksTeambuilderURL}/room/room_${S4()}${S4()}/?protocol=WebSocket&packed=${encodeURIComponent(packed)}`;
}

export function showdownTeambuilderEndpoint(packed: string): string {
  // packed team will be in the URL hash
  return `https://${showdownURL}/teambuilder#${packed}`;
}
