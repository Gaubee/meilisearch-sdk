export const resolveBinaryPath = () => {
  try {
    const cli = require("@gaubee/meilisearch-cli") as typeof import("@gaubee/meilisearch-cli");
    return cli.resolveBindaryInfo().binPath;
  } catch (e){
    console.log("XXX",e)
    return "meilisearch";
  }
};
