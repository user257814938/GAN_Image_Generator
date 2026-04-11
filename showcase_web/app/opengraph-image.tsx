import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = "classicGAN par Osso Website";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, rgba(124,243,200,0.28), transparent 28%), radial-gradient(circle at bottom right, rgba(65,123,255,0.22), transparent 30%), linear-gradient(160deg, #0b1020 0%, #0f172d 45%, #060913 100%)",
          color: "#f3f6ff",
          padding: "56px 64px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 24,
              border: "2px solid rgba(124,243,200,0.38)",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.28)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "999px",
                border: "10px solid #7cf3c8",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: 24,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#7cf3c8",
              }}
            >
              Osso Website
            </span>
            <span
              style={{
                fontSize: 54,
                fontWeight: 700,
                lineHeight: 1.05,
                maxWidth: 760,
              }}
            >
              classicGAN
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.02,
              maxWidth: 960,
            }}
          >
            Démonstrateur de génération d&apos;images
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#c8d3ef",
              maxWidth: 920,
              lineHeight: 1.3,
            }}
          >
            Explorez des images synthétiques produites par un GAN entraîné pour illustrer le potentiel visuel de l&apos;IA générative.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
