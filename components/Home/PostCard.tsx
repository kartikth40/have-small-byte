import { postsType } from '@/utils/types/types'
import styles from '../../app/page.module.scss'
import moment from 'moment'
import Link from 'next/link'
import Image from 'next/image'
import { myPortfolioURL } from '@/services'

type Props = { post: postsType }

async function PostCard({ post }: Props) {
  const {
    postCard,
    postImage,
    title,
    summary,
    authorName,
    authorInfo,
    authorInfoContainer,
    authorImage,
    date,
    icon,
  } = styles
  const authorId: string = (await myPortfolioURL(post.author.id)) || '/'
  return (
    <div className={postCard}>
      <Link href={`/post/${post.slug}`}>
        <div className={postImage}>
          <Image
            src={post.featuredImage.url}
            style={{ objectFit: 'cover', borderRadius: '.5rem' }}
            fill={true}
            alt={post.title}
          />
        </div>
      </Link>

      <h1>
        <Link href={`/post/${post.slug}`} className={title}>
          {post.title}
        </Link>
      </h1>
      <div className={summary}>{post.summary}</div>
      <div className={authorInfoContainer}>
        <div className={date}>
          <div className={icon}>
            <Image
              src="https://img.icons8.com/fluency-systems-regular/48/calendar--v1.png"
              width={48}
              height={48}
              alt="calendar--v1"
            />
          </div>
          <p>{moment(post.createdAt).format('MMM DD, YYYY')}</p>
        </div>
        <Link
          href={authorId}
          className={authorInfo}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className={authorImage}>
            <Image
              src={post.author.photo.url}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
              sizes="(max-width: 768px) 40px, (max-width: 1200px) 50px, 40px"
              fill={true}
              alt={post.author.name}
            />
          </div>
          <p className={authorName}>{post.author.name}</p>
        </Link>
      </div>
    </div>
  )
}

export default PostCard
