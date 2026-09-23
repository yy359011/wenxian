<script setup lang="ts">
import { computed } from 'vue'
import type { BookDocument, BookLeafPage } from '@/types'

const props = defineProps<{
  page: BookLeafPage
  book: BookDocument
}>()

const emit = defineEmits<{ (e: 'jump', pageNo: number): void }>()

/** 正文段落 */
const paragraphs = computed(() => props.page.paragraphs ?? [])

/** 版权页的键值行 */
const colophonRows = computed(() =>
  paragraphs.value.map((line) => {
    const index = line.indexOf('：')
    return index > 0
      ? { label: line.slice(0, index), value: line.slice(index + 1) }
      : { label: '', value: line }
  })
)
</script>

<template>
  <div class="book-leaf" :class="`is-${page.kind}`">
    <!-- 封面 -->
    <template v-if="page.kind === 'cover'">
      <img class="leaf-cover__img" :src="page.plate" :alt="book.title" />
      <div class="leaf-cover__veil"></div>
      <div class="leaf-cover__label">
        <span>{{ book.type }}</span>
      </div>
      <div class="leaf-cover__title">
        <h3>{{ book.title }}</h3>
        <p>{{ book.author }}</p>
      </div>
    </template>

    <!-- 题名页 -->
    <template v-else-if="page.kind === 'title'">
      <div class="leaf-title">
        <div class="leaf-title__frame">
          <h3>{{ book.title }}</h3>
          <span class="leaf-title__rule"></span>
          <p v-for="line in paragraphs" :key="line">{{ line }}</p>
          <p class="leaf-title__unit">{{ book.region }} · {{ book.era }}</p>
        </div>
      </div>
    </template>

    <!-- 目录页 -->
    <template v-else-if="page.kind === 'catalog'">
      <h4 class="leaf-heading">{{ page.heading }}</h4>
      <ul class="leaf-catalog">
        <li v-for="chapter in book.catalog" :key="chapter.title" class="leaf-catalog__chapter">
          <button type="button" class="leaf-catalog__row is-chapter" @click="emit('jump', chapter.page)">
            <span class="leaf-catalog__text">{{ chapter.title }}</span>
            <span class="leaf-catalog__dots"></span>
            <span class="leaf-catalog__no">{{ chapter.page }}</span>
          </button>
          <ul v-if="chapter.children?.length">
            <li v-for="section in chapter.children ?? []" :key="section.title">
              <button type="button" class="leaf-catalog__row" @click="emit('jump', section.page)">
                <span class="leaf-catalog__text">{{ section.title }}</span>
                <span class="leaf-catalog__dots"></span>
                <span class="leaf-catalog__no">{{ section.page }}</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </template>

    <!-- 图版页 -->
    <template v-else-if="page.kind === 'plate'">
      <h4 class="leaf-heading">{{ page.heading }}</h4>
      <figure class="leaf-plate">
        <img :src="page.plate" :alt="page.caption" />
        <figcaption>{{ page.caption }}</figcaption>
      </figure>
    </template>

    <!-- 版权与著录页 -->
    <template v-else-if="page.kind === 'copyright'">
      <h4 class="leaf-heading">{{ page.heading }}</h4>
      <dl class="leaf-colophon">
        <div v-for="row in colophonRows" :key="row.value">
          <dt v-if="row.label">{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
        </div>
      </dl>
    </template>

    <!-- 正文页 -->
    <template v-else>
      <h4 class="leaf-heading">{{ page.heading }}</h4>
      <div class="leaf-text">
        <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
      </div>
    </template>

    <span v-if="page.kind !== 'cover' && page.kind !== 'title'" class="leaf-no">{{ page.pageNo }}</span>
  </div>
</template>

<style scoped lang="scss">
.book-leaf {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 42px 44px 54px;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 12%, rgba(194, 160, 95, 0.09), transparent 46%),
    linear-gradient(180deg, #fbf8f1, #f4efe3);
  color: var(--c-text);

  &.is-cover,
  &.is-title {
    padding: 0;
  }

  &.is-title {
    background: linear-gradient(180deg, #f8f4ea, #efe8da);
  }
}

.leaf-heading {
  flex-shrink: 0;
  margin-bottom: 22px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(194, 160, 95, 0.45);
  font-family: var(--font-serif);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-align: center;
  color: var(--c-primary-deep);
}

/* 封面 */
.leaf-cover__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.leaf-cover__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(11, 37, 48, 0.16) 30%, rgba(11, 37, 48, 0.78));
}

