import React from 'react';
import PropTypes from 'prop-types';

const DockerHubLink = ({ image }) => (
  <a href={`//hub.docker.com/r/${image}/`} target="_blank" rel="noreferrer noopener" title={image}>
    {image}
  </a>
);

DockerHubLink.propTypes = {
  image: PropTypes.string.isRequired,
};

export default DockerHubLink;
