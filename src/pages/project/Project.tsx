import useGlobalState from '@/globalStates';
import { HouseOutlined } from '@mui/icons-material'
import { Box, Button, Tab, TabList, Tabs, Typography } from '@mui/joy'
import { useState } from 'react';
import ModuleBrowser from './components/ModuleBrowser';
import Modules from './components/Modules';
import Overview from './components/Overview';

const Project = () => {
  const [index, setIndex] = useState(0);

  const [currentProject, setCurrentProject] = useGlobalState('currentProject');

  return (
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
              <Tab>Installed Modules</Tab>
              <Tab>Module Browser</Tab>
            </TabList>
          </Tabs>
        </Box>
        <Box sx={{ width: '42px' }} />
      </Box>
      
      { /*index === 0 && <Overview />*/ }
      { index === 0 && <Modules /> }
      { index === 1 && <ModuleBrowser /> }
    </Box>
  );
}

export default Project;
