import { GlobalState } from '@/globalTypes';
import { createGlobalState } from 'react-hooks-global-state';


const { useGlobalState } = createGlobalState<GlobalState>({
  currentProject: '',
  repo: null
});

export default useGlobalState;
