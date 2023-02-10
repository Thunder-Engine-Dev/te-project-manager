import simpleGit, { SimpleGit } from 'simple-git';
import Path from 'path';
import fs from 'fs';

async function addModule(info: any, project: string) {
  const git = simpleGit(Path.join(project));
  await git.submoduleAdd(info.url, `./modules/${ info.id }`);
}

async function removeModule(id: string, project: string) {
  const git = simpleGit(Path.join(project));
  await git.raw(['submodule', 'deinit', '-f', `./modules/${ id }`]);
  try { fs.rmdirSync(Path.join(project, '.git', 'modules', 'modules', id), { recursive: true }); } catch {}
  await git.raw(['rm', '-f', `./modules/${ id }`]);
}

async function updateModule(id: string, project: string, engine: boolean) {
  const git = simpleGit(!engine ? Path.join(project, 'modules', id) : Path.join(project, 'engine'));
  await git.pull(['origin', `HEAD:main`]);
}

export { addModule, removeModule, updateModule };
