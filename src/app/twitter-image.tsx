// Twitter card image — reuses the OG component. Next requires these exports
// to live directly in this file (not re-exported) so it can statically analyze them.
import OG from "./opengraph-image";

export const runtime = "edge";
export const alt = "Repliqo — Instagram DM automation, done right.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OG;
