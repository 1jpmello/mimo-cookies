import sobreVideo1 from "@/assets/sobre-video-1.mp4";
import sobreVideo2 from "@/assets/sobre-video-2.mp4";
import sobreVideo3 from "@/assets/sobre-video-3.mp4";
import sobreVideo4 from "@/assets/sobre-video-4.mp4";
import sobreVideo5 from "@/assets/sobre-video-5.mp4";
import sobreImage5 from "@/assets/sobre-image-5.jpeg";

const VIDEOS = [sobreVideo1, sobreVideo2, sobreVideo3, sobreVideo4, sobreVideo5];

const AboutGallery = () => (
  <div className="bg-creme">
    <div className="max-w-lg mx-auto px-5 py-10">
      <div className="grid grid-cols-2 gap-3 mimo-reveal">
        {VIDEOS.map((vid, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
            <video src={vid} autoPlay loop muted playsInline className="w-full h-full object-cover aspect-[9/16]" />
          </div>
        ))}
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
          <img src={sobreImage5} alt="Mimô Cookies embalagem" className="w-full h-full object-cover aspect-[9/16]" />
        </div>
      </div>
    </div>
  </div>
);

export default AboutGallery;
