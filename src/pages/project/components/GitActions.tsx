import { Box, List, ListDivider, ListItemButton, Typography } from '@mui/joy';
import { FC, useEffect, useState } from 'react';
import simpleGit from 'simple-git';
import Path from 'path';
import useGlobalState from '@/globalStates';
import CommitModal from './CommitModal';

const GitActions: FC = () => {
  const [lcommit, setLcommit] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingRemote, setLoadingRemote] = useState(true);
  const [currentProject] = useGlobalState('currentProject');
  const [pullLoading, setPullLoading] = useState(false);
  const [commitlog, setCommitlog] = useState<any[]>([]);
  const [pushModalOpen, setPushModalOpen] = useState(false);

  const loadUpdate = async () => {
    const git = simpleGit(currentProject);

    const log = await git.raw('rev-parse', '--short', 'HEAD');
    setLcommit(log);

    setLoading(false);
    
    let commits = (await git.raw('log', 'origin', '-20')).split('commit').splice(1);

    console.log(commits);

    setCommitlog(
      commits.map(commit => ({
        author: commit.split('Author: ')[1].split('<')[0],
        date: commit.split('Date: ')[1].split('\n')[0],
        name: commit.split('Date: ')[1].split('\n')[2].split('\n')[0].trim(),
        new: commit.includes('origin')
      }))
    );

    await git.fetch();
    const upd = await git.raw('rev-list', 'HEAD...origin', '--count');

    if (upd) setUpdateAvailable(true);

    setLoadingRemote(false);
  }

  useEffect(() => {
    loadUpdate();
  }, []);

  return (
    <>
      { loading && <Box sx={{ margin: 2 }}><Typography>Loading info</Typography></Box> }
      { !loading && (
        <>
          <CommitModal open={ pushModalOpen } onClose={ () => setPushModalOpen(false) } />
          <Box sx={{ margin: 2 }}>
            <Typography component="h1">✨ Project State</Typography>
          </Box>

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
              margin: 2,
              marginTop: 0
            }}
          >
            <Box sx={{ margin: 2, marginTop: 1, marginBottom: 1 }}>
              <Typography><Typography component="h1">Current local commit: </Typography>{ lcommit || 'loading' }</Typography>
              { loadingRemote && <Typography component="h1">Loading remote updates...</Typography> }
              { !updateAvailable && !loadingRemote && <Typography component="h1">Your local repo is up to date.</Typography> }
              { updateAvailable && <Typography component="h1">Remote has updates that you might want to pull!</Typography> }
            </Box>
          </List>

          <Box sx={{ margin: 2, marginTop: 0 }}>
            <Typography component="h1">✨ Quick Git Actions</Typography>
          </Box>

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
              margin: 2,
              marginTop: 0
            }}
          >
            <ListItemButton sx={{ padding: 2 }}>
              <Box sx={{ flexDirection: 'column', display: 'flex' }}>
                <Typography component="h1">⬇️ Pull Changes</Typography>
                <Typography textColor="text.tertiary">Download the remote changes.</Typography>
              </Box>
            </ListItemButton>
            <ListDivider />
            <ListItemButton sx={{ padding: 2 }} onClick={ () => setPushModalOpen(true) }>
              <Box sx={{ flexDirection: 'column', display: 'flex' }}>
                <Typography component="h1">⬆️ Upload Local Changes</Typography>
                <Typography textColor="text.tertiary">Creates a commit and pushes it to the repository.</Typography>
              </Box>
            </ListItemButton>
            <ListDivider />
            <ListItemButton sx={{ padding: 2 }}>
              <Box sx={{ flexDirection: 'column', display: 'flex' }}>
                <Typography component="h1">🔧 Repair project and modules</Typography>
                <Typography textColor="text.tertiary">Resets all local changes bringing it to the latest remote state.</Typography>
              </Box>
            </ListItemButton>
          </List>

          <Box sx={{ margin: 2, marginTop: 0 }}>
            <Typography component="h1">✨ Latest Changes</Typography>
          </Box>

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
              margin: 2,
              marginTop: 0
            }}
          >
            { commitlog.map((commit, i) => (
              <>
                <Box sx={{ margin: 2, marginTop: 1, marginBottom: 1 }}>
                  <Typography>
                    <Typography component="h1">➡️ { commit.name }</Typography>
                    { ` by ${ commit.author }` }
                    { commit.new && <Typography sx={{ color: 'magenta' }}> NEW</Typography> }
                  </Typography>
                  <Typography textColor="text.tertiary">🕒 { commit.date }</Typography>
                </Box>
                { i < commitlog.length - 1 && <ListDivider /> }
              </>
            )) }
          </List>
        </>
      ) }
    </>
  );
}

export default GitActions;
