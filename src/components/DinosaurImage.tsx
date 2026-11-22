import type { ComponentPropsWithoutRef } from 'react'

type DinosaurImageProps = Omit<ComponentPropsWithoutRef<'img'>, 'src'> & {
  src: string
}

export function DinosaurImage({ src, onError, ...props }: DinosaurImageProps) {
  const optimizedSource = src.endsWith('.png') ? src.replace('.png', '-960.webp') : src

  return <img {...props} src={optimizedSource} onError={(event) => {
    if (event.currentTarget.getAttribute('src') === optimizedSource && optimizedSource !== src) {
      event.currentTarget.src = src
      return
    }
    onError?.(event)
  }} />
}
