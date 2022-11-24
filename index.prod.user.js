// ==UserScript==
// @name          falinks-teambuilder-helper
// @description   A UserScript helps import teams to a Falinks Teambuilder room
// @namespace     http://tampermonkey.net/
// @version       1.0.2
// @author        txfs19260817
// @icon          https://www.falinks-teambuilder.com/favicon.ico
// @source        https://github.com/txfs19260817/falinks-teambuilder-helper
// @license       WTFPL
// @match         http*://play.pokemonshowdown.com/*
// @match         http*://*.psim.us/*
// @match         http*://pokepast.es/*
// @require       https://unpkg.com/@pkmn/sets/build/index.min.js
// @connect       www.falinks-teambuilder.com
// @run-at        document-end
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "window"
const external_window_namespaceObject = window;
;// CONCATENATED MODULE: ./src/utils.ts
// Random 4-letter string
function S4() {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}
// Button building
const createRoomButtonId = "falinks-new-room-btn";
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
    marginBottom: "3px"
};
const buildPSButton = (eid, text, onclick)=>{
    const submitBtn = document.createElement("button");
    submitBtn.id = eid;
    submitBtn.textContent = text;
    submitBtn.type = "button";
    submitBtn.onclick = onclick;
    // pokepast.es potentially erased all css, including button. So add it back
    Object.assign(submitBtn.style, showdownBtnStyle);
    return submitBtn;
};
// URL stuff
const pokepasteURL = "pokepast.es";
const falinksTeambuilderURL = "falinks-teambuilder.com";
const showdownURL = "play.pokemonshowdown.com";
const safeReferrers = [
    pokepasteURL,
    falinksTeambuilderURL
];
function isSafeReferrer(s) {
    return safeReferrers.some((r)=>s.includes(r));
}
function falinksRoomEndpoint(packed) {
    // packed team will be passed as a query param
    return `//www.${falinksTeambuilderURL}/room/room_${S4()}${S4()}/?protocol=WebSocket&packed=${encodeURIComponent(packed)}`;
}
function showdownTeambuilderEndpoint(packed) {
    // packed team will be in the URL hash
    return `https://${showdownURL}/teambuilder#${packed}`;
}

;// CONCATENATED MODULE: ./src/index.ts


function pasteToPacked(paste) {
    var ref;
    // see: https://github.com/pkmn/ps/blob/main/sets/README.md#browser
    //@ts-ignore
    return ((ref = external_window_namespaceObject.pkmn.sets.Teams.importTeam(paste)) === null || ref === void 0 ? void 0 : ref.pack()) ?? '';
}
function createRoomButton(packedTeam) {
    return buildPSButton("falinks-new-room-btn", "🤝 Open in a Falinks Teambuilder room", ()=>{
        window.open(falinksRoomEndpoint(packedTeam));
    });
}
function createToPSButton(packedTeam) {
    let format = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "gen8", name = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : `Falinks Team ${S4()}`;
    // seems `Team.pack()` does not add format and team name to the packed team, we do it manually
    const packedWithFormat = `${format}]${name}|${packedTeam}`;
    return buildPSButton("falinks-add-team-btn", "🚀 Add to your Showdown teams", ()=>{
        window.open(showdownTeambuilderEndpoint(packedWithFormat));
    });
}
function getPasteAtPokepaste() {
    var ref, ref1, ref2;
    // get format from notes
    const notes = ((ref = document.querySelector("body > aside > p")) === null || ref === void 0 ? void 0 : ref.textContent) ?? '';
    const format = ((ref1 = notes.match(/Format: (.*)/)) === null || ref1 === void 0 ? void 0 : ref1[1]) ?? '';
    // get name from title
    const name = (ref2 = document.querySelector("body > aside > h1")) === null || ref2 === void 0 ? void 0 : ref2.textContent;
    // get team from textarea
    const paste = [
        1,
        2,
        3,
        4,
        5,
        6
    ].map((i)=>{
        var ref;
        return ((ref = document.querySelector(`body > article:nth-child(${i}) > pre`)) === null || ref === void 0 ? void 0 : ref.textContent) ?? '';
    }).join('');
    return {
        format,
        name,
        paste
    };
}
function getPackedAtShowdown() {
    var ref, ref1;
    // @ts-ignore
    return ((ref = unsafeWindow.room) === null || ref === void 0 ? void 0 : (ref1 = ref.curTeam) === null || ref1 === void 0 ? void 0 : ref1.team) ?? '';
}
function addPackedToLocalStorage(packedTeam) {
    const updatedShowdownTeams = packedTeam + "\n" + localStorage.getItem("showdown_teams");
    localStorage.setItem("showdown_teams", updatedShowdownTeams);
}
function main() {
    const { host , hash  } = window.location;
    if (host === pokepasteURL) {
        // parse the DOM of pokepast.es
        const { paste , format , name  } = getPasteAtPokepaste();
        // pack the team
        const packed = pasteToPacked(paste);
        // add both Create Room and Add To PS buttons to Pokepaste aside
        document.querySelector("body > aside").append(createRoomButton(packed), createToPSButton(packed, format, name));
    } else {
        // add the Create Room button to Showdown Teambuilder, next to "Upload to PokePaste" button
        const observer = new MutationObserver(function() {
            const pokepasteForm = document.getElementById("pokepasteForm");
            if (pokepasteForm && !document.getElementById(createRoomButtonId)) {
                const packed = getPackedAtShowdown();
                const btn = createRoomButton(packed);
                pokepasteForm.appendChild(btn);
            }
        });
        observer.observe(document.querySelector("body"), {
            subtree: true,
            childList: true
        });
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

/******/ })()
;