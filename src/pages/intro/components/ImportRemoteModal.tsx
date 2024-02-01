import { Button, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack, Typography } from '@mui/joy';
import { FormEvent, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import Path from 'path';
import simpleGit from 'simple-git';

const ImportRemoteModal = (p: { open: boolean, onClose: () => void }) => {
  const [projectUrl, setProjectUrl] = useState('');
  const [projectPath, setProjectPath] = useState('');
  const [savedProjects, setSavedProjects] = useLocalStorageState<string[]>('projects', { defaultValue: [] });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const importProject = async (event: FormEvent) => {
    event.preventDefault();
    let failed = false;
    //setSavedProjects([ projectUrl.replaceAll('"', ''), ...savedProjects ]);
    setLoading(true);
    try {
      const git = simpleGit(projectPath);
      await git.clone(projectUrl, '.', ['--recurse-submodules']);
    } catch (error) {
      failed = true;
      setStatus(error as string);
    }

    setLoading(false);
    if (!failed) {
      setSavedProjects([ projectPath, ...savedProjects ]);
      p.onClose();
    }
  }

  return (
    <Modal open={ p.open } onClose={ () => !loading && p.onClose() }>
      <ModalDialog>
        <ModalClose />
        <Typography component="h2">Import Remote Project</Typography>
        <form onSubmit={ importProject }>
          <Stack spacing={ 2 }>
            <FormControl sx={{ marginTop: 2 }}>
              <FormLabel>Repository URL</FormLabel>
              <Input required autoFocus onChange={ (event) => setProjectUrl(event.target.value) } />
            </FormControl>
            <FormControl sx={{ marginTop: 2 }}>
              <FormLabel>Project Folder Path</FormLabel>
              <Input required autoFocus onChange={ (event) => setProjectPath(event.target.value.replaceAll('"', '')) } />
            </FormControl>
            <Button type='submit' loading={ loading }>Import</Button>
            { status && <Typography>{ status }</Typography> }
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}

export default ImportRemoteModal;
