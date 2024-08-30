import React from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const ChildContainer = styled.div`
  /* Child container styles */
`;

export const ReactPlayerWrapper = styled.div`
  > div {
    width: unset !important;
    height: unset !important;
  }
`;

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return <ReactPlayerWrapper>{/*<ReactPlayer url={videoUrl} controls />*/}</ReactPlayerWrapper>;
};

export default VideoPlayer;
