import {
  categories,
  postDetailsResult,
  postsResult,
  recentPosts,
} from '@/utils/types'
import { request, gql } from 'graphql-request'
import { cache } from 'react'

const graphqlAPI: string = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT!

export const getPosts = cache(async () => {
  const query = gql`
    query GetPosts {
      posts {
        author {
          bio
          id
          name
          photo {
            url
          }
        }
        createdAt
        slug
        title
        summary
        featuredImage {
          url
        }
        categories {
          name
          slug
        }
      }
    }
  `
  try {
    const result: postsResult = await request(graphqlAPI, query)
    return result.posts
  } catch (err) {
    console.log('ERROR Extracting Posts ----> ' + err)
  }
  return []
})

export const getRecentPosts = cache(async () => {
  const query = gql`
    query GetPostDetails() {
      posts(orderBy: createdAt_DESC, first: 3){
        title
        featuredImage{
          url
        }
        createdAt
        slug
      }
    }
  `

  try {
    const result: recentPosts = await request(graphqlAPI, query)
    return result.posts
  } catch (err) {
    console.log('ERROR Extracting Recent Posts ----> ' + err)
  }
  return []
})

export const getSimilarPosts = cache(
  async (categories: string[], slug: string) => {
    const query = gql`
      query GetPostDetails($slug: String!, $categories: [String!]) {
        posts(
          where: {
            slug_not: $slug
            AND: { categories_some: { slug_in: $categories } }
          }
          first: 3
        ) {
          title
          featuredImage {
            url
          }
          createdAt
          slug
        }
      }
    `

    try {
      const result: recentPosts = await request(graphqlAPI, query, {
        categories,
        slug,
      })
      return result.posts
    } catch (err) {
      console.log('ERROR Extracting Similar Posts ----> ' + err)
    }
    return []
  }
)

export const getCategories = cache(async () => {
  const query = gql`
    query GetCategories() {
      categories {
        name
        slug
        shortName
      }
    }
  `

  try {
    const result: categories = await request(graphqlAPI, query)
    return result.categories
  } catch (err) {
    console.log('ERROR Extracting Categories ----> ' + err)
  }
  return []
})

export const getPostDetails = cache(async (slug: string) => {
  const query = gql`
    query GetPostDetails($slug: String!) {
      post(where: { slug: $slug }) {
        author {
          bio
          id
          name
          photo {
            url
          }
        }
        createdAt
        slug
        title
        summary
        featuredImage {
          url
        }
        categories {
          name
          slug
        }
        content
      }
    }
  `

  try {
    const result: postDetailsResult = await request(graphqlAPI, query, {
      slug,
    })
    return result?.post
  } catch (err) {
    console.log('ERROR Extracting Post Details ----> ' + err)
  }
})
