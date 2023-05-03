import { Add, FolderOutlined, Link, QuestionMarkOutlined } from '@mui/icons-material';
import { Box, Button, List, ListDivider, Typography } from '@mui/joy';
import { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import CreateModal from './components/CreateModal';
import ImportLocalModal from './components/ImportLocalModal';
import ImportRemoteModal from './components/ImportRemoteModal';
import Project from './components/Project';

const Intro = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [localImportModalOpen, setLocalImportModalOpen] = useState(false);
  const [remoteImportModalOpen, setRemoteImportModalOpen] = useState(false);
  const [savedProjects, setSavedProjects] = useLocalStorageState<string[]>('projects', { defaultValue: [] });

  return (
    <>
      <CreateModal open={ createModalOpen } onClose={ () => setCreateModalOpen(false) } />
      <ImportLocalModal open={ localImportModalOpen } onClose={ () => setLocalImportModalOpen(false) } />
      <ImportRemoteModal open={ remoteImportModalOpen } onClose={ () => setRemoteImportModalOpen(false) } />
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
          <Box sx={{
            p: 0,
            gap: 2,
            display: 'flex',
            flexDirection: 'row',
          }}>
            <Button startDecorator={ <Add /> } onClick={ () => setCreateModalOpen(true) }>Create</Button>
            <Button startDecorator={ <FolderOutlined /> } onClick={ () => setLocalImportModalOpen(true) }>Import Local</Button>
            <Button startDecorator={ <Link /> } onClick={ () => setRemoteImportModalOpen(true) }>Import Remote</Button>
          </Box>
          <Button startDecorator={ <QuestionMarkOutlined /> } variant='outlined'>Help</Button>
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
            margin: 2
          }}
        >
          {
            savedProjects.map((project) => (
              <>
                <Project path={ project } />
                { ( savedProjects.indexOf(project) != (savedProjects.length - 1) && <ListDivider /> ) }
              </>
            ))
          }

          {
            savedProjects.length === 0 && (
              <Typography sx={{ margin: 2, textAlign: 'center' }}>
                You don't have any recent projects right now. <img width={ 24 } src="https://cdn.discordapp.com/emojis/795330334316691477.webp?size=96&quality=lossless" />
              </Typography>
            )
          }
        </List>
      </Box>
    </>
  );
}

export default Intro;
