import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

const LogisticsDetail = (props) => {
  const router = useRouter();
  return (
    <div>
      <h2>Logistics Detail for: </h2>
      {router.query.id}
    </div>
  );
};

LogisticsDetail.propTypes = {

};

export default LogisticsDetail;
