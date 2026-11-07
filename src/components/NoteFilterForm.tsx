import { useState } from "react"
import type { Tag } from "../types"
import TagComponent from "./TagComponent"

interface Props {
  tags: Tag[]
  onFilterChange: (
    filter: string,
    fn: (params: URLSearchParams) => void,
  ) => void
}

export default function NoteFilterForm({ tags, onFilterChange }: Props) {
  const [search, setSearch] = useState("")
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange("search", (params) => {
      const value = e.target.value.trim()
      if (value) {
        params.set("search", e.target.value.trim())
      }
    })
  }

  const [showHidden, setShowHidden] = useState(true)
  const handleShowHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowHidden(e.target.checked)
    onFilterChange("showHidden", (params) => {
      if (!e.target.checked) {
        params.set("showHidden", "false")
      }
    })
  }

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const handleToggleTag = (tag: Tag) => {
    let newTags = selectedTags
    if (selectedTags.find((v) => v === tag.id)) {
      newTags = newTags.filter((v) => v !== tag.id)
    } else {
      newTags.push(tag.id)
    }
    setSelectedTags(newTags)
    onFilterChange("tags", (params) => {
      params.set("tags", newTags.join(","))
    })
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleSearchChange}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none sm:max-w-sm"
        />
        <label className="inline-flex items-center gap-2.5 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={handleShowHiddenChange}
            className="size-4 accent-neutral-950"
          />
          Show hidden notes
        </label>
      </div>
      <div className="flex gap-2 my-4">
        {tags.map((tag) => {
          return (
            <TagComponent
              key={tag.id}
              tag={tag}
              selected={!!selectedTags.find((v) => v === tag.id)}
              onclick={() => handleToggleTag(tag)}
            />
          )
        })}
      </div>
    </div>
  )
}
