import { askAI } from "./brain.js";
import fs from "fs-extra";
import simpleGit from "simple-git";

const git = simpleGit();
const TASK = process.env.TASK || "Создай простой сайт";

async function generateProject() {

  let attempt = 0;
  let parsed = null;

  while (attempt < 3 && !parsed) {
    attempt++;

    console.log("Попытка:", attempt);

    const response = await askAI(`
Создай проект.

Ответ строго JSON формата:

{
  "files": [
    { "path": "index.html", "content": "код" }
  ]
}

Без текста. Только JSON.

Задача: ${TASK}
`);

    try {
      parsed = JSON.parse(response);
    } catch (e) {
      console.log("Ошибка JSON. Перегенерация...");
    }
  }

  if (!parsed) {
    console.log("AI не смог вернуть валидный JSON.");
    return;
  }

  for (const file of parsed.files) {
    await fs.outputFile(file.path, file.content);
    console.log("Создан файл:", file.path);
  }

  const status = await git.status();

  if (status.files.length > 0) {
    await git.add(".");
    await git.commit("🚀 AI PRO update: " + TASK);
    await git.push();
    console.log("Коммит выполнен.");
  } else {
    console.log("Изменений нет.");
  }
}

generateProject();
