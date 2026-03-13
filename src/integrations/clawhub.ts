/**
 * ClawHub Integration
 * Handles automatic FID setup or mock FID generation for local testing
 * if a user hasn't connected their Farcaster account yet.
 */

export function getAutoFid(context: any): string {
  // If the context provides a real FID from the Farcaster Mini App SDK, use it
  if (context?.user?.fid) {
    return context.user.fid.toString();
  }

  // Fallback / Auto-generated mock FID for anonymous users
  // In a real production scenario, ClawHub could trigger a seamless login flow here.
  return "anon_" + Math.floor(Math.random() * 1000000).toString();
}

export function getUserProfile(context: any) {
  return {
    fid: getAutoFid(context),
    username: context?.user?.username || "anon_cat",
    displayName: context?.user?.displayName || "Anonymous Cat",
    pfpUrl: context?.user?.pfpUrl || null,
  };
}
