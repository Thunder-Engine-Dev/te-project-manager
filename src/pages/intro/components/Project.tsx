import { DeleteOutlineOutlined, SettingsOutlined } from '@mui/icons-material';
import { Box, Button, Card, ListDivider, ListItem, ListItemButton, ListItemContent, Tooltip, Typography } from '@mui/joy';
import useLocalStorageState from 'use-local-storage-state';
import fs from 'fs';
import Path from 'path';
import useGlobalState from '@/globalStates';

const Project = (p: { path: string }) => {
  const [savedProjects, setSavedProjects] = useLocalStorageState<string[]>('projects', { defaultValue: [] });

  const [currentProject, setCurrentProject] = useGlobalState('currentProject');

  const getRealProjectName = () => {
    try {
      const projectFileContent = fs.readFileSync(Path.join(p.path, 'project.godot'), 'utf8');
      return projectFileContent.split('config/name="')[1].split('"')[0];
    } catch {
      return 'Failed to process the project name'
    }
  }

  const remove = () => {
    const projects = [ ...savedProjects ];
    projects.splice(projects.indexOf(p.path), 1);
    setSavedProjects(projects);
  }

  return (
    <>
      <ListItem sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography>{ getRealProjectName() }</Typography>
          <Typography textColor="text.tertiary">{ p.path }</Typography>
        </Box>
        <Tooltip title='Manage'>
          <Button variant='outlined' onClick={ () => setCurrentProject(p.path) } sx={{ paddingInline: 1 }}><SettingsOutlined /></Button>
        </Tooltip>
        <Tooltip title='Remove from this list'>
          <Button variant='outlined' onClick={ remove } sx={{ paddingInline: 1 }}><DeleteOutlineOutlined /></Button>
        </Tooltip>
      </ListItem>
    </>
  );
}

export default Project;
