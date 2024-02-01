import useGlobalState from '@/globalStates';
import { List, ListDivider } from '@mui/joy';
import Module from './Module';
import fs from 'fs';
import Path from 'path';
import { useEffect, useState } from 'react';

const ModuleBrowser = () => {
  const [modules, setModules] = useState<string[]>([]);
  const [currentProject] = useGlobalState('currentProject');
  const [repo] = useGlobalState('repo');

  const updateModules = () => {
    const dir = fs.readdirSync(Path.join(currentProject, 'modules'));
    setModules(dir);
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
        { repo?.plugins.map((module: any) => (
          <>
            <Module
              info={ module }
              id={ module.id }
              local={ modules.includes(module.id) }
              project={ currentProject }
              onUpdateRequest={ updateModules }
            />
            { ( repo.plugins.indexOf(module) != (repo.plugins.length - 1) && <ListDivider /> ) }
          </>
        )) }
      </List>
    </>
  );
}

export default ModuleBrowser;
