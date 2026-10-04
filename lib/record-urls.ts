/**
 * Dual Domain (.org and .com) URL Generator for Portal Records
 *
 * Configured Domains:
 * - .ORG Domain: https://www.eservices-ynbcci.org
 * - .COM Domain: https://eservices-ynbcci-org-sa.com
 */

export const DEFAULT_ORG_DOMAIN = "https://www.eservices-ynbcci.org";
export const DEFAULT_COM_DOMAIN = "https://eservices-ynbcci-org-sa.com";

export interface DualDomainUrls {
  orgUrl: string;
  comUrl: string;
  dotUrl: string;
  path: string;
}

/**
 * Computes .org, .com, and /. URLs based on the given path.
 * - .ORG URL: https://www.eservices-ynbcci.org/...
 * - .COM URL: https://eservices-ynbcci-org-sa.com/...
 * - /. URL:   https://eservices-ynbcci-org-sa.com/.../.
 */
export function getDualDomainUrls(path: string): DualDomainUrls {
  const orgBase = DEFAULT_ORG_DOMAIN;
  const comBase = DEFAULT_COM_DOMAIN;

  // Dot path: identical to path, but ends with "/."
  const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const dotPath = `${cleanPath}/.`;

  return {
    orgUrl: `${orgBase}${path}`,
    comUrl: `${comBase}${path}`,
    dotUrl: `${comBase}${dotPath}`,
    path,
  };
}
