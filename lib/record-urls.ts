/**
 * Dual Domain (.org and .com) URL Generator for Portal Records
 *
 * Supported Domains:
 * - https://www.eservices-ynbcci.org
 * - https://www.eservices-ynbcci.com
 */

export const DEFAULT_ORG_DOMAIN = "https://www.eservices-ynbcci.org";
export const DEFAULT_COM_DOMAIN = "https://www.eservices-ynbcci.com";

export interface DualDomainUrls {
  orgUrl: string;
  comUrl: string;
  path: string;
}

/**
 * Computes both .org and .com URLs based on the given path.
 * Dynamically swaps .org and .com if the user is browsing on either live domain,
 * or falls back to www.eservices-ynbcci.org / www.eservices-ynbcci.com when running locally.
 */
export function getDualDomainUrls(path: string): DualDomainUrls {
  let orgBase = DEFAULT_ORG_DOMAIN;
  let comBase = DEFAULT_COM_DOMAIN;

  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    const hostname = window.location.hostname;

    if (hostname.includes(".org")) {
      orgBase = origin.replace("site.eservices-ynbcci", "www.eservices-ynbcci");
      comBase = orgBase.replace(/\.org(?=[:/]|$)/i, ".com");
    } else if (hostname.includes(".com")) {
      comBase = origin.replace("site.eservices-ynbcci", "www.eservices-ynbcci");
      orgBase = comBase.replace(/\.com(?=[:/]|$)/i, ".org");
    }
  }

  // Guarantee clean protocol and www host
  orgBase = orgBase.replace("site.eservices-ynbcci", "www.eservices-ynbcci");
  comBase = comBase.replace("site.eservices-ynbcci", "www.eservices-ynbcci");

  return {
    orgUrl: `${orgBase}${path}`,
    comUrl: `${comBase}${path}`,
    path,
  };
}
