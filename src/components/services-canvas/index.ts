import { CanvasRenderContext } from "./types";
import { renderWebDevAnimation } from "./WebDevAnimation";
import { renderAiAutomationAnimation } from "./AiAutomationAnimation";
import { renderVideoEditingAnimation } from "./VideoEditingAnimation";
import { renderBrandShootAnimation } from "./BrandShootAnimation";
import { renderLogoDesignAnimation } from "./LogoDesignAnimation";
import { renderUnrealEngineAnimation } from "./UnrealEngineAnimation";
import { renderArchitectHomeAnimation } from "./ArchitectHomeAnimation";
import { render3DRenderAnimation } from "./Render3DAnimation";
import { renderInteractiveArchAnimation } from "./InteractiveArchAnimation";
import { renderXrSolutionsAnimation } from "./XrSolutionsAnimation";

export * from "./types";

export function renderServicesCanvasAnimation(params: CanvasRenderContext & { type: string }) {
  const { ctx, type, width, height } = params;

  // Clear canvas per frame (except AI which has custom trail fade)
  if (type === "ai") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  switch (type) {
    case "webdev":
    case "app":
    case "webgl":
      renderWebDevAnimation(params);
      break;
    case "ai":
      renderAiAutomationAnimation(params);
      break;
    case "video":
      renderVideoEditingAnimation(params);
      break;
    case "brand":
      renderBrandShootAnimation(params);
      break;
    case "logo":
    case "cgi":
      renderLogoDesignAnimation(params);
      break;
    case "unreal":
    case "env":
      renderUnrealEngineAnimation(params);
      break;
    case "architect":
      renderArchitectHomeAnimation(params);
      break;
    case "render3d":
      render3DRenderAnimation(params);
      break;
    case "interactive_arch":
      renderInteractiveArchAnimation(params);
      break;
    case "xr":
      renderXrSolutionsAnimation(params);
      break;
    default:
      renderWebDevAnimation(params);
      break;
  }
}
