export default function VideoBackground() {
  return (
    <div className="video-background-container" aria-hidden="true">
      <video autoPlay muted loop playsInline className="video-background">
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}