.leaf-cover__label {
  position: relative;
  align-self: flex-end;
  margin: 22px;
  padding: 14px 10px;
  border: 1px solid rgba(243, 239, 230, 0.75);
  font-family: var(--font-serif);
  font-size: 14px;
  letter-spacing: 0.3em;
  writing-mode: vertical-rl;
  color: #f7f3ea;
}

.leaf-cover__title {
  position: relative;
  margin-top: auto;
  padding: 0 30px 34px;
  color: #f7f3ea;

  h3 {
    font-family: var(--font-serif);
    font-size: 24px;
    font-weight: 700;
    line-height: 1.5;
    letter-spacing: 0.08em;
    text-shadow: 0 2px 12px rgba(11, 37, 48, 0.6);
  }

  p {
    margin-top: 10px;
    font-size: 13px;
    letter-spacing: 0.1em;
    opacity: 0.86;
  }
}

/* 题名页 */
.leaf-title {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 56px 46px;

  &__frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 46px 26px;
    border: 1px solid rgba(29, 91, 110, 0.35);
    outline: 1px solid rgba(194, 160, 95, 0.5);
    outline-offset: 5px;
    text-align: center;
  }

  h3 {
    font-family: var(--font-serif);
    font-size: 30px;
    font-weight: 700;
    line-height: 1.5;
    letter-spacing: 0.1em;
    color: var(--c-primary-deep);
  }

  &__rule {
    width: 56px;
    height: 1px;
    background: var(--c-gold);
  }

  p {
    font-size: 13px;
    letter-spacing: 0.08em;
    color: var(--c-text-2);
  }

  &__unit {
    padding-top: 6px;
    font-family: var(--font-serif);
    color: var(--c-primary) !important;
  }
}

/* 目录 */
.leaf-catalog {
  flex: 1;
  overflow: auto;

  &__chapter + &__chapter {
    margin-top: 10px;
  }

  &__row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    width: 100%;
    padding: 7px 0;
    border: 0;
    background: none;
    font-family: var(--font-serif);
    font-size: 15px;
    letter-spacing: 0.06em;
    text-align: left;
    color: var(--c-text);
    cursor: pointer;

    &:hover {
      color: var(--c-primary);
    }

    &.is-chapter {
      font-weight: 600;
      color: var(--c-primary-deep);
    }
  }

  ul &__row {
    padding-left: 20px;
    font-size: 13.5px;
    color: var(--c-text-2);
  }

  &__text {
    flex-shrink: 0;
  }

  &__dots {
    flex: 1;
    height: 0;
    border-bottom: 1px dotted rgba(141, 154, 161, 0.75);
    transform: translateY(-3px);
  }

  &__no {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--c-text-3);
  }
}

/* 图版 */
.leaf-plate {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 0;

  img {
    width: 100%;
    flex: 1;
    min-height: 0;
    object-fit: cover;
    border: 1px solid rgba(194, 160, 95, 0.5);
    padding: 6px;
    background: #fffdf8;
  }

  figcaption {
    font-family: var(--font-serif);
    font-size: 12.5px;
    letter-spacing: 0.12em;
    color: var(--c-text-3);
  }
}

/* 正文 */
.leaf-text {
  flex: 1;
  min-height: 0;
  overflow: hidden;

  p {
    font-family: var(--font-serif);
    font-size: 14.5px;
    line-height: 2.15;
    text-align: justify;
    text-indent: 2em;
    color: #2f3d44;

    + p {
      margin-top: 12px;
    }
  }
}

/* 版权与著录 */
.leaf-colophon {
  flex: 1;
  min-height: 0;
  overflow: hidden;

  > div {
    display: flex;
    gap: 12px;
    padding: 10px 2px;
    border-bottom: 1px dashed rgba(211, 201, 183, 0.9);
    font-size: 13px;
    line-height: 1.8;
  }

  dt {
    flex-shrink: 0;
    width: 76px;
    color: var(--c-text-3);
  }

  dd {
    margin: 0;
    color: var(--c-text);
  }
}

.leaf-no {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 22px;
  font-family: var(--font-serif);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-align: center;
  color: var(--c-text-3);
}

@include respond-to('xs') {
  .book-leaf {
    padding: 28px 22px 40px;
  }

  .leaf-heading {
    margin-bottom: 14px;
    font-size: 16px;
  }

  .leaf-text p {
    font-size: 12.5px;
    line-height: 1.95;
  }

  .leaf-title h3 {
    font-size: 22px;
  }

  .leaf-cover__title h3 {
    font-size: 18px;
  }
}
</style>
