import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PoliTrip | VIP Tourism & Luxury Travel in Türkiye";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #02122d 0%, #0a2a5e 50%, #02122d 100%)",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Gold accent line top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#c9a84c", display: "flex" }} />

        {/* Subtle grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)",
          display: "flex",
        }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "60px" }}>
          <div style={{ fontSize: "14px", letterSpacing: "6px", color: "#c9a84c", textTransform: "uppercase", display: "flex" }}>
            Premium Turizm
          </div>
          <div style={{ fontSize: "96px", fontWeight: "bold", color: "#ffffff", letterSpacing: "12px", textTransform: "uppercase", display: "flex" }}>
            POLITRIP
          </div>
          <div style={{ width: "80px", height: "2px", background: "#c9a84c", display: "flex" }} />
          <div style={{ fontSize: "22px", color: "#a0b4cc", textAlign: "center", maxWidth: "700px", lineHeight: 1.5, display: "flex" }}>
            VIP Tourism & Luxury Travel in Türkiye
          </div>
          <div style={{ fontSize: "16px", color: "#c9a84c", marginTop: "8px", letterSpacing: "2px", display: "flex" }}>
            politrip.com.tr
          </div>
        </div>

        {/* Gold accent line bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "#c9a84c", display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}
