import Home from "./Home";
import Explore from "./Explore";
import ItemDetails from "./ItemDetails";
import Authors from "./Authors";
import WalletConnect from "./WalletConnect";
import CreateItem from "./CreateItem";
import EditProfile from "./EditProfile";


const routes = [
  { path: "/", component: <Home /> },
  { path: "/explore", component: <Explore /> },
  { path: "/item-details/:item", component: <ItemDetails /> },
  { path: "/authors", component: <Authors /> },
  { path: "/wallet-connect", component: <WalletConnect /> },
  { path: "/create-item", component: <CreateItem /> },
  { path: "/edit-profile", component: <EditProfile /> },

];

export default routes;
