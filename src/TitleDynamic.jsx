import { Helmet } from 'react-helmet';
import { useContext } from 'react';
import { contextAuth } from './pages/ContextProvider';

function TitleDynamic({ title }) {
  const { frontendData } = useContext(contextAuth)

  const siteName = frontendData?.siteName || '';

  return (
    <Helmet>
      <title>{`${siteName} | ${title}`}</title>
    </Helmet>
  );
}

export default TitleDynamic;
