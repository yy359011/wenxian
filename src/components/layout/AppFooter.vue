<script setup lang="ts">
const contacts = [
  { label: '咨询服务', value: '0576-8888 8888' },
  { label: '征集专线', value: '0576-8888 6688' },
  { label: '联系邮箱', value: 'archive@taizhou-lib.cn' },
  { label: '开放时间', value: '周二至周日 09:00 - 17:00' }
]
</script>

<template>
  <footer class="site-footer">
    <div class="footer-body">
      <div class="footer-inner">
        <div class="brand-col">
          <div class="brand">
            <span class="brand-mark">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <!-- 展开的文献：左右双页 + 书脊 -->
                <path
                  d="M6.6 10.6 L22.4 14.6 V24.8 L6.6 20.8 Z"
                  fill="currentColor"
                  fill-opacity="0.16"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linejoin="round"
                />
                <path
                  d="M41.4 10.6 L25.6 14.6 V24.8 L41.4 20.8 Z"
                  fill="currentColor"
                  fill-opacity="0.16"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 14.4 V24.9"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  opacity="0.85"
                />
                <!-- 运河水纹：两道同频波浪，示意浙江水系干流 -->
                <path
                  d="M4 31.5 q5 -3.2 10 0 t10 0 t10 0 t10 0"
                  fill="none"
                  stroke="#7fc4d4"
                  stroke-width="2.6"
                  stroke-linecap="round"
                />
                <path
                  d="M4 37.5 q5 -3.2 10 0 t10 0 t10 0 t10 0"
                  fill="none"
                  stroke="#7fc4d4"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  opacity="0.55"
                />
              </svg>
            </span>
            <div>
              <p class="brand-title">浙江图书馆</p>
              <p class="brand-sub">浙江水系（大运河沿线）运河文献发布平台</p>
            </div>
          </div>
          <p class="brand-desc">
            以「山海文化」为主线，汇聚台州九县市区地方文献、影像档案与口述记忆，
            构建可检索、可关联、可再生的城市文旅记忆资源库。
          </p>
          <p class="brand-slogan">山有所载 · 海有所藏 · 文献有记</p>
        </div>

        <div class="contact-col">
          <h4>读者服务</h4>
          <dl>
            <div v-for="item in contacts" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          主办：台州市文化和广电旅游体育局 &nbsp;|&nbsp; 承建：台州市图书馆 &nbsp;|&nbsp;
          协建：台州九县（市、区）公共图书馆
        </p>
        <p>© 2026 台州图书馆</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  position: relative;
  margin-top: 80px;
  color: rgba(243, 239, 230, 0.78);
  background: linear-gradient(168deg, #123a49 0%, #0e2f3d 58%, #0a242f 100%);
}

.footer-body {
  @include page-container;

  padding-top: 88px;
  padding-bottom: 28px;
}

.footer-inner {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 48px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  color: var(--c-gold-light);
  border: 1px solid rgba(216, 184, 120, 0.42);

  svg {
    width: 30px;
    height: 30px;
  }
}

.brand-title {
  font-family: var(--font-serif);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--c-text-invert);
}

.brand-sub {
  font-size: 12px;
  letter-spacing: 0.08em;
  color: rgba(243, 239, 230, 0.55);
}

.brand-desc {
  max-width: 420px;
  margin-top: 20px;
  font-size: 13px;
  line-height: 2;
}

.brand-slogan {
  margin-top: 16px;
  font-family: var(--font-serif);
  font-size: 14px;
  letter-spacing: 0.18em;
  color: var(--c-gold-light);
}

.contact-col {
  h4 {
    position: relative;
    margin-bottom: 22px;
    padding-left: 12px;
    font-family: var(--font-serif);
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--c-text-invert);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 3px;
      height: 15px;
      border-radius: 2px;
      background: var(--c-gold);
      transform: translateY(-50%);
    }
  }

  dl > div {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 13px;
  }

  dt {
    flex-shrink: 0;
    color: rgba(243, 239, 230, 0.5);
  }

  dd {
    margin: 0;
    color: rgba(243, 239, 230, 0.86);
  }
}

.footer-bottom {
  margin-top: 54px;
  padding-top: 22px;
  border-top: 1px solid rgba(243, 239, 230, 0.14);
  font-size: 12px;
  line-height: 2;
  text-align: center;
  color: rgba(243, 239, 230, 0.5);
}

// ---------- 响应式 ----------
@include respond-to('lg') {
  .footer-inner {
    gap: 36px;
  }
}

@include respond-to('sm') {
  .footer-body {
    padding-top: 72px;
  }

  .footer-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@include respond-to('xs') {
  .site-footer {
    margin-top: 56px;
  }
}
</style>
