export const revalidate = 60

import { notFound, redirect } from 'next/navigation'
import Author from '@/components/BlogPost/Author'
import BlogPost from '@/components/BlogPost/BlogPost'
import { getPostDetails } from '@/services'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import CommentSection from '@/components/commentSection/CommentSection'

// export async function generateStaticParams() {
//   const posts = await getPosts()

//   return posts.map((post) => ({
//     slug: post.slug,
//   }))
// }

type Props = { params: { slug: string } }

export default async function Blog({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/post/${params.slug}`)
  }
  const post = await getPostDetails(params.slug)
  if (!post) return notFound()
  return (
    <div>
      <BlogPost post={post} />
      <Author author={post.author} />
      <CommentSection postId={post.id} />
    </div>
  )
}
