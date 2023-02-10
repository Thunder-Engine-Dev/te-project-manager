import { Button, Checkbox, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack, Tooltip, Typography } from '@mui/joy'
import { FormEvent, useState } from 'react';
import Path from 'path';
import simpleGit from 'simple-git';
import useLocalStorageState from 'use-local-storage-state';

const CreateModal = (p: { open: boolean, onClose: () => void }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState('');

  const [projectName, setProjectName] = useState('');
  const [projectPath, setProjectPath] = useState('');
  const [useViewport, setUseViewport] = useState(false);

  const [savedProjects, setSavedProjects] = useLocalStorageState<string[]>('projects', { defaultValue: [] });

  // <Button variant='outlined'><FolderOpenOutlined /></Button>

  return (
    <Modal open={ p.open } onClose={ () => !isCreating && p.onClose() }>
      <ModalDialog>
        <ModalClose />
        <Typography component="h2">New Project</Typography>
        <form onSubmit={ createProject }>
          <Stack spacing={ 2 }>
            <FormControl sx={{ marginTop: 2 }}>
              <FormLabel>Project Codename</FormLabel>
              <Input required autoFocus onChange={ (event) => setProjectName(event.target.value) } />
            </FormControl>
            <FormControl>
              <FormLabel>Project Folder Path</FormLabel>
              <Tooltip title={<>
                A folder for your project will be created.
              </>} sx={{ zIndex: 9999 }} placement='top'>
                <Input required sx={{ flexGrow: 1 }} onChange={ (event) => setProjectPath(event.target.value.replaceAll('"', '')) } />
              </Tooltip>
            </FormControl>
            <FormControl>
              <Tooltip title={<>
                This module includes basic MF enemies, powerups, etc.
              </>} sx={{ zIndex: 9999 }} placement='top'>
                <Checkbox label='Preinstall the Base Module' defaultChecked disabled />
              </Tooltip>
            </FormControl>
            <FormControl>
              <Tooltip title={<>
                This module implements the proper viewport-based scaling with a shader.
              </>} sx={{ zIndex: 9999 }} placement='top' defaultChecked>
                <Checkbox label='Preinstall the Viewport Module' onChange={ (event) => setUseViewport(event.target.checked) } />
              </Tooltip>
            </FormControl>
            <Button type='submit' loading={ isCreating }>Create</Button>
            { creationStatus && <Typography>{ creationStatus }</Typography> }
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );

  async function createProject(event: FormEvent) {
    event.preventDefault();

    let failed = false;

    setIsCreating(true);

    try {
      let git = simpleGit(projectPath);

      setCreationStatus('Fetching the template');

      await git.clone('https://github.com/Thunder-Engine-Dev/te-template.git', projectName, ['--recurse-submodules']);
      git = simpleGit(Path.join(projectPath, projectName));

      setCreationStatus('Fetching the modules');

      if (useViewport)
        await git.submoduleAdd('https://github.com/Thunder-Engine-Dev/te-module-viewport', './modules/viewport');
    } catch (error) {
      console.log(error);
      setCreationStatus(`Failed: ${ error }`);
      failed = true;
    }

    if (!failed) {
      setSavedProjects([ Path.join(projectPath.replaceAll('"', ''), projectName), ...savedProjects ]);
      p.onClose();
      setCreationStatus('');
    }

    setIsCreating(false);
  }
}

export default CreateModal;
