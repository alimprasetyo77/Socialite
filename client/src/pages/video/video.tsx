const Video = () => {
  return (
    <div className="w-full p-4 flex items-center justify-center gap-10">
      <input type="file" className="p-3 border" />
      <video controls>
        <source type="video/mp4" />
      </video>
    </div>
  );
};

export default Video;
