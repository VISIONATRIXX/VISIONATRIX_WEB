import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);
    const response = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      let html = await response.text();
      const baseUrl = parsed.href;

      // Inject <base href="..."> right after <head> so all relative CSS/JS/images resolve cleanly
      const baseTag = `<base href="${baseUrl}">`;
      if (html.includes("<head>")) {
        html = html.replace("<head>", `<head>${baseTag}`);
      } else if (html.includes("<HEAD>")) {
        html = html.replace("<HEAD>", `<HEAD>${baseTag}`);
      } else {
        html = `${baseTag}${html}`;
      }

      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const body = await response.arrayBuffer();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy fetch error for URL:", targetUrl, error);
    return new NextResponse(
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Live Preview</title>
    <style>
      body {
        background-color: #08080c;
        color: #f8fafc;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        text-align: center;
      }
      .card {
        background: #111118;
        border: 1px solid rgba(197, 168, 128, 0.25);
        padding: 40px 30px;
        border-radius: 20px;
        max-width: 420px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      }
      h3 {
        color: #c5a880;
        font-size: 20px;
        letter-spacing: 0.1em;
        margin-top: 0;
      }
      p {
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.6;
        margin: 15px 0 25px;
      }
      a {
        display: inline-block;
        background: linear-gradient(135deg, #c5a880 0%, #e2cbb0 100%);
        color: #0b0b0f;
        font-weight: 700;
        font-size: 13px;
        letter-spacing: 0.15em;
        padding: 12px 26px;
        border-radius: 8px;
        text-decoration: none;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      a:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(197, 168, 128, 0.4);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h3>LIVE PORTAL PREVIEW</h3>
      <p>This application enforces strict direct security headers. Open the live deployment directly in a new browser tab.</p>
      <a href="${targetUrl}" target="_blank" rel="noopener noreferrer">LAUNCH LIVE SITE ↗</a>
    </div>
  </body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
