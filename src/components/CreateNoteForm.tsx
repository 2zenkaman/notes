import type { Note, NoteCreateDTO, Tag } from "../types"
import { useForm, type SubmitHandler } from "react-hook-form"

interface Props {
  onSubmit: (note: NoteCreateDTO) => void
}

type CreateNoteFormValues = {
  title: string
  content: string
  hidden: boolean
  tags: string
}

export default function CreateNoteForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateNoteFormValues>({
    mode: "onChange",
  })

  const handleFormSubmit: SubmitHandler<CreateNoteFormValues> = (data) => {
    onSubmit({
      title: data.title.trim(),
      content: data.content.trim(),
      hidden: data.hidden,
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => !!tag),
    })
    reset()
  }

  return (
    <form
      className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm shadow-neutral-950/3 sm:p-7"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-neutral-700"
          htmlFor="note-title"
        >
          Title
        </label>
        <input
          id="note-title"
          type="text"
          placeholder="Title"
          {...register("title", {
            validate: (value) => {
              return value.trim().length > 0 ? true : "This field is required"
            },
          })}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none"
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-neutral-700"
          htmlFor="note-content"
        >
          Content
        </label>
        <textarea
          id="note-content"
          placeholder="Write something..."
          rows={7}
          {...register("content")}
          className="w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-neutral-700"
          htmlFor="note-tags"
        >
          Tags
        </label>
        <input
          id="note-tags"
          type="text"
          placeholder="Work, ideas, personal"
          {...register("tags", {
            validate: (value) => {
              const tags = value
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => !!tag)

              return tags.length > 5 ? "You can only add up to 5 tags" : true
            },
          })}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none"
        />
        {errors.tags && (
          <p className="text-sm text-red-600">{errors.tags.message}</p>
        )}
      </div>
      <div className="flex flex-col-reverse gap-4 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2.5 text-sm text-neutral-600">
          <input
            type="checkbox"
            {...register("hidden")}
            className="size-4 accent-neutral-950"
          />
          Keep this note hidden
        </label>
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          Add Note
        </button>
      </div>
    </form>
  )
}
