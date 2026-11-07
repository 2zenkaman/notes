import type { Tag } from "../types"

interface Props {
  tag: Tag
  selected?: boolean
  onclick?: (tagID: string) => void
}

export default function TagComponent({ tag, selected, onclick }: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm select-none cursor-pointer transition delay-100 border duration-300
        ${selected ? "text-white bg-gray-900" : "text-black bg-white"}`}
      onClick={onclick ? () => onclick(tag.id) : () => {}}
    >
      {tag.name}
    </span>
  )
}
