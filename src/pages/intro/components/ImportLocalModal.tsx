import { Button, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack, Typography } from '@mui/joy';
import { FormEvent, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';

const ImportLocalModal = (p: { open: boolean, onClose: () => void }) => {
  const [projectPath, setProjectPath] = useState('');
  const [savedProjects, setSavedProjects] = useLocalStorageState<string[]>('projects', { defaultValue: [] });

  return (
    <Modal open={ p.open } onClose={ p.onClose }>
      <ModalDialog>
        <ModalClose />
        <Typography component="h2">Import Local Project</Typography>
        <form onSubmit={ importProject }>
          <Stack spacing={ 2 }>
            <FormControl sx={{ marginTop: 2 }}>
              <FormLabel>Project Folder</FormLabel>
              <Input required autoFocus onChange={ (event) => setProjectPath(event.target.value) } />
            </FormControl>
            <Button type='submit'>Import</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )

  function importProject(event: FormEvent) {
    setSavedProjects([ projectPath.replaceAll('"', ''), ...savedProjects ]);
    p.onClose();
  }
}

export default ImportLocalModal;
