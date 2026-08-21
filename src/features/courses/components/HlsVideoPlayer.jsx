import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import Icon from "../../../components/icons/Icon";
import { formatHlsUrl } from "../utils/videoUtils";
import styles from "./CoursePreviewModal.module.css";

const MAX_HLS_NETWORK_RECOVERY_ATTEMPTS = 2;
const MAX_HLS_MEDIA_RECOVERY_ATTEMPTS = 1;
const HLS_NETWORK_RECOVERY_DELAY_MS = 750;

const HlsVideoPlayer = ({ lesson, poster }) => {
  const plyrRef = useRef(null);
  const hlsRef = useRef(null);
  const finalVideoUrl = formatHlsUrl(lesson?.videoUrl);
  const isHls = finalVideoUrl.includes(".m3u8");
  const usesHlsJs = isHls && Hls.isSupported();

  const [qualityOptions, setQualityOptions] = useState([0]);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playbackState, setPlaybackState] = useState("loading");
  const [retryToken, setRetryToken] = useState(0);

  const retryVideo = () => {
    setQualityOptions([0]);
    setIsPlayerReady(false);
    setPlaybackState("loading");
    setRetryToken((value) => value + 1);
  };

  useEffect(() => {
    if (!finalVideoUrl) return undefined;

    let isMounted = true;

    if (!usesHlsJs) {
      Promise.resolve().then(() => {
        if (isMounted) setIsPlayerReady(true);
      });

      return () => {
        isMounted = false;
      };
    }

    const hls = new Hls({
      maxBufferLength: 20,
      maxMaxBufferLength: 60,
      backBufferLength: 30,
    });
    hlsRef.current = hls;
    let networkRecoveryAttempts = 0;
    let mediaRecoveryAttempts = 0;
    let recoveryTimeoutId = null;

    const handleManifestParsed = () => {
      if (!isMounted) return;
      networkRecoveryAttempts = 0;

      const availableQualities = [
        ...new Set(
          hls.levels
            .map((level) => level.height)
            .filter((height) => Number.isFinite(height) && height > 0),
        ),
      ].sort((first, second) => second - first);

      setQualityOptions([0, ...availableQualities]);
      setIsPlayerReady(true);
    };

    const handleHlsError = (_event, data) => {
      if (!data.fatal || !isMounted) return;

      if (
        data.type === Hls.ErrorTypes.NETWORK_ERROR &&
        networkRecoveryAttempts < MAX_HLS_NETWORK_RECOVERY_ATTEMPTS
      ) {
        networkRecoveryAttempts += 1;
        setPlaybackState("loading");

        if (recoveryTimeoutId !== null) {
          window.clearTimeout(recoveryTimeoutId);
        }

        recoveryTimeoutId = window.setTimeout(() => {
          recoveryTimeoutId = null;
          if (isMounted) hls.startLoad();
        }, HLS_NETWORK_RECOVERY_DELAY_MS * networkRecoveryAttempts);
        return;
      }

      if (
        data.type === Hls.ErrorTypes.MEDIA_ERROR &&
        mediaRecoveryAttempts < MAX_HLS_MEDIA_RECOVERY_ATTEMPTS
      ) {
        mediaRecoveryAttempts += 1;
        setPlaybackState("loading");
        hls.recoverMediaError();
        return;
      }

      setPlaybackState("error");
      hls.stopLoad();
    };

    const handleFragmentBuffered = () => {
      if (recoveryTimeoutId !== null) {
        window.clearTimeout(recoveryTimeoutId);
        recoveryTimeoutId = null;
      }

      networkRecoveryAttempts = 0;
      mediaRecoveryAttempts = 0;
    };

    hls.on(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
    hls.on(Hls.Events.ERROR, handleHlsError);
    hls.on(Hls.Events.FRAG_BUFFERED, handleFragmentBuffered);
    hls.loadSource(finalVideoUrl);

    return () => {
      isMounted = false;

      if (recoveryTimeoutId !== null) {
        window.clearTimeout(recoveryTimeoutId);
      }

      hls.off(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
      hls.off(Hls.Events.ERROR, handleHlsError);
      hls.off(Hls.Events.FRAG_BUFFERED, handleFragmentBuffered);
      hls.destroy();

      if (hlsRef.current === hls) hlsRef.current = null;
    };
  }, [finalVideoUrl, retryToken, usesHlsJs]);

  useEffect(() => {
    if (!isPlayerReady || !finalVideoUrl) return undefined;

    let animationFrameId = null;
    let video = null;
    const playbackHls = usesHlsJs ? hlsRef.current : null;
    let isDisposed = false;

    const handleReady = () => setPlaybackState("ready");
    const handlePlaybackError = () => setPlaybackState("error");

    const initializePlayback = () => {
      if (isDisposed) return;

      video = plyrRef.current?.plyr?.media;

      if (!video) {
        animationFrameId = window.requestAnimationFrame(initializePlayback);
        return;
      }

      video.addEventListener("canplay", handleReady);
      video.addEventListener("loadeddata", handleReady);
      video.addEventListener("playing", handleReady);
      video.addEventListener("error", handlePlaybackError);

      if (poster) video.poster = poster;

      if (playbackHls) {
        playbackHls.on(Hls.Events.FRAG_BUFFERED, handleReady);
        playbackHls.attachMedia(video);
      } else {
        video.src = finalVideoUrl;
        video.load();
      }

      if (video.readyState >= 2) handleReady();
    };

    initializePlayback();

    return () => {
      isDisposed = true;

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (video) {
        video.removeEventListener("canplay", handleReady);
        video.removeEventListener("loadeddata", handleReady);
        video.removeEventListener("playing", handleReady);
        video.removeEventListener("error", handlePlaybackError);
      }

      if (playbackHls && hlsRef.current === playbackHls) {
        playbackHls.off(Hls.Events.FRAG_BUFFERED, handleReady);
        if (playbackHls.media === video) playbackHls.detachMedia();
      } else if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [
    finalVideoUrl,
    isPlayerReady,
    poster,
    qualityOptions,
    retryToken,
    usesHlsJs,
  ]);

  const plyrOptions = useMemo(
    () => ({
      controls: [
        "rewind",
        "play",
        "fast-forward",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["quality", "speed"],
      quality: {
        default: 0,
        options: qualityOptions,
        forced: true,
        onChange: (newQuality) => {
          if (!hlsRef.current) return;

          if (newQuality === 0) {
            hlsRef.current.currentLevel = -1;
            return;
          }

          hlsRef.current.levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
              hlsRef.current.currentLevel = levelIndex;
            }
          });
        },
      },
      i18n: {
        qualityLabel: { 0: "Auto" },
      },
      seekTime: 10,
      speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      },
    }),
    [qualityOptions],
  );

  return (
    <div className={styles.videoPlayerContainer}>
      {isPlayerReady && (
        <Plyr
          ref={plyrRef}
          source={null}
          options={plyrOptions}
          preload="metadata"
          playsInline
        />
      )}

      {playbackState === "error" && (
        <div className={styles.videoErrorState} role="alert">
          <Icon name="alert" size={28} />
          <strong>Video failed to load</strong>
          <span>The HLS stream is unavailable or could not be played.</span>
          <button type="button" onClick={retryVideo}>
            Try again
          </button>
        </div>
      )}

      {playbackState !== "error" &&
        (playbackState === "loading" || !isPlayerReady) && (
          <div
            className={styles.videoLoadingOverlay}
            role="status"
            aria-live="polite"
          >
            <span className={styles.videoSpinner} aria-hidden="true" />
            Loading video...
          </div>
        )}
    </div>
  );
};

export default HlsVideoPlayer;
