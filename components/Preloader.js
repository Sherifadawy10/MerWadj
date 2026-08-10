import Image from "next/image";

export default function Preloader({ svgCode = null }) {
  return (
    <div className="preloader">
      <div className="preloader__background">
        <div className="preloader__panel preloader__panel--top" />
        <div className="preloader__panel preloader__panel--bottom" />
      </div>

      <div className="preloader__inner">
        <div className="preloader__logo-wrap">
          {svgCode ? (
            <div
              className="preloader__logo"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          ) : (
            <Image
              src="/logo.svg"
              alt="Merwadj"
              width={96}
              height={96}
              className="preloader__logo"
            />
          )}
        </div>
      </div>
    </div>
  );
}
