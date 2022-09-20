import GM_fetch from "@trim21/gm-fetch";

async function main() {
  console.log("script start");
  console.log(`uuid: ${await fetchExample()}`);
}

async function fetchExample(): Promise<string> {
  await GM_fetch("https://httpbin.org/post", {
    method: 'POST',
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ "foo": "barr" }),
  }).then(res => res.json()).then(e => {console.log(e)}).catch(e => {console.warn(e)})
  const res = await GM_fetch("https://httpbin.org/uuid");
  let data = await res.json();
  return data.uuid;
}

main().catch((e) => {
  console.log(e);
});
