import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { RootState } from "@/store/store";
import Spinner from "@/components/spinner";

const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isResettingPassword } = useSelector((state: RootState) => state.auth);

  if (isResettingPassword) {
    return <>{children}</>;
  } else {
    router.push("/login");
    return <Spinner center />;
  }
};

export default ProtectRoute;