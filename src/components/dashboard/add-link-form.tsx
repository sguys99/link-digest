'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Loader2 } from 'lucide-react'
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

  const form = useForm<AddLinkFormInput>({
    resolver: zodResolver(addLinkFormSchema),
    defaultValues: { url: '' },
  })

  function onSubmit(data: AddLinkFormInput) {
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
                <Input
                  type="url"
                  placeholder={
                    isInline ? 'https://...' : '저장할 링크를 입력하세요'
                  }
                  autoFocus={autoFocus}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={addLink.isPending}
          className={isInline ? '' : 'w-full'}
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
