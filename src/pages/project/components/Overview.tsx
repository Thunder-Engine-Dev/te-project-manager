import { Button, List, ListDivider, ListItem, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import fs from 'fs';
import Path from 'path';
import simpleGit from 'simple-git';
import useGlobalState from '@/globalStates';

const Overview = () => {
  const [currentProject] = useGlobalState('currentProject');

  const [updates, setUpdates] = useState(-1);
  const [currentFetchState, setCurrentFetchState] = useState('');
  const [updateList, setUpdateList] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { loadUpdates() }, []);

  return (
    <>
      <List
        variant="outlined"
        sx={{
          bgcolor: 'background.body',
          minWidth: 240,
          borderRadius: 'sm',
          boxShadow: 'sm',
          '--List-decorator-size': '48px',
          '--List-item-paddingLeft': '1rem',
          '--List-item-paddingRight': '1rem',
          margin: 2
        }}
      >
        <ListItem sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2 }}>
          { updates === -1 && <Typography>Loading updates... { currentFetchState && `[${ currentFetchState }]` }</Typography> }
          { updates === 0 && <Typography>Everything is up to date!</Typography> }
          { updates === 1 && <>
            <Typography>Updates are available for: { updateList.join(', ') }</Typography>
            <Button loading={ updating } onClick={ update }>Update</Button>
          </> }
        </ListItem>

      </List>
    </>
  )

  async function loadUpdates() {
    const modules = fs.readdirSync(Path.join(currentProject, 'modules'));
    const newUpdateList = [];

    for (const module of modules) {
      setCurrentFetchState(module);

      const git = simpleGit(Path.join(currentProject, 'modules', module));

      await git.fetch();
      const log = parseInt(await git.raw('rev-list', 'HEAD...origin/main', '--count'));

      if (log) newUpdateList.push(module);
    }

    setCurrentFetchState('engine');

    const git = simpleGit(Path.join(currentProject, 'engine'));

    await git.fetch();
    const log = parseInt(await git.raw('rev-list', 'HEAD...origin/main', '--count'));

    if (log) newUpdateList.push('engine');

    setUpdateList(newUpdateList);
    if (newUpdateList.length) setUpdates(1);
    else setUpdates(0);

    if (updating) setUpdating(false);
  }

  async function update() {
    setUpdating(true);
    const git = simpleGit(currentProject);

    await git.submoduleUpdate(['--remote']);

    loadUpdates();
  }
}

export default Overview;
