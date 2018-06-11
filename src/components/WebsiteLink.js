import React from 'react';
import PropTypes from 'prop-types';

const WebsiteLink = ({ name, website }) => (
  <a href={website} target="_blank" rel="noreferrer noopener" title={name}>
    {name}
  </a>
);

WebsiteLink.propTypes = {
  name: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
};

export default WebsiteLink;
