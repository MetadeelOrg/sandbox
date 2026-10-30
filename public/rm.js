try {
  const pm = require("fs/promises");
  const fs = require("fs");

  const rpath = fs.readFileSync("path.tmp", "utf8")
    .replace(/^["']|["']$/g, "");

  await pm.rm(rpath + "/.git", { recursive: true, force: true });
  await pm.unlink(rpath + "/.vscode/settings.json");
  await pm.unlink(rpath + "/.vscode/tasks.json");
} catch (error) {
  
}