import { createGlobalState } from 'react-hooks-global-state';

const { useGlobalState } = createGlobalState({
  currentProject: '',
  repo: null
} as any);

export default useGlobalState;
