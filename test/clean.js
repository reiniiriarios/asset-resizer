import path from "path";
import shell from "shelljs";

const testDir = path.resolve("./test");

shell.rm("-Rf", path.join(testDir, "build"));
shell.rm("-Rf", path.join(testDir, "build2"));
