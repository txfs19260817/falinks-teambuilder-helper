import * as pkmnSets from '@pkmn/sets';

const pokepasteURL = "pokepast.es";
const createRoomButtonId = "falinks-new-room-btn";

function S4(): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function falinksRoomEndpoint(packed: string): string {
  return `//www.falinks-teambuilder.com/room/room_${S4()}${S4()}/?protocol=WebSocket&packed=${encodeURIComponent(packed)}`;
}

function pasteToPacked(paste: string): string {
  // pkmnSets.Teams is available in dev, 
  // whereas `pkmnSets.PokemonTeams` is equivalent to `window.PokemonTeams` exported in prod
  //@ts-ignore
  const teams = pkmnSets.Teams ?? pkmnSets.PokemonTeams;
  return teams.importTeam(paste)?.pack() ?? '';
}

function createRoomButton(packed: string) {
  const submitBtn = document.createElement("button");
  submitBtn.id = createRoomButtonId;
  submitBtn.textContent = "🤝 Open in a Falinks Teambuilder room";
  submitBtn.type = "button";
  submitBtn.onclick = () => {
    window.open(falinksRoomEndpoint(packed));
  };
  // pokepast.es potentially erased all css, including button
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

function getPackedAtShowdown(): string {
  // @ts-ignore
  return unsafeWindow.room?.curTeam?.team ?? ''
}

function main() {
  const { host } = window.location;
  if (host === pokepasteURL) { // add the button to Pokepaste aside
    const paste = getPasteAtPokepaste();
    const packed = pasteToPacked(paste);
    const btn = createRoomButton(packed);
    document.querySelector("body > aside").append(btn);
  } else { // add the button to Showdown Teambuilder, next to "Upload to PokePaste" button
    const observer = new MutationObserver(function () {
      const pokepasteForm = document.getElementById("pokepasteForm");
      if (pokepasteForm && !document.getElementById(createRoomButtonId)) {
        const packed = getPackedAtShowdown();
        const btn = createRoomButton(packed);
        pokepasteForm.appendChild(btn);
      }
    });
    observer.observe(document.querySelector("body"), { subtree: true, childList: true });
  }
}

main();
