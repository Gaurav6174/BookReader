import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const MusicContext = createContext(null);

export const DEFAULT_PLAYLIST_ID = 'PLDwix0nPEr94';

export const STUDY_TRACKS = [
  {
    id: 'rFZHOHl-L8A',
    title: 'lofi hip hop radio 📚',
    subtitle: 'beats to relax/study to (Your playlist)',
    icon: '☕',
    isPlaylist: false,
  },
  {
    id: 'PLDwix0nPEr94',
    title: 'Entire Study Playlist 🎧',
    subtitle: 'Continuous study music playlist',
    icon: '📜',
    isPlaylist: true,
  },
  {
    id: '4xDzrJKXOOY',
    title: 'synthwave lofi radio 🌌',
    subtitle: 'chill beats to relax / study to',
    icon: '🪐',
    isPlaylist: false,
  },
  {
    id: 'WPni755-Krg',
    title: 'Peaceful Piano & Library 🎹',
    subtitle: 'Gentle classical piano for reading',
    icon: '📖',
    isPlaylist: false,
  },
  {
    id: 'mPZkdNFkNps',
    title: 'Rain on Library Windows 🌧️',
    subtitle: 'Cozy fireplace & rain sounds',
    icon: '🌧️',
    isPlaylist: false,
  },
];

export function MusicProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(STUDY_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      createPlayer(currentTrack, volume);
    };

    if (window.YT && window.YT.Player) {
      createPlayer(currentTrack, volume);
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  function createPlayer(track, initialVol) {
    if (!window.YT || !window.YT.Player) return;
    try {
      const targetDiv = document.getElementById('yt-hidden-player');
      if (!targetDiv) return;

      const playerConfig = {
        height: '160',
        width: '240',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            event.target.setVolume(initialVol);
            setPlayerReady(true);
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false);
            }
          },
          onError: (err) => {
            console.warn('YouTube Player error:', err);
          },
        },
      };

      if (track.isPlaylist) {
        playerConfig.playerVars.listType = 'playlist';
        playerConfig.playerVars.list = track.id;
      } else {
        playerConfig.videoId = track.id;
      }

      playerRef.current = new window.YT.Player('yt-hidden-player', playerConfig);
    } catch (err) {
      console.warn('Error creating YT player:', err);
    }
  }

  // Play a specific track and minimize automatically
  const playTrack = useCallback((track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Automatically minimize popup to eliminate reader distraction
    setIsPopupOpen(false);

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        if (track.isPlaylist) {
          playerRef.current.loadPlaylist({ list: track.id, listType: 'playlist' });
        } else {
          playerRef.current.loadVideoById(track.id);
        }
        playerRef.current.playVideo();
      } catch (e) {
        console.warn('Could not load video directly, falling back:', e);
      }
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      }
    } else {
      setIsPlaying(false);
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  // Adjust volume
  const handleVolumeChange = useCallback((newVol) => {
    setVolume(newVol);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(newVol);
    }
  }, []);

  // Custom link parser (video or playlist)
  const playCustomLink = useCallback((url) => {
    if (!url || !url.trim()) return false;
    const trimmed = url.trim();

    // Check for playlist parameter
    const playlistMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    // Check for video id
    const videoMatch = trimmed.match(/(?:youtu\.be\/|v=|\/embed\/|\/watch\?v=)([a-zA-Z0-9_-]{11})/);

    if (playlistMatch && (!videoMatch || trimmed.includes('/playlist'))) {
      const pId = playlistMatch[1];
      playTrack({
        id: pId,
        title: 'Custom YouTube Playlist',
        subtitle: `Playlist: ${pId}`,
        icon: '🎧',
        isPlaylist: true,
      });
      return true;
    } else if (videoMatch) {
      const vId = videoMatch[1];
      playTrack({
        id: vId,
        title: 'Custom YouTube Track',
        subtitle: `Video: ${vId}`,
        icon: '🎵',
        isPlaylist: false,
      });
      return true;
    }
    return false;
  }, [playTrack]);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        setVolume: handleVolumeChange,
        isPopupOpen,
        setIsPopupOpen,
        playTrack,
        togglePlay,
        playCustomLink,
        tracks: STUDY_TRACKS,
      }}
    >
      {children}
      {/* Offscreen persistent container for the YouTube iframe */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          width: '1px',
          height: '1px',
          opacity: 0.01,
          pointerEvents: 'none',
          zIndex: -999,
          overflow: 'hidden',
        }}
      >
        <div id="yt-hidden-player" />
      </div>
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return ctx;
}
