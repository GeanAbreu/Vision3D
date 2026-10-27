import Landing from './Landing';
import OfficialSite from './OfficialSite';

export default function SiteRouter() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const isOfficialSite = path === '/site' || path === '/admin' || window.location.hash === '#admin';

  return isOfficialSite ? <OfficialSite /> : <Landing />;
}
