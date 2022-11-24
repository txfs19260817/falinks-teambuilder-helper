import * as pkmnSets from '@pkmn/sets';
import { createRoomButtonId, pokepasteURL, isSafeReferrer, buildPSButton, falinksRoomEndpoint, showdownTeambuilderEndpoint, S4 } from './utils';

function pasteToPacked(paste: string): string {
  // see: https://github.com/pkmn/ps/blob/main/sets/README.md#browser
  //@ts-ignore
  return pkmnSets.pkmn.sets.Teams.importTeam(paste)?.pack() ?? '';
}

function createRoomButton(packedTeam: string) {
  return buildPSButton("falinks-new-room-btn", "🤝 Open in a Falinks Teambuilder room", () => {
    window.open(falinksRoomEndpoint(packedTeam));
  });
}

function createToPSButton(packedTeam: string, format: string = "gen8", name: string = `Falinks Team ${S4()}`) {
  // seems `Team.pack()` does not add format and team name to the packed team, we do it manually
  const packedWithFormat = `${format}]${name}|${packedTeam}`;
  return buildPSButton("falinks-add-team-btn", "🚀 Add to your Showdown teams", () => {
    window.open(showdownTeambuilderEndpoint(packedWithFormat));
  });
}

function getPasteAtPokepaste(): { name: string; format: string; paste: string } {
  // get format from notes
  const notes = document.querySelector("body > aside > p")?.textContent ?? '';
  const format = notes.match(/Format: (.*)/)?.[1] ?? '';
  // get name from title
  const name = document.querySelector("body > aside > h1")?.textContent;
  // get team from textarea
  const paste = [1, 2, 3, 4, 5, 6]
    .map((i) => document.querySelector(`body > article:nth-child(${i}) > pre`)?.textContent ?? '')
    .join('');

  return {
    format,
    name,
    paste,
  }
}

function getPackedAtShowdown(): string {
  // @ts-ignore
  return unsafeWindow.room?.curTeam?.team ?? ''
}

function addPackedToLocalStorage(packedTeam: string) {
  const updatedShowdownTeams = packedTeam + "\n" + localStorage.getItem("showdown_teams");
  localStorage.setItem("showdown_teams", updatedShowdownTeams);
}

function main() {
  const { host, hash } = window.location;
  if (host === pokepasteURL) {
    // parse the DOM of pokepast.es
    const { paste, format, name } = getPasteAtPokepaste();
    // pack the team
    const packed = pasteToPacked(paste);
    // add both Create Room and Add To PS buttons to Pokepaste aside
    document.querySelector("body > aside").append(
      createRoomButton(packed),
      createToPSButton(packed, format, name)
    );
  } else {
    // add the Create Room button to Showdown Teambuilder, next to "Upload to PokePaste" button
    const observer = new MutationObserver(function () {
      const pokepasteForm = document.getElementById("pokepasteForm");
      if (pokepasteForm && !document.getElementById(createRoomButtonId)) {
        const packed = getPackedAtShowdown();
        const btn = createRoomButton(packed);
        pokepasteForm.appendChild(btn);
      }
    });
    observer.observe(document.querySelector("body"), { subtree: true, childList: true });

    // check both referer and hash to find if a packed team sent from trusted sources
    if (hash && isSafeReferrer(document.referrer)) {
      const packedTeam = decodeURIComponent(document.location.hash.slice(1));
      // reset the URL to avoid re-importing the team
      history.replaceState(null, document.title, location.pathname + location.search);
      // ask the user to import the team
      const doAdd = confirm(`Would you like to add this team from ${document.referrer} to your teams?\n${packedTeam}`);
      if (doAdd) {
        addPackedToLocalStorage(packedTeam);
        window.location.reload();
      }
    }
  }
}

main();
