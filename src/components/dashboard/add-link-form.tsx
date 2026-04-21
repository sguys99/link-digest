'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Loader2, ClipboardPaste } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addLinkFormSchema, type AddLinkFormInput } from '@/lib/validators/link'
import { useAddLink } from '@/hooks/use-links'

type AddLinkFormProps = {
  variant?: 'inline' | 'sheet' | 'empty-state'
  onSuccess?: () => void
  autoFocus?: boolean
}

export function AddLinkForm({
  variant = 'inline',
  onSuccess,
  autoFocus = false,
}: AddLinkFormProps) {
  const addLink = useAddLink()
  const [clipboardSupported, setClipboardSupported] = useState(false)

  useEffect(() => {
    setClipboardSupported(
      typeof navigator !== 'undefined' &&
        !!navigator.clipboard &&
        typeof navigator.clipboard.readText === 'function',
    )
  }, [])

  const form = useForm<AddLinkFormInput>({
    resolver: zodResolver(addLinkFormSchema),
    defaultValues: { url: '' },
  })

  function onSubmit(data: AddLinkFormInput) {
    if (addLink.isPending) return
    addLink.mutate(
      { url: data.url },
      {
        onSuccess: () => {
          form.reset()
          onSuccess?.()
        },
      },
    )
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      const trimmed = text.trim()
      if (trimmed) {
        form.setValue('url', trimmed, { shouldValidate: true })
      }
    } catch {
      // 권한 거부 또는 빈 클립보드
    }
  }

  const isInline = variant === 'inline'

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          isInline
            ? 'flex flex-row items-start gap-2'
            : 'flex w-full max-w-sm flex-col gap-3'
        }
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Input
                    type="url"
                    placeholder={
                      isInline ? 'https://...' : '저장할 링크를 입력하세요'
                    }
                    autoFocus={autoFocus}
                    autoComplete="off"
                    className="pr-9"
                    {...field}
                  />
                  {clipboardSupported && !field.value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                      onClick={handlePaste}
                      aria-label="클립보드에서 붙여넣기"
                    >
                      <ClipboardPaste className="size-4" />
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={addLink.isPending}
          className={isInline ? 'rounded-full' : 'w-full'}
        >
          {addLink.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isInline ? (
            <Plus className="size-4" />
          ) : (
            variant === 'sheet' ? '링크 저장' : '추가하기'
          )}
          {isInline && <span className="sr-only">링크 추가</span>}
        </Button>
      </form>
    </Form>
  )
}
