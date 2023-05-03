import useGlobalState from '@/globalStates';
import { Add, HouseOutlined } from '@mui/icons-material'
import { Box, Button, Tab, TabList, Tabs, Tooltip, Typography } from '@mui/joy'
import { useState } from 'react';
import ModuleAddModal from './components/ModuleAddModal';
import ModuleBrowser from './components/ModuleBrowser';
import Modules from './components/Modules';
import GitActions from './components/GitActions';

const Project = () => {
  const [index, setIndex] = useState(0);

  const [moduleModalOpen, setModuleModalOpen] = useState(false);

  const [currentProject, setCurrentProject] = useGlobalState('currentProject');

  return (
    <>
      <ModuleAddModal open={ moduleModalOpen } onClose={ () => setModuleModalOpen(false) } />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{
          p: 2,
          gap: 2,
          bgcolor: 'background.surface',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 99
        }}>
          <Button variant='outlined' sx={{ paddingInline: 1 }} onClick={ () => setCurrentProject('') }><HouseOutlined /></Button>
          <Box sx={{
            p: 0,
            gap: 2,
            display: 'flex',
            flexDirection: 'row',
          }}>
            <Tabs
              sx={{ justifySelf: 'center' }}
              value={ index }
              onChange={ (event, value) => setIndex(value as number) }
            >
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Installed Modules</Tab>
                <Tab>Module Browser</Tab>
              </TabList>
            </Tabs>
          </Box>
          <Tooltip title='Add a module by direct link'>
            <Button variant='outlined' sx={{ paddingInline: 1 }} onClick={ () => setModuleModalOpen(true) }><Add /></Button>
          </Tooltip>
        </Box>
        
        { index === 0 && <GitActions /> }
        { index === 1 && <Modules /> }
        { index === 2 && <ModuleBrowser /> }
      </Box>
    </>
  );
}

export default Project;
