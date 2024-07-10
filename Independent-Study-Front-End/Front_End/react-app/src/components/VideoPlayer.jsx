import React, { useState, useEffect, useRef } from "react";
import "./VideoPlayer.css";

function VideoPlayer() {
  const [movieIds, setMovieIds] = useState([]); // Dynamic movieIds
  const [trailers, setTrailers] = useState({});
  const [trailerData, setTrailerData] = useState({
    selectedTrailerIndex: 0,
  });

  const playerRef = useRef(null); // Using ref to store player instance
  const apiLoadedRef = useRef(false); // Track if YouTube API is loaded

  // Fetch homepage trailers from backend
  useEffect(() => {
    async function fetchHomepageTrailers() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/homepageTrailers"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched homepage trailers:", data);

        const ids = data.map((movie) => movie.id);
        const trailersMap = data.reduce((acc, movie) => {
          acc[movie.id] = movie.trailer;
          return acc;
        }, {});

        setMovieIds(ids);
        setTrailers(trailersMap);
      } catch (error) {
        console.error("Error fetching homepage trailers:", error);
      }
    }

    fetchHomepageTrailers();
  }, []);

  useEffect(() => {
    // Ensure YouTube API is loaded once
    if (!apiLoadedRef.current) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        apiLoadedRef.current = true;
      }

      window.onYouTubeIframeAPIReady = () => {
        apiLoadedRef.current = true;
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    return () => {
      window.onYouTubeIframeAPIReady = null;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [movieIds, trailers]);

  const initializePlayer = () => {
    const { selectedTrailerIndex } = trailerData;
    if (movieIds.length > 0 && apiLoadedRef.current && window.YT && window.YT.Player) {
      const movieId = movieIds[selectedTrailerIndex % movieIds.length];
      const trailer = trailers[movieId] || null;

      if (trailer && !playerRef.current) {
        console.log("Initializing new YouTube Player with video ID:", trailer);
        const player = new window.YT.Player("player", {
          videoId: trailer,
          playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            autoplay: 1,
            loop: 0,
            enablejsapi: 1,
            widget_referrer: window.location.href,
            disablekb: 1,
          },
          events: {
            onReady: onPlayerReady,
          },
        });

        playerRef.current = player;
      } else if (playerRef.current && trailer) {
        console.log(
          "Loading new video in existing player with video ID:",
          trailer
        );
        playerRef.current.loadVideoById(trailer);
      }
    }
  };

  useEffect(() => {
    const player = playerRef.current;
    const { selectedTrailerIndex } = trailerData;
    if (movieIds.length > 0) {
      const movieId = movieIds[selectedTrailerIndex % movieIds.length];
      const trailer = trailers[movieId] || null;

      if (player && trailer && apiLoadedRef.current) {
        console.log("Loading video by ID:", trailer);
        player.loadVideoById(trailer);
      }
    }
  }, [trailerData.selectedTrailerIndex]);

  function onPlayerReady(event) {
    event.target.setPlaybackQuality("hd1080");
  }

  function handlePreviousTrailer() {
    setTrailerData((prevData) => ({
      ...prevData,
      selectedTrailerIndex:
        prevData.selectedTrailerIndex === 0
          ? movieIds.length - 1
          : prevData.selectedTrailerIndex - 1,
    }));
  }

  function handleNextTrailer() {
    setTrailerData((prevData) => ({
      ...prevData,
      selectedTrailerIndex:
        (prevData.selectedTrailerIndex + 1) % movieIds.length,
    }));
  }

  return (
    <div id="player-container" style={{ width: "100%", height: "100%" }}>
      <div id="player"></div>
      <div id="button-container">
        <button id="prev-button" onClick={handlePreviousTrailer}>
          {"<"}
        </button>
        <button id="next-button" onClick={handleNextTrailer}>
          {">"}
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;
