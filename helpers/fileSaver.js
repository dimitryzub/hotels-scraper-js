import fs from "fs/promises";

function save(data, path, filename) {
  fs.writeFile(`${path}/${filename}.json`, JSON.stringify(data), "utf-8")
    .then(() => console.log("File was saved successfully!"))
    .catch((e) => console.log(e));
}

export default save;
