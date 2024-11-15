import { useState } from "react";

function useToggle(initialState: boolean = false) {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = () => setState(prevState => !prevState);
  return [state, toggle] as const;
};

export default useToggle;