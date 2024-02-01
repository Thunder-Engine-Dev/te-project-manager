import { Box, Button, List, ListDivider, ListItem, Tooltip, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import fs from 'fs';
import Path from 'path';
import useGlobalState from '@/globalStates';
import Module from './Module';
import CommitModal from './CommitModal';
import { unknownPlugin } from '@/globalTypes';

const Modules = () => {
  const [modules, setModules] = useState<string[]>([]);
  const [currentProject] = useGlobalState('currentProject');
  const [repo] = useGlobalState('repo');

  const updateModules = () => {
    const dir = fs.readdirSync(Path.join(currentProject, 'modules')).filter((m: string) => !m.startsWith('.'));
    setModules(dir);
  }

  const findModuleInfo = (id: string) => {
    return repo?.plugins.find((m: any) => m.id === id) || unknownPlugin(id);
  }

  useEffect(updateModules, []);

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
        <Module
          info={{
            name: 'Thunder Engine Core'
          } as any}
          id="engine"
          local={ true }
          engine={ true }
          project={ currentProject }
        />
        <ListDivider />
        { modules.map((module) => (
          <>
            <Module
              info={ findModuleInfo(module) }
              id={ module }
              local={ true }
              onUpdateRequest={ updateModules }
              project={ currentProject }
            />
            { ( modules.indexOf(module) != (modules.length - 1) && <ListDivider /> ) }
          </>
        )) }
      </List>
    </>
  );
}

export default Modules;
