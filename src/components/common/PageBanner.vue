<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  desc?: string
}>()
</script>

<template>
  <section class="page-banner">
    <div class="banner-pattern" aria-hidden="true"></div>

    <div class="banner-inner">
      <p v-if="eyebrow" class="banner-eyebrow">
        <span class="eyebrow-line"></span>{{ eyebrow }}
      </p>
      <h1 class="banner-title">{{ title }}</h1>
      <p v-if="desc" class="banner-desc">{{ desc }}</p>
      <div class="banner-extra">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page-banner {
  position: relative;
  padding: 62px 0 54px;
  overflow: hidden;
  background: linear-gradient(120deg, #0b2530 0%, #123c4b 52%, #17505f 100%);
}

.banner-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background-image: radial-gradient(rgba(216, 184, 120, 0.16) 1px, transparent 1px),
    radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 32px 32px, 92px 92px;
  background-position: 0 0, 18px 22px;

  &::after {
    content: '';
    position: absolute;
    right: -80px;
    bottom: -160px;
    width: 460px;
    height: 460px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(216, 184, 120, 0.16), transparent 66%);
  }
}

.banner-inner {
  @include page-container;

  position: relative;
  animation: fade-up 0.6s ease both;
}

.banner-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  letter-spacing: 0.22em;
  color: var(--c-gold-light);
}

.eyebrow-line {
  width: 26px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--c-gold-light), rgba(216, 184, 120, 0));
}

.banner-title {
  margin-top: 12px;
  font-family: var(--font-serif);
  font-size: 38px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #f7f3ea;
}

.banner-desc {
  max-width: 760px;
  margin-top: 14px;
  font-size: 14px;
  line-height: 1.95;
  color: rgba(243, 239, 230, 0.66);
}

.banner-extra:not(:empty) {
  margin-top: 26px;
}

@include respond-to('md') {
  .page-banner {
    padding: 48px 0 40px;
  }

  .banner-title {
    font-size: 30px;
    letter-spacing: 0.12em;
  }
}

@include respond-to('xs') {
  .page-banner {
    padding: 40px 0 34px;
  }

  .banner-title {
    font-size: 25px;
    letter-spacing: 0.08em;
  }

  .banner-desc {
    font-size: 13px;
  }
}
</style>
