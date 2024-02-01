import { Button, Checkbox, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Stack, Tooltip, Typography } from '@mui/joy'
import { FormEvent, useState } from 'react';
import simpleGit from 'simple-git';
import useGlobalState from '@/globalStates';

const CommitModal = (p: { open: boolean, onClose: () => void }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState('');
  const [repo] = useGlobalState('repo');

  const [name, setName] = useState('');
  const [force, setForce] = useState(false);

  const createProject = async (event: FormEvent) => {
    event.preventDefault();

    let failed = false;

    setIsCreating(true);

    try {
      let git = simpleGit(repo);

      throw new Error('commiting is not implemented');
    } catch (error) {
      console.log(error);
      setCreationStatus(`Failed: ${ error }`);
      failed = true;
    }

    setIsCreating(false);
  }

  return (
    <Modal open={ p.open } onClose={ () => !isCreating && p.onClose() }>
      <ModalDialog>
        <ModalClose />
        <Typography component="h2">Upload Changes</Typography>
        <form onSubmit={ createProject }>
          <Stack spacing={ 2 }>
            <FormControl sx={{ marginTop: 2 }}>
              <FormLabel>Describe your changes</FormLabel>
              <Input required autoFocus onChange={ (event) => setName(event.target.value) } />
            </FormControl>
            <FormControl>
              <Tooltip title={<>
                This will force your local project state to be uploaded even when remote has conflicting changes. USE CAREFULLY!
              </>} sx={{ zIndex: 9999 }} placement='top'>
                <Checkbox label='Force-push' sx={{ color: 'red' }} onChange={ (event) => setForce(event.target.checked) } />
              </Tooltip>
            </FormControl>
            <Button type='submit' loading={ isCreating }>Upload</Button>
            { creationStatus && <Typography>{ creationStatus }</Typography> }
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}

export default CommitModal;
