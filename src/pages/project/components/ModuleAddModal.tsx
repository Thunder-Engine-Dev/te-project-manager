import useGlobalState from '@/globalStates';
import { Button, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack, Typography } from '@mui/joy';
import { useState } from 'react';
import simpleGit from 'simple-git';
import Path from 'path';

const ModuleAddModal = (p: { open: boolean, onClose: () => void }) => {
  const [url, setUrl] = useState('');
  const [folder, setFolder] = useState('');
  const [repo] = useGlobalState('repo');
  const [status, setStatus] = useState('');

  const [importing, setImporting] = useState(false);

  const importModule = async () => {
    if (!repo) return;

    setImporting(true);

    let failed = false;

    try {
      const git = simpleGit(repo);

      const output = await git.submoduleAdd(url, Path.join(repo, 'modules', folder));

      console.log(output);
    } catch (error) {
      setStatus(`Failed: ${ error }`);
      failed = true;
    }

    if (!failed) p.onClose();

    setImporting(false);
  }

  return (
    <Modal open={ p.open } onClose={ () => !importing && p.onClose() }>
      <ModalDialog>
        <ModalClose />
        <Typography component="h2">Import External Module</Typography>
        <form onSubmit={ importModule }>
          <Stack spacing={ 2 }>
            <FormControl sx={{ marginTop: 2 }}>
              <FormLabel>Module Repo URL</FormLabel>
              <Input required autoFocus onChange={ (event) => setUrl(event.target.value) } />
            </FormControl>
            <FormControl sx={{ marginTop: 2 }}>
              <FormLabel>Module Folder Name</FormLabel>
              <Input required autoFocus onChange={ (event) => setFolder(event.target.value) } />
            </FormControl>
            { status && <Typography sx={{ color: 'red' }}>{ status }</Typography> }
            <Button type='submit' loading={ importing }>Import</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}

export default ModuleAddModal;
