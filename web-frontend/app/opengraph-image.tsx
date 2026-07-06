import { ImageResponse } from "next/og";

export const alt = "UAI QUARTOS — moradia universitária perto da faculdade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #185a49 0%, #23765d 55%, #2f8f72 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "80px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <svg
            fill="none"
            height="88"
            viewBox="0 0 64 64"
            width="88"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect fill="#ffffff" height="64" rx="14" width="64" />
            <path d="M32 12 L54 31 H47 V50 H17 V31 H10 Z" fill="#23765d" />
            <rect fill="#ffffff" height="15" rx="2" width="11" x="26.5" y="35" />
          </svg>
          <div style={{ display: "flex", fontSize: "56px", fontWeight: 700 }}>
            UAI QUARTOS
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "68px",
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          Moradia universitária perto da faculdade
        </div>
        <div
          style={{
            color: "#d9efe6",
            display: "flex",
            fontSize: "32px",
            marginTop: "28px",
            maxWidth: "860px",
          }}
        >
          Repúblicas e quartos com preço claro, dono verificado e reviews reais.
        </div>
      </div>
    ),
    size,
  );
}
