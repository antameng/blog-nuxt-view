<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { MdCatalog, MdPreview } from 'md-editor-v3'
import { getArticleByShortLink } from '../../server/api/article'
import type { ArticleWithContent } from '../../server/types/article'
import 'md-editor-v3/lib/preview.css'
import MyGiscus from '../../components/Giscus/MyGiscus.vue'

interface RouteParams {
  shortLink: string
}

const route = useRoute()
const { shortLink }: RouteParams = route.params as RouteParams

const article = ref<ArticleWithContent>()

const id = 'preview-only'

const color = useColorMode()

function getArticle() {
  if (!shortLink)
    return
  getArticleByShortLink(shortLink).then((res) => {
    article.value = res.data.value?.data as ArticleWithContent
  })
}
getArticle()

const scrollElement = ref<HTMLElement>()

const theme = ref<'dark' | 'light'>(color.preference === 'dark' ? 'dark' : 'light')

watch(toRef(color).value, () => {
  theme.value = color.preference === 'dark' ? 'dark' : 'light'
})

onMounted(() => {
  scrollElement.value = document.documentElement
  if (color.preference === 'system')
    theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
})
</script>

<template>
  <NuxtLayout name="home">
    <div class="flex flex-col text-left">
      <img v-if="article?.cover[0]" :src="article?.cover[0]" alt="cover" class="max-h-[300px] w-full rounded-md object-cover">
      <div class="my-3 text-3xl font-bold" @click="theme = theme === 'dark' ? 'light' : 'dark'">
        {{ article?.title }}
      </div>
      <div class="mb-1">
        {{ article?.description }}
      </div>
      <div>
        Last updated: {{ article?.updatedAt }}
      </div>
      <div class="mt-4 flex flex-row items-center justify-start text-violet">
        <span>{{ article?.views }} views</span>
      </div>
      <UDivider class="my-6" />
    </div>
    <div class="text-left lg:grid lg:grid-cols-[auto,250px] lg:gap-8">
      <MdPreview :editor-id="id" :model-value="article?.content" :theme="theme" :show-code-row-number="true" />
      <div class="catalog relative">
        <MdCatalog :editor-id="id" :scroll-element="scrollElement" class="max-h-[100vh]" />
      </div>
    </div>
    <MyGiscus
      repo="lnbiuc/blog-next-view"
      repo-id="R_kgDOKsLYcQ="
      category="Announcements"
      category-id="DIC_kwDOKsLYcc4CbAW9"
      mapping="pathname"
      term="Welcome to @giscus/vue component!"
      strict="1"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="color.preference"
      lang="en"
      crossorigin="anonymous"
    />
  </NuxtLayout>
</template>

<style>
.md-editor-dark {
  --md-bk-color: transparent !important;
}

.md-editor-preview-wrapper {
  padding: 0 !important;
}

.md-editor-catalog-link span:hover, .md-editor-catalog-active>span {
  color: #A78BFA !important;
}
.catalog {
  position: sticky;
    top: 10px;
    max-height: 100vh;
    overflow: auto;
}
</style>