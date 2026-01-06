import axios from "axios";

const API_URL = process.env.WORDPRESS_API_URL;
const isWordpressConfigured = () => typeof API_URL === "string" && API_URL.length > 0;

async function fetchAPI(query = "", { variables } = {}) {
  // WordPress is optional in this app (see next.config.js enforceWordpress flag).
  // If it's not configured, return null so callers can fall back safely.
  if (!isWordpressConfigured()) {
    return null;
  }

  const headers = { "Content-Type": "application/json" };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  // WPGraphQL Plugin must be enabled
  const res = await fetch(API_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getAllPostsForHome(preview) {
  if (!isWordpressConfigured()) return { edges: [] };
  const data = await fetchAPI(
    `query AllPosts {
      posts(first: 200, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
            categories {
              edges {
                node {
                  categoryId
                  name
                  posts {
                    edges {
                      node {
                        title
                        excerpt
                        slug
                        date
                        featuredImage {
                          node {
                            sourceUrl
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data?.posts ?? { edges: [] };
}
export async function getAllPostsForNewData(preview) {
  if (!isWordpressConfigured()) return { edges: [] };
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
            categories {
              edges {
                node {
                  categoryId
                  name
                  posts {
                    edges {
                      node {
                        title
                        excerpt
                        slug
                        date
                        featuredImage {
                          node {
                            sourceUrl
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data?.posts ?? { edges: [] };
}

export async function getAllCategory(preview) {
  if (!isWordpressConfigured()) return { edges: [] };
  const data = await fetchAPI(
    `query AllCategoris {
      categories (where: {parent: 0}) {
        edges {
          node {
            categoryId
            name
            slug
            children {
              edges {
                node {
                  categoryId
                  name
                  slug
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data?.categories ?? { edges: [] };
}

export async function getPostAndMorePosts(slug, preview, previewData) {
  if (!isWordpressConfigured()) {
    return { post: null, posts: { edges: [] } };
  }
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview.id
    : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === "draft";
  const isRevision = isSamePost && postPreview?.status === "publish";
  const data = await fetchAPI(
    `fragment AuthorFields on User {
      name
      firstName
      lastName
      description
      avatar {
        url
      }
      seo {
        social {
          linkedIn
        }
      }
    }
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
      categories {
        edges {
          node {
            name
          }
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        seo {
          metaDesc
          metaKeywords
          title
        }
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ""
        }
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }`,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "SLUG",
      },
    }
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop();

  return data;
}

export async function getAllPostsWithSlug() {
  if (!isWordpressConfigured()) return { edges: [] };
  const data = await fetchAPI(`
    {
      posts(first: 200) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts ?? { edges: [] };
}

export async function getPreviewPost(id, idType = "DATABASE_ID") {
  if (!isWordpressConfigured()) return null;
  const data = await fetchAPI(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    }
  );
  return data.post;
}

export async function getAllPostsWithCategorySlug() {
  if (!isWordpressConfigured()) return { edges: [] };
  const data = await fetchAPI(`
    {
      categories {
        edges {
          node {
            categoryId
            slug
          }
        }
      }
    }
  `);
  return data?.categories ?? { edges: [] };
}

export async function getAllPostsForCategory(preview, categorySlug) {
  if (!isWordpressConfigured()) return { edges: [] };
  const getSlug = await fetchAPI(
    `query GetSlug {
        category(id: "${categorySlug}", idType: SLUG) {
          categoryId
      }
    }`
  );

  const categoryId = getSlug?.category?.categoryId;

  if (categoryId) {
    const data = await fetchAPI(
      `query AllPosts {
      posts(where: {categoryId: ${getSlug.category.categoryId}, orderby: {field: DATE, order: DESC}}) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
            categories {
              edges {
                node {
                  categoryId
                  name
                  posts {
                    edges {
                      node {
                        title
                        excerpt
                        slug
                        date
                        featuredImage {
                          node {
                            sourceUrl
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
      {
        variables: {
          onlyEnabled: !preview,
          preview,
        },
      }
    );

    return data?.posts ?? { edges: [] };
  }

  return { edges: [] };
}

export async function reCaptchaVerification(token) {
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/verify-recaptcha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
      body: JSON.stringify({ token }),
    });

    return await res.json();
  }catch(err){
    return { success: false, message: err.message };
  }
}

export async function sendOTP(user) {
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/send-otp-toEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
      body: JSON.stringify({ user }),
    });
    
    return await res.json();
  }catch(e){
    return { success: false, message: e?.message ?? "Failed to send OTP" };
  }

}

export async function verifyOTP(otp, otpToken) {
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
      body: JSON.stringify({ otp, otpToken }),
    });
    
    return await res.json();
  }catch(err){
    return { success: false, message: err?.message ?? "Failed to verify OTP" };
  }
}
