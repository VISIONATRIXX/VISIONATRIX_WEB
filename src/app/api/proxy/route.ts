import { NextResponse } from "next/server";

function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase();

  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return true;
  }

  // IPv4 regex pattern check
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (a === 127) return true; // 127.0.0.0/8 Loopback
    if (a === 10) return true;  // 10.0.0.0/8 Private
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 Link-local / Cloud Metadata
    if (a === 192 && b === 168) return true; // 192.168.0.0/16 Private
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 Private
    if (a === 0) return true;
  }

  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);

    // Enforce HTTPS protocol
    if (parsed.protocol !== "https:") {
      return new NextResponse("Forbidden: Only HTTPS URLs are permitted", { status: 400 });
    }

    // SSRF Check: Block private IPs, loopback, and internal metadata hosts
    if (isPrivateHost(parsed.hostname)) {
      return new NextResponse("Forbidden: Access to internal or private addresses is blocked", { status: 403 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

    const response = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      let html = await response.text();
      const baseUrl = parsed.href;

      // Inject <base href="..."> right after <head> so relative CSS/JS/images resolve cleanly
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
        },
      });
    }

    const body = await response.arrayBuffer();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error: any) {
    console.error("Proxy fetch error for URL:", targetUrl, error?.message);
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
