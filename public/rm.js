try {
    const fs = require("fs");
    const pm = require("fs/promises");

    const rpath = fs
    .readFileSync("path.tmp", "utf8")
    .replace(/^["']|["']$/g, "");

    async function clean() {
    await pm.rm(`${rpath}/.git`, { recursive: true, force: true });
    await pm.rm(`${rpath}/.vscode/settings.json`, { force: true });
    await pm.rm(`${rpath}/.vscode/tasks.json`, { force: true });
    }

    clean();
} catch (error) {
    
}