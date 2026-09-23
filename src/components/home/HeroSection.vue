<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { hotKeywords } from '@/data/news'
import heroBg from '@/images/map.png'

const router = useRouter()

const keyword = ref('')

function submit(value?: string) {
  const text = (value ?? keyword.value).trim()
  router.push({
    name: 'search',
    query: text ? { keyword: text } : {}
  })
}
</script>

<template>
  <section class="hero">
    <div class="hero__bg" :style="{ backgroundImage: `url(${heroBg})` }" aria-hidden="true"></div>
    <div class="hero__veil" aria-hidden="true"></div>

    <div class="hero__inner">
      <div class="hero__search">
        <p class="hero__desc">
          以「山海文化」为主线，汇聚台州九县市区地方文献、影像档案与口述记忆，构建可检索、可关联、可再生的城市文旅记忆资源库。
        </p>

        <div class="search-bar">
          <el-input
            v-model="keyword"
            class="search-input"
            placeholder="输入关键词，如「台州府志」「大陈岛」「黄岩蜜橘」"
            clearable
            @keyup.enter="submit()"
          />
          <button class="search-submit" @click="submit()">
            <el-icon><Search /></el-icon>
            <span>全文检索</span>
          </button>
        </div>

        <div class="hero__hot">
          <span class="hot-label">热门检索</span>
          <button
            v-for="item in hotKeywords"
            :key="item"
            class="hot-item"
            @click="
              () => {
                keyword = item
                submit(item)
              }
            "
          >
            {{ item }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  height: 750px;
  padding-bottom: 104px;
  overflow: hidden;
  background: #0b2530;
}

.hero__bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  // 背景图原始比例 2.56:1，按 Hero 高 750px 换算，整图展示宽度为 1920px
  // 图层宽度不小于视口，平移范围内始终填满，不会露边
  width: max(100%, 1920px);
  background-size: cover;
  background-position: center 40%;
  animation: hero-pan 20s ease-in-out infinite alternate;
}

// 由图片左边缘平移至右边缘，完整展示整张背景图后原路返回
@keyframes hero-pan {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(100vw - 100%));
  }
}

.hero__veil {
  position: absolute;
  inset: 0;
  // 左深右浅：左侧压暗突出检索区，右侧保留背景细节
  background: linear-gradient(
      100deg,
      rgba(6, 22, 30, 0.88) 0%,
      rgba(8, 30, 40, 0.72) 30%,
      rgba(10, 38, 50, 0.32) 62%,
      rgba(10, 38, 50, 0.04) 100%
    ),
    linear-gradient(180deg, rgba(11, 37, 48, 0.3) 0%, rgba(11, 37, 48, 0.04) 40%, rgba(11, 37, 48, 0.22) 100%);
}

.hero__inner {
  @include page-container;

  position: relative;
  display: flex;
  justify-content: flex-start;
}

// ---------- 检索框 ----------
.hero__search {
  width: 100%;
  max-width: 640px;
}

.hero__desc {
  margin-bottom: 22px;
  font-family: var(--font-serif);
  font-size: 17px;
  line-height: 2;
  letter-spacing: 0.08em;
  color: rgba(255, 252, 245, 0.92);
  text-shadow: 0 2px 10px rgba(6, 22, 30, 0.75);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0;
  height: 62px;
  padding: 6px 6px 6px 22px;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(22px) saturate(1.35);
  box-shadow: 0 28px 54px -28px rgba(0, 0, 0, 0.78);
}

.search-input {
  flex: 1;

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    background: transparent;

    .el-input__inner {
      font-size: 15px;
    }
  }
}

.search-submit {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  height: 50px;
  padding: 0 26px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #fdf6e6;
  background: linear-gradient(135deg, #2a7186 0%, #17505f 100%);
  transition: transform 0.24s ease, box-shadow 0.24s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 26px -14px rgba(23, 80, 95, 0.9);
  }
}

.hero__hot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-left: 6px;
}

.hot-label {
  font-size: 13px;
  letter-spacing: 0.1em;
  color: rgba(243, 239, 230, 0.78);
  text-shadow: 0 1px 3px rgba(11, 37, 48, 0.65);
}

.hot-item {
  padding: 3px 12px;
  border-radius: 14px;
  font-size: 13px;
  color: rgba(255, 252, 245, 0.95);
  text-shadow: 0 1px 3px rgba(11, 37, 48, 0.65);
  background: rgba(11, 37, 48, 0.16);
  border: 1px solid rgba(243, 239, 230, 0.34);
  backdrop-filter: blur(10px);
  transition: all 0.24s ease;

  &:hover {
    color: #0e2f3d;
    background: rgba(216, 184, 120, 0.9);
    border-color: transparent;
    text-shadow: none;
  }
}

// ---------- 响应式 ----------
@include respond-to('lg') {
  .hero__search {
    max-width: 100%;
  }
}

@include respond-to('md') {
  .hero {
    padding-bottom: 72px;
  }

  .hero__desc {
    margin-bottom: 18px;
    font-size: 15px;
    line-height: 1.9;
  }

  .search-bar {
    height: 56px;
  }

  .search-submit {
    height: 44px;
    padding: 0 18px;

    span {
      display: none;
    }
  }
}

@include respond-to('xs') {
  .hero {
    padding-bottom: 52px;
  }

  .hero__desc {
    margin-bottom: 14px;
    font-size: 14px;
    letter-spacing: 0.04em;
  }

  .search-bar {
    height: auto;
    padding: 8px 8px 8px 16px;
    border-radius: 18px;
    gap: 8px;
  }

  .search-submit {
    margin-left: auto;
  }

  .hero__hot {
    padding-left: 0;
  }
}
</style>
