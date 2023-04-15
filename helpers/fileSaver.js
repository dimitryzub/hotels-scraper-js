import fs from "fs/promises";
import path from "path";

function save(data, filename = "parsed_results") {
  const fileName = path.join(process.cwd(), `${filename}.json`);
  fs.writeFile(fileName, JSON.stringify(data), "utf-8")
    .then(() => console.log("File was saved successfully!"))
    .catch((e) => console.log(e));
}

export default save;
