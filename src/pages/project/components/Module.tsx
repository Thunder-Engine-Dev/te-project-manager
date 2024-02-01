import useGlobalState from '@/globalStates';
import { Add, DeleteOutlineOutlined, InfoOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, CircularProgress, ListItem, Tooltip, Typography } from '@mui/joy'
import { FC, useEffect, useState } from 'react';
import simpleGit from 'simple-git';
import { addModule, removeModule, updateModule } from '../utils';
import Path from 'path';
import { Plugin } from '@/globalTypes';

interface ModuleProps {
  info: Plugin,
  id: string,
  local: boolean,
  onUpdateRequest?: () => any,
  engine?: boolean,
  project: string
}

const Module: FC<ModuleProps> = (p) => {
  const [repo] = useGlobalState('repo');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const loadUpdate = async () => {
    setUpdateLoading(true);

    const git = simpleGit(!p.engine ? Path.join(p.project, 'modules', p.id) : Path.join(p.project, 'engine'));
    await git.fetch();
    const log = parseInt(await git.raw('rev-list', `HEAD...origin/main`, '--count'));
    if (log) setUpdateAvailable(true);
    
    setUpdateLoading(false);
  }

  const buttonRemoveModule = async () => {
    setLoading(true);

    await removeModule(p.id, p.project);

    setLoading(false);
    if (p.onUpdateRequest) p.onUpdateRequest();
  }

  const buttonAddModule = async () => {
    setLoading(true);

    await addModule(p.info, p.project);

    setLoading(false);
    if (p.onUpdateRequest) p.onUpdateRequest();
  }

  const buttonUpdateModule = async () => {
    setUpdating(true);

    await updateModule(p.id, p.project, !!p.engine);

    setUpdating(false);
    setUpdateAvailable(false);
    await loadUpdate();
    if (p.onUpdateRequest) p.onUpdateRequest();
  }

  useEffect(() => {
    if (!p.local) return;

    loadUpdate();
  }, []);

  if (!p.info) return null;

  return (
    <>
      <ListItem sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ flexDirection: 'column', display: 'flex', ...(p.info.authors ? { height: 48 } : {}) }}>
          <Typography>{ p.info.name } <Typography textColor="text.tertiary">{ !p.engine ? `modules/${ p.id }` : p.id }</Typography></Typography>
          { !infoVisible && p.info.authors && <Typography textColor="text.tertiary">{ p.info.authors.map((a: string) => repo?.contributors[a]?.username || 'Unknown contributor').join(', ') }</Typography> }
        </Box>
        <Box sx={{ flexDirection: 'row', alignItems: 'center', display: 'flex', gap: 2 }}>
          { updateLoading && <CircularProgress size="sm" /> }
          { updateAvailable && <Button loading={ updating } onClick={ buttonUpdateModule }>Update</Button> }
          { !p.engine && (
            <Tooltip title='Module Information'>
              <Button variant='outlined' onClick={ () => setInfoVisible(!infoVisible) } sx={{ paddingInline: 1 }}><InfoOutlined /></Button>
            </Tooltip>
          ) }
          { p.local && !p.engine && (
            <Tooltip title='Remove from the project'>
              <Button variant='outlined' onClick={ buttonRemoveModule } loading={ loading } sx={{ paddingInline: 1 }}><DeleteOutlineOutlined /></Button>
            </Tooltip>
          ) }
          { !p.local && !p.engine && (
            <Tooltip title='Add to the project'>
              <Button onClick={ buttonAddModule } loading={ loading } sx={{ paddingInline: 1, width: 42 }}><Add /></Button>
            </Tooltip>
          ) }
        </Box>
      </ListItem>
      { infoVisible && (
        <Box sx={{ margin: 2, marginTop: -1 }}>
          <Typography component="h1">Information</Typography>
          <Typography>{ p.info.description }</Typography>
          { p.info.authors && <Typography component="h1" sx={{ marginTop: 2 }}>Authors</Typography> }
          { p.info.authors && <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            { p.info.authors.map((a: string) => (
              <Chip variant="outlined" startDecorator={ <Avatar src={ repo?.contributors[a]?.avatar } /> }>{ repo?.contributors[a]?.username || 'Unknown contributor' }</Chip>
            )) }
          </Box> }
          { p.info.credits && !!Object.keys(p.info.credits).length && <Typography component="h1" sx={{ marginTop: 2 }}>Credits</Typography> }
          { !!p.info.credits.graphics && <Typography><Typography component="h1">Graphics: </Typography>{ p.info.credits.graphics.join(', ') }</Typography> }
          { !!p.info.credits.sounds && <Typography><Typography component="h1">Sounds: </Typography>{ p.info.credits.sounds.join(', ') }</Typography> }
        </Box>
      ) }
    </>
  );
}

export default Module;
