const VideoIframe = ({ src }: { src: string }) => {
  return (
    <iframe
      src={src}
      allowFullScreen={true}
      className="absolute top-0 left-0 w-full h-full"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    />
  );
};

export default VideoIframe;