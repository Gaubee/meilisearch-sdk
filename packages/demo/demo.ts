import { MeiliSearch } from "meilisearch";
import data from "./data.json";
import { delay } from "@gaubee/util";

const client = new MeiliSearch({
  //   host: "https://ms-2ec41f35a4fb-16917.nyc.meilisearch.io",
  //   apiKey: "0e3ea2c52ced0728b94b215be83d2e188a057edc",
  host: "http://127.0.0.1:7700",
  apiKey: "Vlkcr5-ssWqgc7b1d9SUzq5o_B8CQ8IZ9QxOmLq56XU",
});

const name = "goods-" + "admin"; // + crypto.randomUUID();
while (true) {
  const rawIndexes = await client.getRawIndexes();
  console.log("rawIndexes", rawIndexes);
  if (null == rawIndexes.results.find((it) => it.uid === name)) {
    await client.createIndex(name);
  } else {
    break;
  }
}
const goodsIndex = client.index(name);

console.log("IndexStats", await goodsIndex.getStats());

const addDocumentsResult = await goodsIndex.addDocuments(
  data.map((item, index) => ({ id: index, ...item }))
);
console.log("addDocumentsResult", addDocumentsResult);

do {
  const searchResult = await goodsIndex.search("香水", {
    attributesToHighlight: ["*"],
  });
  console.log("searchResult", searchResult.hits);
  if (searchResult.hits.length > 0) {
    break;
  }
  await delay(100);
} while (true);
