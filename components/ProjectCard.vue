<script setup lang="ts">
import type { IArticle } from '~/server/types'

const props = defineProps({
  article: {
    type: Object as PropType<IArticle>,
    required: true,
  },
})

function openNewTab(url: string | undefined) {
  if (!url)
    return
  window.open(url, '_blank')
}
</script>

<template>
  <div
    class="card project-card-bg-filter backdrop-blur-sm my-open-tab flex flex-col overflow-hidden justify-between card-border"
    @click="openNewTab(props.article.link)">
    <div class="p-4 text-left">
      <div class="text-2xl font-bold font-serif">
        {{ props.article.title }}
      </div>
      <div class="mt-2 dark:text-gray-400 text-gray-800">
        {{ props.article.description }}
      </div>
      <div>
        <UBadge v-for="s in article.tags" :key="s" color="gray" variant="solid" class="my-2 mr-2">
          {{ s }}
        </UBadge>
      </div>
    </div>
    <div class="px-4 pb-4 relative">
      <img :src="`${props.article.cover}/comporess1600x900`" alt="cover" class="object-cover aspect-[16/9] rounded-md w-full">
    </div>
  </div>
</template>
