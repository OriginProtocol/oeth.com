interface Seo {
  metaTitle: string | null;
  metaDescription: string | null;
  metaImage: {
    url: string;
    previewUrl: string | null;
    width: number;
    height: number;
    caption: string | null;
  } | null;
  metaRobots: string | null;
  metaViewport: string | null;
  structuredData: Object | null;
  canonicalURL: string | null;
  metaSocial:
    | {
        socialNetwork: string | null;
        title: string | null;
        description: string | null;
      }[]
    | null;
}

const formatSeo = (seoRes: Seo | null) => {
  if (!seoRes) return {};

  const seo = {
    metaTitle: seoRes.metaTitle || null,
    metaDescription: seoRes.metaDescription || null,
    shareImage: seoRes.metaImage || null,
    structuredData: null,
    metaViewport: null,
    canonicalURL: null,
    metaSocial: null,
  };

  if (seoRes.structuredData) {
    seo.structuredData = JSON.stringify(seoRes.structuredData);
  }

  if (seoRes.metaViewport) {
    seo.metaViewport = seoRes.metaViewport;
  }

  if (seoRes.canonicalURL) {
    seo.canonicalURL = seoRes.canonicalURL;
  }

  if (seoRes.metaSocial) {
    const metaSocial = {};
    seoRes.metaSocial.forEach((metaSoc) => {
      metaSocial[metaSoc.socialNetwork.toLowerCase()] = metaSoc;
    });
    seo.metaSocial = metaSocial;
  }

  return seo;
};

export default formatSeo;
