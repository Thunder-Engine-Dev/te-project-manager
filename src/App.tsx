import { CssVarsProvider } from '@mui/joy';
import { useEffect } from 'react';
import useGlobalState from './globalStates';
import Intro from './pages/intro/Intro';
import Project from './pages/project/Project';

function App() {
  const [currentProject] = useGlobalState('currentProject');
  const [repo, setRepo] = useGlobalState('repo');

  const fetchRepo = async () => {
    const res = await (await fetch('https://thunder-engine-dev.github.io/te-modules/build.json')).json();
    setRepo(res);

    console.log('repo has been updated', res);
  }

  useEffect(() => { fetchRepo() }, []);

  return (
    <CssVarsProvider>
      { !currentProject && <Intro /> }
      { currentProject && <Project /> }
    </CssVarsProvider>
  );
}

export default App;
