'use client'

import { useSyncExternalStore } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Loader2, ClipboardPaste } from 'lucide-react'
import { toast } from 'sonner'
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
  // 클립보드 지원 여부는 정적 브라우저 능력 — SSR에선 false, 마운트 후 실제 값으로 (하이드레이션 안전)
  const clipboardSupported = useSyncExternalStore(
    () => () => {},
    () =>
      typeof navigator !== 'undefined' &&
      !!navigator.clipboard &&
      typeof navigator.clipboard.readText === 'function',
    () => false,
  )

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

  // 클립보드를 못 읽는 경우(권한 거부, iOS 확인 취소, 빈 값) 입력창에 포커스를
  // 주고 직접 길게 눌러 붙여넣도록 유도한다. 모바일은 native paste가 항상 동작한다.
  function fallbackToManualPaste() {
    form.setFocus('url')
    toast('입력창을 길게 눌러 붙여넣어 주세요')
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      const trimmed = text.trim()
      if (trimmed) {
        form.setValue('url', trimmed, { shouldValidate: true })
        return
      }
      fallbackToManualPaste() // 빈 클립보드
    } catch {
      fallbackToManualPaste() // 권한 거부 / iOS 확인 취소 / 읽기 실패
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
                    inputMode="url"
                    placeholder={
                      isInline ? 'https://...' : '저장할 링크를 입력하세요'
                    }
                    autoFocus={autoFocus}
                    autoComplete="off"
                    // inline은 pill search-input(44px), 그 외는 기본 8px 입력. paste 버튼 자리 확보
                    className={
                      isInline ? 'h-11 rounded-full pl-5 pr-11' : 'pr-9'
                    }
                    {...field}
                  />
                  {clipboardSupported && !field.value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className={`absolute top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground ${isInline ? 'right-2.5' : 'right-1.5'}`}
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
          // inline은 입력(44px)과 정렬되는 잉크 원형 버튼, 그 외는 full-width 잉크 pill
          className={isInline ? 'size-11 shrink-0' : 'w-full'}
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
