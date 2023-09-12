import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export const useQuery = () => new URLSearchParams(useLocation().search);
