interface CardArtProps {
  image: string
  alt: string
  imgClassName?: string
  emojiClassName?: string
}

export default function CardArt({
  image,
  alt,
  imgClassName = 'h-56 w-40 rounded-2xl object-cover shadow-xl',
  emojiClassName = 'text-8xl',
}: CardArtProps) {
  if (image.startsWith('http')) {
    return <img src={image} alt={alt} className={imgClassName} />
  }
  return <span className={emojiClassName}>{image}</span>
}
