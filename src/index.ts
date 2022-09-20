import { Team } from '@pkmn/sets';

const pokepasteURL = "pokepast.es";

const S4 = (): string => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
const falinksRoomEndpoint = (packed: string): string => `//www.falinks-teambuilder.com/room/room_${S4()}${S4()}/?protocol=WebSocket&packed=${encodeURIComponent(packed)}`;

function pasteToPacked(paste: string): string {
  return Team.import(paste).pack();
}

function createRoomButton(packed: string) {
  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Open in a Falinks Teambuilder room";
  submitBtn.type = "button";
  submitBtn.onclick = () => {
    window.open(falinksRoomEndpoint(packed));
  };
  Object.assign(submitBtn.style, {
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
    marginBottom: "3px"
  });
  return submitBtn;
}

function getPasteAtPokepaste(): string {
  return [1, 2, 3, 4, 5, 6]
    .map((i) => document.querySelector(`body > article:nth-child(${i}) > pre`)?.textContent ?? '')
    .join('');
}

async function main() {
  const { host } = window.location;
  if (host === pokepasteURL) {
    const paste = getPasteAtPokepaste();
    const packed = pasteToPacked(paste);
    const btn = createRoomButton(packed);
    document.querySelector("body > aside").append(btn);
  } else {
    const observer = new MutationObserver(function (mutations) {
      if (location.href.endsWith("teambuilder")) {
        console.warn(`mutations: ${mutations}`);
      }
    });
    observer.observe(document, { subtree: true, childList: true });

  }
}

main().catch((e) => {
  console.log(e);
});
