<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  desc?: string
}>()
</script>

<template>
  <header class="section-heading">
    <div class="heading-main">
      <p v-if="eyebrow" class="heading-eyebrow">
        <span class="eyebrow-line"></span>{{ eyebrow }}
      </p>
      <h2 class="heading-title">
        {{ title }}
        <span v-if="desc" class="heading-desc">{{ desc }}</span>
      </h2>
    </div>
    <div class="heading-extra">
      <slot name="extra" />
    </div>
  </header>
</template>

<style scoped lang="scss">
.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}

.heading-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  letter-spacing: 0.2em;
  color: var(--c-gold);
}

.eyebrow-line {
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--c-gold), rgba(194, 160, 95, 0));
}

.heading-title {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-top: 8px;
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--c-primary-deep);
}

.heading-desc {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--c-text-3);
}

.heading-extra {
  flex-shrink: 0;
}

@include respond-to('md') {
  .heading-title {
    font-size: 23px;
  }

  .section-heading {
    align-items: flex-start;
  }
}

@include respond-to('xs') {
  .section-heading {
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }

  .heading-title {
    font-size: 20px;
    letter-spacing: 0.06em;
  }

  .heading-desc {
    font-size: 12px;
  }
}
</style>
