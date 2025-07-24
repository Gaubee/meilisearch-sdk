export const resolveBinaryPath = () => {
  try {
    const cli = require("@gaubee/meilisearch-cli") as typeof import("@gaubee/meilisearch-cli");
   console.log("QAQ",cli.resolveBindaryInfo())
    return cli.resolveBindaryInfo().binPath;
  } catch (e){
    console.log("XXX",e)
    return "meilisearch";
  }
};
