<script>
import Giscus from '@giscus/vue'
</script>

<template>
  <Giscus
    repo="heggria/heggria.site"
    repo-id="R_kgDOMu9i4g"
    category="Announcements"
    category-id="DIC_kwDOMu9i4s4Cikd8"
    mapping="pathname"
    strict="1"
    reactions-enabled="1"
    emit-metadata="0"
    input-position="top"
    :theme="isDark ? 'light' : 'dark'"
    lang="zh-CN"
    loading="lazy"
    crossorigin="anonymous"
  />
</template>
